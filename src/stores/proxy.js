
var Thug        = require("thug")
var superagent  = require("superagent")
var path        = require("path")
var debug     = require("debug")("urlinfo")

module.exports = function(proxydomain, lrucount){

  var store = new Thug()

  store.constructor.prototype.write = function(identifier, record, callback){
    debug("PROXY write", proxydomain, identifier)
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
    debug("PROXY read", proxydomain, identifier)
    superagent
      .get(path.join(proxydomain, identifier))
      .set('accept', 'json')
      .end((err, res) => {
        if (res.status == 404) return callback(null)
        return callback(res.body || null)
      })
  }

  store.constructor.prototype.remove = function(identifier, record, callback){
    debug("PROXY remove", proxydomain, identifier)
    superagent
      .del(path.join(proxydomain, identifier))
      .send(record)
      .set('accept', 'json')
      .end((err, res) => {
        if (res.status == 204) return callback(null)
        return callback(res.body)
      })
  }

  // No LRU we return the store
  // if (!lrucount) {
  //   debug("PROXY no LRU", lrucount)
  //   return store
  // }

  // if LRU we wrap the methods
  debug("PROXY with LRU", lrucount)
  return {
    get: function(id, cb){
      store.get(id, function(record){
        return cb(record)
      })
    },

    set: function(id, rec, cb){
      store.set(id, rec, function(errors, record){
        return cb(errors, record)
      })
    },

    del: function(id, cb){
      store.del(id, function(errors){
        return cb(errors)
      })
    }
  }
  

}
