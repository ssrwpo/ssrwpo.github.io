---
title: Introduction
---

**SSRWPO** - Server Side Rendering with Web Performance Optimization.

SSRWPO is a [Meteor](https://www.meteor.com) package for which adds a number of extremely desirable features:

* Server Side Rendering with a true TTL cache
* Data injection for the initial render on client
* Server-side routes and webhooks
* A Redux layer over Meteor publications to provide reactively as and when required
* Internationalisation
* Server-side redirects and 404 handing
* Support for Sitemaps and robots.txt files

Unlike existing solutions, SSRWPO doesn't monkey patch Meteor to provide this functionality. Instead,
SSRWPO is based around a set of standard web technologies:

* An Express Server
* React
* React-Router 4
* Redux
