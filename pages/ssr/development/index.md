---
title: Higher Order Components
---

This package provides some HOCs for common cases scenarios, all geared towards
performance.

## `pure`

Asymetric HOC for transforming a functional component into a `React.PureComponent` on the client
and leaving it unmodified on the server.

``` js
import React from 'react';
import { pure } from 'meteor/ssrwpo:ssr';

const MyComponent = (props) => ( ... );
export default pure(MyComponent);
```

## `asymetricSsr`

Same as `pure` except that it takes one or two components:

* When 2 components are used, the first one is rendered client side only, the
  second server side only. This allows changes of behavior while the app is
  loading, like for displaying a spinner or forbidding access to some functions.

* When one component is used, the server will not render the component
  (the no-SSR case) which only shows up on the client when React is started.

```js
import React from 'react';
import { asymetricSsr } from 'meteor/ssrwpo:ssr';
...
const Loading = () => <p>Loading</p>;
const Loaded = () => <p>Loaded</p>;
...
const LoadingStateWithServerDisplay = asymetricSsr(Loaded, Loading);
const LoadingStateWithout = asymetricSsr(Loaded);
...
```
