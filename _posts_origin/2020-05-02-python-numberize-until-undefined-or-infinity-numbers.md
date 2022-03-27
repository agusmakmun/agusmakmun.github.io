---
layout: post
title:  "Python numberize until undefined or infinity numbers"
date:   2020-05-02 20:32:04 +0700
categories: [python]
---

Something we need to create the function to convert the number into string number with fast method, for example:
`1000` to `1.0 k`, `1000000` to `1.0 m`, etc.


```python
def numberize(number):
    scales = {
        1000: 'k',
        1000000: 'm',
        1000000000: 'b',
        1000000000000: 't',
        1000000000000000: 'quad',
        1000000000000000000: 'quin',
        1000000000000000000000: 'sexti',
        1000000000000000000000000: 'septi',
        1000000000000000000000000000: 'octi',
        1000000000000000000000000000000: 'noni',
        1000000000000000000000000000000000: 'deci',
        1000000000000000000000000000000000000: 'undeci',
        1000000000000000000000000000000000000000: 'duodeci',
        1000000000000000000000000000000000000000000: 'trede',
        1000000000000000000000000000000000000000000000: 'quattu',
        1000000000000000000000000000000000000000000000000: 'quindeci',
        1000000000000000000000000000000000000000000000000000: 'sexdeci',
        1000000000000000000000000000000000000000000000000000000: 'septend',
        1000000000000000000000000000000000000000000000000000000000: 'octodeci',
        1000000000000000000000000000000000000000000000000000000000000: 'novemdeci',
        1000000000000000000000000000000000000000000000000000000000000000: 'vigintillion',
        1000000000000000000000000000000000000000000000000000000000000000000: 'infinity'
    }
    number = int(number)
    for digit, name in scales.items():
        minimum = '9' * len(str(digit)[1:])
        maximum = minimum + '999'

        if number > max(scales):
            return "{0:.1f} ".format(number / max(scales)) + name

        elif number > int(minimum) and number <= int(maximum):
            return "{0:.1f} ".format(number / digit) + name
    return number
```


Usage example;


```python
>>> numberize(1000)
1.0 k
>>> numberize(1000000)
1.0 m
>>> numberize(100120009319931)
100.1 t
```
