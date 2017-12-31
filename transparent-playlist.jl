#!/usr/bin/env julia
# Julia 0.6 syntax

if length(ARGS) != 1 
    println("Required exactly 1 arg: lang")
    quit()
end

add_eng_src = true 
# dir: "eng-src"
lang1 = ARGS[1]
#lang1 = "russian"
#lang2 = "Swedish"
println("Will run: $lang1")

using Glob

# utils:
el(n) = x->x[n]
###

inds=Dict()
files=Dict()




cd("./transparent-sound/") do
    lang = lang1
    all_mp3z = glob("$(lang)-sound/*.mp3")
    fn_playlist = "../transparent-playlists/0_$(lang)-all.m3u8"
    println("Creating: $(fn_playlist)")
    open(fn_playlist,"w") do f
        println(f, "#EXTM3U")
        println.(f,all_mp3z)
    end
    println("$lang:: $(length(all_mp3z)) files")

    all_phrases = cd("$(lang)-sound/") do
        glob("*-phrasesound.mp3")
    end 
    base_phases = split.(all_phrases,"phrasesound") .|> el(1)
    reps = 3
    r = repmat(base_phases,reps) |> shuffle
    filelist = 
    fn_rep_playlist = "../transparent-playlists/0_$(lang)-rep.m3u8"
    println("Creating: $(fn_rep_playlist)")
    open(fn_rep_playlist,"w") do f
        println(f, "#EXTM3U")
        for fn in r
            println(f, "$(lang)-sound/$(fn)phrasesound.mp3")
            println(f, "$(lang)-sound/$(fn)wordsound.mp3")
        end
    end

end # cd

