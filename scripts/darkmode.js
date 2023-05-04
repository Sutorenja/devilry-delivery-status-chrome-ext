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
        e.classList.add("extension-bgcolor-black", "extension-color-white", "extension-darken");
    });

    // devilry extension deadline status:
    Array.from(document.getElementsByClassName("devilry-extension-groupitemvalue-deadline-status")).forEach(e => {
        e.firstElementChild.classList.add("extension-darken");
        if (e.getAttribute("data-deadline-passed") === "true") e.firstElementChild.classList.add("extension-color-black")
        else e.firstElementChild.classList.add("extension-color-gray");
        /*console.log(e.textContent, e.getAttribute("data-deadline-passed"), e.firstElementChild.style.color);
        if (e.getAttribute("data-deadline-passed") === "true") console.log("AAAAAAAA")*/
    });

    // more edge cases (all of this is containers that show up specifically when you when you click on an assignment):
    Array.from(document.getElementsByClassName("devilry-group-feedbackfeed-buttonbar")).forEach(e => {
        e.classList.add("extension-bgcolor-black", "extension-darken");
    });

    Array.from(document.getElementsByClassName("comment-form-container")).forEach(e => {
        e.classList.add("extension-bgcolor-black", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-comment-editor-textarea")).forEach(e => {
        e.classList.add("extension-button-darken", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-fileupload-content")).forEach(e => {
        e.classList.add("extension-bgcolor-black", "extension-color-white", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-fileupload-dropbox")).forEach(e => {
        e.classList.add("extension-bgcolor-black", "extension-color-white", "extension-border-color-black", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-fileupload-fileselect-button")).forEach(e => {
        e.classList.add("extension-button-darken", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-comment-editor-toolbar")).forEach(e => {
        e.classList.add("extension-button-darken", "extension-darken");
    });

    Array.from(document.getElementsByClassName("tablinks")).forEach(e => {
        e.classList.add("extension-button-darken", "extension-darken");
    });

    Array.from(document.getElementsByClassName("devilry-comment-editor-toolbar__option")).forEach(e => {
        e.classList.add("extension-button-darken2", "extension-darken");
    });

    // need to store element in a temp variable so we can check if its null.
    // this is neccessary because we use getElementById which returns an element OR null.
    // getElementsByClassName returns an array no matter what and therefore we don't need to check for null.
    let temp = document.getElementById("submit-id-student_add_comment");
    if (temp !== null) temp.classList.add("extension-bgcolor-black", "extension-color-white", "extension-darken");

    // document.getElementById("id_text_comment_editor_section").classList.add("extension-bgcolor-black", "extension-color-white", "extension-darken");
    // document.getElementById("submit-id-student_add_comment").classList.add("extension-bgcolor-black", "extension-color-white", "extension-darken");

    darkened = true;
}

function disableDark() {
    Array.from(document.getElementsByClassName("extension-darken")).forEach(e => {
        e.classList.remove(
            "extension-color-white",
            "extension-color-black",
            "extension-bgcolor-black",
            "extension-color-darkgray",
            "extension-color-gray",
            "extension-border-color-black",
            "extension-button-darken",
            "extension-button-darken2"
        );
    });

    darkened = false;
}