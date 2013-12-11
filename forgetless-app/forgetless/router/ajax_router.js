module.exports = function(app) {

    var ajaxController = require('../controllers/ajax_controller.js');

    app.get('/ajax/', function(request, response){
        ajaxController.dump(request, response);
    });

    app.get('/ajax/login', function(request, response){

    });

    app.get('/ajax/test', function(request, response){

//        GLOBAL.defs.User(null, null, function(err, user) {
//            user.login('greg@greg.com', 'password', function(success, userModel) {
//                console.log(success, userModel);
//                response.end('test');
//            });
//        });

//        GLOBAL.defs.Item(null, null, function(err, item) {
//            item.zoneId = 1;
//            item.title = "testing";
//            item.content = "Im testing.";
//            item.audit_id = 1;
//            item.save(function(err){
//                console.log(err);
//                console.log('done');
//                response.end('done');
//            });
//        });
    });

};