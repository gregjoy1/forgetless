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

        GLOBAL.defs.ReminderHelper.GetAllRemindersForUser(false, 1, function(err, reminders) {
            console.log(err, reminders);
            response.end(JSON.stringify(reminders));
        });

    });

};