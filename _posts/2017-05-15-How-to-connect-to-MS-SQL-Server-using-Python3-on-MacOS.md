---
layout: post
title:  "How to connect to MS SQL Server using Python3 on MacOS"
date:   2017-05-15 14:41:47 +0530
categories: [Python3, MsSql, MacOS]
---
<div dir="ltr" style="text-align: left;" trbidi="on">
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://4.bp.blogspot.com/-2N5U9axXi1Q/WRmNtf7o2hI/AAAAAAAAEtA/tQkxn-oOJ-gnmNSmjOBWnE56hvYOfKCnwCLcB/s1600/mssql.png" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img alt="MS SQL Server" border="0" height="160" src="https://4.bp.blogspot.com/-2N5U9axXi1Q/WRmNtf7o2hI/AAAAAAAAEtA/tQkxn-oOJ-gnmNSmjOBWnE56hvYOfKCnwCLcB/s640/mssql.png" title="MS SQL Server" width="640" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">MS SQL Server</td></tr>
</tbody></table>
Simply follow the steps below


<ul style="text-align: left;">
<li>Install pyodbc in python3</li>
</ul>
<pre style="background: rgb(0, 0, 0); color: #d1d1d1;">pip3 install pyodbc</pre>
<pre style="background: rgb(255, 255, 255);">or</pre>
<pre style="background: rgb(0, 0, 0); color: #d1d1d1;">python3 -m pip install pyodbc</pre>
<ul style="text-align: left;">
<li>Now install Microsoft ODBC Driver (need to have Homebrew installed on your system)</li>
</ul>
<pre style="background: rgb(0, 0, 0); color: #d1d1d1;">brew tap microsoft<span style="color: #d2cd86;"></span>msodbcsql https<span style="color: #b060b0;">:</span><span style="color: #9999a9;">//github.com/Microsoft/homebrew-msodbcsql</span></pre>
<ul>
<li>Update homebrew</li>
</ul>
<pre style="background: rgb(0, 0, 0); color: #d1d1d1;">brew update</pre>
<ul>
<li>Final Step</li>
</ul>
<pre style="background: rgb(0, 0, 0); color: #d1d1d1;">brew install msodbcsql</pre>
<ul>
<li>Now take idea from following python3 code</li>
</ul>
<script src="https://gist.github.com/itz-azhar/9105e4ab6f8f7d49776938dd83e99b16.js"></script>
<div>

</div>
<div>
Hope it helps.</div>
</div>
