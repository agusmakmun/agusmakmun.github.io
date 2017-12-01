---
layout: post
title:  "Download recrusive files inside index-of in Linux using wget"
date:   2016-04-19 19:39:02 +0700
categories: [bash]
---
```
$ wget -r --no-parent --reject "index.html*" http://125.160.17.22/dokumen/IGN/Panduan_OpenOffice.org_2.0/
```

For me I have to pass the --no-parent option, otherwise it will follow the link in the directory index on my site to the parent directory. So the command would look like this:

```
wget -r --no-parent http://mysite.com/configs/.vim/
```

Edit: To avoid downloading the index.html files, use this command:

```
wget -r --no-parent --reject "index.html*" http://mysite.com/configs/.vim/
```


The Parameters are:

* `-r`     //recursive Download
* `--no-parent` // Don´t download something from the parent directory
* `-l1` //just download the directory (tzivi in your case)
* `-l2` //download the directory and all level 1 subfolders ('tzivi/something' but not 'tivizi/somthing/foo')  

And so on. If you insert no `-l` option, wget will use `-l` 5 automatically.  
If you insert a -l 0 you´ll download the whole internet, because wget will follow every link it finds.


**Refference:**

* [http://stackoverflow.com/a/19695143/3445802](http://stackoverflow.com/a/19695143/3445802)
* [http://stackoverflow.com/a/273776/3445802](http://stackoverflow.com/a/273776/3445802)

