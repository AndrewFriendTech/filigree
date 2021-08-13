function ThreadComponent(thread,count){
	return`
	<div class="Post" id = "thread${count}">
		<div class="postTitle">
			<h3>${thread.title}</h3>
		</div>
		<div class="postBody">
			<p>
				${thread.openingPost}
			</p>

		</div>
		<div class="postMeta">
			<div class="replies"><p>${replyString()}</p></div>
			<div class="OP"><p>${thread.postedBy}</p></div>
			<div class="timeCreated"><p>${dateString(thread.createdAt)}</p></div>
		</div>
	</div>
`
	//helper functions
	function replyString(){
		if(thread.messages.length == 0 ){
			return "No Replies";
		} else if (thread.messages.length == 1){
			return "1 Reply";
		} else{
			return thread.messages.length + " Replies";
		}
	}

	function threadOP(){
		if(threadOP.length <100){}
	}

	function dateString(timeString){
		//define weekdays based on getDay value
		var weekday=new Array(7);
		weekday[1]="Mon";
		weekday[2]="Tues";
		weekday[3]="Wed";
		weekday[4]="Thu";
		weekday[5]="Fri";
		weekday[6]="Sat";
		weekday[0]="Sun";
	
		//this for now is assuming all dates are in GMT
		let threadDate = new Date(timeString);
		let currentDate = new Date()
		//difference between the date in millisecconds
		let difference = currentDate - threadDate
		console.log(difference);
		console.log((60*60*1000));
		//within last minute
		if(difference < (60*1000)){
			return "less than a min ago";
		}
		//less than an hour ago
		else if(difference < (60*60*1000)){
			return Math.floor(difference/1000/60) + " mins ago"
		}
		//in the same day
		else if(threadDate.getDate() == currentDate.getDate()){
			let hours = threadDate.getHours();
			let minutes = threadDate.getMinutes()
			if (hours < 10) hours = "0" + hours;
			if (minutes < 10) minutes = "0" + minutes;    
			return  hours + ":" + minutes; 
		}
		//in the same week
		else if((currentDate.getDate() - threadDate.getDate())<7){
			return weekday[threadDate.getDay()] + " " +threadDate.getHours() 
				+ ":" + threadDate.getMinutes();
		} else {
			return `${threadDate.getDate()}/${threadDate.getMonth()}/${threadDate.getFullYear()%100}`
		}
	
	
	}

}
