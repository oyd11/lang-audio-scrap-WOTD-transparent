'use strict'

/////// include libs ////
let fs = require('fs')
let moment = require('moment')
let child_process = require('child_process')
let extract_WOTD_links = require('./extract_WOTD_links.js')

/////// Settings ////
let outputBasedir = "./inno-download"

let dateFormat = "YYYY-MM-DD"
let nowDate = moment()
let startDate = moment("2017-01-01", dateFormat)

///// prelude :: ///

if (process.argv.length < 3) {
    console.log("required - lang to process")
    process.exit(1)
}
//let lang = "Russian"
let lang = process.argv[2]
let langs = [
  // copied from page
  // langs like "English (UK)" - are used as "English_UK" as a req string
  // note: English - is not supported, english assumed as src
    "Afrikaans", "Arabic", "Bulgarian", "Cantonese", "Chinese", "Croatian", "Czech", "Danish",
    "Dutch", "English_US", "English_UK", "Farsi", "Filipino", "Finnish", "French", "German",
    "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese", "Korean",
    "Malaysian", "Mongolian", "Nepali", "Norwegian", "Persian", "Polish", "Portuguese_Brazil",
    "Portuguese", "Romanian", "Russian", "Spanish", "Spanish_Mexican", "Swahili", "Swedish",
    "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese",
];

if ( !langs.includes(lang) ) {
  console.log(lang, " not found in lang table")
  console.log(langs)
  process.exit(1)
}
let langString = lang


function mkDirSync(dir) {
    if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
    }
}

let langDir =  `${outputBasedir}/${lang}`
let soundDir = `${langDir}/${lang}-sound`
let engSrcSoundDir = `${outputBasedir}/eng-src`
mkDirSync( outputBasedir )
mkDirSync( langDir )
mkDirSync( soundDir )
mkDirSync( engSrcSoundDir )

// 2017-12-01'
// minimal call:
// curl 'http://www.innovativelanguage.com/widgets/wotd/large.php'   --data 'language=Chinese&date=2017-12-01'

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


function execIfMissing( execStr, localFn ) {
    if (!fs.existsSync(localFn)){
        let r = systemSync(execStr)
        return r
    }
    return null
}



// example url:
// curl 'http://www.innovativelanguage.com/widgets/wotd/large.php'   --data 'language=Chinese&date=2017-12-01'
for (let d = startDate ; !d.isAfter( nowDate,  'day') ; d.add(1, 'days' )) {
    let dateString = d.format(dateFormat)
    let formData = `language=${langString}&date=${dateString}`
    let baseUrl = 'http://www.innovativelanguage.com/widgets/wotd/large.php'
    let filename = `${dateString}-${langString}.html`
    let filename_WOTD_widget = `${langDir}/${filename}`
    {
        let execStr = `curl ${baseUrl} --data '${formData}' -o ${filename_WOTD_widget}`
        let r = systemSync(execStr)
    }
    console.log("check: ", `${filename_WOTD_widget}`)
    let o = extract_WOTD_links.extract_WOTD_links( filename_WOTD_widget )
    console.log("---")
    console.log(o)
    console.log("---")
    let word_id = o.word_id
    // save json as both 'word_id' and as date:
    let jsonString = JSON.stringify(o, null, 2)
    fs.writeFileSync(`${langDir}/${dateString}-${langString}.json`, jsonString, 'utf8')
    fs.writeFileSync(`${langDir}/${word_id}.json`, jsonString, 'utf8')

// the 'word_id' will be the filename of the first English-Source sentence:
    console.log("word_id :: " , word_id)
    {
        let u = o.target_audio_url
        let f = `${soundDir}/${word_id}_0word.mp3`
        let execStr = `curl ${u} -o ${f}`
        let r = execIfMissing( execStr, f)
    }
    for (let i in o.target_sentences) {
        let u = o.target_sentences[i].audio_url
        let f = `${soundDir}/${word_id}_s${i}.mp3`
        let execStr = `curl ${u} -o ${f}`
        let r = execIfMissing( execStr, f)
    }
    for (let i in o.src_sentences) {
        let u = o.src_sentences[i].audio_url
        let f = `${engSrcSoundDir}/${word_id}_s${i}.mp3`
        let execStr = `curl ${u} -o ${f}`
        let r = execIfMissing( execStr, f)
    }

}
