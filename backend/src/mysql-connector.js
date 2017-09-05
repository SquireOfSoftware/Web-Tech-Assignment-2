const mysql = require('mysql');
require('module');

module.exports = {
    query: (queryString, callback) => {
        let connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'scheduledb'
        });

        let result = {};

        connection.connect();

        connection.query(queryString, function (err, rows, fields) {
            if (err) {
                connection.end();
                throw err;
            }

            console.log(rows);
            result = rows;

            callback(result);

            connection.end();
        });
    }
};