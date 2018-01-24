'use strict';

const request = require('request');

class CloudantAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "cloudantAPIError";
    }
}

class CloudantAPI_Songs {
    constructor() {
        this.endpoint = 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs';
        this.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
            'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
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
}


module.exports = CloudantAPI_Songs;
