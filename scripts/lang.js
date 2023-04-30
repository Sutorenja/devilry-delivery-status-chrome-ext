// language related utils

//constants
/*const PLURAL_MARKER = "PLURAL";
const SINGLE = "SINGLE"; // Norwegian words that end in "e" only add "r" when in plural, not "er", hence the need for this additional constant.
const IN_TIME = "IN_TIME";
const AND = "AND";
const MONTH = "MONTH";
const WEEK = "WEEK";
const DAY = "DAY";
const HOUR = "HOUR";
const MINUTE = "MINUTE";

let lang = {};

function setLang() {
    // basic usage:
    // input: (lang[IN_TIME]) (number) (lang[MONTH])(lang[PLURAL_MARKER])
    // output: in 1 month

    // week-specific usage:
    // input: (lang[IN_TIME]) (number) (lang[SINGLE_WEEK])(lang[WEEK])(lang[PLURAL_MARKER])
    // output: in 5 weeks

    switch(USER_LANG) {
        case "en":
            lang[PLURAL_MARKER] = "s";
            lang[SINGLE] = "";
            lang[IN_TIME] = "due in";
            lang[AND] = "and";
            lang[MONTH] = "month";
            lang[WEEK] = "week";
            lang[DAY] = "day";
            lang[HOUR] = "hour";
            lang[MINUTE] = "minute";
            break;
        case "no":
            lang[PLURAL_MARKER] = "er";
            lang[SINGLE] = "e";
            lang[IN_TIME] = "forfaller om";
            lang[AND] = "og";
            lang[MONTH] = "måned";
            lang[WEEK] = "uk"; // incredibly scuffed buuuut SINGLE adds the "e".
            lang[DAY] = "dag";
            lang[HOUR] = "tim";
            lang[MINUTE] = "minutt";
            break;
    }
}*/

const ENGLISH = "en_lang.csv";
const NORWEGIAN = "no_lang.csv";

const DELIVERED_TRUE = "delivered";
const DELIVERED_FALSE = "not.delivered";
const DEADLINE_PASSED = "deadline.passed";
const AND = "and";
const WHEN = "when";
const MONTH = "month";
const MONTHS = "month.plural";
const WEEK = "week";
const WEEKS = "week.plural";
const DAY = "day";
const DAYS = "day.plural";
const HOUR = "hour";
const HOURS = "hour.plural";
const MINUTE = "minute";
const MINUTES = "minute.plural";
const SECOND = "second";
const SECONDS = "second.plural";

const languages = {};
let currentLanguage;

// function has to be async to await fetch() calls.
async function loadLanguageFiles() {
    const EN_file = chrome.runtime.getURL(ENGLISH);
    const NO_file = chrome.runtime.getURL(NORWEGIAN);

    const build = data => {
        let languageDict = {};

        data.text().then(text => {
            let lines = text.split("\r\n");

            lines.forEach(line => {
                let kv = line.split(",");

                languageDict[kv[0]] = kv[1]; //.replaceAll("\r", "");
            });

            return languageDict
        });

        return languageDict

        /*, () => { // TODO REMOVE
            return languageDict
        });*/
        // ;console.log(languageDict)
        /*Promise.all([promise]).then(() => {
            return languageDict
        });

        console.log("languageDict")*/
    }

    const read = async filename => {
        // console.log(filename, filename.split("/").pop()) // TODO remove
        await fetch(filename).then(
            data => languages[filename.split("/").pop()] = build(data),
            () => console.log("Error fetching data from: " + filename));
    }

    await read(EN_file);
    await read(NO_file);
    setLanguage(ENGLISH);
    // console.log("language files loaded") // TODO remove
    // console.log("curr-lang:" + languages["en_lang.csv"]) // TODO remove
    // console.log("curr-lang:" + currentLanguage) // TODO remove
}

function setLanguage(lang) {
    // console.log("setting current language to: " + lang); // TODO remove
    // console.log(languages[0], languages[0] === ENGLISH)
    currentLanguage = languages[lang];
    console.log("language has been set to: " + lang) // TODO remove
    /* TODO
        there are some issues with race conditions here.
        setStatus() gets called TWICE before the current language has been updated even once somehow
        might want to attach a callback or something that calls setStats() idk
        it doesnt make sense at all
        its so fucking annoying
     */
}

/*function loadLanguagePromise() { // TODO remove
    return new Promise((resolve, reject) => {
        loadLanguageFiles();
    }, () => {})
    }
}*/
