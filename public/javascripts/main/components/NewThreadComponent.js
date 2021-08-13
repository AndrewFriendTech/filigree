function NewThreadComponent(element,prevArguments){
	let component = `
	<button id = "backButton">Back</button>
	<div id = "new-thread-form">
		<label for="thread-title">Title:</label>
		<input type="text" id="thread-title" name = "thread-title" >
		<br>
		<label for="thread-body">Body</label>
		<textarea id="thread-body" name="thread-body"></textarea>
		<button id="submit-thread">Submit</button>
	</div>
	`
	element.innerHTML = component; 

	//event listner for the back button
	document.getElementById("backButton").addEventListener("click",back);

	//event listner for submit button
	document.getElementById("submit-thread").addEventListener("click",()=>{
		console.log(selectedGroup);
		let url = "/api/groups/" + groups[selectedGroup]._id + "/threads";
		console.log(url);
		let obj = {title: document.getElementById("thread-title").value,
				openingPost: document.getElementById("thread-body").value
		}

		if(!obj.openingPost || !obj.title){
			document.getElementById("submit-thread").insertAdjacentHTML("afterend",
				`<div id = "error"> Post must have a title and a body</div>`);
			return;

		}
		
		postObjWithToken(url,obj,token,(result)=>{
			console.log(result);
			back();
		});
	})

	function back(){
		//calls the function with the array passed as it it was each argument 
		loadThreads(selectedGroup);
	}
}