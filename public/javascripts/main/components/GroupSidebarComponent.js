function GroupSidebarComponent(groups,element){
	let component = " ";
	//generate the html for each element and add it to the component
	for(let i = 0; i < groups.length; i++){
		component += GroupComponent(groups[i],i)
	}
	//add the elements to the page
	element.innerHTML = component;

	//calback for other tasks to do when changed
	//let caller set callback for when group is changes
	this.onChanged = function(callback){onChangedcallback = callback;}

	//user callback
	let onChangedcallback = function(){console.log("callback not yet set")};

	function onClicked(selectedIndex){
		//set selected object background colour to darkGrey
		groupElements[selectedIndex].style.backgroundColor = "DarkGrey";
		//then return to defualt elements that are not the selected one
		for(let i = 0; i < groupElements.length;i++){
			if(i !== selectedIndex ){
				groupElements[i].style.backgroundColor = null;
			}
		}
		selectedGroup = selectedIndex;
		console.log("changed"+selectedGroup);
		onChangedcallback(selectedIndex);

	} 

	/////add an event listner to every group;

	//first get array of elements of class group
	let groupElements = document.getElementsByClassName("groups");

	console.log(groupElements);

	//then loop through and class listners
	for(let i = 0; i < groupElements.length;i++){
		console.log("looped");
		groupElements[i].addEventListener("click",()=> onClicked(i));
	}

	//document.getElementById("group0").addEventListener("")
	

	
}