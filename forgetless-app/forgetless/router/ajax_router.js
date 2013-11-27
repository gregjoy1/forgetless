module.exports = function(app) {

    var ajaxController = require('../controllers/ajax_controller.js');

    app.get('/ajax/', function(request, response){
        ajaxController.dump(request, response);
    });

    app.get('/ajax/login', function(request, response){

    });

};