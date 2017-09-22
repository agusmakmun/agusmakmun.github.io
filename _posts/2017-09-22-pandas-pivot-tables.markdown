---
layout: post
title:  "Pandas and Pivot Table on Titanic Survivals"
date:   2017-09-22 00:16:35 +0700
categories: [Python]
---
Pivot tables provide an extremely easy way to subset one column and them apply a calculation like a sum or a mean. The concept of Pivot tables was popularized with the instroduction of the 'PivotTable' feature in Microsoft Excel in the mid 1990's.

Pivot tables first group and them apply a calculation. For experimenting with the pivot tables, I have taken a dataset called Titanic Survival. In this dataset, there are many columns and some of these are - pclass(passenger class), age, sex, cabin, fares, ticket number, etc. 

Lets consider that we have find out the fares of the passenger according to their class i.e. pclass. Now it is very obvious that first I need to select the value of pclass and then select each row so as to get the total value of fare of that particular passenge class. 

One must probably be thinking how long the code would go? Well, here we go - 

{% highlight ruby %}
pclass_fare = titanic_survival.pivot_tables(index = "pclass", values = "fares", aggfunc = numpy.mean)
{% endhighlight %}
