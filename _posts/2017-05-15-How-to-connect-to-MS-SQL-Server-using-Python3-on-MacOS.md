---
layout: post
title:  "How to connect to MS SQL Server using Python3 on MacOS"
date:   2017-05-15 14:41:47 +0530
categories: [python,Python3, MsSql, MacOS]
tags: [python,Python3, MsSql, MacOS]
image: PythonLogo1.png
---
![MS SQL Server](https://4.bp.blogspot.com/-2N5U9axXi1Q/WRmNtf7o2hI/AAAAAAAAEtA/tQkxn-oOJ-gnmNSmjOBWnE56hvYOfKCnwCLcB/s640/mssql.png)

MS SQL Server

Simply follow the steps below
## Install pyodbc in python3
```
pip3 install pyodbc
```
## or
```
python3 -m pip install pyodbc
```
### Now install Microsoft ODBC Driver (need to have Homebrew installed on your system)
```
brew tap microsoftmsodbcsql https://github.com/Microsoft/homebrew-msodbcsql
```
### Update homebrew
```
brew update
```
### Final Step
```
brew install msodbcsql
```
### Now take idea from following python3 code

{% highlight python %}
#!/usr/bin/python3
def sqlServerConnect(driverType,pip, pdbname, pusername="", ppwd=""):
    from pyodbc import connect
    try:
        #trying to create a cnnection
        connection = connect(driver=driverType, host=pip, database=pdbname, user=pusername,password=ppwd)
        print("Connection successful : "+driverType+" "+pip+" "+" "+pdbname+" "+pusername)
        return connection
    except Exception as e:
        #connection creation failed
        print(e)
        return None

sqlServerConnect('{ODBC Driver 13 for SQL Server}','server_name/ip','databse_name','username','password')
{% endhighlight %}

Hope it helps.
