---
title: 'Implement series post in Jekyll - Part 1'
layout: post
categories: [others]
series: implement-series-post-jekyll
---
This is first post in the series explaining how I implemented post series without any ruby-gem or anything, just simple liquid syntaxes.

The purpose has been stated earlier. I am only going to talk about the implementation now on. Lets get started.

Since we need a single index page for series post, lets make one. Create a file and fill releavent front matter. Since we need a way to recognize if this is the series page that holds all the sub-posts within, we need to add a variable. I found `series-slug` more intimidating, since it is more human readable and makes sense to sub-posts. Thus, the front matter may now look like:

```ruby
---
title: 'Some series title'
layout: post
categories: [a,b]
series_slug: some-series
---
```

Fill in the content for the post. You have created an index page. Lets create sub-posts (parts of series) that series will contain. Lets make two posts to start with. I am calling it `post A` and `post B`. Create another two files for these and fill in releavent YAML front matter. Now, to link the post to the series post, I am declaring a variable within these posts which will connect them. So, I declared the variable `series` in front matter and fill in the series slug I declared earlier. Thus, the front matter for these posts will look like:

```ruby
---
title: 'Part of series post - Part 1'
layout: post
categories: [a]
series: some-series
---
```

Good enough. Not so much!! We did declared a series and posts linking to it. However, we still need to show above posts in the series index. Since series has the `layout: post`, edit `post.html` in your `_layouts` directory. Enter the following line just below YAML front matter in `post.html` :

{% raw %}
```ruby
---
layout: default
---
{% include post-series.html %}

```
{% endraw %}

If you are familier with jekyll, you must know that `include` tag includes a file with the name following it, from `_includes` directory. In the above code, I just told jekyll to look for a file `post-series.html` in `_includes` directory, and include the code within it to current file. Thus would help me keep my code modular, in a separate place. This will enable me to write the code for post series thing in a single file called `post-series.html` and I can just call releavent variables whereever I like to. 

For the series index page, we would like to show up all the sub-posts it contains. Quite easy. We will use a for loop to go threw each posts and check if it has a `series` variable in their front matter and if that matches our current series index's `series_slug`. Open up `post-series.html` and write the code below:

{% raw %}
```ruby
{% comment %} We need an array to hold sub posts of the series. Below line is kind of hack to make one {% endcomment %}
{% assign seriesarray = '|' | split : '|' %}

{% for post in site.posts  %}

	{% comment %} Is this(loop) a sub-post and does it match the series index slug? {% endcomment %}
	{% if post.series and page.series_slug != nil and post.series == page.series_slug %}

        {% capture postitem %}    <li> <a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a> </li> {% endcapture %}
        {% assign seriesarray = seriesarray | push: postitem %}

    {% endif %}
{% endfor %}

{% comment %} At this point, seriesarray will hold all the sub-posts for this series. Just iterate threw them to like below. {% endcomment %}
{% if seriesarray.size > 0 %} <ul> {% endif %}
{% for post in seriesarray %} {{ post }} {% endfor %}
{% if seriesarray.size > 0 %} <ul> {% endif %}
```
{% endraw %}

We can use `seriesarray` in `post.html` to show the posts. I'd to show the list after the post content. Thus used the above for loop after {% raw %}`{{ content }}` {% endraw %} in `post.html`.

If this works out for you, you can check part 2 of the post where I've explained how to list only series index post (instead of sub-posts individually) on the blog index page. 
