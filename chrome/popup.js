  var dataURLtoBlob = function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = parts[1];

          return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    };

$(document).ready(function() {

  var streaming = false,
      video        = document.querySelector('#video'),
      canvas       = document.querySelector('#canvas'),
      photo        = document.querySelector('#photo'),
      width = 320,
      height = 0;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  $('#authenticate').click(function(){
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var dataBlob = dataURLtoBlob(canvas.toDataURL('image/png'));

    authenticate(dataBlob, function(result) {
        var username = result.userAccounts.facebook.username,
            password = result.userAccounts.facebook.password;
        chrome.tabs.executeScript({
            code: 'document.querySelector("#email").value = "' + username + '";' +
                  'document.querySelector("#pass").value = "' + password + '";'
        });

        chrome.tabs.executeScript(null, {file: "inject_eventFire.js"});
    });


    // Testing out injecting facebook login
  });

  $('#register').click(function() {
    $('#loginform').show();
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var uri = canvas.toDataURL('image/png');
    var dataBlob = dataURLtoBlob(uri);
    var username = $('#loginText').val();
    var password = $('#passwordText').val();

    var userAccount = {};
    userAccount.facebook = {'username' : username, 'password' : password};
    register(dataBlob, userAccount, function(result) {});
  });

});
