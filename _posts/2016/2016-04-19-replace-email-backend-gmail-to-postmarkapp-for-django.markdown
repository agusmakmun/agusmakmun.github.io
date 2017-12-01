---
layout: post
title:  "Replace backend gmail to Postmarkapp for Django"
date:   2016-04-19 20:15:33 +0700
categories: [django]
---

#### 1. Install module of Python Postmark

Install this module manually from souce inside your environtment: [https://github.com/themartorana/python-postmark](https://github.com/themartorana/python-postmark)

> If you work on `Django==1.9.*`, requirements only `mock`.

#### 2. Register and Put the Server Keys

Register and put your server API token here: https://account.postmarkapp.com/servers/101010/credentials . `101010` is id of your server.

> Makesure verified your SPF and DKIM. this configurations to allowing the permission from your domain for signature.

#### 3. Configure in `settings.py`

{% highlight ruby %}
EMAIL_USE_TLS        = True
EMAIL_HOST           = 'smtp.postmarkapp.com'
EMAIL_PORT           = 587
POSTMARK_API_KEY     = 'yourkey-yourkey-yourkey-yourkey'
POSTMARK_SENDER      = 'your_company_email@domain.com'
EMAIL_HOST_USER      = POSTMARK_SENDER
DEFAULT_FROM_EMAIL   = POSTMARK_SENDER
POSTMARK_TEST_MODE   = False
POSTMARK_TRACK_OPENS = False
EMAIL_BACKEND        = 'postmark.django_backend.EmailBackend'
{% endhighlight %}