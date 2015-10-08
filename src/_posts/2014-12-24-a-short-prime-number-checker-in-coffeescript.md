---
layout: post
date: 2014-12-24
title: A short prime number checker in CoffeeScript
categories: codesnippets coffeescript prime numbers
---

_Note: this is a copy paste from my old WordPress blog_

It has been so, so long now! I have not really written much in a while, mainly because I have not had anything to write about either. I feel it is about time I put something new up! And what better, than something about CoffeeScript? I love coffee. Like, a lot. Thus, writing in CoffeeScript should come just natural. Really, it is because I might be working with it early next year, but hey. Coffee!

<!--more-->

Also, today is Christmas Eve, the big day of Christmas in Sweden, which is where I currently am. So, obviously, writing a short blog post is a lovely idea! The 24th of December every year, at 3 PM, Sweden gets completely turned off for an hour, while we all watch [From All of us to All of You](https://en.wikipedia.org/wiki/From_All_of_Us_to_All_of_You). Apparently, more than half of Sweden’s population watched it in 1997, and it has been running since 1959.

#### What about the CoffeeScript?

As I was saying, coffee… Wonderful, coffee… I absolutely love coffee. Thus, teaching myself CoffeeScript is great! I also have this strange love for prime numbers. [Numberphile has a great playlist on primes](https://www.youtube.com/playlist?list=PL0D0BD149128BB06F) which I have been watching, because prime numbers are awesome! Thus, writing a simple prime checker is fun, and because I am teaching myself a new language, it is a great way to learn!

Now, CoffeeScript is this really cool language which compiles to JavaScript. Its Syntax is highly weird – extremely verbose – yet quite cool. I must say I kind of like using it, though setting it up was slightly annoying. On the flip side, I now know how to use [Cygwin](https://www.cygwin.com/) quite well. I think. Probably not. But whatever.

#### First some maths

As I said, I built this simple prime number checker. For those of you who does not know what a prime number is, it is an integer which can only be divided by itself and one. An integer is a number without those weird dots (or commas if you use a comma) and the strange extra numbers called decimals.

For instance, seven is a prime as it cannot be divided by anything else than itself or one (without getting decimals, that is). 7/1 = 7; 7/2 = 3.5; 7/3 = 2.333…34; 7/4 = 1.75; 7/5 = 1.4; 7/6 = 1.666…67; and lastly 7/7 = 1. So, seven can only be divided by itself or one to return an integer.

The above is useful, as we, to see if a number is a prime, want to try every number below itself (well, kind of…) and see if the quotient is an integer (back to basic math: numerator/denominator = quotient). To do this, I feel the introduction of the modulus operator is necessary. Most programming languages, including CoffeeScript, uses the % sign.

In short, modulus gives the remainder between two numbers. For example, 5 % 3 gives 2, so does 7 % 5, and 8 % 3. This is super useful, because if you use a number % 1, and a number is an integer, you will always get 0, as there will be no remainder. This is super nice to know, because if the remainder is not 0, the first number cannot be an integer.

#### Let us begin the coding

Now that we know the maths, kind of, the actual coding can begin! I wrote this short little snippet which adds the first N primes. I know this is not the optimal way to do it, but it does the job.

For this I have created three methods, one that checks whether a number is a prime called isPrime, one method to get the current time, called currentTime and a final one just to get the primes called getPrimes. I will let the code speak for itself, with only a few comments. I think you will understand why.

```coffeescript
isPrime = (num) ->
  # If the number is either 2 or 3, it's a prime number
  return true if num is 2 or num is 3
  # 1 and 0 doesn't count as prime numbers
  return false if num is 1 or num is 0
  # If it's an even number, it's not a prime number (because if it's 2, it's already been true)
  return false if num % 2 is 0

  # Check every uneven number up until half of the number
  # (you cannot divide a number with anything greater than half of it and still get an integer)
  for i in [3...num / 2] by 2
    # If the quotient is 0, it has found a denominator, thus it's not a prime
    return false if (num / i) % 1 is 0

  # If it hasn't returned false already, it's a prime number!
  return true

currentTime = (date) ->
  hours = date.getHours()
  minutes = date.getMinutes()
  seconds = date.getSeconds()
  return "#{hours}:#{minutes}:#{seconds}"

getPrimes = (numberOfPrimes) ->
  _then = new Date
  console.log "Start time: #{currentTime(_then)}"

  primes = []
  x = 0

  while primes.length < numberOfPrimes
    if isPrime x
      primes.push x
    x++
  now = new Date
  console.log "End time: #{currentTime(now)}"

  console.log "It took #{now - _then} milliseconds"
  return primes

p = getPrimes(15000)

console.log p[p.length - 10...]
```

I am too tired to write a conclusion, sorry for that. And Merry Christmas, happy holidays and thank you for reading!