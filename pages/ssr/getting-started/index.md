---
title: Getting Started
---

## Installation in your own project

You can replace yarn by your favorite way of installing NPM packages.  
To install yarn : https://yarnpkg.com/en/docs/install  
To install "meteor yarn" : ```meteor npm i -g yarn```  

```sh
meteor yarn add react react-dom react-router-dom@4.0.0-beta.3 express helmet \
  react-helmet winston logatim receptacle useragent redux react-redux moment \
  react-intl react-intl-redux lodash actual url-pattern \
  electrode-react-ssr-caching
meteor add ssrwpo:ssr
```

## Configuration

### Universal logger

In your Meteor's settings under the `ssr` object, use the `loglevel` key for
settings the expected log level. Available values:

* **`debug`** Debugging and performance.
* **`info`** (default) Informations.
* **`warning`** Warnings and deprecation messages.
* **`error`** Errors.

### Recommended Babel configuration

For optimal results, set your `.babelrc` with the following content:
```json
{
  "presets": ["meteor"],
  "plugins": [
    "transform-class-properties",
    "transform-react-remove-prop-types",
    "transform-react-constant-elements",
    "transform-react-inline-elements",
    "transform-dead-code-elimination"
  ]
}
```

### Client side initialisation

```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
...
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An array of your redux middleware of choice
  appMiddlewares,
  // Optional: An array of your collection names
  appCursorNames,
  // Optional: Add a redux store that watches for URL changes
  hasUrlStore: true,
  // Optional: Localization
  localization,
})
.then(() => logger.info('Router started'));
```

### Server side initialisation
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
...
// Your MainApp as the top component rendered and injected in the HTML payload
createRouter(MainApp, {
  // Optional: A function that returns the content of your robots.txt
  robotsTxt,
  // Optional: An object describe route action and validator for url parameters
  routes,
  // Optional: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // Optional: An object with keys on route solver
  webhooks,
  // Optional: initial localization
  localization,
}, {
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: Store subscription
  storeSubscription,
});
logger.info('Router started');
```
