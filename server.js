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
    fs.readdir("albums", function(err, files) {
        if(err) {
            callback(make_error("file_error", JSON.stringify(err)));
            return;
        }

        var only_dirs = [];
        // calling instantly the function expression iterator with recursive stuffs
        (function iterator(index) {
            if (index == files.length) {
                callback(null, only_dirs);
                return;
            }
         fs.stat(
             "albums/" + files[index],
             function(err, stats) {
             if(err) {
                 callback(make_error("file_error", JSON.stringify(err)));
                 return;
             }
             if (stats.isDirectory()) {
                 var obj = { name: files[index]};
                 only_dirs.push(obj);
             }
             iterator(index + 1)
             }
         );
        })(0);
    }
    );
}

function load_album(album_name, callback) {
    // assume directory in albums subfolder is an album
    fs.readdir(
        "albums/" + album_name, function(err, files) {
            if(err) {
                if (err.code == "ENOENT") {
                    callback(no_such_album());
                } else {
                    callback(make_error("file_error", JSON.stringify(err)));
                }
                return;
            }

            var only_files = [];
            var path = "albums/" + album_name + "/";

            (function iterator(index) {
                if (index == files.length) {
                    var obj = { short_name: album_name,
                                photos: only_files };
                    callback(null, obj);
                    return;
                }

                fs.stat( path + files[index], function (err, stats) {
                    if (err) {
                        callback(make_error("file_error", JSON.stringify(err)));
                        return;
                    }
                    if (stats.isFile()) {
                        var obj = { filename: files[index],
                                    desc: files[index] };
                        only_files.push(obj);
                    }
                    iterator(index + 1);
                });
            })(0);
        }
    );
}


function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    if (req.url == '/albums.json') {
        handle_list_albums(req, res);
    } else if (req.url.substr(0, 7) == '/albums' && req.url.substr(req.url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else {
        send_failure(res, 404, invalid_resource());
    }
}

function handle_list_albums(req, res) {
    load_album_list(function (err, albums) {
        if (err) {
            send_failure(res, 500, err);
            return;
        }

        send_success(res, { albums: albums });
    });
}

function handle_get_album(req, res) {
    // format of request is /albums/album_name.json
    var album_name = req.url.substr(7, req.url.length - 12);
    load_album(album_name, function(err, album_contents) {
        if(err && err.error == "no_such_album") {
            send_failure(res, 400, err);
        } else if (err) {
            send_failure(res, 500, err);
        } else {
            send_success(res, { album_data: album_contents });
        }
    });
}

// make error goes here...

var s = http.createServer(handle_incoming_request);
s.listen(8080);



