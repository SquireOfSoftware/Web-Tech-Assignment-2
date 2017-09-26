app.controller("calendarCtrl", function($scope, $http, messageService, dataService, loginService) {
    $scope.hasLoaded = true;

    $scope.roles = [];
    $scope.users = [];
    $scope.queriedEvents = [];

    let roleFilter;
    let userFilter;

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
                url: URL + "date",
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
                success: function(result) {
                    $scope.queriedEvents = result;
                },
                color: '#86df86'
            }
        ],
        // this method can create events
        dayClick: function(event, jsEvent, view) {
            //if (loginService.canEdit) {
            {
                dataService.setDetails(event);
                dataService.showCreationPrompt(event);
            }
        },
        eventRender: function(event, element) {
            let approval = event.approval ? "Approved" : "Unapproved";
            //console.log(event);
            element.find('.fc-title').append("<br/>" +
                approval + "<br/>" +
                event.role_description + "<br/>" +
                event.employee.name
            );
        },
        dayRender: function(event, cell) {
            console.log(event);
        },
        eventDragStop: function(event, jsEvent, ui, view) {

            updateExistingEvent(event);
        },
        eventResize: function(event, delta, revertFunc) {
            updateExistingEvent(event);
        },
        eventClick: function(event, jsEvent) {
            dataService.showEditingPrompt(event);
        }
    };

    // need to figure out how to remove events
    function updateExistingEvent(event) {
        // locate event in array
        // replace all the item in array
        console.log(event);
        event.source = "";
        newEvents[event.event_ui_id] = event;
    }

    let newEvents = [];
    let timetable = $('#all-schedules');

    $scope.init = function() {
        timetable.fullCalendar(options);

        $http.get(URL + "roles")
            .then(function(success) {
                dataService.setRoles(success.data);
                $scope.roles.push(...success.data);
            }, function(error) {
                console.log(error);
            });

        $http.get(URL + "users")
            .then(function(success) {
                dataService.setUsers(success.data);
                $scope.users.push(...success.data);
            }, function(error) {
                console.log(error);
            })
    };

    $scope.loadCalendar = function () {
        let event = createNewEvent();
        newEvents.push(event);
        timetable.fullCalendar('renderEvent', event);
    };

    function addEvent(triggerEvent, data) {
        let newEvent = createNewEvent(data.details, data.selectedRole, data.selectedUser);
        newEvents.push(newEvent);
        timetable.fullCalendar('renderEvent', newEvent);
    }

    function removeEvent(triggerEvent, calendar_id) {
        timetable.fullCalendar('removeEvents', function(event) { return event._id === calendar_id; });
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

    function updateCalendarEvent (triggerEvent, event) {
        console.log(event);
        removeEvent(undefined, event._id);
        timetable.fullCalendar("renderEvent", event);
    }

    function createNewEvent(date, role, user) {
        let nearestHalfHour;
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
            event_ui_id: newEvents.length,
            title: role.role_name,
            role_description: role.role_description,
            start: nearestHalfHour,
            end: end,
            employee: {
                name: user.first_name + " " + user.last_name,
                id: user.user_id
            },
            user: user,
            role: {
                name: role.role_name,
                id: role.role_id,
                role_id: role.role_id,
            },
            editable: true,
            approved: false,
            color: "#009fff",
        }
    }

    $scope.$on("createNewEvent", addEvent);
    $scope.$on("removeEvent", removeEvent);
    $scope.$on("reloadEntireCalendar", refetchTimetable);
    $scope.$on("sendEventUpdates", $scope.sendUpdates);
    $scope.$on("updateCalendarEvent", updateCalendarEvent);
    $scope.$on("canEditFullCalendar", canEditFullCalendar);

    $scope.onRoleFilterChange = function(filteredRole) {
        // clear timetable
        // create array that match role
        // redraw timetable with created array
        roleFilter = filteredRole;
        if (roleFilter !== "" && roleFilter !== undefined) {
            timetable.fullCalendar("removeEvents");

            let matchesFilters = function (item) {
                if (userFilter === "" || userFilter === undefined) {
                    return item.title === roleFilter.role_name;
                } else {
                    return item.title === roleFilter.role_name && item.employee.name === (userFilter.first_name + " " + userFilter.last_name);
                }
            };

            timetable.fullCalendar("renderEvents", getMatchingItems($scope.queriedEvents, matchesFilters));
            timetable.fullCalendar("renderEvents", getMatchingItems(newEvents, matchesFilters));
        } else if (userFilter !== "" && userFilter !== undefined){
            // the role filter is cleared but user filer is still there
            console.log("rendering the users");
            $scope.onUserFilterChange(userFilter);
        } else {
            refreshLocalTimetable();
        }
    };

    $scope.onUserFilterChange = function(filteredUser) {
        userFilter = filteredUser;
        if (userFilter !== "" && userFilter !== undefined) {
            timetable.fullCalendar("removeEvents");

            let matchesFilters = function(item) {
                if (roleFilter === "" || roleFilter === undefined) {
                    return item.employee.name === (userFilter.first_name + " " + userFilter.last_name);
                } else {
                    return item.title === roleFilter.role_name && item.employee.name === (userFilter.first_name + " " + userFilter.last_name);
                }
            };

            timetable.fullCalendar("renderEvents", getMatchingItems($scope.queriedEvents, matchesFilters));
            timetable.fullCalendar("renderEvents", getMatchingItems(newEvents, matchesFilters));

        } else if ((roleFilter !== "" && roleFilter !== undefined)){
            // the role filter is cleared but user filer is still there
            $scope.onRoleFilterChange(roleFilter);
        } else {
            refreshLocalTimetable();
        }
    };

    function refreshLocalTimetable() {
        timetable.fullCalendar("removeEvents");
        timetable.fullCalendar("renderEvents", $scope.queriedEvents);
    }

    function refetchTimetable() {
        //timetable.fullCalendar("removeEvents");
        timetable.fullCalendar("refetchEvents");
        $("select").each(function() { this.selectedIndex = 0 });
    }

    function getMatchingItems(array, matchCallback) {
        let results = [];
        for(let i = 0; i < array.length; i++) {
            if (matchCallback(array[i])) {
                results.push(array[i]);
            }
        }
        return results;
    }

    function canEditFullCalendar(triggerEvent) {
        canEdit = loginService.canEdit;
    }
});

