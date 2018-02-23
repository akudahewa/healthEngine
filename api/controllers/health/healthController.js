// 'use strict';

 require('../../models/health/root');
 require('../../models/health/sub');
 require('../../models/transactionModel');
 var mongoose = require('mongoose');
 var dateformat = require('dateformat');
 var healthResource = mongoose.model('Health');
 var subHealthResources = mongoose.model('subHealth');
 var transacion = mongoose.model('Transaction');
 var constant = require('../../util/constants');
 var paramsChecker = require('../../util/paramsChecker');
 var ObjectId = require('mongoose').Types.ObjectId; 
 const logger = require('../../util/logger');
 var utility = require('../../util/utility');
 var error = require('../../exception/customError');

function Health(label){
	this.label=label;
};


function get(query){
	var status = 2;
	logger.info('DB Access object :%s',JSON.stringify(query))
	return new Promise((resolve,reject)=>{
		healthResource.aggregate([
	    	{$unwind:"$bookableObject"},
			{$match:{$and:[
   		    	{'bookableObject.session.code':query.session},
 				{'code':query.code},
 				{'bookableObject.day':query.day}]}},
    		{$project:{
        		'resource':1,
        		'code':1,
        		'bookableObject.maxBookings':1,
        		'bookings':
             	{$filter:{input:'$bookableObject.tnxStatus',as:'data',
                    cond: { $and: [{$eq:['$$data.bookedDates.date', query.date]},
                        {$ne:['$$data.bookedDates.status',status]}
                         ]
                        }                    
                      }
            		}
      		 	}
   			},
   			{$project:{
       			'resource':1,
       			'code':1,
       			'bookableObject.maxBookings':1,
       			'result':'$bookings',
       			'count':{$size:'$bookings'}}}
	    ]).exec()
		.then(function(data){
			logger.info('successfully recevied resources: %s',JSON.stringify(data));
			return resolve(data);
		})
	})
};

function getBookings(reqData){
	logger.info('Trying to get Booking count');
	return new Promise((resolve,reject)=>{
		healthResource.aggregate([
			{$unwind:'$bookableObject'},
			{$match:{$and:[
    		{'code':'DBB'},
    		{'bookableObject.day':'MONDAY'}
    		]}},
			{$unwind:'$bookableObject.tnxStatus'},
			{$match:{$and:[{'bookableObject.tnxStatus.bookedDate.date':'2018-02-26'},
            	{'bookableObject.tnxStatus.bookedDate.status':{$ne:3}}
			]}},
			{$group:{_id:{source:'$code',maximum:'$bookableObject.maxBookings'},
				tnx:{$push:'$bookableObject.tnxStatus'},count:{$sum:1}
			}},
			{$project:{'tnx':1,'count':1,'id.maximum':1,'limitExceed':{$gte:['$count','$_id.maximum']}}}
		]).exec()
		.then(function(result){
			logger.info('----------------------- result ----------- %s',JSON.stringify(result));
			reqData.appoinmentNo = result.length > 0 ? result[0].count : 1;
			reqData.limitExceed  = result.length > 0 ? result[0].limitExceed : false;
			return resolve(reqData);
		})
	});
}; 

Health.prototype.getResources = function(req) {
	return utility.generateRequestObject(req)
		.then(utility.checkAvailability)
		.then(function(data){
			if(data.available==true){
				return get(data);	
			}else{
				return utility.message(constant.DR_UNAVAILABLE);
			}
			
	});
};

/**
Create root resource
**/

Health.prototype.createResource = function(req){
	return new Promise((resolve,reject)=>{
		var healthObj = new healthResource(req.body);
		healthObj.save().then(
			savedObj =>{
				logger.info('successfully created %s',savedObj);
				return resolve(savedObj);
			})
		.catch(err=>{
			logger.error('Create resources : %s',err);
			reject(error.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR));
		})
	});
};

