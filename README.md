# fn-proxy

Simple function proxying.

### Install

```
$ npm install fn-proxy
```

Run the specs (make sure `jasmine-node` is installed)

```
$ npm test
```

### Usage


Use `fn-proxy` to allow for point-free recursion in JavaScrpipt, or to simulate lazy evaluation.

`fn-proxy` takes in a function name and declaration, and returns a proxy to the original function.

#### Examples

Require the module

```js
var proxy = require('fn-proxy');
```

(all example use point free style functions, something like `ramda` or `lodash` would provide)

* Explicit proxy - save proxy after declaration

```js
var length = ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
);

proxy('length', length);
```

* Short had proxy chaining

```js
var length = ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
).proxy('length');
```

* Wrap declaration with proxy

```js
var length = proxy('length', ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
));
```
* Invoke the proxy directly

```js
proxy('length', ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail))
);

proxy('length')(<list>)
```
