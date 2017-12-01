---
layout: post
title:  "Playing with birthday using Python"
date:   2016-06-30 15:41:47 +0530
categories: [python, python3]
tags: [python, python3]
image: PythonLogo1.png
---

I always wondered how to access calendar and work with dates in programming languages,
Thanks to **Python's datetime** module, which makes it so easy to work with it.

![PythonLOGO](https://2.bp.blogspot.com/-JQpULUzVx6Q/V01A90yt41I/AAAAAAAAEd8/WRLsCqamF3YvBRFu65b2tISJUR451LweQCKgB/s640/MTE5NDg0MDYxMTk4NTUwNTQz.png)

### The following python script has following properties

 * requires python 3.x to run
 * Read birthdate and tell birth month, tell number of days till next birthday
 * Tested on Unix(MacOs and Ubuntu)
 * But should also work on windows

Try, test, run and then write your own.
And I forgot something, Hello everyone  :-)

```python
#Read birthdate and display birthday month
import datetime
birthday=input("What is your birthday date['yyyy-mm-dd' format] ")
birthday=datetime.datetime.strptime(birthday,"%Y-%m-%d").date()
print("Birthday month is "+birthday.strftime('%B'))
```

```python
#read next birthday and display number of days left till next birthday
import datetime
birthday=input("When is your next birthday ['yyyy-mm-dd' format] : ")
birthday=datetime.datetime.strptime(birthday,"%Y-%m-%d").date()
CurrentDay=datetime.date.today()
diff=birthday-CurrentDay
print("There are {0:} day(s) left till your next Birthday".format(diff.days))
```

Further you can use this idea to read a birthday and add it to google calendars to remind you when the birthday comes.{Well I think everyone remembers her/his birrthday :-) }
