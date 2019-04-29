
var Thug      = require("thug")
var levelup   = require('levelup')
var leveldown = require('leveldown')
var debug     = require("debug")("urlinfo")
var LRU       = require("lru-cache")


module.exports = function(storepath, lrucount){

  var db       = levelup(leveldown(storepath))
  var store    = new Thug({ 
    locals: { db: db },
    filters: {
      // database wants a string so we serialize
      beforeWrite:[function(record, next){
        next(JSON.stringify(record))
      }],

      // database returns a string so we parse
      out : [function(record, next){
        next(JSON.parse(record))
      }]
    } 
  })

  store.constructor.prototype.write = function(identifier, record, callback){
    debug("DISK write", identifier)
    this.locals.db.put(identifier, record, function(err){
      if (err) return callback(err)
      return callback(record)
    })
  }

  store.constructor.prototype.read = function(identifier, callback){
    debug("DISK read", identifier)
    this.locals.db.get(identifier, function (err, value) {
      return callback(value || null)
    })
    
  }

  store.constructor.prototype.remove = function(identifier, record, callback){
    debug("DISK remove", identifier)
    this.locals.db.del(identifier, function (err) {
      if (err) return callback(err)
      return callback(null)
    })
  }

  // No LRU we return the store
  // if (!lrucount) {
  //   debug("DISK no LRU", lrucount)
  //   return store
  // }

  // if LRU we wrap the methods
  debug("DISK with LRU", lrucount)
  var lru = new LRU()

  return {

    // fetch from cache or prime the cache
    get: function(id, cb){
      var record = lru.get(id)
      if (record){
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

    // set the store and prime cache
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
