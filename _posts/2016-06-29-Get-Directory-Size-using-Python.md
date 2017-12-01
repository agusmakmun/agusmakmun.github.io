---
layout: post
title:  "Get Directory Size using Python"
date:   2016-06-29 14:41:47 +0530
categories: [python, python3]
tags: [python, python3]
image: PythonLogo1.png
---


Well, I always wondered the scope of Python and Finally Realised it is limitless.
The following script named <b>"DirectorySize.py" </b>is written in <b>python 3.x</b>

<b><marquee><i class="fa fa-crosshairs fa-spin"></i><i class="fa fa-crosshairs fa-spin"></i><i class="fa fa-crosshairs fa-spin"></i><i class="fa fa-crosshairs fa-spin"></i></marquee></b>

![PythonLogo](https://3.bp.blogspot.com/-kcLiV-_6YVY/V3T1pCy6sgI/AAAAAAAAEgE/VgH8i96fprozYuFc8R5WZKfwuTLZEcgdwCLcB/s1600/computers%2Bprogramming%2Bpython%2BHD%2BWallpaper.png "PythonLogo")

### The following python script has following properties

* requires python 3.x to run
* Tell the size of directory in which it is placed
* Tested on Unix(MacOs and Ubuntu)
* But should also work on windows
*Try, test, run and then write your own
And I forgot something, Hello everyone  :-)

```python
import os
totalSize = 0
for filename in os.listdir(os.getcwd()):
    if not os.path.isfile(os.path.join(os.getcwd(),filename)):
        continue
    totalSize = totalSize + os.path.getsize(os.path.join(os.getcwd(),filename))
print("Total Size of current working directory is {0:.2f} Kilo bytes".format(totalSize/1024))
```
