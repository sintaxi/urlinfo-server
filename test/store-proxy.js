

var should     = require("should")
var store      = require("../src/stores/proxy")
var exec       = require("child_process").exec
var urlinfo    = require("../")

describe("store-proxy", function(){

  var api;
  var server;
  before(function(done){
    api = urlinfo.createClient()
    server = api.server.listen(9000, function(){
      done()
    })
  })

  var client;
  var proxydomain = "localhost:9000"

  it("should exist storeDisk", function(done){
    client = store(proxydomain)
    should.exist(client)
    done()
  })

  it("should have get & set methods", function(done){
    client.should.have.property("get")
    client.should.have.property("set")
    done()
  })

  it("should be able to set first record", function(done){
    client.set("example.com/foo", { "name": "foo" }, function(error, record){
      should.not.exist(error)
      done()  
    })
  })

  it("should be able to set second record", function(done){
    client.set("example.com/bar", { "name": "bar" }, function(error, record){
      should.not.exist(error)
      record.should.have.property("name")
      record.name.should.be.equal("bar")
      done()  
    })
  })

  it("should be able to get first record", function(done){
    client.get("example.com/foo", function(record){
      record.should.have.property("name")
      record.name.should.be.equal("foo")
      done()
    })
  })

  it("should be able to get second record", function(done){
    client.get("example.com/bar", function(record){
      record.should.have.property("name")
      record.name.should.be.equal("bar")
      done()
    })
  })

  it("should be able to delete second record", function(done){
    client.del("example.com/bar", function(errors){
      should.not.exist(errors)
      done()
    })
  })

  it("should no longer able to get second record", function(done){
    client.get("example.com/bar", function(record){
      should.not.exist(record)
      done()
    })
  })

  after(function(done){
    server.close(function(){
      done()
    })
  })

})
