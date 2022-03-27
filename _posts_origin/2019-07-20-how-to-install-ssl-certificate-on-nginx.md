---
layout: post
title:  "How to Install SSL Certificate on NGINX"
date:   2019-07-20 06:20:00 +0700
categories: [nginx, server, ssl, security]
---

#### 1. Generate file `.key` and `.csr`

> Don't miss to set `Common Name` as `*.mydomain.com` because we use _GlobalSign Wildcard AlphaSSL_.

```
$ openssl req -new -newkey rsa:2048 -nodes -keyout mydomain.com.key -out mydomain.com.csr

Generating a 2048 bit RSA private key
...............................................................+++
.....................+++
writing new private key to 'mydomain.com.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:ID
State or Province Name (full name) [Some-State]:Jakarta
Locality Name (eg, city) []:North Jakarta
Organization Name (eg, company) [Internet Widgits Pty Ltd]:PT. Wong Fang Chai
Organizational Unit Name (eg, section) []:Logistic
Common Name (e.g. server FQDN or YOUR name) []:*.mydomain.com
Email Address []:cs@mydomain.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:MyPassword123
An optional company name []:My Company Name
```

And the result of it, is look like this:

```
$ cat mydomain.com.csr

-----BEGIN CERTIFICATE REQUEST-----
MIICxjCCAa4CAQAwgYAxCzAJBgNVBAYTAklEMRcwFQYDVQQDDA4qLm15ZG9tYWlu
LmNvbTEWMBQGA1UEBwwNTm9ydGggSmFrYXJ0YTEbMBkGA1UECgwSUFQuIFdvbmcg
RmFuZyBDaGFpMRAwDgYDVQQIDAdKYWthcnRhMREwDwYDVQQLDAhMb2dpc3RpYzCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOA1lRWgMn9mEA0v39Pr9/6T
DNOmgMQaNgEP0f4sP69CaT7XTMqwMqbE4lsme8gNGG4PkdakuB/TAXfxja67A7nx
as94xg82+xEN3JXAd5wua38QSTv37uxTXaxEMRjmvbKE++tOPkw6p5pWFmJo0uz0
lIXGJ2A9BEDWmhwx7Geb4tLBZrgHCppRarOxPnXHS+aQVKB+GMgHrNn+QenGdgoC
loSgr6+EsOCIU2p63oIADnVZpTzsv0fEPICTpCklmAfV9DeypM5lNfD6ohX2kRiz
W3Hn6tyX3jPADDBmIvRMel/uAfRSZAq+QQBtPtjElEHBGSmWYRSs08MFLZ1rv7UC
AwEAAaAAMA0GCSqGSIb3DQEBCwUAA4IBAQBK1STpjmqlSR5WCTH9x/T9+XKid6yW
9g+koqcgWSNr/WVJ6Bv++f3j5QiIRJw3brbdpnO0NdY6ERJ6PadCij7eDiLZkV9/
HKhl759VrLyuxjnpyUNovjp2uWo9Dli96A0jwbDzZ70L/EaoEBZgPLxT13qNrrzq
t8hczRVEZlrLTLYOgclZm/MnLXf4Q2/Y4ZGDauvboHIAOX2sgn2i/jpWzHQnY826
Mw1Ba/LQtEodwf8hbYKyPcoF8mhLuMpOOvyHSaV2pYJoQNkNUf+ZhMC1+h9YZjmW
SyXzPOYhM8C2XEi3goXKiYojNWmbefDI5zk+dcOyRcmi6470Kkt7SiXX
-----END CERTIFICATE REQUEST-----




$ cat mydomain.com.key

-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgNZUVoDJ/ZhAN
L9/T6/f+kwzTpoDEGjYBD9H+LD+vQmk+10zKsDKmxOJbJnvIDRhuD5HWpLgf0wF3
8Y2uuwO58WrPeMYPNvsRDdyVwHecLmt/EEk79+7sU12sRDEY5r2yhPvrTj5MOqea
VhZiaNLs9JSFxidgPQRA1pocMexnm+LSwWa4BwqaUWqzsT51x0vmkFSgfhjIB6zZ
/kHpxnYKApaEoK+vhLDgiFNqet6CAA51WaU87L9HxDyAk6QpJZgH1fQ3sqTOZTXw
+qIV9pEYs1tx5+rcl94zwAwwZiL0THpf7gH0UmQKvkEAbT7YxJRBwRkplmEUrNPD
BS2da7+1AgMBAAECggEAfuK0EX4Mtf6rvNrIICXdvku4KZuEKfbvcyBh5idijyvV
ZgPwaJDYyXqI467exHNszPSwwzmLHi+LGDcyyJz72eJfYTTnWbry0U739CPtTQ0U
Nt+fonmI1GPFknUxF/eViY8rBprMNNXI/lYT6vOJ0yIDX8WpiRRe8NbCdoxmTqdh
UD6gi15XrSN0fxMSWDtrwxsbvOn0UwIQ3IvGXyeN3VdABDnFfKW8Vsn8xgCD961X
fDwIZDuD53Bff5DuqatR3ybqwsuEUcBA8g1Zc/MmJZN47GvFDrDTdglPEzCwB86V
VbqgXvxxMahJV0El5swgpE8B0sgMGFe3F+FmzGtiwQKBgQD98QhP/74woPgdf4Su
yd95DIPLSixSGN8dN8VAZV0gvUAeNq0Hxg2PAcFE7ozB8N1+1OUCWnQbLg47Vijv
LYmVBZeYB9b/cgnhQ1kwWgYtSqctUVwECU2iXXAK2f50V+Vk27/P4dLOfJVxmmGp
eGyIgw6Bonq0XhZZPvKQgbc9RQKBgQDiBtnZPa+5KDbzhndp+A20Hncy9F0oCOSL
6n/UxuNfd7nMVHubHLhtpaphZtWrsu02QGnIEMsYW0DhLIMcqlBmaaRJhmsDXlOt
no+T3TCytQeA/XweomGHK4QsEr5FJaTi65IM+1z0O9NFDwR5GRIGl8ASO1CN3TUj
nJRUxe+HsQKBgQC2I1GQ/5/MhUgw8CucqpKs4fsNrm/Hmqs866mBHLMFLnh0s0a8
EqPa9KlI5cjzue1EcTKo03P/orL2gD/v/Tt3NYGbu9PLeGH5vjKUaZ2QksEB0h8r
jfivAlHAlsbZb8nK44raceCf1d/ikZaG1ScTatzWwlE8WVeyP2H/n+pr+QKBgAmq
x1h+RezCZo9F2gejP1rLzsdUIkPbFYNSdUMxenoT0dOGbX713IF8C2x9DHh6f6DJ
YnzXEwiopn66+6SXODcZH5ixchRDzYpodLWbSUDrczW2Ib/hrBAu8Uk9R/wHHyVB
dA6wFYqwoFmcydEwHFBB30ooVUqsAmDSipmRmawRAoGAGmTWH9tMjRyoTimP8qly
WMQ48pCsKyXk+U426TPJAC6ovgvXc+JfVHos1iw+rsL1LAUVjcTmjzN797b/hY7H
uzQwobPnsKsll97xvSrva59zoL+3NZPR8+HxLulEwcM8e2+fOsUhtcDG7+v1RpnO
HS3rjNhHOqLvNnz0OpqxCg0=
-----END PRIVATE KEY-----
```


