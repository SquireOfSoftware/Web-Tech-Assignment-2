
app.service("loginService", function($http, messageService) {
    this.loginSubmit = function(base64encoding, callback) {
        $http.post(SERVER_URL + REST_API_URL + "login", {credentials: base64encoding})
            .then(function(response) {
                console.log(base64encoding);
            }, function(error) {
                console.log(error);
                messageService.setError("Problem connecting to the server, please see your error logs");
            });
    }
});

app.controller("loginCtrl", function($scope, $http, loginService) {

    $scope.email = "";

    $scope.password = "";

    $scope.submit = function() {

        loginService.loginSubmit("");
    }
});