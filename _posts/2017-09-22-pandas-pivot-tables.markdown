---
layout: post
title:  "Pandas and Pivot Table on Titanic Survivals"
date:   2017-09-22 00:16:35 +0700
categories: [Python]
---
Pivot tables provide an extremely easy way to subset one column and then apply a calculation like a sum or a mean. The concept of Pivot tables was popularized with the instroduction of the 'PivotTable' feature in Microsoft Excel in the mid 1990's.

Pivot tables first group and them apply a calculation. For experimenting with the pivot tables, I have taken a dataset called Titanic Survival. In this dataset, there are many columns and some of these are - pclass(passenger class), age, sex, cabin, fares, ticket number, etc. 

Lets consider that we have find out the fares of the passenger according to their class i.e. pclass. Now it is very obvious that first I need to select the value of pclass and then select each row so as to get the total value of fare of that particular passenge class. 

One must probably be thinking how long the code would go? Well, here we go - 

{% highlight ruby %}
pclass_fare = titanic_survival.pivot_tables(index = "pclass", values = "fares", aggfunc = numpy.mean)
{% endhighlight %}

The first parameter of the method, index tells the method which column to group by. The second parameter values is the column that we want to apply the calculation to, and aggfunc specifies the calculation we want to perform. The default for the aggfunc parameter is actually the mean, so if we're calculating this we can omit this parameter.

To move forward, lets say we want to calculate the percentage of the Titanic Survivers by age group. So pivot_tables() method now being in your arsenal works like a charm.
 
{% highlight ruby %}
age_group_survival = titanic_survival.pivot_table(index = "age_labels", values = "survived", aggfunc = numpy.mean)
{% endhighlight %}

To make this work successfully, I have defined a function called "decide_age_class" that takes a row from [titanic_surival] dataframe using the apply() method and returns [Series] of age labels. The age_labes is a series that states whether a person is minor, adult or unknown.

{% highlight ruby %}
def decide_age_class(row):
    if row["age"] < 18:
        return "minor"
    elif row["age"] >= 18:
        return "adult"
    else:
        return "unknown"

age_labels = titanic_survival.apply(decide_age_class, axis=1)
{% endhighlight %}

[DataFrame.apply()] will iterate through each column in a DataFrame, and perform on each function. When we create our function, we give it one parameter, apply() method passes each column to the parameter as a pandas series. Finally our output looks like this :

{% highlight ruby %}
age_labels 
adult 0.387892 
minor 0.525974 
unknown 0.277567 
Name: survived, dtype: float64
{% endhighlight %}

