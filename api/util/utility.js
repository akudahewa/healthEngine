  var mongoose = require('mongoose');
  var dateformat = require('dateformat');
 var healthResource = mongoose.model('Health');
 var logger = require('./logger');
 var constant = require('./constants');
 var ex =require('../exception/customError');

exports.days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

daysofWeek = function(){
	var days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
	return days;
};

exports.checkAvailability =function (reqObj){
	logger.info('Check absent :%s',JSON.stringify(reqObj));
	return executeIsAbsent(reqObj)

};

function setAbsent(reqObj,value){
	return new Promise((resolve,reject)=>{
		logger.info('Set absent status to request [status :%s]',value);
		reqObj.isAbsent = value;
		return resolve(reqObj);
	})

}

exports.message = function(msg){
	return new Promise((resolve,reject)=>{
		return resolve({'message':msg});
	})
}

exports.checkAvailability =function(reqObj){
	return new Promise((resolve,reject)=>{
		reqObj.available = true;
		var q=[];
		q.push({'bookableObject.absentDays':reqObj.date});
		q.push({"code":reqObj.code});
		q.push({'bookableObject.session.code':reqObj.session});
		logger.info('Checking unvailability : %s ',JSON.stringify(q));
		healthResource.aggregate([
			{$match:{$and:q}
			}
		]).exec()
		.then(function(result){
			logger.debug('unavailable result set :%s ,length',result,result.length);
			if(result.length >0){
				logger.info('Given criteira is unavailable :%s',JSON.stringify(result));
				reqObj.available = false;
			}
			return resolve(reqObj);
		})
	})
};

function getSession(reqObj){
	return new Promise((resolve,reject)=>{
		logger.info('Validating session [code: %s, day: %s, session: %s]',reqObj.code,reqObj.day,reqObj.session);
			healthResource.aggregate([
				{$match:{$and:[{'code':reqObj.code},{'bookableObject.day':reqObj.day}]}},
				{$unwind:'$bookableObject'},
				{$group:{_id:'$resource',session:{$addToSet:'$bookableObject.session.code'},count:{$sum:1}}}
				]).exec()
				.then(function(result){
					logger.info('sessions found from db result: %s',JSON.stringify(result[0]));
					if(result.length ==0){
						logger.error('Sessions not found in the system. Invalid data in data base');
						reject(ex.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR)) ; 
					}else{
						if(reqObj.session ==undefined){
							if(result[0].session >1){
								logger.error('Session time need to be in request. Multiple sessions available');
								reject(ex.generateError(constant.INVALID_REQ_CODE,constant.MISSING_SESSION));
							}
							reqObj.session = result[0].session[0];
							return resolve(reqObj);
						}else{
							if(result[0].session.includes(reqObj.session)){
								logger.info('Requested session match with db sessions :%s',result[0].session)
								return resolve(reqObj);
							}else{
								logger.error('Request session doest not appear in the system: %s',reqObj.session);
								reject(ex.generateError(constant.INVALID_REQ_CODE,constant.INVALID_SESSION));
							}
						}
					}
				}).
				catch(function(err){
					logger.error('Error occur while getting session from db : %s',err);
					reject(ex.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR));
				})
		});
};

exports.generateRequestObject = function(req){
	logger.info('Generating request object');
	return requestObject(req)
	.then(getDate)
	.then(getDayfromDate)
	.then(getSession)
};

function requestObject(req,day){
	let reqObj = {
		date:req.query.date,
		code:req.query.code,
		session:req.query.session,
		location:req.query.searchLocation
	}
	return Promise.resolve(reqObj);
};

function getDate(reqObj){
	return new Promise((resolve,reject)=>{
		var date;
		if(reqObj.date===undefined){
			var today =dateformat((new Date(Date.now()).toLocaleString()),'yyyy-mm-dd');
			reqObj.date = today;
		}
		return resolve(reqObj);
	})
};

function getDayfromDate (reqObj){
	return new Promise((resolve,reject)=>{
		logger.info('Generating Day from request date : %s',reqObj.date)
		var day = daysofWeek()[new Date(reqObj.date).getDay()]
		logger.info('Extract day from %s %s',reqObj.date,day);
		reqObj.day = day;
		if(day==undefined){
			logger.error('Request terminated. Error occur while extract day :%s',JSON.stringify(req.query));
			reject(new Error(constant.INVAILD_DATE))
		}
		return resolve(reqObj);
	})
};


