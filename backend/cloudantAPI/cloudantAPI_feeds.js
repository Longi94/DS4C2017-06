'use strict';

const conf = require('./cloudantAPI_conf');
const request = require('request');

class CloudantAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "cloudantAPIError";
    }
}

class CloudantAPI_feeds {
    constructor() {
        this.endpoint = conf.endpoint + 'api/Feeds';
        this.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': conf.clientSecret,
            'x-ibm-client-id': conf.clientId
        };
    }

    postFeed(userId, songId, callback) {
        var d = new Date();
        var currentDate = d.toISOString();
        var feed = {
            clientId: userId,
            songId: songId,
            date: currentDate
        };

        var options = {
            method: 'POST',
            url: this.endpoint,
            headers: this.headers,
            body: feed,
            json: true
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    getFeeds(feed, callback) {
        var options = {
            method: 'GET',
            qs: { filter: {"include":["client","song"]} },
            url: this.endpoint,
            headers: this.headers
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    deleteFeed(feedId, callback) {
        const deleteUrl = this.endpoint + '/' + feedId;
        var options = {
            method: 'DELETE',
            url: deleteUrl,
            headers: this.headers
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }
}


module.exports = CloudantAPI_feeds;
