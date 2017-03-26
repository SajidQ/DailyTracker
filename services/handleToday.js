
app.service('HandleToday', function(HandleAPIInteraction){
  this.data={
    yearGoal:{id:null, list:[]},
    month:{id:null, list:[]}
  };

  var selfPtr = null;

  this.getThis = function(){
    selfPtr = this;
  };

  this.initiateHours = function(){
    this.getThis();

    var hours = [];
    var min = "00";
    var am = true;

    //loop though 24 hours (x2 because of 30min interval),
    //starting at 6am
    var count =0;
    /*
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
    }*/

    for(var i=6; i<24; i++){

      //determine hour + period
      var hour = i;
      if(i>=12)
      {
        am= false;
        if(i!=12)
        hour=hour-12;
      }

      //add the minutes
      min="00";

      hours.push({
        id:count,
        actualHour:i,
        hour: hour,
        min: min,
        am: am,
        task:"",
        eventID:null
      });
      count++;
    }

    return hours;
  };

  this.getThisMonthGoal = function(){
    var promise = new Promise(function(resolve, reject) {
      var today = new Date();
      HandleAPIInteraction.getGoalEvent("MonthGoal", today.getMonth()).then(function(r){
        selfPtr.data.month.id = r.id;
        selfPtr.data.month.list = r.list;
        resolve(true);
      });
    });

    return promise;
  };
  this.saveDailyGoal = function(dailyGoal){
    //update the goal
    /*
    var tempStr = "'"+JSON.stringify({type: "DailyGoal", todo:[]})+"'";
    var myObj = {type: "DailyGoal", todo:[]};
    //var rawStr = "DailyGoal: ";
    for(var i=0; i<dailyGoal.list.length;i++){
      var small = dailyGoal.list[i].task+":::"+dailyGoal.list[i].complete+";;;";
      rawStr+=small;
    }*/

    var today = new Date();
    today.setHours(0,0,0,0);
    var event = {
      'summary': "'"+JSON.stringify(dailyGoal.list)+"'",
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
