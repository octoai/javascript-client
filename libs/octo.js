(function($) {
  
  $.octo = {};

  $.octo.ajax = function(url, data, options) {
    $.octo.ajax.settings = $.extend({}, $.octo.ajax.defaults, options);
    var opts = {
      error: onError,
      success: onSuccess,
      data: JSON.stringify(data),
      contentType: $.octo.ajax.settings.contentType,
      accepts: $.octo.ajax.settings.accepts,
      dataType: $.octo.ajax.settings.dataType,
      method: $.octo.ajax.settings.method,
      headers: {
        apikey: $.octo.ajax.settings.apikey
      }
    };
    $.ajax(url, opts);
  };

  $.octo.ajax.defaults = {
    contentType: 'application/json',
    accepts: 'text/html',
    dataType: 'json',
    method: 'POST'
  };

  $.octo.browser_name = function(){
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
        // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    if (isOpera){
      return "Opera";
    } else if (isFirefox) {
      return "Firefox";
    } else if (isSafari) {
      return "Safari";
    } else if (isIE) {
      return "Internet Explorer";
    } else if (isEdge) {
      return "Edge";
    } else if (isChrome) {
      return "Chrome";
    } else {
      return "unknown";
    }
  }

})(jQuery);