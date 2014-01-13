var forgetlessApp = angular.module('forgetlessApp', ['ngRoute']);

forgetlessApp.controller('ContentViewPointController', function($scope) {
    $scope.stepClass = '';

    $scope.nextStep = function(step) {
        switch(step) {
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
    }

});

forgetlessApp.controller('ContentController', function($scope) {});

forgetlessApp.controller('CategoryController', function($scope) {

    $scope.categories = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.categories.push('Category ' + inc);
    }

});

forgetlessApp.controller('ListController', function($scope) {

    $scope.lists = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.lists.push('List ' + inc);
    }

});

forgetlessApp.controller('ItemController', function($scope) {

    $scope.items = [];

    for(var inc = 1; inc < 20; inc++) {
        $scope.items.push('Item ' + inc);
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

});