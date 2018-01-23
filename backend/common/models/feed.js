'use strict';
const cloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');

module.exports = function (Feed) {
	var feedsAPI = new cloudantAPI_feeds();

  //getFeeds

  Feed.getFeeds = function (callback) {

    feedsAPI.getFeeds({}, (error, response) => {
      if (error) throw error;
      console.log(response);

      callback(null, JSON.parse(response));
    });
  };

  Feed.remoteMethod('getFeeds', {
    returns: {type: 'array', root: true},
    http: {path: '/getFeeds', verb: 'get'}
  });

  // postFeeds

  // Feed.postFeed = function (feed, callback) {

  //   var feedsAPI = new cloudantAPI_feeds();

  //   songsAPI.postFeed(feed, (error, response) => {
  //     if (error) throw error;
  //     console.log(response);

  //     callback(null, response);
  //   });
  // };

  // Feed.remoteMethod('postFeed', {
  //   accepts: {arg: 'text', type: 'string'},
  //   returns: {arg: 'response', type: 'object'}
  // });


  // delete feed
  
  Feed.deleteFeed = function (feedId, callback) {

    feedsAPI.deleteFeed(feedId, (error, response) => {
      if (error) throw error;
      console.log(response);

      callback(null, response);
    });
  };

  Feed.remoteMethod('deleteFeed', {
    accepts: {arg: 'feedId', type: 'string'},
    returns: {arg: 'response', type: 'object'},
  });
  

};
