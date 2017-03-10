app.controller("todayCtrl", function($scope, HandleAPIInteraction, HandleToday){
  angular.element(document).ready(function () {
    $scope.handleHours.functions.initiateHours();

  });


  $scope.handleHours={
    data:{
      hours:[]
    },
    functions:{
      initiateHours:function(){
        $scope.handleHours.data.hours=HandleToday.initiateHours();
        //HandleAPIInteraction.checkDailyTrackerCalendarExists($scope.handleHours.data.hours, $scope.handleGoals);
      },
      addHour:function(id){
        //HandleAPIInteraction.updateHour($scope.handleHours.data.hours, id);
      }
    }
  };
});
