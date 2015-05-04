ws.onmessage = function (event) {
	//display data from server
	//console.log(JSON.parse(event.data));
	generateCard(event.data);
};

ws.onopen = function() {
	//ws.send('getAll');
    ws.send('getUser');
};

//Local storage of info
var userInfo = {
	"name": undefined,
	"position": undefined,
	"skills": undefined,
	"profile": undefined,
	"email": undefined,
	"location": undefined,
	"image": undefined
};

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
	if (!IN.User.isAuthorized()){
		alert("Please log in first");
	} else {
		IN.API.Profile("me")
			.fields(["firstName","lastName", "location:(name)", "skills:(skill:(name))",
				"picture-url", "positions:(title,company:(name))",
				"public-profile-url", "email-address"])
		    .result(function(result) {
		    	console.log(JSON.stringify(result));
		    	displayInfo(result);
			});
	}
}

function displayInfo(data) {
	console.log("Displaying info..");
	document.getElementById("name").value = data.values[0].firstName + " " + data.values[0].lastName;
	document.getElementById("position").value = data.values[0].positions.values[0].title + " at " + data.values[0].positions.values[0].company.name;
	
	//Clear old skills and display up to three skills
	document.getElementById("skills").value = "";
	for (var i=0; i<3; i++){
		if (data.values[0].skills.values[i].skill.name != undefined){
			if (i == 2){
				document.getElementById("skills").value += data.values[0].skills.values[i].skill.name + " ";
			} else {
				document.getElementById("skills").value += data.values[0].skills.values[i].skill.name + ", ";
			}
		}
	}
	document.getElementById("profile").value = data.values[0].publicProfileUrl;
	document.getElementById("email").value = data.values[0].emailAddress;
	document.getElementById("location").value = data.values[0].location.name;
	document.getElementById("image").innerHTML = "<img src=\"" + data.values[0].pictureUrl+ "\" alt=\"user's image\" style=\"float:right\">";
	
	userInfo.image = data.values[0].pictureUrl;
	saveData();
}


function saveData(){
	console.log("Saving data..");
	userInfo.name = document.getElementById("name").value;
	userInfo.position = document.getElementById("position").value;
	userInfo.skills = document.getElementById("skills").value;
	userInfo.profile = document.getElementById("profile").value;
	userInfo.email = document.getElementById("email").value;
	userInfo.location = document.getElementById("location").value;
}

function generateCard(data){
	saveData();

	if (data == undefined){
		//use local data
		if (userInfo == undefined){
			alert('Please enter data or load from LinkedIn');
		} else {
			document.getElementById("cardName").innerHTML = userInfo.name;
			document.getElementById("cardPosition").innerHTML = userInfo.position;
			document.getElementById("cardSkills").innerHTML = userInfo.skills;
			document.getElementById("cardProfile").innerHTML = userInfo.profile;
			document.getElementById("cardEmail").innerHTML = userInfo.email;
			document.getElementById("cardLocation").innerHTML = userInfo.location;
			document.getElementById("cardImage").innerHTML = "<img src=\"" + userInfo.image + "\" alt=\"card image\" style=\"float:right\">";
		}
	} else {
		//use data from db
		data = JSON.parse(data);

		document.getElementById("cardName").innerHTML = data.name;
		document.getElementById("cardPosition").innerHTML = data.position;
		document.getElementById("cardSkills").innerHTML = data.skills;
		document.getElementById("cardProfile").innerHTML = data.profile;
		document.getElementById("cardEmail").innerHTML = data.email;
		document.getElementById("cardLocation").innerHTML = data.location;
		document.getElementById("cardImage").innerHTML = "<img src=\"" + data.image + "\" alt=\"card image\" style=\"float:right\">";
	}
	
}

function shareCard(){
	//TODO: Save to db and generate link to share
}

