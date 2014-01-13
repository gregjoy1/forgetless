module.exports = function(app) {

    var pageController = require('../controllers/index_controller.js');

    app.get('/', pageController.index);

    app.get('/app', pageController.app);

};