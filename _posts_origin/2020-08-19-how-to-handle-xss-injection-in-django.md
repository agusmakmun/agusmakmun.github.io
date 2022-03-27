---
layout: post
title:  "How to handle XSS Injection in Django?"
date:   2020-08-19 10:10:15 +0700
categories: [python, django, security]
---

Previously, the Django has [X-XSS-Protection: 1; mode=block](https://docs.djangoproject.com/en/dev/ref/middleware/#x-xss-protection-1-mode-block) to handle this case. Some browsers have the ability to block content that appears to be an XSS attack. They work by looking for JavaScript content in the GET or POST parameters of a page. If the JavaScript is replayed in the server’s response, the page is blocked from rendering and an error page is shown instead.

The `X-XSS-Protection header` is used to control the operation of the XSS filter.

To enable the XSS filter in the browser, and force it to always block suspected XSS attacks, you can pass the `X-XSS-Protection: 1; mode=block` header. SecurityMiddleware will do this for all responses if the `SECURE_BROWSER_XSS_FILTER` setting is `True`.

----------------

The solution above can't handle the modified request body from attacker. So, to handle this case, I have two methods:

#### 1. By using [`strip_tags`](https://docs.djangoproject.com/en/dev/ref/utils/#django.utils.html.strip_tags)

The `XSSModelCleaner` below to handle any text fields to clean the all `html` & `script` tags. For example:

```python
>>> from django.utils.html import strip_tags
>>>
>>> strip_tags('<p>this is a title</p>')
'this is a title'
>>>
```

So, when your user filled the `title` like this `'<p>this is a title</p>'` it will cleaned as `'this is a title'`:

```python
>>> title = '<p>this is a title</p>'
>>> post = Post.objects.create(title=title, description=...)
>>> post.title
'this is a title'
```

And this class mixin below to handle it all fields;

```python
from django.utils.html import strip_tags


class XSSModelCleaner(object):
    """
    class to handle the xss injection
    before it save into database by using `strip_tags`.

    class ModelName(XSSModelCleaner, models.Model):
        pass
    """
    excluded_xss_model_fields = []

    def save(self, *args, **kwargs):
        # handle the xss injection
        for field in self._meta.fields:
            if field.name not in self.excluded_xss_model_fields:
                value = getattr(self, field.name)
                if isinstance(value, str):
                    value_clean = strip_tags(value)
                    setattr(self, field.name, value_clean)
        return super().save(*args, **kwargs)
```


#### 1. By using custom content/text replacer.

And in this case, we have a different functionality. For example when the field is as `models.TextField` or `RichTextField`.
So, we need to allow the `<html>` tags, but not including the common XSS tags, like: `<script>` & `alert`.

```python
import re

from django.conf import settings


def xss_cleaner(content):
    """
    function to clear the content with fixed text.
    you can also use this function to handle the models.

    :param `content` is string text from text editor.
    :usage example;


    from siap_app.utils.cleaner import xss_cleaner

    class Post(models.Model):
        description = models.TextField()

        def save(self, *args, **kwargs):

            # do something like this
            self.description = xss_cleaner(self.description)

            return super().save(*args, **kwargs)
    """
    if not content:
        return None

    # remove the xss injection
    content = re.sub(r"<script(.*)script>", '', content)
    content = re.sub(r"alert(.*)\)", '', content)
    content = re.sub(r"javascript:", '', content)

    return content
```


**Don't want to save it in the models, only inside the `forms`?**, no worry just like this;


```python
from siap_app.utils.cleaner import xss_cleaner


class PostForm(forms.ModelForm):

    def clean(self):
        cleaned_data = super().clean()
        for (k, v) in cleaned_data.items():
            if isinstance(v, str):
                v = xss_cleaner(v)
                cleaned_data.update({k: v})
        return cleaned_data

    class Meta:
        model = Post
        fields = '__all__'
```

or if you want speficif field.


```python
class PostForm(forms.ModelForm):

    def clean_description(self, description):
        if isinstance(description, str):
            return xss_cleaner(description)
        return description

    class Meta:
        model = Post
        fields = '__all__'
```
