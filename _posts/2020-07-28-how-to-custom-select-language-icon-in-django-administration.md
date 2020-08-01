---
layout: post
title:  "How to custom select language icon in django administration"
date:   2020-07-28 20:25:28 +0700
categories: [python, django]
---


![change-language.png](https://i.imgur.com/qIhI550.png)


**1. Add the base_site file inside `templates/admin/base_site.html`.**

```html
[[ extends "admin/base.html" ]]    ==> please change [[ ]] to django templatetag, because gh-pages doesn't support it.
{% load static i18n %}

{% block title %}{{ title }} | {{ site_title|default:_('Situs django admin') }}{% endblock %}

{% block branding %}
<h1 id="site-name"><a href="{% url 'admin:index' %}">{{ site_header|default:_('Administrasi django') }}</a></h1>
{% endblock %}

{% block nav-global %}{% endblock %}

{% block welcome-msg %}

  {# CUSTOM LANGUAGE ICONS #}
  {% get_current_language as LANGUAGE_CODE %}
  {% get_available_languages as LANGUAGES %}
  {% get_language_info_list for LANGUAGES as languages %}
  <span id="language-icons" style="margin: -1px 0 0 -65px; position: absolute;">
    {% for language in languages %}
      {% if language.code == 'id' %}
        <a href="?lang=id" style="margin-right: 3px;border-bottom:none" title="Indonesia">
          <img height="15px" src="{% static 'icons/flags/id.svg' %}">
        </a>
      {% elif language.code == 'en' %}
        <a href="?lang=en" style="margin-right: 3px;border-bottom:none" title="English">
          <img height="15px" src="{% static 'icons/flags/us.svg' %}">
        </a>
      {% endif %}
    {% endfor %}
  </span>

  {# DFEAULT WELCOME MESSAGE GOES HERE #}
  {{ block.super }}

{% endblock %}
```


**2. Custom language middleware, in your file `middleware.py`**

```python
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


**3. And then in your `settings.py`**

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


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
