---
layout: post
title:  "Javascript Validator for Input Number"
date:   2016-04-26 04:19:22 +0700
categories: [others]
---

This javascript will validate/allow the number only when event key is pressed.

{% highlight html %}
<input id="id_price" type="number" min=0 />
<script type="text/javascript">
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
document.getElementById('id_price').setAttribute("onkeypress", "return isNumber(event)");
</script>
{% endhighlight %}


For example result of it:

<script async src="//jsfiddle.net/agaust/3qz105nn/embed/html,result/dark/"></script>