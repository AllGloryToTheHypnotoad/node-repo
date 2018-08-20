#!/usr/bin/env node

// var watch = require("watch");
const {execSync} = require("child_process");
var chokidar = require("chokidar");

var watcher = chokidar.watch("test/*.txt", {
    ignored: /(^|[\/\\])\../,  // ???
    persistent: true,
    // usePolling: true
})

var FileChange = function(data){
    console.log(data);
    execSync("touch test/i-see-change.md");
}

watcher
    .on('add', path => FileChange(`File ${path} has been added`))  // added
    .on('change', path => FileChange(`File ${path} has been changed`))  // changed
    .on('unlink', path => FileChange(`File ${path} has been removed`))  // removed
    // .on('raw', (event, path, details) => console.log('Raw event info:', event, path, details););
    .on('ready', () => {
        FileChange('Initial scan complete. Ready for changes');
        var ls = execSync('which ls');
        console.log(ls.toString('ascii'));  // watcher is all ready
    });
