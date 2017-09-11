let app = angular.module("myApp", []);
app.controller("calendarCtrl", function($scope, $http) {
    $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    $scope.hasLoaded = true;
    $scope.error = {
        message: "Could not load properly",
        hide: true
    };

    $scope.success = {
        message: "",
        hide: true
    };

    const REST_API_URL = "rest/1/";
    const SERVER_URL = "http://localhost:3000/";
    let options = {
        defaultView: "agendaWeek",
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        //scrollTime: "08:00:00",

        minTime: "08:00:00",
        maxTime: "18:00:00",

        firstDay: 1,
        editable: false,
        contentHeight: 600,
        eventSources: [
            {
                url: SERVER_URL + REST_API_URL + "date",
                type: 'GET',
                error: function(error) {
                    console.log(error);
                },
                color: 'yellow'
            }
        ],
    };

    $('.timetable').fullCalendar(options);

    $scope.init = function() {


        //$('.timetable').fullCalendar();

        //queryServer();
    };

    function queryServer() {
        $http.get(SERVER_URL + REST_API_URL + "test")
            .then(function (response, error) {
                // response is a pack of days
                if (error) {
                    console.log(error);
                } else {
                    // https://fullcalendar.io/docs/event_data/events_json_feed/
                    // should be an array with title, start, end
                    // times need to be in ISO format
                    console.log("test");
                    options.events = response.target;
                    $scope.hasLoaded = true;
                }
            })
            .then(function (response) {
                $('.timetable').fullCalendar(options);
            });
            // .catch(function (response) {
            //     console.log(response);
            // });
    }

});
