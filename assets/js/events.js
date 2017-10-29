var wine_counties = {"Napa County" : ["Napa_Valley_AVA","Napa County, CA"],
					"Lake County" : ["Lake_County,_California", "Lake County, CA"],
					"Sonoma County" : ["Sonoma_County,_California", "Sonoma County, CA"],
					"Alameda County" : ["Livermore_Valley_AVA", "Alameda County, CA"],
					"Mendocino County": ["Mendocino_County_wine", "Mendocino County, CA"],
					"Riverside County" : ["Temecula_Valley_AVA", "Reiverside County, CA"],
					"San Diego County" : ["San_Pasqual_Valley_AVA", "San Diego County, CA"],
					"Santa Cruz County" : ["Santa_Cruz_Mountains_AVA", "Santa Cruz County, CA"],
					"Santa Clara" : ["Santa_Clara_Valley_AVA", "Santa Clara County, CA"],
					"San Luis Obispo" : ["San_Luis_Obispo_County,_California", "San Luis Obispo County, CA"],
					"Marin" : ["Marin_County,_California", "Marin County, CA"],
					"Sierra" : ["Sierra_County,_California", "Napa County, CA"],
					"Montery, Monterey_AVA" : ["Monterey_County,_California", "Monterey County, CA"],
					"Imperial County" : ["Imperial_Valley", "Imperial, CA"] 
					}

const TOTAL_EVENTS = 5;

// Utility function to convert a string to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Function gets the venue address "string" given "venue_id"
// The Event search AJAX API returns venue id and not the actual venue string
// So need to use another AJAX API to convert venue id to venue string
// The following API hits successfully:
// https://www.eventbriteapi.com/v3/venues/16558529/?token=FK5YOEZMVRLVD72TNYPA
// So the following based on this AJAX format
function getVenueNameFromId(venueId) {
	$.ajax({
		url : "https://www.eventbriteapi.com/v3/venues/" + venueId + "/?token=FK5YOEZMVRLVD72TNYPA",
		crossDomain: true,
		method: 'GET'
	}).done(function(response){
		var venue = response.address.localized_address_display;
		console.log(venue);
		// Need to add to the html element here itself as it is an asynchronous call
	});
}

// Function gets the main event object given a title using the following broad url
// https://www.eventbriteapi.com/v3/events/search/?q=wine&token=RLHFJYWEADE5U2C3R7RP&ocation.address=
// Display wine related events based on EventBrite APIs
// Note that it returns venue, cateogry as Ids.  Need a separate AJAX call to convert those Ids to strings.
function displayWineEvents(county) {
	var searchStr = wine_counties[county][1];
	console.log(searchStr);
	$.ajax({
   		url: 'https://www.eventbriteapi.com/v3/events/search/?q=wine&token=RLHFJYWEADE5U2C3R7RP',
		data: {sort_by: 'best', 'location.address': searchStr, page: 1, 'start_date.keyword': "next_month"},
		crossDomain: true,
		method: 'GET'
	}).done(function(response) {

	   	var totalEventsToDisplay = TOTAL_EVENTS;
	   	if (response.events.length) {
		   	var events = response.events;
		} else {
			var events = response.top_match_events;
		}
	   	console.log(events);

	  	if (events.length < TOTAL_EVENTS) {
	    	totalEventsToDisplay = events.length;
	    }

	   	for (var i=0; i<totalEventsToDisplay; i++) {

	   		console.log(events[i]);
	      	var title = toTitleCase(events[i].name.html.trim());
	      	console.log(title);
	      	var localTime = events[i].start.local;
	      	var url = events[i].url;
	      	var venue = events[i].venue_id;
	      	if (events[i].logo) {
	      		var image = events[i].logo.url;
	      	} else {
	      		var image = "";
	      	}
	      	if (events[i].is_free) {
	        	var price = "Free";
	      	} else {
	         	var price = "$$";
	      	}
	      	// Hook up HTML code here
    		// Remove the following code once the correct HTML is in place
    		/*
	      	var venueStr = getVenueNameFromId(venue);
	      	console.log(venueStr);

	      	var aTag = $("<a>");
	      	aTag.attr("href", url);
	      	aTag.attr("target", "_blank");
	      	aTag.html("<strong>"+title+"</strong");

	      	var imgTag = $("<img>");
	      	imgTag.attr("src", image);

	      	var wineDiv = $("#wine-data");
	      	wineDiv.append(aTag);
	      	wineDiv.append("<p><strong>" + moment(localTime).format('LLL') + "</strong></p>");
	      	wineDiv.append("<p><strong>" + venueStr + "</strong></p>")
	      	wineDiv.append(imgTag);
	      	wineDiv.append("<br><br>");
	      	*/
	   	}
	});
}

// Function to use Wiki AJAX APIs that returns the county information
// Display wine region information based on Wiki APIs
function displayWineInformation(county) {
	var searchStr = wine_counties[county][0];
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=" + searchStr,
        data: {exchars: 500},
        dataType: "jsonp",
        method: "GET"
    }).done(function(response) {
    	console.log(response);
    	$.each(response.query.pages, function(i, item) {
    		// Hook up HTML code here
    		// Remove the following code once the correct HTML is in place
    		/*
            var wineDiv = $("#wine-data");
            wineDiv.append($("<h4>").text(item.title));
    		wineDiv.append(item.extract);
    		*/
        });
    });
}