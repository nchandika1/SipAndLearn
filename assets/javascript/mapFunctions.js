

/*****************************************************

            Map Releated Functions



 *****************************************************/



/**
 * Callback function for google maps
 * @return {undefined} No Return
 */
  function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.2961, lng: -122.2827},
      zoom: 8
    });
    //init our data regions after init
    initMapRegions(map);

  }


/**
 * Common Display Values for map region
 * Change here to affect all map region display styles
 * @type {Object}
 */
var mapDisplayTemplate = {
         strokeColor: '#000000',
         strokeOpacity: 0.8,
         strokeWeight: 1,
         fillColor: '#f1f285',
         fillOpacity: 0.45
}


/**
 * Intialize all the map regions
 * @param  {object} map Google map instance
 * @return {[type]}     [description]
 */
function initMapRegions(map) {

  console.log("Intializing regions...");

  buildMapRegion('Alameda', rawDataAlameda, map);
  buildMapRegion('Imperial', rawDataImperial, map);
  buildMapRegion('Lake', rawDataLake, map);
  buildMapRegion('Marin', rawDataMarin, map);
  buildMapRegion('Mendocino', rawDataMendocino, map);
  buildMapRegion('Monterey', rawDataMonterey, map);
  buildMapRegion('Napa', rawDataNapa, map);
  buildMapRegion('Riverside', rawDataRiverside, map);
  buildMapRegion('San Diego', rawDataSanDiego, map);
  buildMapRegion('San Luis Obispo', rawDataSanLuisObispo, map);
  buildMapRegion('Santa Clara', rawDataSantaClara, map);
  buildMapRegion('Santa Cruz', rawDataSantaCruz, map);
  buildMapRegion('Sierra', rawDataSierra, map);
  buildMapRegion('Sonoma', rawDataSonoma, map);


}//end initMapRegions

/**
 * BUild a map region from the raw data and style template (internal to function)
 * @param  {string} region Region name (no spaces - used for object index)
 * @param  {array} data   Raw long/lat values
 * @param  {object} map  Google map instance
 * @return {undefined}  No Return
 */
function buildMapRegion(region, data, map) {

  //add 'County' suffix to county name
  let regionName = region;
  //remove strings for name for region key
  let regionKey = region.replace(/\s/g, '');

  let coords = buildPolygon(data);

  counties[regionKey] = new google.maps.Polygon({

       paths: coords,
       strokeColor: mapDisplayTemplate.strokeColor,
       strokeOpacity: mapDisplayTemplate.strokeOpacity,
       strokeWeight: mapDisplayTemplate.strokeWeight,
       fillColor: mapDisplayTemplate.fillColor,
       fillOpacity: mapDisplayTemplate.fillOpacity,
       countyName: regionName

  });

  //set the map instance for the region
  counties[regionKey].setMap(map);

  //add handler
  // google.maps.event.addListener(counties[regionKey], 'click', function (event) {
  //     console.log("County Clicked: ");
  //     console.log( this.countyName);
  // });

    google.maps.event.addListener(counties[regionKey], 'click', countyClicked);

}//end build mapa region



/**
 * Build polygon from raw data
 * @param  {array} data raw lat/lng data set
 * @return {array}  Array of lat/lng pairs for map
 */
function buildPolygon( data) {

  let dlen = data.length;

  let dataArray = [];

  for(let i = 0; i < dlen; i+=2) {

    let lngc = data[i];
    let latc = data[i+1];

     let coord = {
       lat: latc,
       lng: lngc
     };

    dataArray.push(coord);

  }//end for

  //return the array
  return dataArray;

}

/**
 * Handler for clicking on a map region
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function countyClicked(event) {

  let id = this.countyName;
  /* coordinate with Naga on final implementation */
  displayWineEvents(id);
  displayWineInformation(id);

}

//TODO remove these functions when they are implemented by Naga
/*  dummy functions for displaying the information from a map click */
// function displayWineEvents(county) {
//   console.log("Display Wine Events for: " + county);
// }

/*  dummy functions for displaying the information from a map click */
// function displayWineInformation(county) {
//   console.log("Display Wine Information for: " + county);
// }
