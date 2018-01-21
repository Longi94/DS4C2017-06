'use strict';
var http = require('http');
var querystring = require('querystring');
var API_KEY = "CC6fpvu_A4khBgNslABBRJ64jtg";


module.exports = function(Chatbot) {

	Chatbot.chat = function(req, userInput, callback) {

		var ssn = req.session;

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
		   		var cleverbotResponse = jsonObj.output;
		 		callback(null, cleverbotResponse);
			});
		});

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		req.end();


	}

	Chatbot.remoteMethod('chat', {
		accepts: [
        {
          arg: 'req',
          type: 'object',
          required: true,
          description: '',
          http: {
            source: 'req'
          }
        },
        {
          arg: 'userInput',
          type: 'string',
          required: true,
          description: ''
        }
      ],
      returns: [
        {
          arg: 'response',
          type: 'string',
          root: false,
          description: ''
        }
      ]
	});

};
