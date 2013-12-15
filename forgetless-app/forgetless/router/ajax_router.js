module.exports = function(app) {

    var ajaxController = require('../controllers/ajax_controller.js');

    app.get('/ajax/', function(request, response){
        ajaxController.dump(request, response);
    });

    app.post('/ajax/user/login', function(request, response){

    });

    app.get('/ajax/test', function(request, response){

//        GLOBAL.defs.UserHelper.Login('greg@greg.com', 'password', response, function(success, userModel) {
//            console.log(success, userModel);
//            response.end('test');
//        });

        response.end(request.cookies.usertoken);

//        if(request.cookies.usertoken != null) {
//            GLOBAL.defs.UserHelper.LoginWithUserToken(request.cookies.usertoken, function(success, userModel) {
//                console.log(success, userModel);
//                response.end('test');
//            });
//        } else {
//            console.log('so this is awkward. No user token :/');
//            response.end('sheet');
//        }

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