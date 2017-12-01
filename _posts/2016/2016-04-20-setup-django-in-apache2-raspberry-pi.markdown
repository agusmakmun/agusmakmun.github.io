---
layout: post
title:  "Setup Django in apache2 Raspberry Pi"
date:   2016-04-20 22:32:34 +0700
categories: [django, raspberry]
---

Setup Django in apache2 Raspberry Pi. Example in this configuration for monitoring the server raspberry pi using [https://github.com/k3oni/pydash/](https://github.com/k3oni/pydash/).

As following this configurations [https://github.com/k3oni/pydash/wiki/Install-pyDash#3-setup-apache](https://github.com/k3oni/pydash/wiki/Install-pyDash#3-setup-apache), how to setup it.

* **Edit in your:**

```shell
/etc/apache2/sites-available/pydash.conf
```

* **and then, add this configuration:**

{% highlight ruby %}
Listen 192.168.1.27:8001

<VirtualHost *:8001>
    ServerName 192.168.1.27:80/pydash
    ServerAlias 192.168.1.27:8001
    DocumentRoot /var/www/pydash/
    WSGIDaemonProcess pydash display-name=%{GROUP} python-path=/var/www/pydash
    WSGIProcessGroup pydash
    WSGIScriptAlias / /var/www/pydash/pydash/wsgi.py
    Alias /static /var/www/pydash/static/
    Alias /media /var/www/pydash/media/
</VirtualHost>
{% endhighlight %}

* **Now restart or reload your apache**

```shell
service apache2 restart
```

And then, you can access from another client with IP: `192.168.1.27:8001`

> Thanks to: _Nabil Abdat_