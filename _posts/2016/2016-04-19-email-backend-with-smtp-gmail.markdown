---
layout: post
title:  "Email BackEnd with SMTP Gmail"
date:   2016-04-19 02:28:15 +0700
categories: [python, django]
---
Add this configurations in your `settings.py`

This configurations is if you work with `smtp.gmail.com`, other smtp is similiar with configurations.

* Unlock Captha: [https://accounts.google.com/DisplayUnlockCaptcha](https://accounts.google.com/DisplayUnlockCaptcha)
* Change to active: [https://www.google.com/settings/security/lesssecureapps](https://www.google.com/settings/security/lesssecureapps)

```
EMAIL_HOST          = 'smtp.gmail.com'
EMAIL_PORT          = 587
EMAIL_HOST_USER     = 'your_gmail@gmail.com'
EMAIL_HOST_PASSWORD = 'your_password'
EMAIL_USE_TLS       = True
DEFAULT_FROM_EMAIL  = EMAIL_HOST_USER
EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
```