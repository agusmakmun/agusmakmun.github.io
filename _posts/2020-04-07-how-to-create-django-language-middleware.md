---
layout: post
title:  "How to create Django Language Middleware"
date:   2020-04-07 14:32:04 +0700
categories: [python, django]
---

This example below to setup default language code as `id` (Indonesian).


1. Your file `middleware.py`


```python
# -*- coding: utf-8 -*-

from django.conf import settings
from django.utils import translation
from django.utils.deprecation import MiddlewareMixin
from django.utils.translation import ugettext_lazy as _


class LanguageMiddleware(MiddlewareMixin):

    def process_request(self, request):
        """
        function to activate the translation
        """
        if 'lang' in request.GET:
            language = request.GET.get('lang', 'id')
            if language in dict(settings.LANGUAGES).keys():
                request.session['_language'] = language

        language = request.session.get('_language', 'id')
        translation.activate(language)
```


2. And then in your `settings.py`


```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',

    # custom middleware
    'yourproject.middleware.LanguageMiddleware',
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/
LANGUAGES = (
    ('id', 'Indonesia'),
    ('en', 'English')
)
LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)
DEFAULT_LANGUAGE = 1
LANGUAGE_CODE = 'id'
USE_I18N = True
USE_L10N = True
```
