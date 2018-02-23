'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema;
//require('./sub');
// var subSchema = mongoose.model('subHealth');

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
});


var HealthSchema = new schema({
	resource:
	{
		primaryResource:{
			name:{
				type:String,
				required: true
			}
		},
		bindResource:{
			name:{
				type:String,
				required: true
			},
			address:{
				type:String
			},
			metaLocation:{
				type:String
			}
		}

	},
	code:{
		type: String,
		required: true
	},
	timePerHead:{
		type:Number,
		default:3
	},
	appoinmentAllocation:{
		startingNo:{
			type:Number,
			default:1
		}
	},
	category:{
		type:String,
		enum:['ACCOMADATION','HEALTH','TICKETS','CABS','OTHER'],
		default:'OTHER'
		
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
		tnxStatus:[{
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
		}
		
			]
	}
	]
});

module.exports = mongoose.model('Health',HealthSchema);