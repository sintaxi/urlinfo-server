
var should     = require("should")
var urlinfo    = require("../")
var superagent = require("superagent")

describe("server", function(){

  var server;

  it("should create client", function(done){
    client = urlinfo.createClient()
    should.exist(client)
    done()
  })

  it("should have listen function on client", function(done){
    client = urlinfo.createClient()
    client.should.have.property("server")
    done()
  })

  it("should be able to start client", function(done){
    server = client.server.listen(9000, function(){
      done()
    })
  })

  it("should be able to set record", function(done){
    superagent
      .put('localhost:9000/foo')
      .send({ val: "foo" })
      .set('accept', 'json')
      .end((err, res) => {
        res.status.should.eql(201)
        should.not.exist(err)
        done()
      })
  })

  it("should be able to get record", function(done){
    superagent
      .get('localhost:9000/foo')
      .set('accept', 'json')
      .end((err, res) => {
        res.status.should.eql(200)
        done()
      })
  })

  after(function(done){
    server.close(function(){
      done()  
    })
  })

})