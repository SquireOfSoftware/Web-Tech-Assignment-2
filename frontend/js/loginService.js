
app.service("loginService", function($http, $rootScope, messageService) {

    this.canEdit = false;
    this.isLoggedIn = false;
    this.user = {};

    this.showLogin = function () {
        $rootScope.$broadcast("showLoginBox");
    };

    this.loginSubmit = function(email, password, callback) {
        $http.post(URL + "login", {email: email, password: password})
            .then(function(response) {
                setPermissions(response.data.can_edit === 1, true, response.data);
                // hide login window, show timetable
                callback();
            }, function(error) {
                console.log(error);
                //messageService.setError("Problem connecting to the server, please see your error logs");
                canEdit = false;
            });
    };

    function setPermissions(canEdit, isLoggedIn, email) {
        this.canEdit = canEdit;
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
            $rootScope.$broadcast("loggedIn");
        }
        this.email = email;

        console.log(this.canEdit, this.isLoggedIn, this.email);
    }

    this.logout = function() {
        this.canEdit = false;
        this.isLoggedIn = false;
        this.email = "";
    };

    this.register = function(user, callback) {
        this.user = user;
        $http.post(URL + "register", {user: user})
            .then(function(response) {
                console.log(response.data);
                callback();
            }, function(error){
                console.log(error);
            });
    }
});

app.controller("loginCtrl", function($scope, $http, loginService) {

    $scope.email = "";
    $scope.password = "";

    $scope.submit = function() {
        loginService.loginSubmit($scope.email, $scope.password, $scope.hideLogin);
    };

    $scope.$on("showLoginBox", showLogin);
    $scope.$on("hideLoginBox", $scope.hideLogin);

    function showLogin() {
        $("#login-overlay").show();
        $scope.email = "";
        $scope.password = "";
        focusOnLoginEmailField();
    }

    function focusOnLoginEmailField() {
        let emailField = $("#email-field");
        emailField.focus();
        emailField.select();
    }

    function focusOnLoginPasswordField() {
        let passwordField = $("#password-field");
        passwordField.focus();
        passwordField.select();
    }

    function focusOnRegisterFirstNameField() {
        let firstNameField = $("#register-first-name");
        firstNameField.focus();
        firstNameField.select();
    }

    $scope.hideLogin = function (){
        $("#login-overlay").hide();
        $("#login-box").show();
        $("#register-box").hide();
    };

    $scope.registeredEmail = "";
    $scope.registeredFirstName = "";
    $scope.registeredLastName = "";
    $scope.registeredPassword = "";

    $scope.register = function() {
        if (isLegitimateAccount()) {
            let user = {
                first_name: $scope.registeredFirstName,
                last_name: $scope.registeredLastName,
                email: $scope.registeredEmail,
                password: $scope.registeredPassword,
            };

            loginService.register(user, function() {
                $scope.hideLogin();
                showLogin();
                $scope.email = user.email;
                focusOnLoginPasswordField();
            });
        }
    };

    $scope.showRegister = function() {
        $("#login-box").hide();
        $("#register-box").show();
        focusOnRegisterFirstNameField();
    };

    $scope.closeRegister = function() {
        $("#register-box").hide();
        $("#login-box").show();
    };

    function isLegitimateAccount() {
        return $scope.registeredEmail !== "" &&
            $scope.registeredPassword !== "" &&
            $scope.registeredFirstName !== "" &&
            $scope.registeredLastName !== "";
    }
});