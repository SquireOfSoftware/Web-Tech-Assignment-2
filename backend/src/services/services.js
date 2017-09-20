require('module');
const mysqlConnector = require('./../mysql-connector');
const moment = require('moment');

function getWeekFromDate(date) {
    // should get "2017-09-04T14:00:00.000Z"
    // format is ISOString
    let x = new Date();
    // gets current date

    // we need to figure out what week we are on to get the respective data

    // can hard code it, look for data given a particular day

}

function getWeekTemplate() {
    return {
        name: "week",
        shifts: [
            {
                name: "Monday",
                shifts: [
                    {
                        id: 1,
                        start: "time",
                        end: "time",
                        user: "joseph"
                    },
                    {
                        id: 2,
                        start: "time",
                        end: "time"
                    }
                ]
            },
            {
                name: "Tuesday",
                shifts: [
                    {
                        id: 3,
                        start: "time",
                        end: "time"
                    },
                    {
                        id: 4,
                        start: "time",
                        end: "time"
                    }
                ]
            }
        ]
    }
}

function getCurrentWeek(callback) {
    mysqlConnector.query("SELECT * from Shift " +
        "WHERE Shift.day_date = Day.day_date AND " +
        "Day.day_date = Week",
        function (result) {
            callback(result);
        });
}

function getDummyCurrentWeek(callback) {
    callback([
        {
            name: 'Monday',
            shifts: [
                {
                    id: 1,
                    start: "08:00:00",
                    end: "11:00:00",
                    role: "cook",
                    user: "JosephTran",
                }, {
                    id: 2,
                    start: "12:00:00",
                    end: "17:00:00",
                    role: "cook",
                    user: "JosephTran",
                }
            ]
        }
    ]);
}

function getDummyDateRange(req, callback) {
    console.log(req.query);
    // parse the query make sure they are legit dates
    // place a limit of 1000 events max to retrieve
    callback([
        {
            title: 'Joseph',
            start: '2017-09-12T14:00:00.000Z',
            //allDay: true
            end: '2017-09-12T17:00:00.000Z',
        },
        {
            title: 'Richard',
            start: '2017-09-13T09:00:00.000Z',
            end: '2017-09-13T15:00:00.000Z'
        },
        {
            title: 'Mark',
            start: '2017-09-11T09:00:00.000Z',
            end: '2017-09-11T17:00:00.000Z'
        },
        {
            title: 'Daniel',
            start: '2017-09-15T08:00:00.000Z',
            end: '2017-09-15T09:00:00.000Z'
        },
        {
            title: 'Greg',
            start: '2017-09-15T13:00:00.000Z',
            end: '2017-09-15T18:00:00.000Z'
        }
    ]);
}

function getDateRangeForAUser(req, callback) {
    console.log(req.query);

    let email = req.query.email;
    let startDate = req.query.shift_start;
    let endDate = req.query.shift_end;
    // please sanitise this

    //mysqlConnector.query("select shift_start, shift_end, User.first_name, User.last_name from Shift, User\n" +
    //    "where (User.user_id = Shift.user_id) and (User.email LIKE \"%" + email + "%\");",
    mysqlConnector.query("select shift_start, shift_end, User.first_name, User.last_name, Role.role_name from Shift, User, Role\n" +
        "where (User.user_id = Shift.user_id) and (User.email LIKE \"%" + email +  "%\") and \n" +
        "(Shift.shift_start < \"" + endDate + "\") and \n" +
        "(Shift.shift_end > \"" + startDate + "\") and \n" +
        "(Role.role_id = Shift.role_id);",
        function(result) {
            let output = [];
            for(let i = 0; i < result.length; i++ ) {
                output.push(parseToTimetableJSInput(result[i]));
            }
            callback(output);
        });
}

function parseToTimetableJSInput(rawData) {
    //const AEST = "";

    let startDate = moment(rawData.shift_start.toUTCString());
    let endDate = moment(rawData.shift_end.toUTCString());

    console.log(startDate);

    return {
        //title: rawData.first_name + " " + rawData.last_name,
        title: rawData.role_name,
        description: "(" + rawData.first_name + " " + rawData.last_name + ")",
        start: startDate.add(10, 'hours'),//moment(startDate + startDate.add(9, 'hours')),
        end: endDate.add(10, 'hours') //moment(endDate + endDate.getHours().add(9, 'hours'))
    };
}

function insertDates(req, callback) {
    // check for valid user
    // check for any dates, ideally should not duplicate
    // insert into db
    console.log(req.query.email);
    mysqlConnector.query("select User.email, User.user_id from User where User.email = '" + req.query.email + "';", function(result, error) {
        if (error || result.length === 0) {
            callback("Could not find user", true);
            return;
        }
        console.log(result);
        //callback("Found user", false);
        let userId = result[0].user_id;
        console.log(userId);
        let insertionData = req.body.newEvents;
        console.log(insertionData);
        mysqlConnector.query("select * from Shift where Shift.user_id = '" + userId + "'", function(result, error) {
            if (error) {
                callback("Could not locate the database", true);
                return;
            } else {//if (result.length !== 0) {
                console.log("up to insertion");
                for (let i = 0; i < insertionData.length; i++) {
                    // assumes the role already exists
                    let item = insertionData[i];
                    let query = "insert into shift (shift_start, shift_end, user_id, role_id, approved)" +
                            " values ('" + item.start + "','" + item.end + "'," + userId + "," + 1 + "," + "FALSE" + ")";
                    console.log(query);
                    mysqlConnector.query(query, function(result, error) {
                        if (error) {
                            callback("Could not locate the database", true);
                        } else {
                            callback("SUCCESS!", false);
                        }
                    });
                }

                //callback("SUCCESS!", false);

                //
                // insertionData.forEach(function(item) {
                //     let query = "insert into shift (shift_start, shift_end, user_id, role_id, approved)" +
                //         " values (" + item.start + "," + item.end + "," + userId + "," + 1 + "," + "FALSE" + ")";
                //     console.log(query);
                //     mysqlConnector.query(query, function(result, error) {
                //         if (error) {
                //             callback("Could not locate the database", true);
                //         } else {
                //             callback("SUCCESS!", false);
                //         }
                //     });
                // });
                //callback("not finished yet", true);
            }
        })
    })
}

function getRoles(callback) {
    mysqlConnector.query("select role_name, role_description from Role", function(result, error) {
        if (error) {
            callback("Could not locate any roles", true);
        } else {
            callback(result, false);
        }
    })
}

function respond(request) {
    switch(request.url) {
        case '/week/current':
            return getDummyCurrentWeek();
        default:
            return {message: "not supported path"};
    }
}

module.exports = {
    getCurrentWeek: getDummyCurrentWeek,
    respond: respond,
    getWeekTemplate: getWeekTemplate,
    getDummyDateRange: getDummyDateRange,
    getDateRangeForAUser: getDateRangeForAUser,
    insertDates: insertDates,
    getRoles: getRoles
};