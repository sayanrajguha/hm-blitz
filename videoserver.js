var router = require('express').Router();
var fs = require('fs'),
path = require('path'),
config = require('./config/config'),
url = require('url');
var request = require('request');
var viewDir = path.join(__dirname,'views');
var dataDir = path.join(__dirname, 'data');

router.get('/', function(req, res) {
    console.log('default route on /view/');
    res.writeHead(200, {'Content-Type': 'text/html'});    
    var readStream = fs.createReadStream(path.join(viewDir, 'video-blog.html'))
    .on('open', function() {
        readStream.pipe(res);
    })
    .on('error', function(err) {
        res.end(err);
    });
});

router.get('/video/:path', function(req,res) {
    console.log('stream video route on /view/video');
    console.log('Path received : '+req.params.path);
    var videoFilePath = path.join(dataDir, req.params.path, 'movie.mp4');
    console.log('Video file path : '+videoFilePath);
    var range = req.headers.range;
    if(!range) {
        range='bytes=0-';
    }
    console.log('Range : '+range);
    
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    fs.stat(videoFilePath, function(err, stats) {
        if(err) { 
            res.end(err);
        }
        console.dir(stats);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunkSize = (end - start) + 1;
        console.log('Start : '+start);
        console.log('End : '+end);
        console.log('Total : '+total);
        console.log('Chunksize : '+chunkSize);
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });
        
        var readStream = fs.createReadStream(videoFilePath, { start: start, end: end })
        .on('open', function() {
            readStream.pipe(res);
        })
        .on('error', function(err) {
            res.end(err);
        });
        res.on('close', function() {
           readStream = null; 
        });
    });
});

module.exports = router;