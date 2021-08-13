//get token from local storage
let credentials = JSON.parse(localStorage.getItem("credentials"));
let token = credentials.token;


//when autocomplete is loaded , you can start the rest of the script

window.onload = function(){
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

    //get groupData from server
    loadGroupData();

    let selectedGroupID;

    function loadGroupData(){
        getObjWithToken("/api/user/current/groups",token, result =>{
            
            let selector =document.getElementById("selection");

            //fill the selecton list
            selector.innerHTML=
            result.map((group) => `<option value="${group._id}">${group.name}</option>`)
                    .join("\n");
            selectedGroupID=selector.value;
            //set event listner for it changing
            for(i in result){
                selector.addEventListener("change",()=>selectedGroupID=selector.value);
            }
            console.log(result)
            addSubmitEventListner(result);
            loadMeetups(result); 
        })

    }

    function addSubmitEventListner(groups){
        //set event listner for sumbit
        document.getElementById("submit").addEventListener("click",()=>{
            //clear any error messages that might be up
            clearErrors()
            //get all the input nodes
            let location = autocomplete.getPlace();
            let date = document.getElementById("ourdate");
            let time = document.getElementById("ourtime");
            
            //now validate the fields before sending it to the server
            let valid = true
            let errors = []
            if(!location){
                errors.push("location");
                valid = false;
            } 
            if((new Date(date.value))=="Invalid Date"){
                errors.push("date");
                valid = false;
            } 

            //regex for valid times
            if(!time.value.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)){
                errors.push("time")
                valid = false;
            }

            //if not valid, tell the user
            if(!valid){
                errorMsg(`Please enter a valid ${connectiveList(errors)}!`);
            } else { //otherwise sumbmit to the server
                
                let group = selectedGroupID // replace hard coded placeholder with user input later
                console.log({group,groups,selectedGroupID})

                let object = {
                    location:{
                        type: "Point",
                        coordinates: [
                            location.geometry.location.lng(),
                            location.geometry.location.lat()
                        ]

                    },
                    date: new Date(date.value + " " + time.value)
                }
                postObjWithToken(`/api/groups/${group}/meetups`,
                object,token, result =>{
                    //refresh the page
                    window.location.reload();
                })
            } 


        })
    }

    async function loadMeetups(groups){
        
        let meetups = []
        let meetupString = "";
        for(group of groups){
            for(meetup of group.meetups){
                let addressObject = await coordsToAddress(meetup.location.coordinates);
                let addressString = wantedAddress(addressObject);
                meetupString +=
                `<tr>
                    <td>${group.name}</td>
                    <td>${addressString}</td>
                    <td>${(new Date(meetup.date)).toDateString()}</td>
                    </tr>`
            }
        }
        
        
        document.getElementById("table-body").innerHTML = meetupString;

        // meetups.map(async(meetup) => 
        //     `<tr>
        //     <td>${meetup.parentGroup}</td>
        //     <td>${await wantedAddress(await coordsToAddress(meetup.location.coordinates))}</td>
        //     <td>${(new Date(meetup.date)).toDateString()}</td>
        //     </tr>`
        //     ).join("\n") 
        

        async function coordsToAddress(coords){
            const key = "AIzaSyDnA_I-YpIzQygrq7bXWHne_P6eUOtiXso";
            const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&language=en-GB`
            let queryURL = apiURL + `&latlng=${coords[1]},${coords[0]}`;

            let response = await fetch(queryURL);
            let json = await response.json();
            return json;

        }
        
        //extracts the string needed from the address object
        function wantedAddress(object){
            //this returns the whole addres as a string from the google maps API location object
            return object.results[0].formatted_address;
        }
        
    }

    //clear any errors already their
    function clearErrors(){
        let msg = document.getElementById("error");
        if(msg) msg.remove();   
    }

    //sets error message if user hasnt entered form correct
    function errorMsg(text){
        document.getElementById("meetup-form")
            .insertAdjacentHTML("beforeend",
            `<div id = "error"> Error: ${text}!</div>`);
    }

}

