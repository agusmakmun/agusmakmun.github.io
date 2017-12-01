---
layout: post
title:  "Custom redirect urls django"
date:   2016-04-20 09:41:20 +0700
categories: [python, django]
---
Example in this problem we need redirect the url `http://localhost:8000/a/b/C/123/4/5/` to `http://localhost:8000/abC12345` without `/` slash.

#### 1. In your `views.py`

{% highlight python %}
from django.http import HttpResponse
from django.views.generic.base import RedirectView
from django.core.urlresolvers import reverse

#Ref: http://stackoverflow.com/a/16627830/3445802
class UserRedirectView(RedirectView):
    permanent = False
    def get_redirect_url(self, pk):
        pk = ''.join(str(pk).split('/'))
        return reverse('pool_fix_page', kwargs={'pk': pk})

def pool_fix(request, pk):
    return HttpResponse("You're looking at question %s." % pk)

{% endhighlight %}

#### 2. In your `urls.py`

{% highlight python %}
from django.conf.urls import url
from . import views

urlpatterns = [
    # first view the pool to doing redirection
    url(r'^pool/(?P<pk>[0-9a-zA-Z\/]+)/$', views.UserRedirectView.as_view(), name='pool'),

    # allow decimal and words only.
    url(r'^pool/(?P<pk>[\d\w_]+)$', views.pool_fix, name='pool_fix_page'),
]
{% endhighlight %}
