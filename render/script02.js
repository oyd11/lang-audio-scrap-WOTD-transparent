
// utils: 
function existsNotEmpty(w) {
    return  null != w && !isempty(w) 
}

// assumed: defined 'j' - JSON + 'lang' - language string
const lang = Object.keys(j)[0]
const sentenceList = j[lang]

// TODO: Some struct keeping all global state:
// all global state - kept here:
let curPlaying = null
// since HTML storage is per _domain_+protocol, not page
const storagePrefix = `trans::WOTD-${lang}::`

// end of state variables.. everything else - should be in the DOM

const divWrapper = document.createElement("div")
divWrapper.className = "wrapper"
const divPlayControls= document.createElement("div")

// Controls tab + player function:
divPlayControls.className = "PlayControls"
const divWordList = document.createElement("div")
divWordList.className = "WordList"
{
    document.body.appendChild(divWrapper)
    divWrapper.appendChild(divPlayControls)
    divWrapper.appendChild(divWordList)
}
const playButton = document.createElement("button")
const pauseButton = document.createElement("button")
const stopButton = document.createElement("button")
const inputPlayIndex = document.createElement("input")
inputPlayIndex.setAttribute("type", "number")
inputPlayIndex.setAttribute("min", 0)
inputPlayIndex.setAttribute("max", sentenceList.length - 1)
{
    playButton.appendChild(document.createTextNode("play-all"))
    divPlayControls.appendChild(playButton)
    pauseButton.appendChild(document.createTextNode("pause"))
    divPlayControls.appendChild(pauseButton)
    stopButton.appendChild(document.createTextNode("stop"))
    divPlayControls.appendChild(stopButton)
    divPlayControls.appendChild(inputPlayIndex)
}
function addEventsAndPlay(ind) {
    const w = document.getElementById(`w_${ind}`)
    const ww = document.getElementById(`ww_${ind}`)
    const wwt = document.getElementById(`wwt_${ind}`)
    const au =  document.getElementById(`au_${ind}`)
    function setEvents() {
        au.addEventListener('play', onPlay)
        au.addEventListener('ended', onEnded)
        au.addEventListener('pause', onPause)
    }
    function rmEvents() {
        au.removeEventListener('play', onPlay)
        au.removeEventListener('ended', onEnded)
        au.removeEventListener('pause', onPause)
    }
    function onPlay(ev) { 
        w.style.color='lime'
        w.style.fontSize='110%'
        ww.style.color='red'
        ww.style.fontSize='110%'
        if (existsNotEmpty(wwt)) {
            wwt.style.color='red'
            wwt.style.fontSize='110%'
        }
        w.scrollIntoView({inline: "center", behavior:"instant"})
    }
    function onEnded(ev) { 
        w.style = null
//        ww.style = null
        if (existsNotEmpty(wwt)) {
 //       wwt.style = null
        }
        rmEvents()
        if (ind< playlist.end) {
            addEventsAndPlay(ind+1)
        }
        // rm curr events?
    }
    function onPause(ev) { 
        w.style = null
//        ww.style = null
    }
    rmEvents() // possible cleanup
    setEvents()
    curPlaying = au
    localStorage.setItem(`${storagePrefix}playIndex`,ind)
    inputPlayIndex.value = ind
    au.play()
}
{
    const newHr = document.createElement("hr")
    divPlayControls.appendChild(newHr)
}
// End of 'controls' tab


// rendering words view:


const relavant_fields = ["translation","enphrase","wordtype","word","fnphrase",
    "wotd:transliteratedWord","wotd:transliteratedSentence"]

const prefix_ids = {
    "w" : "word ul",
    "auw" : "audio word only",
    "au" : "audio phrase",
    "ww" : "phrase li",
    "wd" : "word div",
    "wwt" : "phrase translitaration",
}

function isempty(obj) {
    return null == obj || Object.keys(obj).length == 0
}

sentenceList.forEach( (w,ind) => {
    const wordDiv = document.createElement("div")
    divWordList.appendChild(wordDiv)
    const wordUl = document.createElement("ul")
    wordDiv.appendChild(wordUl)
    wordDiv.setAttribute("id","wd_"+ind)
    wordUl.setAttribute("id","w_"+ind)
{
    const newLi= document.createElement("li")
    const wt = w["wotd:transliteratedWord"] 
    const wt_text = isempty(wt) ? "" : `(${wt})`
    newLi.textContent = `${w["word"]} ${wt_text} :: ${w["translation"]} (${w["wordtype"]})`
    wordUl.appendChild(newLi)
}
{
    const newLi= document.createElement("li")
    newLi.textContent = w["fnphrase"]
    newLi.setAttribute("id","ww_"+ind)
    wordUl.appendChild(newLi)
}
const wwt = w["wotd:transliteratedSentence"]


if (existsNotEmpty(wwt)){
    const newLi= document.createElement("li")
    newLi.textContent = wwt
    newLi.setAttribute("id","wwt_"+ind)
    wordUl.appendChild(newLi)
}
{
    const newLi= document.createElement("li")
    newLi.textContent = w["enphrase"]
    wordUl.appendChild(newLi)
}
{
    const au = document.createElement("audio")
    au.setAttribute("id","au_"+ind)
    au.setAttribute("src",
        `../transparent-sound/${lang}-sound/${w["date"]}-phrasesound.mp3`)
//    au.controls = true
    au.preload="none" // "auto|metadata|none">
    wordUl.appendChild(au)
}
{
    const audioElement = document.createElement("audio")
    audioElement.setAttribute("id","auw_"+ind)
    audioElement.setAttribute("src",
        `../transparent-sound/${lang}-sound/${w["date"]}-wordsound.mp3`)
 //   audioElement.controls = true
    wordUl.appendChild(audioElement)
}
{
    const newLi= document.createElement("li")
    newLi.textContent = w["date"]
    newLi.style.fontSize="60%"
    wordUl.appendChild(newLi)
}
{
    function mDownPlayThis(ev) {
        wordDiv.style.color='red'
        if (null != curPlaying) {
            curPlaying.pause()
            curPlaying.currentTime = 0
        }
//        curPlaying = au
        addEventsAndPlay(ind)
    }
    wordDiv.addEventListener("mouseenter", (ev) => {
//        wordDiv.style.fontSize='150%'
        wordDiv.style.color='aqua'
        wordDiv.addEventListener("mousedown", mDownPlayThis)
    })
    wordDiv.addEventListener("mouseleave", (ev) => {
        wordDiv.style=null
        wordDiv.removeEventListener("mousedown", mDownPlayThis)
    })
}
{
    const newHr = document.createElement("hr")
    wordDiv.appendChild(newHr)
}

})

const playlist = { start: 0, end: j[lang].length }

//for (let ind = playlist.start ; ind < playlist.end ; ++ind ) {


let startIndex = 0

{
    // read-local storage, and if exists - start playing there:
    const savedPlayIndex = Number(localStorage.getItem(`${storagePrefix}playIndex`))
    if (null != savedPlayIndex) {
        startIndex = savedPlayIndex
    }
}

inputPlayIndex.value = startIndex

playButton.addEventListener("click", (ev) => {
    if (null != curPlaying) {
        curPlaying.pause()
        curPlaying.currentTime = 0 
    } 
    const playIndex = Number(inputPlayIndex.value)
    addEventsAndPlay(playIndex)
})

pauseButton.addEventListener("click", (ev) => {
    if ( curPlaying.paused ) { 
        curPlaying.play() 
    } else {
        curPlaying.pause() 
    }
})

stopButton.addEventListener("click", (ev) => {
    curPlaying.pause()
    curPlaying.currentTime = 0
})

