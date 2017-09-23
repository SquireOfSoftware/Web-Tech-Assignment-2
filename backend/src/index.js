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
    mysqlConnector.query("select * from shift;",
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
    console.log(req.url);
    services.getDateRange(req, function(result) {
        res.json(result);
    });
});

app.get(REST_PREFIX + '/week/:id', function(req, res, next) {
    console.log(req.url);
    res.json({});
});

app.post(REST_PREFIX + '/login', function(req, res, next) {
        console.log("login has been attempted");
        next()
    },  function( req, res) {
        let options = {
            // cannot use '-' in file paths should change project folder name
            // temporary static path
            root:'/home/mminchenko/Public/'
        };
        //res.sendFile('login.html', options);
    res.json({message: "TEST"});
});

app.get(REST_PREFIX + '/roles', function(req, res) {
    services.getRoles(function(result, error) {
        if (error) {
            res.status = 406;
        }
        res.json(result);
    })
});

app.get(REST_PREFIX + '/users', function(req, res) {
    services.getUsers(function(result, error) {
        if (error) {
            res.status = 406;
        }
        res.json(result);
    })
});

app.post(REST_PREFIX + "/insert", function(req, res) {
    services.insert(req, function(result, error) {
        if (error) {
            res.status = 406;
        }
        res.json(result);
    });
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});
