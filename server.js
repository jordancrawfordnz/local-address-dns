var dnsd = require('dnsd');
var request = require('request');
var Promise = require('promise');
 
var server = dnsd.createServer(handleDNSRequest);

var TTL = process.env.LOCAL_ADDRESS_DNS_TTL || 300; // default to 5 minutes.
var PORT = process.env.LOCAL_ADDRESS_DNS_PORT || 53; // default to port 53.
TTL = parseInt(TTL);
PORT = parseInt(PORT);

var args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Run with: node server [DNS zone] [local address client URL]. e.g.: node server local.pi.example.com http://pi.example.com:3000');
  return;
}
var zone = args[0];
var localAddressClient = args[1];

console.log('Port: ' + PORT);
console.log('TTL: ' + TTL);
console.log('Zone: ' + zone);
console.log('Local address client: ' + localAddressClient);

server.zone(zone).listen(PORT);

var getIPAddressPromise;

// Gets the IP address of the client, returning a promise that will resolve/reject with the IP address.
function getIPAddress() {
  return new Promise(function(resolve, reject) {
    request(localAddressClient, function (httpError, httpResponse, body) {
      if (!httpError && httpResponse.statusCode == 200) {
        var ipAddress = JSON.parse(body).ip;
        
        // If a valid IP address was given.
        if (ipAddress) {
          resolve(ipAddress);
        } else {
          reject('No IP address in response.');
        }
      } else {
        reject(httpError);
      }
    });
  });
}

// Handles an incoming DNS request. 
function handleDNSRequest(dnsRequest, dnsResponse) {
  console.log(
    '%s:%s/%s %j',
    dnsRequest.connection.remoteAddress,
    dnsRequest.connection.remotePort,
    dnsRequest.connection.type,
    dnsRequest);
 
  var question = dnsResponse.question[0];
  var hostname = question.name;
  
  if (question && question.name === zone && question.type === 'A') {
    // Get the IP address of the local address client.
    try {
        if (!getIPAddressPromise) {
          getIPAddressPromise = getIPAddress();
          
          // On error, clear the promise so the request can be re-attempted later.
          getIPAddressPromise.catch(function() {
            getIPAddressPromise = null;
          });
          
          // Clear the promise after enough time has passed so the request is re-fetched.
          setTimeout(function() {
            getIPAddressPromise = null;
          }, (TTL - 1)*1000);
        }

        getIPAddressPromise.then(function(ipAddress) {
          dnsResponse.answer.push({
            name : hostname,
            type : 'A',
            data : ipAddress,
            ttl  : TTL
          });
          dnsResponse.end();
        });
    } catch (error) {
      console.log('An error occurred while processing the request.');
      console.log(error);
    }
  }
}