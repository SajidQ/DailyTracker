// Client ID and API key from the Developer Console
var CLIENT_ID = '729784946085-pl50l2td2e4jjoadi0ad06cmesbujbno.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = "";
var signoutButton = "";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

$( document ).ready(function() {
                    authorizeButton = $('#authorize-button');
                    signoutButton = $('#signout-button');
    });

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
                     discoveryDocs: DISCOVERY_DOCS,
                     clientId: CLIENT_ID,
                     scope: SCOPES
                     }).then(function () {
                             // Listen for sign-in state changes.
                             gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                             
                             // Handle the initial sign-in state.
                             updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                             
                             $(authorizeButton).click(function() {
                                                      handleAuthClick();
                                                  });
                             $(signoutButton).click(function() {
                                                      handleSignoutClick();
                                                      });
                             });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.css("display", "none");
        signoutButton.css("display", "block");;
        listUpcomingEvents();
    } else {
        authorizeButton.css("display", "block");
        signoutButton.css("display", "none");
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = $('#content');
    var textContent = document.createTextNode(message + '\n');
    pre.append(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
                                     'calendarId': 'primary',
                                     'timeMin': (new Date()).toISOString(),
                                     'showDeleted': false,
                                     'singleEvents': true,
                                     'maxResults': 10,
                                     'orderBy': 'startTime'
                                     }).then(function(response) {
                                             var events = response.result.items;
                                             appendPre('Upcoming events:');
                                             
                                             if (events.length > 0) {
                                             for (i = 0; i < events.length; i++) {
                                             var event = events[i];
                                             var when = event.start.dateTime;
                                             if (!when) {
                                             when = event.start.date;
                                             }
                                             appendPre(event.summary + ' (' + when + ')')
                                             }
                                             } else {
                                             appendPre('No upcoming events found.');
                                             }
                                             });
}


function addNewItem(){
    
    var response = prompt("Event?");
    addEvent(response);
}

function addEvent(label){
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
                    appendPre('Event created: ' + event.htmlLink);
                    });
    
    var cals = gapi.client.calendar.calendarList.list().then(function(response){
                                                             
                                                             });
    

}
