function GroupActionsComponent(element){
	let elementHTML = ` 

	<div class="header">
		<h2>Group Actions</h2>
	</div>

	<div class="action" id = "viewMembers">
		<button class="btn" id="btn-viewMembers">View Members</button>
	</div>

	<div class="action" id = "fileSharing">
		<button class="btn" id="btn-fileSharing">Media and Files</button>
	</div>

	<div class="action id ="meetUp" >
		<button class="btn" id="btn-meetUp">Meet Up</button>
	</div>

	<div class="action id = "leave">
		<button class="btn" id="btn-leave">Leave Group</button>
	</div>`;
	element.innerHTML = elementHTML;
	
	//view member list event listner
	document.getElementById("btn-viewMembers").addEventListener("click", (e)=>{
		ViewMembersComponet(element);
	});

	//view files list event listner
	document.getElementById("btn-fileSharing").addEventListener("click", (e)=>{
		ViewFilesComponent(element);
	})


	//meetUp event listner
	document.getElementById("btn-meetUp").addEventListener("click", (e)=>{
		window.location.href = "/meetup.html";
	})

	
	//leave list event listner
	document.getElementById("btn-leave").addEventListener("click", (e)=>{
		if(confirm("Are you sure you want to leave the group?")){
			deleteObjWithToken(`/api/user/current/groups/${groups[selectedGroup]._id}`,token,()=>{
				console.log("left group");
			})
		}
		loadPage();
	})

}
