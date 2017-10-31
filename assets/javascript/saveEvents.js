

var database = null;

//placeholder for non-auth
var anonUser = {uid: "anonymousUser"};
var currentUser = null;
var currentUserAuthenticated = false;

var authenticatedFirstRun = true;

/*
  User Saved events
 */
var userSavedEvents = null;

//document loded event via jquery
$(document).ready(initUserEvents);


/**
 * INit the usuer events handling
 * @return {[type]} [description]
 */
function initUserEvents() {

  //hook the login button
  $("#loginButton").on("click", loginHandler);

  $("#logoutButton").on("click", logoutHandler);

  //init default empty record set
  //No Return on this!
  initEmptyUserDataObject();

  if(useAuthenticated) {

      $("#loginButton").show();
      $("#logoutButton").hide();

      currentUser = null;

      authenticatedFirstRun = true;

      //firebase user logged in/out
      firebase.auth().onAuthStateChanged(authStateChange);

      //login event
      firebase.auth().getRedirectResult().then(fireBaseLoginEvent).catch(firebaseAuthError);


  } else {

      $("#loginButton").hide();
      $("#logoutButton").hide();


      //use the anonymous user in non-authenticated mode
      currentUser = anonUser;
      //get the database
      database = firebase.database();

      let id = currentUser.uid;
      //attach snapshot handler
      database.ref(id).on("value",snapShotHandler,changeEventError);

      //do an initial save event
      //this will actually clear the db of previous events from anon user
      saveEvent();

  }


  console.log("User events intitialied");


}



/**
 * Save an event
 * @param  {object} eventData [description]
 * @return {undefined}          No Return
 */
function saveEvent() {



  if(useAuthenticated) {


      console.log("saving event as authenticated user");
      if(currentUser !== null) {

        if(database !== null) {

            let id = currentUser.uid;
            //save all the user events to the database
            database.ref(id).set(userSavedEvents);

        } else {
          console.warn("Database is null - are you logged in?");
        }

      } else {
        console.warn("Current user is null (not logged in) - cannot save event.");
      }


  } else {

      console.log("saving event as anonymous user");
      let id = currentUser.uid;
      //save all the user events to the database
      database.ref(id).set(userSavedEvents);

  }




}//end save event


/**
 * Authorization state changed
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
function authStateChange(user) {

    console.log("firebase authentification change event");
    if (user) {
      // User is signed in.
      let userInfo = user.displayName + ", id: " + user.uid;
      console.log("Auth User Signed in: " + userInfo);
      currentUser = user;
      //init databse instance
      database = firebase.database();

      //snapshot handler
      let id = currentUser.uid;
      database.ref(id).on("value",snapShotHandler,changeEventError);

      $("#loginButton").hide();
      $("#logoutButton").show();

    } else {

      console.log("No Authenticated User... ");
      //handle state in logout

      $("#loginButton").show();
      $("#logoutButton").hide();


    }


}


/**
 * Firebase logged in
 * @param  {object} result Login credential info
 * @return {[type]}        [description]
 */
function fireBaseLoginEvent(result) {

  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;


  }
  // The signed-in user info.
  var user = result.user;

}
/**
 * Authentification Error
 * @param  {object} error Error event object
 * @return {undefined}  No Return
 */
function firebaseAuthError(error) {

      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Authentification Error:" + errorCode + " :: " + errorMessage);

      //hide buttons in authneticated
      if(useAuthenticated) {

        $("#loginButton").show();
        $("#logoutButton").hide();

      }


}



/**
 * Login handler function
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function loginHandler(event) {
  event.preventDefault();

  //provider defined in index.html script section
  firebase.auth().signInWithRedirect(provider);


}//end loginHandler


/**
 * Logout Handler
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function logoutHandler(event) {
  event.preventDefault();

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Logout Success!");
    database = null;
    currentUser = null;
    currentUserAuthenticated = false;
    authenticatedFirstRun = true;

  }).catch(function(error) {
    // An error happened.
    console.log("Logout Error");
    console.log(error);
  });



}//end loginHandler



/**
 * DB Change event handler
 * @param  {object} snapshot Database event
 * @return {undefined}      NO Return
 */
function snapShotHandler(snapshot) {

  console.log("---- database updated-----");

  //remove all existing rows, but leave header row
    $('#savedEventDisplay').empty();

    let shValue = snapshot.val();
   console.log("Snapshot value:");
   console.log(shValue);
   var doLocalLoad = false;

  //  debugger;
    //run through all children
    snapshot.forEach(function(childSnapshot) {

     var csdata = childSnapshot.val();

     console.log("Child snapshot data:");
     console.log(csdata);

     //do this on fist recieve when authenticated
     //this pulls the DB data to the local data structure
     if(useAuthenticated && authenticatedFirstRun) {
       console.log("authenticatedFirstRun - saving data");
       addEventRecord(csdata);
     }

     displaySavedEvent(csdata);


   });

   //turn off flag after loading from db on first run
   if(useAuthenticated && authenticatedFirstRun) {
     authenticatedFirstRun = false;
   }//end if


}//end snapShotHandler


/**
 * Display the Saved event
 * SHow the title and link
 * @param  {object} event Event Data from DB
 * @return {undefined}    NO Return
 */
function displaySavedEvent(event) {

  //bail if nothign to display
  if(event === null) return;
  if((typeof event) === "undefined") return;

  let eDiv = $("<div>");
  eDiv.attr("class", "saved-item");
  let eurl = $("<a>").text(event.title);
  eurl.attr("class", "recent-links");
  eurl.attr("href", event.url);
  eurl.attr("target", "_blank");
  eDiv.append(eurl);

  $('#savedEventDisplay').append(eDiv);

}


/**
 * Error Handler
 * @param  {object} errorObj DB Error event object
 * @return {undefined}    NO Return
 */
function changeEventError(errorObj) {

  console.error("Error getting Firebase data on change event.");
  console.error(errorObj);

}
