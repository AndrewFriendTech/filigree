function connectiveList(items,conective){
    if(!items.length){
        throw "items must be an array"
    }
    //allow non english users to set own connective otherwise default to and
    if(!conective){
        conective = "and"
    }

    if(items.length==1){
        return items[0]
    }
    else{
        var string = "";
        //append all the items bar the final two
        for(var i = 0; i < items.length-2;i++)
        {
            string += items[i]+", ";
        }
        //now append the final two
        string += items[items.length-2] + " and " + items[items.length-1];
        return string
    }
}

