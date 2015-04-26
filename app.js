function frameworkLoaded(){
	console.log("LinkedIn framework loaded");
}

function logInUser() {
	IN.User.authorize(userLoggedIn());
}

function userLoggedIn() {
	if(IN.User.isAuthorized()){
		console.log("User logged in");
	}
}

function getInfo() {
	IN.API.Profile("me")
		.fields(["firstName","headline"])
	    .result(function(result) {
	    	console.log(JSON.stringify(result));
	    	displayInfo(result);
		});
}

function displayInfo(data) {
	console.log("Displaying info..");
	document.getElementById("firstName").innerHTML = data.values[0].firstName;
}