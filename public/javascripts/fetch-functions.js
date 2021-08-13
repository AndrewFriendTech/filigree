function postObj(url, object, callback)
{
	let options ={
		method:"POST",
		headers:{
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(object)
	}
	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}

function postObjWithToken(url, object,token,callback)
{
	let options ={
		method:"POST",
		headers:{
			'Content-Type' : 'application/json',
			'Authorization': 'Bearer ' + token 
		},
		body: JSON.stringify(object)
	}


	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}

function getObj(url,callback)
{
	let options ={
		method:"GET"
	};
	
	fetch(url,options)
	.then(response => response.json())
	.then(callback);

}

function getObjWithToken(url,token,callback)
{
	let options ={
		method:"GET",
		headers:{
			'Content-Type' : 'application/json',
			'Authorization': 'Bearer ' + token 
		}
	}



	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}

function deleteObjWithToken(url,token,callback)
{
	let options ={
		method:"DELETE",
		headers:{
			'Content-Type' : 'application/json',
			'Authorization': 'Bearer ' + token 
		}
	}



	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}

function postFileWithToken(url, fileInputElement,token,callback)
{
	const formData = new FormData();
	formData.append("avatar",fileInputElement.files[0])
	let options ={
		method:"POST",
		headers:{
			'Authorization': 'Bearer ' + token 
		},
		body: formData
	}
	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}

function postFile(url, fileInputElement,callback)
{
	const formData = new FormData();
	formData.append("avatar",fileInputElement.files[0])
	let options ={
		method:"POST",
		body: formData
	}
	fetch(url,options)
	.then(response => response.json())
	.then(callback);
}
