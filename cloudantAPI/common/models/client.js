'use strict';
var loopback = require('loopback');
var app = module.exports = loopback();
var RoleMapping = app.models.RoleMapping;

module.exports = function(Client) {
	Client.checkIfAdmin = function(userId,callback){
		var something = RoleMapping.find({
              "filter": {
                "where":{
                  "principalId": body.userId,
                  "roleId": "159882e4a5bdde9cc725eee8c13a1030"
                }
              }
            });
		if(something){
			 console.log("admin found");
			callback(null, true);
		}
		console.log("admin not found, test with RM is: ", something);
		callback(null,false);
	}

	Client.remoteMethod('checkIfAdmin', {
		accepts: {arg: "userId", type:"string", description: "Id of User"},
		returns: {arg: "isAdmin", type:"boolean"},
		description: "Check if specified user has Admin role assigned"
	});
};
