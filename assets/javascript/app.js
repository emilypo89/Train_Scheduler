// Initialize Firebase
var config = {
  apiKey: "AIzaSyDXRI5N36xqsvuefGexJQiggCaX13bu6lU",
  authDomain: "trainscheduler-cb5eb.firebaseapp.com",
  databaseURL: "https://trainscheduler-cb5eb.firebaseio.com",
  projectId: "trainscheduler-cb5eb",
  storageBucket: "trainscheduler-cb5eb.appspot.com",
  messagingSenderId: "956005095343"
};
firebase.initializeApp(config);

var database = firebase.database();


// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;


// Capture Button Click
$("#submitButton").on("click", function(event) {
  event.preventDefault();

  // grabs user input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency").val().trim();



  // Code for the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});



// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().joinDate);
  
  // Store everything in a variable
  var tName = childSnapshot.val().trainName;
  var tDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrainTime;
  var tFrequnecy = childSnapshot.val().frequency;
 

// Moment.js
	// First Time (pushed back 1 year to make sure it comes before current time)
  // cannot figure out how to get the moment.js to include the PM with the time
	var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm A").subtract(1, "years");
	console.log(firstTimeConverted);
	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));
	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);
	// Time apart (remainder)
	var tRemainder = diffTime % childSnapshot.val().frequency;
	console.log(tRemainder);
	// Minute Until Train
	var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
	// Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

  // full list of items to the well
  $("tbody").append("<tr><th id='newTrainName'> " + childSnapshot.val().trainName +
    " </th><th id='newDestination'> " + childSnapshot.val().destination + 
    " </th><th id='newDestination'> " + childSnapshot. val().frequency + 
    " </th><th id='nextTrain'> " + moment(nextTrain).format("hh:mm A") +
    " </th><th id='tMinutesTillTrain'> " + tMinutesTillTrain + " </th></tr>");

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



