---
layout: post
title:  "[Python] 두 집합의 차집합 구하기"
date:   2019-07-15 15:32
categories: [Python]
use_math: true
comments: true
---
데이터 분석을 하다보면 어떤 리스트 $A$에는 속해 있지만 다른 리스트 $B$에는 속하지 않는 항목을 찾아야할 때가 있다. 집합 용어로 나타내자면 $A-B$(혹은 $A\cap B^c$, $A \backslash B$)으로 표현할 수 있을 것이다.<br/>
예를 들어 $A$라는 list를 `[1,2,3,4,5]`, $B$라는 list를 `[3,4,5,6,7]` 이라고 하자. A에 속하지만 B에는 속하지 않은 항목은 1과 2가 있다. 이를 단순하게 for문을 통해 구현해보면 다음과 같을 것이다.<br/>
~~~python
A = [1,2,3,4,5]
B = [3,4,5,6,7]

diff_set = []
for a in A:
    if a not in B:
        diff_set.append(a)
print(diff_set)
--------------------------
[1,2]
~~~


<br/>
하지만 $A$와 $B$ 사이즈가 굉장히 크다면 $A$에 속한 각 항목 $a$가 $B$에 속해있는지 점점 알기 어려워질 것이다. 이럴 때 파이썬의 `set`을 사용하면 더욱 쉽고 빠르게 주어진 두 집합의 차집합을 구할 수 있다.<br/>

~~~python
A = set([1,2,3,4,5])
B = set([3,4,5,6,7])

diff_set = set(A) - set(B)
print(diff_set)
--------------------------
{1,2}
~~~

마지막으로 `list(diff_set)` 을 통해 원하는 차집합을 구할 수 있다. 이 코드는 두 집합의 크기가 꽤나 커도 실행 속도가 굉장히 빠르다.<br/>
출처 : [StackOverflow : Get difference between two lists](https://stackoverflow.com/questions/3462143/get-difference-between-two-lists)
<br/>
