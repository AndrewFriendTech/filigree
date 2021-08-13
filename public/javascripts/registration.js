//https://developers.google.com/maps/documentation/javascript/places-autocomplete
//everything must happen after google autocomplete has loaded 
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

	/****
	 * Everything else 
	 */
	var email = document.getElementById("email");
	
	//global vairiable for the uploaded file url, by default null but will have file in it if uploaded
	var uploadURL = null;

	//form the upload section is in 
	const myForm = document.getElementById('uploadForm');
	//form of the actual section
	const fileInput = document.getElementById('fileInput');
	//eventListner for upload pfp form submit form
	myForm.addEventListener("submit", e=>{
		//stoped the default behaviour which is to load a new page
		e.preventDefault();
		//post the file selected to the server
		postFile("/api/upload",fileInput, 
			response => {
				//simmply logged the returned filenames to the server
				console.log(response)
				if(response.length) 
					document.getElementById("uploadForm")
						.insertAdjacentHTML("beforeend",
						`<div id = "uploaded">File Uploaded!</div>`);
					uploadURL = response[0];
			});
	})

	
	document.getElementById("submit").onclick = function(){
		//first get all the elements
		var username = document.getElementById("username");
		var fullname = document.getElementById("fullname");
		var email = document.getElementById("email");
		var password = document.getElementById("password");
		var repeatPassword = document.getElementById("repeatPassword");
		var uploadForm = document.getElementById("uploadForm");
		//get location
		var place = autocomplete.getPlace();
		
		//clear existing errors
		errors = document.getElementsByClassName("error");
		console.log(errors)
		//work backwards through array or will not work
		//see https://stackoverflow.com/a/28316365/
		for(var i = errors.length -1 ; i >= 0;i--){
			errors[i].remove();
		}

		//boolean to see if form is currently valid
		var isValid = true;
		//function to generate error message after element not valud
		function invalid(element,msg){
			element.insertAdjacentHTML("afterend",
			'<div class="error">'+msg+'</div>')
			isValid = false;
		}
		
		//verify all the fields, if all are satisfactory, goto final else
		if(!username.value){
			invalid(username,"Please enter a username!");
		}
		if(!fullname.value){
			invalid(fullname,"Please enter your fullname!");
		}
		if (!email.value){
			invalid(email,"Please enter your email!");
		}
		if (!password.value){
			invalid(password,"Please enter a password!");
		}
		console.log(password.value , repeatPassword.value);
		if(password.value !== repeatPassword.value){
			invalid(repeatPassword,"Passwords must match!");
		} 
		if(typeof(place) === "undefined"){
			invalid(input,"Please enter your address!");
		}
		if(uploadURL == null){
			invalid(uploadForm,"Please upload a profile picture and press submit!");
		}

		if(isValid){
			//create object to send
			var userObject ={
				username: username.value,
				password: password.value,
				fullname: fullname.value,
				email: email.value,
				location:{
					type: "Point",
					coordinates: [
						place.geometry.location.lng(),
						place.geometry.location.lat()
					]

				},
				pictureURL: uploadURL

			}
			console.log(userObject);
			//send to server
			postObj("api/user", userObject, (response)=>{
				console.log(response);
				if(response.success){
					//code to execute when succsessful
					//first login with the sent credentials
					postObj("api/login",{username:username.value, 
						password: password.value}, (response)=>{
							if(response.token){
								//store credentials into local storage
								localStorage.setItem('credentials',
									JSON.stringify(response));
								//redirect to the chooseGroups page
								window.location.href = "/choosegroups.html";
							}
						})
				} else {
					//code for when not succsesfull
					if(response.error == "user already exists"){
						invalid(username,
						"User with this username already exists, please try another!");
					}
				}
			})
		}

	}


}


