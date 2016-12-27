$(document).ready(function() {
   var videoID = $('#my-video'), sourceID = $('#my-video-mp4');
   $("#loadVideo1").on('click', function(event) {
       event.preventDefault();
       //retreive video id
      $.ajax({
      type : 'GET',
      url : 'api/getVideo/5862693999b7f565c759015f',
      dataType : 'json',
      cache : false,
      error : function(err) {
        console.log(err);
      },
      success : function(response) {
         console.log(response);
         videoID.get(0).pause();
         sourceID.attr('src', 'view/video/' + response.userDir);
         videoID.get(0).load();
         videoID.get(0).play();
      }
    });
       
   });
   $("#loadVideo2").on('click', function(event) {
       event.preventDefault();
       //retreive video id
      $.ajax({
      type : 'GET',
      url : 'api/getVideo/586269b2a37c7f66da5bb6ba',
      dataType : 'json',
      cache : false,
      error : function(err) {
        console.log(err);
      },
      success : function(response) {
         console.log(response);
         videoID.get(0).pause();
         sourceID.attr('src', 'view/video/' + response.userDir);
         videoID.get(0).load();
         videoID.get(0).play();
      }
    });
       
   });
   $("#loadVideo3").on('click', function(event) {
       event.preventDefault();
       //retreive video id
      $.ajax({
      type : 'GET',
      url : 'api/getVideo/58626a559331de678dc9709b',
      dataType : 'json',
      cache : false,
      error : function(err) {
        console.log(err);
      },
      success : function(response) {
         console.log(response);
         videoID.get(0).pause();
         sourceID.attr('src', 'view/video/' + response.userDir);
         videoID.get(0).load();
         videoID.get(0).play();
      }
    });
       
   });
   
   $('#videoUploadForm').ajaxForm({
        beforeSend: function() {
          $('#uploadVideoModal').modal('hide');
          $.blockUI({ message: '<h3><img src="images/spinner.gif" /> Processing...</h1>' });
        },
        success: function(response) {
          console.log('success');
          videoID.get(0).pause();
          sourceID.attr('src', 'view/video/' + response.data.userID);
          videoID.get(0).load();
          videoID.get(0).play();
        },
    	complete: function() {
          $.unblockUI();
          $('.upload').hide();
    	}
    }); 
    
});