# urlinfo

> a service for providing information on any given url

### Runtime

[Download and install nodejs](https://nodejs.org/en/) from the official site (LTS recommended).

### Installation

  npm install -g urlinfo-server

### Usage (work in progress)

  
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


