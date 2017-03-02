var app = angular.module('DailyTracker', []);


app.controller('mainCtrl', function($scope, $window, HandleToday, HandleAPIInteraction) {
  $window.onload = function(){
    $scope.initiatePage.handleClientLoad();
  }

  angular.element(document).ready(function () {
    $scope.initiatePage.data.authorizeButton = $('#authorize-button');
    $scope.initiatePage.data.signoutButton = $('#signout-button');
  });

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
        $scope.initiatePage.data.authorizeButton.css("display", "none");
        $scope.initiatePage.data.signoutButton.css("display", "block");;
        $scope.initiatePage.listUpcomingEvents();
        $scope.initiatePage.data.signedIn = true;

        $scope.handleHours.functions.initiateHours();
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
    },
    appendPre:function(message) {
      var pre = $('#content');
      var textContent = document.createTextNode(message + '\n');
      pre.append(textContent);
    },
    listUpcomingEvents: function() {/*
      gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;
        $scope.initiatePage.appendPre('Upcoming events:');

        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            $scope.initiatePage.appendPre(event.summary + ' (' + when + ')')
          }
        } else {
          $scope.initiatePage.appendPre('No upcoming events found.');
        }
      });*/
    },
    addNewItem: function(){

      var response = prompt("Event?");
      $scope.initiatePage.addEvent(response);
    },

    addEvent:function(label){
      var time = new Date();
      var event = {
        'summary': label,
        'start': {
          'dateTime': '2017-02-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': '2017-02-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'lpage@example.com'},
          {'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        }
      };

      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });

      request.execute(function(event) {
        $scope.initiatePage.appendPre('Event created: ' + event.htmlLink);
      });

      var cals = gapi.client.calendar.calendarList.list().then(function(response){

      });
    }

  };


  $scope.handleHours={
    data:{
      hours:[],

    },
    functions:{
      initiateHours:function(){
        HandleAPIInteraction.getToday(gapi);
        $scope.handleHours.data.hours=HandleToday.initiateHours();
      }
    }
  };

  $scope.handleGoals = {
    data:{
      yearly:[],
      monthly:[],
      weekly:[],
      daily:[]
    },
    functions:{
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
      addDailyGoal:function(){

      },
      getDailyGoal:function(){

      },
    }

  };

});
