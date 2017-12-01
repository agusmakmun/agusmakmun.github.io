---
layout: post
title:  "2D Numpy Arrays"
date:   2016-06-24 14:41:47 +0530
categories: [python, python3, numpy, array]
tags: [python, python3, numpy, array]
image: NumpyLogo.jpg
---

![NumpyLogo](https://4.bp.blogspot.com/-i4w-atnTgS4/V203GmzZ8FI/AAAAAAAAEeo/Aoa4oZetH7o2I20abq1iORYDe6VDEHZ-gCKgB/s1600/numpy_project_page.jpg "NumpyLogo")

Let's recreate the numpy arrays.

If you ask for the type of these arrays,Python tells you that they are `numpy.ndarray`.

`numpy`. tells you it's a type that was defined in the numpy package.

`ndarray`
stands for n-dimensional array.

The arrays `np_height` and `np_weight` are one-dimensional
arrays, but it's perfectly possible to create 2 dimensional, three dimensional, heck even
seven dimensional arrays!

You can create a 2D numpy array from a regular Python list of lists.

### Let's try to create
one numpy array for all height and weight data of your family, like this:
```python
In [1]: import numpy as np
In [2]: np_height = np.array([1.73, 1.68, 1.71, 1.89, 1.79])
In [3]: np_weight = np.array([65.4, 59.2, 63.6, 88.4, 68.7])
#ndarray = N-dimensional array
In [4]: type(np_height)
Out[4]: numpy.ndarray
In [5]: type(np_weight)
Out[5]: numpy.ndarray
```

```python
In [6]: np_2d = np.array([[1.73, 1.68, 1.71, 1.89, 1.79],
 [65.4, 59.2, 63.6, 88.4, 68.7]])
Single type!
In [7]: np_2d
Out[7]:
array([[ 1.73, 1.68, 1.71, 1.89, 1.79],
 [ 65.4 , 59.2 , 63.6 , 88.4 , 68.7 ]])
In [8]: np_2d.shape
Out[8]: (2, 5)
#2 rows, 5 columns
In [9]: np.array([[1.73, 1.68, 1.71, 1.89, 1.79],
 [65.4, 59.2, 63.6, 88.4, "68.7"]])
Out[9]:
array([['1.73', '1.68', '1.71', '1.89', '1.79'],
 ['65.4', '59.2', '63.6', '88.4', '68.7']],
 dtype=')
 ```

If you print out `np_2d` now, you'll see that it is a rectangular data structure: Each sublist
in the list, corresponds to a row in the two dimensional numpy array.

From `np_2d.shape`,
you can see that we indeed have 2 rows and 5 columns.

`shape` is a so-called attribute
of the `np2d` array, that can give you more information about what the data structure
looks like.
### Also for 2D arrays, the Numpy rule applies:
* an array can only contain a single type.
* If
you change one float to be string, all the array elements will be coerced to strings,
to end up with a homogenous array.

```python
In [10]: np_2d[0]
Out[10]: array([ 1.73, 1.68, 1.71, 1.89, 1.79])
In [11]: np_2d[0][2]
Out[11]: 1.71
In [12]: np_2d[0,2]
Out[12]: 1.71
```
You can think of the 2D numpy array as an improved list of lists: you can perform calculations
on the arrays, like I showed before, and you can do more advanced ways of subsetting.

Suppose you want the first row, and then the third element in that row. To select the row,
you need the index 0 in square brackets.
To then select the third element, you can extend the same call with another pair of
brackets, this time with the index 2, like this. Basically you're selecting the row,
and then from that row do another selection.
There's also an alternative way of subsetting, using single square brackets and a comma.

This call returns the exact same value as before. The value before the comma specifies
the row, the value after the comma specifies the column. The intersection of the rows and
columns you specified, are returned.
Once you get used to it, this syntax is more intuitive and opens up more possibilities.

Suppose you want to select the height and weight of the second and third family member.
You want both rows, so you put in a colon before the comma. You only want the second
and third column, so you put in the indices 1 to 3 after the comma.
Remember that the
third index is not included here. The intersection gives us a 2D array with 2 rows and 2 columns

![Image](https://2.bp.blogspot.com/-Tac27YwhK3w/V21GJFdd1xI/AAAAAAAAEew/tCJELCeJZj0s0mla80tx4_qdtLIfLIlRQCLcB/s1600/g1.tiff)

```python
In [10]: np_2d[0]
Out[10]: array([ 1.73, 1.68, 1.71, 1.89, 1.79])
In [11]: np_2d[0][2]
Out[11]: 1.71
In [12]: np_2d[0,2]
Out[12]: 1.71
In [13]: np_2d[:,1:3]
Out[13]:
array([[ 1.68, 1.71],
 [ 59.2 , 63.6 ]])
 ```
 ![Image](https://3.bp.blogspot.com/-2OZVpCCb1Oc/V21GzLGGSvI/AAAAAAAAEe8/ZXTpzmPPbDkQGul9r6rxRP5gw4fs06PugCLcB/s1600/g1.tiff)
 ```python
In [10]: np_2d[0]
Out[10]: array([ 1.73, 1.68, 1.71, 1.89, 1.79])
In [11]: np_2d[0][2]
Out[11]: 1.71
In [12]: np_2d[0,2]
Out[12]: 1.71
In [13]: np_2d[:,1:3]
Out[13]:
array([[ 1.68, 1.71],
 [ 59.2 , 63.6 ]])
In [14]: np_2d[1,:]
Out[14]: array([ 65.4, 59.2, 63.6, 88.4, 68.7])
```

![image](https://4.bp.blogspot.com/-TQwi_I6XguU/V21H7_kFEhI/AAAAAAAAEfI/NtIsBxblTUcYqtfUb4V8IfyXI6buSnywwCLcB/s1600/g1.tiff)

Happy Coding!
