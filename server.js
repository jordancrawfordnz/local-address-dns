var dnsd = require('dnsd');
var request = require('request');
 
var server = dnsd.createServer(handleDNSRequest);

var TTL = process.env.LOCAL_ADDRESS_DNS_TTL || 300; // default to 5 minutes.
var PORT = process.env.LOCAL_ADDRESS_DNS_PORT || 53; // default to port 53.
TTL = parseInt(TTL);
PORT = parseInt(PORT);

var args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Run with: node server [local address client URL]. e.g.: node server http://pi.example.com:3000');
  return;
}
var localAddressClient = args[0];

server.listen(PORT);
console.log('Server running on port ' + PORT);
console.log('TTL: ' + TTL);
console.log('Local address client: ' + localAddressClient);
 
function handleDNSRequest(dnsRequest, dnsResponse) {
  console.log(
    '%s:%s/%s %j',
    dnsRequest.connection.remoteAddress,
    dnsRequest.connection.remotePort,
    dnsRequest.connection.type,
    dnsRequest);
 
  var question = dnsResponse.question[0];
  var hostname = question.name;
  
  if (question && question.type === 'A') {
    // Get the IP address of the local address client.
    try {
      request(localAddressClient, function (httpError, httpResponse, body) {
        if (!httpError && httpResponse.statusCode == 200) {
          var ipAddress = JSON.parse(body).ip;
          
          // If a valid IP address was given.
          if (ipAddress) {
            dnsResponse.answer.push({
              name : hostname,
              type : 'A',
              data : ipAddress,
              ttl  : TTL
            });
            dnsResponse.end();
          }
        } else {
          console.log('Error with HTTP request.');
          console.log(httpError);
        }
      });
    } catch (error) {
      console.log('An error occurred while processing the request.');
      console.log(error);
    }
  }
}