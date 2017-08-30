require('module');

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
                        end: "time"
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

function getCurrentWeek() {
    return {}
}

function getDummyCurrentWeek() {
    return [
        {
            name: 'Monday',
            shifts: [
                {
                    id: 1,
                    start: Date.now(),
                    end: Date.now() + 3
                }
            ]
        }
    ];
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