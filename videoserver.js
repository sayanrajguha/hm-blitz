var router = require('express').Router();
var fs = require('fs'),
url = require('url');

router.get('/*', function(req,res) {

//read server video files
var indexPage, movie_webm, movie_mp4, movie_ogg;

// load the video files and the index html page
movie_webm = fs.readFileSync(req.app.get('userDirectory') + "/movie.webm");
movie_mp4 = fs.readFileSync(req.app.get('userDirectory') + "/movie.mp4");

indexPage = fs.readFileSync("./views/video-blog.html");
var reqResource = url.parse(req.url).pathname;
console.log('Path name : '+reqResource);

    if(reqResource == "/"){
    
        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    } else if (reqResource == "/favicon.ico"){
    
        res.writeHead(404);
        res.end();
    
    } else {

            var total;
            if(reqResource == "/movie.mp4"){
                total = movie_mp4.length;
            } 
            // else if(reqResource == "/movie.ogg"){
            //     total = movie_ogg.length;
            // } 
            else if(reqResource == "/movie.webm"){
                total = movie_webm.length;
            } 
                
            var range = req.headers.range;
            if(!range) {
                range='bytes=0-';
            }
            console.log('Range : '+range);
            
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            // if last byte position is not present then it is the last byte of the video file.
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end-start)+1;

            if(reqResource == "/movie.mp4"){
                console.log('Chunk start : ' + start);
                console.log('Chunk end : ' + end);
                
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie_mp4.slice(start, end+1), "binary");

            } 
            // else if(reqResource == "/movie.ogg"){
            //     res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
            //                          "Accept-Ranges": "bytes",
            //                          "Content-Length": chunksize,
            //                          "Content-Type":"video/ogg"});
            //     res.end(movie_ogg.slice(start, end+1), "binary");

            // } 
            else if(reqResource == "/movie.webm"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/webm"});
                res.end(movie_webm.slice(start, end+1), "binary");
            }
    }
});

module.exports = router;