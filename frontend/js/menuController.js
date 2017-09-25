app.controller("menuCtrl", function($rootScope, $scope, dataService) {
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

    $scope.reload = function() {
        dataService.reload();
    };

    $scope.sendUpdates = function() {
        $rootScope.$broadcast("sendUpdates");
    };

    function hideScreens() {
        $('.screen').hide();
    }
});