#!/usr/bin/env node
'use strict'


let fs = require('fs');
let moment = require('moment');
let xml2json = require('xml2json');

// local includes:
let misc_utils = require('./misc_utils.js')
let systemSync = misc_utils.systemSync
let execIfMissing = misc_utils.execIfMissing
let mkDirSync = misc_utils.mkDirSync

if (process.argv.length < 3) {
    console.log("required - lang to process")
    process.exit(1)
}
//let lang = "russian"
//let lang = "swedish"
let lang = process.argv[2]
let outputBasedir = "./transparent-download"


let langDir =  `${outputBasedir}/${lang}`
let soundDir = `./transparent-sound/${lang}-sound`
mkDirSync( outputBasedir )
mkDirSync( langDir )
mkDirSync( soundDir )

// Config :: //

let isDownloadExistingXml = true
const dateFormat = "MM-DD-YYYY"
let nowDate = moment()
let endDate = nowDate
//let startDate = moment("01-01-2017", dateFormat)
let startDate = moment("12-18-2017", dateFormat)

const langHumanToUrl = {
 "arabic": "arabic",
 "balinese": "bal-eng",
 "balinese-indonesian": "bal-ind",
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
 "mandarin": "zh", //  mandarin-chinese
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

// let url = "https://wotd.transparent.com/rss/11-27-2017-swedish-widget.xml"
for (let d = startDate ; !d.isAfter( endDate,  'day') ; d.add(1, 'days' )) {
    let dateString = d.format(dateFormat)
    let filename = `${dateString}-${langString}-widget.xml`
    let xmlUrl = `https://wotd.transparent.com/rss/${filename}`
    console.log("url: ", xmlUrl)
    {
        let f = `${langDir}/${filename}`
        let execStr = `curl ${xmlUrl} -o ${f}`
        if (isDownloadExistingXml) {
            let r = systemSync(execStr)
        } else {
            let r = execIfMissing(execStr, f)
        }
        console.log("check: ", `${f}`)
    }
    let xmlString = fs.readFileSync(`${langDir}/${filename}`,'utf8')
    let jsonString = xml2json.toJson(xmlString)
    let o = JSON.parse(jsonString)["xml"]
    console.log("---")
    let oo = o["words"]
    fs.writeFileSync(`${langDir}/${dateString}-${langString}-widget.json`
      ,JSON.stringify(oo, null, 2), 'utf8')
    console.log(oo)
    console.log("wordsound: " , oo["wordsound"])
    console.log("phrasesound: " , oo["phrasesound"])
    {
        let f = `${soundDir}/${dateString}-wordsound.mp3`
        let execStr = `curl "${oo["wordsound"]}" -o ${f}`
        let r = execIfMissing(execStr, f)
    }
    {
        let f = `${soundDir}/${dateString}-phrasesound.mp3`
        let execStr = `curl "${oo["phrasesound"]}" -o ${f}`
        let r = execIfMissing(execStr, f)
    }
}
