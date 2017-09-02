const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnector = require('./mysql-connector');
const services = require('./services/services');

let app = express();

const port = 3000;
const version = 1;
const REST_PREFIX = '/rest/' + version;

// this is used to allow js requests to come through
app.use(cors());
// this is used to interpret the body when posting stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(REST_PREFIX + '/products/:id', function (req, res, next) {
    mysqlConnector.query("Select * from Drone",
    function (result) {
        res.json(result);
    });
});

app.get(REST_PREFIX + '/week/current', function(req, res, next) {
    console.log(req.url);
    //res.json(services.getCurrentWeek());
    services.getCurrentWeek(function(result) {
        res.json(result);
    });
});

app.get(REST_PREFIX + '/week/:id', function(req, res, next) {
    console.log(req.url);
    res.json({});
});

app.post(REST_PREFIX + '/login', function(req, res, next) {
    console.log("login has been attempted");
    console.log(req.body);
    res.json({message: "good login"});
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});
