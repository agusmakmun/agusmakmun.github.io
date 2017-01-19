---
title: 'Implement series post in Jekyll - Part 2'
layout: post
categories: [others]
series: implement-series-post-jekyll
---
In the last post of this series, I explained how you can make a series of post and connect it to a singular post, maintaing series index.
We also learnt how I made a bare layout which listed all posts within series.

This post will explain how to list only series index post on blog index page.

Open the page where you are showing your blog index. For me, its `index.html`. It will probably contain a paginator loop, something like this:

{% raw %}
```ruby
... rest of index.html

<ul>
{% for post in paginator.posts %}
	<li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>


```

Since we need to show posts which are either not a part of any series, or the series index posts, we have to filter out the sub-posts. Quite simple. We just need to check if a post in the loop is series sub-post or not. Still unsure? Check out code below-

```ruby 
... rest of index.html

<ul>
{% for post in paginator.posts %}
	{% if post.series == nil %}
	<li><a href="{{ post.url }}">{{ post.title }}</a></li>
	{% endif %}
{% endfor %}
</ul>

```
{% endraw %}

Done. 