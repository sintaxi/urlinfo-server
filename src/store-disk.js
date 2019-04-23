
var Thug      = require("thug")
var levelup   = require('levelup')
var leveldown = require('leveldown')


module.exports = function(storepath){

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
    this.locals.db.put(identifier, record, function(err){
      if (err) return callback(err)
      return callback(record)
    })
  }

  store.constructor.prototype.read = function(identifier, callback){
    this.locals.db.get(identifier, function (err, value) {
      return callback(value || null)
    })
    
  }

  store.constructor.prototype.remove = function(identifier, callback){
    this.locals.db.del(identifier, function (err) {
      if (err) return callback(err)
      return callback(null)
    })
  }

  return store

}
