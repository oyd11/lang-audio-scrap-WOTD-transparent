#!/usr/bin/env julia

## Requires utilities:
##  * 'sox' - to play audio
##  * 'say' - to synthesize speech
## (MacOS, otherwise - provide an alternative)

######## Configuration::  #######
src_voice = "Boing"
#src_voice = "Bad News"
#src_voice = "Good News"
#src_voice = "Serena"
#src_voice = "Trinoids"
#src_voice = "Zarvox"

src_rate = 280
#src_rate = 520
target_rate = 200

voice_map = Dict([
    "arabic" => "Maged"
#    "balinese"
#    "balinese-indonesian"
#    "dari"
    "dutch" => "Xander"
#    "english-portuguese"
#    "english-spanish"
#    "esperanto"
    "french" => "Thomas"
    "hebrew" => "Carmit"
    "hindi"
    "indonesian"
    "irish"
    "italian" => "Alice"
    "japanese" => "Kyoko"
    "korean" => "Yuna"
#    "latin"
    "mandarin" => "Ting-Ting"
    "norwegian" => "Nora"
#    "pashto"
    "polish" => "Zosia"
    "portuguese" => "Luciana"
    "portuguese" => "Joana"
    "russian" => "Milena"
#    "russian" => "Yuri"
#    "spanish" => "Diego"
#    "spanish" => "Jorge"
#    "spanish" => "Juan"
    "spanish" => "Monica"
#    "spanish" => "Monica"
#    "spanish" => "Paulina"
    "swedish" => "Alva"
    "turkish" => "Yelda"
#    "turkish" => "Tarik"
#    "urdu"
])




######## End configuration




all_langs = ["russian", "arabic" ,"english-spanish" ,"irish" ,"norwegian" ,"swedish" ,"balinese" ,"esperanto" ,"italian" ,"pashto" ,"turkish" ,"balinese-indonesian" ,"french" ,"japanese" ,"polish" ,"urdu" ,"dari" ,"hebrew" ,"korean" ,"portuguese" ,"dutch" ,"hindi" ,"latin" ,"english-portuguese" ,"indonesian" ,"mandarin" ,"spanish"]


if length(ARGS)<1
    warn("Missing language argument")
    info("languages: ", join(all_langs, ", "))
    error("No language input")
end

lang = ARGS[1] 

using Glob
using JSON

include("ShellCommands.jl")
using ShellCommands

if !(lang in all_langs)
    warn("No phrases for language '$lang'")
    info("languages: ", join(all_langs, ", "))
    error("No phrases for '$lang'")
end


date_format = DateFormat("mm-dd-yyyy")
mk_date(str) = Date(str, date_format )

function get_lang_jsons(lang) 
o_list = cd("transparent-download/$lang") do
    j_files = glob("*.json")
    o_list = map(j_files) do fn
        o = JSON.parsefile(fn)
    end
    return sort(o_list ; by=x->x["date"]|>mk_date)
end # cd

end

start_ind = if length(ARGS) > 1
    parse(Int, ARGS[2])
else
    1
end

println("lang: $lang")
if !haskey(voice_map, lang) 
    error("No Voice defined for '$lang', quiting.")
end
target_voice = voice_map[lang]

try
    `say ""` |> run
catch ex
    warn("Failed running 'say' utility, see, 'man say' on macos")
    throw(ex)
end
try
    `say -v "$target_voice" ""` |> run
catch ex
    warn("'say' with voice '$target_voice' failed - quiting:")
    info("see installed voices on your system:")
    info(raw"$ say -v \?")
    info("or see GUI: 'System Preferences/Accessibility/Speech/' to add voices")
    # synth_voices =  `say -v \?` |> run 
    throw(ex)
end

## TODO: o_list - common function to both scripts
o_list = get_lang_jsons(lang)

info("Done processing, starting list: $(length(o_list)) phrases")
info("-------------")

empty_or_nothing(q) = nothing == q || isempty(q)

ind = start_ind
while ind <= length(o_list)
    o = o_list[ind]
    fnphrase = o["fnphrase"]
    fnphrase_t = get(o,"wotd:transliteratedSentence",nothing)
    enphrase = o["enphrase"]
    wordtype = o["wordtype"]
    word = o["word"]
    word_t = get(o,"wotd:transliteratedWord",nothing)
    translation = o["translation"]
    date = o["date"]


    cmd_play_word = `play -q transparent-html/$lang-sound/$date-wordsound.mp3`
    cmd_play_phrase = `play -q transparent-html/$lang-sound/$date-phrasesound.mp3`
    cmd_say_target_word = `say -i -v "$target_voice" -r $target_rate "$word"`
    cmd_say_target = `say -i -v "$target_voice" -r $target_rate "$fnphrase"`
    cmd_say_src = `say -i -v "$src_voice" -r $src_rate "$enphrase"`

    println("$word :: $translation ($wordtype)") 
    empty_or_nothing(word_t) || println(word_t)
    #println(fnphrase)
    println(enphrase)
    println(ind)

    run(cmd_play_word)
    empty_or_nothing(fnphrase_t) || println(fnphrase_t)
    run(cmd_say_target)
    run(cmd_play_phrase)
    run(cmd_say_src)
    run(cmd_play_phrase)
    run(cmd_say_target)
    println("-------------")
    sleep(0.2)
    ind += 1
end

end 


