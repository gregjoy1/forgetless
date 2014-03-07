forgetlessApp.service('stackService', function(userService, remoteStorageModelParserService, networkManagerService, remoteStorageService) {

    this.stack = [];

    // Loads stack, if stack is empty then load from backend
    this.getStack = function(callback) {
        var _this = this;
        if(_this.stack.length == 0) {
            this.loadStack(function(loadedStack) {
                _this.stack = loadedStack;
                callback(_this.stack);
            });
        } else {
            callback(this.stack);
        }
    };

    // make request for stack from backend with ajax
    this.loadStack = function(callback) {
        networkManagerService.makeRequest(
            '/ajax/stack/dump/',
            {},
            networkManagerService.GET_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            remoteStorageModelParserService.respondToError(err);
                            callback([]);
                        } else {
                            stack = remoteStorageModelParserService.parseStack(detail);
                            callback(stack);
                        }
                    });
                }
            }
        );

    };

    // make request to push newly created reminder to backend
    this.insertReminder = function() {

    };

    // make request to push any changes to a reminder to the backend
    this.updateReminder = function() {

    };

    // make request to remove a reminder
    this.removeReminder = function() {

    };

    // make request to push newly created item to backend
    this.insertItem = function(categoryId, listId, itemFields, callback) {
        // creates temp id for the time being (until new item is synced with the server)
        // with string prefix to avoid conflicts with numeric ids.
        var tempId = 'temp' + (new Date().getTime()) + parseInt(Math.random() * 100);

        // inserts new item into local stack, for it to be accessible to the user
        // before syncing with the server
        for(var categoryInc = 0; categoryInc < this.stack.length; categoryInc++) {
            if(this.stack[categoryInc].id == categoryId) {
                for(var listInc = 0; listInc < this.stack[categoryInc].lists.length; listInc++) {
                    if(this.stack[categoryInc].lists[listInc].id == listId) {
                        this.stack[categoryInc].lists[listInc].items.push(
                            {
                                id: tempId,
                                title: itemFields.title,
                                selected: true,
                                itemType: 1,
                                reminders: []
                            }
                        );
                    }
                }
            }
        }

        // sync new item with the server
        networkManagerService.makeRequest(
            '/ajax/item/create',
            {
                userId: userService.userModel.id,
                title: itemFields.title,
                // inject function to ensure newly created items created when there is no connection
                // to the server dont sync with a temp list id
                listId: function() {
                    // scans local stack for the existence of temp id
                    for(var categoryInc = 0; categoryInc < stack.length; categoryInc++) {
                        for(var listInc = 0; listInc < stack[categoryInc].lists.length; listInc++) {
                            var list = stack[categoryInc].lists[listInc];
                            if(list.hasOwnProperty('tempId') && list.tempId == listId) {
                                return list.id;
                            }
                        }
                    }
                    return listId;
                },
                itemType: 1
            },
            networkManagerService.POST_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            // TODO sort this out properly
                            console.log('Something went wrong!', err);
                        } else {

                            // if everything went well then update the local stack with newly assigned item id
                            for(var categoryInc = 0; categoryInc < stack.length; categoryInc++) {
                                if(stack[categoryInc].id == categoryId) {
                                    for(var listInc = 0; listInc < stack[categoryInc].lists.length; listInc++) {
                                        if(stack[categoryInc].lists[listInc].id == listId) {
                                            for(var itemInc = 0; itemInc < stack[categoryInc].lists[listInc].items.length; itemInc++) {
                                                if(stack[categoryInc].lists[listInc].items[itemInc].id == tempId) {
                                                    stack[categoryInc].lists[listInc].items[itemInc].id = detail.Item.id;

                                                    // record tempId just in case
                                                    stack[categoryInc].lists[listInc].items[itemInc].tempId = tempId;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    });
                } else {
                    // TODO sort this out properly
                    console.log('could not connect to server?!');
                }
            }
        );

        callback();
    };

    // request to backend to sync updated item
    this.updateItem = function(categoryId, listId, itemId, itemFields) {

    };

    // request to remove item from the backend
    this.removeItem = function(categoryId, listId, itemId, callback) {

        OuterLoop:
        for(var categoryInc = 0; categoryInc < this.stack.length; categoryInc++) {
            for(var listInc = 0; listInc < this.stack[categoryInc].lists.length; listInc++) {
                for(var itemInc = 0; itemInc < this.stack[categoryInc].lists[listInc].items.length; itemInc++) {
                    if(this.stack[categoryInc].lists[listInc].items[itemInc].id == listId) {
                        delete this.stack[categoryInc].lists[listInc].items[itemInc];
                        break OuterLoop;
                    }
                }
            }
        }

        if(String(listId).length < 4 || String(listId).substr(0, 4) != 'temp') {

            networkManagerService.makeRequest(
                '/ajax/category/remove',
                {
                    userId: userService.userModel.id,
                    categoryId: listId
                },
                networkManagerService.POST_METHOD,
                function(success, status, data, headers, config) {
                    if(success) {
                        remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                            if(err) {
                                // TODO sort this out properly
                                console.log('Something went wrong!', err);
                            }
                        });
                    } else {
                        // TODO sort this out properly
                        console.log('could not connect to server?!');
                    }
                }
            );
        }

        callback();
    };

    // make request to push newly created list to backend
    this.insertList = function(categoryId, listFields, callback) {

        // creates temp id for the time being (until new list is synced with the server)
        // with string prefix to avoid conflicts with numeric ids.
        var tempId = 'temp' + (new Date().getTime()) + parseInt(Math.random() * 100);

        for(var inc = 0; inc < this.stack.length; inc++) {
            if(this.stack[inc].id == categoryId) {
                console.log(this.stack[inc]);
                this.stack[inc].lists.push(
                    {
                        // this is shit, todo sort this out
                        id: tempId,
                        title: listFields.title,
                        selected: false,
                        items: []
                    }
                );
            }
        }

        networkManagerService.makeRequest(
            '/ajax/list/create',
            {
                userId: userService.userModel.id,
                title: listFields.title,
                categoryId: function() {
                    for(var categoryInc = 0; categoryInc < stack.length; categoryInc++) {
                        var category = stack[categoryInc];
                        if(category.hasOwnProperty('tempId') && category.tempId == categoryId) {
                            return category.id;
                        }
                    }
                    // TODO this should never happen but make sure its accounted for
                    return categoryId;
                }
            },
            networkManagerService.POST_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            // TODO sort this out properly
                            console.log('Something went wrong!', err);
                        } else {
                            for(var inc = 0; inc < stack.length; inc++) {
                                if(stack[inc].id == tempId) {
                                    stack[inc].id = detail.List.id;
                                    break;
                                }
                            }
                        }
                    });
                } else {
                    // TODO sort this out properly
                    console.log('could not connect to server?!');
                }
            }
        );

        callback();
    };

    this.updateList = function(listId, listFields, callback) {

    };

    // request to remove list from the backend
    this.removeList = function(listId, callback) {

        OuterLoop:
        for(var categoryInc = 0; categoryInc < this.stack.length; categoryInc++) {
            for(var listInc = 0; listInc < this.stack[categoryInc].lists.length; listInc++) {
                if(this.stack[categoryInc].lists[listInc].id == listId) {
                    delete this.stack[categoryInc].lists[listInc];
                    break OuterLoop;
                }
            }
        }

        if(String(listId).length < 4 || String(listId).substr(0, 4) != 'temp') {

            networkManagerService.makeRequest(
                '/ajax/list/remove',
                {
                    userId: userService.userModel.id,
                    listId: listId
                },
                networkManagerService.POST_METHOD,
                function(success, status, data, headers, config) {
                    if(success) {
                        remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                            if(err) {
                                // TODO sort this out properly
                                console.log('Something went wrong!', err);
                            }
                        });
                    } else {
                        // TODO sort this out properly
                        console.log('could not connect to server?!');
                    }
                }
            );
        }

        callback();
    };

    this.insertCategory = function(categoryFields, callback) {

        // creates temp id for the time being (until new category is synced with the server)
        // with string prefix to avoid conflicts with numeric ids.
        var tempId = 'temp' + (new Date().getTime()) + parseInt(Math.random() * 100);

        this.stack.push(
            {
                // this is shit, todo sort this out
                id: tempId,
                title: categoryFields.title,
                selected: false,
                lists: []
            }
        );

        networkManagerService.makeRequest(
            '/ajax/category/create',
            {
                userId: userService.userModel.id,
                title: categoryFields.title
            },
            networkManagerService.POST_METHOD,
            function(success, status, data, headers, config) {
                if(success) {
                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                        if(err) {
                            // TODO sort this out properly
                            console.log('Something went wrong!', err);
                        } else {
                            for(var inc = 0; inc < stack.length; inc++) {
                                if(stack[inc].id == tempId) {
                                    stack[inc].id = detail.Category.id;
                                    break;
                                }
                            }
                        }
                    });
                } else {
                    // TODO sort this out properly
                    console.log('could not connect to server?!');
                }
            }
        );

        callback();
    };

    this.updateCategory = function(categoryId, categoryFields, callback) {

    };

    this.removeCategory = function(categoryId, callback) {

        for(var categoryInc = 0; categoryInc < this.stack.length; categoryInc++) {
            if(this.stack[categoryInc].id == categoryId) {
                delete this.stack[categoryInc];
                break;
            }
        }

        if(String(categoryId).length < 4 || String(categoryId).substr(0, 4) != 'temp') {

            networkManagerService.makeRequest(
                '/ajax/category/remove',
                {
                    userId: userService.userModel.id,
                    categoryId: categoryId
                },
                networkManagerService.POST_METHOD,
                function(success, status, data, headers, config) {
                    if(success) {
                        remoteStorageModelParserService.parseStatus(data, function(err, detail) {
                            if(err) {
                                // TODO sort this out properly
                                console.log('Something went wrong!', err);
                            }
                        });
                    } else {
                        // TODO sort this out properly
                        console.log('could not connect to server?!');
                    }
                }
            );
        }

        callback();
    };

    this.login = function(email, password, callback) {

//        remoteStorageService.makePostRequest(
//            '/ajax/user/login',
//            {
//                email: email,
//                password: password
//            },
//            function(success, status, data, headers, config) {
//                if(success) {
//                    remoteStorageModelParserService.parseStatus(data, function(err, detail) {
//                        if(err) {
//                            // TODO add "incorrect password" notification to partial
//                            remoteStorageModelParserService.respondToError(err);
//                            userService.userModel = {};
//                            callback(false, null);
//                        } else {
//                            userService.userModel = detail;
//                            callback(true, detail);
//                        }
//                    });
//                } else {
//                    // TODO sort this out properly
//                    console.log('could not connect to server?!');
//                }
//            }
//        );

        networkManagerService.makeRequest(
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
                    // TODO sort this out properly
                    console.log('could not connect to server?!');
                }
            }
        );
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
                    // TODO sort this out properly
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
    var processRequestsRunning = false;

    this.POST_METHOD = 'post';
    this.GET_METHOD = 'get';

    this.makeRequest = function(url, fields, method, callback) {
        var request = {
            method: method,
            url: url,
            fields: fields,
            callback: callback
        };
        requestQueue.push(request);
        if(!processRequestsRunning) {
            processRequests();
        }
    };

    var processRequests = function() {
        processRequestsRunning = true;
        if(requestQueue.length > 0) {
            remoteStorageModelParserService.makeRequest(requestQueue[0], function(success, status, data, headers, config) {
                // if success, then remove request from queue
                if(success) {
                    // checks if callback exists and is not undefined, then calls callback
                    if(requestQueue[0] != undefined && typeof requestQueue[0].callback == 'function') {
                        requestQueue[0].callback(success, status, data, headers, config);
                    }
                    requestQueue.shift();
                    processRequests();

                    if(timeoutId != undefined) {
                        clearTimeout(timeoutId);
                    }

                } else {
                    console.log('gone offline...');
                    timeoutId = setTimeout(processRequests, 10000);
                }
            });
        } else {
            processRequestsRunning = false;
        }

    };

});

