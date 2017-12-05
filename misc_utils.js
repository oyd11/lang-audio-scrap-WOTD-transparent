'use strict'

let fs = require('fs');
let isCLI = require.main === module;
let child_process = require('child_process')


// execSync: from stackoverflow advice:
// https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command
function systemSync(cmd) {
    console.log("exec: ", cmd)
    try {
        console.log("exec: ", cmd)
        return child_process.execSync(cmd).toString();
    }
    catch (error) {
        console.log(error)
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

function execIfMissing( execStr, localFn ) {
    if (null == localFn || !fs.existsSync(localFn)){
        let r = systemSync(execStr)
        return r
    }
    return null
}


module.exports = {
    execIfMissing: execIfMissing,
    systemSync: systemSync,
    mkDirSync: mkDirSync,
}

