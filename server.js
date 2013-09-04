/**
 * Created with JetBrains WebStorm.
 * User: tmacbook
 * Date: 9/4/13
 * Time: 6:44 PM
 * Author:  TJ Marbois
 */
var http = require('http');
var fs = require('fs');

function load_album_list(callback) {
    fs.readdir("albums/", function(err, files) {
        if(err) {
            callback(err);
            return;
        }
        callback(null, files);
    });
}

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    res.writeHead(200, {"Content-Type" : "application/json"});
    res.end(JSON.stringify( { error: null }) + "\n");
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);

