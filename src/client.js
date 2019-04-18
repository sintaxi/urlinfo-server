
var Thug = require("thug")
var records = {} // temporary memory store

module.exports = function(config){

  var store    = new Thug()
  store.config = config || {}

  store.constructor.prototype.write = function(identifier, record, callback){
    records[identifier] = record
    return callback(record)
  }

  store.constructor.prototype.read = function(identifier, callback){
    return callback(records[identifier])
  }

  store.constructor.prototype.remove = function(identifier, callback){
    delete records[identifier]
    return callback(null)
  }

  return store

}