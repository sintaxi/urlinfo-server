
var Thug        = require("thug")
var superagent  = require("superagent")
var path        = require("path")

module.exports = function(proxydomain){

  var store = new Thug()

  store.constructor.prototype.write = function(identifier, record, callback){
    superagent
      .put(path.join(proxydomain, identifier))
      .send(record)
      .set('accept', 'json')
      .end((err, res) => {
        if (err) return callback(err)
        return callback(res.body)
      })
  }

  store.constructor.prototype.read = function(identifier, callback){
    superagent
      .get(path.join(proxydomain, identifier))
      .set('accept', 'json')
      .end((err, res) => {
        if (res.status == 404) return callback(null)
        return callback(res.body || null)
      })
  }

  store.constructor.prototype.remove = function(identifier, record, callback){
    superagent
      .del(path.join(proxydomain, identifier))
      .send(record)
      .set('accept', 'json')
      .end((err, res) => {
        if (res.status == 204) return callback(null)
        return callback(res.body)
      })
  }

  return store

}
