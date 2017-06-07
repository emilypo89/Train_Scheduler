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

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();

  // Code for the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    // dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().trainName);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTrainTime);
  console.log(childSnapshot.val().frequency);
  // console.log(childSnapshot.val().joinDate);

  // full list of items to the well
  $("tbody").append("<tr><th id='newTrainName'> " + childSnapshot.val().trainName +
    " </th><th id='newDestination'> " + childSnapshot.val().destination +
    " </th><th id='newTrainTime'> " + childSnapshot.val().firstTrainTime +
    " </th><th id='newFrequency'> " + childSnapshot.val().frequency + " </th></tr>");

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

  // Change the HTML to reflect
  $("#name-display").html(snapshot.val().trainName);
  $("#email-display").html(snapshot.val().destination);
  $("#age-display").html(snapshot.val().firstTrainTime);
  $("#comment-display").html(snapshot.val().frequency);
});