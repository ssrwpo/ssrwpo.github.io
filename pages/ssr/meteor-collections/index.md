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

## Via subscribe: `createToggleSubscribe`

The subscribe / unsubscribe based synchronization helper will create a function that:

* replaces the current store data with that returned by the subscription.
* observes the Meteor publication and updates the Redux Store every time there's a change.

Your component will therefore update when the store changes.

```js
/**
 * `createToggleSubscribe`
 * Create an `handleSubscribe` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param publicationName Your publication name
 * @param cursor A cursor for the Mongo collection to synchronise
 * @param valueStoreNameForSubscription  Name of the value store with
          subscription state (true => subscribed, false => not subscribed).
 * @param collectionStoreName Name of the collection store holding
          replica of collection.
 * @return A function toggle the current subscription state.
 */
```

#### Via validated method: `createHandleSyncViaMethod`

This will create a function that performs a one-off synchronisation of the Redux store with
a Meteor publication on-demand by replacing the current store data with that
returned by the method. This gives us reactivity-on-demand and can be used to significantly
save on server bandwidth compared to traditional Meteor subscriptions.

```js
/**
 * `createHandleSyncViaMethod`
 * Create an `handleSyncViaMethod` function for your
   `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param validatedMethod A validated method which returns the entire
          collection to be synced.
 * @param collectionStoreName Name of the collection store holding
          replica of collection.
 * @return A function which takes the store and the parameters to send
           to the validated method, and which synchronizes the store with the
           collection return by the method.
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
    handleSubscribe: createToggleSubscribe(
      dispatch,
      'publicationName',
      MyMeteorPublication.find(),
      'isMyMeteorPublicationSubscribed',
      'MyMeteorPublicationInAStore',
    )
  }),
)(MyComponent);
````
