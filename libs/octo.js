(function($) {

  $.octo = {};

  $.octo.apikey = 'OVERRIDE THIS WITH YOUR API KEY';

  $.octo.defaults = {
    base_url : 'https://api.octo.ai',
    cookie_name: '_oid'
  };

// Global variables for location
  $.octo.locality = {
    latitude: 0,
    longitude: 0
  };

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

 // the getLocationpermission event call
  $.octo.getLocationpermission = function(callback, options) {
    navigator.geolocation.getCurrentPosition(success, errorCallback);
  };
  
  // callback function of getLocationpermisson if user gives permission
  function success(position, options) {
      $.octo.locality.latitude = position.coords.latitude;
      $.octo.locality.longitude = position.coords.longitude;
      $.octo.pageView(arguments[1]);
    }

// callback function of getLocationpermisson if user denies permission
 function errorCallback(error, options) {
      switch (error.code) {
      case error.PERMISSION_DENIED:
        $.octo.pageView(arguments[1]);        
        break;
      case error.POSITION_UNAVAILABLE:
        $.octo.pageView(arguments[1]);
        break;
      case error.PERMISSION_DENIED_TIMEOUT:
        $.octo.pageView(arguments[1]);          
        break;
    }
}

  // the pageview event call
  $.octo.pageView = function(options) {
    console.log("1")
    if (options == undefined) {
      options = {};
    }
    var _tags = $.octo.unique($.merge($.octo.pageTags(), options.tags || []));
    var _cats = $.octo.unique($.merge($.octo.pageCategories(), options.categories || []));

    var pageViewOpts = {
      userId: options.userId || -1,
      browserDetails: $.octo.browserDetails(options.cookie_name),
      routeUrl: window.location.pathname,
      tags: _tags,
      categories: _cats
    };
    var pageUrl = $.octo.defaults.base_url.concat("/events/page.view/");
    $.octo.ajax(pageUrl, pageViewOpts);
  };

  // gets the latitude of the user 
  $.octo.getlatitude = function() {
    return $.octo.locality.latitude;
  }

  //gets the longitude of the user
   $.octo.getlongitude = function() {
    return $.octo.locality.longitude;
  }

  // gets the cookie id corresponding to a cookie name
  $.octo.getCookieId = function(cookie_name) {
    var _cname = cookie_name || $.octo.defaults.cookie_name;
    if($.cookie(_cname)) {
      return $.cookie(_cname);
    }
    else {
      var _oid = guid();
      $.cookie(_cname, _oid);
      return _oid;
    }
  };

  // get opengraph tags from the page
  $.octo.OGTags = function() {
    var tags = [];
    $.each($("meta[property='article:tag']"), function(i, tag) {
      tags.push(tag.content);
    });
    return tags;
  };

  //get opengraph section from the page
  $.octo.OGSection = function(){
    return $("meta[property='article:section']").attr('content');
  };

  // get standard HTTP META keywords
  $.octo.metaKeywords = function(){
    var kwds = $("meta[name=keywords]").attr('content');
    if (kwds == undefined){
      return [];
    } else {
      return kwds.split(',');
    }
  };

  // get combined tags
  $.octo.pageTags = function() {
    return $.merge($.octo.OGTags(), $.octo.metaKeywords());
  };

  // get page categories
  $.octo.pageCategories = function() {
    var cats = [];
    if( $.octo.OGSection())
      cats.push($.octo.OGSection());
    return cats;
  };

  // unique
  $.octo.unique = function(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  };


  $.octo.ajax = function(url, data, options) {
    $.octo.ajax.settings = $.extend({}, $.octo.ajax.defaults, options);
    var opts = {
      error: $.octo.ajax.settings.onError,
      success: $.octo.ajax.settings.onSuccess,
      data: JSON.stringify(data),
      contentType: $.octo.ajax.settings.contentType,
      accepts: $.octo.ajax.settings.accepts,
      dataType: $.octo.ajax.settings.dataType,
      method: $.octo.ajax.settings.method,
      headers: {
        apikey: $.octo.apikey
      }
    };
    $.ajax(url, opts);
  };

  $.octo.ajax.defaults = {
    contentType: 'application/json',
    accepts: 'text/html',
    dataType: 'json',
    method: 'POST',
    onError: $.octo.onAjaxError,
    onSuccess: $.octo.onAjaxSuccess
  };

  $.octo.onAjaxSuccess = function(data) {
  };

  $.octo.onAjaxError = function(data) {
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
  };

  $.octo.browserDetails = function(cookie_name){
    return {
      name: $.octo.browser_name(),
      platform: navigator.platform,
      manufacturer: navigator.vendor,
      cookieid: $.octo.getCookieId(cookie_name),
      latitude: $.octo.getlatitude(),
      longitude: $.octo.getlongitude()
    };
  };


  $.octo.init = function(options){
    $( document ).ready(function() {
      $.octo.getLocationpermission($.octo.pageView, options);
    });
  };
})(jQuery);
