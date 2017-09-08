let app = angular.module("myApp", []);
app.controller("calendarCtrl", function($scope, $http) {
    $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    $scope.hasLoaded = false;

    let timetable = new Timetable();
    timetable.setScope(8, 20);
    timetable.addLocations($scope.days);

    let timetableRenderer = new Timetable.Renderer(timetable);

    const REST_API_URL = "rest/1/";
    const SERVER_URL = "http://localhost:3000/";

    $scope.init = function() {

        //createDummyData(timetable);
        queryServer();


    };

    function createDummyData(timetable) {
        timetable.addEvent("", "Monday", new Date(2017, 9, 8, 9, 30), new Date(2017, 9, 8, 13, 30));
        timetable.addEvent("", "Tuesday", new Date(2017, 9, 8, 8, 30), new Date(2017, 9, 8, 17, 30));
        timetable.addEvent("", "Wednesday", new Date(2017, 9, 8, 11, 30), new Date(2017, 9, 8, 13, 30));

        timetable.addEvent("", "Friday", new Date(2017, 9, 8, 9, 30), new Date(2017, 9, 8, 13, 30));
        timetable.addEvent("", "Friday", new Date(2017, 9, 8, 9, 30), new Date(2017, 9, 8, 17, 30));
    }

    function queryServer() {
        $http.get(SERVER_URL + REST_API_URL + "test")
            .then(function (response) {
                // response is a pack of days
                parseIntoTimetable(response.data);
                //timetableRenderer = new Timetable.Renderer(timetable);
                timetableRenderer.draw('.timetable');
                console.log("test");
                $scope.hasLoaded = true;
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function parseIntoTimetable(weekData) {

        for(let i = 0; i < weekData.days.length; i++) {
            console.log(weekData.days[i]);
            let start = convertTimeToDate(weekData.days[i].shift_start, weekData.days[i].day_date);
            let end = convertTimeToDate(weekData.days[i].shift_end, weekData.days[i].day_date);

            timetable.addEvent(weekData.days[i].shift_id,
                weekData.days[i].day_name,
                start,
                end);
        }
        console.log(timetable);

    }

    function convertTimeToDate(time, loggedDate) {
        //let date = new Date('1970-09-08T' + time + 'Z');
        // 12, replacing up to 20
        //console.log(loggedDate, typeof(loggedDate));
        let dateStrings = loggedDate.slice(0, 11) + time + loggedDate.slice(19, loggedDate.length - 1) + "Z";
        console.log(dateStrings);
        let date = new Date(dateStrings);
        date.setHours(date.getHours() + 14);
        console.log(date);
        return date;
        //return new Date(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes());
    }
});
