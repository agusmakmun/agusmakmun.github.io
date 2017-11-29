---
layout: post
title:  "How to connect to MS SQL Server using Python3 on MacOS"
date:   2017-05-15 14:41:47 +0530
categories: [Python3, MsSql, MacOS]
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

<script src="https://gist.github.com/itz-azhar/9105e4ab6f8f7d49776938dd83e99b16.js"></script>

Hope it helps.
