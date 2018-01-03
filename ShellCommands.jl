
# 
#  greg plowman's sh"" macro package:
# https://discourse.julialang.org/t/using-as-a-wildcard-in-backtick-commands/6094/5
#examples :  run(sh`jar cf dest.jar folder/*.class`)
#__precompile__()

module ShellCommands

export @cmd_cmd, @ps_cmd, @busybox_cmd, @sh_cmd, @bash_cmd

macro cmd_cmd(s_str)
    s_expr = parse(string('"', escape_string(s_str), '"'))
    return esc(:(Cmd(Base.cmd_gen(("cmd", "/s", "/c", string('"', $s_expr, '"'))), windows_verbatim=true)))
end

macro ps_cmd(s_str)
    s_expr = parse(string('"', escape_string(s_str), '"'))
    return esc(:(Base.cmd_gen(("powershell", "-Command", $s_expr))))
end

macro busybox_cmd(s_str)
    s_expr = parse(string('"', escape_string(s_str), '"'))
    return esc(:(Base.cmd_gen(("busybox", "sh", "-c", $s_expr))))
end

macro sh_cmd(s_str)
    s_expr = parse(string('"', escape_string(s_str), '"'))
    return esc(:(Base.cmd_gen(("sh", "-c", $s_expr))))
end

macro bash_cmd(s_str)
    s_expr = parse(string('"', escape_string(s_str), '"'))
    return esc(:(Base.cmd_gen(("bash", "-c", $s_expr))))
end

end # module

