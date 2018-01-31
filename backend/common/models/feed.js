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

  Feed.deleteFeed = function (feedId, req, callback) {
    const accessToken = req.headers.authorization;
    feedsAPI.deleteFeed(feedId, accessToken, (error, response) => {
      if (error) return callback(error);
      console.log(response);

      callback(null, JSON.parse(response));
    });
  };

  Feed.remoteMethod('deleteFeed', {
    accepts: [
      { arg: 'feedId', type: 'string', http: { source: 'path' } }, 
      { arg: 'req', type: 'object', required: true, description: '', http: { source: 'req'} }
    ],
    http: {path: '/deleteFeed/:feedId', verb: 'del'},
    returns: {arg: 'response', type: 'object'},
    description: 'Remote method to delete Feed record from database'
  });

};
