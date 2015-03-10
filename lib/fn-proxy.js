'use strict';

var R = require('ramda');

var toArray = function(o) {
  return Array.prototype.slice.call(o);
};

var getArgs = function() {
  return toArray(arguments);
};

var dropArgs = function(n) {
  return R.compose(R.drop(n), getArgs);
};

var both = function(v1, v2) {
  return v1 && v2;
};

var deleteKey = R.curry(function(o, prop) {
  return delete o[prop];
});

var proxies = {};

// Proxies -> String -> Function -> Function
var setProxy = R.partial(function(proxies, name, fn) {
  proxies[name] = fn;
  return fn;
}, proxies);

// Object -> String -> IO
var throwProxyError = function(proxies, name) {
  throw new Error('No established proxy for function "' + name + '"');
};

// Proxies -> String -> a -> a
var useProxy = R.ifElse(
  R.propOf, R.converge(R.apply, R.propOf, dropArgs(2)), throwProxyError
);

// Proxies -> String -> Function
var getProxy = R.partial(function(proxies, name) {
  return R.partial(useProxy, proxies, name);
}, proxies);


// String, (Function) -> Function
var proxy = R.ifElse(both, setProxy, getProxy);

Function.prototype.proxy = function(name) {
  return proxy(name, this);
};

proxy.remove = deleteKey(proxies);

proxy.removeAll = function() {
  R.map(proxy.remove, R.keys(proxies));
};

module.exports = proxy;
