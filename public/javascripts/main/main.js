window.onload = loadPage;

function loadPage(){
	//get user credentials
	window.credentials = JSON.parse(localStorage.getItem("credentials"));
    window.token = credentials.token;
	window.selectedGroup = 0;

	//stores the user profile object
	window.userProfile = null;
	//stores the array of groups the user belongs to 
	window.groups = null;
	/*stores an array of arrays of the threads that belong to each group
	 threads[0] is all the threads in the 1st group of the group object and so on*/
	var threads = new Array();

	console.log(credentials);
	console.log(token);

	//get the profile information which is needed for the profile and groups sidebar
	getObjWithToken("/api/user/current/profile",token,(result)=>{
		if(result){
			console.log(result);
			window.userProfile = result;
			//set user details
			document.getElementById("username").innerHTML = result.username;
			document.getElementById("fullname").innerHTML = result.fullname;
			document.getElementById("date").innerHTML = (new Date(result.createdAt)).toDateString();
			//if user has a profile picture replace the default with it
			if(result.pictureURL)
				document.getElementById("profilePicture").src = result.pictureURL;
			//load group section
			loadGroups();
			//load groupAction component
			const groupActionElement = document.getElementById("groupActions") 
			GroupActionsComponent(groupActionElement);
		}
	})

	//event listener for when Private message button is pressed
	document.getElementById("pm-button").addEventListener("click", e=>{
		getMessages();
	})
	//set a timer to poll if a new message has been sent every 10 secconds
	setInterval(pollMessages,10000);
		 		
}

function loadGroups(){
	//load the group sidebar section
	getObjWithToken("/api/user/current/groups",token, (result) => {
		//store groups result
		groups = result;
		const sidebarElement = document.getElementById("groupSideBar");
		const sidebar = new GroupSidebarComponent(result,sidebarElement);
		//when sidebar changes, load threads from the group
		sidebar.onChanged(loadThreads);
		//first load the threads for the defealt group 0th;
		loadThreads(0)
	});

}

function getMessages(){
	console.log("get messages button pressed")
	window.location.href = "privatemessages.html"
}

function pollMessages(){
	let element = document.getElementById("pm-status");
	getObjWithToken("/api/user/current/newMessages",token, (result)=>{
		if(result === true){
			if(element.innerHTML !="You have new messages!" )
			{
				notifySound();
				element.innerHTML = "You have new messages!";
			}
			
		}else if(result === false){
			element.innerHTML = "You have no new messages";
		}else{
			console.error(result);
		}
	})
}

function loadThreads(groupIndex){
	console.log("about to load: " + groupIndex)	
	getObjWithToken(`/api/groups/${groups[groupIndex]._id}/threads`,token,(result)=>{
		ThreadContainerComponent(result,
			groups[groupIndex].name,
			document.getElementById("mainBody"))
	})
}
