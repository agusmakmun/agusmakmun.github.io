---
layout: post
title:  "BackNine Security Incident"
date:   2021-07-16 14:00:00 +0700
categories: [Reid_Tattersall, Webhooks]
---
On 7/12/2021, BackNine was notified by a security editor at TechCrunch of a public Amazon S3 bucket containing private files. The public S3 bucket allowed anyone with knowledge of the file's URL to access it. The S3 bucket was made private 20 minutes after BackNine was notified which prevented future unauthorized access.

A bug with BackNine's code caused some insurance applications to be uploaded to the incorrect S3 bucket. Insurance applications within the bucket contained sensitive information such as full names, addresses, phone numbers, Social Security numbers, medical diagnoses, medications taken, and detailed completed questionnaires from April 23, 2015, to July 12th, 2021.

Logging was not enabled on the S3 bucket so it's unknown who viewed or copied files.

BackNine is working with counsel to provide disclosures to affected individuals.