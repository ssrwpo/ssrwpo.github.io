---
title: Reducers
---

The  **SSR** project exports a number of useful Redux
[Reducers](http://redux.js.org/docs/basics/Reducers.html#reducers) that you can use.

## Platform detection

For the initial render, your app may require some defaults to ensure that
it will serve retina images or use a specific layout for a platform.

The platform reducer adds the `platform` value to the store:

* `android`: Any tablet or phone with Android using Chrome or the built-in browser.
* `ipad`:  Any Apple iPad.
* `iphone`: Any Apple iPhone.
* `safari`: Any MacOS Safari (not iPhone or iPad).
* `ie`: Any Internet Explorer before Edge.
* `default`: All the other browsers and devices.

By default, a `platformTransformers` reducer is also provided that adds 4
values to the store:

* `retina`
* `mobile`
* `viewportWidth`
* `viewportHeight`

It only applies to server side rendering. When your client side app is rendered, you can patch
the default values that the server has injected with a built-in component:

`<BrowserStats retinaMinDpi={<number>} mobileBreakpoint={<number>} debounceTimer={<number>} />`

where :

* `retinaMinDpi`: 144, by default (1.5 x 96 in dpi).
* `mobileBreakpoint`: 992, by default (in px).
* `debounceTimer`: 64, by default (4 x 16 in ms).

If you want to build your own `platformTransformers` and `<BrowserStats/>`, please
refer to the following sources for inspiration:

* [`platformTransformers`](https://github.com/ssr-server/ssr/blob/master/server/utils/platformTransformers.js).
* [`<BrowserStats />`](https://github.com/ssr-server/ssr/blob/master/shared/components/BrowserStats.jsx)

## Build date

Each produced HTML payload is tagged with a build date which is used when synchronising
data from the server. The reducer is named `buildDate` and it contains a UNIX date.

## Reducer helpers

We also export some helpers which will create reducers for you:

* `createCollectionReducers` will create a reducer which allows you to add, change and remove an item
  from an array. We use this to shadow Meteor collections using Redux. Three actions are provided to allow
  you to update store collections:

  * `collectionAdd`
  * `collectionChange`
  * `collectionRemove`

* `createValueReducer` will create an object in the store which you can modify with:

  * `valueSet`
  * `valueReset`

See [the implementations](https://github.com/ssr-server/ssr/blob/master/shared/reducers/utils)
for more information.
