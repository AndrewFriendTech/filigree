function MessageComponent(message,count){
	console.log(message);
	
	let messageHTML;
	if(message.fileURL){
		messageHTML  = `
		<div id = "message${count}" class = "message ${isByMe()}">
			<div class = "message-body">
				<a href= "${message.fileURL}" download="${message.body}">
					<div class = "file-title">${message.body}</div>
					<img src = "/images/file.svg" height = "40">
				</a>
		    </div>
			<span class = "messagePostedBy">${message.postedBy}</span>
			<span class = "messageDate">${dateString(message.createdAt)}</span>
		</div>`

	} else{
		messageHTML  = `
		<div id = "message${count}" class = "message ${isByMe()}">
			<div class = "message-body">
				${message.body}
		    </div>
			<span class = "messagePostedBy">${message.postedBy}</span>
			<span class = "messageDate">${dateString(message.createdAt)}</span>
		</div>

		`
	}

	return messageHTML;

	//helper functions
	function isByMe(){
		if(message.postedBy == window.userProfile.username)
			return "byMe"
		else
			return "byOther"
	}

}