forgetlessApp.service('stackService', function(userService, remoteStorageModelParserService, networkManagerService) {

    this.stack = {};

    this.getStack = function() {
        networkManagerService.makeRequest(
            '/ajax/stack/dump/',
            {},
            networkManagerService.GET_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            remoteStorageModelParserService.respondToError(err);
                        } else {
                            remoteStorageModelParserService.parseStack(detail);
                        }
                    });
                }
            }
        );
    };

    this.insertReminder = function() {

    };

    this.updateReminder = function() {

    };

    this.insertItem = function(listId, itemFields) {

    };

    this.updateItem = function(itemId, itemFields) {

    };

    this.insertList = function(categoryId, listFields) {

    };

    this.updateList = function(listId, listFields) {

    };

    this.insertCategory = function(categoryFields) {

    };

    this.updateCategory = function(categoryId, categoryFields) {

    };

    this.login = function(email, password, callback) {
        networkManagerService.makeRequest('/ajax/user/login', {
            email: email,
            password: password
        },
        networkManagerService.POST_METHOD,
        function(success, status, data, headers, config) {
            if(success) {
                // TODO sort this shit out properly
                console.log('could not connect to server?!');
            } else {
                remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                    if(err) {
                        // TODO add "incorrect password" notification to partial
                        remoteStorageModelParserService.respondToError(err);
                        userService.userModel = {};
                        callback(false, null);
                    } else {
                        userService.userModel = detail;
                        callback(true, detail);
                    }
                });
            }
        });
    };

});

forgetlessApp.service('userService', function() {
    this.loggedIn = false;
    this.userModel = {};
});

forgetlessApp.service('localStorageService', function() {

});

forgetlessApp.service('statusService', function() {

});

forgetlessApp.service('networkManagerService', function(statusService, localStorageService, remoteStorageModelParserService) {

    var requestQueue = [];

    var timeoutId = undefined;

    this.POST_METHOD = 'post';
    this.GET_METHOD = 'get';

    this.makeRequest = function(url, fields, method, callback) {
        requestQueue.push({
            method: method,
            url: url,
            fields: fields,
            callback: callback
        });
        processRequests();
    };

    var processRequests = function() {
        if(requestQueue.length > 0) {
            remoteStorageModelParserService.makeRequest(requestQueue[0], function(success, status, data, headers, config) {
                // checks if callback exists and is not undefined, then calls callback
                if(requestQueue[0] != undefined && typeof requestQueue[0].callback == 'function') {
                    requestQueue[0].callback(success, status, data, headers, config);
                }
                // if success, then remove request from queue
                if(success) {
                    requestQueue.shift();
                }
                timeoutId = setTimeout(processRequests, 30000);
            });
        } else {
            if(timeoutId != undefined) {
                clearTimeout(timeoutId);
            }
        }
    };

});

forgetlessApp.service('remoteStorageModelParserService', function(remoteStorageService, userService) {
    this.makeRequest = function(request, callback) {
        if(request.method = 'post') {
            remoteStorageService.makePostRequest(request.url, callback);
        } else {
            remoteStorageService.makeGetRequest(request.url, request.fields, callback);
        }
    };

    this.parseStatus = function(data, callback) {
        if(data.error) {
            callback({
                errorDetails: data.details,
                errorCode: data.code
            }, {});
        } else {
            callback(null, data.details);
        }
    };

    this.respondToError = function(errObj) {
        switch(errObj.code.toUpperCase()) {
            case 'UE-1':
                userService.loggedIn = false;
                break;
            default :
                break;
        }
    };

    this.parseStack = function(stack, callback) {

    };

});

forgetlessApp.service('remoteStorageService', function($http) {

    this.makeGetRequest = function(url, callback) {
        $http.get(url).success(function(data, status, headers, config) {
            callback(true, status, data, headers, config);
        }).error(function(data, status, headers, config) {
            callback(false, status, data, headers, config);
        });
    };

    this.makePostRequest = function(url, fields, callback) {
        $http.post(url, fields).success(function(data, status, headers, config) {
            callback(true, status, data, headers, config);
        }).error(function(data, status, headers, config) {
            callback(false, status, data, headers, config);
        });
    };

});

