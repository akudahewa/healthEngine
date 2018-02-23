'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var subHealthSchema = new schema({
	day:{
			type:String,
			required: true
		},
		session:{
			code:{
				type:String
			},
			startTime:{
				type:String
			}
		},
		maxBookings:{
			type : Number
		},
		name:{
			type:String
		},
		absentDays:[String],
		tnxStatus:[]
})

module.exports = mongoose.model('subHealth',subHealthSchema);