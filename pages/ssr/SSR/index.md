---
title: SSR
---

Server-side rendering is done in two phases:

1. The top level React component is instantiated, and the component tree is walked in order
   to collate and perform any SSR requirements for your project, including preparing
   the Redux store.

   The tree-walking allows you to place code relevant to your components directly inside your
   components, rather than having to create a top-level per route configuration that would
   quickly become hard to maintain.

2. Once this has been done, and the Redux store has been hydrated, the page is rendered.

## SSR Requirements

Components can export SSR Requirements using an `ssr` property. These requirements can easily be
added to a functional component:

````javascript

const MainApp = (props) => (
  <div>...</div>
);

MainApp.ssr = {
  // SSR Requirement for the MainApp Component
  prepareStore: prepareGlobalStores,
};
````

or to a standard component:

````javascript
class CachableItem extends React.Component {
  static ssr = {
    // SSR Requirements
    cacheConfig: {
      strategy: 'simple',
      enable: true,
    },
  }

  ...
}
````

## Preparing the Redux store for rendering

There are essentially 2 ways in which components can hydrate the Redux store with data:

1. Inside `componentWillMount`.
2. By setting a `prepareStore` function on the `ssr` property.

### Hydrating the store in componentWillMount

The tree-walking code will call your component's `componentWillMount` function, so you can
use this as an opportunity to hydrate the store using the same code on both the client and the server.
In the following example we use a method call to initialise the store, and set a flag (on the store)
once this has been done.

````javascript
import { valueSet,
         createHandleSyncViaMethod } from 'meteor/ssrwpo:ssr';

class MyComponent extends PureComponent {

  componentWillMount() {
    const {
      isMyCollectionInitialised,
      markMyCollectionAsInitialised,
      myCollectionStore,
      handleSyncViaMethod,
    } = this.props;

    if (!isMyCollectionInitialised) {
      handleSyncViaMethod(0, myCollectionStore);
      markMyCollectionAsInitialised();
    }
  }

  render() {
    // `myCollectionStore` won't be up-to-date - we can't
    // render the data we've just prepared.
  }
}

export default connect(
  state => ({
    buildDate: state.buildDate,
    myCollectionStore: state.myCollectionStore,
    isMyCollectionInitialised: state.isMyCollectionInitialised,
  }),

  dispatch => ({
    markMyCollectionAsInitialised() {
      dispatch(valueSet('isMyCollectionInitialised', true));
    },
    handleSyncViaMethod: createHandleSyncViaMethod(
      dispatch,
      valuesFromLastMod,
      'myCollectionStore',
    ),
  }),
)(MyComponent);
````

Note that since `isPubSubInitialised` is a store value it will be sent to the client, so
the client will know if the data has already been initialised on the server.

This is clean and simple solution, and it's ideal for many use cases. However, there are two caveats:

* The data must be available **synchronously**.
* The prepared store data won't be available to the component itself via the property passed using
  `connect`, so you **won't be able to render components based on this data**.
  On the other hand if you're preparing global data for any child components then this is
  the simplest solution.

### Hydrating the store with ssr.prepareStore

During the tree-walk we'll look for a `prepareStore` function on the `ssr` property.
If supplied, the function is called to prepare the store with the data required for
rendering the component. The function is passed store and the current
`props` and `context` (but see the caveat below), and may return one of 3 values:

* `true` to indicate that the store was updated.
* `false` to indicate that no changes were made.
* A `Promise` that will prepare the store asynchronously. In this case server will wait for the Promise
  to return before continuing, allowing you to include data from asynchronous sources.

The key difference with this approach relies on a subtlety that is **very important to understand**.
Let's take this example:

````javascript

import omit from 'lodash/omit';
import { valueSet, collectionAdd } from 'meteor/ssrwpo:ssr';

class MyComponent extends PureComponent {
  static ssr = {
    prepareStore: (store, props, context) => {
      const { isMyCollectionInitialised } = store.getState();
      if (!isMyCollectionInitialised) {
        MyCollection.find({}, { sort: { lastMod: -1 } }).fetch().forEach((ps) => {
          store.dispatch(collectionAdd('PubSub', ps._id, omit(ps, '_id')));
        });
        store.dispatch(valueSet('isMyCollectionInitialised', true));
        return true;
      }

      return false;
    },
  }

  render() {
    // Data rendered from `myCollectionStore`
  }
}

export default connect(
  state => ({
    myCollectionStore: state.MyCollection,
  }),
)(MyComponent);
````

We can see that the `connect` will pass the contents of the store to `MyComponent`. The fact that that store
is updated during the tree-walk wouldn't affect the properties that have already been passed in (this is the
same caveat that we have when preparing the store in `componentWillMount`). That should mean that we
can't render data from our prepared store.

However, `connect` will hoist up any non-React statics, so in fact **it's on the  `connect` component
`prepareStore` will be called**. That means that `MyComponent` will receive the contents of the store via the
`props`, and the page will be rendered correctly. It also means that the tree-walk can continue into
any components rendered using this data.

There are a couple of caveats to bear in mind:

1. The `props` and `context` passed to `prepareStore` are the same as those passed to the `connect`,
   since the `prepareStore` is on that component. Any properties that you create in the connect call
   (e.g. `myCollectionStore` in the example) won't be available.

2. Although `connect` hoists the static `ssr`, it still exists in your component, so the tree-walk will
   call it again! You should protect your function against preparing the store twice by using a store
   value flag (`isMyCollectionInitialised`). That might seem like extra work that we could have somehow
   avoided you, but that flag is about to become doubly useful...

#### Hydrating the store on the client

Using `prepareStore` will ensure that the store is ready for server-side rendering, and it will also sent the
store in the HTML payload so that it's already available on the client.

But what happens if we actually rendered a different route on the server, and afterwards we move to the route
containing `MyComponent`? In this case we'll need return to the classic use-case, and we'll need to
initialise the store on the client. Here, for example, we'll update the store using a method helper:

````javascript
  componentWillMount() {
    const {
      isMyCollectionInitialised,
      markPubSubAsInitialised,
      myCollectionStore,
      handleSyncViaMethod,
    } = this.props;

    // It's important that we don't call this on the server,
    // since prepareStore is handling that case.
    if (Meteor.isClient && !isMyCollectionInitialised) {
      handleSyncViaMethod(0, myCollectionStore);
      markMyCollectionAsInitialised();
    }
  }

  ...

export default connect(
  state => ({
    buildDate: state.buildDate,
    myCollectionStore: state.myCollectionStore,
    isMyCollectionInitialised: state.isMyCollectionInitialised,
  }),

  dispatch => ({
    markMyCollectionAsInitialised() {
      dispatch(valueSet('isMyCollectionInitialised', true));
    },
    handleSyncViaMethod: createHandleSyncViaMethod(
      dispatch,
      valuesFromLastMod,
      'myCollectionStore',
    ),
  }),
)(MyComponent);
````

Note once again the importance of `isMyCollectionInitialised`. If the server had rendered
this page then `isMyCollectionInitialised` will be true and we won't have to do it again
on the server. If not, then we'll need to do it ourselves.
