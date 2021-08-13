function initMap(){

	/****
		 * Google autocomplete widget
		 */
		//center of the address search , set to goldsmiths university london
		const center = { lat: 51.4743, lng: -0.0354 };
		//html tag for autocomplete box
		const input = document.getElementById("locationInput");
		//options for the autocomplete widget
		const options = {
			//restrict results to Great Britain
			componentRestrictions: { country: "gb" },
			//fields to return
			fields: ["address_components", "geometry",],
			origin: center,
			//still show results outside the bounds
			strictBounds: false,
		};
		var autocomplete = new google.maps.places.Autocomplete(input, options);
	}