---
layout: post
date: 2015-03-06
title: Filtering CollectionViewSource
categories: codesnippets c# wpf
---

I guess this is the first <em>real</em> post on this blog? And really, the first actual post about <em>really anything</em> in a little while for me, <a target="_blank" href="https://ostlundk.wordpress.com/2014/12/24/code-snippets-a-short-prime-number-checker/#more-532">since Christmas Eve</a> apparently. This post is about how to filter a CollectionViewSource in WPF using C#.

Recently I decided to refactor parts of the code base I have been working on for the last few months. This software relies heavily on a few ``ObservableCollection<Person>``, where ``Person`` is a custom class for this specific project.

One is the <em>main collection</em>, carrying every object available to the user. Another collection is a subset of the first, where every element fulfilled a <em>specific criteria</em>. Each collection is also set as the source for separate ``CollectionViewSource``s as ``DataContext`` for its own control. In the actual application I also used a third list, but for this example, it really is not of interest.

<!--more-->

<em>For just the code examples that worked, see end of post.</em>

## Some code

For simplicities sake, I will use the class ``Person``, which has two properties: ``Name`` and ``IsValid``. It looks something like this:

<script src="https://gist.github.com/kristofferostlund/757237d333790faeefbc.js"></script>

And the ``ObservableCollection<Person>``s, and a few instances of ``Person``:

<script src="https://gist.github.com/kristofferostlund/20dfdbf2d8d8fc4f31b9.js"></script>

Now, for the subset collection to hold an object from the main collection, the property ``IsChosen`` had to be ``true``. My prior attempt at doing this, which <em>sort of worked</em>, relied on a checkbox being checked, which on changing status either added or removed said item to the subset collection. Really, it worked just fine for smaller collections, but when the list of people grew larger, only checkboxes visible to the user triggered the ``Checked`` or ``Unchecked`` events. This became a problem when a <em>master checkbox</em> was added, which could check and uncheck every checkbox.

As I never have actually filtered anything in C# before, at least not without writing ugly workarounds, I went looking around to see what others suggest. The first thorough answer I found was this, <a href="http://www.abhisheksur.com/2010/08/woring-with-icollectionviewsource-in.html">very thorough explanation of CollectoinViews written by Abhishek Sur</a>. Translated into this example, we got the following code:

<script src="https://gist.github.com/kristofferostlund/c6226f57f7fe96c2ed96.js"></script>

While I am used to declaring controls' ``DataContext`` as ``new CollectionViewSource { Source = source };``, he suggests using ``CollectionViewSource.GetDefaultView(mainCollection)`` instead, as it exposes ``ICollectionView.Filter``, which can then be used to return objects where a something is ``true``. In this case it would be ``IsChosen``.

This is where I figured I might just need one collection, as the second list <em>really only was a filtered version</em> of the main collection, it can be just that. The initial list with a filter applied.

Sadly, this was not the solution for me. It works great, it really does filter the collection, but what I found was this applied the filter to the original list as well. So, now both controls were essentially mirrored. <b>The above solution works fine if only one collection would have been used, though</b>.

## The solution

As I needed <em>two collections</em>, one displaying every element, and one displaying only a subset of these, I had to find another solution. While <del>copying his solution</del> learning, I first missed to assign the ``DataContext`` to ``CollectionViewSource.GetDefaultView(mainCollection)``, and instead went with my default, being ``DataContext = new CollectionViewSource { Source = mainCollection }``, intellisense still gave me an option to filter it. I did not get the same code as he got. 

<em>No, no!</em>

Given, the code was similar, but not the same. He used a delegate point to a predicate, which would return either ``true`` or ``false`` depending on some condition. What intellisense was suggesting was a lambda expression calling a method upon an event being called. After the first method did not give the desired result, I went back to try this one out, in hopes it would apply the filter only to this specific ``CollectionViewSource``, which it luckily also did!

As the event calls a method of type ``void``, there were no returning ``true`` of ``false`` to be had. Instead, I had access to two parameters: ``sender`` and ``args``, and usually the latter exposes a property ``Item``. I also found a property ``args.Accepted``, which sounded interesting.

Boy, was I right! And the item returned was of type ``Person``! Woo!

So, this time I assigned the controls ``DataContext`` to a ``new CollectionViewSource`` with its source set to ``mainCollection``, and then upon the filter event, set ``args.Accepted`` to the value of ``person.IsChosen``. 

 It worked!

<script src="https://gist.github.com/kristofferostlund/a68a6bb2cf0d53aa9aa7.js"></script>

It is entirely possible to filter a ``CollectionViewSource``, and it is rather simple as well! While writing this, I felt rather stupid, finding the second item on Google was the <a target="_blank" href="https://msdn.microsoft.com/en-us/library/system.windows.data.collectionviewsource.filter(v=vs.110).aspx">MSDN page about it</a>. I solely blame it on me being really tired and slightly unfocused as I was over Skype with a couple of friends while coding.

Setting a the ``DataContext`` of a control to ``new CollectionViewSource`` and settings its source to <em>really any enumerator</em> allows for filtering this specific instance of ``CollectionViewSource`` via an event. 

Kris
