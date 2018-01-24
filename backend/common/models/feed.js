'use strict';
const cloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');
const cloudantAPI_Users = require('../../cloudantAPI/cloudantAPI_users.js');

module.exports = function (Feed) {
	var feedsAPI = new cloudantAPI_feeds();
	const UsersAPI = new cloudantAPI_Users();
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

  // postFeed v.2
  
  Feed.createFeed = function (req, songId, callback) {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      let error = new Error();
      error.status = 403;
      return callback(error);
    }

    UsersAPI.createFeed(songId, accessToken, (error, response) => {
      if (error) callback(error);
      console.log(response);
      callback(null);
    });
  };  
  
  Feed.remoteMethod('createFeed', {
    accepts: [{
        arg: 'req',
        type: 'object',
        required: true,
        description: '',
        http: {
          source: 'req'
        }
      },
      {
      	arg: 'songId', type: 'string'
      }]
  });

};
