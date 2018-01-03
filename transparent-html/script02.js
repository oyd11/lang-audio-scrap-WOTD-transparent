
// assumed: defined 'j' - JSON + 'lang' - language string

{
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}
const playButton = document.createElement("button")
const stopButton = document.createElement("button")
{
    playButton.appendChild(document.createTextNode("play-all"))
    document.body.appendChild(playButton);
    stopButton.appendChild(document.createTextNode("stop"))
    document.body.appendChild(stopButton);
}
{
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}


relavant_fields = ["translation","enphrase","wordtype","word","fnphrase",
    "wotd:transliteratedWord","wotd:transliteratedSentence"]

prefix_ids = {
    "w" : "word ul",
    "auw" : "audio word only",
    "au" : "audio phrase",
    "ww" : "word li",
}

const lang = Object.keys(j)[0]
j[lang].forEach( (w,ind) => {
const wordUl = document.createElement("ul")
document.body.appendChild(wordUl)
wordUl.setAttribute("id","w_"+ind)
{
    const newLi= document.createElement("li")
    newLi.textContent = `${w["word"]} :: ${w["translation"]} (${w["wordtype"]})`
    wordUl.appendChild(newLi)
}
{
    const newLi= document.createElement("li")
    newLi.textContent = w["fnphrase"]
    newLi.setAttribute("id","ww_"+ind)
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
    const newHr = document.createElement("hr")
    document.body.appendChild(newHr)
}

} )

const playlist = { start: 0, end: j[lang].length }

//for (let ind = playlist.start ; ind < playlist.end ; ++ind ) {

let curPlaying = null
playButton.addEventListener("click", (ev) => {
    function addEventsAndPlay(ind) {
        const t = document.getElementById(`ww_${ind}`)
        const au =  document.getElementById(`au_${ind}`)
//        const auNext =  document.getElementById(`au_${ind+1}`)
        au.addEventListener('play', (ev) => { 
            t.style.color='red'
            t.style.fontSize='150%'
        })
        au.addEventListener('ended', (ev) => { 
            t.style = null
            if (ind< playlist.end) {
                addEventsAndPlay(ind+1)
            }
            // rm curr events?
        })
        curPlaying = au
        curPlaying.play()
    }
    if (null != curPlaying) {
        curPlaying.play()
    } else {
        addEventsAndPlay(0)
    }
})

playButton.addEventListener("click", (ev) => {
    curPlaying.stop()
})

{
    let ind = 0
    const t = document.getElementById(`ww_${ind}`)
    //const t = document.getElementById('w_${ind}')

    document.getElementById(`au_${ind}`).addEventListener('play',
     (ev) => { 
         t.style.color='red'
         t.style.fontSize='150%'
    })
    document.getElementById(`au_${ind}`).addEventListener('ended',
         (ev) => { 
            t.style = null
    //         ph3.play()
    })
}

