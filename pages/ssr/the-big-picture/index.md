---
title: The Big Picture
---

SSRWPO's solution to server-side rendering using Meteor is opinionated about the technologies
used to build your web app, relying on [Express](http://expressjs.com), [React](https://facebook.github.io/react/),
[Redux](http://redux.js.org) and [React Router 4](https://reacttraining.com/react-router/). This allows
us to solve the problem in an elegant and understandable way that doesn't involved monkey-patching Meteor
or any other deep magic.

This is essentially what happens:

1. **SSR** uses Express to create web server, and serves your Meteor application from `/`.

2. Before rendering your application on the server, we traverse your React hierarchy
   so that you can prepare the Redux store with any data you'll need to render the route.
   The store would typically be prepared with data from a Mongo collection, but it can actually come from anywhere,
   and it can even be fetched asynchronously.

3. The application is rendered on the server using the Redux store that was prepared previously. We just call
   React's `renderToString` on something similar to this (where `StaticRouter` is provided by React Router 4):

   ````js
   <Provider store={store}>
     <StaticRouter location={url} context={routerContext}>
       <MainApp />
     </StaticRouter>
   </Provider>
   ````

   This store is also injected into the rendered HTML payload so that you have the exact same data available for
   rendering on the client.

4. The route is cached using [Receptacle](https://github.com/DylanPiercey/receptacle) so that the server isn't weighed
   down with server-side rendering. For those wishing to squeeze the best possible performance out of the server,
   there's also an integration with [Electrode's SSR Caching module](https://github.com/electrode-io/electrode-react-ssr-caching)
   for React component level caching.

5. On the client a Redux store is initialised with the the data in the HTML payload, React is initialised, and everything
   just works.

## Flexibility

This simple but powerful approach gives us a lot of flexibility. We can use express to easily provide web-hooks,
we can control caching, handling internationalisation and more. This is Meteor like you've never known it before.

## Redux? What about Meteor publications and reactivity?

Trying to render Meteor publications directly on the server requires monkey-patching Meteor and that deep magic that
we're trying to avoid. That is the path of darkness, lock-in and abandoned Router/SSR projects that leave us all stranded
without an SSR solution every time Meteor is updated.

SSRWPO takes a much simpler and more flexible approach using modern technologies that have been embraced by thousands
of web applications.

However, it would be criminal indeed not to benefit from Meteor's reactive publications. Now, React and Redux already
provide us with reactivity, we just need a way to link up our Redux store with a Meteor publication. SSRWPO provides helper
functions to do exactly this: `createHandleSubscribe` and `createHandleSyncViaMethod`.

Take a look at [Meteor Collections](../meteor-collections/) for more information.
