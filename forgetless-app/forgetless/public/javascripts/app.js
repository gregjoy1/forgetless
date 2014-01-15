forgetlessApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('app', {
        url: '/',
        controller: 'ContentController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('app.category', {
        url: '/:category',
        controller: 'ContentController',
        templateUrl: '/partials/listView.html'
    });

    $stateProvider.state('login', {
        url: '/login',
//        controller: 'LoginController',
        controller: 'LoginController',
        templateUrl: '/partials/loginView.html'
    });

});