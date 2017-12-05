
# Julia 0.6 syntax

using Glob

# utils:
el(n) = x->x[n]
###

inds=Dict()
files=Dict()

lang1 = "Russian"
lang2 = "Swedish"


include("inno-all-langs.jl")


for lang in [lang1, lang2]
    all_mp3z = glob("inno-download-sound/$(lang)-sound/*.mp3")
    open("inno-download-sound/$(lang)-all.m3u8","w") do f
        println(f, "#EXTM3U")
        println.(f,all_mp3z)
    end
    println("$lang:: $(length(all_mp3z)) files")
end

for lang in [lang1, lang2]

    f = cd("inno-download-sound/") do
        glob("$(lang)-sound/*_0word.mp3")
    end

    files[lang] = f
    println("$lang:: $(length(f)) words")
    ind_list =  f .|> splitdir .|> el(2) .|> splitext .|> el(1) .|> s->split(s,"_")[1] 
    inds[lang] = ind_list
end

both = intersect(inds[lang1] ,inds[lang2])
println("both: $(length(both)) words")

short1 = lang_short_names[lang1]
short2 = lang_short_names[lang2]

open("inno-download-sound/$(short1)$(short2).m3u8","w") do f
    println(f, "#EXTM3U")
    for ind in both
        println(f,"inno-download-sound/$(lang1)-sound/$(ind)_0word.mp3")
        println(f,"inno-download-sound/$(lang2)-sound/$(ind)_0word.mp3")
        l1 = glob("inno-download-sound/$(lang1)-sound/$(ind)_s*.mp3")
        l2 = glob("inno-download-sound/$(lang2)-sound/$(ind)_s*.mp3")
        for (x,y) in zip(l1,l2)
            println(f,x)
            println(f,y)
        end
        println(f,"inno-download-sound/$(lang1)-sound/$(ind)_0word.mp3")
        println(f,"inno-download-sound/$(lang2)-sound/$(ind)_0word.mp3")
    end
end

