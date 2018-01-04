#!/usr/bin/env julia

using Glob
using JSON

include("ShellCommands.jl")
using ShellCommands

langs = ["russian", "arabic" ,"english-spanish" ,"irish" ,"norwegian" ,"swedish" ,"balinese" ,"esperanto" ,"italian" ,"pashto" ,"turkish" ,"balinese-indonesian" ,"french" ,"japanese" ,"polish" ,"urdu" ,"dari" ,"hebrew" ,"korean" ,"portuguese" ,"dutch" ,"hindi" ,"latin" ,"english-portuguese" ,"indonesian" ,"mandarin" ,"spanish"]


date_format = DateFormat("mm-dd-yyyy")
mk_date(str) = Date(str, date_format )

#langs = ["hebrew"]
for lang in langs

    println("lang: $lang")


o_list = cd("transparent-download/$lang") do
    j_files = glob("*.json")
    o_list = map(j_files) do fn
        o = JSON.parsefile(fn)
#        o["word"], o["fnphrase"]
#        o["wotd:transliteratedWord"]
#        o["wotd:transliteratedSentence"]
        o
    end
    return sort(o_list ; by=x->x["date"]|>mk_date)
end # cd

cd("transparent-html") do
    open("./$(lang)_all.json","w") do f
        JSON.print(f, Dict([lang => o_list]), 2)
    end

    run(sh`cat ../render/script01.js $(lang)_all.json ../render/script02.js > $(lang)_all.js`)

end # cd


end # lang loop

