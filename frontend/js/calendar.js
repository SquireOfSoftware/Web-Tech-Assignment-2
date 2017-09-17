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
        firstDay: 1, // monday
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
