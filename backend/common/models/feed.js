'use strict';
const CloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');

module.exports = function (Feed) {
  const feedsAPI = new CloudantAPI_feeds();
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
    http: {path: '/getFeeds', verb: 'get'},
    description: 'Remote method to retrieve all Feed records from database'
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
    accepts: { arg: 'feedId', type: 'string', http: { source: 'path' } },
    http: {path: '/deleteFeed', verb: 'del'},
    returns: {arg: 'response', type: 'object'},
    description: 'Remote method to delete Feed record from database'
  });

};
