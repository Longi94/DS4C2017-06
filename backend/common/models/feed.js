'use strict';
const CloudantAPI_Songs = require('../../cloudantAPI/cloudantAPI_songs.js');

module.exports = function (Feed) {
	const songsAPI = new CloudantAPI_Songs();
  //getFeeds

  Feed.getFeeds = function (callback) {

    feedsAPI.getFeeds({}, (error, response) => {
      if (error) return callback(error);
      console.log(response);

      callback(null, JSON.parse(response));
    });
  };

  Feed.remoteMethod('getFeeds', {
    returns: {type: 'array', root: true},
    http: {path: '/getFeeds', verb: 'get'}
  });

  // delete feed

  Feed.deleteFeed = function (feedId, callback) {

    feedsAPI.deleteFeed(feedId, (error, response) => {
      if (error) return callback(error);
      console.log(response);

      callback(null, response);
    });
  };

  Feed.remoteMethod('deleteFeed', {
    accepts: {arg: 'feedId', type: 'string'},
    returns: {arg: 'response', type: 'object'},
  });

};
