---
layout: post
title:  "Command `SELECT` in MySQL"
date:   2021-06-18 19:15:00 +0200
categories: []
---

Let's take a look at the command `SELECT` in MySQL.

* `SELECT ` - performs sampling from a database and has the most complex structure among all SQL statement operators.

All examples will be given in this table, called PC
````
code model	speed ram	hd	 cd	  price
1	 1232	500	  64	5.0	 12x  600.0000
10	 1260	500	  32	10.0 12x  350.0000
11	 1233	900	  128	40.0 40x  980.0000
12	 1233	800	  128	20.0 50x  970.0000
2	 1121	750	  128	14.0 40x  850.0000
3	 1233	500	  64	5.0	 12x  600.0000
4	 1121	600	  128	14.0 40x  850.0000
5	 1121	600	  128	8.0  40x  850.0000
6	 1233	750	  128	20.0 50x  950.0000
7	 1232	500	  32	10.0 12x  400.0000
8	 1232	450	  64	8.0	 24x  350.0000
9	 1232	450	  32	10.0 24x  350.0000
````

if we use the command below, then all records will be sampled from the database object of the tabular type with the name of the PC:
`SELECT * FROM PC;`

However, the columns and rows of the result set are not ordered. To order the fields of the result set, they should be listed separated by commas in the desired order after the word SELECT: 

````SELECT price, speed, hd, ram, cd, model, code 
FROM PC;````

It should be noted that a sample of multiple fields may contain duplicate rows if it does not contain a potential key that uniquely identifies the record. In the PC table, the potential key is the code field. If you only want to get unique strings, you can use the DISTINCT keyword:
````SELECT DISTINCT speed, ram 
FROM PC;````

The horizontal sample is implemented by the WHERE predicate clause, which is written after the FROM clause. In this case, the resulting set will include only those lines from the record source, for each of which the value of the predicate is TRUE:
````SELECT DISTINCT speed, ram 
FROM PC 
WHERE price < 500;````

Examples of simple comparison predicates:
````
predicate         description
cd = ‘24x’	      24-speed CD-ROM
price < 1000	  The price is less than 1000
Price <= speed*2  The price does not exceed twice the speed of the processor
ram – 128 > 0	  The amount of RAM is over 128 MB
type = ‘laptop’	  The type of product is a laptop computer
````