var forgetlessApp = angular.module('forgetlessApp', ['ui.router']);

forgetlessApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('app', {
        url: '/',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('app.category', {
        url: ':categoryId',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('app.category.list', {
        url: '/:listId',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('app.category.list.item', {
        url: '/:itemId',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: '/partials/loginView.html'
    });

});

forgetlessApp.controller('ContentViewPointController', function($scope) {

    $scope.stepClass = 'step-zero';

    $scope.nextStep = function(step) {
        switch(step) {
            case 1:
                $scope.stepClass = 'step-one';
                break;
            case 0:
            default:
                $scope.stepClass = 'step-zero';
                break;
        }
    };

});

forgetlessApp.controller('ContentController', function($scope, $stateParams, $state, $window) {

    var routeSteps = function() {
        if($stateParams.categoryId !== undefined && $stateParams.categoryId != '') {
            $scope.nextStep(1);
        } else {
            $scope.nextStep(0);
        }
    };

//    angular.element($window).bind('popstate', routeSteps);

    // tempin!
    angular.element($window).bind('popstate', function() {
        $scope.nextStep(0);
    });

    routeSteps();

    $scope.selectedCategoryIndex = 0;
    $scope.selectedListIndex = 0;
    $scope.selectedItemIndex = 0;

    $scope.categories = [];

    for(var catInc = 0; catInc <  20; catInc++) {

        $scope.categories.push({
            id: catInc,
            title: 'category ' + catInc,
            selected: (catInc == 0),
            lists: []
        });

        for(var listInc = 0; listInc <  20; listInc++) {

            $scope.categories[catInc].lists.push({
                id: listInc,
                title: 'title: ' + catInc + ' : ' + listInc,
                selected: (listInc == 0),
                items: []
            });

            for(var itemInc = 0; itemInc <  20; itemInc++) {

                $scope.categories[catInc].lists[listInc].items.push({
                    id: itemInc,
                    title: 'item: ' + catInc + ' : ' + listInc + ' : ' + itemInc,
                    content: 'im a content-der ' + itemInc,
                    selected: (itemInc == 0)
                });

            }

        }

    }

    $scope.selectCategory = function(id) {

        // Falls back on first index if fail
        $scope.selectedCategoryIndex = 0;

        // Resets selections
        for(var inc = 0; inc < $scope.categories.length; inc++) {
            if($scope.categories[inc].id == id) {
                $scope.categories[inc].selected = true;
                $scope.selectedCategoryIndex = inc;
            } else {
                $scope.categories[inc].selected = false;
            }
        }

        $scope.nextStep(1);

    };

    $scope.selectList = function(id) {

        // Falls back on first index if fail
        $scope.selectedListIndex = 0;

        // Save on width...
        var catIndex = $scope.selectedCategoryIndex;

        // Resets selections
        var numberOfLists = $scope.categories[catIndex].lists.length;
        for(var inc = 0; inc < numberOfLists; inc++) {
            if($scope.categories[catIndex].lists[inc].id == id) {
                $scope.categories[catIndex].lists[inc].selected = true;
                $scope.selectedListIndex = inc;
            } else {
                $scope.categories[catIndex].lists[inc].selected = false;
            }
        }
    };

    $scope.selectItem = function(id) {

        // Falls back on first index if fail
        $scope.selectedItemIndex = 0;

        // Save on width...
        var catIndex = $scope.selectedCategoryIndex;
        var lstIndex = $scope.selectedListIndex;

        // Resets selections
        var numberOfItems = $scope.categories[catIndex].lists[lstIndex].items.length;
        for(var inc = 0; inc < numberOfItems; inc++) {
            if($scope.categories[catIndex].lists[lstIndex].items[inc].id == id) {
                $scope.categories[catIndex].lists[lstIndex].items[inc].selected = true;
                $scope.selectedListIndex = inc;
            } else {
                $scope.categories[catIndex].lists[lstIndex].items[inc].selected = false;
            }
        }
    };

});


forgetlessApp.directive('testingStuff', function() {

    return function($scope, element, $attr) {
        element.on('click', function() {
            var inc = JSON.parse($attr.testingStuff);
            console.log($scope.categories[inc[0]].lists[inc[1]].items);
        });
    };

});

forgetlessApp.directive('syncHeight', function($window) {
    return function(scope, element) {

        var window = angular.element($window);

        var applyResize = function() {

            // Work out header height
            var header = document.getElementById('header-outer-container');
            var headerHeight = parseInt($window.getComputedStyle(header, null).getPropertyValue('height'));
            headerHeight = headerHeight || 60;

            element.css({
                'height': ($window.innerHeight - headerHeight) + 'px'
            });
        };

        window.on('resize', applyResize);

        $window.scrollTop = 0;
        applyResize();
    }
});

forgetlessApp.controller('LoginController', function($scope) {
    $scope.testing = 123;
    $scope.testfunc = function() {
        console.log('tetsing');
    };

    $scope.testfunc();

});