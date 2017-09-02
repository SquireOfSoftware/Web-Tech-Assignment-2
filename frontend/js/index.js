
const HELLO_WORLD = function() {
    console.log("Hello world");
};

HELLO_WORLD();

const BODY = document.getElementById("week");

const REST_API_URL = "rest/1/";

function queryServer(url, callback) {
    // try and visit localhost:3000
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:3000/" + url, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = callback;
}

function processRequest(e) {
    if(BODY.innerHTML === "") {
        let week = e.currentTarget.response;
        buildTable(JSON.parse(week));
    }
}

//queryServer("", processRequest);

queryServer(REST_API_URL + "week/current", processRequest);