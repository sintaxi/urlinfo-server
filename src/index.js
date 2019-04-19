
var client = require("./client")
var server = require("./server")

exports.createClient = function(config){
  var store    = client(config)
  store.server = server(store)
  return store
}