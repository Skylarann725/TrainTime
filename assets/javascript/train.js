$(document).ready(function() {   
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCoHat6MwglXO9yFy3vTrTrd5V8Mcin_qc",
        authDomain: "train-project-c5522.firebaseapp.com",
        databaseURL: "https://train-project-c5522.firebaseio.com",
        storageBucket: "train-project-c5522.appspot.com",
        messagingSenderId: "575028007843"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $(".table").on("click", ".delete-row", function () {
    $(this).closest('tr').remove();
    var childKey = $(this).attr('data-row');
    database.ref().child(childKey).remove();
    });

    // Whenever a user clicks the submit-bid button
    $("#submit-train").on("click", function(event) {
        // Prevent form from submitting
        event.preventDefault();

        // Get the input values and store as object
        var train = {
            name: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTime: $("#first-time").val().trim(),
            frequency: $("#frequency").val().trim()
        };

        //push to firebase
        database.ref().push(train);
        console.log(train);

        //empty the form
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");

    });

    // At the initial load and whenever a new train is added.
    database.ref().on("child_added", function(snapshot) {

        //math for times
        var frequency = snapshot.val().frequency;
        var startTime = moment(snapshot.val().firstTime, "H:m");

        //Set variables
        var timeFound = false;
        var nextArrival = startTime;
        var now = moment();
        var minutesAway;

        //Get the next train arrival time
        while (timeFound === false) {
            if (moment(nextArrival, "H:m", true).isValid()) {
                if (nextArrival >= now) {
                    timeFound = true;
                    //Get the minutes until next train arrival
                    minutesAway = moment(nextArrival).diff(now, 'minutes');
                } else {
                    nextArrival.add(frequency, 'm');
                }
            } else {
                break;
            }

        }
         //Create a new row for the train times
        var newRow = $('<tr data-name="' + snapshot.name + '">');
        newRow.append($('<td>' + snapshot.val().name + '</td>'));
        newRow.append($('<td>' + snapshot.val().destination + '</td>'));
        newRow.append($('<td>' + snapshot.val().frequency + '</td>'));
        newRow.append($('<td>' + startTime.format("h:mm A") + '</td>'));
        newRow.append($('<td>' + minutesAway + '</td>'));
        newRow.append($('<td><button class="delete-row" data-row = "' + snapshot.getKey() + '"><span class="glyphicon glyphicon-remove"></span></button>'));

        //Add to table for train times
        $('.table').append(newRow);

        // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

