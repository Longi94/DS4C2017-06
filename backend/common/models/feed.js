'use strict';
const cloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');

module.exports = function(Feed) {

	//getFeeds
	
	Feed.getFeeds = function(callback) {
		 
		var feedsAPI = new cloudantAPI_feeds();

		feedsAPI.getFeeds({}, (error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Feed.remoteMethod('getFeeds', {
		returns: {arg: 'response', type: 'object'},
		http: {path: '/getFeeds', verb: 'get'}
	});

	// postFeeds

	Feed.postFeed = function(feed, callback) {
		 
		var feedsAPI = new cloudantAPI_feeds();

		songsAPI.postFeed(feed, (error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Feed.remoteMethod('postFeed', {
		accepts: {arg: 'text', type: 'string'},
		returns: {arg: 'response', type: 'object'}
	});

};
