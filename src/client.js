
var proxyStore  = require("./stores/proxy")
var diskStore   = require("./stores/disk")
var memoryStore = require("./stores/memory")

/**
 *
 * Client returns either a disk, memory, or proxy store.
 *
 */

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