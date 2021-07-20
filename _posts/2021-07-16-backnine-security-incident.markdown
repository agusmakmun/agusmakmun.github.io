---
layout: post
title:  "BackNine Security Incident"
date:   2021-07-16 14:00:00 +0700
categories: [Reid_Tattersall, Webhooks]
---
On 7/12/2021, BackNine was notified of a public Amazon S3 bucket containing private files. The public S3 bucket allowed anyone with knowledge of the file's URL to access it. The S3 bucket was made private 20 minutes after BackNine was notified which prevented future unauthorized access.

A bug with BackNine's code caused some insurance applications to be uploaded to the incorrect S3 bucket. Insurance applications within the S3 bucket contained sensitive information such as full names, addresses, phone numbers, Social Security numbers, medical diagnoses, medications taken, and detailed completed questionnaires from April 23, 2015, to July 12th, 2021.

Logging was not enabled on the S3 bucket so it's unknown who viewed or copied files.

BackNine is working with counsel to provide disclosures to affected individuals.

__________
Update as of 7/20/2021

BackNine has no evidence to indicate that the information contained within the inadvertently published files has been or will be misused. Nevertheless, BackNine is in the process of identifying the potentially affected individuals and the categories of information involved for each. Upon completion of this process, BackNine will provide notification to the potentially affected individuals and regulatory entities in accordance with all applicable laws. BackNine is working diligently to provide these notifications as soon as possible.