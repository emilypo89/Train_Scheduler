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

// Capture Button Click
$("#submitButton").on("click", function(event) {
  event.preventDefault();

  // grabs user input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency").val().trim();

  // creates local object for holding train data
  var newTrain ={
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  }

  // Code for the push
  database.ref().push(newTrain);

  // log new train in console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  // alterting when train arrives
  alert("Train successfully added");

  // clears values in text boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");

  // determine when the next train arrives
  return false;
});



// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val());
  
  // Store everything in a variable
  var tName = childSnapshot.val().trainName;
  var tDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrainTime;
  var tFrequency = childSnapshot.val().frequency;
 

// Moment.js
	// Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
  // and find the modulus between the difference and the frequency.
  var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
  var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
  var tMinutes = tFrequency - tRemainder;

  // To calculate the arrival time, add the tMinutes to the currrent time
  var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  console.log(tMinutes);
  console.log(tArrival);
  console.log(moment().format("hh:mm A"));
  console.log(tArrival);
  console.log(moment().format("X"));

  // full list of items to the well
  $("tbody").append("<tr><th id='newTrainName'> " + tName +
    " </th><th id='newDestination'> " + tDestination + 
    " </th><th id='newDestination'> " + tFrequency + 
    " </th><th id='nextTrain'> " + tArrival +
    " </th><th id='tMinutesTillTrain'> " + tMinutes + " </th></tr>");

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



