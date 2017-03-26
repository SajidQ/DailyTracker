

app.service('HandleAPIInteraction', function($location, $rootScope){
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
      selfPtr.checkDailyTrackerCalendarExists().then(function(r){
        if(r){
          //selfPtr.setGapi(selfPtr.data.api.gapi);
          if($location.path()==="/"){
            $location.path( "/today" );
          }
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

  this.createNewEvent = function(event){
    var promise = new Promise(function(resolve, reject){
      selfPtr.data.api.gapi.client.calendar.events.insert({
        'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
        'resource': event
      }).then(function(response){
        resolve( response.result.id);
      });
    });
    return promise;
  };

  this.updateEvent = function(event, eventID){
    return selfPtr.data.api.gapi.client.calendar.events.update({
      'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
      'eventId':eventID,
      'resource': event
    }).then(function(response){
      return response.result;
    });
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
                var convHour = (hour-6);
                if(min===30)
                convHour++;

                if(convHour>=0 && convHour<hoursPtr.length){
                  hoursPtr[convHour].task = event.summary;
                  hoursPtr[convHour].eventID = event.id;
                }

                //GenericFunctions.append(event.summary + ' (' + startDate + ')');
              }
            }
            else{
              foundDailyGoal = true;
              handleGoals.data.daily.id = event.id;
              //handleGoals.data.daily.raw = event.summary;
              handleGoals.data.daily.list = selfPtr.parseGoalsList(event.summary);
              //GenericFunctions.append(event.summary + ' (' + startDate + ')');
            }
          }
          $rootScope.$apply();

        }
        /*else {
          GenericFunctions.append('No upcoming events found.');
        }*/

        //if no daily goal available, create empty item
        if(!foundDailyGoal){
          var endTime = today;

          //endTime.setMinutes(today.getMinutes() + 20);
          var event = {
            'summary': "'"+JSON.stringify({type: "DailyGoal", todo:[]})+"'",
            'location': '',
            'start': {
              'dateTime': (today).toISOString()
            },
            'end': {
              'dateTime': (today).toISOString()
            },
            'transparency':'opaque'//'transparent'
          };

          handleGoals.data.daily.id = selfPtr.createNewEvent(event);
          handleGoals.data.daily.list = {type: "DailyGoal", todo:[]};
        }
      });

    })(handleHoursPtr, handleGoals);
  };




  this.getGoalEvent = function(type, month){
    var today = new Date();
    today.setHours(0,0,0,0);
    var firstday = new Date(today.getFullYear(), month, 1);
    if(type==="YearGoal")
      firstday = new Date(today.getFullYear(), 0, 1);
    firstday.setHours(0,0,0,0);

    var twentyMinutesLater = new Date(today.getFullYear(), firstday.getMonth(), 1);
    twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20);

    var promise = new Promise(function(resolve, reject){

      selfPtr.data.api.gapi.client.calendar.events.list({
        'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
        'timeMin': (firstday).toISOString(),
        'timeMax': (twentyMinutesLater).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        var foundYearGoal = false;
        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            if(event.summary.search(type)!==-1){
              foundYearGoal = true;

              resolve({id:event.id, list:selfPtr.parseGoalsList(event.summary, "YearGoal: ")});
              break;
            }
          }
        }

        //if no daily goal available, create empty item
        if(!foundYearGoal){
          var event = {
            'summary': "'"+JSON.stringify({type: type, todo:[]})+"'",
            'location': '',
            'start': {
              'dateTime': (firstday).toISOString()
            },
            'end': {
              'dateTime': (firstday).toISOString()
            },
            'transparency':'opaque'//'transparent'
          };

          selfPtr.createNewEvent(event).then(function(id){
              resolve({id:id, list:{type:type, todo:[]}});
          });

        }
      });

    });

    return promise;
  };



  //summary used to add user's input to the calendar
  this.updateHour = function(hoursList, id){
    var today = selfPtr.data.calendar.today;
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
    var hour = newItem.actualHour;
    var min = newItem.min;
    var endHour = hour+1;
    var zone=today.toString().substring(29,33);
    var endMin = "00";
    /*
    if(min==="30")
    {
      endMin = "00";
      endHour ++;
    }*/

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
          'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
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
        'calendarId': selfPtr.data.calendar.DailyTrackerCalendar,
        'eventId':newItem.eventID,
        'resource': event
      }).then(function(response){

      });
    }

  };



  this.parseGoalsList = function(input, type){
    var parsedList = JSON.parse(eval("(" + input + ")"));
    /*
    var obj2 = { "name":"John", "age":30, "city":"New York"};
    var myJSON = JSON.stringify(obj2);*/
    /*
    var eraseStrLen = (type).length;
    var newInput = input.substring(eraseStrLen);

    var list =  newInput.split(";;;");
    var parsedList = [];

    for(var i=0; i<list.length; i++){
      var temp = list[i].replace(/\s/g, '');
      if(list[i]!=="" && temp.length>0){
        var splitItem = list[i].split(":::");
        var task = {
          task: splitItem[0],
          complete:splitItem[1]
        };
        parsedList.push(task);
      }
    }*/

    return parsedList;
  };
});
