function ThreadContainerComponent(threads,title,element){
	let threadHTML = "";
	for(let i = 0; i<threads.length;i++){
		threadHTML += ThreadComponent(threads[i],i);
	}
	let container = `
	    <div class="bodyTitle">${title}</div>
		<button class = "threads-action" id = "threads-refresh">Refresh threads</button>
		<button class = "threads-action" id = "threads-post">Post new thread</button>
		${threadHTML}

	`;

	element.innerHTML = container;

	//get all the thread elements into an array 
	let threadElements = document.getElementsByClassName("Post");

	//add to each thread element an event listner that opens the messages
	for(let i = 0; i < threadElements.length; i++){
		threadElements[i].addEventListener("click",
			()=>{
					//fetch the latest messages for the thread
					let url = "/api/thread/" + threads[i]._id + "/messages"
					getObjWithToken(url,token,(result)=>{
						if(result){
							MessageContainerComponent(result,element,threads,i,title)
						}
					})
			});
	}

	//event listner for refreshing threads
	document.getElementById("threads-refresh").addEventListener("click",()=>{
		//just call own function again
		ThreadContainerComponent(threads,title,element);
	})

	//event listner for creating a new thread
	document.getElementById("threads-post").addEventListener("click",()=>{
		NewThreadComponent(element,arguments);		
	})

}