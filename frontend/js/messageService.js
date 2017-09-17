app.service("messageService", function($rootScope) {
    this.setError = function(message) {
        $rootScope.$broadcast("displayError", message);
    }
});

app.controller("messageCtrl", function($scope) {
    $scope.error = {
        message: ""
    };

    $scope.$on("displayError", function(event, payload) {
        console.log(payload);
        $scope.error.message = payload;
        $("#transparent-overlay").show();
    });

    $scope.close = function() {
        $('message').hide();
        $('#transparent-overlay').hide();
    };
});

