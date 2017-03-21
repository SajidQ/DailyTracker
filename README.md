# DailyTracker
## Welcome!
DailyTracker is an online planning dashboard for tracking days by half-hours and managing goals throughout the year using the Google Calendar API.

## To Do List

<ul>
<li> <del>Add angular</del> 2/25/17 </li>
<li> <del>Change screen based on Authorization</del> 2/26/17</li>
<li> <del>Setup UI to show today by hours</del> 2/28/2017</li>
<li> <del>Get items for today</del> 3/1/17</li>
<li><del>Get list of calendars</del> 3/2/17</li>
<li><del>Check if DailyTracker calendar is a part of list, if not add it</del> 3/4/17</li>
<li><del>Save user's input in list to calendar</del> 3/4/17</li>
<li><del>Update existing event, do not rewrite</del> 3/5/17</li>
<li><del>Grab all the tasks from the DailyTracker and show on the hourly today list.</del> 3/5/17</li>
<li> Grab tasks from other calendars and layer it on top of hourly today list and  show on timeline</li>
<li><del>Add hidden Daily goal event</del> 3/7/17</li>
<li><del>Load and show daily goals in goals section</del> 3/8/17</li>
<li>Add routing for different pages and organize files</li>
<li>Add signin permissions to routing </li>
</ul>


---
## Ideas
<ul>
<li>Switch to a start/stop tracker?</li>
<li>Look in to using Google App Storage for goals and habit tracking</li>
<li>Look into saving user emotions day by day? Or by hour? </li>
<li>Look into connecting with Amazon for purchases? Or youTube watch history?</li>
<li>Make a plan your month? </li>
<li>Make a plan your week?</li>
<li><del>Plan your year</del> 3/20/17</li>
</ul>


---
## Notes
### Week of 3/6/17
3/6/17 - Added to do items related to showing the daily, monthly, and yearly goals.

3/8/17 -
Organization:
HandleAPIInteraction: handles all communication with gapi?

-checkDailyTrackerCalendarExists: actually checks if the DailyTracker calendar exists but should should it call getToday?

-getToday needs to be able to look through events for the day to check for the "DailyGoal" event since no other way to find that specific event through the api. How should the DailyGoal event summary be parsed? Right now it calls the

-getFirstOfMonth: To create. This needs to be able get the first for any month, grab the habit and goal events

-getFirstOfYear: To create. This needs to be able get the first of any year and grab the year goal


HandleToday

handleGoals: For All the goals?

Need code clean up with routing. What is the objective with this app? Is it a one stop stop of managing goals?
Working on adding routing and possibly around the whole

### Week of 2/27/17
3/2/17 - It seems like a better idea to add a calendar labeled DailyTrackerJS so it doesn't interfere with other calendars the user has. In addition, it might be better to show a layering of the other tasks from the calendar?
Tasks to add: get list of calendars, check if DailyTracker calendar is a part of list, if not add it, grab all the tasks from the DailyTracker and show on the hourly today list. Additionally, grab tasks from other calendars and layer it on top of hourly today list.

3/1/17 - Adding in another js file for services in order to keep the mainCtrl clean.

2/28/17 - Worked on cleaning up and showing the hours. I'm having a hard time imagining the design with goals, the hourly display of today and tomorrow, and the habits. I really want to add things like habit-tracking and maybe connect to Wunderlist. The current index.html page is likely to become a dashboard page with the other header links providing more editing features for lists..?

### Week of 2/20/17
2/26/17 - Goal: Change what's shown on the screen based on authorization. Start setting up the UI for Today (hourly) and the Goals.

2/25/17 - This is a project to play around with JS, angularjs, but mostly the Google Calendar API. Additionally, I'm planning to use this to maybe track goals outside of journaling using one location, google calendar.

The initial objective is to show the 24hours of today and tomorrow broken up in 30min intervals. This will also enable users to write yearly, monthly, weekly goals.

Objective: Have goals and action in one place?
