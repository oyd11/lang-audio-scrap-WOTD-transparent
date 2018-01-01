#!/usr/bin/env julia

using Glob
using JSON

lang = "russian"

include("head-part.html.jl")

o_list = cd("transparent-download/$lang") do
    j_files = glob("*.json")
    o_list = map(j_files) do fn
        o = JSON.parsefile(fn)
        o["word"], o["fnphrase"]
        o["wotd:transliteratedWord"]
        o["wotd:transliteratedSentence"]
        o
    end
    return o_list
end





