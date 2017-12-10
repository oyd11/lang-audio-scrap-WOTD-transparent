'use strict'

// concatinate phrases to .md
if (process.argv.length < 3) {
    console.log("required - lang to process")
    process.exit(1)
}
//let lang = "russian"
let lang = process.argv[2]
console.log("will process: ", lang)
let wantNotes = false

let fs = require('fs');
let glob = require("glob")
let child_process = require('child_process')
let moment = require('moment');

//let lang = "hebrew"
//let lang = "mandarin"
let inputBasedir = "./transparent-download"
let outputBasedir = "./transparent-output"

function mkDirSync(dir) {
    if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
    }
}

mkDirSync(outputBasedir)
mkDirSync(`${outputBasedir}/${lang}`)

let mdFilename = `${outputBasedir}/${lang}/${lang}-all.md`
let mdStream = fs.createWriteStream(mdFilename, 'utf8')

// write some data with a base64 encoding
mdStream.write(`# ${lang} WOTD : \n`)

// the finish event is emitted when all data has been flushed from the stream
mdStream.on('finish', () => {
        console.log(mdFilename, ' :: Finish writing', )
})

// TODO : write date range + missing dates?

let jsonFiles = glob.sync(`${inputBasedir}/${lang}/\*.json`)

mdStream.write('----------\n')
mdStream.write(` ${jsonFiles.length} phrases \n`)
mdStream.write('----------\n')
console.log(jsonFiles.length , " files found")

for (let ind in jsonFiles) {
    let fn = jsonFiles[ind]
//    console.log(fn)
    let o = JSON.parse(fs.readFileSync(fn, 'utf8'))
    //console.log(o)
    // maybe date as primary key:
    let w = o["word"]
    let ph = o["fnphrase"]
    let w_xlit = o["wotd:transliteratedWord"]
    let ph_xlit = o["wotd:transliteratedSentence"]
    mdStream.write('----------\n')
    mdStream.write(` * **${w}** :: ${o["translation"]} (${o["wordtype"]})\n`)
    if (w_xlit && w_xlit.length >0) {
        mdStream.write(` * **${w_xlit}** \n`)
    }
    mdStream.write(` * ${ph} \n`)
    if (ph_xlit && ph_xlit.length > 0) {
        mdStream.write(` * ${ph_xlit} \n`)
    }
    mdStream.write(` * ${o["enphrase"]} \n`)
    let notes = o["notes"]
    if (wantNotes  && notes && notes.length >0 ) {
        mdStream.write(` * notes: ${notes} \n`)
    }
}

mdStream.write('----------\n')
mdStream.write(" # - end of file - \n")
mdStream.end();
