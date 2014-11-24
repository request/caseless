var tape = require('tape')
  , caseless = require('./')
  ;


tape('set get has', function (t) {
  var headers = {}
    , c = caseless(headers)
    ;
  t.plan(18)
  c.set('a-Header', 'asdf')
  t.equal(c.get('a-header'), 'asdf')
  t.equal(c.has('a-header'), 'a-Header')
  t.ok(!c.has('nothing'))
  // old bug where we used the wrong regex
  t.ok(!c.has('a-hea'))
  c.set('a-header', 'fdsa')
  t.equal(c.get('a-header'), 'fdsa')
  t.equal(c.get('a-Header'), 'fdsa')
  c.set('a-HEADER', 'more', false)
  t.equal(c.get('a-header'), 'fdsa,more')

  t.deepEqual(headers, {'a-Header': 'fdsa,more'})
  c.swap('a-HEADER')
  t.deepEqual(headers, {'a-HEADER': 'fdsa,more'})

  c.set('deleteme', 'foobar')
  t.ok(c.has('deleteme'))
  t.ok(c.del('deleteme'))
  t.notOk(c.has('deleteme'))
  t.notOk(c.has('idonotexist'))
  t.ok(c.del('idonotexist'))

  c.set('tva', 'test1')
  c.set('tva-header', 'test2')
  t.equal(c.has('tva'), 'tva')
  t.notOk(c.has('header'))

  t.equal(c.get('tva'), 'test1')

  t.equal(exports.detect().length, 0)

})

// taken from https://github.com/hapijs/lab/blob/10fb7f4abce30394c0f3a8581274c323638971b7/lib/leaks.js
exports.detect = function () {

  var whitelist = {
    _labScriptRun: true
    , prop: true

    // Enumerable globals
    , setTimeout: true
    , setInterval: true
    , setImmediate: true
    , clearTimeout: true
    , clearInterval: true
    , clearImmediate: true
    , console: true
    , Buffer: true
    , process: true
    , global: true
    , GLOBAL: true
    , constructor: true
    , ArrayBuffer: true
    , Int8Array: true
    , Uint8Array: true
    , Uint8ClampedArray: true
    , Int16Array: true
    , Uint16Array: true
    , Int32Array: true
    , Uint32Array: true
    , Float32Array: true
    , Float64Array: true
    , DataView: true
    , __$$labCov: true
    , gc: true

    // Non-Enumerable globals
    , Array: true
    , isNaN: true
    , ReferenceError: true
    , Number: true
    , RangeError: true
    , EvalError: true
    , Function: true
    , isFinite: true
    , Object: true
    , undefined: true
    , Date: true
    , SyntaxError: true
    , String: true
    , eval: true
    , parseFloat: true
    , unescape: true
    , Error: true
    , encodeURI: true
    , NaN: true
    , RegExp: true
    , encodeURIComponent: true
    , Math: true
    , decodeURI: true
    , parseInt: true
    , Infinity: true
    , escape: true
    , decodeURIComponent: true
    , JSON: true
    , TypeError: true
    , URIError: true
    , Boolean: true
  }

  // Harmony features.

  if (global.Promise) {
    whitelist.Promise = true
  }

  if (global.Proxy) {
    whitelist.Proxy = true
  }

  if (global.Symbol) {
    whitelist.Symbol = true
  }

  if (global.Map) {
    whitelist.Map = true
  }

  if (global.WeakMap) {
    whitelist.WeakMap = true
  }

  if (global.Set) {
    whitelist.Set = true
  }

  if (global.WeakSet) {
    whitelist.WeakSet = true
  }

  if (global.DTRACE_HTTP_SERVER_RESPONSE) {
    whitelist.DTRACE_HTTP_SERVER_RESPONSE = true
    whitelist.DTRACE_HTTP_SERVER_REQUEST = true
    whitelist.DTRACE_HTTP_CLIENT_RESPONSE = true
    whitelist.DTRACE_HTTP_CLIENT_REQUEST = true
    whitelist.DTRACE_NET_STREAM_END = true
    whitelist.DTRACE_NET_SERVER_CONNECTION = true
    whitelist.DTRACE_NET_SOCKET_READ = true
    whitelist.DTRACE_NET_SOCKET_WRITE = true
  }

  if (global.COUNTER_NET_SERVER_CONNECTION) {
    whitelist.COUNTER_NET_SERVER_CONNECTION = true
    whitelist.COUNTER_NET_SERVER_CONNECTION_CLOSE = true
    whitelist.COUNTER_HTTP_SERVER_REQUEST = true
    whitelist.COUNTER_HTTP_SERVER_RESPONSE = true
    whitelist.COUNTER_HTTP_CLIENT_REQUEST = true
    whitelist.COUNTER_HTTP_CLIENT_RESPONSE = true
  }

  var leaks = []
  var globals = Object.getOwnPropertyNames(global)
  for (var i = 0, il = globals.length; i < il; ++i) {
    if (!whitelist[globals[i]] &&
      global[globals[i]] !== global) {

      leaks.push(globals[i])
    }
  }

  return leaks
}
