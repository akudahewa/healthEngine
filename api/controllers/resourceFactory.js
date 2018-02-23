'use strict';
var  health = require('./health/healthController')


exports.getResourceObject = function(req,res){
	console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; '+req);
	return new health("dsd").getResources(req,res);
	//res.json("result");
}