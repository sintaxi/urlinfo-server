
var Thug        = require("thug")
var proxyStore  = require("./store-proxy")
var diskStore   = require("./store-disk")
var memoryStore = require("./store-memory")
var records     = {}

module.exports = function(config){
  config = config || {}
  
  var store;
  if (config.hasOwnProperty("proxy")){
    store = proxyStore(config.proxy)
  } else if (config.hasOwnProperty("disk")){
    store = diskStore(config.disk)
  } else {
    store = memoryStore()
  }

  return store

}