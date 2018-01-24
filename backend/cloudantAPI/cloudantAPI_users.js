'use strict';

const request = require('request');

class CloudantAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "cloudantAPIError";
    }
}

class CloudantAPI_Users {
    constructor() {
        this.headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
            'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
        };
    }

    createUser(user, callback) {
        console.log("USER");
        console.log(user);
        var options = {
            method: 'POST',
            url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Clients',
            headers: this.headers,
            body: user,
            json: true
        };

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    loginUser(user, callback){
        var options = {
            method: 'POST',
            url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Clients/login',
            headers: this.headers,
            body: user,
            json: true
        }

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    logoutUser(accessToken,callback){
        var header =  {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
            'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43' ,
            'Authorization': accessToken
        };
        var options = {
            method: 'POST',
            url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Clients/logout',
            headers: header,
            json: true
        }

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }

    createFeed(songId, accessToken, callback) {
        var header =  { 
            accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
            'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43',
            'Authorization': accessToken
        };
        var options = {
            method: 'PUT',
            url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Clients/me/songs/rel/' + songId + '?access_token=$ACCESS_TOKEN',
            headers: header,
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


module.exports = CloudantAPI_Users;
