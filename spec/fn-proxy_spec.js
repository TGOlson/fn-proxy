'use strict';

var proxy = require('../lib/fn-proxy');

var R = require('ramda');

describe('fn-proxy', function() {
  var fnWasCalled,
      fnCallArgs,
      fn;

  function unknownProxyFor(fName) {
    return 'No established proxy for function "' + fName + '"';
  }

  beforeEach(function() {

    // require proxy each time to avoid caching between tests
    proxy.removeAll();

    fnWasCalled = false;
    fnCallArgs = undefined;

    fn = function() {
      fnWasCalled = true;
      fnCallArgs = arguments;
    };
  });

  it('should throw an error if the proxy is not defined', function() {
    expect(proxy('fn')).toThrow(unknownProxyFor('fn'));
  });

  it('should return the original function', function() {
    expect(proxy('fn', fn)).toBe(fn);
  });

  it('should expose a proxy to invoke a supplied function', function() {
    proxy('fn', fn);
    proxy('fn')();

    expect(fnWasCalled).toBe(true);
  });

  it('should invoke the proxy with all provided arguments', function() {
    proxy('fn', fn);
    proxy('fn')('a', 'b', [1, 2, 3]);

    expect(fnCallArgs).toEqual(['a', 'b', [1, 2, 3]]);
  });

  it('should be able to be chained with a function declaration', function() {
    fn.proxy('fn');

    proxy('fn')();
    expect(fnWasCalled).toBe(true);
  });

  it('should allow a proxied point free recursive function', function() {
    var length = proxy('length', R.ifElse(
      R.isEmpty, R.always(0), R.compose(R.inc, proxy('length'), R.tail)
    ));

    expect(length([])).toBe(0);
    expect(length([1, 2, 3, 4])).toBe(4);
  });

  it('should be able to remove a proxy', function() {
    proxy('fn', fn);
    proxy.remove('fn');
    expect(proxy('fn')).toThrow(unknownProxyFor('fn'));
  });

  it('should be able to remove all proxies', function() {
    proxy('fn', fn);
    proxy('fnClone', fn);

    proxy.removeAll();

    expect(proxy('fn')).toThrow(unknownProxyFor('fn'));
    expect(proxy('fnClone')).toThrow(unknownProxyFor('fnClone'));
  });
});
