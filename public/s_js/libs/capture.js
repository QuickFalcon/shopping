(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 667;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var videorun = null;
//The startup() function is run when the page has finished loading, courtesy of window.addEventListener(). This function's job is to request access to the user's webcam, 
  function startup() {
   	    video = document.getElementById('video');

    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    videorun = document.getElementById('videorun');
    // navigator.getMedia = ( navigator.getUserMedia ||
                           // navigator.webkitGetUserMedia ||
                           // navigator.mozGetUserMedia ||
                           // navigator.msGetUserMedia);

    // navigator.getMedia(
      // {
        // video: true
        // audio: false
      // },
      // function(stream) {
	    
        // if (navigator.mozGetUserMedia) {
          // video.mozSrcObject = stream;
        // } else {
		
		
		
          // var vendorURL = window.URL || window.webkitURL;
          // video.src = vendorURL.createObjectURL(stream);
        // }
        
		// video.onloadedmetadata = function(e) {
           // video.play();
         // };
		
		
		// //video.play();
      // },
      // function(err) {
        // console.log("An error occured! " + err.name);
      // }
    // );
	// get media end
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		  
		  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
// -
         var constraints = {video: true};
// -
        // function successCallback(localMediaStream) {
          // window.stream = localMediaStream; // stream available to console
          // video.src = window.URL.createObjectURL(localMediaStream);
          // video.play();
        // }
			function successCallback(stream) {
				if (video.mozSrcObject !== undefined) {
					video.mozSrcObject = stream;
				} else {
					video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				};
				video.play();
			}
        function errorCallback(error){
          console.log("navigator.getUserMedia error: ", error.name);
        }
		if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, successCallback, errorCallback);
		} 



    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);


    videorun.addEventListener('click', function(ev){

        streaming = false;
         video.pause();

    }, false);

	startbutton.addEventListener('click', function(ev){

	 takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);

  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.
 function  startvideo(){
 
   // document.getElementById('p').value = "rajib";

 
 }
  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
	   // var data = canvas.toDataURL();
      photo.setAttribute('src', data);
//	 p.setAttribute('value',data);
// var data_rep= data.replace("data:image/png;base64,","");
// var data_rep2= data_rep.replace(" ","+");
// var data_Base = Base64.decode(data_rep2);
 //document.getElementById('p').value = data_rep2;
  document.getElementById('p').value = data;

    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
 // window.addEventListener('load', startup, false);
 var el = document.getElementById("loadbutton");
 el.addEventListener("click", startup, false);
 
})();
