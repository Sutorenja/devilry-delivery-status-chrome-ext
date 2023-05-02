/*
- DICLAIMER this code is very sloppy.

- It's my first time writing in js and my first time writing a Chrome extension. I don't really know what I'm doing.

- My only goal was to finish this extension as fast as possible, with practically no effort put into readability.
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
        // (where the delivery status gets replaced with a grade).
        if (content.length === 0) {
            gradedAssignments.push(content);
            return;
        }

       createDeadlineStatus(deadline[0]);
       createDeliveryStatus(content[0], fileAmount[0].innerHTML.replace(/[^0-9]/g, ''));
    });

    if (darkened) enableDark(); // setStatus() is the only function that gets called when the DOM changes. We want to update dark mode with DOM changes.
}

// adds text that says how much time is left until the deadline.
// if deadline has passed, text will say "deadline has passed".
// manipulates a <span> element.
function createDeadlineStatus(element) {
    let dateString = element.getElementsByClassName("devilry-cradmin-groupitemvalue-deadline__datetime")[0].textContent.trim();
    let currentTime = new Date();
    let deadline = new Date(dateString); // using Date(dateString) can be problematic: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#syntax
    let interval = deadline.getTime() - currentTime.getTime();
    let color = "black";
    let text;

    if (isNegative(interval)) {
        text = currentLanguage[DEADLINE_PASSED];
        color = "Gray";
    } else text = currentLanguage[WHEN] + " " + getTranslatableDateString(interval);

    let textElementCollection = element.getElementsByClassName("devilry-extension-groupitemvalue-deadline-status");

    if (textElementCollection.length === 0) {
        let span = element.appendChild(document.createElement("span"));
        let strong = span.appendChild(document.createElement("strong"));

        strong.appendChild(document.createTextNode(text));
        strong.style.color = color;

        // this data attribute is used by darkmode to change the text color of passed deadlines.
        span.setAttribute("data-deadline-passed", isNegative(interval).toString());

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
    let text = (parseInt(fileAmount) > 0 ? currentLanguage[DELIVERED_TRUE] : currentLanguage[DELIVERED_FALSE]);
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
    /*let wrapper = document.createElement("div");
    wrapper.style.height = "100%";
    wrapper.style.display = "flexbox";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignContent = "center";
    wrapper.classList.add("extension-bgcolor-black");*/
    // wrapper.style.justifyContent = "center";

    let wrapper = document.createElement("ul");
    wrapper.classList.add("extension-header");
    // wrapper.classList.add("extension-bgcolor-black");

    // TODO align it in the center

    const createOption = (lang, title) => {
        let option = document.createElement("option");
        option.setAttribute("value", lang);
        // option.innerHTML = lang.split("_")[0].toUpperCase();
        option.innerHTML = title;

        // if (lang === "en") option.setAttribute("default", "true");

        return option;
    }

    let title = document.createElement("p");
    title.classList.add("extension-color-white", "extension-ignore-darken");
    title.textContent = "Extension";
    title.style.margin = "0px"; // resets the "user agent style" (pretty sure it's set by devilry)
    title.style.marginRight = "7px";

    let darkmodeCheckbox = document.createElement("input");
    darkmodeCheckbox.setAttribute("id", "devilry-extension-option-darkmode");
    darkmodeCheckbox.setAttribute("title", "Toggle darkmode");
    darkmodeCheckbox.setAttribute("class", "devilry-extension-checkbox");
    darkmodeCheckbox.type = "checkbox";
    // darkmodeCheckbox.style.paddingRight = "10px";

    let langDropdown = document.createElement("select");
    langDropdown.setAttribute("id", "devilry-extension-option-language");
    langDropdown.setAttribute("title", "Change extension language");
    langDropdown.setAttribute("name", "language");
    langDropdown.setAttribute("class", "devilry-extension-dropdown");
    langDropdown.appendChild(createOption(NORWEGIAN, "Norsk"));
    langDropdown.appendChild(createOption(ENGLISH, "English"));
    // langDropdown.style.paddingRight = "10px";

    // let menu = document.querySelector(".cradmin-legacy-menu-content-footer");
    let menu = document.querySelector(".cradmin-legacy-menu-content");

    wrapper.append(title, darkmodeCheckbox, langDropdown);
    // menu.insertBefore(wrapper, menu.lastElementChild);
    menu.appendChild(wrapper);

    /*menu.insertBefore(darkmodeCheckbox, menu.firstElementChild);
    menu.insertBefore(langDropdown, menu.firstElementChild);*/

    const callback = evt => {
        switch(evt.currentTarget.id) {
            case "devilry-extension-option-darkmode":
                console.log("Darkmode: " + evt.currentTarget.checked);
                if (evt.currentTarget.checked) enableDark();
                else disableDark();
                break;
            case "devilry-extension-option-language":
                console.log("Language switched to: " + evt.currentTarget.item(evt.currentTarget.selectedIndex).value);
                setLanguage(evt.currentTarget.item(evt.currentTarget.selectedIndex).value);
                break;
        }

        saveOptions();
        setStatus(); // reload extension to reflect changes
    }

    darkmodeCheckbox.addEventListener("change", callback);
    langDropdown.addEventListener("change", callback);
}

// allows native devilry elements to ignore darkmode
function ignoreDarkmode() {
    Array.from(document.getElementsByClassName("devilry-frontpage-listbuilder-roleselect-itemvalue")).forEach(e => {
        e.classList.add("extension-ignore-darken");
    });
}


// extension entry point
const init = async () => {
    ignoreDarkmode();
    createOptionIcons();
    await loadLanguageFiles();
    await restoreOptions();
    setObservers(observerCallback);
    setStatus();
}

init().then();

/*if(!ALL_OPTIONS_OFF) {
    setObservers(observerCallback);
    // setLang();
    setStatus();
    createOptionIcons();
}*/

// initContentScript(observerCallback);
