'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var RootResourceSchema = new schema({
	resource:
	{
		primaryResource:{
			name:{
				type:String,
				required: true
			},
			code:{
				type:String,
				required: true
			}
		},
		bindResource:{
			name:{
				type:String
			},
			code:{
				type: String
			},
			address:{
				type:String
			}

		}

	},
	category:{
		type:String,
		enum:['ACCOMADATION','HEALTH','TICKETS','CABS','OTHER'],
		default:'OTHER'
		
	},
	address :{
		type: String
	},
	active:{
			type: Number,
			enum:[0,1],
			default:1
		
	},
	images:{
		type:String
	},
	bookableObject:[
	{

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
		absentDays:[String],
		tnxStatus:[],
		innerImages:[String],
	}

	]
});

module.exports = mongoose.model('RootResources',RootResourceSchema);