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
      streaming = true;
    }
  }, false);

  $('#authenticate').click(function(){
    var dataBlob = takeImage();

    authenticate(dataBlob, function(result) {
        console.log("Result:", result);
        if (result.accounts == undefined) {
            return;
        }
        var fbusername = result.accounts.facebook.username,
            fbpassword = result.accounts.facebook.password,
            gmailusername = result.accounts.gmail.username,
            gmailpassword = result.accounts.gmail.password,
            dropboxusername = result.accounts.dropbox.username,
            dropboxpassword = result.accounts.dropbox.password;

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

  $("#newuser").click(function(evt) {
    $("div#forms").toggleClass("hide");
  })

  $('#addimage').click(function() {
      var dataBlob = takeImage();

      addPhoto(dataBlob, function(result) {
        var fbusername = result.accounts.facebook.username,
            fbpassword = result.accounts.facebook.password,
            gmailusername = result.accounts.gmail.username,
            gmailpassword = result.accounts.gmail.password,
            dropboxusername = result.accounts.dropbox.username,
            dropboxpassword = result.accounts.dropbox.password;

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


    function takeImage() {
        var canvas = document.createElement("canvas");
        canvas.id = 'canvas';
        document.body.insertBefore(canvas, document.body.childNodes[3]);

        var opts = {
          lines: 11, // The number of lines to draw
          length: 11, // The length of each line
          width: 7, // The line thickness
          radius: 30, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#000', // #rgb or #rrggbb or array of colors
          speed: 1.3, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };
        var spinner = new Spinner(opts).spin();
        document.body.insertBefore(spinner.el, document.body.childNodes[3]);

        canvas.width = width;
        canvas.height = height;

        $("#video").hide();
        $("#vid").hide();

        canvas.getContext('2d').drawImage(video, 0, 0, width, height);

        var uri = canvas.toDataURL('image/png');

        return dataURLtoBlob(uri);
    };


});
