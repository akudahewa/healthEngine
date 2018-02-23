'use strict';
var  resFactory = require('./factory/resourceFactory');
var paramsCheck = require('../util/paramsChecker');
var constant = require('../util/constants');
var error = require('../exception/customError');
var logger = require('../util/logger');
var  health = require('./health/healthController')


/**
Handle create resource object
input : query params - [category]
	    req body - json doc
**/
exports.createResource = function(req,res,next){
	logger.info('POST : %s',JSON.stringify(req.body));
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.createResource(req)
			.then(function(data){
				res.json(data);
			})
			.catch(function(err){
				logger.error('POST request terminated.');
				return next(err);
			})
	});
};

exports.getResources = function(req,res,next){
	logger.info('GET : %s',JSON.stringify(req.query));
	resFactory.getResourceObject(req.query.category,function(err,resObj){
		if(err){
			return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
		}
		resObj.getResources(req)
		.then(function(data){
			res.json(data);
		})
		.catch(function(err){
			logger.error('Error while getResource : %s',err);
			return next(err);
		})
	})
};



/**
Handle update root resources
input : query params - [id, category]
		req body - json doc

**/
exports.updateResource = function(req,res,next){
	logger.info('UPDATE :%s',req.body);
	paramsCheck.validateRequestParams(req.query.id)
	.then(isValid =>{
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.updateResource(req)
			.then(function(data){
				res.json(data);
			})
		})
	})
	.catch(	err=>{
		logger.error('Add sub resources terminated.')
		return next(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
	})
}

/**
Handle adding sub resources to base resource
input : category as a query params
		rootResourceId as a query params
		sub resource req body
**/

exports.addSubResources = function(req,res,next){
	logger.info('Add update sub resources: %s',JSON.stringify(req.body));
	paramsCheck.validateRequestId(req.query.id)
	.then(isValid => {
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.addSubResources(req)
			.then(function(data){
				res.json(data);
			})
			.catch(function(err){
				logger.error('Add sub resources ');
			})
		});
	})
	.catch(err=>{
		logger.error('Add sub resources terminated.')
		return next(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
		}
	);
};

exports.updateSubResources = function(req,res,next){
	logger.info('Update sub resources :%s',JSON.stringify(req.body));
	paramsCheck.validateRequestParams(req.query.id,req.query.subResId)
	.then(isValid =>{
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.updateSubResources(req)
			.then(function(data){
				res.json(data);
			})
		});
	})
	.catch(err=>{
		logger.error('Update sub resources terminated :%s',err)
		return next(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
		}
	);
};

exports.createTransaction = function(req,res,next){
	logger.info('CREATE Transaction :%s ',req.body);
	paramsCheck.validateRequestParams(req.query.id,req.query.subResId)
	.then(isValid=>{
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.createTransaction(req)
			.then(function(data){
				logger.info('???????????????????????????///////// %s',JSON.stringify(data))
				res.json(data);
			})
			.catch(err=>{
				logger.info('db error :%s',err)
				return next((error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS)));
			})
		});
	})
	.catch(err=>{
		logger.error('Create transaction terminated :%s',err)
		return next(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
	})
};

exports.updateTransaction = function(req,res){
	logger.info('CREATE Transaction :%s ',req.body);
	paramsCheck.validateRequestParams(req.query.id,req.query.subResId)
	.then(isValid=>{
		resFactory.getResourceObject(req.query.category,function(err,resObj){
			if(err){
				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
			}
			resObj.updateTransaction(req)
			.then(function(data){
				res.json(data);
			})
		});
	})
	.catch(err=>{
		logger.error('Create transaction terminated :%s',err)
		return next(error.generateError(constant.INVALID_REQ_CODE,constant.MISSING_REQ_PARAMS));
	})
};



// exports.updateTransaction = function(req,res){
// 	console.log('Handle update Transaction data ');
// 	var category = req.query !=undefined ? req.query.category :undefined;
// 	paramsCheck.validateResIds(req,function(err,success){
// 		if(err){
// 			return next(error.generateError(422,'invalid input '));
// 		};
// 		resFactory.getResourceObject(category,function(err,resObj){
// 			if(err){
// 				console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
// 				return next(error.generateError(constant.INVALID_REQ_CODE,constant.MiSSING_CATEGORY));
// 			}
// 			resObj.updateTransaction(req,res,function(err,result){
// 				if(err){
// 						console.log('########################## error #############')
// 						return next(error.generateError(500,'Internall server error'));
// 					}
// 					res.json(result);
// 			});
// 		});
// 	});
// };