---
layout: post
title:  "Restricting specific media folders on Django"
date:   2021-08-12 10:03:49 +0700
categories: [python, django, security]
---

For example someone reported a crucial bug by using [`django-tellme`](https://github.com/ludrao/django-tellme),
then we don't want that screenshot to be accessable by any users except our staffs/superuser.

So, to handle that case I think we can use custom middleware;

```python
import os

from django.conf import settings
from django.contrib import messages
from django.utils.deprecation import MiddlewareMixin
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import PermissionDenied


class RestrictMediaFoldersMiddleware(MiddlewareMixin):
    """
    Class Middleware to protect specific media folders
    to only staff/superuser who have access to them.
    """

    def process_request(self, request):
        protected_folders = getattr(settings, 'PROTECTED_MEDIA_FOLDERS', [])

        for folder in protected_folders:
            # 'tellme'  => 'tellme/'
            # 'tellme/' => 'tellme/'
            if folder[:-1] != '/':
                folder = f'{folder}/'

            # folder_path  => '/media/tellme/'
            # request.path => '/media/tellme/screenshots/screenshot_fw9h8D.png'
            folder_path = os.path.join(settings.MEDIA_URL, folder)
            if folder_path in request.path:
                user = request.user
                if user.is_authenticated and (user.is_superuser | user.is_staff):
                    # that mean user will able to access
                    pass
                else:
                    message = _('You are not allowed to access this path or file.')
                    messages.error(request, message)
                    raise PermissionDenied()
```

Then in `settings.py`;

```python
MIDDLEWARE = [
    ....
    'path.to.middleware.RestrictMediaFoldersMiddleware',
]

# Protect specific media folders to only staff/superuser who have access to them.
# this variable is related to `RestrictMediaFoldersMiddleware`
PROTECTED_MEDIA_FOLDERS = ['tellme', ]
```
