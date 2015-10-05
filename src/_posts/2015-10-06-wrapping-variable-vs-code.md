---
layout: post
date: 2015-10-06
title: Wrapping-variable snippets in Visual Studio Code
categories: codesnippets vscode vs code
---

This will be just a short post on the topic of wrapping-variable snippets.

<!--more-->

I just thought I'd quickly get this into words, as I found something I wanted to share.

Because of Atom not properly working on my computer, it just kept crashing and being horribly slow - sort of like in the olden days - I've made the switch to Visual Studio Code I'm absolutely loving it

Since version v0.3.0, where they added multi-cursor via `Ctrl+D` to select next (which to me is a game breaker if I can't have), VS Code has actually been fully usable. Sure, I do miss indentation guides (especially for CoffeeScript), but I can manage without it.

_Now that that's out of the way, let's get to what I wanted to talk about, wrapping-variable snippets!_

I might have gotten the name wrong, but this is essentially what it is - a snippet with wrapping variables. Let me explain. Oftentimes when i write `require`s in Node.js, I tend to want to name the variable to either the same as the package (as with gulp), sometimes I want something similar (like with iconv-lite used as iconv) or something completely different (like bluebird used as Promise). I could just always write the code, but I'm lazy. I could also create multiple snippets for the various cases, but that seems like too much work.

Luckily, creating multiple snippets is unnecessary, you can literally just wrap a variable with another.

_Faboluous!_

Here is the snippet I wrote.

``` json
{
  "Wrapping-variable require": {
    "prefix": "_req",
    "body": [
      "var ${1:module} = require('${2:${1:module}}');"
    ]
  }
}
```