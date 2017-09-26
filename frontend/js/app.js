let app = angular.module("myApp", []);

const REST_API_URL = "rest/1/";
const SERVER_URL = "http://localhost:3000/";
const URL = SERVER_URL + REST_API_URL;

const DUMMY_EMAIL = "John.smith@gmail.com";

$('.screen').hide();
$('#login').show();
//$('#viewing').show();
