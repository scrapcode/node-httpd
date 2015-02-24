var http = require('http');
var fs   = require('fs');
var mime = require('mime');
var debug = require('debug')('server');
var routes = require(__dirname + '/config/routes.json');

var server = http.createServer(function(req, res) {
  handleRouting(req, res);
});

/**
 * Serves a file
 */
function serveFile(res, filepath) {
  if(filepath.indexOf(__dirname) < 0) {
    filepath = filepath.indexOf('/') === 0
               ? (__dirname + filepath)
               : (__dirname + '/' + filepath)
  }

  fs.stat(filepath, function(err, stats) {
    if(err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      debug(err.type + ': ' + err.message);
      res.end("500: Internal Server Error");
    } else {
      res.writeHead(200, { 'Content-Type': mime.lookup(filepath) });
      fs.createReadStream(filepath)
          .pipe(res);
    }
  });
}

/**
 * Handle 404 errors
 */
function show404(res) {
  var pathTo404 = __dirname + "/public/404.html";
  serveFile(res, pathTo404);
}

/**
 * Routing
 */
function handleRouting(req, res) {
  if(routes[req.url] != undefined) {
    serveFile(res, 'public/' + routes[req.url]);
  } else {
    show404(res);
  }
}

/**
 * Start the server
 */
exports.listen = function(port, host) {
  server.listen(port, host);
}

this.listen(3000, "50.116.22.217");
