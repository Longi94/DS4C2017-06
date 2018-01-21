//Cleverbot
var http = require('http');
var express = require('express');
var session = require('express-session');
var querystring = require('querystring');
var bodyparser = require('body-parser');

var app = express();
app.use(session({secret:'XASDASDA'}));
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true }));

var API_KEY = "CC6fpvu_A4khBgNslABBRJ64jtg";
var ssn ;

//for testing
app.get('/',function(req, res){
	ssn = req.session;
	
	if(!ssn.cs){
		ssn.cs = '';
	}

	var path = '/getreply?'+querystring.stringify({key: API_KEY, input: "Hello, how are you?", cs: ssn.cs});
	var options = {
	  hostname: 'www.cleverbot.com',
	  port: 80,
	  path: path,
	  method: 'GET'
	}

	var body = '';
	var req = http.request(options, function(response) {
  
  response.on('data', function (chunk) {
		    body += chunk;
	});
   response.on('end', function () {
   		var jsonObj = JSON.parse(body);
   		ssn.cs = jsonObj.cs;
   		cleverbotResponse = jsonObj.output;
 		res.send(cleverbotResponse);
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

})


/*
//this should be the one we actually use
app.post('/chatbot', function(req, res){
	
	ssn = req.session;
	var userInput = req.body.uinput; //change "uinput" as needed.

	if(!ssn.cs){
		ssn.cs = '';
	}

	var path = '/getreply?'+querystring.stringify({key: API_KEY, input: userInput, cs: ssn.cs});
	var options = {
	  hostname: 'www.cleverbot.com',
	  port: 80,
	  path: path,
	  method: 'GET'
	}

	var body = '';
	var req = http.request(options, function(response) {
  
  response.on('data', function (chunk) {
		    body += chunk;
	});
   response.on('end', function () {
   		var jsonObj = JSON.parse(body);
   		ssn.cs = jsonObj.cs;
   		cleverbotResponse = jsonObj.output;
 		res.send(cleverbotResponse);
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
});
*/

app.listen(8080, () => console.log("app listening on 8080"));
