window.onload = () => {
	//put the token in global scope so it can be accsessed from other functions
	window.token = JSON.parse(localStorage.getItem("credentials")).token;
	//messages in the function scope
	let messages;

	getObjWithToken("/api/user/current/messages",token,(result)=>{
		if(result.length){
			messages = result;
			let element = document.getElementById("message-container") 
			element.innerHTML = generateMessages();
			//set reply event listners
			for(let i = 0; i <result.length;i++)
			{
				document.getElementById("message-reply"+i).addEventListener(
					"click",()=>replyClicked(i));
				
			}
		}
		else{
			console.error(result);
		}		
	})
	
	
	
	function generateMessages(){
		console.log(messages);
		let html = "";
		for (let i = messages.length-1; i >= 0; i--){
			html += 
			`<div class ="message" id ="message${i}">
				<div class = "message-details">
					<div class = "message-detail">
						<label for="message-title">Title:</label>
						<span class="message-title">${messages[i].title}</span>
					</div>
					
					<div class = "message-detail">
						<label for="message-sender">From:</label>
						<span class="message-sender">${messages[i].postedBy}</span>
					</div>

					<div class = "message-detail">
						<label for="message-time">Time:</label>
						<span class="message-time">${dateString(messages[i].createdAt)}</span>
					</div>				
				</div>
	
	
				<div id = "message-body">${messages[i].body}</div>
				<button id = "message-reply${i}" class="message-reply"> Reply </button>
				
				<div class = "message-reply-container" id = "message-reply-container${i}"
					style = "display:none">
					<textarea id = "message-textarea${i}" class="message-textarea"></textarea>
					<br>
					<button id="message-submit${i}" class="message-submit">Submit</button>
					<button id="message-back${i}" class="message-back">Back</button>
				</div>
			</div>
			`
		}
		return html;
	}

	function replyClicked(i){
		//when reply button is pressed , show the textarea and hide the reply button 
		let replyContainer = document.getElementById("message-reply-container"+i);
		let replyButton = document.getElementById("message-reply"+i);
		replyContainer.style.display = "block";
		replyButton.style.display = "none";
		//when the back button is pressed, hide the textarea and show the reply button
		let backButton = document.getElementById("message-back"+i);
		backButton.addEventListener("click",()=>{
			replyContainer.style.display = "none";
			replyButton.style.display = "block";
		})
		//set event listner for reply button
		let submitButton = document.getElementById("message-submit"+i);
		submitButton.addEventListener("click", ()=>submitClicked(i));	
		
	}
	
	function submitClicked(i){
		let textarea = document.getElementById("message-textarea"+i);
		let url = `/api/user/${messages[i].postedBy}/messages`
		let message = {
			title: "Re: " + messages[i].title,
			body: textarea.value
		}
		postObjWithToken(url,message,token,result=>{
			console.log(result);
		})
	}
}



