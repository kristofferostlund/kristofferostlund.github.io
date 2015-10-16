---
layout: post
date: 2015-10-16
title: Big numbers on the web
categories: javascript sql bigint number
---

This is just a small post mostly to remind myself about big numbers on the web.

<!--more-->

Whilst working with SQL from JavaScript (using [Seriate](link)), I was looking to create a query which returned either the `TOP N` or every row in a table. A quick Google search let me know that the value of `TOP N` should be between 1 and 9223372036854775807 (signed 64 bit integer) in SQL Server (as the value for `N` should be a positive `bigint`). That didn't work for me though, as I got the pretty nasty looking exception:

```
Unhandled rejection RequestError: SqlContext Error. Failed on step "__result__" with: "A TOP N or FETCH rowcount value may not be negative."
```

This led to more searching around, leading me to essentially nothing, so I gave into just testing my way until I found a sort of big number which was allowed. This actually worked out, and after about twelve values I came up with the number `9223372036854775295`. It works, but I'm not entirely sure why. More searching around let me know this value is the greatest allowed for `Math.Sin` and `Math.Cos` (I'm assuming `Math.Tan` might fall into this as well, but it's not present on the MSDN page). This, I'm assuming is the same all over the .NET Framework, but don't quote me on it.

But still, I found this to be quite odd, so just to make sure, I wanted to check how large numbers in JavaScript could be. `Number.MAX_SAFE_INTEGER` gives me this number, which is `9007199254740991`. Just to make sure, I tried adding some values, which was possible, but they started behaving quite strange.

For instance:

```javascript
Number.MAX_SAFE_INTEGER + 1 == 9007199254740991;
// returns false

Number.MAX_SAFE_INTEGER + 1 == 9007199254740991 + 2;
// returns true
```

`9007199254740991` is by far less than `9223372036854775295`, and that can't be good.

So, I just copied my biggest value into Node, and then the greatest value of `bigint`, and found that, in fact, JavaScript does behave oddly above it's safest max value.

```javascript
// my biggest value
9223372036854775295
// returns 9223372036854775000

// greatest value of bigint
9223372036854775807
// returns 9223372036854776000
```

There's why `9223372036854775295` works, and `9223372036854775807` doesn't work. If you look really closely you can see that JavaScript returns a greater value for `bigint` than it should, which in SQL is seen as negative due to it being a signed 64 bit integer.

Finally, I decided to not set the value to the greatest, but went for a conditional statement in SQL instead, as I then could either grab N or every item depending on whether a condition was met.