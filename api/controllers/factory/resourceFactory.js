'use strict';
var  health = require('../health/healthController')
var logger = require('../../util/logger');


exports.getResourceObject = function(category,next){
	if(category =='HEALTH'){
		return next(null,new health());
	}
	logger.error('can not match any category for request :%s',category);
	return next(new Error('InvalidCategory'));
};