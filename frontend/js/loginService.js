
app.service("loginService", function($http, messageService) {
    this.loginSubmit = function(email, password, callback) {
        $http.post(SERVER_URL + REST_API_URL + "login", {email: email, password: password})
            .then(function(response) {
                console.log(response);
                if (response.can_edit) {
                    this.canEdit = true;

                    // hide login window, show timetable
                }
            }, function(error) {
                console.log(error);
                //messageService.setError("Problem connecting to the server, please see your error logs");
            });
    };
});

app.controller("loginCtrl", function($scope, $http, loginService) {

    $scope.email = "";

    $scope.password = "";

    $scope.submit = function() {
        loginService.loginSubmit($scope.email, $scope.password);
        $scope.email = "";
        $scope.password = "";
    }
});