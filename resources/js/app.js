var app = angular.module('myApp',['ngRoute', 'lastfmService']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: '/view/pages/home.html',
            pageTitle: 'Home',
            controller: 'homeController'
        })
        .when('/chart', {
            templateUrl: '/view/pages/chart.html',
            pageTitle: 'Last.FM Chart',
            controller: 'chartController'
        })
        .otherwise({
            redirectTo: '/'
        });
    
    $locationProvider.html5Mode(true);
});

app.run(['$location','$rootScope',function($location, $rootScope) {
    $rootScope.title = 'Audio Bubbles';
    $rootScope.navigate = function(route) {
        $location.path('/'+route);
    };
}]); 