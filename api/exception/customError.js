 var logger = require('../util/logger');

 
 exports.generateError = function(code,message){
 	var err = new Error();
 	err.status = code;
 	err.message = message;
 	return err;
 }