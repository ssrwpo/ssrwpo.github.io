---
title: Meteor Collections
---

In order to render your Meteor collections on the server, you will have added
them to the Redux store using `prepareStore`.

Once running on the client you may want to synchronize them when the application starts,
or when entering a page, or on a user action...

Since this is a common use case for Meteor, we provide an easy way to create
`mapDispatchToProps` methods for either subscribing to a publication or for calling a
method that will synchronize your collection store.

## Via subscribe: `createHandleSubscribe`

The subscribe / unsubscribe based synchronization helper will create a function that:

* pulls all the changes from the last render into the corresponding Redux store
* observes the Meteor publication and update the Redux Store every time there's a change.

Your component will therefore update when the store changes.

```js
/**
 * `createHandleSubscribe`
 * Create an `handleSubscribe` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param publicationName Your publication name which must
          accept an UNIX date value as `lastMod`.
 * @param cursor A cursor on Mongo collection with a `lastMod`
          set on each item.
 * @param valueStoreNameForSubscription Name of the value store
          identifying subscription state.
 * @param collectionStoreName Name of the collection store holding
          replica of collection.
 * @return A function allowing to subscribe and unsubscribe.
 */
```

#### Via validated method: `createHandleSyncViaMethod`

This will create a function that performs a one-off synchronisation of the Redux store with
a Meteor publication on-demand. This gives us reactivity-on-demand and can be used to significantly
save on server bandwidth compared to traditional Meteor subscriptions.

```js
/**
 * `createHandleSyncViaMethod`
 * Create an `handleSyncViaMethod` function for your
   `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param validatedMethod A validated method, promised based
 *  (see didericis:callpromise-mixin) that accepts { lastMod }
    as its params.
 * @param collectionStoreName Name of the collection store holding
   replica of collection.
 * @return A function allowing to subscribe and unsubscribe.
 */
```

Here's and example where we create a function to start subscribing to a publication. Note how we do this in the
`connect`:

````js
export default connect(
  state => ({
    buildDate: state.buildDate,
    PubSubStore: state.MyMeteorPublicationInAStore,
  }),

  dispatch => ({
    handleSubscribe: createHandleSubscribe(
      dispatch,
      'publicationName',
      MyMeteorPublication.find(),
      'isMyMeteorPublicationSubscribed',
      'MyMeteorPublicationInAStore',
    )
  }),
)(MyComponent);
````
