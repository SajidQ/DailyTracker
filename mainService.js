app.service('GenericFunctions', function(){
  this.append = function(message) {
    var pre = $('#content');
    var textContent = document.createTextNode(message + '\n');
    pre.append(textContent);
  }
});

app.service('HandleAPIInteraction', function($location, $rootScope, GenericFunctions){
  var selfPtr=null;
  this.data = {
    api:{
      CLIENT_ID: '729784946085-pl50l2td2e4jjoadi0ad06cmesbujbno.apps.googleusercontent.com',
      DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      SCOPES: "https://www.googleapis.com/auth/calendar",
      gapi:null
    },
    control:{
      service: this,
      signedIn:false,
      authorizeButton: "",
      signoutButton: ""
    },
    calendar:{
      DailyTrackerCalendar: null,
      controller:null,
      today:null
    }
  };

  this.setGapi = function(gapi){
    selfPtr.data.api.gapi = gapi;
    selfPtr.data.calendar.today = new Date();
  };

  this.saveThis = function(){
    selfPtr = this;
  };

  this.handleClientLoad = function() {
    this.saveThis();
    gapi.load('client:auth2', selfPtr.initClient);

    selfPtr.setGapi(gapi);
  };

  this.setButtons = function(authorBtn, signOutBtn){
    this.data.control.authorizeButton =authorBtn;
    this.data.control.signoutButton =signOutBtn;
  };

  this.initClient = function() {
    selfPtr.data.api.gapi.client.init({
      discoveryDocs: selfPtr.data.api.DISCOVERY_DOCS,
      clientId: selfPtr.data.api.CLIENT_ID,
      scope: selfPtr.data.api.SCOPES
    }).then(function () {
      // Listen for sign-in state changes.

      selfPtr.data.api.gapi.auth2.getAuthInstance().isSignedIn.listen(selfPtr.updateSigninStatus);

      // Handle the initial sign-in state.
      selfPtr.updateSigninStatus(selfPtr.data.api.gapi.auth2.getAuthInstance().isSignedIn.get());

      /////////////////////////////////////////////
      //NEED TO FIX: replace with angular ng-click
      $(selfPtr.data.control.authorizeButton).click(function() {
        selfPtr.handleAuthClick();
      });
      $(selfPtr.data.control.signoutButton).click(function() {
        selfPtr.handleSignoutClick();
      });
    });
  };

  this.updateSigninStatus =  function(isSignedIn) {
    if (isSignedIn) {
      selfPtr.data.control.authorizeButton.css("display", "none");
      selfPtr.data.control.signoutButton.css("display", "block");;
      selfPtr.data.control.signedIn = true;

      //$scope.handleGoals.functions.initiateGoals();
      this.checkDailyTrackerCalendarExists().then(function(r){
        if(r){
          selfPtr.setGapi(selfPtr.data.api.gapi);
          $location.path( "/home" );
          $rootScope.$apply();
        }
        else{
          alert("Something if wrong with your authorization. Could not access DailyTracker calendar. "+r);
        }
      });

    } else {
      selfPtr.data.control.authorizeButton.css("display", "block");
      selfPtr.data.control.signoutButton.css("display", "none");
    }
  };

  this.handleAuthClick = function(event) {
    selfPtr.data.api.gapi.auth2.getAuthInstance().signIn();
  };

  this.handleSignoutClick = function(event) {
    selfPtr.data.api.gapi.auth2.getAuthInstance().signOut();
  };

  //summary: gets list of calendars,
  //check if 'DailyTracker' is one of the calendars
  this.checkDailyTrackerCalendarExists= function(){
    var promise = new Promise(function(resolve, reject){
      //get calendars
      selfPtr.data.api.gapi.client.calendar.calendarList.list().then(function(response){
        //look for DailyTracker
        for(var i=0; i< response.result.items.length; i++){
          if(response.result.items[i].summary==="DailyTracker"){
            selfPtr.data.calendar.DailyTrackerCalendar = response.result.items[i].id;
          }
        }

        //else create it
        if(selfPtr.data.calendar.DailyTrackerCalendar==null){
          calendar = {
            'summary': 'DailyTracker'
          }

          //add DailyTracker as new calendar
          selfPtr.data.api.gapi.client.calendar.calendars.insert(calendar).then(function(response){
            selfPtr.data.calendar.DailyTrackerCalendar = response.result.id;
            resolve(true);
          });
        }
        else{
          resolve(true);
        }

      });
    });
    return promise;
  };

  //summary: get the list of event for today
  this.getToday = function(handleHoursPtr, handleGoals){
    var today = new Date();
    today.setHours(0,0,0,0);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    (function(hoursPtr, handleGoals){
      selfPtr.data.api.gapi.client.calendar.events.list({
        'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
        'timeMin': (today).toISOString(),
        'timeMax': (tomorrow).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        var foundDailyGoal = false;
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            if(event.summary.search("DailyGoal")===-1){
              var startDate = new Date(event.start.dateTime);
              var hour = startDate.getHours();
              var min = startDate.getMinutes();

              //after 6am
              if(hour>=6){
                var convHour = (hour-6)*2;
                if(min===30)
                convHour++;

                if(convHour>=0 && convHour<hoursPtr.length){
                  hoursPtr[convHour].task = event.summary;
                  hoursPtr[convHour].eventID = event.id;
                }

                GenericFunctions.append(event.summary + ' (' + startDate + ')');
              }
            }
            else{
              foundDailyGoal = true;
              handleGoals.data.daily.id = event.id;
              //handleGoals.data.daily.raw = event.summary;
              handleGoals.data.daily.list = handleGoals.functions.parseDailyGoal(event.summary);
              GenericFunctions.append(event.summary + ' (' + startDate + ')');
            }
          }
          $rootScope.$apply();

        }
        else {
          GenericFunctions.append('No upcoming events found.');
        }

        //if no daily goal available, create empty item
        if(!foundDailyGoal){
          var endTime = today;

          //endTime.setMinutes(today.getMinutes() + 20);
          var event = {
            'summary': "DailyGoal: ",
            'location': '',
            'start': {
              'dateTime': (today).toISOString()
            },
            'end': {
              'dateTime': (today).toISOString()
            },
            'transparency':'opaque'//'transparent'
          };

          handleGoals.data.daily.id = data.service.createNewEvent(event);
          handleGoals.data.daily.list = [];
        }
      });

    })(handleHoursPtr, handleGoals);
  };
});

