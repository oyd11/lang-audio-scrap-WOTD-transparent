
# Julia 0.6 syntax

using Glob

# utils:
el(n) = x->x[n]
###

inds=Dict()
files=Dict()

lang1 = "Russian"
lang2 = "Finnish"


include("inno-all-langs.jl")

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

    short1 = lang_short_names[lang1]
    short2 = lang_short_names[lang2]

    fn_playlist = "$(short1)$(short2).m3u8"
    println("Creating: $(fn_playlist)")
    open(fn_playlist,"w") do f
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
end # cd

