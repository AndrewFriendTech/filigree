//get credentials from local storage
let credentials = JSON.parse(localStorage.getItem("credentials"));
if(!credentials) window.location.href = "/login.html?redirect=sendmessage.hmtl";
let token = credentials.token;

//extracts a key value pair of user and the username if it exists
let username;
let title;
let body;
let userInQuery = false;
try{
    username = window.location.search
        .slice(1)
        .split("&")
        .map(e => e.split("="))
        .find(e => e[0] === "user" )[1];
    //then make the user box invisible
    let userElements= document.getElementsByClassName("user");
    for(let item of userElements)
        item.style.display = "none";
    userInQuery = true;
} catch(e){
    console.log(e)
}

//clear any errors already their
function clearErrors(){
    let msg = document.getElementById("error");
    if(msg) msg.remove();   
}

//sets error message if user hasnt entered form correct
function errorMsg(text){
   document.getElementById("form")
        .insertAdjacentHTML("beforeend",
        `<div id = "error"> Error: ${text}!</div>`);
}

//set event listner for submit button
document.getElementById("submit").addEventListener("click",e =>{
    clearErrors();
    //if username is already set , use it, otherwise get it from html
    if(!userInQuery) username = document.getElementById("user").value; 
    title = document.getElementById("title").value;
    body = document.getElementById("body").value;
    let errors = [];
    if(!username) errors.push("username");
    if(!title) errors.push("title");
    if(!body) errors.push("body");
    switch(errors.length){
        case 1:
            errorMsg(`Message requires a ${errors[0]}`);break;
        case 2:
            errorMsg(`Message requires ${errors[0]} and ${errors[1]}`);break;
        case 3:
            errorMsg (`Message requires a ${errors[0]},${errors[1]} and ${errors[2]}`);break;
        case 0://if no errors, message is valid syntatically , start upload it toserver
        uploadServer();    
    }

})

function uploadServer(){
    let obj = {title,body};
    postObjWithToken(`/api/user/${username}/messages`,obj,token, result =>{
        if(result.success){
            document.body.innerHTML = "<h1>Message sent, close tab!</h1>";
        }else if(result.error === "user does not exist"){
            errorMsg("User can not be found!");
        }
    });
}

//first get the data for all the user's groups from the server



