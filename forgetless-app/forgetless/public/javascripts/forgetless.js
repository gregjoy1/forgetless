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
    $scope.stepClass = '';

    $scope.nextStep = function(step) {
        switch(step) {
            case 0:
                $scope.stepClass = 'step-zero';
                break;
            case 1:
                $scope.stepClass = 'step-one';
                break;
            case 2:
                $scope.stepClass = 'step-two';
                break;
            case 3:
                $scope.stepClass = 'step-three';
                break;
            default:
                $scope.stepClass = '';
                break;
        }
    };

});

forgetlessApp.controller('ContentController', function($scope, $stateParams, $state) {
    if($stateParams.itemId !== undefined && $stateParams.itemId != '') {
        $scope.nextStep(3);
    } else if($stateParams.listId !== undefined && $stateParams.listId != '') {
        $scope.nextStep(2);
    } else if($stateParams.categoryId !== undefined && $stateParams.categoryId != '') {
        $scope.nextStep(1);
    } else {
        $scope.nextStep(0);
    }
    // keep beady eye on this...
    $state.reload();
});

forgetlessApp.controller('CategoryController', function($scope, $stateParams) {

    $scope.categories = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.categories.push({
            id: inc,
            title: 'Category ' + inc
        });
    }

});

forgetlessApp.controller('ListController', function($scope) {

    $scope.lists = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.lists.push({
            id: inc,
            title: 'List ' + inc
        });
    }

});

forgetlessApp.controller('ItemController', function($scope) {

    $scope.items = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.items.push({
            id: inc,
            title: 'Item ' + inc
        });
    }

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