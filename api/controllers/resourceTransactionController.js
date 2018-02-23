'use strict';

require('../models/transactionModel');
require('../models/rootResourcesModel');
var mongoose = require('mongoose');
var RootResource = mongoose.model('RootResources');
var transacion = mongoose.model('Transaction');


exports.createTransaction = function(req,res){
	console.log('Hit Transaction data :'+ JSON.stringify(req.query.resourceId));
    var rootResourceId = req.query.TnxId;
    var tnxModel = new transacion(req.body);
    console.log('==================================='+tnxModel);
	RootResource.findOneAndUpdate(
        {$and:[{rootResourceId},{"resources.session":"MORNING"}]},
        //rootResourceId,
        //{$addToSet: {"resources.0.tnxStatus": {"userId": 22, "amount": 22222,"commission" : 30}}},
        {$addToSet: {"resources.0.tnxStatus": tnxModel}},
        {strict: false,safe: true, upsert: true, new : true},
        function(err, model) {
        	if(err){
        		console.log("---------------------"+err);
        		res.send(err);
        	}

            res.json(model);
        }
    );
    console.log('sssssssssssssssssssssssssssssssssssssssssssssssssss')

}