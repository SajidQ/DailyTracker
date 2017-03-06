app.service('GenericFunctions', function(){
  this.append = function(message) {
    var pre = $('#content');
    var textContent = document.createTextNode(message + '\n');
    pre.append(textContent);
  }
});

app.service('HandleAPIInteraction', function(GenericFunctions, $rootScope){
  var data = {
    gapi:null,
    DailyTrackerCalendar: null,
    service: this,
    controller:null,
    today:null
  };

  this.setGapi = function(gapi){
    data.gapi = gapi;
    data.today = new Date();
  };

  this.setThis = function(that){
    data.controller = that;
  };

  //summary: gets list of calendars,
  //check if 'DailyTracker' is one of the calendars
  this.checkDailyTrackerCalendarExists= function(handleHoursPtr){
    //get calendars
    data.service = this;
    (function(handleHoursPtr){
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
            data.service.getToday(handleHoursPtr);
          });
        }
        else{
          data.service.getToday(handleHoursPtr);
        }

      });
    })(handleHoursPtr);

  };


  //summary: get the list of event for today
  this.getToday = function(handleHoursPtr){
    var today = new Date();
    today.setHours(0,0,0,0);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    (function(hoursPtr){
      var temp = hoursPtr;
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

        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
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

              GenericFunctions.append(event.summary + ' (' + startDate + ')')
            }
          }

          $rootScope.$apply();

        } else {
          GenericFunctions.append('No upcoming events found.');
        }
      });

    })(handleHoursPtr);
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
