
var Thug        = require("thug")
var superagent  = require("superagent")
var path        = require("path")
var debug       = require("debug")("urlinfo")
var LRU         = require("lru-cache")

module.exports = function(proxydomain, lrucount){

  var store = new Thug()

  store.constructor.prototype.write = function(identifier, record, callback){
    debug("PROXY write", path.join(proxydomain, identifier))
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
        if (err) return callback(null)
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
  var lru = new LRU()

  return {

    // fetch from cache or prime the cache
    get: function(id, cb){
      var record = lru.get(id)
      if (record) {
        process.nextTick(function(){
          return cb(record)
        })
      } else {
        store.get(id, function(record){
          lru.set(id, record)
          return cb(record)
        })  
      }
      
    },

    // set the store and prime the cache
    set: function(id, rec, cb){
      store.set(id, rec, function(errors, record){
        if (!errors) lru.set(id, record)
        return cb(errors, record)
      })
    },

    // delete from store and delete from cache
    del: function(id, cb){
      store.del(id, function(errors){
        if (!errors) lru.del(id)
        return cb(errors)
      })
    }
  }
  

}
