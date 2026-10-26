---
layout: post
title:  "Stripe subscription billing pitfalls: proration, downgrades, stale invoices and duplicate subscriptions"
date:   2026-08-14 20:00:00 +0700
categories: [stripe, billing, nodejs]
---

Billing bugs are the worst kind of bugs: customers notice them before you do, and they notice them on their bank statement.
Here are a handful of Stripe subscription pitfalls that are easy to hit in a SaaS product. Each one is small on its own, so here they are together.

### 1. Be explicit about `proration_date` on upgrades

A typical upgrade looks like this:

```ts
await stripe.subscriptions.update(sub.id, {
  items: [{ id: item.id, price: newPriceId }],
  proration_behavior: "always_invoice",
});
```

A symptom to watch for: customers billed close to the **full** monthly difference even when they upgrade a few days before renewal.
Pinning the proration moment to "now" makes the invoice match the expectation (remaining days only):

```ts
await stripe.subscriptions.update(sub.id, {
  items: [{ id: item.id, price: newPriceId }],
  proration_behavior: "always_invoice",
  proration_date: Math.floor(Date.now() / 1000),
});
```

Whatever Stripe's default is, being explicit makes the intent auditable, and you can preview the exact same amount with
the upcoming-invoice API (passing the same proration date) before charging.

### 2. Downgrades: no credit, and wait until the period ends

A common business rule: a downgrade should not refund unused time, and the customer keeps the bigger plan until the paid period ends.
`proration_behavior: "none"` handles the credit; a **subscription schedule** handles the "later":

```ts
const isDowngrade = newPrice.unit_amount! < currentItem.price.unit_amount!;

if (isDowngrade) {
  const schedule = sub.schedule
    ? await stripe.subscriptionSchedules.retrieve(sub.schedule as string)
    : await stripe.subscriptionSchedules.create({ from_subscription: sub.id });

  await stripe.subscriptionSchedules.update(schedule.id, {
    phases: [
      {
        items: [{ price: currentItem.price.id, quantity: 1 }],
        start_date: schedule.phases[0].start_date,
        end_date: currentItem.current_period_end, // item-level in newer API versions
      },
      { items: [{ price: newPrice.id, quantity: 1 }] },
    ],
    end_behavior: "release",
  });
}
```

Two gotchas:

- Reuse an existing schedule instead of creating a new one every time the user clicks.
- In newer API versions, `current_period_end` lives on the **subscription item**, not the subscription.

And the customer portal: enabling *"wait until end of billing period"* (`schedule_at_period_end`) on the portal configuration
turns out to be incompatible with the `subscription_update_confirm` deep-link flow: Stripe silently falls back to the generic
portal page. So the portal only gets `proration_behavior: "none"`, and deferral is handled by your own API.

### 3. Void stale open invoices before changing plans

This one can cause a double charge. Sequence:

1. Renewal invoice fails and stays `open`. Smart Retries will try again in a few days.
2. Support moves the customer to a different plan.
3. Smart Retries collects the **old** failed invoice anyway. The customer pays twice.

The fix: before any plan change, void open invoices for that subscription.

```ts
const open = await stripe.invoices.list({ subscription: sub.id, status: "open", limit: 10 });
for (const inv of open.data) {
  await stripe.invoices.voidInvoice(inv.id);
}
```

Plan changes made directly in the Stripe Dashboard bypass your API, so do the same in the `customer.subscription.updated`
webhook, only when `previous_attributes.items` is present (the price changed) and only for `billing_reason === "subscription_cycle"`
invoices, leaving proration invoices alone. That block is wrapped in `try/catch`; it must never fail the webhook.

Also log `invoice.payment_failed` to your audit log. Otherwise failed renewals stay invisible until someone complains.

### 4. Kill duplicate subscriptions at the webhook, not the UI

A checkout-level guard ("you already have a plan") is not enough; a customer can still end up with two active subscriptions.
UI guards can't catch double-clicks racing each other, subscriptions created in the Dashboard, or any other out-of-band path.

The webhook sees **every** creation path, so the guard moved there:

```ts
case "customer.subscription.created": {
  const created = event.data.object;
  const others = await stripe.subscriptions.list({ customer: created.customer as string, status: "active" });
  const duplicate = others.data.find(
    (s) => s.id !== created.id && !s.cancel_at_period_end && isOwnPlan(s),
  );
  if (duplicate) {
    await stripe.subscriptions.cancel(created.id);
    await audit("duplicate_subscription_canceled", { kept: duplicate.id, canceled: created.id });
    break;
  }
  // ...normal processing
}
```

Excluding `cancel_at_period_end` subscriptions keeps the legitimate "cancel, then re-subscribe to another plan" flow working.

### Takeaways

- Write down the billing rules (upgrade, downgrade, add-on, failed payment) as a table first, then test each row.
- Be explicit with Stripe parameters (`proration_date`, `limit`); don't rely on defaults you haven't verified.
- Anything that must always hold belongs in the webhook, because the Dashboard and retries don't go through your API.
- Log failed payments. You want to know before Smart Retries does something surprising.
