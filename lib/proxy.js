var R = require('ramda');

var dropArgs = function(n) {
  return R.compose(R.drop(2), getArgs);
};

var getArgs = function() {
  return toArray(arguments);
};

var both = function(v1, v2) {
  return v1 && v2;
};

var toArray = function(o) {
  return Array.prototype.slice.call(o);
};

var proxies = {};

// Object -> String -> Function -> Function
var setProxy = R.partial(function(proxies, name, fn) {
  proxies[name] = fn;
  return fn;
}, proxies);

// Object -> String -> IO
var throwProxyError = function(proxies, name) {
  throw new Error('No established proxy for function: ' + name);
};

// Object -> String -> Function
var getProxy = R.partial(function(proxies, name) {
  return R.partial(useProxy, proxies, name);
}, proxies);

// Object -> String -> * -> *
var useProxy = R.ifElse(
  R.propOf, R.converge(R.apply, R.propOf, dropArgs(2)), throwProxyError
);

// String, (Function) -> Function
var proxy = R.ifElse(both, setProxy, getProxy);

Function.prototype.proxy = function(name) {
  return proxy(name, this);
};

module.exports = proxy;
