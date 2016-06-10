---
layout: post
title:  "Find Substrings for line Encoding [CF]"
date:   2016-06-11 03:04:23 +0700
categories: [python, codefights]
---

Given a string, return its encoding defined as follows:

First, the string is divided into the least possible number of disjoint **substrings** consisting of identical characters
for example, `"aabbbc"` is divided into `["aa", "bbb", "c"]`
Next, each substring with length greater than one is replaced with a concatenation of its length and the repeating character
for example, substring `"bbb"` is replaced by `"3b"`
Finally, all the new strings are concatenated together in the same order and a new string is returned.

#### SUBSTRING

A **substring** of a string `S` is another string `S'` that occurs in `S`. For example, `"Fights"` is a substring of `"CodeFights"`, but `"CoFi"` isn't.

**Example**

For `s = "aabbbc"`, the output should be `lineEncoding(s) = "2a3bc"`.

**Input/Output**

* [time limit] 4000ms (py)
* [input] string s (String consisting of lowercase English letters.)

_Constraints:_ `4 ≤ s.length ≤ 15.`

* [output] string (Encoded version of s.)

**Solution:**

```python
import re
def lineEncoding(s):
    grub = [ m.group(0) for m in re.finditer(r"(\w)\1*", s )]
    numb = 0
    out  = []
    for i in grub:
        numb += 1
        if len(i) > 1:
            out.append(grub[numb-1].replace(grub[numb-1], str(len(i))+i[0]))
        else:
            out.append(i)
    return ''.join(out)
```

**Result Tests:**

```python
>>>
s = "aabbbc"
>>> lineEncoding(s)
"2a3bc"
>>>
>>> s = "abbcabb"
>>> lineEncoding(s)
"a2bca2b"
>>>
>>> s = "abcd"
>>> lineEncoding(s)
"abcd"
>>>
```