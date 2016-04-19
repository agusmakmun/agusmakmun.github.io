---
layout: post
title:  "Simple bash scripting for login before open the terminal"
date:   2016-04-19 19:19:21 +0700
categories: [bash]
---

Add this in your file of `/etc/bash.bashrc`, makesure you logged in as root.

{% highlight ruby %}
### ===============================================
### Simple bash scripting for login before open the terminal.
### Credit: <Summon Agus> - agus@python.web.id
### Location, end script of: /etc/bash.bashrc
### ===============================================

while true; do
  # Don't exit at Ctrl-C
  trap "echo" SIGINT

  printf "\n"
  echo -n " Who are you guys? "; read -s name;
  if [ "$name" == "agus" ]; then
    reset
    printf "\n Welcome my KING! you are the best!!\n"
    printf " "; date;
    printf " Please start your activity with Basmalah\n\n"
    break
  else
    printf "\n Heey you! why you here!! You are not owner of this machine!\n"
  fi
done

### ===============================================
### END
### ===============================================
{% endhighlight %}