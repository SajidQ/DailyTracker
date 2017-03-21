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
      yearGoal:{id:null, list:[]},
      months: {count:[], data:null}
    },
    functions:{
      initialize:function(){
        if(HandleYearGoals.data.yearGoal.id === null){
          HandleYearGoals.getYearInformation().then(function(r){
            $scope.handleYearGoal.data.yearGoal = HandleYearGoals.data.yearGoal;
            $scope.$apply();
          });
        }
        else{
          $scope.handleYearGoal.data.yearGoal = HandleYearGoals.data.yearGoal;
          $scope.$apply();
        }

        HandleYearGoals.getAllMonths().then(function(r){
          $scope.handleYearGoal.data.months.data = HandleYearGoals.data.months;
          for(var i=0; i<12; i++)
            $scope.handleYearGoal.data.months.count.push(i);
          $scope.$apply();
        });
      },
      addYearGoal:function(){
        if($scope.handleYearGoal.data.yearGoal.list.todo.length<10){
          $scope.handleYearGoal.data.yearGoal.list.todo.push({
            task: "",
            complete:false
          });
        }
        else{
          alert("Only 10 year goals allowed!");
        }
      },
      saveYearGoals:function(){
        HandleYearGoals.saveGoals("YearGoal");
      },
      addMonthGoals:function(month){
        if($scope.handleYearGoal.data.months.data[month].list.todo.length<50){
          $scope.handleYearGoal.data.months.data[month].list.todo.push({
            task: "",
            complete:false
          });
        }
        else{
          alert("Only 50 daily goals allowed!");
        }
      },
      saveMonthGoals:function(month){
        HandleYearGoals.saveGoals("MonthGoal", month);
      }
    }
  }

});
