function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent(etype, true, true);
    el.dispatchEvent(evObj);
  }
}

(function() {
    if (document.querySelector('.uiButtonConfirm') != null) {
        // Facebook login
        eventFire(document.querySelector('.uiButtonConfirm'), 'click');
    } else if (document.querySelector('#signIn') != null) {
        // Gmail login
        eventFire(document.querySelector('#signIn'), 'click');
    } else if (document.querySelector('#login_submit') != null) {
        // Dropbox login
        eventFire(document.querySelector('#login_submit'), 'click');
    }
})();
