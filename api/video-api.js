var express = require('express');
var router = express.Router();
var Video = require('../model/video');
var fs = require('fs'),
url = require('url');
var response = {};
var config = require('../config/config');
router.use(function(req,res,next) {
  response = {};
  next();
});

router.get('/all', function(req,res) {
   Video.getAllVideos(function(err,result) {
      if(err) {
        response = {
         statusCode : 400,
         message : 'Internal Server Error'
        };
      } else {
        response = {
        statusCode : 200,
        data : result
      };    
      }
      res.json(response);
   });
});

router.get('/getVideo/:id', function(req,res) {
    console.log('in get video route with id : '+req.params.id);
   Video.getVideo(req.params.id, function(err, video) {
       if(err) {
           response = {
             statusCode : 400,
             message : 'Ínternal Server Error'
           };
           res.json(response);
           return;
       } else {
        //   config.userDirectory = video.userID;
           console.log('user directory  : '+video.userID);
           res.json({userDir : video.userID});
       }
   });
});

router.post('/addVideo', function(req,res) {
    console.log('add video route called..');
    var newVideo = new Video({
        userID : req.body.userID,
        duration : req.body.duration,
        isVideoSubmitted : req.body.isVideoSubmitted,
        likes : [],
        comments : []
    });
    Video.videoAdded(newVideo, function(err,data) {
        if(err) {
            response = {
                statusCode : 400,
                message : 'Internal Server Error'
            };
        } else {
            response = {
                statusCode : 200,
                data : data
            }
        }
        res.json(response);
    });
});

router.post('/addComment/:id',function(req,res) {
   console.log('add comment route called..') ;
   var newComment = {
     userID : req.body.userID,
     comment : req.body.comment
   };
   Video.addComment(req.params.id, newComment, function(err, data) {
       if(err) {
           response = {
               statusCode : 400,
               message : 'Internal Server Error'
           }
       } else {
           response = {
             statusCode : 200,
             data : data
           };
       }
       res.json(response);
   });
});

router.post('/like/:id',function(req,res) {
   console.log('like route called..') ;
   Video.addLike(req.params.id, req.body.userID, function(err, data) {
      if(err) {
          console.log(err);
          response = {
            statusCode : 400,
            message : 'Internal Server Error'
          };
      } 
      else {
           response = {
             statusCode : 200,
             data : data
           };
       }
       res.json(response);
   });
   
});



module.exports = router;