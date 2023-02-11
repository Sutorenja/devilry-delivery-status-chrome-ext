/*
- FYI this code is very sloppy.

- It's my first time writing in js and my first time writing a Chrome extension. I don't really know what I'm doing.

- My only goal was to finish this extension as fast as possible, with practically no effort put into readability.
*/

const DEBUG = true;
const collectionUpcoming = document.getElementsByClassName("devilry-student-dashboard-upcoming-assignments");
const collectionAll = document.getElementsByClassName("devilry-student-dashboard-all-assignments");

// function that goes through every assignment in the "Upcoming assignments" dashboard and checks the status of them.
// status being whether they are delivered or not.
// if fileAmount is greater than 0, then assignment is delivered, else not delivered.
function setStatusUpcoming() {
    Array.from(collectionUpcoming).forEach(element => {
        let listUpcoming = element.getElementsByTagName("ol")[0];

        // each children is a row in "Upcoming assignments"
        // for each row, check status (either delivered or not delivered)
        // and create new textNode and append it to the row
        Array.from(listUpcoming.children).forEach(element => {

            // this massive block just gets the correct element, extracts the number of files from it and returns it as an int.
            let fileAmount = element.firstElementChild.firstElementChild
                .getElementsByClassName("devilry-cradmin-groupitemvalue-comments")[0]
                .firstElementChild.getElementsByClassName("devilry-core-comment-summary-studentfiles")[0]
                .innerHTML.replace(" ", "").replace(/[^0-9]/g, '');

            // add a span with a textNode to this, either "delivered" or "not delivered"
            let content = element.firstElementChild.firstElementChild.getElementsByClassName("devilry-cradmin-groupitemvalue-status")[0];

            createStatus(fileAmount, content);
        });
    });
}

// function that goes through every assignment in the "All assignments" dashboard and checks the status of them.
function setStatusAll() {
    Array.from(collectionAll).forEach(element => {
        // list var is defined cause there's a ton of other elements before u finally get to the ordered list, unlike
        // devilry-student-dashboard-upcoming-assignments, where the ordered list comes directly after.
        // besides that, they should are the same, with one discrepancy (see below).
        let list = element.firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByTagName("ol")[0].children;

        Array.from(list).forEach(element => {
            let fileAmount = element.firstElementChild.firstElementChild
                .getElementsByClassName("devilry-cradmin-groupitemvalue-comments")[0]
                .firstElementChild.getElementsByClassName("devilry-core-comment-summary-studentfiles")[0]
                .innerHTML.replace(" ", "").replace(/[^0-9]/g, '');

            let content = element.firstElementChild.firstElementChild.getElementsByClassName("devilry-cradmin-groupitemvalue-status");

            // not all listings have a "devilry-cradmin-groupitemvalue-status" element.
            // any assignment that has been graded is considered a "devilry-cradmin-groupitemvalue-grade" element instead.
            // the delivery status of those is irrelevent, so we just skip them completely.
            // if content is 0, it means that no delivery status was found (likely because it's "grade" instead)
            if (content.length === 0 ) return;

            createStatus(fileAmount, content[0]);
        });
    });
}

// just made this function, so I don't have to repeat 10 lines of code.
// The function just does actual manipulation of the DOM.
// content is usually a <span> element.
// fileAmount is an int.
function createStatus(fileAmount, content) {
    let text = (parseInt(fileAmount) > 0 ? "Delivered" : "Not delivered");
    let color = (parseInt(fileAmount) > 0 ? "green" : "red");
    let status = document.createElement("span");
    let strong = document.createElement("strong"); // need this to make the text bold.

    strong.appendChild(document.createTextNode(text));
    strong.style.color = color;

    status.appendChild(strong);
    content.appendChild(status);
}

// this function is necessary to force the extension to "update", even when the page doesn't physically change.
// (i.e. doing something on the page that updates the DOM of the page WITHOUT actually ever switching pages).
// The extension's content script only reloads when you switch pages/reload the page.
// so if you dynmically change some HTML element, the extension won't reload to account for it.
// the MutationObserver fixes that issue by alerting the extension of changes in the DOM,
// so the extension can properly handle them.
function initContentScript(callbackUpcoming, callbackAll) {
    const options = { attributes: true, childList: true }; // subtree set to true is a BAD idea usually.
    const observerUpcoming = new MutationObserver(callbackUpcoming);
    const observerAll = new MutationObserver(callbackAll);

    // this code only observes the FIRST element of each (all assignments, and upcoming)
    // this is fine because they all change in unison, if the first one changed, they all changed and need to be updated with all() or upcoming()
    // for some reason, the parent elements of the ordered lists is different between the different views of the same page
    // and so the entire ordered list gets swapped out, which is outside the observers view.
    // by observing the parents as well, the code should be able to detect when the entire ordered list gets swapped out as well.
    let nodeUpcoming = Array.from(collectionUpcoming[0].children).pop();
    let nodeAll = collectionAll[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.firstElementChild;
    let nodeUpcomingParent = collectionUpcoming[0];
    let nodeAllParent = collectionAll[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild;

    observerUpcoming.observe(nodeUpcoming, options); // observerUpcoming.observe(nodeUpcoming[0], options);
    observerUpcoming.observe(nodeUpcomingParent, options);

    observerAll.observe(nodeAll, options); // observerAll.observe(nodeAll[0], options);
    observerAll.observe(nodeAllParent, options);
}

// MutationObserver callback function
function observerCallbackUpcoming(mutations) {
    if (DEBUG) mutations.forEach(mutation => {console.log(mutation)})
    if (window.location.href.startsWith("https://devilry.ifi.uio.no/devilry_student")) {
        setStatusUpcoming();
    }
}

// MutationObserver callback function
function observerCallbackAll(mutations) {
    if (DEBUG) mutations.forEach(mutation => {console.log(mutation)})
    if (window.location.href.startsWith("https://devilry.ifi.uio.no/devilry_student")) {
        setStatusAll();
    }
}

setStatusAll();
setStatusUpcoming();
initContentScript(observerCallbackUpcoming, observerCallbackAll);
