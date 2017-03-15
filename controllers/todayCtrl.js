app.controller("todayCtrl", function($scope, HandleAPIInteraction, HandleToday, HandleGoals, HandleYearGoals){
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
        year:{id:null, list:[]},
        monthly:{id:null, list:[]},
        weekly:[],
        daily:{id:null, list:[]}
      },
      functions:{
        initiateGoals:function(){
          //DailyGoal checked/initiated in HandleAPIInteraction.getToday()
          //check for monthly goals
          HandleAPIInteraction.getFirstOfMonth($scope.handleGoals);

          //check for yearly goal
          HandleAPIInteraction.getFirstOfYear($scope.handleGoals).then(function(r){

          });
        },
        addYearGoal:function(){

        },
        getYearGoal:function(){

        },
        addMonthlyGoal:function(){

        },
        getMonthlyGoal:function(){

        },
        addWeeklyGoal:function(){

        },
        getWeeklyGoal:function(){

        },

        addNewDailyGoal:function(){
          if($scope.handleGoals.data.daily.list.length<21){
            $scope.handleGoals.data.daily.list.push({
              task: "",
              complete:false
            });
          }
          else{
            alert("Only 20 daily goals allowed!");
          }
        },
        saveDailyGoals:function(){
          HandleGoals.saveDailyGoal($scope.handleGoals.data.daily);
        }
      }

    };
});
