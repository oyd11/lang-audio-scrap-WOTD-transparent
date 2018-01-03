#!/usr/bin/env julia

using Glob
using JSON

include("ShellCommands.jl")
using ShellCommands

lang = "russian"
#lang = "hebrew"
#lang = "spanish"

include("head-part.html.jl")

date_format = DateFormat("mm-dd-yyyy")
mk_date(str) = Date(str, date_format )

o_list = cd("transparent-download/$lang") do
    j_files = glob("*.json")
    o_list = map(j_files) do fn
        o = JSON.parsefile(fn)
        o["word"], o["fnphrase"]
        o["wotd:transliteratedWord"]
        o["wotd:transliteratedSentence"]
        o
    end
    return sort(o_list ; by=x->x["date"]|>mk_date)
end # cd

cd("transparent-html") do
    open("./$(lang)_all.json","w") do f
        JSON.print(f, Dict([lang => o_list]), 2)
    end

    run(sh`cat script01.js $(lang)_all.json script02.js > $(lang)_all.js`)

end # cd



