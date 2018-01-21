'use strict';
const cloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');

module.exports = function(Feed) {

	//getFeeds
	
	Feed.getFeed = function(text, callback) {
		 
		var feedsAPI = new cloudantAPI_feeds();

		feedsAPI.getFeed(text, (error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Feed.remoteMethod('getFeed', {
		accepts: {arg: 'text', type: 'string'},
		returns: {arg: 'response', type: 'string'}
	});

	// postFeeds

	Feed.postFeed = function(text, callback) {
		 
		var feedsAPI = new cloudantAPI_feeds();

		songsAPI.postSong({
		    name: 'aaaaaaaaaaaa',
		    id: '123456789'
		}, (error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Feed.remoteMethod('postFeed', {
		accepts: {arg: 'text', type: 'string'},
		returns: {arg: 'response', type: 'string'}
	});

};
