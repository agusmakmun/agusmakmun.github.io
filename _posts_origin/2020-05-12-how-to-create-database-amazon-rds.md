---
layout: post
title:  "How to create database Amazon RDS"
date:   2020-06-12 10:03:00 +0700
categories: [server, linux, others]
---


The important things you should fill with these;

| Key                        | Value                                                                          |
|----------------------------|--------------------------------------------------------------------------------|
| Storage Type               | General Purpose (SSD)                                                          |
| DB Instance class          | db.t2.micro (for development)                                                  |
| Allocate Storage           | 20 GiB (for development)                                                       |
| Enable Storage autoscaling | :heavy_check_mark:                                                             |
| Security group             | [required to custom _inbound rules_ like this](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/siap-security-group.png)   |
| Public accessibility       | Yes                                                                            |
| IAM DB authentication      | :heavy_check_mark: Enable IAM DB authentication                                |
| Log exports                | :heavy_check_mark: Postgresql log                                              |
| Delete Protection          | :heavy_check_mark: Enable Delete Protection                                    |


----------------------------------------


![amazon-rds 1](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/amazon-rds1.png)

![amazon-rds 2](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/amazon-rds2.png)

![amazon-rds 3](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/amazon-rds3.png)

![amazon-rds 4](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/amazon-rds4.png)

![amazon-rds 5](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/_posts/amazon-rds5.png)
