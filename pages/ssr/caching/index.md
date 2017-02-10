---
title: SSR Caching
---

## Page caching

Pages rendered by the server are cached based on the url, the language being rendered
and the platform (android, iPhone, iPad, etc).

Once a page has been cached, it's cached indefinitely until the server restarts, or
until your application resets the cache.

This gives you complete control over when the cache should be reset. You many only
need to refresh daily for SEO purposes, for example, thus reducing the server load.
If you're rendering data from an external source, you can control how regularly you
wish to have the cached data refreshed.

A simple strategy may be to simply reset the cache every time one of your Meteor collections
is changed:

````javascript
import { createRouter, resetSSRCache } from 'meteor/ssrwpo:ssr';

const localization = {
  languages: ['en', 'tr', 'fr'],
  fallback: 'en',
};

// Your MainApp as the top component rendered and injected
// in the HTML payload. Note that since we're passing in a
// localization object, pages will be cached on a per
// language basis
createRouter(MainApp, { localization }, {});

// Reset the SSR cache when any collection changes
const globalCollections = [Folks, Places, PubSub];
globalCollections.forEach((collection) => {
  let initializing = true;
  collection.find().observeChanges({
    added: () => { if (!initializing) resetSSRCache(); },
    changed: () => resetSSRCache(),
    removed: () => resetSSRCache(),
  });
  initializing = false;
});
resetSSRCache();
````

## Component level caching

If you wish to squeeze the absolute best performance out of your server, you may also
choose to cache individual react components. We use
[electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)
for this purpose, and you should the read the project's own documentation.

Note that `electrode-react-ssr-caching` requires us to supply an object containing
the component cache strategies for every component that you wish to cache.
Such global configurations are hard to maintain since it's east to forget about them
when working on a component. Wouldn't it be nice if you could supply this information at
the component level, rather than having it placed elsewhere in your code where
it's easily forgotten?

Since we do tree-walking, we can let you do exactly that:

````javascript
class CachableItem extends React.Component {
  static ssr = {
    cacheConfig: {
      strategy: 'simple',
      enable: true,
    },
  }

  ...
}
````

The `cacheConfig` is exactly the same as the one expected by `SSRCaching.setCachingConfig`,
and you should reference the [documentation](https://github.com/electrode-io/electrode-react-ssr-caching)
for more information.

We collect all the `cacheConfig` objects for the route being rendered and turn on caching
for you. Note that this only work in production, so you need to run Meteor in production mode
to test this feature:

````
meteor run --production
````

Note also that calling `resetSSRCache` will **not** reset the component cache. This means that even
if you have to reset your page cache, you won't lose those hard-earned component caches.
