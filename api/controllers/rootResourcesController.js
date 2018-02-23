'use strict';

require('../models/rootResourcesModel');
var mongoose = require('mongoose');
var rootResource = mongoose.model('RootResources');


var buildSearchQuery = function(primaryResCode,date,venueCode,session){
	var q=[];
	if(date !=undefined){
		var con1 ={'resources.tnxStatus.bookedDates.date':date};
		q.push(con1);
	}
	if(primaryResCode!=undefined){
		var con2 = {"resource.primaryResource.code":primaryResCode};
		q.push(con2);
	}
	if(venueCode!=undefined){
		var con3 = {'resource.bindResource.code':venueCode};
		q.push(con3);
	}
	if(session!=undefined){
		var con4 = {'bookableObject.session':session};
	}
	console.log(JSON.stringify(q))
	return q;
	
}

exports.getResources = function(req,res){
	var primaryResourceCode = req.query.code;
	var date = req.query.date;
	var venueCode = req.query.venueCode;
	var session = req.query.session;
	console.log('Trying to access root resources '+primaryResourceCode +" "+date +'------------'+venueCode);
    rootResource.aggregate([
    {	$unwind:"$resources"},
    {	$unwind:"$resources.tnxStatus"},
    {	$match:{
    		$and:buildSearchQuery(primaryResourceCode,date,venueCode,session)
    	}
    },
    {$group :{_id:"$resources.session", bookings :{$push:"$resources"}}}
    ], function(err,result){
    	if(err){
    		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> err '+err)
    		res.send(err);
    	}else{
    		console.log('ssssssssssssssssssssssssssssssssss '+JSON.stringify(result))
    		for(var i in result){
    			console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii '+result[i].bookings.length) 
    			result[i]['count']= result[i].bookings.length;
    		}
    		res.json(result);
    	}
    });

};


exports.createResources = function(req,res){
	console.log('create Root Resource obj'+ JSON.stringify(req.body)  );
	var resObj = new rootResource(req.body);
	resObj.save(function(err,success){
		if(err){
			console.log('Error occur when creating resource '+err)
			res.send(err);
		}
		console.log('Resource successfully created  '+success)
		res.json(success);
	})
}

exports.updateResource = function(req,res){
	console.log('Update resources '+req.query.id);
	rootResource.findByIdAndUpdate(req.query.id,req.body,function(err,result){
		if(err) {
			res.send(err)
		}
		console.log('Successfully updated resource obj :'+JSON.stringify(result));
		res.json(result);
	})
}