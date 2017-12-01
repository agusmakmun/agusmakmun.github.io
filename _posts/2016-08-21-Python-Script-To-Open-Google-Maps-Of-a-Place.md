---
layout: post
title:  "Python Script To Open Google Maps Of a Place"
date:   2016-08-21 14:41:47 +0530
categories: [google, python, python3, google maps]
tags: [google, python, python3, google maps]
image: PythonLogo1.png
---
![pythonProgramming](https://2.bp.blogspot.com/-HcQQFJBUzes/V7nlHFibAmI/AAAAAAAAEgw/RPxtYcg7Eo09uJeMdB15xrlYoV_AxHIswCLcB/s1600/python-programming.png)

Some times it is very tedious to open google maps and search for maps of that place. How good it would be if the browser opens automatically with the webpage showing google maps of your desired place.

I'm doing this tutorial using python 3.x but same could be done using python 2.x

The tutorial is based on the learning from "AutomateTheBoringStuff"

I hope you will find it interesting.

### The script has following properties:

* Read the address from command line arguments or from the clipboard
* Requires webbrowser module to automatically open default web browser of OS with the desired URL
* Requires sys module to access command line stored in argv list
* Requires pyperclip to access address from clip board. This module is not by default. To install this read my blog post [Access-Clipboard-Using-Python](https://itz-azhar.github.io//python/python3/2016/06/30/Access-clipboard-using-python.html)

{% highlight python %}
#webbrowser module helps in open default web browser of os
from webbrowser import open
#sys contains command line arguments
from sys import argv
#pyperclip is a third party module used to access clipbord
#pip3 install pyperclip
#python3 -m pip install pyperclip
from pyperclip import paste
if len(argv)>1:
	address = " ".join(argv[1:])
else:
	address = paste()
open("http://www.google.com/maps/place/"+address)
{% endhighlight %}
