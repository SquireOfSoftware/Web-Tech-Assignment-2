
const HELLO_WORLD = function() {
    console.log("Hello world");
};

HELLO_WORLD();

const BODY = document.getElementById("body");

//BODY.innerHTML = "HELLO WORLD";

const REST_API_URL = "rest/1/";

function queryServer(url, callback) {
    // try and visit localhost:3000
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:3000/" + url, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = callback;
}

function processRequest(e) {
    console.log(e);
    //BODY.innerHTML = e.currentTarget.response;
    let week = e.currentTarget.response;
    buildTable(week);
}

//queryServer("", processRequest);

queryServer(REST_API_URL + "week/current", processRequest);