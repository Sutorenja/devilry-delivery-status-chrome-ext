/*
- DICLAIMER this code is very sloppy.

- It's my first time writing in js and my first time writing a Chrome extension. I don't really know what I'm doing.

- My only goal was to finish this extension as fast as possible, with practically no effort put into readability.
*/

/* TODO PLAN:
    get options popup working
    add dropdown for language and make sure it works with saving/restoring options
    1.3: add night mode
    ///
    2. (am lazy rn) fix known bug: when switching filter, deadline status changes to "AAAAAA something went wrong"...
    3. test that the PLURAL_MARKER and all the time related features are actually working (you can manually set the time of the currentTime object)
 */

const gradedAssignments = [];

// function that goes through every assignment and checks their delivery status.
// if 'student files' (fileAmount) is greater than 0, then assignment is delivered, else not delivered.
function setStatus() {
    // "cradmin-legacy-listbuilder-itemframe" is the class that all the rows in the list of assignments use.
    Array.from(document.getElementsByClassName("cradmin-legacy-listbuilder-itemframe")).forEach(element => {
        let fileAmount = element.getElementsByClassName("devilry-core-comment-summary-studentfiles");
        let content = element.getElementsByClassName("devilry-cradmin-groupitemvalue-status");
        let deadline = element.getElementsByClassName("devilry-cradmin-groupitemvalue-deadline");

        // if length is 0, it means there is no delivery status. This happens when the assignment gets graded
        // (where the deilvry status gets replaced with a grade).
        if (content.length === 0 ) {
            gradedAssignments.push(content);
            return;
        }

        if (DEADLINE_STATUS) createTimeUntil(deadline[0]);
        if (DELIVERED_STATUS) createDeliveryStatus(content[0], fileAmount[0].innerHTML.replace(/[^0-9]/g, ''));
    });
}

