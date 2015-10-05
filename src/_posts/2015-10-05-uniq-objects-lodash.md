---
layout: post
date: 2015-10-05
title: Uniq(ue) objects with lodash
categories: codesnippets coffeescript
---

I do wish I had the time to write more, but I've had little to no free time the past months really. Between moving back home to Sweden and working as the main developer at a start up, there's been very little time do anything at all.

At work we've used [CoffeeScript](http://coffeescript.org/) instead of plain JavaScript, and boy, have I fallen in love. It's just _beautiful_, _delicious_. Mix it up with some [lodash](https://lodash.com/) awesomeness and we've got a party. For instance, getting all values of an object is made super simple as you can just `map` over it, same as you would with an Array. This right here sort of helped me solve a problem I encountered couple of weeks, which I thought I'd write about.

<!--more-->

_Actually, I wrote most of this post the night almost three weeks ago, but I've been busy at work and haven't had the time to finish up before today._

See, whilst parsing a CSV file, which sort of stitched together an array of JavaScript objects, I wanted to smoothly remove duplicates of objects in an array before submitting it to the server. This is super simple for primitive types with lodash, it's just to use `_.uniq(arr)`. Sadly, objects doesn't work that way.

``` coffeescript
_.uniq [1, 2, 1, 2, 3]
# output: [ 1, 2, 3 ]

# Note if these were the same object instance (which they're obviously not),
# output would be of only one of the objects.
_.uniq [{a:2, b:3}, {b:3, a:2}]
# output: [ { a: 2, b:3 }, { b:3, a:2 } ]

# Because the both obj are of the same instance, they are seen as equal.
obj = {a: 2, b:3}
_.uniq [obj, obj]
# output: [ { a: 2, b:3 } ]
```

[This discussion on Stack Overflow](http://stackoverflow.com/questions/9923890/removing-duplicate-objects-with-underscore-for-javascript) got me on the right track but didn't really solve it for me. The accepted answer says to return a stringified version of the object, which works great if the keys always are in the same order in every object, which is dependent either on order of declaration or where the script is being run.

``` coffeescript
_.uniq [{a: 2}, {a: 2}], JSON.stringify
# output: [ { a: 2, b:3 } ]

_.uniq [{a: 2, b:3}, {a: 2, b:3}], JSON.stringify
# output: [ { a: 2, b: 3 } ]

_.uniq [{a: 2, b:3}, {b:3, a: 2}], JSON.stringify
# output: [ { a: 2, b: 3 }, { b: 3, a: 2 } ]
```

As you can see, the output for the first two are correct, but the third example still returns two objects. Frankly, I care no more of what order the keys are in than whether someone in the world is drinking coffee right now. (Okay, I actually do care a little about that.)

_So, what do I do if the accepted answer on Stack Overflow did not solve my problem? Thinking is hard!_

Remember I said `_.map` can iterate over objects too? This is great, as that function returns an array, and arrays are sortable! _What if I just...? ...Sort? Hmm... ...Join?. Yes!_

I found the easiest way to do this was to `_.map` over the object and return the key and the value in an array, which we then sort and finally join with a comma.

``` coffeescript
# Just showing what _.uniq will base objets' uniqueness on:
_.map [{a:2, b:3}, {b:3, a:2}], (o) -> _.map(o, (v, k) -> [k, v]).sort().join(',')
# output: [ 'a,2,b,3', 'a,2,b,3' ]

# Actually finding the unique (enough) object.
_.uniq [{a:2, b:3}, {b:3, a:2}], (o) -> _.map(o, (v, k) -> [k, v]).sort().join(',')
# output: [ { a: 2, b: 3 } ]
```

Let's break that, honestly quite scary looking callback and make it more readable.


``` coffeescript
# Here is just the callback
callback = (o) -> _.map(o, (v, k) -> [k, v]).sort().join(',')

# Here it is again with better names:
callback = (object) -> _.map(object, (value, key) -> [key, value]).sort().join(',')

# Broken down, object is { b: 3, a: 2 }
callback = (object) ->
  # Create an array of each key value pair
  array = _.map(object, (value, key) -> [key, value])
  # current output: [ [ 'b', 3 ], [ 'a', 2 ] ]
  
  # Sort it using the native .sort method.
  sorted = array.sort()
  # current output: [ [ 'a', 2 ], [ 'b', 3 ] ]
  
  # Join all elements with a comma, thus creating a string of it.
  joined = sorted.join(',')
  # current output: 'a,2,b,3'
  
  # Return the joined string, which in the example is: 'a,2,b,3'
  return joined
```

As we the comparison is between two strings of two objects, we can make this less strict as well. Let's say you're working on an Angular project and it attaches a `$$hashKey?`, or the two objects have different `_id`'s, or whatever. We can  just filter those out. Or you might not care about casing? Throw a `.toLoweCase()` in there.

``` coffeescript
# Filter out '$$hashKey' from comparison.
_.uniq [{$$hashKey: 0, a:2, b:3}, {$$hashKey: 1, b:3, a:2}], (o) -> _.chain(o).map((v, k) -> [k, v]).filter((arr) -> '$$hashKey' not in arr).value().sort().join(',')
# outputs: [{"$$hashKey":0,"a":2,"b":3}]

# As the above is one of those "What are you doing?" one liners, here's a more readable version.
_.uniq [{$$hashKey: 0, a:2, b:3}, {$$hashKey: 1, b:3, a:2}], (o) ->
  _.chain(o)
  .map((v, k) -> [k, v])
  .filter((arr) -> '$$hashKey' not in arr)
  .value()
  .sort()
  .join(',')

# Where we don't care about letter casing.
_.uniq [{a:2, b:'aaa'}, {b:'AAA', a:2}], (o) -> _.map(o, (v, k) -> [k, v]).sort().join(',').toLowerCase()
# outputs: [{"a":2,"b":"aaa"}]

# Or more spread out
_.uniq [{a:2, b:'aaa'}, {b:'AAA', a:2}], (o) ->
  _.map(o, (v, k) -> [k, v])
  .sort()
  .join(',')
  .toLowerCase()
```

But what if there happen to be a comma in the key (_why would you do that?_) or the value, which somehow would make them seem as _equal_? Easy. Just join something really weird, like `_§_` or whatever you _think_ you can guarantee won't be in the data. 

Make sure to this time put the join inside the _.map function, as this will ensure the join characters are properly accounted for.

``` coffeescript
# It might be computer generated? I don't know?
_.uniq [{',a,': 'b', 'b': 'c'}, {',a':',b', 'b': 'c'}], (o) -> _.map(o, (v, k) -> [k, v]).sort().join(',')
# output: [{",a,":"b","b":"c"}]

# As these objects should not be equal, there will be two of them.
# Note I put the join inside _.map this time.
_.uniq [{',a,': 'b', 'b': 'c'}, {',a':',b', 'b': 'c'}], (o) -> _.map(o, (v, k) -> [k, v].join('_§_')).sort()
# outputs: [{",a,":"b","b":"c"},{",a":",b","b":"c"}]
```

_I'd like to add to this I have a strong feeling this method might be super bad performance wise, so I would recommend using another solution if performance is an issue._

To conclude, you can indeed filter out _duplicate_ objects using lodash, and quite nicely so as well.