#### 2. Put that `BEGIN CERTIFICATE REQUEST` into your SSL Provider

![csr config](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/csr.png)

- For example, I using rumahweb provider.
- Choose domain validation _(in this method, you can using email, domain, dns, or etc)_.


#### 3. Configure domain validation in your vps server.

> Put this meta tag below into your `/.well-known/pki-validation/gsdv.txt`
> You can using `ssh` to login into your server, makesure the port 22 (for ssh) is opened.

```
<meta name="_globalsign-domain-verification" content="xxxxxxx-xxx-xxxx" />
```

![ssl validation](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/ssl1.png)

```
ubuntu@ip-xxx-xx-x-xxx:~$ cd /var/www/html/
ubuntu@ip-xxx-xx-x-xxx:/var/www/html$ ls
index.nginx-debian.html
ubuntu@ip-xxx-xx-x-xxx:/var/www/html$ sudo mkdir -p .well-known/pki-validation
ubuntu@ip-xxx-xx-x-xxx:/var/www/html$
ubuntu@ip-xxx-xx-x-xxx:/var/www/html$ sudo nano .well-known/pki-validation/gsdv.txt
ubuntu@ip-xxx-xx-x-xxx:/var/www/html$
```


#### 4. Setup the `.crt` and `.key` in the server.

Finally, after domain validation was configured after waiting a configuration,
the SSL Provider will provide you the some keys, eg: `rootCert`, `interCert`, `X509Cert` and etc.

![ssl information](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/ssl2.png)

Combine that `X509Cert` and `interCert` as `mydomain.com.crt` file.
**NOTE: Please put it in order _(1:X509Cert, 2:interCert)_**


