app.controller("todayCtrl", function($scope, HandleAPIInteraction, HandleToday, HandleYearGoals){
  angular.element(document).ready(function () {
      $scope.handleHours.functions.initiateHours();

      //if no calendar, wait for initialization to finish
      if(HandleAPIInteraction.data.calendar.DailyTrackerCalendar===null){
        $scope.$watch(HandleAPIInteraction.data.calendar.DailyTrackerCalendar, function () {
            $scope.handleHours.functions.initializePage();
        });
      }
      else{
          $scope.handleHours.functions.initializePage();
      }
  });


  $scope.handleHours={
    data:{
      hours:[]
    },
    functions:{
      initializePage:function(){
        HandleAPIInteraction.getToday($scope.handleHours.data.hours, $scope.handleGoals);

        $scope.handleGoals.functions.initiateGoals();
        HandleYearGoals.getYearInformation().then(function(r){
          $scope.handleGoals.data.year = HandleYearGoals.data.yearGoal;
          $scope.$apply();
        });

        HandleToday.getThisMonthGoal().then(function(){
          $scope.handleGoals.data.month = HandleToday.data.month;
          $scope.$apply();
        });
      },
      initiateHours:function(){
        $scope.handleHours.data.hours=HandleToday.initiateHours();
      },
      addHour:function(id){
        HandleAPIInteraction.updateHour($scope.handleHours.data.hours, id);
      }
    }
  };


    $scope.handleGoals = {
      data:{
        year:{id:null, list:{}},
        month:{id:null, list:{}},
        weekly:[],
        daily:{id:null, list:{}}
      },
      functions:{
        initiateGoals:function(){
        },
        addYearGoal:function(){
          if($scope.handleGoals.data.year.list.todo.length<10){
            $scope.handleGoals.data.year.list.todo.push({
              task: "",
              complete:false
            });
          }
          else{
            alert("Only 10 year goals allowed!");
          }
        },
        deleteYearGoals:function(input){
            $scope.handleGoals.data.year.list.todo.splice(input, 1);
            $scope.handleGoals.functions.saveYearGoals();
        },
        saveYearGoals:function(){
          HandleYearGoals.saveGoals("YearGoal");
        },
        addNewDailyGoal:function(){
          if($scope.handleGoals.data.daily.list.todo.length<21){
            $scope.handleGoals.data.daily.list.todo.push({
              task: "",
              complete:false
            });
          }
          else{
            alert("Only 20 daily goals allowed!");
          }
        },
        deleteDailyGoal:function(input){
            $scope.handleGoals.data.daily.list.todo.splice(input, 1);
            $scope.handleGoals.functions.saveDailyGoals();
        },
        saveDailyGoals:function(){
          HandleToday.saveDailyGoal($scope.handleGoals.data.daily);
        },
        addMonthGoals:function(month){
          if(month===null)
          {
            if($scope.handleGoals.data.month.list.todo.length<50){
              $scope.handleGoals.data.month.list.todo.push({
                task: "",
                complete:false
              });
            }
            else{
              alert("Only 50 daily goals allowed!");
            }
          }

        },
        deleteMonthGoals:function(input){
            $scope.handleGoals.data.month.list.todo.splice(input, 1);
            $scope.handleGoals.functions.saveMonthGoals(null);
        },
        saveMonthGoals:function(month){
          if(month===null)
          {
            var date = new Date();
            month = date.getMonth();
            HandleYearGoals.data.months[month].id=$scope.handleGoals.data.month.id;
            HandleYearGoals.data.months[month].list=$scope.handleGoals.data.month.list;
          }
          HandleYearGoals.saveGoals("MonthGoal", month);
        }
      }

    };
});
