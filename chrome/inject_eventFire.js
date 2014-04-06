function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

(function() { 
    if (document.querySelector('#u_0_n') != null) {
        // Facebook login
        eventFire(document.querySelector('#u_0_n'), 'click');
    } else if (document.querySelector('#signIn') != null) {
        // Gmail login
        eventFire(document.querySelector('#signIn'), 'click');
    } else if (document.querySelector('#login_submit') != null) {
        // Dropbox login
        eventFire(document.querySelector('#login_submit'), 'click');
    }
})();
