'use strict';

module.exports = function(app) {
  
  var Client = app.models.Client;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  
  Client.findOne({where: {email: 'admin@admin.com'}}, function(err, returnedClientInst){
  	if(!returnedClientInst){
	  	Client.create({username: 'Admin', email: 'admin@admin.com', password: 'adminopensesame'}
	   	, function(err, user) {
	    if (err) throw err;

	    console.log('Created users:', user);
	    Role.findOne({where: {name: "admin"}}, function(err, returnedRoleInst){
	    	if(!returnedRoleInst){
	    		//create the admin role
			    Role.create({
			      name: 'admin'
			    }, function(err, role) {
			      if (err) throw err;

			      console.log('Created role:', role);

			      //make bob an admin
			      role.principals.create({
			        principalType: RoleMapping.USER,
			        principalId: user.id
			      }, function(err, principal) {
			        if (err) throw err;

			        console.log('Created principal:', principal);
			      });
			    });
	    	}
	    });
	    
	  });
  	}
  });
};
