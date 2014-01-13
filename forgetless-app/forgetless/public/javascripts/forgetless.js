var forgetlessApp = angular.module('forgetlessApp', ['ngRoute']);

forgetlessApp.controller('ContentController', function($scope) {
    $scope.test = [];

    for(var inc = 0; inc < 100; inc++) {
        $scope.test.push(inc);
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