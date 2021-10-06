---
layout: post
title:  "Add reCAPTCHA to default Django admin login form"
date:   2021-10-06 20:41:00 +0700
categories: [python, django, security]
---

Previously makesure you already install the [`django-recaptcha`](https://pypi.org/project/django-recaptcha/),

```
pip install django-recaptcha
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

```html
{% extends "admin/base_site.html" %}
{% load i18n static %}

{% block extrastyle %}{{ block.super }}<link rel="stylesheet" type="text/css" href="{% static "admin/css/login.css" %}">
{{ form.media }}
{% endblock %}

{% block bodyclass %}{{ block.super }} login{% endblock %}

{% block usertools %}{% endblock %}

{% block nav-global %}{% endblock %}

{% block nav-sidebar %}{% endblock %}

{% block content_title %}{% endblock %}

{% block breadcrumbs %}{% endblock %}

{% block content %}
{% if form.errors and not form.non_field_errors %}
<p class="errornote">
{% if form.errors.items|length == 1 %}{% translate "Please correct the error below." %}{% else %}{% translate "Please correct the errors below." %}{% endif %}
</p>
{% endif %}

{% if form.non_field_errors %}
{% for error in form.non_field_errors %}
<p class="errornote">
    {{ error }}
</p>
{% endfor %}
{% endif %}

<div id="content-main">

{% if user.is_authenticated %}
<p class="errornote">
{% blocktranslate trimmed %}
    You are authenticated as {{ username }}, but are not authorized to
    access this page. Would you like to login to a different account?
{% endblocktranslate %}
</p>
{% endif %}

<form action="{{ app_path }}" method="post" id="login-form">{% csrf_token %}
  <div class="form-row">
    {{ form.username.errors }}
    {{ form.username.label_tag }} {{ form.username }}
  </div>
  <div class="form-row">
    {{ form.password.errors }}
    {{ form.password.label_tag }} {{ form.password }}
    <input type="hidden" name="next" value="{{ next }}">
  </div>
  <div class="form-row">
    {{ form.captcha.errors }}
    {{ form.captcha.label_tag }} {{ form.captcha }}
  </div>
  {% url 'admin_password_reset' as password_reset_url %}
  {% if password_reset_url %}
  <div class="password-reset-link">
    <a href="{{ password_reset_url }}">{% translate 'Forgotten your password or username?' %}</a>
  </div>
  {% endif %}
  <div class="submit-row">
    <input type="submit" value="{% translate 'Log in' %}">
  </div>
</form>

</div>
{% endblock %}
```
