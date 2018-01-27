'use strict';

const conf = require('./cloudantAPI_conf');
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
            'x-ibm-client-secret': conf.clientSecret,
            'x-ibm-client-id': conf.clientId
        };
    }

    createUser(user, callback) {
        console.log("USER");
        console.log(user);
        var options = {
            method: 'POST',
            url: conf.endpoint + 'api/Clients',
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
            url: conf.endpoint + 'api/Clients/login',
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
            'x-ibm-client-secret': conf.clientSecret,
            'x-ibm-client-id': conf.clientId,
            'Authorization': accessToken
        };
        var options = {
            method: 'POST',
            url: conf.endpoint + 'api/Clients/logout',
            headers: header,
            json: true
        }

        request(options, function (error, response, body) {
          if (error) return callback(error);

          console.log('Success: ', body);

          callback(null, body);

        });
    }
}


module.exports = CloudantAPI_Users;
