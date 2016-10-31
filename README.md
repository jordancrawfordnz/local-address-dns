[View on Docker Hub](https://hub.docker.com/r/jordancrawford/local-address-dns/)

[View on GitHub](https://github.com/jordancrawfordnz/local-address-dns/)

---

# Local Address DNS

## What is this?
<!-- TODO -->

## Using Docker
### Building
Build with ``docker build -t jordancrawford/local-address-dns .``.

### Running
Run with ``docker run -d -p 53:53 --restart always --name local-address-dns jordancrawford/local-address-dns [local address client URL]``

The local address client URL is the URL to fetch the local IP address from (i.e.: a local-address-dns-client instance). e.g.: If you have a VPN tunnel to access the local network device at pi.example.com and the local-address-dns-client runs on port 3000, then this would be http://pi.example.com:3000.

On your domain, point a NS record from your desired local IP access point to the server running local-address-dns, e.g.: local.pi.example.com points to server.example.com. Requests to local.pi.example.com will resolve with the local network device's local IP address.

## Using Directly
<!-- TODO -->