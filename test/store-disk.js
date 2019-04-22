

var should     = require("should")
var store      = require("../src/store-disk.js")

describe("store-disk", function(){

  var client;

  it("should exist storeDisk", function(done){
    client = storeDisk("./store.db")
    should.exist(client)
    done()
  })

  it("should have get & set methods", function(done){
    client.should.have.property("get")
    client.should.have.property("set")
    done()
  })

  it("should be able to set first record", function(done){
    client.set("example.com/foo", "foo", function(error, record){
      should.not.exist(error)
      done()  
    })
  })

  it("should be able to set second record", function(done){
    client.set("example.com/bar", "bar", function(error, record){
      should.not.exist(error)
      done()  
    })
  })

  it("should be able to get first record", function(done){
    client.get("example.com/foo", function(record){
      record.should.equal("foo")
      done()
    })
  })

  it("should be able to get second record", function(done){
    client.get("example.com/bar", function(record){
      record.should.equal("bar")
      done()
    })
  })

})
