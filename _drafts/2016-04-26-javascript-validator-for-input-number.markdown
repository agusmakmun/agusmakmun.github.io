---
layout: post
title:  "Javascript Validator for Input Number"
date:   2016-04-26 04:19:22 +0700
categories: [others]
---

This javascript will validate/allow the number only when event key is pressed.
For example result of it:

<iframe width="100%" height="350" src="//jsfiddle.net/agaust/3qz105nn/embedded/html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

tutorial above, when you can not directly add the attribute inside html tag.
but if you can add it, you can following this tutorial bellow:

{% highlight html %}
<input id="id_price" type="number" min=0 onkeypress="return isNumber(event)"/>
<script type="text/javascript">
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
</script>
{% endhighlight %}

**Refference:** [http://stackoverflow.com/a/7295864](http://stackoverflow.com/a/7295864)

hope it usefull.