function ViewMembersComponet(element){
	let members = groups[selectedGroup].members;
	console.log(groups);
	let generateMembers = (array) => {
		let memberHTML = "";
		for(let i=0;i<array.length;i++){ 
			memberHTML += 
			`<li class = "user" id="user${i}"><a href="/sendmessage.html?user=${array[i]}" target="_blank" >${array[i]}</a></li>`;
		}
		return memberHTML; 
	} 
	element.innerHTML =  `
	<button id = "actions-back"> Back </button> 
	<div id = "memberList">
		<ul>
			${generateMembers(members)}
		</ul>
	</div>
	`;
	document.getElementById("actions-back")
	.addEventListener("click", ()=> GroupActionsComponent(element));
}

