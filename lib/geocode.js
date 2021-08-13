const config = require("../config/googlemaps.json");

const key = config.key;

//polyfill if used on node
if(!fetch)
{
	var fetch = require("node-fetch");
}

const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&language=en-GB`

/*takes an adress string and passes a location object of the form
{
				formatted_address: data.results[0].formatted_address,
				coordinates: [location.lat,location.lng]
)			
to the callback*/
function addressStringToCoordinate(address,callback)
{
	//argument checking
	if(!address) throw "adresss not provided"
	if(typeof(address)!== "string") throw "address must be a string"
	if(!callback) throw "callback not provided";
	if(typeof(callback) !== "function") throw "callback not a funciton";
	//form query string
	let queryURL = apiURL + `&address=${encodeURIComponent(address)}`;
	//make query
	fetch(queryURL,{method:"GET"})
	.then(response => response.json())
	.then(data => {
		//make sure their is results
		if(data.results.length > 0)
		{
			let location = data.results[0].geometry.location; 
			callback({
				formatted_address: data.results[0].formatted_address,
				coordinates: [location.lat,location.lng]
			})
		}
		//if not send and error
		else{
			callback({error:"Address not found"})
		}
	})
	

}



/*takes coordinates in the form [lat,long] and returns an adress object
as per the google maps geocoding api object
https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding
*/
function coordinateToAdressObject(cords,callback)
{
	//argument checking
	if(!cords) throw "cordinates not provided";
	if(cords.length !== 2) throw "cordinates not in the form [long,lat]";
	if(typeof(cords[0]) !== "number" || typeof(cords[0]) !== "number")
		throw "cordinates must be a number";
	if(!callback) throw "callback not provided";
	if(typeof(callback) !== "function") throw "callback not a funciton";
	//form query url
	let queryURL = apiURL + `&latlng=${cords[0]},${cords[1]}`;
	fetch(queryURL,{method:"GET"})
	.then(response => response.json())
	.then(data => { 
		if(data.results.length > 0)
		{
			callback(data.results[0]);
		}
		else
		{
			callback({error:"error with geooding, no results provided from api",
					response: response})
		}
	});
		

}


if(typeof(module) !== "undefined"){//included so not to cause reference error if used on client side
	module.exports = {addressStringToCoordinate, coordinateToAdressObject};
}
//example to demonstrate how the functions work

/*
addressStringToCoordinate("10 downing street westminster",(address) => {

	console.log(
`cordinate object
====================
${JSON.stringify(address)}
address object
=====================
`)


	coordinateToAdressObject(address.coordinates, res => console.log(res));
	
})
*/