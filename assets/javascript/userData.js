

var userSavedEvents = null;



/**
 * User saved events
 * @return {[type]} [description]
 */
  function initEmptyUserDataObject() {

    userSavedEvents = {
      		 event1: null,
           event2: null,
           event3: null,
           event4: null,
           event5: null
    };

  }//end function



/**
 * Add an event
 * @param {[type]} userData    [description]
 * @param {[type]} eventRecord [description]
 */
  function addEventRecord( eventRecord) {

    let slot = findNextSlot(userData);

    //construct data target name
    let slotName = "event" + slot;
    //push to global record set
    userSavedEvents[slotName] = eventRecord;

    console.log("added event to user data");
    console.log(userSavedEvents);

  }//end addEventRecord

/**
 * Find the next open slot or shift slots as needed
 * @param  {object} userData USers saved events
 * @return {number}       Index of slot to store data in
 */
function findNextSlot(userData) {

    let slot = 1; //1-5 per user event slots
    let slotOpen = false;  //is slot currently null

    let key = "event";

    //loop through slots until open found or all checked
    //slot numbers are 1-5
    for(let i = 1; i < 6; i++) {

      //record index
      slot = i;
      //accessor key
      let dataKey = key + i; //"event1", "event2", etc....
      if(userData[dataKey] === null) {
        slotOpen = true;
        break;
      }

    }//end for

    //slot will be open if empty,
    //otherwise we need to shift the slots
    if(!slotOpen) {
      shiftSlots(userData);
    }

    //return the slot index number
    return slot;

}

/**
 * Shift the records up - latest event goes on the end
 * Slot number 1 gets dumped (overwritten) and all others are shifted up
 * last slot is freed up
 * @return {undefined} NO return
 */
  function shiftSlots(userData) {

		 userData.event1 = userData.event2;
     userData.event2 = userData.event3;
     userData.event3 = userData.event4;
     userData.event4 = userData.event5;
     userData.event5 = null;  //empty last slot for next record

  }


  /**
   * Standard function to create the data for an event
   * @param  {string} eId  Event Bright event ID
   * @param  {string} eTitle    Event Bright Title
   * @param  {string} eUrl     Event URL
   * @param  {string} eLocalTime Event Bright time
   * @param  {string} ePrice    Event Bright price tag
   * @param  {string} eImage    Event Image URL
   * @return {object}     Event data object ot store win user events
   */
  function makeEventData (eId, eTitle, eUrl, eLocalTime, ePrice, eImage) {


  		 let eventData = {
          id: eId,
    			title: eTitle,
    			url: eUrl,
    			localtime: eLocalTime,
    			price: ePrice,
    			image: eImage,
  		};

      return eventData;

  }
