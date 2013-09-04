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
    load_album_list(function(err, albums) {
        if(err) {
            res.writeHead(503, {"Content-Type" : "application/json"});
            res.end(JSON.stringify(err) + "\n");
            return;
        }

        var out = { error: null,
                    data: {albums: albums}};
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify(out) + "\n");
    });
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);

