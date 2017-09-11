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
};