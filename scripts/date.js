// Module for date related utils

function getMillis(interval, unit) {
    switch (unit) {
        case MONTH: return interval * 4 * 7 * 24 * 60 * 60 * 1000;
        case WEEK: return interval * 7 * 24 * 60 * 60 * 1000;
        case DAY: return interval * 24 * 60 * 60 * 1000;
        case HOUR: return interval * 60 * 60 * 1000;
        case MINUTE: return interval * 60 * 1000;
        case SECOND: return interval * 1000;
    }
    return interval;
}

function getSeconds(msInterval) {
    return msInterval / 1000;
}

function getMinutes(msInterval) {
    return msInterval / 1000 / 60;
}

function getHours(msInterval) {
    return msInterval / 1000 / 60 / 60;
}

function getDays(msInterval) {
    return msInterval / 1000 / 60 / 60 / 24;
}

function getWeeks(msInterval) {
    return msInterval / 1000 / 60 / 60 / 24 / 7;
}

function getMonths(msInterval) {
    return msInterval / 1000 / 60 / 60 / 24 / 7 / 4;
}

function isNegative(msInterval) {
    return msInterval < 0;
}

/*
    As a general rule, there can only be two time units present in a string at once
    so the string doesn't become too long and complicated and then hard to read.
    Possible strings: "2 months and 3 weeks", "1 hour and 15 seconds", or "2 days and 1 hour"
    Impossible strings: "2 months, 3 weeks, 5 days, and 2 hours" or "2 days, 1 hour, 40 minutes, and 20 seconds"
 */
function getDateString(msInterval) {
    let string = "";
    let count = 0;
    let interval = msInterval;

    const addToString = (unit, func) => {
        let time = func(interval);
        if (time >= 1) {
            let floored = Math.floor(time); // getMonths (and other funcs) return floats
            interval -= getMillis(floored, unit);
            count++;

            string += floored + " " + unit;
            if (floored > 1) string += "s ";
            else string += " ";

            string += "and ";
        }
    };

    addToString("month", getMonths);

    addToString("week", getWeeks);
    if (count === 2) return string.substring(0, string.length - 4); // removes "and " from the end of the string

    addToString("day", getDays);
    if (count === 2) return string.substring(0, string.length - 4);

    addToString("hour", getHours);
    if (count === 2) return string.substring(0, string.length - 4);

    addToString("minute", getMinutes);
    if (count === 2) return string.substring(0, string.length - 4);

    addToString("second", getSeconds);
    if (count === 2) return string.substring(0, string.length - 4);

    if (count === 1) return string.substring(0, string.length - 4);

    return string;
}

// getDateString() that supports localization
function getTranslatableDateString(msInterval) {
    let string = "";
    let count = 0;
    let interval = msInterval;

    const units = [
        {"unit": MONTH, "unit_pl": MONTHS, "func": getMonths},
        {"unit": WEEK, "unit_pl": WEEKS, "func": getWeeks},
        {"unit": DAY, "unit_pl": DAYS, "func": getDays},
        {"unit": HOUR, "unit_pl": HOURS, "func": getHours},
        {"unit": MINUTE, "unit_pl": MINUTES, "func": getMinutes},
        {"unit": SECOND, "unit_pl": SECONDS, "func": getSeconds}
    ];

    // some() will stop as soon as the callback inside of it is true
    units.some(unit => {
        let time = unit["func"](interval);

        if (time < 1) return false;

        let floored = Math.floor(time); // getMonths (and other funcs) return floats
        interval -= getMillis(floored, unit["unit"]);
        count++;

        string += floored + " ";
        if (floored > 1) string += getTranslation("unit_pl");
        else string += getTranslation("unit")
        string += " " + getTranslation(AND) + " ";

        return count === 2; // this stops the loop completely (works as a break statement)
    });

    return string;
}
