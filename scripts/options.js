// options

let DELIVERED_STATUS = true;
let DEADLINE_STATUS = true;
let ALL_OPTIONS_OFF = false;
let USER_LANG = "en";
let NIGHT_MODE = false;
let DEBUG = true;

/* TODO
    changing DELIVERED_STATUS or TIME_UNTIL_STATUS should cause the program to run setStatus() again,
    so that user can see the changes instantly without having to reload the page.
 */

function setInternalOptionVariables(...args) {
    DEBUG = args[0];
    DELIVERED_STATUS = args[1];
    DEADLINE_STATUS = args[2];
    ALL_OPTIONS_OFF = args[3];
    USER_LANG = args[4];
    NIGHT_MODE = args[5];
}

function save_options() {
    document.getElementById("devilry-extension-op-delivery")
    document.getElementById("devilry-extension-op-deadline")
    document.getElementById("devilry-extension-op-delivered")
    document.getElementById("devilry-extension-op-notdelivered")
    document.getElementById("devilry-extension-op-lang").value // TODO add lang dropdown menu
    document.getElementById("devilry-extension-op-nightmode")
    document.getElementById("devilry-extension-op-debug")

    chrome.storage.sync.set({
        showDeliveryStatus: document.getElementById("devilry-extension-op-delivery").checked,
        showDeadlineStatus: document.getElementById("devilry-extension-op-deadline").checked,
        showDelivered: document.getElementById("devilry-extension-op-delivered").checked,
        showNotDelivered: document.getElementById("devilry-extension-op-notdelivered").checked,
        language: false, // TODO add lang dropdown menu / document.getElementById("devilry-extension-op-lang").value
        nightmode: document.getElementById("devilry-extension-op-nightmode").checked,
        showDebugOptions: document.getElementById("devilry-extension-op-debug").checked
    }, function() { // update status to let user know options were saved
        if (DEBUG) console.log("Saved settings.");

        let updateStatus = false;
        let updateLang = false;

        // if old state is different to the updated state, redraw all the status messages (time until delivery, delivery status)
        if (DELIVERED_STATUS !== document.getElementById("devilry-extension-op-delivery").checked) {
            updateStatus = true;
        }
        if (DEADLINE_STATUS !== document.getElementById("devilry-extension-op-deadline").checked) {
            updateStatus = true;
        }
        /*if (USER_LANG !== document.getElementById("devilry-extension-op-lang").value) {
            updateLang = true;
        }*/

        setInternalOptionVariables();

        if (updateStatus) {
            setStatus();
        }
        if (updateLang) {
            setLang();
        }

        // TODO this should return all of the
        console.log(document.querySelectorAll("input[class^=devilry-extension-op-]"));
        // setInternalOptionVariables(document.querySelectorAll("input[class^=devilry-extension-op-]"))
    });
}

function restore_options() {
    chrome.storage.sync.get({
        showDeliveryStatus: true,
        showDeadlineStatus: true,
        showDelivered: true,
        showNotDelivered: true,
        language: false, // TODO "en"
        nightmode: false,
        showDebugOptions: false
    }, function(items) { // update toggle switches to accurately represent users settings

        document.getElementById("devilry-extension-op-delivery").checked = items.showDeliveryStatus;
        document.getElementById("devilry-extension-op-deadline").checked = items.showDeadlineStatus;
        document.getElementById("devilry-extension-op-delivered").checked = items.showDelivered;
        document.getElementById("devilry-extension-op-notdelivered").checked = items.showNotDelivered;
        document.getElementById("devilry-extension-op-lang").checked = items.language; // TODO add lang dropdown menu - replace .checked with .value or similar
        document.getElementById("devilry-extension-op-nightmode").checked = items.nightmode;
        document.getElementById("devilry-extension-op-debug").checked = items.showDebugOptions;

        setInternalOptionVariables(
            items.showDeliveryStatus,
            items.showDeadlineStatus,
            "en", // TODO REPLACE after ddropdown is finished
            items.nightmode,
            items.showDebugOptions
        );
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

// adds event listener to every button in the settings navigation menu.
// shows/hides different <ol> based on which button the user presses.
for (let element of document.getElementsByClassName("devilry-extension-options-tab-button")) {

    element.addEventListener('click', evt => {

        // resets all the buttons (sets them to inactive and hides them)
        Array.from(document.getElementsByClassName("devilry-extension-ol")).forEach(evt => {
            evt.style.display = "none";
        });
        Array.from(document.getElementsByClassName("devilry-extension-options-tab-button")).forEach(evt => {
            evt.className = evt.className.replace("devilry-extension-options-tab-button-active", "");
        });

        // sets button that triggered the event to active and shows it
        document.getElementById(evt.currentTarget.getAttribute("data-tab-name")).style.display = "block";
        evt.currentTarget.className += " devilry-extension-options-tab-button-active";
    });
}

// adds event listener to the toggle buttons for all the options.
for (let element of document.querySelectorAll(".devilry-extension-switch input")) {
    element.addEventListener("change", evt => {
        save_options();
    });
}
