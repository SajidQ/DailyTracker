var app = angular.module('DailyTracker', ['ngRoute']);

app.config(function($routeProvider) {
       $routeProvider
           // route for the home page
           .when('/', {
               templateUrl : 'pages/signin.html',
               controller  : 'introCtrl'
           })
           .when('/home', {
               templateUrl : 'pages/home.html',
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
           });
   });


app.controller("mainCtrl", function($window, HandleAPIInteraction){
  $window.onload = function(){
    HandleAPIInteraction.handleClientLoad();
  }
});