forgetlessApp.service('remoteStorageModelParserService', function(remoteStorageService, userService) {

    this.makeRequest = function(request, callback) {
        this.processRequestFields(request.fields, function(processedFields) {
            if(request.method == 'post') {
                remoteStorageService.makePostRequest(request.url, processedFields, callback);
            } else {
                remoteStorageService.makeGetRequest(request.url, callback);
            }
        });
    };

    this.processRequestFields = function(fields, callback) {

        var returnedFields = {};

        for(field in fields) {
            if(fields.hasOwnProperty(field)) {
                if(typeof fields[field] == 'function') {
                    returnedFields[field] = fields[field]();
                } else {
                    returnedFields[field] = fields[field];
                }
            }
        }

        callback(returnedFields);
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
                title: item.Item.title,
                content: item.Item.content,
                itemType: item.Item.itemType,
                selected: false,
                reminders: []
            };
            var reminders = item.Item.Reminders;
            if(reminders != undefined && reminders.length > 0) {
                for(var reminderInc = 0; reminderInc < reminders.length; reminderInc++) {
                    var reminder = this.parseReminder(reminders[reminderInc]);
                    if(reminder != undefined) {
                        itemOutput.reminders.push(reminder);
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
                dateTime: reminder.dateTime,
                repeat: reminder.repeat
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

