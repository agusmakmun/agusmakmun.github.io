---
layout: post
title:  "Adding BroadCast Mail to All Users Registered inside Django Admin"
date:   2016-04-20 19:51:02 +0700
categories: [python, django]
image: Broadcast_Mail.png
---

Adding BroadCast Mail to All User Registered in Django Admin. This is my last problem, we need custom default Django Admin to can submit BroadCast mail to All User. Because this is perfectly to make a promotions.

This problem has been helped by our Danny W. Adair who are answered someone's question about the ["Django Admin Customizing"](http://stackoverflow.com/a/5803941/3445802).

> In this configuration, we use gmail for email backend. Please following this tutorial first [Email BackEnd with SMTP Gmail](https://agusmakmun.github.io/python/django/2016/04/18/email-backend-with-smtp-gmail.html).

-----

**1.** In your `models.py`

{% highlight python %}
class BroadCast_Email(models.Model):
    subject = models.CharField(max_length=200)
    created = models.DateTimeField(default=timezone.now)
    message = RichTextUploadingField()

    def __unicode__(self):
        return self.subject

    class Meta:
        verbose_name = "BroadCast Email to all Member"
        verbose_name_plural = "BroadCast Email"

{% endhighlight %}

-----

**2.** In your `admin.py`, importing some module for "admin" and for "email setup".

{% highlight python %}
from django.contrib import admin
from django.utils.safestring import mark_safe
import threading
from django.conf import settings
from django.http import HttpResponse
from django.core.mail import (send_mail, BadHeaderError, EmailMessage)
from django.contrib.auth.models import User

class EmailThread(threading.Thread):
    def __init__(self, subject, html_content, recipient_list):
        self.subject = subject
        self.recipient_list = recipient_list
        self.html_content = html_content
        threading.Thread.__init__(self)

    def run(self):
        msg = EmailMessage(self.subject, self.html_content, settings.EMAIL_HOST_USER, self.recipient_list)
        msg.content_subtype = "html"
        try:
            msg.send()
        except BadHeaderError:
            return HttpResponse('Invalid header found.')

class BroadCast_Email_Admin(admin.ModelAdmin):
    model = models.BroadCast_Email

    def submit_email(self, request, obj): #`obj` is queryset, so there we only use first selection, exacly obj[0]
        list_email_user = [ p.email for p in User.objects.all() ] #: if p.email != settings.EMAIL_HOST_USER   #this for exception
        obj_selected = obj[0]
        EmailThread(obj_selected.subject, mark_safe(obj_selected.message), list_email_user).start()
    submit_email.short_description = 'Submit BroadCast (1 Select Only)'
    submit_email.allow_tags = True

    actions = [ 'submit_email' ]

    list_display = ("subject", "created")
    search_fields = ['subject',]

admin.site.register(models.BroadCast_Email, BroadCast_Email_Admin)

{% endhighlight %}

-----

**3.** And then, you can see. we have **Submit BroadCast** selection, just click button **Go** to submit broadcast mail.

![Screenshot broadcast](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/Broadcast_Mail.png  "Screenshot broadcast")
