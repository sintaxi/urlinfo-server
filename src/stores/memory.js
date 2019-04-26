
var Thug       = require("thug")
var records    = {}

module.exports = function(){

  var store = new Thug()

  store.constructor.prototype.write = function(identifier, record, callback){
    records[identifier] = record
    return callback(record)
  }

  store.constructor.prototype.read = function(identifier, callback){
    return callback(records[identifier])
  }

  store.constructor.prototype.remove = function(identifier, record, callback){
    delete records[identifier]
    return callback(null)
  }

  return store

}