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
const DARKMODE_TITLE = "option.darkmode.title";
const LANGUAGE_TITLE = "option.language.title";

const languages = {};
// let currentLanguage;
let currentLanguageOption = ENGLISH; // default option

/* function has to be async to await fetch() calls. */
async function loadLanguageFiles() {
    const EN_file = chrome.runtime.getURL(ENGLISH);
    const NO_file = chrome.runtime.getURL(NORWEGIAN);

    const build = async data => {
        // console.log("building...")
        let languageDict = {};

        await data.text().then(text => {
            let lines = text.split("\r\n");
            // console.log(text)
            // console.log(lines)

            lines.forEach(line => {
                let kv = line.split(",");

                languageDict[kv[0]] = kv[1]; //.replaceAll("\r", "");
            });

            // console.log("returning....")
            // console.log(languageDict)
            return languageDict;
        });

        return languageDict;
    }

    /*const read = async filename => {
        let fetchedData;
        await fetch(filename).then(
            // data => languages[filename.split("/").pop()] = build(data),
            // data => { languages[filename.split("/").pop()] = build(data); console.log("read > fetch > build") },
            data => fetchedData = data,
            () => console.log("Error fetching data from: " + filename));
        await fetchedData;
        languages[filename.split("/").pop()] = build(fetchedData);
    }*/

    /*let langDicts = {};
    await fetch(EN_file).then(data => langDicts[EN_file] = data);
    await fetch(NO_file).then(data => langDicts[NO_file] = data);

    await build(langDicts[EN_file]).then(lang => languages[ENGLISH] = lang)
    await build(langDicts[NO_file]).then(lang => languages[NORWEGIAN] = lang)*/

    const read = async (filename, constant) => {
        let langDicts = {};
        await fetch(filename).then(data => langDicts[filename] = data);
        await build(langDicts[filename]).then(lang => languages[constant] = lang);
    }

    await read(EN_file, ENGLISH);
    await read(NO_file, NORWEGIAN);

    /* await read(EN_file);
    await read(NO_file);
    await fetch(EN_file).then(data => languages[ENGLISH] = build(data)).then(() => console.log("done with EN!"));
    await fetch(NO_file).then(data => languages[NORWEGIAN] = build(data)).then(() => console.log("done with NO!"));*/

    // console.log("loadLanguageFiles: language files loaded.")
    // console.log("english: ", getStaticDictionary(languages[ENGLISH]))
    // console.log("norwegian: ", getStaticDictionary(languages[NORWEGIAN]))
}

/*function setLanguage(lang) {
    console.log("setting language to: ", lang)
    console.log("keys: ", Object.keys(languages))
    console.log(languages[lang])
    currentLanguage = languages[lang];
    console.log("setLanguage() language set to: ", currentLanguage)
}*/

function updateLang(lang) {
    currentLanguageOption = lang;
    // console.log("language set to: ", lang)
}

// example usage: getTranslation(WHEN) -> "due in" (if language is set to English)
function getTranslation(key) {
    // throw an error if key is not present in language file:
    // if (Object.values(Object.keys(currentLanguage)).indexOf(key) === -1) throw new Error(key + " is not a key in language file " + Object.keys(languages).find(key => languages[key] === currentLanguage));
    let currentLang = languages[currentLanguageOption];

    // console.log("fetching value:", key)
    // if (currentLanguageOption === ENGLISH) console.log("getTranslation: current language is english")
    // else if (currentLanguageOption === NORWEGIAN) console.log("getTranslation: current language is norwegian")
    // console.log("getTranslation: returning value:", currentLang[key])
    // console.log("current language: ", getStaticDictionary(currentLang))

    let translation = currentLang[key];
    if (translation === "" || translation === undefined || translation === null) return languages[ENGLISH][key]; // if no translation, return default language option
    return translation;
}

// testing function that prints out a dictionary.
// values are dynamically displayed in the browser console (meaning they update automatically to reflect the current state of the object).
// sometimes, this is amazing, but when you have race conditions, it's incredibly frustrating to deal with.
function getStaticDictionary(lang) {
    let str = "";
    for (let [key, value] of Object.entries(lang)) {
        str += `${key}: ${value},`;
    }
    str = "{" + str.substring(0, str.length - 1) + "}";
    return str;
}
