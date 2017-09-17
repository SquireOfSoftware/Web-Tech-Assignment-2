app.controller("menuCtrl", function($scope, $http) {
    $scope.showEditPage = function() {
        hideScreens();
        $('#editing').show();
    };

    $scope.showCalendar = function() {
        hideScreens();
        $('#viewing').show();
    };

    $scope.showProfile = function() {
        hideScreens();
        $('#profile').show();
    };

    $scope.showInfo = function() {
        hideScreens();
        $('#info').show();
    };

    function hideScreens() {
        $('.screen').hide();
    }
});