/**
 * Created with JetBrains WebStorm.
 * User: tmacbook
 * Date: 9/5/13
 * Time: 10:27 AM
 * Author:  TJ Marbois
 */
// simple req res analysis
var http = require('http');

function handle_incoming_request(req, res) {
    console.log("----------------------------------------------");
    console.log(req);
    console.log("----------------------------------------------");
    // console.log(res);
    // console.log("----------------------------------------------");
    res.writeHead(200, {"Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: null }) + "\n");
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);

