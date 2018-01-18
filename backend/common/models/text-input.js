'use strict';

module.exports = function(Textinput) {

	Textinput.analyse = function(text, callback) {
		callback(null, 'response text here');
	}

	Textinput.remoteMethod('analyse', {
		accepts: {arg: 'text', type: 'string'},
		description: "Method that accepts text and processes it through tone analyser.",
		returns: [
			{ arg: 'response', type: 'string' },
			{ arg: 'song', type: 'string' }
		]
	});

};
