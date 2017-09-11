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
        editable: false,
        contentHeight: 600,
    };

    $scope.init = function() {


        //$('.timetable').fullCalendar();

        queryServer();
    };

    function queryServer() {
        $http.get(SERVER_URL + REST_API_URL + "test")
            .then(function (response, error) {
                // response is a pack of days
                if (error) {
                    console.log(error);
                } else {
                    console.log("test");
                    options.
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
