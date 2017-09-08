let app = angular.module("myApp", []);
app.controller("calendarCtrl", function($scope, $http) {
    $scope.days = [
        {
            name: "Monday"
        },
        {
            name: "Tuesday"
        },
        {
            name: "Wednesday"
        },
        {
            name: "Thursday"
        },
        {
            name: "Friday"
        },
        {
            name: "Saturday"
        },
        {
            name: "Sunday"
        }
    ];

    $scope.hasLoaded = false;

    $scope.init = function() {
        queryServer()

        $scope.hasLoaded = true;
    };

    let timetable = new Timetable();
    timetable.setScope(8, 18);
    timetable.addLocations(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

    let timetableRenderer = new Timetable.Renderer(timetable);
    timetableRenderer.draw('.timetable');

});
