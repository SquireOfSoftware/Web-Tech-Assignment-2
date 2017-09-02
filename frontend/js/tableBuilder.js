const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];

setupWeek();

function setupWeek() {
    let BODY = document.getElementById("week");
    for (let i = 0; i < days.length; i++) {
        BODY.appendChild(setupDay(days[i]));
    }
}

function setupDay(name) {
    let day = document.createElement("div");
    day.setAttribute("id", name);
    day.setAttribute("class", "day");
    day.innerHTML = name;
    day.appendChild(setupTimes());

    return day;
}

function setupTimes() {
    let dayTimes = document.createElement("div");
    for (let i = 0; i < times.length; i++) {
        dayTimes.appendChild(setupTime(times[i]));
    }
    return dayTimes;
}

function setupTime(time) {
    let timeslot = document.createElement("div");
    timeslot.setAttribute("class", time + " time");
    return timeslot;
}

function buildTable (weekData) {
    // run through the object
    // run through day by day

    // could use angular and tag things appropriately
    let BODY = document.getElementById("body");
    //BODY.innerHTML = buildDay("Monday");
    BODY.innerHTML = "";
    weekElement = "";
    //weekElement.push()
    //console.log(weekData[0]);
    for (let i = 0; i < weekData.length; i++) {

        let dayData = buildDay(weekData[i]);
        BODY.appendChild(dayData);
    }
}

function buildDay(dayData) {
    let dayElement = document.createElement("div");
    dayElement.setAttribute("id", dayData.name);
    dayElement.innerHTML = dayData.name;
    console.log(dayElement, dayData);
    dayElement.appendChild(buildTimes(dayData.shifts));
    return dayElement;
}

function buildTimes(shiftsData) {
    let timesElement = document.createElement("div");
    timesElement.setAttribute("id", shiftsData.id);
    // for (let i = 0; i < shiftsData.length; i++) {
    //     timesElement.appendChild(buildTime(shiftsData[i]));
    // }

    return timesElement;
}

function buildTime(shiftData) {
    let timeElement = document.createElement("div");
    timeElement.setAttribute("id", shiftData.id);


    return timeElement;
}