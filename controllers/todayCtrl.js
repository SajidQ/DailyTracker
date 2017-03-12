app.controller("todayCtrl", function($scope, HandleAPIInteraction, HandleToday){
  angular.element(document).ready(function () {
    $scope.$watch(HandleAPIInteraction.data.calendar.DailyTrackerCalendar, function () {
      $scope.handleHours.functions.initiateHours();
    });


  });


  $scope.handleHours={
    data:{
      hours:[]
    },
    functions:{
      initiateHours:function(){
        $scope.handleHours.data.hours=HandleToday.initiateHours();
        HandleAPIInteraction.getToday($scope.handleHours.data.hours, $scope.handleGoals)

      },
      addHour:function(id){
        //HandleAPIInteraction.updateHour($scope.handleHours.data.hours, id);
      }
    }
  };


    $scope.handleGoals = {
      data:{
        yearly:[],
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
        parseDailyGoal:function(input){
          return HandleGoals.parseGoalsList(input, "DailyGoal: ");
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
