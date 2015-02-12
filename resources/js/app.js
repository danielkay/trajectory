var app = angular.module('myApp',['ngRoute', 'lastfmService']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/about', {
            templateUrl: '/view/pages/about.html',
            pageTitle: 'About',
            controller: 'aboutController'
        })
        .when('/chart/pack', {
            templateUrl: '/view/pages/bubbleChart.html',
            pageTitle: 'Bubble Chart',
            controller: 'chartController'
        })
        .otherwise({
            redirectTo: '/'
        });
    
    $locationProvider.html5Mode(true);
});

app.run(['$location','$rootScope',function($location, $rootScope) {
    $rootScope.title = 'Trajectory';
    $rootScope.navigate = function(route) {
        $location.path('/'+route);
    };
}]); 