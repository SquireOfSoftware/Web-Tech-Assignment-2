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
                callback({message: "There is a problem with the database"}, true);
                connection.end();

            } else {

                //console.log(rows);
                result = rows;

                callback(result);

                connection.end();
            }
        });
    },
    santise: (text) => {
        return mysql.escape(text);
    }
};