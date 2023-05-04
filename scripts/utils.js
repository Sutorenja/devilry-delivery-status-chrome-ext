// compares two assignments with each other
// used in setStatus() to remove duplicates
function compareAssignment(a1, a2) {
    if (a1.name !== a2.name) return false;
    if (a1.status !== a2.status) return false;
    if (a1.deadline !== a2.deadline) return false;
    return true;
}

function monthStringToNumber(monthString) {
    switch(monthString.toLowerCase().trim()) {
        case "januar":
            return 0;
        case "februar":
            return 1;
        case "mars":
            return 2;
        case "april":
            return 3;
        case "mai":
            return 4;
        case "juni":
            return 5;
        case "juli":
            return 6;
        case "august":
            return 7;
        case "september":
            return 8;
        case "oktober":
            return 9;
        case "november":
            return 10;
        case "desember":
            return 11;
    }
}

// FYI: this function has nothing to do with the extension language
// the extension grabs the deadline date from the DOM .
// (whose language depends on your preferred language options on the WEBSITE).
function translateDate(dateString) {
    // dersom språk er norsk vil newDate være NaN.
    // hvis dette er tilfellet, er språket til nettsiden satt på norsk,
    // og da må vi kjøre all koden under som konverterer fra norsk til et Date object.
    // dersom den IKKE er NaN (vi har suksessfullt konvertert fra DateString til Date object gjennnom new Date())
    // vet vi at språket er engelsk og da trenger vi ikke kjøre koden som oversetter.
    let newDate = new Date(dateString); // using Date(dateString) can be problematic: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#syntax
    if (!isNaN(newDate.getTime())) return newDate;

    // console.log("new date:", isNaN(newDate.getTime()))

    let date = dateString.trim();
    let splitDate = date.split(",");

    let dayAndMonth = splitDate[0].split(" ");

    let time = splitDate[2];
    let year = splitDate[1];
    let month = monthStringToNumber(dayAndMonth[2]);
    let day = dayAndMonth[1];
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];

    // console.log(splitDate)
    // console.log("month:", splitDate[2])
    // console.log(day, month, year, time)

    return new Date(Number(year), Number(month), Number(day), Number(hour), Number(minute));
}
