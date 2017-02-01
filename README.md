## My Stack Problems

> This project forked and has been modified from [A simple grey theme for Jekyll](https://github.com/liamsymonds/simplygrey-jekyll),
> and the search posts using [Super Search](https://github.com/chinchang/super-search)

### Demo
* [https://agusmakmun.github.io](https://agusmakmun.github.io)

#### Features

* Sitemap and XML Feed
* Paginations in homepage
* Posts under category
* Realtime Search Posts _(title & description)_ under query.
* Related Posts
* Highlight pre
* Next & Previous Post
* Disqus comment
* Projects page & Detail Project page
* Share on social media
* Google analytics
* HTML Minify _(Compress HTML)_ using [Jekyll Compress HTML](https://github.com/penibelst/jekyll-compress-html)

#### Screenshot

![Screenshot Post Page](https://raw.githubusercontent.com/agusmakmun/agusmakmun.github.io/master/static/img/screenshot-post-page.png  "Screenshot Post Page")

### Install & Configuration

1. Fork this repository
2. Edit site settings inside file of `_config.yml`
3. Edit your projects at file of `projects.md`, `_data/projects.json` and inside path of `_project/` _(for detail project)_.
4. Edit about yourself inside file of `about.md`

### How to Use?

**a. Add new Categories**

All categories saved inside path of `category/`, you can see existed categories.

**b. Add new Posts**

* All posts bassed on markdown syntax _(please googling)_. allowed extensions is `*.markdown` or `*.md`.
* This files can found at the path of `_posts/`.
* and the name of files are following `<date:%Y-%m-%d>-<slug>.<extension>`, for example:

```
2013-09-23-welcome-to-jekyll.md

# or

2013-09-23-welcome-to-jekyll.markdown
```

Inside the file of it,

```
---
layout: post                          # (require) default post layout
title: "Your Title"                   # (require) a string title
date: 2016-04-20 19:51:02 +0700       # (require) a post date
categories: [python, django]          # (custom) some categories, but makesure these categories already exists inside path of `category/`
tags: [foo, bar]                      # (custom) tags only for meta `property="article:tag"`
image: Broadcast_Mail.png             # (custom) image only for meta `property="og:image"`, save your image inside path of `static/img/_posts`
---

# your content post with markdown syntax goes here...
```

### Contributing

Feel free to [open a bug](https://github.com/agusmakmun/agusmakmun.github.io/issues) or [contribute to code](https://github.com/agusmakmun/agusmakmun.github.io/pulls)!
