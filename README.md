# urlinfo

> a service for providing information on any given url

### Runtime

[Download and install nodejs](https://nodejs.org/en/) from the official site (LTS recommended).

### Installation

    npm install -g urlinfo-server

### Usage (work in progress)
  
    urlinfo (v0.1.0) - service for storing and fetching url information.

    Usage:
      urlinfo <file|domain>

    Options:
      -v, --version       show the version
      -h, --help          show this help message
      -h, --port          specify port for server

    Examples:
      urlinfo store.db --port 9001                  starts server in storage mode
      urlinfo https://localhost:9001 --port 9002    starts server in proxy mode

