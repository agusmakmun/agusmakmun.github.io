---
layout: post
title:  "Django Amazon S3 Uploader"
date:   2020-07-28 11:06:00 +0700
categories: [python, django]
---

Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web Services that provides object storage through a web service interface. Amazon S3 uses the same scalable storage infrastructure that Amazon.com uses to run its global e-commerce network.

#### AWS S3 Configuration

> Before you can begin using Boto 3 (for AWS S3), you should set up authentication credentials.
> in this case, AWS S3 Only for upload files or images purpose.


**a. Using awscli _(recommended)_**

```
$ sudo apt-get install -y awscli
$ aws configure set aws_access_key_id {{access_key}}
$ aws configure set aws_secret_access_key {{secret_key}}
$ aws configure set region {{region_name}}  # e.g: ap-southeast-1
```

**b. Manual Configuration**

```
$ mkdir ~/.aws && nano ~/.aws/credentials
```

and then fill:

```
[default]
aws_access_key_id = xxxx
aws_secret_access_key = xxxx
```

You may also want to set a default region of your server. The `ap-southeast-1` depend with your server region.
This can be done in the configuration file. By default, its location is at `~/.aws/config`:

```
[default]
region=ap-southeast-1
```

-----------------


This example below is one of way "how to integrate" the AmazonS3 with Django _(with django-rest-framework)_.

```
$ pip install requests boto3
```

in your `settings.py`

```python
AWS_S3_BUCKET_NAME = 'xxx-xxx-xxx'
MAX_IMAGE_UPLOAD_SIZE = 5242880
```

then, in your `utils/uploader.py`


```python
import os
import boto3
import urllib3
import datetime
import requests
import mimetypes

from django.conf import settings
from django.core.files.base import ContentFile
from botocore.exceptions import ClientError


class AmazonS3(object):
    path_format = datetime.datetime.now().strftime('%Y/%m/%d')
    bucket_name = getattr(settings, 'AWS_S3_BUCKET_NAME')
    client = boto3.client('s3')

    def get_object_name(self, file_url):
        """
        function to get the file object name
        or file path url by `file_url`.

        :param `file_url` is string uploaded url.
                eg: 'https://s3.ap-southeast-1.amazonaws.com/assets.dev.doain/files/2019/08/13/no-image.svg'

        :return string object_name.
                eg: 'files/2019/07/22/logo.png'
        """
        return urllib3.util.parse_url(file_url).path[1:]

    def get_uploaded_url(self, object_name):
        """
        function to get the uploaded url.

        :param `object_name` is string object name.
                eg: 'files/2019/07/22/logo.png'

        :return string of uploaded file/images url.
                eg: 'https://s3.ap-southeast-1.amazonaws.com/assets.dev.doain/files/2019/08/13/no-image.svg'
        """
        location = self.client.get_bucket_location(Bucket=self.bucket_name)['LocationConstraint']
        return 'https://s3.%s.amazonaws.com/%s/%s' % (location, self.bucket_name, object_name)

    def upload_file(self, file_name, folder='files'):
        """
        function to upload the file or image into aws s3.

        :param `file_name` is file name original path source.
        :param `folder` is target folder in aws s3.

        :return `url` eg: 'https://s3.ap-southeast-1.amazonaws.com/assets.dev.doain/files/2019/08/13/no-image.svg'
        """
        content_type = mimetypes.guess_type(file_name)[0]
        object_name = os.path.join(folder, self.path_format, file_name.split('/')[-1])
        res = self.client.upload_file(file_name, self.bucket_name, object_name,
                                      ExtraArgs={'ACL': 'public-read',
                                                 'ContentDisposition': 'inline',
                                                 'ContentType': content_type})
        return self.get_uploaded_url(object_name)

    def upload_fileobj(self, file_obj, folder='files'):
        """
        function to upload the file object or images into aws s3.

        :param `field_obj` is file object, eg: request.FILES['image']
        :param `folder` is target folder in aws s3.

        :return `url` eg: 'https://s3.ap-southeast-1.amazonaws.com/assets.dev.doain/files/2019/08/13/no-image.svg'
        """
        object_name = os.path.join(folder, self.path_format, file_obj.name.split('/')[-1])
        file_data = ContentFile(file_obj.read())
        self.client.upload_fileobj(file_data, self.bucket_name, object_name,
                                   ExtraArgs={'ACL': 'public-read',
                                              'ContentDisposition': 'inline',
                                              'ContentType': file_obj.content_type})
        return self.get_uploaded_url(object_name)
```


and then in your `views.py`

```python
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from yourapp.utils.uploader import AmazonS3


class UploadImageView(APIView):
    """
    this "Upload Image" view used to handle image uploader,
    and save into AmazonS3 storage.
    """
    permission_classes = [AllowAny,]
    image_types = ['image/png', 'image/jpg', 'image/jpeg', 'image/pjpeg',
                   'image/gif', 'image/vnd.microsoft.icon', 'image/x-icon']
    max_size = getattr(settings, 'MAX_IMAGE_UPLOAD_SIZE', 5242880)
    s3 = AmazonS3()

    def post(self, request, *args, **kwargs):
        folder = request.POST.get('folder', 'images')

        if 'image' in request.FILES:
            image = request.FILES['image']
            if image.content_type not in self.image_types:
                response = {'status': status.HTTP_400_BAD_REQUEST,
                            'message': _('Bad image format!')}
                return Response(response, status=response.get('status'))

            if image.size > self.max_size:
                max_size = self.max_size / (1024 * 1024)
                response = {'status': status.HTTP_400_BAD_REQUEST,
                            'message': _('Maximum image size %(max_size)s MB.') % {'max_size': max_size}}
                return Response(response, status=response.get('status'))

            image_url = self.s3.upload_fileobj(image, folder=folder)
            if not image_url:
                response = {'status': status.HTTP_400_BAD_REQUEST,
                            'message': _('Failed to upload the image.')}
                return Response(response, status=response.get('status'))

            response = {'status': status.HTTP_200_OK,
                        'message': _('Image successfully uploaded.'),
                        'result': {
                            'image_url': image_url,
                            'image_name': image.name
                        }}
            return Response(response, status=response.get('status'))

        response = {'status': status.HTTP_400_BAD_REQUEST,
                    'message': _('Invalid "image" field.')}
        return Response(response, status=response.get('status'))
```
