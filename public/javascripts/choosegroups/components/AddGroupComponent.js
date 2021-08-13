function AddGroupComponent(group,count){
	let component = `
	<div class = "group" id = "group${count}">
		<img class = "group-img" src="${group.pictureURL}">
		<div class = "group-details">	
			<div class = "group-data group-name">${group.name}</div>
			<div class = "group-data group-description">${group.description}</div>
			<div class = "group-data group-distance">Distance: ${calculateDistance()}</div>
		</div>
		<button type="button" class ="button" id = "group-button${count}">Add</button>
	</div>
	`

	return component;

	function calculateDistance(){
		let groupLocation = turf.point(group.location.coordinates);
		let userLocation = turf.point(currentUser.location.coordinates);
		return turf.distance(groupLocation,userLocation).toFixed(2) + "KM";
	}
}