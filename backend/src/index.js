const cors = require('cors');
const express = require('express');
const mysqlConnector = require('./mysql-connector');
const services = require('./services/services');

let app = express();

const port = 3000;
const version = 1;
const REST_PREFIX = '/rest/' + version;

app.use(cors());
//
// app.get(REST_PREFIX + "/:url", function(req, res, next) {
//     res.json(services.respond(req));
// });

app.get(REST_PREFIX + '/products/:id', function (req, res, next) {
    mysqlConnector.query("Select * from Drone",
    (result) => {
        res.json(result);
    });
});

app.get(REST_PREFIX + '/week/current', function(req, res, next) {
    console.log(req.url);
    res.json(services.getCurrentWeek());
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});
