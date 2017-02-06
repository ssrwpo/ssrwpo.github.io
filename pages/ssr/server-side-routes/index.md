---
title: Server side routes
---

## Robots.txt and Sitemap.xml

To set up your robots.txt, you need to have the key `robotsTxt` inside the object
that you pass to the server-side `createRouter` function. This key should contain
a function that returns a string with the desired content of your robots.txt.

The same principle applies to sitemap.xml, with the key `sitemapXml`.

Both functions will receive the store as the first parameter. This allows you to
programmatically build your sitemap.xml or robots.txt based on the store contents.  

For example, you can populate your sitemap.xml of dynamic routes generated based
on the store data. You can see examples of building these functions here:  
* [Robots.txt](https://github.com/ssr-server/ssr/blob/master/demo/server/robotsTxt.js "Robots.txt builder")  
* [Sitemap.xml](https://github.com/ssr-server/ssr/blob/master/demo/server/sitemapXml.js "Sitemap.xml builder")

For easing the sitemap creation, a convenient tool `sitemapFromArray` accepts an array
of objects with the following keys:

* `slug`: A mandatory relative URL to a page
* `lastmod`: An optional `Date`
* `changefreq`: An optional frequency of robot's revisiting with the following allowed values:
  `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
* `priority`: An optional priority when search engine are displaying your map.
  When none provided, robots are using 0.5. This value range from 0 to 1.

To use it:
```js
// Server side only
import { sitemapFromArray } from 'meteor/ssrwpo:ssr';
...
const sitemapContent = sitemapFromArray([
  // The home
  { slug: '', lastmod: new Date(), priority: 1 },
  // A frequently changed news page
  { slug: 'news', changefreq: 'hourly' },
  // ...
]);
```


### 404 - Not found route
`react-router` will always render your application. For identifying a `404`, you
have to tell to the server that while rendering the app, one of the displayed
component is due to a `404`. This is achieved via the `react-router`'s `staticContext`
and by setting into it a `has404` boolean used by the server to identify the route
as `404` Not found route.

Example: [NotFound](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/NotFound.jsx)

## Web hooks

By passing a `webhooks` object, you can build your own server side routes powered
by Express. A small example is setup in the [demo](https://github.com/ssr-server/ssr/blob/master/demo/server/webhooks.js).
