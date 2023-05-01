// options

// TODO in the distant future I might add options that let you tailor the extension to your own needs (e.g. hide delivery status and only show deadline status)

/*let DELIVERED_STATUS = true;
let DEADLINE_STATUS = true;
let ALL_OPTIONS_OFF = false;
let USER_LANG = "en";
let NIGHT_MODE = false;
let DEBUG = true;*/

/*function setInternalOptionVariables(...args) {
    DEBUG = args[0];
    DELIVERED_STATUS = args[1];
    DEADLINE_STATUS = args[2];
    ALL_OPTIONS_OFF = args[3];
    USER_LANG = args[4];
    NIGHT_MODE = args[5];
}*/

// inside save_options():
/*document.getElementById("devilry-extension-op-delivery")
document.getElementById("devilry-extension-op-deadline")
document.getElementById("devilry-extension-op-delivered")
document.getElementById("devilry-extension-op-notdelivered")
document.getElementById("devilry-extension-op-lang").value
document.getElementById("devilry-extension-op-nightmode")
document.getElementById("devilry-extension-op-debug")*/

function saveOptions() {
    let darkmode = document.getElementById("devilry-extension-option-darkmode");
    let language = document.getElementById("devilry-extension-option-language");

    chrome.storage.sync.set({
        darkmode: darkmode.checked,
        language: language.item(language.selectedIndex).value
    }, () => {
        console.log("Updated settings.");
    });
}

async function restoreOptions() {
    await chrome.storage.sync.get({ darkmode: false, language: ENGLISH })
        .then(
            items => {
                let darkmode = document.getElementById("devilry-extension-option-darkmode");
                let language = document.getElementById("devilry-extension-option-language");

                darkmode.checked = items.darkmode;
                darkened = items.darkmode;

                Array.from(language.children).forEach(e => {
                    if (e.value === items.language) {
                        e.setAttribute("selected", "selected");
                    }
                });

                setLanguage(items.language);
                // console.log("current options: ", items); // TODO maybe remove
            },
            () => console.log("Error restoring extension options.")
        );
}

// document.addEventListener('DOMContentLoaded', restore_options);

// adds event listener to every button in the settings navigation menu.
// shows/hides different <ol> based on which button the user presses.
/*for (let element of document.getElementsByClassName("devilry-extension-options-tab-button")) {

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
}*/

// adds event listener to the toggle buttons for all the options.
/*for (let element of document.querySelectorAll(".devilry-extension-switch input")) {
    element.addEventListener("change", evt => {
        save_options();
    });
}*/
