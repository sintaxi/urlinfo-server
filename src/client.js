
var Thug       = require("thug")
var proxyStore = require("./store-proxy")
var diskStore  = require("./store-disk")
var records    = {}

module.exports = function(config){
  config = config || {}
  var store;

  if (config.hasOwnProperty("proxy")){
    //console.log("Proxying records to", config.proxy)
    store = proxyStore(config.proxy)

  } else if (config.hasOwnProperty("disk")){
    //console.log("Storing records on disk", config.disk)
    store = diskStore(config.disk)

  } else {
    //console.log("Storing records in memory")
    
    store = new Thug()

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
  }

  return store

}