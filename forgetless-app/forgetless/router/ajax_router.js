module.exports = function(app) {

    var ajaxController = require('../controllers/ajax_controller.js');

    // AJAX root route
    app.get('/ajax/', function(request, response) {
        ajaxController.stackDump(request, response);
    });

    app.get('/ajax/test', function(request, response) {
        console.log(GLOBAL.defs.HashHelper.HashEmailPassword('test@test.com', 'password', function(hash) {
            console.log(hash);
            response.end(hash);
        }));
    });

    // AJAX stack routes

    // GET ROUTES
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

    // ITEM ROUTES

    app.post('/ajax/item/create', function(request, response) {
        ajaxController.createItem(request, response);
    });

    app.post('/ajax/item/update', function(request, response) {
        ajaxController.updateItem(request, response);
    });

    app.post('/ajax/item/link', function(request, response) {
        ajaxController.linkPreExistingItemToList(request, response);
    });

    app.post('/ajax/item/remove', function(request, response) {
        ajaxController.removeLinkToPreExistingItem(request, response);
    });

    // LIST ROUTES

    app.post('/ajax/list/create', function(request, response) {
        ajaxController.createList(request, response);
    });

    app.post('/ajax/list/update', function(request, response) {
        ajaxController.updateList(request, response);
    });

    app.post('/ajax/list/link', function(request, response) {
        ajaxController.linkPreExistingListToCategory(request, response);
    });

    app.post('/ajax/list/remove', function(request, response) {
        ajaxController.removeLinkToPreExistingList(request, response);
    });

    // CATEGORY ROUTES

    app.post('/ajax/category/create', function(request, response) {
        ajaxController.createCategory(request, response);
    });

    app.post('/ajax/category/update', function(request, response) {
        ajaxController.updateCategory(request, response);
    });

    app.post('/ajax/category/link', function(request, response) {
        ajaxController.linkPreExistingCategoryToUser(request, response);
    });

    app.post('/ajax/category/remove', function(request, response) {
        ajaxController.removeLinkToPreExistingCategory(request, response);
    });

};