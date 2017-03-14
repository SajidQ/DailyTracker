app.service('HandleYearGoals', function(HandleAPIInteraction){
  this.data={
    yearGoal:{id:null, list:[]},
    months:{
      1:"",
      2:"",
      3:"",
      4:"",
      5:"",
      6:"",
      7:"",
      8:"",
      9:"",
      10:"",
      11:"",
      12:""
    }
  };

  var selfPtr = null;

  this.getThis = function(){
    selfPtr = this;
  };

  this.getYearInformation = function(){
    this.getThis();
    var promise = new Promise(function(resolve, reject) {
      HandleAPIInteraction.getGoalEvent("YearGoal").then(function(r){
        selfPtr.data.yearGoal.id = r.id;
        selfPtr.data.yearGoal.list = r.list;
        resolve(true);
      });
    });
    return promise;
  };

  this.saveYearGoals = function(){
    //update the goal
    var rawStr = "YearGoal: ";
    for(var i=0; i<selfPtr.data.yearGoal.list.length;i++){
      var small = selfPtr.data.yearGoal.list[i].task+":::"+selfPtr.data.yearGoal.list[i].complete+";;;";
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

    HandleAPIInteraction.updateEvent(event, selfPtr.data.yearGoal.id);
  };

});
