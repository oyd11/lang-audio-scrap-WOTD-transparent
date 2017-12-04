'use strict' 
let fs = require('fs');
let url = require('url')
let path = require('path')
let JSSoup = require('jssoup').default;

//let inputFilename  = "./inno-download/Russian/2017-11-01-Russian.html"
let exampleInput = "./inno-download/Russian/2017-12-03-Russian.html"


// src_* fields - eg "English" ( in current case)
// target_* fields - eg "Russian" (any language)
function extract_WOTD_links( inputFilename ) {
    let ret = { src_text: null,
        word_id: null,
        target_audio_url: null,
        target_text: null,
        target_xlit: null,
        target_sentences: [],
        src_sentences: []
    }

    // ret: the return value, will gather fields as side-effects
    // along this run::

    let htmlString = fs.readFileSync(inputFilename,'utf8')

    let soup = new JSSoup(htmlString) 

{
    let eng = "wotd-widget-sentence-quizmode-space-text big english"
    let u = soup.findAll('div', eng )
    for (let i in u) {
        let q = u[i]
        let qq = q.contents[0]
        if (qq._text) {
            ret.src_text = qq._text
        }
        if (qq.contents) {
            let engText = (qq.contents[0].nextElement._text).trim()
            let engAudio = qq.contents[0].previousElement.attrs.href
            ret.src_sentences.push( {audio_url: engAudio,
                text: engText } )
        }
    }
}

{
    let target = "wotd-widget-sentence-down-space-text"
    let u = soup.findAll('div', target )
    for (let i in u) {
        let q = u[i]
        let targetAudio = q.nextElement.attrs.href
        ret.target_sentences.push({ audio_url: targetAudio,
             text: null, xlit: null })
    }
}

{
    let wordAudioClass = "wotd-widget-sentence-main-space-sound jp-audio-track"

    let u = soup.findAll('a', wordAudioClass)
    let targetWord_audioUrl = u[0].attrs.href
    ret.target_audio_url = targetWord_audioUrl
}

{
    let phraseTextClass = 'wotd-widget-sentence-main-space-text'
    let u = soup.findAll('span', phraseTextClass )
    for (let i in u) {
        let q = u[i]
        let targetText = q.contents[0]._text
        if (i == 0) {
            ret.target_text = targetText
        } else {
            ret.target_sentences[i-1].text = targetText
        }
    }
}

{
    let rom = "wotd-widget-sentence-quizmode-space-text big romanization"
    let u = soup.findAll('div', rom )
    for (let i in u) {
        let q = u[i]
        let romText = q.contents[0]._text
        if (i == 0) {
            ret.target_xlit = romText
        } else {
            ret.target_sentences[i-1].xlit = romText
        }
    }
}
    {
        let word_id_url = ret.src_sentences[0].audio_url
        ret.word_id = path.basename(  url.parse(word_id_url).path , '.mp3')
    }
    return ret
}


module.exports = {
    extract_WOTD_links: extract_WOTD_links
}

let runTest = false
if (runTest) {
    let out = extract_WOTD_links( exampleInput )
    console.log("---")
    console.log(out)
    console.log("-!-")
}


