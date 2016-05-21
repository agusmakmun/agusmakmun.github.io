---
layout: post
title:  "notPaired [CF]"
date:   2016-05-22 04:10:03 +0700
categories: [python, codefights]
---

Author Question: **Lepluto**

In Numberland, every integer living there has a soulmate which is the exact same number. To prevent family disasters, the Numberland mayor made sure that there is no more than two of a certain number. However, he clearly forgot to create a pair for one of the numbers, making it very sad and lonely. Given the array representing Numberland's citizens, your task is to find which number you need to add to the array so that everyone has a pair.

**Example:**

* `notPaired([1, 2, 1]) = 2`

    2 is the only number in the sequence that appears once.

* `notPaired([1, 3, 5, 7, 9, 7, 5, 3, 1]) = 9`

    9 is the only number in the sequence that appears once.

**Input/Output**

* **[input] array.integer numberland**
    1 ≤ numberland.length ≤ 100

* **[output] integer**
    The final soulmate you need to add to Numberland in order to make everyone happy.

**Solution:**

```python
def notPaired(numberland):
  for x in numberland:
    if numberland.count(x) == 1: return x

>>> notPaired([1, 3, 5, 7, 9, 7, 5, 3, 1])
9
>>>
```