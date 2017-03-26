var app = angular.module('DailyTracker', ['ngRoute']);
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);
app.config(function($routeProvider) {
       $routeProvider
           // route for the home page
           .when('/', {
               templateUrl : 'pages/signin.html',
               controller  : 'introCtrl'
           })
           .when('/today', {
               templateUrl : 'pages/today.html',
               controller  : 'todayCtrl'
           })

           // route for the about page
           .when('/month', {
               templateUrl : 'month.html',
               controller  : 'monthCtrl'
           })

           // route for the contact page
           .when('/year', {
               templateUrl : 'pages/year.html',
               controller  : 'yearCtrl'
           })
           .otherwise({
             templateUrl : 'pages/signin.html',
             controller  : 'introCtrl'
          });
   });


app.controller("mainCtrl", function($window, HandleAPIInteraction){
  $window.onload = function(){
      HandleAPIInteraction.setButtons($('#authorize-button'), $('#signout-button'));
      HandleAPIInteraction.handleClientLoad();
      //gapi.load('client:auth2', initClient);
  }
});
