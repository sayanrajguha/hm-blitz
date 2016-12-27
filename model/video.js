var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = new Schema({
    userID : String,
    duration : String,
    isVideoSubmitted : Boolean,
    likes : [String],
    comments : [{
        userID : String,
        comment : String
    }]
});

var Video = module.exports = mongoose.model('Video',VideoSchema);

module.exports.videoAdded = function(newVideo, callback) {
  newVideo.save(callback);
}

module.exports.getVideo = function(id,callback) {
    Video.findById(id,callback);
}

module.exports.getVideoByUser = function(userID, callback) {
    Video.find({userID : userID},null,null, callback);
}

module.exports.getAllVideos = function(callback) {
    Video.find({},null,null, callback);
}

module.exports.addComment = function(id,newComment,callback) {
    Video.getVideo(id, function(err, video) {
       if(err) throw err;
       if(!video) callback(null,false);
       console.log('video of user ' + video.userID + ' found..');
       var comment = {
           userID : newComment.userID,
           comment : newComment.comment
       };
       video.comments.push(comment);
       video.save(callback);
    });
}

module.exports.removeComment = function(id,callback) {
    Video.comments.pull(id);
    Video.save(callback);
}

module.exports.addLike = function(id,userID,callback) {
    var liked = false;
    Video.getVideo(id, function(err, video) {
       if(err) throw err;
       if(!video) callback(null,false);
       console.log('video of user ' + video.userID + ' found..');
       if(video.likes.indexOf(userID) == -1) {
        video.likes.push(userID);
        
       } else {
        video.likes.splice(video.likes.indexOf(userID), 1);
        
       }
       video.save(callback);
    });
}

// module.exports.removeLike = function(id,userID,callback) {
//     Video.getVideo(id, function(err, video) {
//       if(err) throw err;
//       if(!video) callback(null,false);
//       console.log('video of user ' + video.userID + ' found..');
//       if(video.likes.indexOf(userID) == -1) {
//         video.likes.pull(userID);
//       }
//       video.save(callback);
//     });
// }