'use strict';

const conf = require('./cloudantAPI_conf');
const request = require('request');

class CloudantAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "cloudantAPIError";
    }
}

class CloudantAPI_Songs {
    constructor() {
        this.endpoint = conf.endpoint + 'api/Songs';
        this.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
          'x-ibm-client-secret': conf.clientSecret,
          'x-ibm-client-id': conf.clientId
        };
    }

    postSong(song, callback) {
        var options = {
            method: 'POST',
            url: this.endpoint,
            headers: this.headers,
            body: song,
            json: true
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    getSongs(song, callback) {
        var options = {
            method: 'GET',
            url: this.endpoint,
            qs: {},
            headers: this.headers
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    linkClient(songId, accessToken, callback) {
        var feed = {
            date: Date.now()
        }
        var header =  {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': conf.clientSecret,
            'x-ibm-client-id': conf.clientId,
            'Authorization': accessToken
        };
        var options = {
            method: 'PUT',
            url: conf.endpoint + 'api/Songs/'+songId+'/clients/rel/me',
            headers: header,
            body: feed,
            json: true
        };

        console.log(options);

        request(options, function (error, response, body) {
          if (error) callback(null, error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }
}


module.exports = CloudantAPI_Songs;
