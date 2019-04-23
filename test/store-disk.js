

var should     = require("should")
var store      = require("../src/store-disk")
var exec       = require("child_process").exec

describe("store-disk", function(){

  var client;
  var storepath = __dirname + "/store.db"

  it("should exist storeDisk", function(done){
    client = store(storepath)
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

  after(function(done){
    exec("rm -rf " + storepath, function() {
      done()
    })
  })

})
