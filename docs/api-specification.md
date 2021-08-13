# API Specifcation

## API heirachy 
	
	api
		groups
			<group id>
				members
				threads
					<thread id>
						<message>
							user
							body
							time 
							poster
			search
				<term>
		thread
			messages
		user
			<username>
				profile
				breif_profile
				privateMessage
			current
				messages
					<lastMessage>
					<deleteMessage>
				profile
				friends
					addFriend/user_id
					removeFriend/user_id
				groups

	img
		<username>	

## Groups
### `GET /api/groups`
Returns an collection of groups of the form
	{
		id: <number>,
		name: <string>,
		description: <string>,
		location: <location>
	}
#### Queries
Collections  can be filtered using query added to uri , in the form `api/groups?someQuery=abc&someOther=def`.
Queries include:
##### `name=<string>`
returns all group objects where the string is contained with the name field of the group
##### `location=<location>&distance=<number>`
returns the groups within the specified distance(in kilometers) of the location.  
##### `quantity=<number>`
Returns only the specified number of objects, if included with the location query, sorts the collection by nearest first.

#### Response codes
If object(s) exist:
	200 OK
If query is valid, but no objects can be found matching the criteria:
	204 No Content
If query does is invailid:
	404 Not found
### `POST /api/groups`
Creates a group. The body must be a JSON object with the following required fields:
	[
		{
			name: <string>
			description: <string>
			location: <location>	
		}...
	]
Server will then respond back with a `201 Created` status code if sucsessful and then will return the object posted , with the addition of field for ID, containing the ID of the group, plus any aditional fields the server has created.

If the user doesn't have sufficient permissions to create an object, the status code `403 forbiden ` is returned

### `GET /api/groups/:group-id/members`
Returns an array of users that are members of the group.
The result will be an aray will be an array of string usernames



### `GET /api/groups/:group-id/threads`
This will return all the threads associated with a group. This will return an array of JSON objects which contain a thread name and a thread_id and details about the thread., the thread id is a number unique to the group.
	[{title: <string>, openingPost: <string>, createdAt:<Date>},{ ... ]

### `POST/api/groups/:group-id/threads`
start a new thread. Takes thread of form
{
	title:<string>,
	openingPost:<string>
}

## `thread`

### `GET /api/thread/:thread_id/messages`
Retrives an array of messages from the thread. Messages are JSON objects like so:
	{
		id: <number>,
		body: <string>,
		createdAt: <Date>,
		postedBy:<username> 
		

	}


#### `POST /api/threads/:thread_id/messages`
add a message to the thread.
Messages should be posted as a JSON object in the form:

	{body:<string>}
the timestamp and the username fields you get in recieved messages will be appended the object by the server before pushing the object to our database.

### `user`
#### `GET /api/user/:username/profile`
Returns a full profile of the users information in the following format:
	{
		username:<string>,
		fullname:<string>,
		active:<string ('active'|'idle'|'offline')>
		bio:<string>,
		friends:<array of usernames>,
		groups:<array of group_id>
		location:<location>
	}
More information can be added to the object later but what is already put should not be removed.


#### `GET /api/user/:username/brief_profile`
Returns a brief profile of the users information in the following format:
	{
		username:<string>,
		fullname:<string>,
		active:<string ('active'|'idle'|'offline')>
	}
Suggested for lists of users and other situiations where you dont need the full details of the user.


#### `GET /api/user/current/profile`
returns the same as the above (full) profile call, but for the user that you are currently logged in as.

#### `GET /api/user/current/friends`
Returns an array of user_id of the users that the current user is currently friends with.

#### `POST /api/user/currernt/friends/addFriend/:user_id/`
Adds the friend witht the specified user id. 

#### `POST /api/user/current/friends/removeFriend/:user_id/
Removes the friend with the specified id.

#### `GET /api/user/current/messages
Returns all the messages sent to a user as an array of objects of the form:

	{
		title:<string>
		body:<string>,
		postedBy:<username>,
		createdAt:<Date>
	}

#### `GET /user/current/newMessages`
returns a boolean value of true or false of if the user has downloaded messages since recieving a new one

#### `POST /user/:username/messages`
Send a message in the format below to the specified user

{
		id: <number>,
		body: <string>,
		time: <Date.getTime()>,
		user: <user_id>
}



#### `GET /api/user/current/groups`
Returns all groups the user is a member of , result returned is an array of group objects like:

	[
		{
			"threads": [],
			"members": [
				"ElBarto88"
			],
			"_id": "6030090501371d6e89c66d60",
			"name": "Computer Science London",
			"description": "Eat Sleep Code Repeat !!",
			"location": {
				"coordinates": [
					51.47375,
					-0.03816
				],
				"_id": "6030090501371d6e89c66d61",
				"type": "Point"
			},
			"pictureURL": "images/profile/group/computer.png",
			"createdAt": "2021-02-19T18:52:53.980Z",
			"updatedAt": "2021-02-19T21:08:11.490Z",
			"__v": 0
		},
		...
	]








### `POST /api/user/`
Creates a new user from an user object supplied in the body. Body will have the form of 
	{
		user_id:<ObjectID>,
		username:<string>,
		fullname:<string>,
		active:<string ('active'|'idle'|'offline')>
		bio:<string>,
		friends:<array of usernames>,
		groups:<array of usernames>
		location:<location>
	}
and all of the fields of the body must be filled. (in future could add CAPTCHA or some other anti-bot messuare, explore when researching)



### Location

Todo- Research more on location api's

## Authentcation
