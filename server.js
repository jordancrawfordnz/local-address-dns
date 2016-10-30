var dnsd = require('dnsd');
 
var server = dnsd.createServer(handleDNSRequest);

// TODO: Make these configurable.
var TTL = 300; // 5 minutes
var PORT = 53;

// TODO: Ask the user for the port to use.
server.listen(PORT);
console.log('Server running on port ' + PORT);
 
function handleDNSRequest(request, response) {
  console.log('%s:%s/%s %j', request.connection.remoteAddress, request.connection.remotePort, request.connection.type, request)
 
  var question = response.question[0];
  var hostname = question.name;
  
  if (question && question.type === 'A') {
    // Respond.
      // TODO: Respond with the correct IP address.

    response.answer.push({
      name : hostname,
      type : 'A',
      data: '192.168.1.17',
      ttl : TTL
    });
    response.end();
  }
}