const cors = require('cors');
const express = require('express');

const mysqlConnector = require('./mysql-connector');

let app = express();

const port = 3000;
const version = 1;

app.use(cors());

app.get('/rest/' + version + '/products/:id', function (req, res, next) {
    mysqlConnector.query("Select * from Drone",
    (result) => {
        res.json(result);
    });
});

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port);
});

