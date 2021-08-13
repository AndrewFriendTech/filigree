function MessageContainerComponent(messages,element,parentThreads,parentIndex,parentTitle){
	console.log(messages);
	let messagesHTML = "";
	for(let i = 0; i < messages.length; i++){
		messagesHTML += MessageComponent(messages[i],i);
	}
	let container = `
		<div id ="backButton">Back</div>
		<div id = "messages">
			${messagesHTML}
		</div>
		<! -- post message box here --> 
		<div id = "sendBox">
			<textarea id="messageBody" name="messageBody"></textarea>
			<button type="button" id = "sendMessage">send</button>
			<!-- image that will trigger the actual event --> 
			<img src="images/attachment.svg" id="fileUploadButton" height="25">
			<!-- hidden file upload that will get triggred by image click-->
			<input type="file" id="fileUploadSelector" style="display:none"/>
		</div>
	`
	element.innerHTML = container

	//go back to displaying threads when back button is pressed
	document.getElementById("backButton")
	.addEventListener("click",
	() => ThreadContainerComponent(parentThreads,parentTitle,element));
	
	let textarea = document.getElementById("messageBody");

	//fileURL if uploaded
	let fileURL = null;
	document.getElementById("fileUploadButton").addEventListener("click",()=>{
		console.log("clicked");
		let form = new FormData;
		let fileSelector = document.getElementById("fileUploadSelector");
		fileSelector.style.display = "inline"
		//once file is selected , upload file and hide file uploader
		fileSelector.onchange =function(){
			console.log("changed");
			let file = fileSelector.files[0];
			form.append("avatar",file);	
			fetch("/api/upload",{method:"POST",body:form})
			.then(response=>response.json())
			.then(response=>{
				console.log(response);
				fileURL = response[0];
				fileSelector.style.display = "none";
				//then send message to server
				let body = {body:`${file.name}`,fileURL};
				let url = "/api/thread/" + parentThreads[parentIndex]._id + "/messages"
				postObjWithToken(url, body ,token,(result)=>{
					if(result.success){
						refreshMessages();
					}else{
						//tell the user their has been an error
						alert(JSON.stringify(result));
					}
				})

			})
		};
		
	});




	//event listner to send a message
	document.getElementById("sendMessage")
	.addEventListener("click", ()=>{
		let body = {body:textarea.value};
		let url = "/api/thread/" + parentThreads[parentIndex]._id + "/messages"
		postObjWithToken(url, body ,token,(result)=>{
			if(result.success){
				refreshMessages();
			}else{
				//tell the user their has been an error
				alert(JSON.stringify(result));
			}
		})
	})



	//refresh the messages every 10 secconds
	setInterval(refreshMessages,10000)

	let prevLength = messages.length


	function refreshMessages(){
		console.log(prevLength)
		//fetch the latest messages for the thread
		let url = "/api/thread/" + parentThreads[parentIndex]._id + "/messages"
		getObjWithToken(url,token,(results)=>{
			if(results.length > prevLength){
				for(let i = prevLength; i < results.length;i++){
					document.getElementById("messages").innerHTML += MessageComponent(results[i]); 
				}
			//scrolls messages section to bottom, only if new messages
			var objDiv = document.getElementById("messages");
			objDiv.scrollTop = objDiv.scrollHeight;
			
			}
			prevLength = results.length;
		})
	}

	//scrolls messages section to bottom on start up
	var objDiv = document.getElementById("messages");
	objDiv.scrollTop = objDiv.scrollHeight;
}