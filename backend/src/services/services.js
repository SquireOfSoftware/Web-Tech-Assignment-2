require('module');

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
    getWeekTemplate: getWeekTemplate
};