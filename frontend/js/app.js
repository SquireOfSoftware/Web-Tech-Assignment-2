let app = angular.module("myApp", []);

const REST_API_URL = "rest/1/";
const SERVER_URL = "http://localhost:3000/";
const DUMMY_EMAIL = "John.smith@gmail.com";

$('#viewing').show();
$('#login').hide();

app.controller("calendarCtrl", function($scope, $http, messageService) {
    $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    $scope.hasLoaded = true;

    let options = {
        defaultView: "agendaWeek",
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        minTime: "08:00:00",
        maxTime: "18:00:00",
        firstDay: 1,
        editable: false,
        contentHeight: 600,
        // timezone: "AEST",
        eventSources: [
            {
                url: SERVER_URL + REST_API_URL + "date?email=" + DUMMY_EMAIL,
                type: 'GET',
                startParam: "shift_start",
                endParam: "shift_end",

                data: {
                    shift_end: "shift_end",
                    shift_start: "shift_start"
                },
                error: function(error) {
                    //console.log(error);
                    // gotta figure out how to parse out the json data
                    messageService.setError("Error trying to get date: " + JSON.stringify(error));
                },
                color: '#86df86'
            }
        ],
    };

    //$('.timetable').fullCalendar(options);

    $scope.init = function() {

        $('.timetable').fullCalendar(options);

    };

});

app.controller("messageCtrl", function($scope) {
    $scope.error = {
        message: ""

    };

    $scope.$on("displayError", function(event, payload) {
        console.log("displaying error");
        $scope.error.message = payload;
        $("#transparent-overlay").show();
    });

    $scope.close = function() {
        $('message').hide();
        $('#transparent-overlay').hide();
    };

});

app.controller("loginCtrl", function($scope, $http, loginService) {

    $scope.email = "";

    $scope.password = "";

    $scope.submit = function() {

        loginService.loginSubmit("");
    }
});

app.service("messageService", function($rootScope) {
    this.setError = function(message) {
        $rootScope.$broadcast("displayError", message);
    }
});

app.service("loginService", function($http, messageService) {
    this.loginSubmit = function(base64encoding, callback) {
        $http.post(SERVER_URL + REST_API_URL + "login", {credentials: base64encoding})
            .then(function(response) {
                console.log(base64encoding);
            }, function(error) {
                console.log("TEST");
                messageService.setError("Problem connecting to the server, please see your error logs");
            });
    }
});