```
ubuntu@ip-xxx-xx-x-xxx:/etc/ssl$ cat mydomain.com.crt

-----BEGIN CERTIFICATE-----
MIIGajCCBVKgAwIBAgIMK8l4aoawr9ERQuPKMA0GCSqGSIb3DQEBCwUAMEwxCzAJ
BgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMSIwIAYDVQQDExlB
bHBoYVNTTCBDQSAtIFNIQTI1NiAtIEcyMB4XDTE5MDcxOTA4MTAxMFoXDTIxMDcx
OTA4MTAxMFowQDEhMB8GA1UECxMYRG9tYWluIENvbnRyb2wgVmFsaWRhdGVkMRsw
GQYDVQQDDBIqLnRpdGlwa2lyaW1pbi5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQDSnuhKPFZdcTOSa5mKQ5KDbXDtEt+2lOF3mOT+37LlegQB6qff
Etg6u7pJPZa7ue6lxg24ZG4mi/5MZuIcfLeW7AqtoiSlCYsamoW/3jTgNUz/RB81
8TJmhIkXCwhfarOHQQx8y2k6cWZ3g4DTOaiepLraY+i6EbvoGTMezfAkU2yo0E9E
3wqGerFiTTqY+cRmuhmNkWAyCcbqcGt+330Xzr8OVlwljB7cbUXJCxkkwiEYciLI
.....etc
u08AdgCHdb/nWXz4jEOZX73zbv9WjUdWNv9KtWDBtOr/XqCDDwAAAWwJSA0/AAAE
AwBHMEUCIH0gL5GVlIxQ195U6gYu+fUeXT5Uw2ZWLR2y7xchFYjSAiEA3FZVT4AU
QHmRE+vQb/vH8Dqo7AWUXrDTEtio6bDMWTIwDQYJKoZIhvcNAQELBQADggEBAGsL
XORcvmLyYNeRovLCqTvj3pycfnJqhUPdahFJmmZw20TQLZoSDsJcz5vFBQXdGKEm
BwdVQAfPaKMdO7XDpeIRPnFj3lRYz0WsJXnTU1RsWoaifs3Kt2cgP7IBi+dySgn+
ekOZgUHC0pHLRKnrzCu/OOWAeEapGRkvsud4n4YF/QM/Sq7Mm1OAh0o2yDrOeDH/
/f9SHNIsBlBJGrF8TEfudj1g9ZGVybpp/YoCgYfFbE6+VyaoxdySSJM18ZYSPkSm
ChBfyIphR7mS0LmWqQyqBVUWLxlN4GqN6h2YnZ1S0/1UX5Cjcg1BcwSe5+DEg8i9
h42FYoQsGu5tVEN1gyE=
-----END CERTIFICATE-----


-----BEGIN CERTIFICATE-----
MIIETTCCAzWgAwIBAgILBAAAAAABRE7wNjEwDQYJKoZIhvcNAQELBQAwVzELMAkG
A1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv
b3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw0xNDAyMjAxMDAw
MDBaFw0yNDAyMjAxMDAwMDBaMEwxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9i
YWxTaWduIG52LXNhMSIwIAYDVQQDExlBbHBoYVNTTCBDQSAtIFNIQTI1NiAtIEcy
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2gHs5OxzYPt+j2q3xhfj
.....etc
yolQL30EzTSo//z9SzANBgkqhkiG9w0BAQsFAAOCAQEAYEBoFkfnFo3bXKFWKsv0
XJuwHqJL9csCP/gLofKnQtS3TOvjZoDzJUN4LhsXVgdSGMvRqOzm+3M+pGKMgLTS
xRJzo9P6Aji+Yz2EuJnB8br3n8NA0VgYU8Fi3a8YQn80TsVD1XGwMADH45CuP1eG
l87qDBKOInDjZqdUfy4oy9RU0LMeYmcI+Sfhy+NmuCQbiWqJRGXy2UzSWByMTsCV
odTvZy84IOgu/5ZR8LrYPZJwR2UcnnNytGAMXOLRc3bgr07i5TelRS+KIz6HxzDm
MTh89N1SyvNTBCVXVmaU6Avu5gMUTu79bZRknl7OedSyps9AsUSoPocZXun4IRZZUw==
-----END CERTIFICATE-----
```


Don't miss to add also your previous `mydomain.com.key` into folder `/etc/ssl/`


