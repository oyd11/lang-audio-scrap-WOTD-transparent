'use strict'

let fs = require('fs');
let moment = require('moment');
let child_process = require('child_process')
let xml2json = require('xml2json');

let lang = "swedish"
let outputBasedir = "./download"

function mkDirSync(dir) {
    if (!fs.existsSync(dir)){
            fs.mkdirSync(dir); 
    }
}

mkDirSync( outputBasedir )
mkDirSync( `${outputBasedir}/${lang}` )
mkDirSync( `${outputBasedir}/${lang}/sound` )

let dateFormat = "MM-DD-YYYY"
let nowDate = moment()
let startDate = moment("01-01-2017", dateFormat)
//let startDate = moment("11-29-2017", dateFormat)

let langHumanToUrl = {
 "arabic": "arabic",
 "balinese": "bal-eng",
 "balinese-indonesian": "bal-ind",
 "chinese": "zh",
 "dari": "dari",
 "dutch": "nl",
 "english-spanish": "en-es",
 "english-portuguese": "en-pt",
 "esperanto": "esp",
 "french": "fr",
 "hebrew": "hebrew",
 "hindi": "hindi",
 "indonesian": "indonesian",
 "irish": "ga",
 "italian": "it",
 "japanese": "ja",
 "korean": "korean",
 "latin": "la",
 "mandarin": "zh",
 "norwegian": "norwegian",
 "swedish": "swedish",
 "spanish": "es",
 "turkish": "turkish",
 "polish": "polish",
 "portuguese": "pt",
 "russian": "ru",
 "pashto": "pashto",
 "urdu": "urdu",
};

let langString = langHumanToUrl[lang]

// execSync: from stackoverflow advice:
// https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command
function systemSync(cmd) {
    console.log("exec: ", cmd)
    try {
        return child_process.execSync(cmd).toString();
    } 
    catch (error) {
        error.status;  // Might be 127 in your example.
        error.message; // Holds the message you typically want.
        error.stderr;  // Holds the stderr output. Use `.toString()`.
        error.stdout;  // Holds the stdout output. Use `.toString()`.
    }
}


// let url = "https://wotd.transparent.com/rss/11-27-2017-swedish-widget.xml"
for (let d = startDate ; !d.isAfter( nowDate,  'day') ; d.add(1, 'days' )) { 
    let dateString = d.format(dateFormat)
    let filename = `${dateString}-${langString}-widget.xml`
    let xmlUrl = `https://wotd.transparent.com/rss/${filename}`
    console.log("url: ", xmlUrl)
    let execStr = `curl ${xmlUrl} -o ${outputBasedir}/${lang}/${filename}`
    let r = systemSync(execStr) 
    console.log("check: ", `${outputBasedir}/${lang}/${filename}`)
    let xmlString = fs.readFileSync(`${outputBasedir}/${lang}/${filename}`,'utf8')
    let jsonString = xml2json.toJson(xmlString)
    let o = JSON.parse(jsonString)["xml"]
    console.log("---")
    let oo = o["words"]
    fs.writeFileSync(`${outputBasedir}/${lang}/${dateString}-${langString}-widget.json`
      ,JSON.stringify(oo, null, 2), 'utf8')
    console.log(oo)
    console.log("wordsound: " , oo["wordsound"])
    console.log("phrasesound: " , oo["phrasesound"])
    {
        let execStr = `curl ${oo["wordsound"]} -o ${outputBasedir}/${lang}/sound/${dateString}-wordsound.mp3`
        let r = systemSync(execStr) 
    }
    {
        let execStr = `curl ${oo["phrasesound"]} -o ${outputBasedir}/${lang}/sound/${dateString}-phrasesound.mp3`
        let r = systemSync(execStr) 
    }
}








