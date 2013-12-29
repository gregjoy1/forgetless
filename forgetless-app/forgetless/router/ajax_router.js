module.exports = function(app) {

    var ajaxController = require('../controllers/ajax_controller.js');

    // AJAX root route
    app.get('/ajax/', function(request, response) {
        ajaxController.stackDump(request, response);
    });

    // AJAX stack routes

    // GET ROUTES


    // POST ROUTES
    app.get('/ajax/stack/dump', function(request, response) {
        ajaxController.stackDump(request, response);
    });

    // AJAX user routes

    // GET ROUTES
    app.get('/ajax/user/', function(request, response) {
        ajaxController.displayUserLoginStatus(request, response);
    });

    // POST ROUTES
    app.post('/ajax/user/login', function(request, response) {
        ajaxController.login(request, response);
    });

    // AJAX TESTS - TODO disregard
    app.get('/ajax/test', function(request, response) {

//        GLOBAL.defs.UserHelper.Login('greg@greg.com', 'password', response, function(success, userModel) {
//            console.log(success, userModel);
//            response.end('test');
//        });

//        response.end(request.cookies.usertoken);

        GLOBAL.defs.UserHelper.IsUserLoggedIn(request, function(success, user) {
            response.end(success ? 'yay' : 'no yay');
        });

//        if(request.cookies.usertoken != null) {
//            GLOBAL.defs.UserHelper.LoginWithUserToken(request.cookies.usertoken, function(success, userModel) {
//                console.log(success, userModel);
//                if(success) {
//                    response.write('YAY');
//                } else {
//                    response.write('OH NO! D:');
//                }
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