app.service('HandleAPIInteraction2', function(GenericFunctions, $rootScope){
  var data = {
    gapi:null,
    DailyTrackerCalendar: null,
    service: this,
    controller:null,
    today:null
  };


  this.setThis = function(that){
    data.controller = that;
  };


  this.createNewEvent = function(event){
    return gapi.client.calendar.events.insert({
      'calendarId': data.DailyTrackerCalendar,
      'resource': event
    }).then(function(response){
      return response.result.id;
    });
  };

  this.updateEvent = function(event, eventID){
    return gapi.client.calendar.events.update({
      'calendarId': data.DailyTrackerCalendar,
      'eventId':eventID,
      'resource': event
    }).then(function(response){
      return response.result;
    });
  };

  //summary: gets list of calendars,
  //check if 'DailyTracker' is one of the calendars
  this.checkDailyTrackerCalendarExists= function(handleHoursPtr, handleGoals){
    //get calendars
    data.service = this;
    (function(handleHoursPtr, handleGoals){
      data.gapi.client.calendar.calendarList.list().then(function(response){
        //look for DailyTracker
        for(var i=0; i< response.result.items.length; i++){
          if(response.result.items[i].summary==="DailyTracker"){
            data.DailyTrackerCalendar = response.result.items[i].id;
          }
        }

        //else create it
        if(data.DailyTrackerCalendar==null){
          calendar = {
            'summary': 'DailyTracker'
          }

          //add DailyTracker as new calendar
          data.gapi.client.calendar.calendars.insert(calendar).then(function(response){
            data.DailyTrackerCalendar = response.result.id;
            data.service.getToday(handleHoursPtr, handleGoals);
          });
        }
        else{
          data.service.getToday(handleHoursPtr, handleGoals);
        }

      });
    })(handleHoursPtr, handleGoals);

  };


  //summary: get the list of event for today
  this.getToday = function(handleHoursPtr, handleGoals){
    var today = new Date();
    today.setHours(0,0,0,0);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    (function(hoursPtr, handleGoals){
      data.gapi.client.calendar.events.list({
        'calendarId': data.DailyTrackerCalendar,
        'timeMin': (today).toISOString(),
        'timeMax': (tomorrow).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        var foundDailyGoal = false;
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            if(event.summary.search("DailyGoal")===-1){
              var startDate = new Date(event.start.dateTime);
              var hour = startDate.getHours();
              var min = startDate.getMinutes();

              //after 6am
              if(hour>=6){
                var convHour = (hour-6)*2;
                if(min===30)
                convHour++;

                if(convHour>=0 && convHour<hoursPtr.length){
                  hoursPtr[convHour].task = event.summary;
                  hoursPtr[convHour].eventID = event.id;
                }

                GenericFunctions.append(event.summary + ' (' + startDate + ')');
              }
            }
            else{
              foundDailyGoal = true;
              handleGoals.data.daily.id = event.id;
              //handleGoals.data.daily.raw = event.summary;
              handleGoals.data.daily.list = handleGoals.functions.parseDailyGoal(event.summary);
              GenericFunctions.append(event.summary + ' (' + startDate + ')');
            }
          }
          $rootScope.$apply();

        }
        else {
          GenericFunctions.append('No upcoming events found.');
        }

        //if no daily goal available, create empty item
        if(!foundDailyGoal){
          var endTime = today;

          //endTime.setMinutes(today.getMinutes() + 20);
          var event = {
            'summary': "DailyGoal: ",
            'location': '',
            'start': {
              'dateTime': (today).toISOString()
            },
            'end': {
              'dateTime': (today).toISOString()
            },
            'transparency':'opaque'//'transparent'
          };

          handleGoals.data.daily.id = data.service.createNewEvent(event);
          handleGoals.data.daily.list = [];
        }
      });

    })(handleHoursPtr, handleGoals);
  };


  this.getFirstOfMonth = function(handleGoals){
    var today = new Date();
    today.setHours(0,0,0,0);
    var firstday = new Date(today.getFullYear(), today.getMonth(), 1);

    (function(handleGoals){
      data.gapi.client.calendar.events.list({
        'calendarId': data.DailyTrackerCalendar,
        'timeMin': (firstday).toISOString(),
        'timeMax': (firstday).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        var foundMonthGoal = false;
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            if(event.summary.search("MonthGoal")!==-1){
              foundDailyGoal = true;
              handleGoals.data.monthly.id = event.id;
              handleGoals.data.monthly.list = handleGoals.functions.parseGoalsList(event.summary);
              break;
            }
          }
        }

        //if no daily goal available, create empty item
        if(!foundMonthGoal){
          var event = {
            'summary': "MonthGoal: ",
            'location': '',
            'start': {
              'dateTime': (firstday).toISOString()
            },
            'end': {
              'dateTime': (firstday).toISOString()
            },
            'transparency':'opaque'//'transparent'
          };

          handleGoals.data.monthly.id = data.service.createNewEvent(event);
          handleGoals.data.monthly.list = [];
        }
      });

    })(handleGoals);
  };


  //summary used to add user's input to the calendar
  this.updateHour = function(hoursList, id){
    var today = data.today;
    var newItem = hoursList[id];

    if(newItem.task==="")
    return;

    //calculate hours
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();

    if(month<10)
    month = "0"+month;
    if(day<10)
    day = "0"+day;
    var hour = newItem.hour;
    var min = newItem.min;
    var endHour = hour;
    var zone=today.toString().substring(29,33);
    var endMin = "30";
    if(min==="30")
    {
      endMin = "00";
      endHour ++;
    }

    if(hour<10)
    hour = "0"+hour;

    if(endHour<10)
    endHour = "0"+endHour;

    var start = year+"-"+month+"-"+day+"T"+hour+":"+min+":00-"+zone;
    var end = year+"-"+month+"-"+day+"T"+endHour+":"+endMin+":00-"+zone;

    //send event

    if(newItem.eventID === null){
      var event = {
        'summary': newItem.task.substring(0,30),
        'location': '',
        'description': newItem.task,
        'start': {
          'dateTime': start
        },
        'end': {
          'dateTime': end
        }
      };

      (function(hoursList,id){
        gapi.client.calendar.events.insert({
          'calendarId': data.DailyTrackerCalendar,
          'resource': event
        }).then(function(response){
          hoursList[id].eventID = response.result.id;
        });
      })(hoursList,id);
    }
    else{
      var event = {
        'summary': newItem.task.substring(0,30),
        'description': newItem.task,
        'start': {
          'dateTime': start
        },
        'end': {
          'dateTime': end
        }
      };

      gapi.client.calendar.events.update({
        'calendarId': data.DailyTrackerCalendar,
        'eventId':newItem.eventID,
        'resource': event
      }).then(function(response){

      });
    }

  };


  //end of service
});


