var forgetlessApp = angular.module('forgetlessApp', ['ui.router']);

forgetlessApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('app', {
        url: '/',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('app.category', {
        url: ':categoryId',
//        controller: 'ContentViewPointController',
        controller: function($scope, $stateParams) {
            console.log($stateParams);
        },
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('app.category.list', {
        url: '/:listId',
//        controller: 'ContentViewPointController',
        controller: function($scope, $stateParams) {
            console.log($stateParams);
        },
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('app.category.list.item', {
        url: '/:itemId',
        controller: function($scope, $stateParams) {
            console.log($stateParams);
        },
//        controller: 'ContentViewPointController',
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: '/partials/login_view.html'
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

    $scope.routeSteps = function() {
        if($stateParams.categoryId !== undefined && $stateParams.categoryId != '') {
            $scope.nextStep(1);
        } else {
            $scope.nextStep(0);
        }
        console.log($stateParams);
    };


//    angular.element($window).bind('popstate', routeSteps);

    $scope.routeSteps();

    $scope.selectedCategoryIndex = 0;
    $scope.selectedCategoryId = -1;
    $scope.selectedListIndex = 0;
    $scope.selectedItemIndex = 0;

    $scope.categories = [];

    for(var catInc = 0; catInc <  5; catInc++) {

        $scope.categories.push({
            id: catInc,
            title: 'category ' + catInc,
            selected: (catInc == 0),
            lists: []
        });

        for(var listInc = 0; listInc <  10; listInc++) {

            $scope.categories[catInc].lists.push({
                id: listInc,
                title: 'list: ' + catInc + ' : ' + listInc,
                selected: false,
                items: []
            });

            for(var itemInc = 0; itemInc <  10; itemInc++) {

                $scope.categories[catInc].lists[listInc].items.push({
                    id: itemInc,
                    title: 'item: ' + catInc + ' : ' + listInc + ' : ' + itemInc,
                    content: 'im a content-der ' + itemInc,
                    selected: false
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
                $scope.selectedCategoryId = $scope.categories[inc].id;
                $state.go('app.category', {categoryId: id});
            } else {
                $scope.categories[inc].selected = false;
            }
        }

//        $scope.nextStep(1);
//        $scope.routeSteps();

    };

    $scope.selectList = function(id) {
        // Save on width...
        var catIndex = $scope.selectedCategoryIndex;

        // Resets selections
        var numberOfLists = $scope.categories[catIndex].lists.length;
        for(var inc = 0; inc < numberOfLists; inc++) {
            if($scope.categories[catIndex].lists[inc].id == id) {
                var selected = $scope.categories[catIndex].lists[inc].selected;
                $scope.categories[catIndex].lists[inc].selected = !selected;

                $state.go('app.category.list', {
                    categoryId: $scope.selectedCategoryId,
                    listId: id
                });

                break;
            }
        }
//        $scope.routeSteps();
    };

    $scope.selectItem = function(id) {
        // Save on width...
        var catIndex = $scope.selectedCategoryIndex;
        var lstIndex = $scope.selectedListIndex;

        // Resets selections
        var numberOfItems = $scope.categories[catIndex].lists[lstIndex].items.length;
        for(var inc = 0; inc < numberOfItems; inc++) {
            if($scope.categories[catIndex].lists[lstIndex].items[inc].id == id) {
                var selected = $scope.categories[catIndex].lists[lstIndex].items[inc].selected;
                $scope.categories[catIndex].lists[lstIndex].items[inc].selected = !selected;
                break;
            }
        }
//        $scope.routeSteps();
    };
});

forgetlessApp.directive('handleCategory', function() {

    return {
        templateUrl: '/partials/category_item_view.html',
        controller: function($scope, $element) {
            var element = $element[0];
            var categoryHeader = element.querySelector('.content-item');

//            angular.element(categoryHeader).on('click', function() {});

        }
    };


});

forgetlessApp.directive('handleList', function() {

    return {
        templateUrl: '/partials/list_item_view.html',
        controller: function($scope, $element) {
            var element = $element[0];
            var listHeader = element.querySelector('.content-item');
            var itemsContainer = element.querySelector('.items-container');
        }
    };

});

forgetlessApp.directive('handleItem', function($state) {

    return {
        templateUrl: '/partials/item_view.html',
        controller: function($scope, $element) {
            var element = $element[0];
            var itemHeader = element.querySelector('.content-item');
            var itemDetails = element.querySelector('.item-detail');
            var itemsContainer = element.querySelector('.items-container');

            angular.element(itemHeader).on('click', function() {
                $scope.$apply(function() {
                    $scope.item.selected = !$scope.item.selected;
                    $state.go('app.category.list.item', {
                        categoryId: $scope.selectedCategoryId,
                        listId: $scope.list.id,
                        itemId: $scope.item.id
                    });
                });
            });
        }
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

forgetlessApp.run(function($rootScope, $urlRouter, $stateParams, $window) {
    // TODO this causes delay that onpopstate fixes, how the fuck do i shoot this web?!
    $rootScope.$on('$locationChangeSuccess', function(evt) {
        // Halt state change from even starting
        evt.preventDefault();
        $urlRouter.sync();
        console.log($stateParams);
    });

    angular.element($window).bind('popstate', function() {
        console.log('pop', $stateParams);
    });

});