'use strict';
const cloudantAPI_Users = require('../../cloudantAPI/cloudantAPI_users.js');

module.exports = function (Client) {
  const UsersAPI = new cloudantAPI_Users();

  Client.register = function (username, email, password, callback) {
    const user = {
      username: username,
      email: email,
      password: password
    };

    UsersAPI.createUser(user, (error, response) => {
      if (error) return callback(error);

      if (response.error) return callback(response.error);

      console.log(response);

      callback(null, response);
    });
  };

  Client.login = function (username, password, callback) {
    const user = {
      username: username,
      password: password
    };
    UsersAPI.loginUser(user, (error, response) => {
      if (error) return callback(error);

      if (response.error) return callback(response.error);

      console.log(response);

      callback(null, response.id, response.created, response.ttl);
    });
  };

  Client.logout = function (req, callback) {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      let error = new Error();
      error.status = 403;
      return callback(error);
    }

    UsersAPI.logoutUser(accessToken, (error, response) => {
      if (error) return callback(error);

      if(response && response.error) return callback(response.error);
      console.log(response);
      callback(null);
    });
  };

  Client.remoteMethod('register', {
    accepts: [{arg: 'username', type: 'string', required: true}, {arg: "email", type: "string", required: true}, {arg: "password", type: "string", required: true}],
    returns: {arg: 'response', type: 'string'},
    description: 'Register as a new User'
  });

  Client.remoteMethod('login', {
    accepts: [{arg: 'username', type: 'string', required: true}, {arg: 'password', type: 'string', required: true}],
    returns: [
      {arg: 'id', type: 'string'},
      {arg: 'created', type: 'string'},
      {arg: 'ttl', type: 'number'}
    ],
    description: 'Login as an existing User'
  });

  Client.remoteMethod('logout', {
    accepts: [{
      arg: 'req',
      type: 'object',
      required: true,
      description: '',
      http: {
        source: 'req'
      }
    }],
    description: 'Logout User'
  });

};
