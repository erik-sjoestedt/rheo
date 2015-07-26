var select = require('html-select')
var river = require('./')

replace.inner = inner
replace.outer = outer
replace.attribute = attribute
replace.attributes = attributes
module.exports = replace

function replace (selector, opts, cb) {
  return select(selector, function (elem) {
    var stream = elem.createStream(opts)
    cb(river.mixin(stream)).pipe(stream)
  })
}

function inner (selector, cb) {
  return replace(selector, {inner: true}, cb)
}

function outer (selector, cb) {
  return replace(selector, {}, cb)
}

function attribute (selector, attr, cb) {
  return select(selector, function (element) {
    var value = element.getAttribute(attr)
    var new_value = cb(value)
    element.setAttribute(attr, new_value)
  })
}
function attributes (selector, obj) {
  return select(selector, function (element) {
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        var value = element.getAttribute(attr)
        var new_value = obj[attr](value)
        element.setAttribute(attr, new_value)
      }
    }
  })
}
