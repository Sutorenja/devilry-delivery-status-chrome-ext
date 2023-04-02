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
        if (content.length === 0) {
            gradedAssignments.push(content);
            return;
        }

       createTimeUntil(deadline[0]);
       createDeliveryStatus(content[0], fileAmount[0].innerHTML.replace(/[^0-9]/g, ''));
    });
}

// adds text that says how much time is left until the deadline.
// if deadline has passed, text will say "deadline has passed".
// manipulates a <span> element.
function createTimeUntil(element) {
    // let dateString = element.lastElementChild.textContent.trim();
    let dateString = element.getElementsByClassName("devilry-cradmin-groupitemvalue-deadline__datetime")[0].textContent.trim();
    let currentTime = new Date();
    let deadline = new Date(dateString); // using Date(dateString) can be problematic: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#syntax
    let interval = deadline.getTime() - currentTime.getTime();
    let color = "black";
    let text;

    if (isNegative(interval)) {
        text = "Deadline has passed";
        color = "Gray";
    } else {
        text = "due in " + getDateString(interval);
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
}

// The function just does the actual manipulation of the DOM.
// element is usually a <span> element.
// fileAmount is an int.
function createDeliveryStatus(element, fileAmount) {
    let text = (parseInt(fileAmount) > 0 ? "Delivered" : "Not delivered");
    let color = (parseInt(fileAmount) > 0 ? "DarkGreen" : "Red"); // maybe switch from 'Red' to 'OrangeRed'

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
    // if (DEBUG) mutations.forEach(mutation => console.log(mutation))
    if (window.location.href.startsWith("https://devilry.ifi.uio.no/devilry_student")) {
        setStatus();
    }
}

function createOptionIcons() {
    let wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.display = "flexbox";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignContent = "center";
    // wrapper.style.justifyContent = "center";

    // TODO align it in the center

    /*let input = document.createElement("input");
    input.setAttribute("id", "devilry-extension-go-to-options");
    input.setAttribute("type", "image");
    input.setAttribute("title", "Extension options");
    input.setAttribute("src", chrome.runtime.getURL("images/icon-48-settings.png"));
    input.style.paddingRight = "10px";*/

    const createOption = lang => {
        let option = document.createElement("option");
        option.setAttribute("value", lang);
        option.innerHTML = lang.toUpperCase();

        // if (lang === "en") option.setAttribute("default", "true");

        return option;
    }

    let darkmodeCheckbox = document.createElement("input");
    darkmodeCheckbox.setAttribute("id", "devilry-extension-option-darkmode");
    darkmodeCheckbox.setAttribute("title", "Toggle darkmode");
    darkmodeCheckbox.setAttribute("class", "devilry-extension-checkbox"); // TODO generic css for all dropdown goes in ".devilry-extension-checkbox" and specific css for dark mode goes in "#devilry-extension-option-darkmode"
    darkmodeCheckbox.type = "checkbox";
    // darkmodeCheckbox.style.paddingRight = "10px";

    let langDropdown = document.createElement("select");
    langDropdown.setAttribute("id", "devilry-extension-option-language");
    langDropdown.setAttribute("title", "Change extension language"); // TODO same as darkmode (generic/specific css)
    langDropdown.setAttribute("name", "language");
    langDropdown.setAttribute("class", "devilry-extension-dropdown");
    langDropdown.appendChild(createOption(NORWEGIAN));
    langDropdown.appendChild(createOption(ENGLISH));
    // langDropdown.style.paddingRight = "10px";

    let menu = document.querySelector(".cradmin-legacy-menu-content-footer");

    /*wrapper.appendChild(darkmodeCheckbox);
    wrapper.appendChild(langDropdown);
    menu.insertBefore(wrapper, menu.firstElementChild);*/
    menu.insertBefore(darkmodeCheckbox, menu.firstElementChild);
    menu.insertBefore(langDropdown, menu.firstElementChild);

    const callback = evt => {
        switch(evt.currentTarget.id) {
            case "devilry-extension-option-darkmode":
                console.log("Darkmode: " + evt.currentTarget.checked);
                enableDark();
                break;
            case "devilry-extension-option-language":
                console.log("Language switched to: " + evt.currentTarget.item(evt.currentTarget.selectedIndex).value);
                setLanguage(evt.currentTarget.item(evt.currentTarget.selectedIndex).value);
                break;
        }

        save_options();
        setStatus(); // reload extension
    }

    darkmodeCheckbox.addEventListener("change", callback);
    langDropdown.addEventListener("change", callback);

    /*darkmodeCheckbox.addEventListener("change", () => {
        if (darkmodeCheckbox.checked) console.log("darkmode: on");
        else console.log("darkmode: off");

        save_options();
        setStatus(); // reload extension
    });

    langDropdown.addEventListener("change", (evt) => {
        console.log("language switched to: " + langDropdown.item(langDropdown.selectedIndex).value);

        save_options();
        setStatus(); // reload extension
    });*/

    // menu.insertBefore(input, menu.firstElementChild);

    // input.addEventListener("click", () => {
        // console.log("CLICK");
        // T0D0 (maybe) create an iframe and put the options.html inside
        // chrome.runtime.openOptionsPage();
        // chrome.runtime.sendMessage("showOptions");
        /*if (chrome.runtime.openOptionsPage) {
            console.log("chrome.runtime.openOptionsPage");
            chrome.runtime.openOptionsPage();
        } else {
            console.log("else");
            window.open(chrome.runtime.getURL('options.html'));
        }*/
    // });

}

// entry point
setObservers(observerCallback);
setStatus();
createOptionIcons();

/*if(!ALL_OPTIONS_OFF) {
    setObservers(observerCallback);
    // setLang();
    setStatus();
    createOptionIcons();
}*/

// initContentScript(observerCallback);
