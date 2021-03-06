#!/usr/bin/env julia
# Julia 0.6 syntax

if length(ARGS) != 2 
    println("Required exactly 2 args: pair of langs")
    quit()
end

add_eng_src = true 
# dir: "eng-src"
lang1, lang2 = ARGS[1], ARGS[2]
#lang1 = "Russian"
#lang2 = "Swedish"
println("Will run: $lang1 - $lang2")

include("inno-all-langs.jl")
short1 = lang_short_names[lang1]
short2 = lang_short_names[lang2]

println(" => $short1$short2 ")

using Glob

# utils:
el(n) = x->x[n]
###

inds=Dict()
files=Dict()




cd("inno-download-sound") do
    for lang in [lang1, lang2]
        all_mp3z = glob("$(lang)-sound/*.mp3")
        fn_playlist = "0_$(lang)-all.m3u8"
        println("Creating: $(fn_playlist)")
        open(fn_playlist,"w") do f
            println(f, "#EXTM3U")
            println.(f,all_mp3z)
        end
        println("$lang:: $(length(all_mp3z)) files")
    end

    for lang in [lang1, lang2]

        f_list = glob("$(lang)-sound/*_0word.mp3")

        files[lang] = f_list
        println("$lang:: $(length(f_list)) words")
        ind_list =  f_list .|> splitdir .|> el(2) .|> splitext .|> el(1) .|> s->split(s,"_")[1] 
        inds[lang] = ind_list
    end

    both = intersect(inds[lang1] ,inds[lang2])
    println("both: $(length(both)) words")


    fn_playlist = "$(short1)$(short2).m3u8"
    println("Creating: $(fn_playlist)")
    open(fn_playlist,"w") do f
        println(f, "#EXTM3U")
        for ind in both
            println(f,"$(lang1)-sound/$(ind)_0word.mp3")
            println(f,"$(lang2)-sound/$(ind)_0word.mp3")
            l1 = glob("$(lang1)-sound/$(ind)_s*.mp3")
            l2 = glob("$(lang2)-sound/$(ind)_s*.mp3")
            for (x,y) in zip(l1,l2)
                println(f,x)
                println(f,y)
            end
            println(f,"$(lang1)-sound/$(ind)_0word.mp3")
            println(f,"$(lang2)-sound/$(ind)_0word.mp3")
        end
    end
end # cd

