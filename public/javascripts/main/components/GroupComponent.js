//takes in a individual item and returns completed html
function GroupComponent(obj,count){

return`
<div id="group${count}" class="groups">
		<div class="image">
			<img class="group-profile" src="${obj.pictureURL}" alt="${obj.name}">
		</div>
		<div class="text">
			<h3>${obj.name}</h3>
		</div>
</div>`
}