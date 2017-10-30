

var database = null;

//placeholder for non-auth
var currentUser = {uid: "placeHolderUser"}; //null;

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


  //firebase user logged in/out
  // firebase.auth().onAuthStateChanged(authStateChange);

  //login event
  // firebase.auth().getRedirectResult().then(fireBaseLoginEvent).catch(firebaseAuthError);


  console.log("User events intitialied");


}



/**
 * Save an event
 * @param  {object} eventData [description]
 * @return {[type]}           [description]
 */
function saveEvent() {

  console.log("saving event");

  if(currentUser !== null) {

    if(database !== null) {

        let id = currentUser.uid;
        //save all the user events to the database
        database.ref(id).push(userSavedEvents);

    } else {
      console.warn("Database is null - are you logged in?");
    }

  } else {
    console.warn("Current user is null (not logged in) - cannot save event.");
  }


}


/**
 * Authorization state changed
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
function authStateChange(user) {

    console.log("firebase auth change event");
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

    } else {

      console.log("No Authenticated User... ");
      //currentUser = null; //Not sure here....
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
    // ...
    console.log("token = " + token);

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

  }).catch(function(error) {
    // An error happened.
    console.log("Logout Error");
    console.log(error);
  });



}//end loginHandler



/**
 * DB CHange event handler
 * @param  {object} snapshot Database event
 * @return {undefined}      NO Return
 */
function snapShotHandler(snapshot) {

  console.log("database updated");
  //remove all existing rows, but leave header row
    $('#savedEventDisplay').empty();

    //run through all children
    snapshot.forEach(function(childSnapshot) {

     var csdata = childSnapshot.val();

     console.log("Child snapshot data:");
     console.log(csdata);


     let disp = "Event Id: " + csdata.eventId + ", Event URL : " + csdata.eventURL;
     let ptag= $("<p>").text(disp);

     $('#savedEventDisplay').append(ptag);

   });

}//end snapShotHandler


/**
 * Error Handler
 * @param  {object} errorObj DB Error event object
 * @return {undefined}    NO Return
 */
function changeEventError(errorObj) {

  console.error("Error getting Firebase data on change event.");
  console.error(errorObj);

}
