app.controller("calendarCtrl", function($scope, $http, messageService, dataService, loginService) {
    $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    $scope.hasLoaded = true;

    let options = {
        defaultView: "agendaWeek",
        footer: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        header: false,
        minTime: "08:00:00",
        //maxTime: "18:00:00",
        firstDay: 1, // monday
        //editable: false,
        allDaySlot:false,
        contentHeight: 500,
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
                    //messageService.setError("Error trying to get date: " + JSON.stringify(error));
                },
                color: '#86df86'
            }
        ],
        // this method can create events
        dayClick: function(event, jsEvent, view) {
            if (loginService.canEdit) {
                dataService.setDetails(event);
                dataService.showPrompt(event);
            }
        },
        eventRender: function(event, element) {
            if (event !== undefined) {

                let approval = event.approval ? "Approved": "Unapproved";
                element.find('.fc-title').append("<br/>"+
                    approval + "<br/>" +
                    event.role_description + "<br/>" +
                    event.employee
                );
            }
        },
        eventDragStop: function(event, jsEvent, ui, view) {

            updateExistingEvent(event);
        },
        eventResize: function(event, delta, revertFunc) {
            updateExistingEvent(event);
        }
    };

    // need to figure out how to remove events
    function updateExistingEvent(event) {
        // locate event in array
        // replace all the item in array
        event.source = "";
        newEvents[event.id] = event;
    }

    let newEvents = [];

    $scope.init = function() {
        $('.timetable').fullCalendar(options);

        $http.get(URL + "roles")
            .then(function(success) {
                dataService.setRoles(success.data);
            }, function(error) {
                console.log(error);
            });

        $http.get(URL + "users")
            .then(function(success) {
                dataService.setUsers(success.data);
            }, function(error) {
                console.log(error);
            });
    };

    $scope.loadCalendar = function () {
        let event = createNewEvent();
        newEvents.push(event);
        $('.timetable').fullCalendar('renderEvent', event);
    };

    function addEvent(triggerEvent, data) {
        let newEvent = createNewEvent(data.details, data.selectedRole, data.selectedUser);
        newEvents.push(newEvent);
        $('.timetable').fullCalendar('renderEvent', newEvent);
    }

    $scope.sendUpdates = function () {
        $http.post(URL + "insert",
            {newEvents})
            .then(function(success) {
                console.log("woot");
                newEvents = [];
            }, function(error) {
                console.log("booo", error);
            });
    };

    function parseToUTC(dates) {
        for(let i = 0; i < dates.length; i++) {
            dates[i].start = dates[i].start.toISOString();
            dates[i].end = dates[i].end.toISOString();
        }
        return dates;
    }

    function createNewEvent(date, role, user) {
        //let date = moment();
        let nearestHalfHour; // = moment(date).add("minutes", 30 + date.minute() % 30);
        let dateMinutes = date.minutes() % 60;
        if (dateMinutes < 15) {
            nearestHalfHour = moment(date).subtract(dateMinutes, "minutes");
        } else if (dateMinutes < 45) {
            nearestHalfHour = moment(date).add(30 - dateMinutes, "minutes");
        } else {
            nearestHalfHour = moment(date).add(60 - dateMinutes, "minutes");
        }

        let end = moment(nearestHalfHour).add(3, "hours");

        return {
            id: newEvents.length,
            title: role.role_name,
            role_description: role.role_description,
            start: nearestHalfHour,
            end: end,
            employee: user.first_name + " " + user.last_name,
            user: user,
            role: role,
            editable: true,
            approved: false,
        }
    }

    $scope.$on("createNewEvent", addEvent);
});

app.service("dataService", function($rootScope, messageService) {
    this.setRoles = function(roles) {
        console.log(roles);
        this.roles = roles;
    };

    this.setUsers = function(users) {
        this.users = users;
    };

    this.createNewEvent = function(selectedRole, selectedUser) {
        console.log(selectedRole, this.details);
        $rootScope.$broadcast("createNewEvent", {
            details: this.details,
            selectedRole: selectedRole,
            selectedUser: selectedUser});
    };

    this.setDetails = function(details) {
        this.details = details;
    };

    this.showPrompt = function() {
        $rootScope.$broadcast("showDatePrompt");
    };
});

app.controller("dateCtrl", function($scope, messageService, dataService) {
    $scope.selectedRole;
    $scope.selectedUser;
    $scope.roles = dataService.roles;
    $scope.users = dataService.users;

    $scope.showPrompt = function(triggerEvent) {
        $scope.roles = dataService.roles;
        $scope.users = dataService.users;

        $scope.$apply();

        $("#prompt-overlay").show();
    };

    $scope.closePrompt = function() {
        $("#prompt-overlay").hide();
    };

    $scope.saveEvent = function() {
        if ($scope.selectedRole !== undefined && $scope.selectedUser !== undefined) {
            dataService.createNewEvent($scope.selectedRole, $scope.selectedUser);
            $scope.closePrompt();
            $scope.selectedRole = undefined;
            $scope.selectedUser = undefined;
        }

    };

    $scope.$on("closeDatePrompt", $scope.closePrompt);
    $scope.$on("showDatePrompt", $scope.showPrompt);
});