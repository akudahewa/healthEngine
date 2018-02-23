'use strict';

require('../models/subResourceModel');
var mongoose = require('mongoose');
var RootResource = mongoose.model('RootResources');
var subResources = mongoose.model('SubResources');

exports.getAllSubResources = function(req,res){
    console.log('Trying to access all sub resources');
    res.json('Sub ....');

};

exports.updateSubResources = function(req,res){
	console.log('update sub resources !!!');
	var subResource = new subResources(req.body);
	RootResource.findOneAndUpdate(
		req.query.id,
		{$addToSet: {"resources": subResource}},
		{strict: false,safe: true, upsert: true, new : true},
        function(err, model) {
        	if(err){
        		console.log("---------------------"+err);
        		res.send(err);
        	}

            res.json(model);
        }
    );
};

