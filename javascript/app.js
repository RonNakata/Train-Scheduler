
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAW6fpCIXlFWxqVHQ-VClQbI4vD5H8ProM",
    authDomain: "train-scheduler-a4234.firebaseapp.com",
    databaseURL: "https://train-scheduler-a4234.firebaseio.com",
    projectId: "train-scheduler-a4234",
    storageBucket: "",
    messagingSenderId: "916713966446"
  };
  firebase.initializeApp(config);

//   local reference to the firebase
var database = firebase.database();


// Submit Button Click
$("#submit-train").on("click", function(event) {
    event.preventDefault();
        
    //grab all the user input
    name = $("#train-name").val().trim();
    dest = $("#train-dest").val().trim();
    first = $("#train-first").val().trim();
    freq = $("#train-freq").val().trim();
        
    // push the input to the db
    database.ref().push({
        name: name,
        dest: dest,
        first: first,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

// Loads all the db info into html and keeps watch for more data being added to db to display that as well
database.ref().on("child_added", function(cSnap) {
      
    // Log everything that's coming out of snapshot
    // console.log(cSnap.val());
    // console.log(cSnap.val().name);
    // console.log(cSnap.val().dest);
    // console.log(cSnap.val().first);
    // console.log(cSnap.val().freq);
    // console.log(cSnap.val().dateAdded);

    //Display the db info in the table
    // grabbing table body, where we will insert the trains
    var tBody = $("tbody");
    // creating a new row for the train returned by childsnap
    var tRow = $("<tr>");
    // creating td divs for table data
    var name = $("<td>").text(cSnap.val().name);
    var dest = $("<td>").text(cSnap.val().dest);
    var freq = $("<td>").text(cSnap.val().freq);
    var nextAtemp = nextArrival(cSnap.val().first, cSnap.val().freq);
    var nextA = $("<td>").text(convTime(nextAtemp));
    var minA = $("<td>").text(mAway(nextAtemp));
    
    // Append the newly created table data to the table row
    tRow.append(name, dest, freq, nextA, minA);
    // Append the table row to the table body
    tBody.append(tRow);
    showTime();
    


    // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
    });

// Function to convert military time to standard time
function convTime(time) {
    // var for am/pm
    var amPm;
    // split hours and mins
    var timesplit = time.split(":");

    // if hours > 12 then do conversion
    if (timesplit[0] > 12) {
        timesplit[0] = timesplit[0]-12;
        amPm="pm";
    }
    else {
        if (timesplit[0] === "12") {
            amPm="pm";
        }
        else {
        amPm="am";
        }
    }

    // if minutes > 10 then insert a 0
    if (timesplit[1] < 10) {
        timesplit[1] = "0"+timesplit[1];
    }

    // return the string with am/pm added
    return (timesplit[0]+ ":" + timesplit[1] + " " + amPm);

}

// Function to display current time
function showTime() {
    var datime = new Date();
    var dahour = datime.getHours();
    var damin = datime.getMinutes();
    // conditional to insert a 0 for minutes under 10
    if (damin>9) {
    $(".time").html("The schedule below is based on current time of: " + dahour + ":" + damin);
    }
    else {
    $(".time").html("The schedule below is based on current time of: " + dahour + ":0" + damin);

    }
}

// Function to calculate when the next train is arriving
function nextArrival(firstA, frequ) {
    // current time
    var datime = new Date();
    // current hour value
    var dahour = datime.getHours();
    // current minute value
    var damin = datime.getMinutes();
    // current time in minutes
    var curInMin =(dahour*60+damin);
    // first arrival time broken into hh:mm
    var firSplit = firstA.split(":");
    // first arrival time in minutes
    var nextAr = (parseInt(firSplit[0])*60 + parseInt(firSplit[1]));
    // increment the next arrival time by the frequency of the train until its past the current time
    while (nextAr < curInMin) {
        nextAr = nextAr+parseInt(frequ);
    };
    // next arrival time hours value
    var nextArHr = Math.floor(nextAr / 60);
    // next arrival time minutes value
    var nextArMi = (nextAr % 60);
    // put hour+min into a string to be displayed & return it
    var nextArStr = (nextArHr + ":" + nextArMi);
    return nextArStr;

}

// Function to calculate how many minutes until next train arrival
function mAway (nextArri) {
        // current time
        var datime = new Date();
        // current hour value
        var dahour = datime.getHours();
        // current minute value
        var damin = datime.getMinutes();
        // current time in minutes
        var curInMin =(dahour*60+damin);
        // next arrival time broken into hh:mm
        var nextArriv = nextArri.split(":");
        // next arrival time in minutes
        var nextAriva = (parseInt(nextArriv[0])*60 + parseInt(nextArriv[1]));
        // return the difference between next arrival time and current time in minutes
        return nextAriva-curInMin;

}

