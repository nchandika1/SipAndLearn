# SipAndLearn
This application provides interesting information about the geography California wine regions along with local wine events.  

## Overview

The application uses a map interface to allow users to explore the different wine producing regions in California.  
When a region is selected on the map, general information about the region is displayed along with local wine-related events.
The application supports a user-authenticated version and a non-authenticated version.  In both versions, the last five events the user
 viewed are displayed on the page.  Authenticated users have their views stored in a Firebase database, and those records are associated with the user.  The non-authenticated version creates temporary records in a Firebase DB that are still displayed on the page, but are lost when the user leaves the page.



## Built with

#### Google Maps API

[Google Maps](https://developers.google.com/maps/ "Google Maps")  

Google Maps API was used to display the county regions that users can click on to load regional information and local events.

#### Wikipedia API

[Wikipedia](https://www.mediawiki.org/wiki/API:Main_page "Wikipedia")  

Wikipedia was used to gather information about the selected region.

#### Eventbrite API

[Eventbrite](https://www.eventbrite.com/developer/v3/ "Eventbrite")  

Eventbrite's API was used to locate local wine-related events.

#### Firebase

[Firebase](https://firebase.google.com/ "Firebase")  

Firebase was used in both the Authenticated user mode and non-authenticated mode to store and retrive recently viewed events.





## Contributors

[Nagarani Chandika](https://github.com/nchandika1)  

Eventbrite & Wikipedia API integration.

[Tom Copple](https://github.com/studiotc)  

Google Maps API & Firebase Integration

[Chamaine Woffard](https://github.com/Chamaine)  

Front End Design