app.service("dataService", function($rootScope, $http, messageService) {
    this.setEditFullCalendar = function() {
        $rootScope.$broadcast("canEditFullCalendar");
    };

    this.setRoles = function(roles) {
        this.roles = roles;
    };

    this.setUsers = function(users) {
        this.users = users;
    };

    this.createNewEvent = function(selectedRole, selectedUser) {
        $rootScope.$broadcast("createNewEvent", {
            details: this.details,
            selectedRole: selectedRole,
            selectedUser: selectedUser});
    };

    this.setDetails = function(details) {
        this.details = details;
    };

    this.showCreationPrompt = function() {
        $rootScope.$broadcast("showDatePrompt");
    };

    this.reload = function() {
        $rootScope.$broadcast("reloadEntireCalendar");
    };

    this.showEditingPrompt = function(event) {
        $rootScope.$broadcast("editingCurrentEvent", event);
    };

    this.deleteEvent = function(event_id, calendar_id) {
        $http.post(URL + "delete?shift_id=" + event_id)
            .then(function(success) {
                console.log(success);
                $rootScope.$broadcast("removeEvent", calendar_id);
            }, function(error) {
                console.log(error);
            });
    };

    this.updateEvent = function(event) {
        event.source = "";
        if (event.event_id !== undefined) {
            $http.post(URL + "update?shift_id=" + event.event_id,
                {updatedEvent: event})
                .then(function (success) {
                    console.log(success);
                    $rootScope.$broadcast("updateCalendarEvent", event);
                }, function (error) {
                    console.log(error);
                });
        } else {
            $rootScope.$broadcast("updateCalendarEvent", event);
        }
    }
});

app.controller("dateCreationCtrl", function($scope, messageService, dataService) {
    $scope.roles = dataService.roles;
    $scope.users = dataService.users;

    $scope.showCreationPrompt = function(triggerEvent) {
        $scope.roles = dataService.roles;
        $scope.users = dataService.users;

        $scope.$apply();

        $("#creation-prompt-overlay").show();
    };

    $scope.closePrompt = function() {
        $("#creation-prompt-overlay").hide();
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
    $scope.$on("showDatePrompt", $scope.showCreationPrompt);
});

app.controller("dateEditingCtrl", function($scope, dataService) {
    $scope.sourceEvent = {};

    $scope.approvals = [
        {name: "Approved", value: true},
        {name: "Unapproved", value: false}];

    $scope.approved = $scope.approvals[1];

    $scope.showEditingPrompt = function(triggerEvent, event) {
        console.log(event);
        $scope.sourceEvent = event;

        $scope.roles = dataService.roles;
        $scope.users = dataService.users;

        $scope.selectedRole = $scope.roles[event.role.id - 1];
        $scope.selectedUser = $scope.users[event.employee.id - 1];

        $scope.$apply();

        console.log(event.approved === true);

        if (event.approved === true) {
            $scope.approved = $scope.approvals[0];
        } else {
            $scope.approved = $scope.approvals[1];
        }

        $("#editing-prompt-overlay").show();
    };

    $scope.deleteEvent = function() {
        dataService.deleteEvent($scope.sourceEvent.event_id, $scope.sourceEvent._id);
        $scope.closeEditingPrompt();
    };

    $scope.closeEditingPrompt = function() {
        $("#editing-prompt-overlay").hide();
    };

    $scope.saveEvent = function() {
        // send this information to the server
        if ($scope.selectedRole !== undefined) {
            $scope.sourceEvent.role.id = $scope.selectedRole.role_id;
            $scope.sourceEvent.role.name = $scope.selectedRole.role_name;
            $scope.sourceEvent.title = $scope.selectedRole.role_name;
            $scope.sourceEvent.role_description = $scope.selectedRole.role_description;
        }
        if ($scope.selectedUser !== undefined) {
            $scope.sourceEvent.employee.name = $scope.selectedUser.first_name + " " + $scope.selectedUser.last_name;
            $scope.sourceEvent.employee.id = $scope.selectedUser.user_id;
        }
        if ($scope.approved !== undefined ) {
            $scope.sourceEvent.approval = $scope.approved.value;
        }
        dataService.updateEvent($scope.sourceEvent);
        $scope.closeEditingPrompt();
    };

    $scope.$on("editingCurrentEvent", $scope.showEditingPrompt);
});