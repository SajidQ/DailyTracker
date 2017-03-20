app.service('HandleYearGoals', function(HandleAPIInteraction){
  this.data={
    yearGoal:{id:null, list:[]},
    months:{
      0:{label:"January", id:null, list:[]},
      1:{label:"February",id:null, list:[]},
      2:{label:"March",id:null, list:[]},
      3:{label:"April",id:null, list:[]},
      4:{label:"May",id:null, list:[]},
      5:{label:"June",id:null, list:[]},
      6:{label:"July",id:null, list:[]},
      7:{label:"August",id:null, list:[]},
      8:{label:"September",id:null, list:[]},
      9:{label:"October",id:null, list:[]},
      10:{label:"November",id:null, list:[]},
      11:{label:"December",id:null, list:[]}
    }
  };

  var selfPtr = null;

  this.getThis = function(){
    selfPtr = this;
  };

  this.getAllMonths = function(){
    this.getThis();
    //var promise = new Promise(function(resolve, reject) {
    var promiseList = [];
      for(var month in selfPtr.data.months)
      {
        var promise =new Promise((resolve, reject) => {
          (function(month){
            HandleAPIInteraction.getGoalEvent("MonthGoal", month).then(function(r){
              selfPtr.data.months[month].id = r.id;
              selfPtr.data.months[month].list = r.list;
              resolve(true);
            });
          })(month);
        });
        promiseList.push(promise);
      }


    return Promise.all(promiseList);
  };

  this.getYearInformation = function(){
    this.getThis();
    var promise = new Promise(function(resolve, reject) {
      HandleAPIInteraction.getGoalEvent("YearGoal", null).then(function(r){
        selfPtr.data.yearGoal.id = r.id;
        selfPtr.data.yearGoal.list = r.list;
        resolve(true);
      });
    });
    return promise;
  };

  this.saveGoals = function(type, month){
    var today = new Date();
    today.setHours(0,0,0,0);
    var firstday = new Date(today.getFullYear(), month, 1);

    //var rawStr = type+": ";
    var listPtr = null;
    if(type==="YearGoal")
    {
      firstday = new Date(today.getFullYear(), 0, 1);
      listPtr = selfPtr.data.yearGoal;
    }
    else{
      listPtr = selfPtr.data.months[month];
    }

    /*
    for(var i=0; i<listPtr.list.length;i++){
      var small = listPtr.list[i].task+":::"+listPtr.list[i].complete+";;;";
      rawStr+=small;
    }
    */
    firstday.setHours(0,0,0,0);

    var event = {
      'summary': "'"+JSON.stringify(listPtr.list)+"'",
      'start': {
        'dateTime': (firstday).toISOString()
      },
      'end': {
        'dateTime': (firstday).toISOString()
      },
    };

    HandleAPIInteraction.updateEvent(event, listPtr.id);
  };

});
