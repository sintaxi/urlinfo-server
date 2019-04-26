
var http  = require("http")
var debug = require("debug")("urlinfo")

module.exports = function(store){

  return http.createServer(function(req, rsp){
    //debug("API", req.method, req.url)

    if (req.method == "PUT"){
      
      var body = ""
      req.on('data', function(chunk){ body += chunk })

      req.on('end', function(){
        req.body = body.toString()
        store.set(req.url, JSON.parse(req.body), function(errors, record){
          if (errors) {
            rsp.writeHead(401)
            rsp.end()
          } else {
            rsp.writeHead(201, { 'Content-Type': 'application/json' })
            rsp.end(JSON.stringify(record))
          }
        })
      })

      
    } else if(req.method == "GET"){
      store.get(req.url, function(record){
        if (record) {
          rsp.writeHead(200, { 'Content-Type': 'application/json' })
          rsp.end(JSON.stringify(record))
        } else {
          rsp.writeHead(404)
          rsp.end()
        }
      })

    } else if(req.method == "DELETE"){
      store.del(req.url, function(errors){
        if (errors) {
          rsp.writeHead(410, { 'Content-Type': 'application/json' })
          rsp.end(JSON.stringify(errors))
        } else {
          rsp.writeHead(204)
          rsp.end()
        }
      })
    }
  })
  
}