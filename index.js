function Caseless (dict) {
  this.dict = dict
}
Caseless.prototype.set = function (name, value, clobber) {
  if (typeof name === 'object') {
    for (var i in name) {
      this.set(i, name[i], value)
    }
  } else {
    if (typeof clobber === 'undefined') clobber = true
    var has = this.has(name)

    if (!clobber && has) this.dict[has] = this.dict[has] + ',' + value
    else this.dict[has || name] = value
    return has
  }
}
Caseless.prototype.has = function (name) {
  var keys = Object.keys(this.dict)
    , name = name.toLowerCase()
    ;
  for (var i=0;i<keys.length;i++) {
    if (keys[i].toLowerCase() === name) return keys[i]
  }
  return false
}
Caseless.prototype.get = function (name) {
  var result, re, match
  var headers = this.dict
  Object.keys(headers).forEach(function (key) {
    re = new RegExp(name, 'i')
    match = key.match(re)
    if (match) result = headers[key]
  })
  return result
}
Caseless.prototype.swap = function (name) {
  var has = this.has(name)
  if (!has) throw new Error('There is no header than matches "'+name+'"')
  this.dict[name] = this.dict[has]
  delete this.dict[has]
}

module.exports = function (dict) {return new Caseless(dict)}
