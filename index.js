function Caseless (dict) {
  this.dict = dict
}
Caseless.prototype.set = function (name, value, clobber) {
  if (typeof name === 'object') {
    for (var i in name) {
      this.set(i, name[i], value)
    }
  } else {
    if (clobber === undefined) clobber = true
    if (clobber || !this.has(name)) this.dict[name] = value
    else this.dict[this.has(name)] += ',' + value
    return this
  }
}
Caseless.prototype.has = function (name) {
  var lheaders = this.dict.map(function (h) {return h.toLowerCase()})
    ;
  name = name.toLowerCase()
  for (var i=0;i<lheaders.length;i++) {
    if (lheaders[i] === name) return lheaders[i]
  }
  return false
}
Caseless.prototype.get = function (name) {
  var result, re, match
  var headers = this.headers
  Object.keys(headers).forEach(function (key) {
    re = new RegExp(name, 'i')
    match = key.match(re)
    if (match) result = headers[key]
  })
  return result
}

module.exports = function (dict) {return new Caseless(dict)}