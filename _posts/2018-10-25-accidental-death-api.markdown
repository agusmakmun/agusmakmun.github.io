---
layout: post
title:  "Accidental Death API :money_with_wings:"
date:   2018-10-25 14:00:00 +0700
categories: [Reid_Tattersall]
---
### Introduction
One small step for [BOSS](https://app.back9ins.com), one giant leap for the life insurance industry :full_moon_with_face:. The [accidental death API endpoint](https://docs.back9ins.com) allows you to sell life insurance to your users using just an API (previously agents had to utilize our [Quote & Apply](https://www.inslock.com) front end by embedding a [Quote & Apply](https://www.inslock.com) script within their website). Simply send us a request and we'll return back a DocuSign envelope ID :envelope: which has the state specific filled application for guaranteed and instant issue accidental death life insurance :money_with_wings:.

### The API
You can view our documentation which shows a sample request and response within our [API docs](https://docs.back9ins.com).

### Use Case - Life Insurance Industry
La Vida Loca Life Insurance Agency sells instant issue life insurance policies direct to consumers. For the 30% of their users who are not instantly approved, La Vida Loca offers  accidental death coverage. If the user wants the accidental death coverage, La Vida Loca takes the user's existing information, sends a request to the [accidental death API endpoint](https://docs.back9ins.com), receives a DocuSign envelope ID, and presents the DocuSign to the user via [embedded signing](https://developers.docusign.com/esign-rest-api/guides/features/embedding). If the user doesn't eSign the application right away, DocuSign starts emailing the user daily until the envelope expires 21 days later. The policy is then mailed to the policy owner's home address.

### Use Case - Property and Casualty Insurance Industry
Autonomous Auto Insurance Agency sells auto insurance direct to consumers. During their checkout process, they ask the user if they'd like to add up to $500,000 of instant and guaranteed issue accidental death coverage. If the user wants the accidental death coverage, Autonomous Auto asks the user their beneficiary information, sends a request to the [accidental death API endpoint](https://docs.back9ins.com), receives a DocuSign envelope ID, and presents the DocuSign to the user via [embedded signing](https://developers.docusign.com/esign-rest-api/guides/features/embedding). If the user doesn't eSign the application right away, DocuSign starts emailing the user daily until the envelope expires 21 days later. The policy is then mailed to the policy owner's home address.

### About the Product
- Issue Ages: 18-70
- Maturity Age: 80
- States: All except New York
- Carrier: Mutual of Omaha
- Face Amount: $50,000 - $500,000
- Application must include payment information
- Insured must be US citizens or have a green card
- Insured must be the policy owner
- Commission: 65%

### Let's do this:exclamation:
- Create or login to your [BOSS](https://app.back9ins.com) account.
- Create or choose an approved domain which are located within [API docs](https://docs.back9ins.com) > Quote & Apply > https://app.back9ins.com/#/electronic_applications/setup > click the :gear: icon > copy your API key and approved domain ID (you'll need it to send a request).

### Any:question:'s
Call us at (800) 790-1951 or email engineering[at]back9ins[dot]com

Reid :v:
