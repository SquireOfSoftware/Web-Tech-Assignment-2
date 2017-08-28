
const HELLO_WORLD = function() {
    console.log("Hello world");
};

HELLO_WORLD();

const BODY = document.getElementById("body");

BODY.innerHTML = "HELLO WORLD";

function queryServer() {
    // try and visit localhost:3000
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://localhost:3000", true);
    xmlHttp.send();
    xmlHttp.onreadystatechange = processRequest;
}

function processRequest(e) {
    console.log(e);
}

queryServer();