# urlinfo

> a service for providing information on any given url

`urlinfo` is architected very similarly to DNS though designed for fetching information on full url endpoints. Each `urlinfo` server is set to either set & get records from disk or proxy requests to another `urlinfo` server. Servers can proxy indefinately but they all have built in LRU caches so requests are responsive regardless how many hops away the origin is.

## Runtime

[Download and install nodejs](https://nodejs.org/en/) from the official site (LTS recommended).

## Installation

    npm install -g urlinfo-server

## CLI

`urlinfo` ships with a CLI that makes starting servers easy. Servers can talk to disk or proxy calls to an http endpoint providing flexability to have servers stood up in multiple locations. All servers are a client under the hood so they all save disk or network calls by using a built in LRU cache.

```  
  urlinfo - 0.5.0
  Service for storing and fetching url information.

  Commands:
    urlinfo server <file>               http server (stores records in database)
    urlinfo proxy <domain>              http server (proxies records to other urlinfo API)
    urlinfo benchmark <domain>          benchmarks the urlinfo server that is passed in.

  Options:
    -p, --port (9001)                   specify port for server
    -h, --help                          outputs this help message
    -v, --version                       outputs version

  Examples:
    urlinfo server store.db             starts server on port 9001. saves state in store.db
    urlinfo proxy example.com -p 9002   starts server on port 9002. proxies req. to example.com
```

## Development

### Cloning the repository...

    git clone https://github.com/sintaxi/urlinfo-server.git

### Installing dev dependencies...

    npm install

### Running the tests...

    npm test

For debuging include `DEBUG=urlinfo` when running from the CLI or when running the tests.

## Lib

Using `urlinfo` as a client library has the benefits of a built in LRU cache. It also gives you the option of either doing lookups to disk or to do lookups over http to a urlinfo server that is running on another machine. In the case of disk lookups the LRU reduces the number of times you touch the disk and in the case of lookups over http the LRU cache saves you trips over the network.

```javascript
var disk = urlinfo.createClient({ disk: __dirname + "/store.db" })

// fetch record
disk.set("foo.com", {}, function(err, record){
  // returns record
})

// get record
disk.get("foo.com", function(record){
  // returns record or null
})

```

Each client has a built in `listen()` method for standing up an http server in front of the client.

```javascript
disk.listen(9000, function(err){
  consolelog("server is listening on port 9000")
})
```

To fetch records from our http server all we have to do is instantiate a client that will speak to that endpoint and the library behaves the same way. This allows us to have one origin of truth but several servers setup to server requests.

```javascript
var network = urlinfo.createClient({ proxy: "https://localhost:9000" })

```

## FAQ

**The size of the URL list could grow infinitely, how does `urlinfo` scale this beyond the memory capacity of the system?**

Although each instance of the `urlinfo` client/server contains an LRU cache for fast access all requests eventually resolve to an instance that reads and writes to a disk k/v store. If the origin server ever needed to change storage mechanisms all that would be required is that a new store be setup and then the previous origin store can be set to proxy requests to the new server.

**Q. Assuming that the number of requests will exceed the capacity of a single system, describe how might you solve this, and how might this change if you have to distribute this workload to an additional region, such as Europe.**

`urlinfo` is architected much like DNS. Assuming the origin server is in North America the best way to expand to Europe would be to stand up a pseudo-origin server in Europe that proxies requests to North America. In addition to that it would be prudent to setup multiple `urlinfo` servers in Europe depending on volume of requests & latency to Europe origin server. Each `urlinfo` server reduces load on the origin server.

** Q. What are some strategies used to update the service with new URLs? Updates may be as much as 5 thousand URLs a day with updates arriving every 10 minutes.**

URLs can be updated with a PUT request to any of the servers at the same URL used to get the data. This makes the vaious ways to update urllist virtually endless and tooling to do so widely available.

** Q. You’re woken up at 3am, what are some of the things you’ll look for?**

- Check health of processes.
- Check DNS is resolving & SSL certs are valid.
- Check for memory or disk saturation on machines.
- If there are data integrity issues purge caches and reduce time to expire in LRU.
- Check logs for useful error outputs.
- Ensure origin server is "available" and able to read/write records.
- Check for data integrity in the database.

**Does that change anything you’ve done in the app?**

Yes. Flags for controlling LRU size and durration should be added to CLI. Better logging output such as http errors or errors reading/writing to disk should also be added.

**Q. What are some considerations for the lifecycle of the app?**

- Managing SSL certs for the APIs (unaddressed)
- Token management for speaking to API (unaddressed)
- Version of nodejs. (minor concern)
- Process management for keeping process running.
- Database backups. Ability to restore with older version of dataset.

** You need to deploy new version of this application. What would you do? **

Publish new version of `urlinfo` to npm. Run Ansible script which reaches out to all running instances and pulls latest version and triggers process restarts.




