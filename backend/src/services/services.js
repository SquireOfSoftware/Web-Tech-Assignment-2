require('module');
const mysqlConnector = require('./../mysql-connector');
const moment = require('moment');

function isValid(text) {
    return text !== "" && text !== "NULL" && text !== undefined;
}

function getDateRange(req, callback) {
    let email = mysqlConnector.santise(req.query.email);
    let startDate = mysqlConnector.santise(req.query.shift_start);
    let endDate = mysqlConnector.santise(req.query.shift_end);

    let query = "select User.user_id, Role.role_id, shift_id, shift_start, shift_end, User.first_name, User.last_name, Role.role_name, Role.role_description, approved from Shift, User, Role where (User.user_id = Shift.user_id) " +
        "and (Role.role_id = Shift.role_id) and (Shift.active = TRUE)";

    if (isValid(email)) {
        query += ' and (User.email LIKE ' + email +  ')';
    }

    if (isValid(startDate) && isValid(endDate)) {
        query += ' and (Shift.shift_start < ' + (endDate) + ')\n';
        query += ' and (Shift.shift_end > ' + (startDate) + ')\n';
    }

    if (!isValid(startDate) || !isValid(endDate)) {
        query += " limit 10";
    }

    query += ";";
    mysqlConnector.query(query,
        function(result) {
            let output = [];
            for(let i = 0; i < result.length; i++ ) {
                output.push(parseToTimetableJSInput(result[i]));
            }
            callback(output, false);
        });
}

function parseToTimetableJSInput(rawData) {
    let startDate = moment(rawData.shift_start.toUTCString());
    let endDate = moment(rawData.shift_end.toUTCString());

    return {
        event_id: rawData.shift_id,
        approval: rawData.approved,
        title: rawData.role_name,
        role_description: rawData.role_description,
        start: startDate.add(10, 'hours'),
        end: endDate.add(10, 'hours'),
        employee: {
            name: rawData.first_name + " " + rawData.last_name,
            id: rawData.user_id
        },
        role: {
            name: rawData.role_name,
            id: rawData.role_id
        }
    };
}

function insert(req, callback) {

    let insertionData = req.body.newEvents;
    for (let i = 0; i < insertionData.length; i++) {
        insertSingleItem(insertionData[i], callback);
    }
    callback(returnMessage("SUCCESS!"), false);
}

function insertSingleItem(item, callback) {
    let query = "insert into shift (shift_start, shift_end, user_id, role_id, approved, active)" +
        " values ('" + item.start + "','" + item.end + "'," + item.user.user_id + "," + item.role.role_id + "," + "FALSE" + "," + "TRUE" + ")";
    console.log(query);
    mysqlConnector.query(query, function(result, error) {
        if (error) {
            callback(returnMessage("Could not locate the database"), true);
        }
    });
}

function getRoles(callback) {
    mysqlConnector.query("select role_id, role_name, role_description from Role", function(result, error) {
        if (error) {
            callback(returnMessage("Could not locate any roles"), true);
        } else {
            callback(result, false);
        }
    });
}

function getUsers(callback) {
    mysqlConnector.query("select user_id, first_name, last_name, email from User", function(result, error) {
        if (error) {
            callback(returnMessage("Could not locate any users"), true);
        } else {
            callback(result, false);
        }
    });
}

function deleteShift(req, callback) {
    // expect delete?shift_id=10231
    // get body for authorization
    let login = req.body.login;
    let shift_id = mysqlConnector.santise(req.query.shift_id);
    // search for shift id, if it exists, update to inactive
    mysqlConnector.query("select shift_id from Shift where shift_id = " + shift_id + " and active = TRUE;", function(result, error) {
        if (error || result.length === 0) {
            callback(returnMessage("Could not locate any shift"), true);
        }
        mysqlConnector.query("update shift set active = FALSE where shift_id = " + shift_id + ";", function(result, error) {
            if (error) {
                callback(returnMessage("Could not locate any shift"), true);
            } else {
                callback(returnMessage("Delete has been executed"), false);
            }
        });
    });
}

function updateShift(req, callback) {
    // expect update?shift_id=10231
    let shift_id = mysqlConnector.santise(req.query.shift_id);
    let updatedEvent = req.body.updatedEvent;
    console.log(updatedEvent);
    let approval = mysqlConnector.santise(updatedEvent.approval);
    let user_id = mysqlConnector.santise(updatedEvent.employee.id);
    let role_id = mysqlConnector.santise(updatedEvent.role.id);
    let start_time = mysqlConnector.santise(updatedEvent.start);
    let end_time = mysqlConnector.santise(updatedEvent.end);
    // search for shift id, if it exists, update to inactive

    let shiftQuery = "select shift_id from Shift where shift_id = " + shift_id + " and active = TRUE;";
    mysqlConnector.query(shiftQuery, function(result, error) {
        if (error || result.length === 0) {
            callback(returnMessage("Could not locate any shift"), true);
        }
        let query = "update shift set active = TRUE, " +
            "approved = " + (approval) + ", " +
            "user_id = " + user_id + ", " +
            "role_id = " + role_id + ", " +
            "shift_start = " + start_time + ", " +
            "shift_end = " + end_time + " " +
            "where shift_id = " + shift_id + ";";
        console.log("query: ", query);
        mysqlConnector.query(query, function(result, error) {
            if (error) {
                callback(returnMessage("Could not locate any shift"), true);
            } else {
                callback(returnMessage("Update is complete"), false);
            }
        });
    });
}

function loginUser(req, callback) {
    let email = req.body.email;
    let password = req.body.password;
    let loginQuery = "select first_name, last_name, email, password, can_edit from user where email = " + mysqlConnector.santise(email) + ";";
    mysqlConnector.query(loginQuery, function(result, error) {
        if (error || result.length === 0) {
            callback(returnMessage("Could not locate any user"), true);
        } else if (("'" + result[0].password + "'") === mysqlConnector.santise(password)) {
            let user = {
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                email: result[0].email,
                can_edit: result[0].can_edit
            };

            callback(user, false);
        } else {
            callback(returnMessage("Could not locate any user"), true);
        }
    })
}

function registerUser(req, callback) {
    let first_name = mysqlConnector.santise(req.body.user.first_name);
    let last_name = mysqlConnector.santise(req.body.user.last_name);
    let email = mysqlConnector.santise(req.body.user.email);
    let password = mysqlConnector.santise(req.body.user.password);

    let can_edit = mysqlConnector.santise(req.body.user.can_edit);
    // check if email is not taken

    console.log(can_edit);
    if (can_edit !== "'TRUE'") {
        can_edit = 'FALSE';
    } else {
        can_edit = 'TRUE';
    }

    mysqlConnector.query("select email from user where email = " + email, function(result, error) {
        if (error || result.length > 0) {
            callback(returnMessage("Email already exists"), false);
        } else {
            let registerQuery = "insert into user (first_name, last_name, email, password, salt, can_edit) " +
                "values (" + first_name + "," + last_name + "," + email + "," + password + ",123, " + can_edit + ");";
            mysqlConnector.query(registerQuery, function(result, error) {
                if (error) {
                    callback(returnMessage("Could not add the user"), true);
                }
                callback(returnMessage("Successfully registered user " + email));
            });
        }
    });
}

function returnMessage(message) {
    return {"message": message};
}

module.exports = {
    getDateRange: getDateRange,
    getRoles: getRoles,
    getUsers: getUsers,
    insert: insert,
    deleteShift: deleteShift,
    updateShift: updateShift,
    loginUser: loginUser,
    registerUser: registerUser
};