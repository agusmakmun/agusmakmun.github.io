---
layout: post
title:  "CensorThis - Censor the words [CF]"
date:   2016-05-22 04:17:54 +0700
categories: [python, codefights]
---

Author Question: **Argaen**

Code Fights Weekly has gained popularity in the past months and is receiving lots of fan letters. Unfortunately, some of the readers use offensive words and the editor wants to keep the magazine family friendly.

To manage this, you have been asked to implement a censorship algorithm. You will be given the fan letter `text` and a list of `forbiddenWords`. Your algorithm should replace all occurrences of the forbidden words in the text with sequences of asterisks of the same length.

Be careful to censor only words, no one want to see `"classic"` spelled as `"cl***ic"`.

**Example**

For text = "The cat does not like the fire" and
forbiddenWords = ["cat","fire"], the output should be
`CensorThis(text, forbiddenWords) = "The *** does not like the ****".

* **[input] string text**

Text to censor, composed of mixed case English words separated by a single whitespace character each.

* **[input] array.string forbiddenWords**

The list of words to censor, all in lowercase.

* **[output] string**

The censored text. Its length should be the same as the length of text.

**Solution:**

```python
def CensorThis(text, forbiddenWords):
  return ' '.join([ t.replace(t, "*" * len(t)) if t.lower() in forbiddenWords else t for t in text.split() ])
```

**Test 1**

```
text: "The cat does not like the fire"
forbiddenWords: ["cat", "fire"]
Expected Output: "The *** does not like the ****"
```

**Test 2**

```
text: "The cat does not like the therapy"
forbiddenWords: ["the",  "like"]
Expected Output: "*** cat does not **** *** therapy"
```

**Test 3**

```
text: "Python is the BEST programming language and LOLCODE is the Worst"
forbiddenWords: ["worst", "best"]
Expected Output: "Python is the **** programming language and LOLCODE is the *****"
```

**Test 4**

```
text: "A bald eagle is a worthy adversary"
forbiddenWords: ["bald", "a"]
Expected Output: "* **** eagle is * worthy adversary"
```

**Test 5**

```
text: "The MAGIC words are fiz buzz and plaf"
forbiddenWords: []
Expected Output: "The MAGIC words are fiz buzz and plaf"
```

**Test 6**

```
text: "The MAGIC words are fiz buzz and plaf"
forbiddenWords: ["fluzz", "z", "ping", "narf", "tedd", "troz", "zort"]
Expected Output: "The MAGIC words are fiz buzz and plaf"
```

Thanks to **GOD**.