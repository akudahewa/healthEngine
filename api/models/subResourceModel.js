'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var SubResourceSchema = new schema({
	day:{
			type:String
		},
		session:{
			type:String
		},
		startTime:{
			type:String
		},
		maxBookings:{
			type : Number
		},
		name:{
			type:String
		},
		features:{
			type:String
		},
		maxCount:{
			adult:{
				type:Number
			},
			child:{
				type:Number
			},
			person:{
				type:Number
			}
		},
		tnxStatus:[],
		innerImages:[String]
})

module.exports = mongoose.model('SubResources',SubResourceSchema);