app.service('HandleToday', function(){

  this.initiateHours = function(){
    var hours = [];
    var min = "00";
    var am = true;

    //loop though 24 hours (x2 because of 30min interval),
    //starting at 6am
    var count =0;
    for(var i=12; i<48; i++){

      //determine hour + period
      var hour = i;
      if(i>=24)
      {
        am= false;
        if(i!=24 && i!==25)
        hour=hour-24;
      }

      //add the minutes
      min="00";
      if(i%2!==0)
      {
        min="30";
      }

      hours.push({
        id:count,
        hour: Math.floor(hour/2),
        min: min,
        am: am,
        task:"",
        eventID:null
      });
      count++;
    }

    return hours;
  };
});



app.service('HandleGoals', function(HandleAPIInteraction){

  this.parseGoalsList = function(input, type){
    var eraseStrLen = (type).length;
    var newInput = input.substring(eraseStrLen);

    var list =  newInput.split(";;;");
    var parsedList = [];

    for(var i=0; i<list.length; i++){
      if(list[i]!==""){
        var splitItem = list[i].split(":::");
        var task = {
          task: splitItem[0],
          complete:splitItem[1]
        };
        parsedList.push(task);
      }
    }

    return parsedList;
  };

  this.saveDailyGoal = function(dailyGoal){
    //update the goal
    var rawStr = "DailyGoal: ";
    for(var i=0; i<dailyGoal.list.length;i++){
      var small = dailyGoal.list[i].task+":::"+dailyGoal.list[i].complete+";;;";
      rawStr+=small;
    }

    var today = new Date();
    today.setHours(0,0,0,0);
    var event = {
      'summary': rawStr,
      'start': {
        'dateTime': (today).toISOString()
      },
      'end': {
        'dateTime': (today).toISOString()
      },
    };

    HandleAPIInteraction.updateEvent(event, dailyGoal.id);
  };

});
