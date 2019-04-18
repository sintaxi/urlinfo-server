
var client = require("./client")
var http = require("http")

exports.createClient = function(config){

  var store = client(config)

  store.listen = function(callback){
    return http.createServer(function(req, rsp){
      rsp.writeHead(200, {'Content-Type': 'text/plain'})
      rsp.write('Hello World!')
      rsp.end()
    }).listen(store.config.port || 9000, callback || new Function)
  }

  return store

}