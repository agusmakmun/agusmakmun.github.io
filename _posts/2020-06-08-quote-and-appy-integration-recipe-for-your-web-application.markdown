---
layout: post
title:  "Quote & Apply Integration Recipe for Web Applications"
date:   2020-06-18 14:00:00 +0700
categories: [Reid_Tattersall]
---
### TLDR
Are you looking to integrate Quote & Apply into your web application? Of course you are. Why wouldn't you want to protect families and simplify the selling of insurance for your users? Follow our recipe to cook yourself something your family of users will enjoy. Happy early Summer Solstice.

### Setting the stage
Our fictitious web application "SuperSurito" is an employee benefits application looking to offer users individual life insurance during the selection of their benefits. Their core products are currently group health, dental, disability, and life. Group life isn't a complete life insurance solution for a myriad of reasons. SuperSurito is growing a marketplace of products so users have a simplified process of obtaining insurance. After stumbling upon Quote & Apply, they decided it was by far the best life insurance process. Their only question was how...

### I'll tell you how
<div id="container-id"></div>
<div>
  <script
    id="strife"
    src="https://cdn.quoteandapply.io/widget.js?prefill&npn=10790698&referrer_type=Agency&referrer_id=18"
    data-strife-container-id="container-id"
  ></script>
</div>

### Whoops, forgot to comment the code
```
<div id="container-id"></div>
<div>
  <script
    id="strife"
    src="https://cdn.quoteandapply.io/widget.js?prefill&npn=10790698&referrer_type=Agency&referrer_id=18"
    data-strife-container-id="container-id"
  ></script>
</div>
```

### Wait is that it?
Yes

### But how?
When the code is placed within the HTML of your website, Quote & Apply appears. The `npn` represents the National Producer Number of the agent you'd like to use. We suggest saving your agents' NPN within your database and passing it into Quote & Apply. The referrer's `referrer_type` and `referrer_id` is unique to SuperSurito's. Make sure to use your unique ID or else SuperSurito will plunder your booty. If the `npn` doesn't exist in BackNine's database you'll see a BackNine sign up page. Once that `npn` exists in BackNine's database, it's time to do what SuperSurito does best and insure those precious lives.

### I want to take the user experience to an 11
We agree. Our first suggestion is to add parameters to the `src` such as `first_name`, `last_name`, `birthdate`, and `gender`. Don't forget to add the `test=1` parameter while perfecting it. There are around 30 optional parameters you can prefill documented at https://docs.back9ins.com/#pre-filling-quote-apply. Afterwards, head on over to your [Quote & Apply dashboard](https://app.back9ins.com/#/electronic_applications/dashboard) within [BOSS](https://app.back9ins.com) to admire all of the life insurance applications being created because of your hard work.
