module.exports = {
    setUpAndStartRouting:function(app){
        app.get('/', function(request, response){
            require('../controllers/index_controller.js').index(request, response);
        });



    }
};
