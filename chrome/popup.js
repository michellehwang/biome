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
      photo        = document.querySelector('#photo'),
      width = 480,
      height = 240;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
        video: {
            mandatory: {
              minWidth: 1280,
              minHeight: 720,
              minFrameRate: 30
            },
            optional: [
              { minFrameRate: 60 }
            ]
          },
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
      //canvas.setAttribute('width', width);
      //canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  $('#authenticate').click(function(){
    var dataBlob = takeImage();

    authenticate(dataBlob, function(result) {
        var username = result.userAccounts.facebook.username,
            password = result.userAccounts.facebook.password;

        // Facebook login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#email").value = "' + username + '";' +
                  'document.querySelector("#pass").value = "' + password + '";'
        });

        // Gmail login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#Email").value = "' + username + '";' +
                  'document.querySelector("#Passwd").value = "' + password + '";'
        });

        // Dropbox login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#login_email").value = "' + username + '";' +
                  'document.querySelector("#login_password").value = "' + password + '";'
        });

        chrome.tabs.executeScript(null, {file: "inject_eventFire.js"});

        window.close();
    });

  });

  $('#register').click(function() {
    var dataBlob = takeImage();

    var fbusername = $('#fbloginText').val(),
        fbpassword = $('#fbpasswordText').val(),
        gmailusername = $('#gmailloginText').val(),
        gmailpassword = $('#gmailpasswordText').val(),
        dropboxusername = $('#dropboxloginText').val(),
        dropboxpassword = $('#dropboxpasswordText').val();

    var userAccount = {};
    userAccount.facebook = {'username' : fbusername, 'password' : fbpassword};
    userAccount.gmail = {'username' : gmailusername, 'password' : gmailpassword};
    userAccount.dropbox = {'username' : dropboxusername, 'password' : dropboxpassword};

    register(dataBlob, userAccount, function(result) {
        // Facebook login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#email").value = "' + fbusername + '";' +
                  'document.querySelector("#pass").value = "' + fbpassword + '";'
        });

        // Gmail login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#Email").value = "' + gmailusername + '";' +
                  'document.querySelector("#Passwd").value = "' + gmailpassword + '";'
        });

        // Dropbox login
        chrome.tabs.executeScript({
            code: 'document.querySelector("#login_email").value = "' + dropboxusername + '";' +
                  'document.querySelector("#login_password").value = "' + dropboxpassword + '";'
        });

        chrome.tabs.executeScript(null, {file: "inject_eventFire.js"});

        window.close();
    });
  });

  $('#addimage').click(function() {
  });


    function takeImage() {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.insertBefore(canvas, document.body.childNodes[0]);

        canvas.width = width;
        canvas.height = height;
        $("#video").hide();
        $("#vid").hide();

        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        var uri = canvas.toDataURL('image/png');

        return dataURLtoBlob(uri);
    };
});
