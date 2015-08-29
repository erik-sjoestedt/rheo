module.exports = Parse

var Rheo = require('./rheo')
var util = require('util')
var htmlparser2 = require('htmlparser2')
var Deque = require('double-ended-queue')

util.inherits(Parse, Rheo)

function Parse () {
  Rheo.call(this, {objectMode: true})
  this.queue = new Deque()
  this.open_stack = new Deque()
  this.parser = new htmlparser2.Parser({
    onopentag: this._onopentag.bind(this),
    onclosetag: this._onclosetag.bind(this),
    ontext: this._ontext.bind(this)
  })
}

Parse.prototype._onopentag = function (name, attrs) {
  var obj = {
    type: 'open',
    name: name,
    attrs: attrs
  }
  this.open_stack.push(obj)
  this.queue.enqueue(obj)
}

Parse.prototype._onclosetag = function (name) {
  var open = this.open_stack.pop()
  this.queue.enqueue({
    type: 'close',
    name: name,
    open: open
  })
}

Parse.prototype._ontext = function (text) {
  this.queue.enqueue({
    type: 'text',
    value: text
  })
}

Parse.prototype._transform = function (str, enc, cb) {
  this.parser.write(str)
  cb()
}

Parse.prototype._flush = function (cb) {
  this.parser.end()
  this.push(this.queue)
  cb()
}