```
ubuntu@ip-xxx-xx-x-xxx:/etc/ssl$ cat mydomain.com.key

-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgNZUVoDJ/ZhAN
L9/T6/f+kwzTpoDEGjYBD9H+LD+vQmk+10zKsDKmxOJbJnvIDRhuD5HWpLgf0wF3
8Y2uuwO58WrPeMYPNvsRDdyVwHecLmt/EEk79+7sU12sRDEY5r2yhPvrTj5MOqea
VhZiaNLs9JSFxidgPQRA1pocMexnm+LSwWa4BwqaUWqzsT51x0vmkFSgfhjIB6zZ
/kHpxnYKApaEoK+vhLDgiFNqet6CAA51WaU87L9HxDyAk6QpJZgH1fQ3sqTOZTXw
+qIV9pEYs1tx5+rcl94zwAwwZiL0THpf7gH0UmQKvkEAbT7YxJRBwRkplmEUrNPD
BS2da7+1AgMBAAECggEAfuK0EX4Mtf6rvNrIICXdvku4KZuEKfbvcyBh5idijyvV
ZgPwaJDYyXqI467exHNszPSwwzmLHi+LGDcyyJz72eJfYTTnWbry0U739CPtTQ0U
Nt+fonmI1GPFknUxF/eViY8rBprMNNXI/lYT6vOJ0yIDX8WpiRRe8NbCdoxmTqdh
UD6gi15XrSN0fxMSWDtrwxsbvOn0UwIQ3IvGXyeN3VdABDnFfKW8Vsn8xgCD961X
fDwIZDuD53Bff5DuqatR3ybqwsuEUcBA8g1Zc/MmJZN47GvFDrDTdglPEzCwB86V
VbqgXvxxMahJV0El5swgpE8B0sgMGFe3F+FmzGtiwQKBgQD98QhP/74woPgdf4Su
yd95DIPLSixSGN8dN8VAZV0gvUAeNq0Hxg2PAcFE7ozB8N1+1OUCWnQbLg47Vijv
LYmVBZeYB9b/cgnhQ1kwWgYtSqctUVwECU2iXXAK2f50V+Vk27/P4dLOfJVxmmGp
eGyIgw6Bonq0XhZZPvKQgbc9RQKBgQDiBtnZPa+5KDbzhndp+A20Hncy9F0oCOSL
6n/UxuNfd7nMVHubHLhtpaphZtWrsu02QGnIEMsYW0DhLIMcqlBmaaRJhmsDXlOt
no+T3TCytQeA/XweomGHK4QsEr5FJaTi65IM+1z0O9NFDwR5GRIGl8ASO1CN3TUj
nJRUxe+HsQKBgQC2I1GQ/5/MhUgw8CucqpKs4fsNrm/Hmqs866mBHLMFLnh0s0a8
EqPa9KlI5cjzue1EcTKo03P/orL2gD/v/Tt3NYGbu9PLeGH5vjKUaZ2QksEB0h8r
jfivAlHAlsbZb8nK44raceCf1d/ikZaG1ScTatzWwlE8WVeyP2H/n+pr+QKBgAmq
x1h+RezCZo9F2gejP1rLzsdUIkPbFYNSdUMxenoT0dOGbX713IF8C2x9DHh6f6DJ
YnzXEwiopn66+6SXODcZH5ixchRDzYpodLWbSUDrczW2Ib/hrBAu8Uk9R/wHHyVB
dA6wFYqwoFmcydEwHFBB30ooVUqsAmDSipmRmawRAoGAGmTWH9tMjRyoTimP8qly
WMQ48pCsKyXk+U426TPJAC6ovgvXc+JfVHos1iw+rsL1LAUVjcTmjzN797b/hY7H
uzQwobPnsKsll97xvSrva59zoL+3NZPR8+HxLulEwcM8e2+fOsUhtcDG7+v1RpnO
HS3rjNhHOqLvNnz0OpqxCg0=
-----END PRIVATE KEY-----
```



#### 5. Setup Nginx

```
$ sudo nano /etc/nginx/sites-available/mydomain.com
```

Inside file of `mydomain.com`, add your `/etc/ssl/mydomain.com.crt`
and `/etc/ssl/mydomain.com.key` into this file.

```
server {
    listen 80;
    server_name mydomain.com www.mydomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    # Install SSL
    listen                  443 ssl;
    ssl_certificate         /etc/ssl/mydomain.com.crt;
    ssl_certificate_key     /etc/ssl/mydomain.com.key;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    server_name mydomain.com www.mydomain.com;

    location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            try_files $uri $uri/ =404;
    }

    # add Strict-Transport-Security to prevent man in the middle attacks
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

Don't miss to create a symlink file.

```
$ sudo ln -s /etc/nginx/sites-available/mydomain.com /etc/nginx/sites-enabled/
```

And then you can test it using `sudo service nginx -t`, if it passed you can restart the nginx server.

```
ubuntu@ip-xxx-xx-x-xxx:~$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful


ubuntu@ip-xxx-xx-x-xxx:~$ sudo systemctl restart nginx
ubuntu@ip-xxx-xx-x-xxx:~$ sudo systemctl restart gunicorn  # if you have gunicorn
```

### 6. Finally

Finally, you can checkout your domain `mydomain.com`, it will automaticly redirect as `https` mode.
To check your keys chain is correct or not, you can checkout at https://whatsmychaincert.com/?mydomain.com
