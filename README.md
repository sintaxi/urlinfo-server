# urlinfo

> a service for providing information on any given url

## Runtime

[Download and install nodejs](https://nodejs.org/en/) from the official site (LTS recommended).

## Installation

    npm install -g urlinfo-server

## CLI

`urlinfo` ships with a CLI that makes starting servers easy. Servers can talk to disk or proxy calls to an http endpoint providing flexability to have servers stood up in multiple locations. All servers are a client under the hood so they all save disk or network calls by using a built in LRU cache.

```  
  urlinfo - 0.3.0
  Service for storing and fetching url information.

  Commands:
    urlinfo server <file>               http server (stores records in database)
    urlinfo proxy <domain>              http server (proxies records to other urlinfo API)

  Options:
    -p, --port (9001)                   specify port for server
    -h, --help                          outputs this help message
    -v, --version                       outputs version

  Examples:
    urlinfo server store.db             starts server on port 9001. saves state in store.db
    urlinfo proxy example.com -p 9002   starts server on port 9002. proxies req. to example.com
```

## Lib

Using `urlinfo` as a client library has the benefits of a built in LRU cache. It also gives you the option of either doing lookups to disk or to do lookups over http to a urlinfo server that is running on another machine. In the case of disk lookups the LRU reduces the number of times you touch the disk and in the case of lookups over http the LRU cache saves you trips over the network.

Using library to fetch records from disk.

```javascript
var client0 = urlinfo.createClient({ source: "https://sfo.example.com" })

// fetch record
client0.set("foo.com", function(err, record){
  // returns record
})

// get record
client0.get("foo.com", function(record){
  // returns record or null
})

```

Each client has a built in `listen()` method for standing up an http server in front of the client.

```javascript
client0.listen(9000, function(err){
  consolelog("server is listening on port 9000")
})
```

To fetch records from our http server all we have to do is instantiate a client that will speak to that endpoint.

```javascript
var client1 = urlinfo.createClient({ source: "https://localhost:9000" })

// fetch record
client1.set("foo.com", function(err, record){
  // returns record
})

// get record
client1.get("foo.com", function(record){
  // returns record or null
})

```

If we wish to do so we could have this client listen on another port so it can be a server while proxying call through to another endpoint.

```javascript
client1.listen(9001, function(err){
  consolelog("server is listening on port 9001")
})
```




