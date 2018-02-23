var app = require('./app');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


//var routes = require('./api/routes/rootResourcesRoutes');

//var app = express();
var port = process.env.port ||3000;

mongoose.connect('mongodb://localhost/bookingengine');

//routes1(app);
var server = app.listen(port,function(){
    console.log('Server started on port :',server.address().port);
})
