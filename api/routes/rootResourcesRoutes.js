module.exports = function(app){
    var requestManager = require('../controllers/requestManager');

   app.route('/rootResources')
   .get(requestManager.getResources)
   .post(requestManager.createResource)
   .put(requestManager.updateResource);
      
}