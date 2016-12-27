var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var fs = require('fs');
var hbjs = require("handbrake-js");
var request = require('request');

var app = express();
var videoServer = require('./videoserver.js');
var api = require('./api/video-api.js');
var dataDir = config.dataDirectory,
viewDir = path.join(__dirname, 'views');

var user = config.user; //logic to extract user name/number

// view engine setup
// app.set('views', publicDir);
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// // uncomment after placing your favicon in /public
// app.use(favicon(publicDir + '/images/favicon.ico'));

//logger
// console.log('Connecting logger...');
// app.use(logger('dev'));
// console.log('Logger connected...');

//bodyparser
console.log('Enabling body parser...');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
console.log('Body Parser enabled...');

//mongoose connect
console.log('Connecting mongoose...');
mongoose.connect(config.mongoDbUrl);
console.log('Mongoose connected...');

//static
app.use(express.static(viewDir));

//code for video upload
app.post('/upload', function(req,res) {
  console.log('Upload route called...');
  var multiparty = require('multiparty');
  var form = new multiparty.Form();

  form.parse(req, function(err,fields,files) {
    if(err) throw err;
    console.log('Parsing...');
    console.dir(files);
    var vid = files.video[0];
    
    fs.readFile(vid.path, function(err,data) {
          if(err) throw err;
          console.log('Read file...');
          var directory = config.dataDirectory + '/' + user;
          if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
          }
          
          var path = directory +'/movie.'+vid.originalFilename.substr(vid.originalFilename.indexOf('.')+1);
          console.log('Writing file to : '+path);
          fs.writeFile(path,data, function(error) {
            if(error) {
              console.log(error);
              res.send('error');
            }
            var format = vid.originalFilename.substr(vid.originalFilename.length - 5);
            var outputPath;
            console.log('Format : '+format);
            if(format.indexOf('mp4') == -1) {
                outputPath = directory + '/' + 'movie.mp4';
                hbjs.spawn({ input: path, output: outputPath })
                  .on("error", function(err){
                    // invalid user input, no video found etc
                    console.log(err);
                  })
                  .on("progress", function(progress){
                    console.log(
                      "Percent complete: %s",
                      progress.percentComplete
                    );
                  });
            }
            if(format.indexOf('webm') == -1) {
                outputPath = directory + '/' + 'movie.webm';
                hbjs.spawn({ input: path, output: outputPath })
                  .on("error", function(err){
                    // invalid user input, no video found etc
                    console.log(err);
                  })
                  .on("progress", function(progress){
                    console.log(
                      "Percent complete: %s",
                      progress.percentComplete
                    );
                  })
                  .on("end", function(progress){
                    console.log('File Write Completed!');
                    // res.send('File Write Completed!<br><a href="/view">Click to View</a>');       
                    //res.redirect('/view');
                    request.post({url:'https://hm-blitz-video-sayanrajguha.c9users.io:8080/api/addVideo', form: {userID:user, duration:'00:00', isVideoSubmitted : true}}, function(err,httpResponse,body){ 
                      if(err) console.log(err);
                      console.log(body);
                      res.json(JSON.parse(body));
                    });
                  });
            }
          });
    });
  });

});
//routing
// app.get('/', function(req,res) {
//   res.redirect('/view');
// });

app.use('/api',api);
app.use('/view',videoServer);


//starting server
console.log("Starting server...");
var server = app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Server started on port : ' + server.address().port);
});

module.exports = app;