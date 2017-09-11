const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnector = require('./mysql-connector');
const services = require('./services/services');
const login = require('./login');

let app = express();

const port = 3000;
const version = 1;
const REST_PREFIX = '/rest/' + version;

// this is used to allow js requests to come through
app.use(cors());
// this is used to interpret the body when posting stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(REST_PREFIX + '/test/', function (req, res, next) {
    mysqlConnector.query("select shift.*, day.day_name from shift, day\n" +
        "where (shift.day_date = '2017-09-05');",
    function (result, error) {
        if (error) {
            res.status(500);
            res.json(result);
        } else {
            let output = {name: "week", days: result};
            res.json(output);
        }
    });
});

app.get(REST_PREFIX + '/days/', function (req, res, next) {
    mysqlConnector.query("select * from day;", function (result) {
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

app.get(REST_PREFIX + '/date', function(req, res) {
    services.getDummyDateRange(req, function(result) {
        res.json(result);
    });
});

app.get(REST_PREFIX + '/week/:id', function(req, res, next) {
    console.log(req.url);
    res.json({});
});

app.get(REST_PREFIX + '/login', function(req, res, next) {
        console.log("login has been attempted");
        next()
    },  function( req, res) {
        var options = {
            // cannot use '-' in file paths should change project folder name
            // temporary static path
            root:'/home/mminchenko/Public/'
        };
        res.sendFile('login.html', options);
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});