Health.prototype.updateSubResources = function(req){
	return new Promise((resolve,reject)=>{
		healthResource.update(
		{_id:req.query.id,bookableObject:{$elemMatch:{_id:req.query.subResId}}},
		{$set:{
			"bookableObject.$.maxBookings":req.body.maxBookings,
			"bookableObject.$.absentDays":req.body.absentDays,
			"bookableObject.$.session.startTime":req.body.session.startTime
		}
		})
		.then(updatedObj =>{
			logger.info('successfully updated sub document/s');
			return resolve(updatedObj);
		})
		.catch(err=>{
			logger.error('Update sub resource :%s',err);
			reject(error.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR));
		})
	});
};

/**
Add sub resources to base resource
**/
Health.prototype.addSubResources = function(req){
	return new Promise((resolve,reject)=>{
		var subResource = new subHealthResources(req.body);
		healthResource.findOneAndUpdate(
			{_id:req.query.id},
			{$addToSet: {"bookableObject": subResource}}
			)
		.then(updatedObj =>{
			logger.info('Added sub resources ');
			return resolve(updatedObj);
		})
		.catch(err=>{
			logger.error('Adding sub resources: %s',err);
			reject(error.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR))
		})
	})
};

/**
Update sub resources 
**/
Health.prototype.updateResource = function(req){
	return new Promise((resolve,reject)=>{
		logger.info('update root resources ');
		var h = new healthResource(req.body);
		healthResource.update(
			{_id:req.query.id},
			{$set:{
				"code":h.code,
				"resource.primaryResource.name":h.resource.primaryResource.name,
				"resource.bindResource.name":h.resource.bindResource.name,
				"resource.bindResource.address":h.resource.bindResource.address,
				"active":h.active,
				"images":h.images}
			})
		.then(updatedRootObj=>{
			logger.info('Root resources successfully updated');
			return resolve(updatedRootObj);
		})
		.catch(err=>{
			logger.error('Updating sub resources :%s',err);
			reject(error.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR));
		})
	});
};

function saveTransaction(query,tnxObj){
	return new Promise((resolve,reject)=>{
		logger.info('Saving tnx :%s',JSON.stringify(tnxObj));
		var tnxModel = new transacion(tnxObj);
		var opts = { runValidators: true };
		healthResource.findOneAndUpdate( 
        {$and:[{_id:query.id},{bookableObject:{$elemMatch:{_id:query.subResId}}}]},
        {$push: {"bookableObject.0.tnxStatus":tnxModel}},opts
    	)
    	.then(updatedObj=>{
    		logger.info('successfully create the transaction :%s',updatedObj);
    		return resolve(updatedObj);
    	}).catch(err=>{
    		logger.error('Creating a transaction :%s',err);
    		reject(error.generateError(constant.INTERNAL_SERVER_ERROR_CODE,constant.INTERNAL_SERVER_ERROR))
    	})
	});
}

Health.prototype.createTransaction = function(req){
	logger.info('Create transacion object ');
	return getBookings(req.body)
	.then(function(data){
		logger.info('checking limit :%s',data.limitExceed)
		if(data.limitExceed==false){
			return saveTransaction(req.query,data);
		}else{
			return (utility.message(constant.BOOKING_FULL));
		}
	})
};

Health.prototype.updateTransaction = function(req,res,next){
	logger.info('Update tnx record');
    var rootResourceId = req.query.id;
    var subResourceId = req.query.subResId;
    var tnxModel = new transacion(req.body);
    
    healthResource.findOne( 
        {$and:[{bookableObject:{$elemMatch:{_id:req.query.subResId}}},
        {'bookableObject.tnxStatus.':{$elemMatch:{_id:{ $eq: new ObjectId(req.query.tnxId)}}}}
        ]},
        function(err, model) {
        	if(err){
        		logger.log("Error occur while updating tnx object :%s",err);
        		return next(err,new Error('Error occur while creating transaction'));
        	}
           return next(null,model);
        }
    );

    	
    	healthResource.findOneAndUpdate( 
        {$and:[{_id:rootResourceId},{bookableObject:{$elemMatch:{_id:req.query.subResId}}},
        {'bookableObject.tnxStatus.userId':"333"}]},
        {$set: {"bookableObject.0.tnxStatus.$.bookedDates.status": '3'}},
        function(err, model) {
        	if(err){
        		console.log("Error occur while saving tnx object :"+err);
        		return next(err,new Error('Error occur while creating transaction'));
        	}
            return next(null,model);
        }
    );

}

module.exports =Health;
