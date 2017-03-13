app.controller("todayCtrl", function($scope, HandleAPIInteraction, HandleToday, HandleGoals){
  angular.element(document).ready(function () {
    $scope.handleHours.functions.initiateHours();

    //if no calendar, wait for initialization to finish
    if(HandleAPIInteraction.data.calendar.DailyTrackerCalendar===null){
      $scope.$watch(HandleAPIInteraction.data.calendar.DailyTrackerCalendar, function () {
        //HandleAPIInteraction.getToday($scope.handleHours.data.hours, $scope.handleGoals);

      });
    }
    else{
      //HandleAPIInteraction.getToday($scope.handleHours.data.hours, $scope.handleGoals);
    }
  });

});
