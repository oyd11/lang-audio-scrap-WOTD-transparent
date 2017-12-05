
# Julia 0.6 syntax

using Glob

# utils:
el(n) = x->x[n]
###

inds=Dict()
files=Dict()

for lang in ["Russian","Swedish"]
println("$lang::")

    f = cd("inno-download-sound/") do
        glob("$(lang)-sound/*0word.mp3")
    end

    files[lang] = f
    ind_list =  f .|> splitdir .|> el(2) .|> splitext .|> el(1) .|> s->split(s,"_")[1] 
    inds[lang] = ind_list
end

both = intersect(inds["Russian"] ,inds["Swedish"])

