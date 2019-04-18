
var should  = require("should")
var urlinfo = require("../")

describe("server", function(){

  it("should create client", function(done){
    client = urlinfo.createClient()
    should.exist(client)
    done()
  })

  it("should have listen function on client", function(done){
    client = urlinfo.createClient()
    client.should.have.property("listen")
    done()
  })

  it("should be able to set first record", function(done){
    client.listen(function(){
      done()
    })
  })

})