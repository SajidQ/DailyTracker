
app.controller('introCtrl', function($scope,$location, $window, HandleAPIInteraction) {
  /*$window.onload = function(){
    HandleAPIInteraction.handleClientLoad();
  }*/

  angular.element(document).ready(function () {
    HandleAPIInteraction.setButtons($('#authorize-button'), $('#signout-button'));
    //$scope.initiatePage.data.authorizeButton = $('#authorize-button');
    //$scope.initiatePage.data.signoutButton = $('#signout-button');
  });

/*
  $scope.initiatePage = {
    data: {
      CLIENT_ID: '729784946085-pl50l2td2e4jjoadi0ad06cmesbujbno.apps.googleusercontent.com',
      DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      SCOPES: "https://www.googleapis.com/auth/calendar",
      signedIn:false,
      authorizeButton: "",
      signoutButton: ""
    },
    handleClientLoad:function() {
      gapi.load('client:auth2', $scope.initiatePage.initClient);
      //HandleAPIInteraction.setGapi(gapi, this);

    },
    applyScope:function(){
      $scope.apply();
    },
    initClient() {
      gapi.client.init({
        discoveryDocs: $scope.initiatePage.data.DISCOVERY_DOCS,
        clientId: $scope.initiatePage.data.CLIENT_ID,
        scope: $scope.initiatePage.data.SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen($scope.initiatePage.updateSigninStatus);

        // Handle the initial sign-in state.
        $scope.initiatePage.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        $($scope.initiatePage.data.authorizeButton).click(function() {
          $scope.initiatePage.handleAuthClick();
        });
        $($scope.initiatePage.data.signoutButton).click(function() {
          $scope.initiatePage.handleSignoutClick();
        });
      });
    },
    updateSigninStatus: function(isSignedIn) {
      if (isSignedIn) {
        $location.path( "/home" );
        $scope.initiatePage.data.authorizeButton.css("display", "none");
        $scope.initiatePage.data.signoutButton.css("display", "block");;
        $scope.initiatePage.data.signedIn = true;
        $scope.handleHours.functions.initiateHours();
        HandleAPIInteraction.checkDailyTrackerCalendarExists($scope.handleHours.data.hours, $scope.handleGoals);
        //$scope.handleGoals.functions.initiateGoals();
        $scope.$apply();
      } else {
        $scope.initiatePage.data.authorizeButton.css("display", "block");
        $scope.initiatePage.data.signoutButton.css("display", "none");
      }
    },
    handleAuthClick:function(event) {
      gapi.auth2.getAuthInstance().signIn();
    },
    handleSignoutClick: function(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

  };


  $scope.handleHours={
    data:{
      hours:[]
    },
    functions:{
      applyScope:function(){
        $scope.$apply();
      },
      initiateHours:function(){
        HandleAPIInteraction.setThis(getThis());
        $scope.handleHours.data.hours=HandleToday.initiateHours();
      },
      addHour:function(id){
        HandleAPIInteraction.updateHour($scope.handleHours.data.hours, id);
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
*/
});
