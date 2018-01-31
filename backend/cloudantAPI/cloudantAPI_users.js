'use strict';

const conf = require('./cloudantAPI_conf');
const request = require('request');
const loopback = require('loopback');
const querystring = require('querystring');
const fs = require('fs');
var app = module.exports = loopback();
var RoleMapping = app.models.RoleMapping;

class CloudantAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = "cloudantAPIError";
    }
}

class CloudantAPI_Users {
    constructor() {
        this.headers = {
            'accept': 'application/json',
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
            
            /*
            var adminOptions = {
            method: 'GET',
            url: conf.endpoint + 'api/RoleMappings?filter={"where":{"principalId":{"like":"'+body.userId+'"},"roleId:{"like":"159882e4a5bdde9cc725eee8c13a1030"}"}}',
            headers: this.headers
          }

          request(adminOptions, function(aReqErr, aRes, aBody){
            if(aReqErr) return callback(aReqErr);
            /*
            fs.writeFile("./output.json", JSON.stringify(aRes), function(err){
                if (err){
                    console.log("WRITE FILE ERR: ", err);
                }
            });
            
            //console.log("Admin check success: ", aRes);
        if(aBody){
            var pId = aBody[0].principalId;
            console.log("Admin check success:", aBody);
            if(pId){
                body["isAdmin"] = true;
            }else{
                body["isAdmin"] = false;
            }
        }else{
            
            console.log("aResCode", aRes.statusCode);
            console.log("aResMessage", aRes.statusMessage);
            //console.log("aReqErr", aReqErr);
        }

          });
        */

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
