module.exports = function(app){
    var requestManager = require('../controllers/requestManager');

    app.route('/subResources')
    //.get(subResCon.getAllSubResources)
    .put(requestManager.updateSubResources);

    app.route('/subResources/new')
    .put(requestManager.addSubResources);
    
}