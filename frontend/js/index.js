
const HELLO_WORLD = function() {
    console.log("Hello world");
};

HELLO_WORLD();

const BODY = document.getElementById("week");

const REST_API_URL = "rest/1/";

function queryServer(url, callback) {
    // try and visit localhost:3000
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:3000/" + REST_API_URL + url, true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = callback;
}

function processRequest(e) {
    if(BODY.filled === undefined) {
        let week = e.currentTarget.response;
        buildTable(JSON.parse(week).days);
        BODY.filled = true;
    }
}

//queryServer("week/current", processRequest);

queryServer("test", processRequest);