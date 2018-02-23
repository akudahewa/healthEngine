
doctor bookings

GET queries
  1. Dr Basnayake, Amandoluwa dis,2017-11-25
  2. Dr Basnayake, Amandoluwa dis,2017-11-25, Evening sessions

{
name : "Dr Basnayake Dispensary",
address: " No 13,Baseline rd,Amandoluwa",
active: 1,
images: "dispensary.jpg",
resources: [
	{
		name: "10.00 am -10.05 am",
		tnxStatus:{}
	}
	{
		name: "10.05 am -10.10 am",
		tnxStatus:{}
	}
	{
		name: "10.10 am -10.15 am",
		tnxStatus:{}
	}
	{
		name: "10.15 am -10.20 am",
		tnxStatus:{}
	}
	{
		name: "10.20 am -10.25 am",
		tnxStatus:{}
	}


Hotel bookings
{
"name":"ABC Hotel",
"category": "ACCOMADATION",
"address": "23,Base line rd,Amandoluwa",
"active": "success",
"images": "http://www.images.com/home.jpg",
"resources":[
{
"name": "standard room",
"features": "TV, wifi",
"maxCount": {
	"adult": 2,
	"child": 1
	},
"innerImages":["http://www.images.com/1.jpg","http://www.images.com/2.jpg","http://www.images.com/3.jpg"],
"tnxStatus":{
	
	}
}
]
},
{
name:"ABC Hotel",
category: "ACCOMADATION",
address: "23,Base line rd,Amandoluwa",
active: "success",
images: "http://www.images.com/home.jpg",
resources:[
{
name: "standard room",
features: "TV, wifi",
maxCount: {
	adult: 2,
	child: 1
	},
innerImages:["http://www.images.com/1.jpg","http://www.images.com/2.jpg","http://www.images.com/3.jpg"],
tnxStatus:[{
	userId:10,
	status:1,
	amount:300.00,
	commission:30,
	bookedDates:["2017-08-10","2017-08-11","2017-08-12"]
	}]
}
]
}

-------------------------HELATH -----------------------------

{
  "name": "Dr Wasantha",
  "category": "HEALTH",
  "address": "10,Minuwangoda rd,Andiambalama",
  "active": "success",
  "images": "http://www.images.com/dr.jpg",
  "resources": [
    {
      "day": "MONDAY",
      "session": "MORNING",
      "startTime": "6.30 AM",
      "maxAppoinment": "10",
      "tnxStatus":[ {
            "userId": 10,
            "status": 1,
            "amount": 300.00,
            "commission": 30,
            "bookedDates": [
            	{
            		"date":"2017-08-15",
            		"status":1
            	}
            ]
          },
          {
            "userId": 11,
            "status": 1,
            "amount": 300.00,
            "commission": 30,
             "bookedDates": [
            	{
            		"date":"2017-08-16",
            		"status":1
            	}
            ]
          },
          {
            "userId": 12,
            "status": 1,
            "amount": 300.00,
            "commission": 30,
             "bookedDates": [
            	{
            		"date":"2017-08-15",
            		"status":1
            	}
            ]
          }
          ]
    },
        {
      "day": "MONDAY",
      "session": "EVENING",
      "startTime": "5.30 PM",
      "maxAppoinment": "10",
      "tnxStatus":[ {
            "userId": 20,
            "status": 1,
            "amount": 300.00,
            "commission": 30,
             "bookedDates": [
            	{
            		"date":"2017-08-15",
            		"status":1
            	}
            ]
          }
          ]
    }
  ]
}

--------------------------------------------------------------------------

/**
TO DO services

get all resources for given type. Ex : type can be ACCOMADATION,HEALTH,CAB,TICKETS,SPORTS
get all resources for given search criteria, Ex :search by name,avaiable dates,address

update rootResources/resources information
delete rootResources/resources information


NEED TO PLAN

# For Dr appoinment, how to manage absent dates
#


**/



Queries

db.getCollection('rootresources').aggregate
([
{$unwind:"$resources"},
{$unwind:"$resources.tnxStatus"},
{$match:{$and:[{"resources.tnxStatus.bookedDates.date":"2017-08-15"},{"resources.session":"MORNING"}]}}
])

db.getCollection('rootresources').aggregate
([
{$unwind:"$resources"},
{$unwind:"$resources.tnxStatus"},
{$match:{$and:[{"resources.tnxStatus.bookedDates.date":"2017-08-15"},{"name":"Dr Wasantha"}]}},
{$group :{_id:"$resources.session", bookings :{$push:"$resources"}}}
])





Health.prototype.getResources = function(req,res,next) {
  var code = req.query.code;
  var primaryResourceCode = req.query.code;
  var date = req.query.date;
  var venueCode = req.query.venueCode;
  var session = req.query.session;
  var status = [1,-1];
  logger.info('Trying to retrive resources for code : %s  Date :%s',code,date);
  utility.isAbsent(utility.buildQueryForAbsentDays(code,date),function(err,result){
    if(err){
      return next(err);// res.json('Holiday');
    }else{
      console.log('+++++++++++++++++++++++++++++ else +++++++++++++++++++++++++++++ '+result)
      if(result==true){
          res.json({'msg':'Doctor is not available given date'})
      }else{
                healthResource.aggregate([
    { $unwind:"$bookableObject"},
    { $unwind:"$bookableObject.tnxStatus"},
    { $match:{
        $and:[
        primaryResourceCode!=undefined ? {"resource.primaryResource.code":primaryResourceCode}:{},
         venueCode!=undefined ? {"resource.bindResource.code":venueCode}:{},
         date != undefined ? {"bookableObject.tnxStatus.bookedDates.date":date} :{},
         session !=undefined ? {"bookableObject.session.code":session}:{},
         {"bookableObject.tnxStatus.bookedDates.status":{$in: status}}
        ]
        //buildAllSearchQuery(primaryResourceCode,venueCode,date,session,status)
      }
    }
    ,
    {'$group':{_id:{source:'$resource',maxBookings:"$bookableObject.maxBookings"}
  ,bookings:{$push:'$bookableObject.tnxStatus'},count:{$sum:1}}},
  {$project:
    {bookings:1,availability:{$lte:["$count","$_id.maxBookings"]} }
    
  }
    ], function(err,result){
      if(err){
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> err '+err)
        res.send(err);
      }else{
        console.log('ssssssssssssssssssssssssssssssssss '+JSON.stringify(result))

        res.json(result);
      }
    });

      }

  
    }
  });

};



COMPLETED
--------------------------
CREATE ROOT RESOURCES
UPDATE ROOT RESOURCES
ADD SUB RESOURCES

