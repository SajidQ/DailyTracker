var app = angular.module('DailyTracker', []);



$( document ).ready(function() {

    });

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

app.controller('mainCtrl', function($scope, $window) {
    $scope.name = "John Doe";
/*
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '729784946085-pl50l2td2e4jjoadi0ad06cmesbujbno.apps.googleusercontent.com';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar";
*/
    var authorizeButton = "";
    var signoutButton = "";



    $window.onload = function(){
      $scope.initiatePage.handleClientLoad();
    }

    angular.element(document).ready(function () {
      authorizeButton = $('#authorize-button');
      signoutButton = $('#signout-button');
        });

    $scope.initiatePage = {
        data: {
          CLIENT_ID: '729784946085-pl50l2td2e4jjoadi0ad06cmesbujbno.apps.googleusercontent.com',
          DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          SCOPES: "https://www.googleapis.com/auth/calendar",
          signedIn:false
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

                                     $(authorizeButton).click(function() {
                                                              $scope.initiatePage.handleAuthClick();
                                                          });
                                     $(signoutButton).click(function() {
                                                              $scope.initiatePage.handleSignoutClick();
                                                              });
                                     });
        },
        updateSigninStatus: function(isSignedIn) {
            if (isSignedIn) {
                authorizeButton.css("display", "none");
                signoutButton.css("display", "block");;
                $scope.initiatePage.listUpcomingEvents();
                $scope.initiatePage.data.signedIn = true;
                $scope.$apply();
            } else {
                authorizeButton.css("display", "block");
                signoutButton.css("display", "none");
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
        listUpcomingEvents: function() {
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
                                                     });
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

    });
