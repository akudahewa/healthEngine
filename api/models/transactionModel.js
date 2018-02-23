'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var TransactionSchema = new schema({
			userId:{
				type:String
			},
			mobileNo:{
				type:String,
				required:true
			},
			amount:{
				type:Number
			},
			// session:{
			// 	type : String
			// },
			commission:{
				type:Number
			},
			bookedDate:
			{
				date:{
					type:String,
					required:true
				},
				status:{
					type:Number,
					enum:[-1,0,1],
					default:0
				}
			},
			appoinmentNo:{
				type:Number
			}
			
});

module.exports = mongoose.model('Transaction',TransactionSchema);

