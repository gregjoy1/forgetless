var forgetlessApp = angular.module('forgetlessApp', ['ui.router']);

forgetlessApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('app', {
        url: '/app/',
        controller: 'ContentViewPointController',
        templateUrl: '/partials/list_view.html'
    });

    $stateProvider.state('app.category', {
        url: ':categoryId'
    });

    $stateProvider.state('app.category.list', {
        url: '/:listId'
    });

    $stateProvider.state('app.category.list.item', {
        url: '/:itemId'
    });

    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: '/partials/login_view.html'
    });

});
