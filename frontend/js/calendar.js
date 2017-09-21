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
        //maxTime: "18:00:00",
        firstDay: 1, // monday
        //editable: false,
        allDaySlot:false,
        contentHeight: 600,
        timezone: "local",
        snapDuration: moment.duration(30, 'minutes'),
        eventSources: [
            {
                url: SERVER_URL + REST_API_URL + "date", //?email=" + DUMMY_EMAIL,
                type: 'GET',
                startParam: "shift_start",
                endParam: "shift_end",
                data: {
                    shift_end: "shift_end",
                    shift_start: "shift_start"
                },
                editable: false,
                error: function(error) {
                    // gotta figure out how to parse out the json data
                    messageService.setError("Error trying to get date: " + JSON.stringify(error));
                },
                color: '#86df86'
            }
        ],
        eventRender: function(event, element) {
            if (event.description !== undefined) {
                element.find('.fc-title').append("<br/>"+ event.approval + "<br/>" + event.description);
            }
        }
    };

    let newEvents = [];
    //$('.timetable').fullCalendar(options);

    $scope.init = function() {
        $('.timetable').fullCalendar(options);
        //$scope.loadCalendar();
    };

    $scope.loadCalendar = function () {
        let event = createNewEvent();
        newEvents.push(event);
        $('.timetable').fullCalendar('renderEvent', event);
    };

    $scope.sendUpdates = function () {
        console.log(newEvents);
        //newEvents = parseToUTC(newEvents);
        console.log(newEvents);
        $http.post(SERVER_URL + REST_API_URL + "date?email=" + DUMMY_EMAIL,
            {newEvents: newEvents})
            .then(function(success) {
                console.log("woot");
                newEvents = [];
            }, function(error) {
                console.log("booo");
            });
    };

    function parseToUTC(dates) {
        for(let i = 0; i < dates.length; i++) {
            dates[i].start = dates[i].start.toISOString();
            dates[i].end = dates[i].end.toISOString();
        }
        return dates;
    }

    function createNewEvent() {
        let date = moment();
        let nearestHalfHour = moment(date).add("minutes", 30 - date.minute() % 30);
        console.log(date.toISOString());
        return {
            title: "Welcoming",
            description: "HELLO",
            start: nearestHalfHour,
            end: nearestHalfHour,
            editable: true
        }
    }

});
