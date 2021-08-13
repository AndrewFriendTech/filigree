window.onload = function(){
	let credentials = JSON.parse(localStorage.getItem("credentials"));
	window.token = credentials.token;
	console.log(token);
	//first get the current users profile
	getObjWithToken("/api/user/current/profile",token,(result)=>{
		window.currentUser = result;
		populateGroups()
	})

	function populateGroups(){
		let groupHTML = "";
		getObjWithToken("/api/groups/",token, groups => {
			for(let i = 0; i < groups.length; i++){
				groupHTML += AddGroupComponent(groups[i],i);
			}
			document.getElementById("group-container").innerHTML = groupHTML;
			addEventListners(groups);
		});
	}

	function addEventListners(groups){
		for(let i = 0; i < groups.length; i++){
			document.getElementById("group-button"+i)
			.addEventListener("click",()=>{
				let url = "/api/user/current/groups/" + groups[i]._id;
				postObjWithToken(url,{},token,(result)=> {
					if(result.success){
						document.getElementById("group"+i).remove();			
					}
				});
			})
		}

	}

	//add an event listner for the next button
	document.getElementById("next-button").addEventListener("click",()=> window.location.href = "main.html")

}