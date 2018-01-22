'user strict'
const cloudantAPI_Users = require('../../cloudantAPI/cloudantAPI_users.js');

module.exports = function(Client) {
	var UsersAPI = new cloudantAPI_Users();

	Client.register = function(username, email, password, callback){
		var user = {
			username: username,
			email: email,
			password: password
		};

		UsersAPI.createUser(user,(error, response) => {
		    if(error) throw error;
		    console.log(response);

		    callback(null, response);
		});
	}

	Client.login = function(user, callback){
		UsersAPI.loginUser(user,(error,response)=>{
			if(error) throw error;
			console.log(response);
			callback(null,response);
		});
	}

	Client.logout = function(accessToken, callback){
		UsersAPI.logoutUser(accessToken,(error,response) =>{
			if(error) throw error;
			console.log(response);
			callback(null,response);
		});
	}

	Client.remoteMethod('register', {
		accepts: [{arg: 'username', type: 'string'}, {arg: "email", type:"string"},{arg:"password",type:"string"}],
		returns: {arg: 'response', type: 'string'}
	});

	Client.remoteMethod('login',{
		accepts: {arg: 'user', type: 'string'},
		returns: {arg: 'response', type: 'string'}
	});

	Client.remoteMethod('logout', {
		accepts: {arg: 'accessToken',type:'string'},
		returns: {arg: 'response', type:'response'}
	});

};