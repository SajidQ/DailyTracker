app.controller("yearCtrl", function($scope,HandleAPIInteraction, HandleYearGoals){
  angular.element(document).ready(function () {

    //if no calendar, wait for initialization to finish
    if(HandleAPIInteraction.data.calendar.DailyTrackerCalendar===null){
      $scope.$watch(HandleAPIInteraction.data.calendar.DailyTrackerCalendar, function () {
        $scope.handleYearGoal.functions.initialize();
      });
    }
    else{
      $scope.handleYearGoal.functions.initialize();
    }
  });

  $scope.handleYearGoal={
    data:{
      yearGoal:{id:null, list:[]}
    },
    functions:{
      initialize:function(){
        if(HandleYearGoals.data.yearGoal.id === null){
          HandleYearGoals.getYearInformation().then(function(r){
            $scope.handleYearGoal.data.yearGoal = HandleYearGoals.data.yearGoal;
            $scope.$apply();
          });

        }
      },
      addYearGoal:function(){
        if($scope.handleYearGoal.data.yearGoal.list.length<10){
          $scope.handleYearGoal.data.yearGoal.list.push({
            task: "",
            complete:false
          });
        }
        else{
          alert("Only 20 daily goals allowed!");
        }
      },
      saveYearGoals:function(){
        HandleYearGoals.saveYearGoals();
      }
    }
  }

});
