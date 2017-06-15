---
layout: post
title:  "Freely hosted Programmers Blog using Jekkyl"
date:   2017-06-15 18:34:10 +0700
categories: [html, ruby]
---

Today we will make a very simply blog application and host it freely on github.io. This post is intended for those who want to publish their programming achivements and experience. I personally want to document all my work that i do in my free time and the things i learn for in my programmer career. Here are the step of bulding a blog website using UBUNTU 14.4 and publish it on the github.io free of cost and tons of effort.



## 1. [Install RUBY]( Run the following commnds in your terminal)

```sh
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.3 ruby2.3-dev
```


## 2. [Install the following dependencies ]( Run the following commands in your terminal)

```sh
sudo apt-get install build-essential patch
sudo apt-get install gcc make -y
sudo apt-get install nodejs
sudo apt-get install ruby-dev zlib1g-dev liblzma-dev
```

## 3. [Install the following gems ]( Run the following commands in your terminal)


```sh
sudo gem install nokogiri
sudo gem install jekyll
sudo gem install bundle
```


Guess what? That’s it. You have Jekyll is installed.
Further information: Here are some commands from jekyllrb.com that should get you up and running with a new blog.

# Create a new Jekyll site at ./mysite

```sh
jekyll new mysite
```

To build this site:

# Change into your new directory


```sh
cd mysite
```


# Build the site and preview it

```sh
bundle exec jekyll serve
```








