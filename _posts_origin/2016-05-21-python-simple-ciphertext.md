---
layout: post
title:  "Python Simple Ciphertext"
date:   2016-05-21 14:32:04 +0700
categories: [python, security]
---

Simply how to make a ciphertext only with 1 line. in this sample, the plaintext is result encoded from hexa. and then, just changing all integer `3` to `6` and also otherwise from `6` to `3`.

```python
>>> #hex_encode = 'summonagus'.encode('hex')
>>> hex_encode = '73756d6d6f6e61677573'
>>> chip  = ''.join([ str(int(a)*2) if a.isdigit() and int(a) == 3 else str(int(a)/2) if a.isdigit() and int(a) == 6 else a for a in hex_encode ])
>>> 
>>> hex_encode
'73756d6d6f6e61677573'
>>> chip
'76753d3d3f3e31377576'
>>> 
>>> 
```
