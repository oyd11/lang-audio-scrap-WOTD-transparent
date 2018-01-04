
// assumed: defined 'j' - JSON + 'lang' - language string

{
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}
const playButton = document.createElement("button")
const pauseButton = document.createElement("button")
const stopButton = document.createElement("button")
{
    playButton.appendChild(document.createTextNode("play-all"))
    document.body.appendChild(playButton);
    pauseButton.appendChild(document.createTextNode("pause"))
    document.body.appendChild(pauseButton);
    stopButton.appendChild(document.createTextNode("stop"))
    document.body.appendChild(stopButton);
}
{
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}


const relavant_fields = ["translation","enphrase","wordtype","word","fnphrase",
    "wotd:transliteratedWord","wotd:transliteratedSentence"]

const prefix_ids = {
    "w" : "word ul",
    "auw" : "audio word only",
    "au" : "audio phrase",
    "ww" : "word li",
}

function isempty(obj) {
    return null == obj || Object.keys(obj).length == 0
}

const lang = Object.keys(j)[0]
j[lang].forEach( (w,ind) => {
    const wordDiv = document.createElement("div")
    document.body.appendChild(wordDiv)
    const wordUl = document.createElement("ul")
    wordDiv.appendChild(wordUl)
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
if (null != wwt && !isempty(wwt)) {
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
    const audioElement = document.createElement("audio")
    audioElement.setAttribute("id","au_"+ind)
    audioElement.setAttribute("src",
        `../transparent-sound/${lang}-sound/${w["date"]}-phrasesound.mp3`)
//    audioElement.controls = true
    audioElement.preload="none" // "auto|metadata|none">
    wordUl.appendChild(audioElement)
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
    wordUl.addEventListener("mouseenter", (ev) => {
//        wordDiv.style.fontSize='150%'
        wordDiv.style.color='aqua'
    })
    wordUl.addEventListener("mouseleave", (ev) => {
        wordDiv.style=null
    })
}
{
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}

})

const playlist = { start: 0, end: j[lang].length }

//for (let ind = playlist.start ; ind < playlist.end ; ++ind ) {

// TODO: Some struct keeping all global state:
let curPlaying = null

playButton.addEventListener("click", (ev) => {
    function addEventsAndPlay(ind) {
        const w = document.getElementById(`w_${ind}`)
        const ww = document.getElementById(`ww_${ind}`)
        const wwt = document.getElementById(`wwt_${ind}`)
        const au =  document.getElementById(`au_${ind}`)
//        const auNext =  document.getElementById(`au_${ind+1}`)
        au.addEventListener('play', (ev) => { 
            w.style.color='lime'
            w.style.fontSize='110%'
            ww.style.color='red'
            ww.style.fontSize='110%'
            w.scrollIntoView({inline: "center", behavior:"instant"})
        })
        au.addEventListener('ended', (ev) => { 
            w.style = null
            ww.style = null
            if (ind< playlist.end) {
                addEventsAndPlay(ind+1)
            }
            // rm curr events?
        })
        curPlaying = au
        au.play()
    }
    if (null != curPlaying) {
        curPlaying.play()
    } else {
        addEventsAndPlay(0)
    }
})

pauseButton.addEventListener("click", (ev) => {
    curPlaying.pause()
})

stopButton.addEventListener("click", (ev) => {
    curPlaying.pause()
    curPlaying.currentTime = 0
})

