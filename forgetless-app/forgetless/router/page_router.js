module.exports = function(app) {

    var pageController = require('../controllers/index_controller.js');

    app.get('/', function(request, response){
        pageController.index(request, response);
    });

};