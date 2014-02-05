forgetlessApp.service('stackService', function(userService, remoteStorageModelParserService, networkManagerService, remoteStorageService) {

    this.stack = {};

    this.getStack = function(callback) {
        networkManagerService.makeRequest(
            '/ajax/stack/dump/',
            {},
            networkManagerService.GET_METHOD,
            function(success, status, data, headers, config) {
                var stack = [];
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            remoteStorageModelParserService.respondToError(err);
                        } else {
                            stack = remoteStorageModelParserService.parseStack(detail);
                            console.log('stack dump', stack);
                        }
                    });
                }
                callback(stack);
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

        remoteStorageService.makePostRequest(
            '/ajax/user/login',
            {
                email: email,
                password: password
            },
            function(success, status, data, headers, config) {
                if(success) {
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
                } else {
                    // TODO sort this shit out properly
                    console.log('could not connect to server?!');
                }
            }
        );

/*        networkManagerService.makeRequest(
            '/ajax/user/login',
            {
                email: email,
                password: password
            },
            networkManagerService.POST_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
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
                } else {
                    // TODO sort this shit out properly
                    console.log('could not connect to server?!');
                }
            }
        );*/
    };

    this.checkIfLoggedIn = function(callback) {

        networkManagerService.makeRequest(
            '/ajax/user/',
            {},
            networkManagerService.GET_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
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
                } else {
                    // TODO sort this shit out properly
                    console.log('could not connect to server?!');
                }
            }
        );
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
            callback: callback,
            callbackStr: callback.toString()
        });
        console.log(requestQueue);
        processRequests();
    };

    var processRequests = function() {
        if(requestQueue.length > 0) {
            remoteStorageModelParserService.makeRequest(requestQueue[0], function(success, status, data, headers, config) {
                // checks if callback exists and is not undefined, then calls callback
                console.log('pre shift callback check', requestQueue[0] != undefined, typeof requestQueue[0].callback == 'function');
                if(requestQueue[0] != undefined && typeof requestQueue[0].callback == 'function') {
                    console.log('pre shift', requestQueue[0].callback.toString(), data, headers);
                    requestQueue[0].callback(success, status, data, headers, config);
                }
                // if success, then remove request from queue
                if(success) {
                    console.log('shift', requestQueue.shift());
//                    requestQueue.shift();
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
        if(request.method == 'post') {
            remoteStorageService.makePostRequest(request.url, request.fields, callback);
        } else {
            remoteStorageService.makeGetRequest(request.url, callback);
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
        switch(errObj.errorCode.toUpperCase()) {
            case 'UE-1':
                userService.loggedIn = false;
                break;
            default :
                break;
        }
    };

    this.parseStack = function(stack) {
        var stackOutput = [];
        var categoryLinks = stack['CategoryLinks'];
        console.log('stack test', categoryLinks != undefined, stack);
        if(categoryLinks != undefined && categoryLinks.length > 0) {
            for(var catInc = 0; catInc < categoryLinks.length; catInc++) {
                var category = this.parseCategory(categoryLinks[catInc]);
                if(category != undefined) {
                    stackOutput.push(category);
                }
            }
        }
        return stackOutput;
    };

    this.parseCategory = function(category) {
        var catOutput = undefined;

        if(category != undefined && category.Category.zoneId == 1) {
            catOutput = {
                id: category.categoryId,
                title: category.title,
                selected: false,
                lists: []
            };
            var listLinks = category.Category.ListLinks;
            if(listLinks != undefined && listLinks.length > 0) {
                for(var listInc = 0; listInc < listLinks.length; listInc++) {
                    var list = this.parseList(listLinks[listInc]);
                    if(list != undefined) {
                        catOutput.lists.push(list);
                    }
                }
            }
        }

        return catOutput;
    };

    this.parseList = function(list) {
        var listOutput = undefined;

        if(list != undefined && list.List.zoneId == 1) {
            listOutput = {
                id: list.listId,
                title: list.title,
                selected: false,
                items: []
            };
            var itemLinks = list.List.ItemLinks;
            if(itemLinks != undefined && itemLinks.length > 0) {
                for(var itemInc = 0; itemInc < itemLinks.length; itemInc++) {
                    var item = this.parseItem(itemLinks[itemInc]);
                    if(item != undefined) {
                        listOutput.items.push(item);
                    }
                }
            }
        }

        return listOutput;
    };

    this.parseItem = function(item) {
        var itemOutput = undefined;

        if(item != undefined && item.Item.zoneId == 1) {
            itemOutput = {
                id: item.itemId,
                title: item.title,
                selected: false,
                reminders: []
            };
            var reminders = item.Item.Reminders;
            if(reminders != undefined && reminders.length > 0) {
                for(var reminderInc = 0; reminderInc < reminders.length; reminderInc++) {
                    var reminder = this.parseReminder(reminders[reminderInc]);
                    if(reminder != undefined) {
                        itemOutput.reminders.push(reminders);
                    }
                }
            }
        }

        return itemOutput;
    };

    this.parseReminder = function(reminder) {
        var reminderOutput = undefined;

        if(reminder != undefined && reminder.zoneId == 1) {
            reminderOutput = {
                id: reminder.id,
                dateTime: reminder.dateTime
            };
        }

        return reminderOutput;
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

