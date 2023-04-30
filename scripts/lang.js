// language related utils

// language constants:
const ENGLISH = "en_lang.csv";
const NORWEGIAN = "no_lang.csv";

// translation IDs / word constants:
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
    }

    const read = async filename => {
        await fetch(filename).then(
            data => languages[filename.split("/").pop()] = build(data),
            () => console.log("Error fetching data from: " + filename));
    }

    await read(EN_file);
    await read(NO_file);
    setLanguage(ENGLISH);
}

function setLanguage(lang) {
    currentLanguage = languages[lang];
}
