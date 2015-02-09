var app = angular.module('myApp',['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: '/view/pages/home.html',
            pageTitle: 'Home',
            controller: 'homeController'
        });
    
    $locationProvider.html5Mode(true);
});

app.run(['$location','$rootScope',function($location, $rootScope) {
    $rootScope.title = 'Trajectory';
    
    $rootScope.navigate = function(route) {
        $location.path('/'+route);
    };
}]); 