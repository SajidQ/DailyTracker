app.service('GenericFunctions', function(){
  this.append = function(message) {
      var pre = $('#content');
      var textContent = document.createTextNode(message + '\n');
      pre.append(textContent);
  }
});

app.service('HandleAPIInteraction', function(GenericFunctions){
  this.gapi = null;

  this.setGapi = function(gapi){
      this.gapi = gapi;
  }

  //summary: gets list of calendars,
  //check if 'DailyTracker' is one of the calendars
  this.checkDailyTrackerCalendarExists= function(){
    //get calendars

    this.gapi.client.calendar.calendarList.list().then(function(response){
      //look for DailyTracker
      var found = false;
      for(var i=0; i< response.result.items.length; i++){
        if(response.result.items[i].summary==="DailyTracker"){
          found = true;
        }
      }

      //else create it
      if(!found){
        calendar = {
            'summary': 'DailyTracker',
            'timeZone': 'America/Los_Angeles'
        }

        this.gapi.client.calendar.calendarList.insert(calendar).then(function(response){
        });
      }
    });
  };

  //summary: get the list of event for today
  this.getToday = function(){
    this.checkDailyTrackerCalendarExists();
    var today = new Date();
    today.setHours(0,0,0,0);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    this.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (today).toISOString(),
      'timeMax': (tomorrow).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          GenericFunctions.append(event.summary + ' (' + when + ')')
        }
      } else {
        GenericFunctions.append('No upcoming events found.');
      }
    });
  };
});


app.service('HandleToday', function(){
 this.initiateHours = function(){
   var hours = [];
   var min = "00";
   var am = true;

   //loop though 24 hours (x2 because of 30min interval),
   //starting at 6am
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
       id:i,
       hour: Math.floor(hour/2),
       min: min,
       am: am,
       task:""
     });
   }

   return hours;
 };
});
