#!/usr/bin/env node
/*
[Service]
ExecStart=/usr/local/bin/http-server /home/pi/www
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=repository
User=pi
Group=pi
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
*/

const {execSync} = require("child_process");  // call command line
var chokidar = require("chokidar");           // watches files
var fs = require('fs');                       // filing system
var http = require('http');                   // create http server
var finalhandler = require('finalhandler');   // return errors
// var Router = require('router');
const path = require('path');                 // handle file path
const url = require('url');                   // handle url requests
// var mime = require('mime-types');

// https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
const mime = {
    '.deb' : 'application/x-debian-package',
    '.html' : 'text/html'
}

// The debian files are located in www/debian, call this function when they change
var FileChange = function(data){
    console.log(data);
    // execSync("dpkg-scanpackages www/debian /dev/null | gzip -9c > debian/Packages.gz");
}

// watch for changes in debian packages
var watcher = chokidar.watch("www/debian/*.deb", {
    ignored: /(^|[\/\\])\../,  // ???
    persistent: true
})

// set the watcher to notify of: added, changed, removed files
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

// default router returns info
// router.get('/', function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end('Turn a device ON or OFF');
// });

// create the static webserver to handle requests
// https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
http.createServer(function (req, res) {
    // router(req, res, finalhandler(req, res));
    const parsedUrl = url.parse(req.url);
    const pathname = `.${parsedUrl.pathname}`;
    const ext = path.parse(pathname).ext;

    fs.exits(pathname, function(exits){

    });
}).listen(port);
