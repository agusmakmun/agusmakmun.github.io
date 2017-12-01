---
layout: post
title:  "Access clipboard using python"
date:   2016-06-30 14:41:47 +0530
categories: [python, python3]
tags: [python, python3]
image: PythonLogo2.png
---


I'm doing this tutorial using **Python 3.x**, but the same can be done using **Python 2.x**

![PyhtonLogo](https://3.bp.blogspot.com/-kcLiV-_6YVY/V3T1pCy6sgI/AAAAAAAAEgM/_wLyiyLJZtU_a6S5JlLyL0CLTYUnt5JqgCKgB/s1600/computers%2Bprogramming%2Bpython%2BHD%2BWallpaper.png)

The following python script has following properties

  * requires pyperclip module to run
  * Copy to and from clipboard
  * Tested on Unix(MacOs and Ubuntu)
  * But should also work on windows

Try, test, run and then write your own
And I forgot something, Hello everyone  :-)

### The required pyperclip can be installed as follows:
```bash
pip3 install pyperclip
```
or more specifically
```bash
python3 -m pip install pyperclip
```
The installation can checked on Unix in following way:
```bash
pip3 freeze|grep 'pyperclip'
```
or more specifically
```bash
python3 -m pip freeze|grep 'pyperclip'
```

The result will be something like:
```bash
pyperclip==1.5.27
```

Now here is a self explanatory sample code.
{% highlight python %}
import pyperclip
c=input('Enter text you want to copy: ')
pyperclip.copy(c)
print('\n'+c+" is on your clip board now, press any key to paste it on stdoutput")
input('')
print(pyperclip.paste())
{% endhighlight %}
