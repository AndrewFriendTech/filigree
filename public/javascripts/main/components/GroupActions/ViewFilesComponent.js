function ViewFilesComponent(element){
    //get thread id
    getObjWithToken(`/api/groups/${groups[selectedGroup]._id}/threads`,token,threads=>{
        
        //html code for the view files section        
         element.innerHTML = `
         <button id = "actions-back"> Back </button> 
         <div id = "fileList>
            ${generateFileList()}
         </div>
         `

         //back button event listener
        document.getElementById("actions-back")
            .addEventListener("click", ()=> GroupActionsComponent(element));

        //function that generates the html for the list of files
         function generateFileList(){
            return threads.flatMap(thread => thread.messages)
                //filter threads array to get all the file messages with files attached
                //and then generate html for them and join it into one long string
                .filter(message => message.fileURL)
                .map(message => 
                    `<div = "fileObject">
                        <img src = "images/file.svg" height = "40">
                        <a class="fileLink" href="${message.fileURL}">${message.body}</a>
                    </div>`)
                .join("\n")
        }
    })

    

    
}