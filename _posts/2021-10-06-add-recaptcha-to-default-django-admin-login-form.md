---
layout: post
title:  "Add reCAPTCHA to default Django admin login form"
date:   2021-10-06 20:41:00 +0700
categories: [python, django, security]
---

Previously makesure you already install the [`django-recaptcha`](https://pypi.org/project/django-recaptcha/),
don't miss also to [Sign up for reCAPTCHA](https://www.google.com/recaptcha/about/)

```
pip install django-recaptcha
```

Add `'captcha'` to your `INSTALLED_APPS` setting.

```python
INSTALLED_APPS = [
    ...,
    'captcha',
    ...
]
```

Add the Google reCAPTCHA keys generated into your Django settings with `RECAPTCHA_PUBLIC_KEY` and `RECAPTCHA_PRIVATE_KEY`.

```python
RECAPTCHA_PUBLIC_KEY = 'MyRecaptchaKey123'
RECAPTCHA_PRIVATE_KEY = 'MyRecaptchaPrivateKey456'
```

Then modify the default authentication form with add new captcha field, in your `myapp/forms.py`:

```python
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm

from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV2Checkbox


class AuthAdminForm(AuthenticationForm):

    if not settings.DEBUG:
        captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox(
            attrs={
                'data-theme': 'light',
                'data-size': 'normal',
                # 'style': ('transform:scale(1.057);-webkit-transform:scale(1.057);'
                #           'transform-origin:0 0;-webkit-transform-origin:0 0;')
            }
        ))
```

Then in your `myproject/urls.py`;


```python
from django.contrib import admin
from django.urls import include, path

from myapp.forms import AuthAdminForm

# modify the default admin login form
# with add reCAPTCHA feature to fix bruteforce issue.
admin.autodiscover()
admin.site.login_form = AuthAdminForm
admin.site.login_template = 'account/admin/login.html'

urlpatterns = [
    path('admin/', admin.site.urls),
    ...
]
```

Also don't miss to add the captcha field into template `templates/account/admin/login.html`;

<iframe width="100%" height="400" src="//jsfiddle.net/agaust/ja21bugn/2/embedded/html/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
