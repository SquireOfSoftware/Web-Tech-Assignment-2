app.controller("menuCtrl", function($rootScope, $scope, dataService, loginService) {
    $scope.isLoggedIn = false;

    $scope.showEditPage = function() {
        hideScreens();
        $('#editing').show();
    };

    $scope.showCalendar = function() {
        hideScreens();
        $('#viewing').show();
    };

    $scope.showPersonalShifts = function() {
        hideScreens();
    };

    $scope.showInfo = function() {
        hideScreens();
        $('#info').show();
    };

    $scope.reload = function() {
        dataService.reload();
    };

    $scope.sendUpdates = function() {
        $rootScope.$broadcast("sendEventUpdates");
    };

    $scope.login = function() {
        loginService.showLogin();
    };

    $scope.logout = function() {
        loginService.logout();
        $scope.isLoggedIn = false;
    };

    $scope.$on("loggedIn", function(triggerEvent, user) {
        // change screens to display
        $scope.isLoggedIn = true;
        $scope.user = user;
        console.log($scope.user);
    });

    function hideScreens() {
        $('.screen').hide();
    }
});