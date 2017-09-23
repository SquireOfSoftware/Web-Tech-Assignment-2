app.controller("calendarCtrl", function($scope, $http, messageService, dateService, loginService) {
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
                url: URL + "date", //?email=" + DUMMY_EMAIL,
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
        // this method can create events
        dayClick: function(event, jsEvent, view) {
            if (loginService.canEdit) {
                console.log(event.toISOString());
                //addEvent(event);
                dateService.setDetails(event);
                dateService.showPrompt(event);
            }
        },
        eventRender: function(event, element) {
            if (event.description !== undefined) {

                let approval = event.approval ? "approved": "unapproved";

                element.find('.fc-title').append("<br/>"+ approval + "<br/>" + event.description);
            }
        },
        viewDestroy: function(view, element) {

            if (confirm("Are you sure?")) {

            }
        }
    };

    let newEvents = [];
    //$('.timetable').fullCalendar(options);

    $scope.init = function() {
        $('.timetable').fullCalendar(options);
        //$scope.loadCalendar();
        /*
        $http.get(URL + "/roles")
            .then(function(success) {
                dateService.setRoles(success);
            }, function(error) {
                console.log(error);
            });*/
    };

    $scope.loadCalendar = function () {
        let event = createNewEvent();
        newEvents.push(event);
        $('.timetable').fullCalendar('renderEvent', event);
    };

    function addEvent(triggerEvent, data) {
        console.log(data);
        let newEvent = createNewEvent(data.details, data.selectedRole);
        newEvents.push(newEvent);
        $('.timetable').fullCalendar('renderEvent', newEvent);
    }

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

    function createNewEvent(date, role) {
        //let date = moment();
        let nearestHalfHour; // = moment(date).add("minutes", 30 + date.minute() % 30);
        let dateMinutes = date.minutes() % 60;
        if (dateMinutes < 15) {
            nearestHalfHour = moment(date).subtract("minutes", dateMinutes);
        } else if (dateMinutes < 45) {
            nearestHalfHour = moment(date).add("minutes", 30 - dateMinutes);
        } else {
            nearestHalfHour = moment(date).add("minutes", 60 - dateMinutes);
        }

        //console.log(date.toISOString());
        return {
            title: role.name,
            description: "HELLO",
            start: nearestHalfHour,
            end: nearestHalfHour,
            editable: true,
            approved: false,
        }
    }

    $scope.$on("createNewEvent", addEvent);
});

app.service("dateService", function($rootScope, messageService) {
    this.roles = [{id: 1, name: "test"}];

    this.setRoles = function(roles) {
        this.roles = roles;
    };

    this.createNewEvent = function(selectedRole) {
        console.log(selectedRole, this.details);
        $rootScope.$broadcast("createNewEvent", {details: this.details, selectedRole: selectedRole});
    };

    this.setDetails = function(details) {
        this.details = details;
    };

    this.showPrompt = function() {
        $rootScope.$broadcast("showDatePrompt", {});
    };

    this.showPrompt = function() {
        $rootScope.$broadcast("showDatePrompt", {});
    };
});

app.controller("dateCtrl", function($scope, messageService, dateService) {
    //$scope.roles = [];
    $scope.selectedRole = {id: -1, name: ""};
    //$scope.roles = [{id: 1, name: "test"}];
    $scope.roles = dateService.roles;

    $scope.showPrompt = function(triggerEvent, details) {
        //console.log(details);
        $scope.selectedRole.id = $scope.roles[0].id;
        $scope.selectedRole.name = $scope.roles[0].name;
        console.log($scope.selectedRole);
        $("#prompt-overlay").show();
    };

    $scope.closePrompt = function() {
        $("#prompt-overlay").hide();
    };

    $scope.saveEvent = function() {
        dateService.createNewEvent($scope.selectedRole);
        $scope.closePrompt();
    };

    $scope.$on("closeDatePrompt", $scope.closePrompt);
    $scope.$on("showDatePrompt", $scope.showPrompt);
});