// adds text that says how much time is left until the deadline.
// if deadline has passed, text will say "deadline has passed".
// manipulates a <span> element.
function createTimeUntil(element) {
    let dateString = element.lastElementChild.textContent.trim();
    let currentTime = new Date();
    let deadline = new Date(dateString); // using Date(dateString) can be problematic: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#syntax
    let interval = deadline.getTime() - currentTime.getTime();
    let text = "Something went wrong"; // keep this value for debugging purposes
    let color = "black";

    if (isNegative(interval)) {
        text = "Deadline has passed";
        color = "Gray";
    } else {
        text = getDateString(interval);
    }

    let textElementCollection = element.getElementsByClassName("devilry-extension-groupitemvalue-deadline-status");

    if (textElementCollection.length === 0) {
        let span = element.appendChild(document.createElement("span"));
        let strong = span.appendChild(document.createElement("strong"))

        strong.appendChild(document.createTextNode(text));
        strong.style.color = color;

        span.className = "devilry-extension-groupitemvalue-deadline-status";
    } else {
        textElementCollection[0].firstElementChild.innerHTML = text;
        textElementCollection[0].firstElementChild.style.color = color;
    }

    /*console.log("current time: " + currentTime)
    console.log("deadline time: " + deadline)
    console.log(interval)*/

    // testing:
    // currentTime.setTime(currentTime.getTime() + 60000 * 60 * 24 * 2);

    /*let intervalSeconds = deadline.getTime() / 1000 - currentTime.getTime() / 1000;
    let intervalMinutes = intervalSeconds / 60;
    let intervalHours = intervalMinutes / 60;
    let intervalDays = intervalHours / 24;
    let intervalWeeks = intervalDays / 7;
    let intervalMonths = intervalWeeks / 4;
    let sign = (Math.sign(intervalDays) === -1) ? Math.sign(intervalDays) : Math.sign(Math.trunc(intervalDays));*/

    /*switch(true) {
        case (intervalMonths >= 1):
            text = `${lang[IN_TIME]} ${Math.floor(intervalMonths)} ${lang[MONTH]}`; // adds "in x unit" (e.g. "in 5 hours")
            text += (Math.floor(intervalMonths) > 1) ? lang[PLURAL_MARKER] : ""; // adds plural marker
            break;
        case (intervalWeeks >= 1):
            text = `${lang[IN_TIME]} ${Math.floor(intervalWeeks)} ${lang[WEEK]}`; // (no) lang[WEEK] = "uk"
            text += (Math.floor(intervalWeeks) > 1) ? lang[PLURAL_MARKER] : lang[SINGLE]; // lang[PLURAL_MARKER] = "er", lang[SINGLE_WEEK] = "e"
            break;
        case (intervalDays >= 1):
            text = `${lang[IN_TIME]} ${Math.floor(intervalDays)} ${lang[DAY]}`;
            text += (Math.floor(intervalDays) > 1) ? lang[PLURAL_MARKER] : "";
            text += ` ${Math.round(intervalHours - Math.floor(intervalDays) * 24)} ${lang[HOUR]}`; // WARNING: this line is untested, but it SHOULD work. Could cause bugs tho
            text += (Math.floor(intervalHours) > 1) ? lang[PLURAL_MARKER] : lang[SINGLE];
            break;
        case (intervalHours >= 1):
            let minutesLeft = intervalHours * 60 - Math.floor(intervalMinutes);
            let additionalText = "";

            if (minutesLeft <= 45) {
                additionalText =
            }
            if (minutesLeft <= 30) {

            }
            if (minutesLeft <= 15) {

            }

            // e.g. if there is 2 hours and 50 minuters left, I want it to say 3 hours
            // when it reaches the 45 minute mark, I want it to say both
            // then when it reaches the 25 minute mark, I want it to say 2 hours, which it will keep saying until it reaches 45
            // checkpoints: 45, 30, 15
            text = `${lang[IN_TIME]} ${Math.floor(intervalHours)} ${lang[HOUR]}`;
            text += (Math.floor(intervalHours) > 1) ? lang[PLURAL_MARKER] : "";
            text += ` ${Math.round(intervalMinutes - Math.floor(intervalHours) * 60)} ${lang[MINUTE]}`;
            text += (Math.floor(intervalMinutes) > 1) ? lang[PLURAL_MARKER] : lang[SINGLE];
            break;
        case (intervalMinutes >= 1):
            text = `${lang[IN_TIME]} ${Math.floor(intervalMinutes)} ${lang[MINUTE]}`;
            text += (Math.floor(intervalMinutes) > 1) ? lang[PLURAL_MARKER] : "";
            break;
        case (intervalMinutes < 1 && intervalMinutes > 0):
            text = "in less than a minute";
            break;
        case (sign === -1):
            text = "Deadline has passed";
            color = "Gray";
            break;
    }*/
}

// The function just does the actual manipulation of the DOM.
// element is usually a <span> element.
// fileAmount is an int.
function createDeliveryStatus(element, fileAmount) {
    let text = (parseInt(fileAmount) > 0 ? "Delivered" : "Not delivered");
    let color = (parseInt(fileAmount) > 0 ? "DarkGreen" : "Red"); // maybe switch from 'Red' to  'OrangeRed'

    // looks for a delivery status (span). creates a new delivery status (span) if none found.
    // if pre-existing span found, it will modify it instead of creating a new one.
    let textElementCollection = element.getElementsByClassName("devilry-extension-groupitemvalue-delivery-status");

    if (textElementCollection.length === 0) {
        let span = element.appendChild(document.createElement("span"));
        let strong = span.appendChild(document.createElement("strong"))

        strong.appendChild(document.createTextNode(text));
        strong.style.color = color;

        span.className = "devilry-extension-groupitemvalue-delivery-status";
    } else {
        textElementCollection[0].firstElementChild.innerHTML = text;
        textElementCollection[0].firstElementChild.style.color = color;
    }
}

