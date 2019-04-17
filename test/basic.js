
var should  = require("should")
var urlinfo = require("../")

describe("basic", function(){

  it("should exist", function(done){
    should.exist(urlinfo)
    urlinfo.should.have.property("createClient")
    done()
  })

})
