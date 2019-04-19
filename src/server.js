
var http = require("http")

module.exports = function(store){

  return http.createServer(function(req, rsp){
    if (req.method == "PUT"){
      store.set(req.url, true, function(errors, record){
        if (errors) {
          rsp.writeHead(401)
          rsp.end()
        } else {
          rsp.writeHead(201)
          rsp.end()
        }
      })
    } else if(req.method == "GET"){
      store.get(req.url, function(record){
        if (record) {
          rsp.writeHead(200)
          rsp.end()
        } else {
          rsp.writeHead(404)
          rsp.end()
        }
      })
    }
  })
  
}