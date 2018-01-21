'use strict';
const cloudantAPI_Songs = require('../../cloudantAPI/cloudantAPI_songs.js');


module.exports = function(Userinput) {

	Userinput.input = function(text, callback) {
		 
		var songsAPI = new cloudantAPI_Songs();

		songsAPI.postSong({
		    name: 'aaaaaaaaaaaa',
		    id: '123456789'
		}, (error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Userinput.remoteMethod('input', {
		accepts: {arg: 'text', type: 'string'},
		returns: {arg: 'response', type: 'string'}
	});

};