// this function is necessary to force the extension to "update", even when the page doesn't physically change.
// (i.e. doing something on the page that updates the DOM of the page WITHOUT actually ever switching pages).
// The extension's content script only reloads when you switch pages/reload the page.
// so if you dynamically change some HTML element, the extension won't reload to account for it.
// the MutationObserver fixes that issue by alerting the extension of changes in the DOM,
// so the extension can properly handle them.
function setObservers(callback) {
    /* TODO
        inject 'settings' hyperlink (use 48x48 logo as a placeholder for now)
        node.createElement()
    */

    // for some reason, the parent elements of the ordered lists are different between the different views of the same page.
    // e.g. */filter, */filter/is_passing_grade-true, */filter/is_passing_grade-false etc.
    // and so the entire ordered list gets swapped out with a new ordered list that is not viewed by the observer.
    // by observing the parents as well, the code should be able to detect when the entire ordered list gets swapped out as well.
    let assignmentsOrderedLists = document.getElementsByClassName("cradmin-legacy-listbuilder-rowlist");
    let UpcomingListParent = document.getElementsByClassName("devilry-student-dashboard-upcoming-assignments")
    let AllListParent = document.getElementById("cradmin_legacy_listbuilderview_listwrapper");

    const options = { attributes: true, childList: true };
    const observer = new MutationObserver(callback);

    if (assignmentsOrderedLists.length === 0) return;
    if (UpcomingListParent.length === 0) return;
    if (AllListParent === null) return;

    // if one of the assignment dashboards are empty
    // if you don't have any upcoming assignments, the oredered list with the assignments will not be created
    // and assignmentsOrderedLists[1] will be 'undefined'.
    // likewise, if you don't have any assignments at all assignmentsOrderedLists[0], will be 'undefined'.
    if (typeof assignmentsOrderedLists[0] !== "undefined") observer.observe(assignmentsOrderedLists[0], options);
    if (typeof assignmentsOrderedLists[1] !== "undefined") observer.observe(assignmentsOrderedLists[1], options);
    if (typeof UpcomingListParent[0] !== "undefined") observer.observe(UpcomingListParent[0], options);
    if (typeof AllListParent !== "undefined") observer.observe(AllListParent, options);
    /*observer.observe(UpcomingListParent[0], options);
    observer.observe(AllListParent, options);*/
}

// MutationObserver callback function
function observerCallback(mutations) {
    if (DEBUG) mutations.forEach(mutation => {console.log(mutation)})
    if (window.location.href.startsWith("https://devilry.ifi.uio.no/devilry_student")) {
        setStatus();
    }
}

function createOptionsIcon() {
    let wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.display = "flexbox";
    wrapper.style.alignContent = "center";

    let input = document.createElement("input");
    input.setAttribute("id", "devilry-extension-go-to-options");
    input.setAttribute("type", "image");
    input.setAttribute("title", "Extension options");
    input.setAttribute("src", chrome.runtime.getURL("images/icon-48-settings.png"));
    input.style.paddingRight = "10px";

    let menu = document.querySelector(".cradmin-legacy-menu-content-footer");
    menu.insertBefore(input, menu.firstElementChild);

    input.addEventListener("click", () => {
        console.log("CLICK");
        // TODO (maybe) create an iframe and put the options.html inside
        // chrome.runtime.openOptionsPage();
        chrome.runtime.sendMessage("showOptions");
        /*if (chrome.runtime.openOptionsPage) {
            console.log("chrome.runtime.openOptionsPage");
            chrome.runtime.openOptionsPage();
        } else {
            console.log("else");
            window.open(chrome.runtime.getURL('options.html'));
        }*/
    });
}

// entry point
if(!ALL_OPTIONS_OFF) {
    setObservers(observerCallback);
    setLang();
    setStatus();
    createOptionsIcon();
}

// initContentScript(observerCallback);
