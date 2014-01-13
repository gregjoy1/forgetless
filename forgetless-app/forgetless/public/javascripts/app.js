forgetlessApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        controller: 'ContentController',
        templateUrl: '/partials/listView.html'
    }).
    when('/login', {
        controller: 'LoginController',
        templateUrl: '/partials/loginView.html'
    }).
    otherwise({
        redirectTo: '/'
    });
});