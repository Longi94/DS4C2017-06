//Cleverbot
var http = require('http');
var querystring = require('querystring');
var cleverbotState = '';
var API_KEY = "CC6fpvu_A4khBgNslABBRJ64jtg";

 exports.getCleverBotResponse = function(userInput){

 var path = '/getreply?'+querystring.stringify({key: API_KEY, input: userInput, cs: cleverbotState});
var options = {
  hostname: 'www.cleverbot.com',
  port: 80,
  path: path,
  method: 'GET'
}

var body = '';
var cleverbotResponse = '';

var req = http.request(options, function(response) {
 //data comes in chunks, so we append it to the body variable.
  response.on('data', function (chunk) {
		    body += chunk;
	});
  
  //data chunks have finished, body is full.
   response.on('end', function () {
   		var jsonObj = JSON.parse(body);
   		cleverbotState = jsonObj.cs;
   		cleverbotResponse = jsonObj.output;
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

 return cleverbotResponse;
}

/*
* Server created to test, can be removed if not needed.
http.createServer(function (req, res) {
	//http.get()
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(getCleverBotResponse("Hello, what's your name?"));
}).listen(8080); 
*/
