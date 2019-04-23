
var http = require("http")

module.exports = function(store){

  return http.createServer(function(req, rsp){
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
    }
  })
  
}