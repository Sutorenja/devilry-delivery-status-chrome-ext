let darkened = false;

/* you have to update the property of the HTML element, not the attribute! */
/* see: https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html */

function enableDark() {
    // background color of body:
    // document.getElementsByTagName("body")[0].style.setProperty("background-color", "#222226");
    document.getElementsByTagName("body")[0].classList.add("extension-bgcolor-black", "extension-darken");

    // color of all text:
    document.querySelectorAll("span, p, h1, h2, label").forEach(e => {
        // TODO might be worth it to check if pre-existing color property is black, and only change if it is.
        // e.style.setProperty("color", "white");
        if (e.classList.contains("extension-ignore-darken")) return; // The header is permanently black regardless of dark mode, so text should always be white.
        e.classList.add("extension-color-white", "extension-darken");
    });

    // background color of rows (has its own background color that is not inherited from body):
    Array.from(document.getElementsByClassName("cradmin-legacy-listbuilder-itemvalue")).forEach(e => {
        if (e.classList.contains("extension-ignore-darken")) return; // A LOT of different components are actually cradmin-legacy-listbuilder-itemvalue, but we don't want to change the color of all of them!
        e.classList.add("extension-bgcolor-black", "extension-darken");
    });

    // account dashboard (seen at https://devilry.ifi.uio.no/account/):
    Array.from(document.getElementsByClassName("devilry-dashboard-container")).forEach(e => {
        e.classList.add("extension-bgcolor-black", "extension-darken");
    });

    // devilry extension deadline status:
    Array.from(document.getElementsByClassName("devilry-extension-groupitemvalue-deadline-status")).forEach(e => {
        e.firstElementChild.classList.add("extension-darken");
        if (e.getAttribute("data-deadline-passed") === "true") e.firstElementChild.classList.add("extension-color-black")
        else e.firstElementChild.classList.add("extension-color-gray");
        console.log(e.textContent, e.getAttribute("data-deadline-passed"), e.firstElementChild.style.color);
        if (e.getAttribute("data-deadline-passed") === "true") console.log("AAAAAAAA")
    });

    darkened = true;
}

function disableDark() {
    Array.from(document.getElementsByClassName("extension-darken")).forEach(e => {
        e.classList.remove(
            "extension-color-white",
            "extension-color-black",
            "extension-bgcolor-black",
            "extension-color-darkgray",
            "extension-color-gray"
        );
    });

    darkened = false;
}