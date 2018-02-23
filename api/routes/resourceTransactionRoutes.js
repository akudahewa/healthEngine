module.exports = function(app){
    var requestManager = require('../controllers/requestManager');

    app.route('/transactions')
   // .get(resTrnxCon.getTransactions)
    .post(requestManager.createTransaction)
    .put(requestManager.updateTransaction);

//    app.route('/rootResources/')

    
}