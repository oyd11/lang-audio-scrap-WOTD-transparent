
function execIfMissing( execStr, localFn ) {
    if (!fs.existsSync(localFn)){
        let r = systemSync(execStr)
        return r
    }
    return null
}

// execSync: from stackoverflow advice:
// https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command
function systemSync(cmd) {
    console.log("exec: ", cmd)
    try {
        return child_process.execSync(cmd).toString();
    }
    catch (error) {
        error.status;  // Might be 127 in your example.
        error.message; // Holds the message you typically want.
        error.stderr;  // Holds the stderr output. Use `.toString()`.
        error.stdout;  // Holds the stdout output. Use `.toString()`.
    }
}

function mkDirSync(dir) {
    if (!fs.existsSync(dir)){
            fs.mkdirSync(dir); 
    }
}


module.exports = {
    execIfMissing: execIfMissing,
    systemSync: systemSync,
    mkDirSync: mkDirSync,
}

