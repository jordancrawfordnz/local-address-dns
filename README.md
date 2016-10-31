[View on Docker Hub](https://hub.docker.com/r/jordancrawford/local-address-dns/)

[View on GitHub](https://github.com/jordancrawfordnz/local-address-dns/)

---

# Local Address DNS

## What is this?
You don't always know the IP address a network device will be assigned on your local network (and don't always have access to / can be bother with MAC based DHCP assignments). local-address-dns turns a DNS entry like ``local.pi.example.com`` into your local IP address.

local-address-dns is a DNS server. When it receives a request, it fetches the local IP address from a local-address-dns-client (avaliable for Raspberry Pi at [local-address-dns-client-rpi](https://github.com/jordancrawfordnz/local-address-dns-client-rpi/)).

## Command Line Arguments

### DNS Zone
The DNS Zone is the DNS name you want to go to access your local network device. An example is ``local.pi.example.com``.

#### Setting up a DNS record for the DNS zone
Your domain's DNS provider needs to point to your server so requests attempting to get the address of the device are sent to local-address-dns. Login to your DNS provider and setup a NS record with the name set to your DNS zone, and the value set to the server's hostname. For example, an NS record where ``local.pi.example.com`` points to ``server.example.com``.

### Local address client URL
The local address client URL is the URL to fetch the local IP address from (i.e.: a local-address-dns-client instance). e.g.: If you have a VPN tunnel to access the local network device at pi.example.com and the local-address-dns-client runs on port 3000, then this would be ``http://pi.example.com:3000``.

## Environment variable based overrides
The TTL and Port can be overridden by setting environment variables.

### TTL
This is the time to live of the DNS record, i.e.: how long the DNS entry for the local address can be cached.

The default value is 5 minutes (300 seconds), but this can be overridden by setting the ``LOCAL_ADDRESS_DNS_TTL`` environment variable with the new TTL in seconds.

### Port
This is the UDP port used for the DNS server.

The default value is port 53, but this can be overridden by setting the ``LOCAL_ADDRESS_DNS_PORT`` environment variable with the new port number.

## Using Docker
### Building
Build with ``docker build -t jordancrawford/local-address-dns .``.

### Running
Run with ``docker run -d -p 53:53/udp --restart always --name local-address-dns jordancrawford/local-address-dns [DNS zone] [local address client URL]``

## Using Directly
Ensure NodeJS is installed on your system and run: ``node server [DNS zone] [local address client URL]``.
The default port is 53 so requires root privledges. Run the command with ``sudo`` to obtain these.