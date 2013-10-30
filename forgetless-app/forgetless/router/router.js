module.exports = {
    setUpAndStartRouting:function(app, db){
        app.get('/', function(request, response){
            require('../controllers/index_controller.js').index(request, response, db);
        });
    }
};
