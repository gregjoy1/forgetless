forgetlessApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('app', {
        url: '/',
        controller: 'ContentController',
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('app.category', {
        url: '/:category',
        controller: 'ContentController',
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('login', {
        url: '/login',
//        controller: 'LoginController',
        controller: 'LoginController',
        templateUrl: '/partials/login_view.html'
    });

});