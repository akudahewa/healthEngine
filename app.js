var express = require('express');
var path = require('path');
var routes = require('./api/routes/rootResourcesRoutes');
var transactions = require('./api/routes/resourceTransactionRoutes');
var subResources = require('./api/routes/subResourcesRoutes');
 var logger = require('./api/util/logger');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

routes(app);
transactions(app);
subResources(app);

app.use(function(err, req, res, next) {
  if(err.status === 404) {
    res.status(err.status)
  .send(err.message || '** not found **');
  }
  return next(err);
  
});

app.use(function(err, req, res, next) {
  if(err.status === 422) {
  	logger.error('request failed ,code :%s ,error :%s',err.status,err.message);
    res.status(err.status)
  .send(err || '** Missing paramter **');
  }
 if(err.status === 500) {
  	console.log('5555555555555555555555555555555555555555555555555'+err.status)
    res.status(err.status)
  .send(err || 'internal server error ');
  }
});

//app.use('/root',resources);
//app.use('/tnx',transactions);

module.exports = app;
