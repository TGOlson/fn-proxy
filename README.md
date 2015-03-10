# fn-proxy

Simple function proxying. Allows for point-free recursion in JavaScrpipt, and simulation of lazy function evaluation.

### Install

```
$ npm install fn-proxy
```

Run the specs (make sure `jasmine-node` is installed)

```
$ npm test
```

### Usage

Require the module

```js
var proxy = require('fn-proxy');
```

##### Examples

(all example use point free style functions, something like `ramda` or `lodash` would provide)

* Explicit proxy - save proxy after declaration

```js
var length = ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
);

proxy('length', length);

length([]) // => 0
length([1, 2, 3, 4]) // => 4
```

* Short had proxy chaining

```js
var length = ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
).proxy('length');

length([]) // => 0
length([1, 2, 3, 4]) // => 4
```

* Wrap declaration with proxy

```js
var length = proxy('length', ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail)
));

length([]) // => 0
length([1, 2, 3, 4]) // => 4
```
* Invoke the proxy directly

```js
proxy('length', ifElse(
  isEmpty, always(0),
  compose(inc, proxy('length'), tail))
);

proxy('length')([]) // => 0
proxy('length')([1, 2, 3, 4]) // => 4
```
