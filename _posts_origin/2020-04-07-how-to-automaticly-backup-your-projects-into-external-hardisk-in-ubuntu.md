---
layout: post
title:  "How to automaticly backup your projects into external hardisk in ubuntu?"
date:   2020-04-07 14:32:04 +0700
categories: [bash, linux, ubuntu]
---

Rsync, which stands for "remote sync", is a remote and local file synchronization tool.
It uses an algorithm that minimizes the amount of data copied by only moving the portions of files that have changed.
So, you can use `rsync` to handle this case.

Rsync is a very flexible network-enabled syncing tool.
It can also refer to the network protocol developed to utilize this tool.
When we reference rsync in this guide, we are mainly referring to the utility, and not the protocol.

Due to its ubiquity on Linux and Unix-like systems and its popularity as a tool for system scripts,
it is included on most Linux distributions by default.

For example:

```bash
rsync -a --exclude "*.pyc" /path/to/origin-directory/* /path/to/destination/
```

And then, add your command into bash file:


```bash
#!/bin/bash

ORIGIN="/home/yourusername/projects/*"
DESTINATION="/media/yourusername/Elements/jobs/projects/"

if [ -d $DESTINATION ]; then
    rsync -a --exclude "*.pyc" $ORIGIN $DESTINATION;
    echo "Updated at:" $(date);
else
    echo "Path $DESTINATION not found.";
    echo "Not updated at:" $(date);
fi
```

Change mode for your bash file:

```
$ chmod +x autosync.sh
```

Don't miss to add into cronjobs

```
$ crontab -e
```

then, in your editor:


```
# Select shell mode
SHELL=/bin/bash


# sync the folders for every hours, for more: https://crontab.guru/every-1-hour
0 * * * * /home/yourusername/tools/autosync.sh > /yourusername/tools/autosync.log 2>&1
```
