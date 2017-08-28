const mysql = require('mysql');
require('module');

module.exports = {
    query: (queryString, callback) => {
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'Drone_Surveying_System'
        });

        let result = {};

        connection.connect();

        connection.query(queryString, function (err, rows, fields) {
            if (err) throw err;

            console.log(rows);
            result = rows;

            callback(result);
        });
    }
};