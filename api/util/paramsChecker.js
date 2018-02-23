var error = require('../exception/customError');
var constant = require('./constants');
var logger = require('./logger');

var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

exports.validateCategory= function(req,next){
	if(req.query!=undefined){
		if(req.query.category!=undefined){
			return next(null,true)
		}else{
			return next(new Error());
		}
	}else{
		return next(new Error());
	}
};

exports.validateRequestId= function(id){
	logger.info('Validating resourceId :%s',id);
	return new Promise((resolve,reject)=>{
		if(id !=undefined){
			return resolve(true);
		}else{
			reject(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS))
		}
	});
};

exports.validateRequestParams= function(id,subId){
	logger.info('Validating ids :%s,%s',id,subId);
	return new Promise((resolve,reject)=>{
		if(id !=undefined && subId!=undefined){
			return resolve(true);
		}else{
			reject(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
		}
	})
};

exports.getDayfromDate = function(date,next){
	var date = new Date(date);
	var day = date.getDay()
	console.log(days[day]);
	return next(null,days[day]);
	
}