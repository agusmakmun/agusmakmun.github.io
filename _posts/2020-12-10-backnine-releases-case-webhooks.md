---
layout: post
title:  "BackNine Releases Case Webhooks"
date:   2020-12-10 14:00:00 +0700
categories: [Reid_Tattersall, Webhooks]
---
Subscribing to our webhooks allows you to integrate Case and Quote & Apply application data with your systems. We'll send a `POST` request to your desired endpoint everytime a Case or Quote & Apply application is saved. View example response data and more within our [API docs](https://docs.back9ins.com/#webhooks).

We've been supporting Quote & Apply webhooks since early 2020 and we excited to add support for cases.

#### Example Use Cases
- Acme Insurance Agency wants to track their Quote & Apply applications so their call center can call prospects when the prospect provides their contact information. Using the webhook, Acme receives the Quote & Apply application data and stores it in their database. Once they receive the data with an insured’s phone and email, a call center agent is notified and calls the prospect.

- A CRM uses BackNine’s webhooks to display up to date Case and Quote & Apply data within their CRM for their users.

- John Doe Insurance Services wants their Quote & Apply prospects to be added to their email marketing campaigns. They connect this hook to their email marketing program so the prospect receives emails from John Doe Insurance Services.

#### Get started
We support two methods to retrieve your Case and Quote & Apply application data.
- On the integrations page in BOSS, paste in your desired endpoint for us to `POST` data to. This option is completely free for unlimited amount of data transfers.

- You can receive Case and Quote & Apply application data through Zapier. Zapier has over 2,000 integrations to make it easier for you to take Case and Quote & Apply application data and integrate it with other Zapier integrations. [Click here]((https://zapier.com/apps/backnine-insurance/integrations)) to get started with Zapier. Using Zapier requires a Zapier account and you may be subject to Zapier fees based on your usage.

#### Supported webhooks
Cases:
- receive the latest case and related data everytime your case is saved.

Quote & Apply:
- receive the latest Quote & Apply and related data everytime your Quote & Apply application is saved.
- receive the latest Quote & Apply and related data when an insured's contact information is added. This webhook will only trigger once per Quote & Apply application.

#### In closing
Agencies and software companies looking to grow their life insurance production can do so by making the process simpler. These webhooks can create a better user experience and provide you with your data so you can take your marketing to the next level.