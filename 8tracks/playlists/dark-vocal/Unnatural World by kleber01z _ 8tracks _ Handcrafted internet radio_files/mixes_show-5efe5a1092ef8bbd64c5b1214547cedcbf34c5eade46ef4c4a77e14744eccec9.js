define('lib/client_storage',[], function() {
  return TraxClientStorage;
});

define('global_trax',['lib/client_storage'], function(ClientStorage) {

  if (typeof App.Trax !== 'undefined'){
    return App.Trax;
  }

  var trax = App.Trax = {};

  trax.View = Backbone.View.extend({});

  var flash_timer;

  trax.hide_flash_timer = function(timeout) {
    timeout = timeout || 10000;
    flash_timer = setTimeout(function() {
      $('.flash_container').slideUp();
      }, timeout);
  };

  trax.hide_flash_error = function() {
    $('.flash_container').slideUp();
  };

  trax.hide_flash_notices = function() {
    if($('.flash_container ul.notices').size() > 0){
      // why do we only hide notices when there are no errors?
      if($('.flash_container ul.errors').size() === 0){
        trax.hide_flash_timer();
      }
    }
  };

  trax.show_flash_error = function(msg, autoHide) {
    trax.update_flash({ 'errors' : msg }, 60000);
    if (autoHide) {
      trax.hide_flash_timer();
    }
  };

  trax.show_flash_error_with_timeout = function(msg, timeout) {
    trax.update_flash({'errors': msg}, timeout);
  };

  trax.show_private_redirection_message = function() {
    trax.show_flash_error('Oops! It looks like the mix you are trying to listen to is not currently available. In the meantime, check out these playlists.');
  };

  trax.update_flash = function(json, timeout, container) {
    str = '';

    if (json.errors) {
      str += '<ul class="errors"><li>' + humanizeErrors(json.errors) + '</li></ul>';
    }

    if (json.notices) {
      str += '<ul class="notices"><li>' + humanizeErrors(json.notices) + '</li></ul>';
    }

    // if we have any message to display..
    if (str.length > 0) {
      clearTimeout(flash_timer);

      str = '<div class="flash_container" onclick="$(\'.flash_container\').slideUp(); return false;"><div class="container clearfix"><div class="row"><div class="col-md-12">' +
            '<a href="#" onclick="$(this).parents(\'.flash_container\').slideUp(); return false;" class="close" title="Hide warning"><span class="i-x"></span></a>' +
            str +
            '</div></div></div>';

      var flash_container;

      if ( _.isUndefined(container) ) {
        if ($('#facebox .content').is(':visible')) {
          container = $('#facebox .content');
        } else {
          container = $('#thin_header');
        }
      }

      flash_container = $('.flash_container', container);

      if (flash_container.length>0) {
        flash_container.replaceWith(str);
      } else {
        container.prepend(str);
      }

      trax.hide_flash_timer(timeout);
    }
  };

  trax.show_overlay = function(){
    $('#body_overlay').show().addClass('visible');
    return false;
  };

  trax.hide_overlay = function(){
    $('#body_overlay, #footer').removeClass('visible');
    _.delay(function(){
      $('#body_overlay').hide();
    }, 200);
    return false;
  };
  $('#body_overlay').click(trax.hide_overlay);

  trax.overlay_animation = function(animation_name) {
    return false;
  };

  trax.isSubscribed = function() {
    return trax.currentUser && trax.currentUser.get('subscribed');
  };

  trax.showAds = function() {
    //if (App.env == 'development') return true;
    //if (trax.regionallyBlocked()) return false;
    if (trax.isSubscribed()) return false;
    return true;
  };

  trax.windowIsPlaying = function() {
    if (!trax.windowId) {
      trax.windowId = Math.round(Math.random() * 1000000000);
    }

    if (trax.checkPlayingWindowTimer) {
      return;
    }

    ClientStorage.set('playingWindowId', trax.windowId);
    trax.checkPlayingWindowTimer = setInterval(trax.checkPlayingWindow, 500);
  };

  trax.checkPlayingWindow = function() {
    if (_.isNull(ClientStorage.get('playingWindowId'))) {
      ClientStorage.set('playingWindowId', trax.windowId);
    } else if (ClientStorage.get('playingWindowId') !== trax.windowId) {
      // another window is playing
      trax.clearCheckPlayingWindowTimer();
      trax.pausePlayback();
    }
  };

  // This will prevent playback from being interrupted when another tab is
  // playing. Right now, it should only be called when we switch to chromecast.
  trax.clearCheckPlayingWindowTimer = function() {
    if (trax.checkPlayingWindowTimer) {
      clearInterval(trax.checkPlayingWindowTimer);
      trax.checkPlayingWindowTimer = null;
    }
  };

  trax.pausePlayback = function() {
    if (!_.isUndefined(trax.mixPlayer)) {
      trax.mixPlayer.pause();
    }

    if (!_.isUndefined(trax.previewPlayer)) {
      trax.previewPlayer.pause();
    }
  };

  trax.isOwner = function(obj) {
    if (obj) {
      var user_id = obj.get('user') ? obj.get('user').id : obj.get('user_id');
      return !!(trax.currentUser && user_id && user_id == trax.currentUser.id);
    }
  };

  function humanizeErrors(errors){
    if (_.isObject(errors)) {
      return _.map(errors, function(arr, key){
        return _.map(arr, function(error){
          return (key.charAt(0).toUpperCase() + key.slice(1) + ' ' + error + '.');
        });
      });
    } else {
      return errors;
    }
  }

  trax.refreshSidebarAd = function(){
    if (App.views.adsView) {
      App.views.adsView.refreshSidebarAd(false);
    }
  };

  trax.sslHostUrl = function() {
    if (App.env == 'production') {
      return 'https://8tracks.com';
    } else {
      return 'http://' + window.location.host;
    }
  };

  trax.initial_focus = function(context) {
    $('.initial_focus', context).each(function() {
      this.focus();
      input_in_focus = this;
      $(this).parent().addClass('focus');
    });
  };

  trax.show_application_spinner = function() {
    $('#header-spinner span').show();
  };

  trax.pushCurrentState = function(url, replace) {
    if (App.router) App.router.navigate(url, { trigger: false, replace : replace});
    return;
    // try {
    //   if (typeof window.history.pushState == 'function') {
    //     window.history.pushState({PAGE : PAGE}, document.title, url);
    //   }
    // } catch(err) {
    //   // do nothing
    // }
  };

  trax.quick_play_click = function(event) {
    var link = $(event.currentTarget);
    var mixPromise    = $.Deferred();
    var playerPromise = $.Deferred();
    var smart_id;

    if (event.currentTarget.hash.length > 0) {
      smart_id = ParsedLocation.parseParamsStr(event.currentTarget.hash.substring(1))['smart_id'];
    } else {
      smart_id = null;
    }

    link.addClass('loading');
    link.jsonh_now(function(json){
      mixPromise.resolve(json.mix, smart_id);
    });

    if (App.Views.MixPlayerView) {
      playerPromise.resolve(link);
    } else { // if(App.Views.MixPlayerView && App.Models.Mix) {
      require(['pages/player'], function(){
        playerPromise.resolve(link);
      });
    }

    $.when(mixPromise, playerPromise).done(initPlayer);
  };

  trax.play_from_embed = function(mix, embed){
    if (App.views.mixPlayerView) {
      playMix(mix, null, embed);
    } else {
      require(['pages/player'], function(){
        playMix(mix, null, embed);
      });
    }
  };

  trax.play_page = function(event){
    if (App.views.mixView) {
      App.views.mixView.play();
    } else if (App.views.browseView) {
      App.views.browseView.play();
    } else if (App.views.userProfileView) {
      App.views.userProfileView.play();
    }

    $('#page_description').slideUp();
    //event.preventDefault();
    return false;
  };

  var initPlayer = function(mixPromise, playerPromise) {
    playerPromise.removeClass('loading');
    var json_mix = mixPromise[0];
    var smart_id = mixPromise[1];
    playMix(json_mix, smart_id);
  };

  var playMix = function(json_mix, smart_id, embed) {
    var mix = App.Collections.Mixes.load(json_mix);
    if (App.views.mixPlayerView) {
      App.views.mixPlayerView.loadMix(mix, smart_id);
    } else {
      App.views.mixPlayerView = new App.Views.MixPlayerView({ mix: mix, smart_id : smart_id  });
      App.views.mixPlayerView.show();
    }
    App.views.mixPlayerView.playMix('quick');
    if (embed) {
      embed.ui.startElement.show();
    }
  };

  trax.setGradient = function(canvas, palette, num_colors, img) {
    try{
    var num_colors = 2; //num_colors || 3;
    var oldCanvas = false;
    var rgb = false;

    if (canvas.style.opacity > 0){
      oldCanvas = canvas;
      canvas = $('<canvas class="background-blur" width="100%" height="100%" style="width: 100%; height: 100%; opacity: 0.6;"></canvas>')[0];
      $(oldCanvas).before(canvas);
    }

    // scrape palette from canvas data attributes
    if (!palette || palette.length == 0) {
      var paletteStr = $(canvas).data('palette');

      if (paletteStr && paletteStr.length > 0) {
        palette = paletteStr.split(',');

      }
    }


    var ctx = canvas.getContext('2d');
    var grd = ctx.createLinearGradient(0.000, 40, 100, 20);

    // Add colors
    if (!palette || palette.length == 0) return;

    _.each(palette, function(color, i) {
      if (!color || !color.match || !color.match(/#[a-f0-9]{6}/i)) {
        return;
      }
      if (i < num_colors) {
        var offset = (i / (num_colors-1));
        if (typeof(color) == 'string') { //hex
          grd.addColorStop(offset, color);
        } else {
          grd.addColorStop(offset, 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')');
        }
      }
    })

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 100);

    //fade in canvas
    //canvas.style.opacity = 0;
    canvas.style.opacity = 0.6;
    if (oldCanvas) {
      oldCanvas.style.opacity = 0.0;
      setTimeout(function(){
        oldCanvas.remove();
      }, 2500);
    }

    $(canvas).removeClass('unrendered');
    }catch(e){
      console.log('Trax.setGradient():', e.message);
    }
  }

  trax.spinner = function(options) {
    var spinner = new Spinner(_.extend({
      lines: 11,
      length: 3,
      width: 2,
      radius: 4,
      color: '#333',
      speed: 1.0,
      trail: 77,
      hwaccel: true,
      className: 'spin'
    }, options)).spin();
    return spinner.el;
  }

  trax.regionallyBlocked = function(country_code){
    if (!country_code) country_code = cookie.get('country_code3') || '';

    if (_.include(WHITELIST_COUNTRY_CODES, country_code.toLowerCase())) {
      return false;
    }
    if (App.sessions && App.sessions.isJuniorModerator()) {
      return false;
    }

    return true;
  }

  trax.resetRegionalBlocking = function(){
    cookie.remove('country_code3');
  }

  return trax;
});

define('models/modules/onready',[], function(){
  return {

    readyStates: {},

    onReady: function(name, callback) {
      if (this.readyStates[name]) {
        callback();
      } else {
        this.bind('onready:' + name, callback);
      }
    },

    isReady: function(name) {
      if (!this.readyStates[name]) {
        this.readyStates[name] = true;
        this.trigger('onready:' + name);
      }
    }
  };
});



define('collections/_base_collection',[], function(){
  if (typeof App.Collections.BaseCollection !== 'undefined'){
    return App.Collections.BaseCollection;
  }

  App.Collections.BaseCollection = Backbone.Collection.extend({
    load: function(attributes) {
      if (_.isArray(attributes)) {
        var m = [];
        _.each(attributes, function(a) {
          m.push(this.loadOne(a));
        }, this);

        return m;
      } else {
        return this.loadOne(attributes);
      }
    },

    loadOne: function(attributes) {
      return this.loadOneByAttributes(attributes);
    },

    loadOneByAttributes: function(attributes) {
      if (_.isUndefined(attributes)) {
        return false;
      }

      var model = this.get(attributes.id);

      if (!model) {
        this.add(attributes);
      } else {
        model.set(attributes);
      }

      return this.get(attributes.id);
    }
  });

  return App.Collections.BaseCollection;
});


// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    // REMI MODIFIED this form init() to initialize()
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.initialize )
        this.initialize.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

define("jquery.class", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.window.Class;
    };
}(this)));

define('lib/jsonh.jquery',['jquery.class', 'global_trax'], function(Class, TRAX){

  var JSONH = (function() {
    var jsonh = {};

    // UTILITIES
    var now_with_context = function(url, data, context, complete, extraOptions) {
      if (!_.isFunction(complete)) {
        extraOptions = complete;
        complete     = context;
        context      = data;
        data         = null;
      }

      extraOptions || (extraOptions = {});
      extraOptions.context = context;

      return now(url, data, complete, extraOptions);
    };

    var now = function(url, data, complete, extra_options) {
      if (_.isFunction(data)) {
        extra_options = complete;
        complete      = data;
        data          = null;
      }

      var options = {
        url      : url,
        data     : data,
        complete : complete
      };

      if (extra_options) {
        options = $.extend(options, extra_options);
      }

      return ajax(options);
    };


    // Locking functions.
    var locks = {};
    var lock = function(routine, retryRoutine, lockRequest) {
      if (lockRequest && locks[routine]) {
        return false;
      }

      return routine(routine, retryRoutine, function(){
        if (lockRequest) {
          delete locks[routine];
        }
      });
    };

    var build_options = function(element, complete, options) {
      var ajax_options = {complete: complete};
      options = options || {};

      if (element.nodeName.toUpperCase() == "FORM") {
        ajax_options.action='submit';
        ajax_options.form=element;
      } else if (element.nodeName.toUpperCase() == "A") {
        ajax_options.action='click';
        ajax_options.url=$(element).attr('href');
      } else {
        throw("You must pass a <form> or an <a> tag");
      }

      // Passing a spinner if we know which one we're using
      if (options.spinner == 'none') {
        ajax_options.spinner = null;
      } else if (options.spinner !== null) {
        ajax_options.spinner = options.spinner;
      } else if ($(element).find('.spin').length > 0) {
        ajax_options.spinner = $(element).find('.spin');
      }

      if (options.error){
        ajax_options.error = options.error;
      }

      // Passing extra data
      if (options.data !== null) {
        ajax_options.data = options.data;
      }

      if (options.context) {
        ajax_options.context = options.context;
      }

      ajax_options.ignore_flash = options.ignore_flash;
      ajax_options.type = options.type;
      ajax_options.with_lock = options.with_lock;
      ajax_options.element = element;

      return ajax_options;
    };

    // options:
    //   * form
    //   * url
    //   * action ('click' or 'submit')
    //   * spinner
    //   * showSave (show "saved" animation on complete)
    //   * complete
    //   * data
    //   * type
    //   * context
    var JSONHRequest = Class.extend({
      initialize: function(options) {
        _.bindAll(this, 'sendRequest', 'send', 'unlock', '_jsonhComplete');

        this.options = options;

        this.requestOptions = {};
        this.requestOptions.url  = options.url;
        this.requestOptions.form = options.form;
        this.requestOptions.data = options.data;
        this.requestOptions.type = options.type;

        if (options.headers) {
          this.requestOptions.headers = options.headers;
        } else {
          this.requestOptions.headers = {};
        }

        if (App.api_key) {
          this.requestOptions.headers['X-Api-Key'] = App.api_key;
        }

        // Bind the complete function to it's context if given
        if (options.context) {
          this.options.complete = $.proxy(options.complete, options.context);
          this.options.unauthorized = $.proxy(options.unauthorized, options.context);
        }

        if (options.spinner !== null) {
          this.spinner = $(options.spinner);
        } else {
          if ($('#facebox .content').is(':visible')) {
            this.spinner = $('#facebox-spinner');
          } else {
            this.spinner = $('#header-spinner');
          }
        }

        // spinner can be false
        this.spinnerSpan = this.spinner.children('.spin');

        if (_.isFunction(this.options.complete)) {
          this.originalCompleteFn = this.options.complete;
        } else {
          this.originalCompleteFn = function() {};
        }

        if (_.isFunction(this.options.error)) {
          this.errorFn = this.options.error;
        }

        this.requestOptions.complete = this._jsonhComplete;

        if (this.options.unauthorized) {
          this.requestOptions.unauthorized = this.options.unauthorized;
        }

        this.requestOptions.jsonhRequest = this;
      },

      send: function(){
        if (this.isLocked() && locks[this.sendRequest]) {
          return false;
        }

        return this.sendRequest();
      },

      sendRequest: function(){
        this.spinnerSpan.removeClass('saved').css({opacity : 1.0 });//.show();

        // The actual jsonh request.
        return json_request(this.requestOptions);
      },

      isLocked: function(){
        return this.options.with_lock;
      },

      unlock: function(){
        if(this.isLocked()){
          delete locks[this.sendRequest];
        }
      },

      _jsonhComplete: function(json) {
        this.unlock();
        if(this.options.showSave){
          this.spinner.addClass('saved');
          this.spinnerSpan.css({opacity : 0}); //hide();

          setTimeout(_.bind(function() {
            this.spinner.children('i').fadeOut(1000, function() {
              $(this).parent().removeClass('saved');
              $(this).css('display', '');
            });
          }, this), 1200);
        } else {
          this.spinnerSpan.css({opacity : 0}); //hide();
        }

        if (json.status != 500 && json.status != 503) { //json.status != 502 ??
          this.originalCompleteFn.apply(this.options.element || this, [json]);
        } else if (_.isFunction(this.options.error)) {
          this.errorFn.apply(this.options.element || this, [json]);
        } else {
          TRAX.update_flash(json);
        }
      }

    });


    var ajax = function(options) {
      var r = new JSONHRequest(options);
      return r.send();
    };

    var hash_to_associative_array = function(h) {
      var arr=[];
      $.each(h, function(k,v) {
        arr[arr.length] = { name: k, value: v };
      });
      return arr;
    };

    // options:
    //   * type: "GET" or "POST" (defaults to Form's method, or POST if data, or GET)
    //   * form
    //   * url
    //   * data
    //   * complete
    //   * routine: so that the whole thing can be rerun if user is unauthorized

    var json_request = function(options) {
      var url  = (options.form && options.form.action) || options.url;
      var data = options.data || { };
      var type;

      if (options.form) {
        // Merging form data into the data passed
        var form_data = $(options.form).serializeArray();
        // NOTE: this needs to be checked with nested objects
        data = $.merge(form_data, hash_to_associative_array(data));
        type = $(options.form).attr('method');
      } else {
        // passing a link
        type = 'GET';
      }

      // Simulate Rails-like "PUT" calls
      if (options.type == 'PUT' || options.type == 'put') {
        options.type = 'POST';
        data['_method'] = 'PUT';
      } else if (options.type == 'DELETE' || options.type == 'delete') {
        options.type = 'DELETE';
        data['_method'] = 'DELETE';
      }


      // injecting format=jsonh into data
      if ($.isArray(data)) {
        data[data.length]={ name:'format', value:'jsonh'};
      } else if (typeof data == 'string') {
        data = data + "&format=jsonh";
      } else {
        data['format']='jsonh';
      }

      // Preparing ajax options
      var ajaxOptions = {
        url      : url,
        data     : data,
        type     : options.type || type,
        dataType : options.dataType || 'json',
        headers  : options.headers || {},
      };


      ajaxOptions.complete = function(event, xhr) {
        var json = {};
        if (xhr == "abort") return;

        if (event.responseText === ' ') {
          json.status = '500';
        } else {
          try {
            json = $.parseJSON(event.responseText);
            window.LAST_JSON = json;
          } catch (error) {
            json.status = '500';
          }
        }

        if (_.isUndefined(json) || _.isNull(json)) {
          json = { 'status': '500' };
        }

        // Standardize success response to a boolean to facilitate callback
        if (json.status) {
          json.success = (parseInt(json.status, 0) >= 200 && parseInt(json.status, 0) < 300);
        } else {
          json.success = (event.status >= 200 && event.status < 300 || event.status === 304 || event.status === 1223);
        }

        // ex: '401 Unauthorized'  ->  401
        json.status = parseInt(json.status, 0);

        // return flash error if 500
        if (json.status === 500) {
          json.flash = {
            errors: 'Oops, there was a problem!<br/>We have been notified.'
          };
        }

        // show login form if 401
        // NOTE: 401 will return the login screen HTML
        if (json.status === 401) {
          if (typeof App.Sessions === 'undefined') {
            return;
          }

          App.Sessions.unsetCurrentUser();

          if (_.isFunction(options.unauthorized)) {
            options.unauthorized(json);

          } else {
            // Display signup box
            TRAX.showSignupView();
            if (App.views.appView) App.views.appView.loadingState(false);
          }

          var f = function() {
            options.jsonhRequest.send();
          };

          App.Sessions.unbind('jsonh:current_user:set_from_backend', f).bind('jsonh:current_user:set_from_backend', f);

          // Disable callback if user closes facebox
          $(document).bind('close.facebox', function() {
            App.Sessions.unbind('jsonh:current_user:set_from_backend', f);
          });
        } else {
          // Run callback
          if (_.isFunction(options.complete)) {
            options.complete(json);
          }

          if (json.status !== 401 && !(options.jsonhRequest && options.jsonhRequest.options && options.jsonhRequest.options.ignore_flash)) {
            TRAX.update_flash(json);
          }
        }
      };

      // The real action takes place here.
      return $.ajax(ajaxOptions);
    };

    // public functions
    jsonh.build_options    = build_options;
    jsonh.ajax             = ajax;
    jsonh.now              = now;
    jsonh.now_with_context = now_with_context;

    return jsonh;
  });

  $.fn.extend({

    jsonh_now: function(complete, options) {
      var jsonhApi = JSONH();
      return $(this).each(function() {
        var jsonh_options = jsonhApi.build_options(this, complete, options);
        jsonhApi.ajax(jsonh_options);
      });
    },

    // form locking
    // spinner
    // ajax with JSON
    jsonhify: function(complete, options) {
      var jsonhApi = JSONH();
      return $(this).each(function() {
        var jsonh_options = jsonhApi.build_options(this, complete, options);
        $(this)[jsonh_options.action](function() {
          jsonhApi.ajax(jsonh_options);
          return false;
        });
      });
    }

  });

  return JSONH();
});

define('lib/player/preview_player',['lib/client_storage', 'global_trax', 'lib/jsonh.jquery'], function(ClientStorage, TRAX, JSONH) {

  if (!_.isUndefined(TRAX.previewPlayer)) { return TRAX.previewPlayer; }

  var PreviewPlayer = Class.extend({
    initialize: function(soundManager) {
      _.bindAll(this, 'fadeOut', 'whilePlaying', 'seekTo');
      this.soundManager = soundManager;
      this.smSound = null;
      this.setVolume(ClientStorage.get('vol') || 80);
    },

    // playable must implement:
    //   - onPlayAction()
    //   - onPauseAction()
    togglePlay: function(playable) {
      if (playable.playingSample == false) {
        this.playingSample = false
      }
      else {
        this.playingSample = true
      }
      if (this.playable === playable) {
        if (this.smSound) {
          if (this.smSound.paused) {
            this.resume();
          } else {
            this.pause();
          }
        }
      } else {
        this.play(playable);
      }
    },

    pause: function() {
      if (this.playable) this.playable.onPauseAction();
      if (this.smSound) this.soundManager.pause(this.smSound.sID);
    },

    resume: function() {
      TRAX.pausePlayback();
      this.playable.onPlayAction();
      this.soundManager.resume(this.smSound.sID);

      if (this.smSound) {
        if (this.smSound.playState === 0) {
          this.soundManager.play(this.smSound.sID);
        } else {
          this.soundManager.resume(this.smSound.sID);
        }
      }

    },

    play: function(playable) {
      TRAX.pausePlayback();
      TRAX.windowIsPlaying();
      playable.onPlayAction();

      this.unloadPlayable();
      this.playable = playable;
      //!(TRAX.currentUser && TRAX.currentUser.get('admin'));

      if (this.playable.isExternal()) {
        var url = this.playable.getStreamUrl();
        if (url) {
          this.playingSample = false;
          this.playUrl(url);
        } else {
          return false;
        }
      } else {
        if (this.playable.get('play_full_track')) {
          if (this.playable.get('stream_url')) {
            this.playUrl(this.playable.get('stream_url'));
          } else {
            this.playFullTrackId(this.playable.id);
          }
        } else {
          this.playTrackId(this.playable.id);
        }
      }
    },

    playFullTrackId : function(trackId){
      return this.playTrackId(trackId, '/sets/play_full_track/');
    },

    playTrackId: function(trackId, path) {
      path = path || '/sets/play_track/';
      JSONH.now_with_context(path + trackId, this, function(json) {
        if (json.success) {
          //find a way to break this cycle
          //tracksCollection.get(json.track.id).set(json.track);

          // determine permission to play full-length
          if (TRAX.isOwner(this.playable)) {
            this.playingSample = false;
          }

          this.smPlay(json.track.id, json.track.track_file_stream_url);
        }
      }, { spinner: 'none' });
    },


    playUrl: function(url) {
      this.smPlay(Math.round(10000000*Math.random()), url);
    },


    smPlay: function(soundId, soundUrl) {
      soundId = 'p' + soundId;
      soundUrl = soundUrl;
      
      if (!soundUrl) {
        App.Trax.show_flash_error_with_timeout('"'+this.playable.get('name')+'" is unavavailable for preview right now.', 3000);
        return false;
      }

      this.soundManager.onready(_.bind(function() {
        this.soundManager.createSound({ id  : soundId,
                                   url : soundUrl,
                                   onplay   : _.bind(function() { this.playable.onSmPlay(); }, this),
                                   onresume : _.bind(function() { this.playable.onSmPlay(); }, this),
                                   whileplaying : this.whilePlaying,
                                   onfinish : _.bind(function(){
                                      var finishedPlayable = this.playable;
                                      this.unloadPlayable();
                                      finishedPlayable.onFinishAction();
                                    }, this)
                                 });
        this.smSound = this.soundManager.getSoundById(soundId);
        this.soundManager.setVolume(this.smSound.sID, ClientStorage.get('vol') || 80);
        this.soundManager.play(this.smSound.sID);

        if (this.playingSample) {
          this.smSound.onposition(27000, _.bind(this.fadeOut, this));
        }
      }, this));
    },

    //position = 0.0 to 1.0 as a fraction of duration
    seekTo : function(fraction) {
      var position = parseInt(fraction * this.smSound.durationEstimate, 10);
      try {
        if (this.smSound.duration < position) {
          // file not loaded enough yet
          position = this.smSound.duration - 1000;

        }
        // file loaded far enough to resume
        this.soundManager.setPosition(this.smSound.sID, position);
        this.soundManager.unmute(this.smSound.sID);
      } catch(e) {
        throw(e);
        //console.log('error in previewPlayer.seekTo()');
      }
    },


    unloadPlayable : function() {
      if (this.playable) {
        this.pause();
        this.playable = null;
      }

      // stop sm if it's playing already
      if (this.smSound) {
        this.soundManager.stop(this.smSound.sID);
        this.soundManager.unload(this.smSound.sID);
        this.smSound = null;
      }
    },

    // NOT DRY
    isPlaying: function() {
      return !!(this.smSound && !this.smSound.paused);
    },

    // NOT DRY
    // fades outs smSound volume to 0
    fadeOut: function(callback, sID) {
      if (this.isPlaying()) {
        if (_.isUndefined(sID)) {
          sID = this.smSound.sID;
        }

        this.fadingOut = true;

        var vol = parseInt(this.smSound.volume, 0);
        if (vol > 0) {
          this.soundManager.setVolume(sID, vol-1);
          if (this.smSound.sID == sID) {
            _.delay(this.fadeOut, 15, callback, sID);
          }
        } else {
          var finishedPlayable = this.playable;

          if (_.isFunction(callback)) {
            callback();
          } else {
            this.unloadPlayable();
          }

          finishedPlayable.onFinishAction();
        }
      }
    },

    setVolume: function(level) {
      if (level > 100) level = 100;
      if (level < 0  ) level = 0;

      // setting global volume
      this.soundManager.defaultOptions.volume = level;

      // setting track volume
      if (this.smSound) {
        this.soundManager.setVolume(this.smSound.sID, level);
      }

      // saving to cookie
      ClientStorage.set('vol', level);
    },

    whilePlaying : function(){
      this.playable.onWhilePlaying(this.smSound.position);
    }

  });

  return PreviewPlayer;
});


define('models/modules/playable',['lib/player/preview_player', 'global_trax'], function(PreviewPlayer, TRAX){
  var previewPlayer;

  var Playable = {
    play: function() {
      if (_.isUndefined(TRAX.previewPlayer)) {
        TRAX.previewPlayer = new PreviewPlayer(soundManager);
      }

      if (_.isUndefined(previewPlayer)) {
        previewPlayer = TRAX.previewPlayer;
      }
      //try {
        previewPlayer.togglePlay(this);
      // } catch(e) {
      //   console.log('track failed to play.');
      //   console.log(e);
      //   this.onFinishAction();
      // }
    },

    togglePlayPreview: function(playingSample) {
      this.playingSample = playingSample;
      this.play();
    },

    isPlaying : function() {
      return this.playableState == 'playing';
    },

    pause: function() {
      if (previewPlayer && previewPlayer.playable === this) {
        previewPlayer.pause();
      }
    },

    resume: function() {
      if (_.isUndefined(previewPlayer) || previewPlayer.playable !== this) {
        this.play();
      } else {
        previewPlayer.resume();
      }
    },

    //position = 0.0 to 1.0 as a fraction of duration
    seek : function(position){
      previewPlayer.seekTo(position);
    },

    isExternal: function() {
      throw 'Not implemented yet';
    },

    onPauseAction : function() {
      this.playableState = 'paused';
      this.trigger('onStateChange');
    },

    onPlayAction : function() {
      this.playableState = 'loading';
      this.trigger('onStateChange');
    },

    onSmPlay : function() {
      this.playableState = 'playing';
      this.trigger('onStateChange');
    },

    onFinishAction : function(){
      this.playableState = 'paused';
      this.trigger('onStateChange');
      this.trigger('onFinish');
    },

    onWhilePlaying : function(position){
      this.trigger('whilePlaying', position, previewPlayer.smSound.durationEstimate);
    }
  };

  return Playable;
});

define('lib/traxhead',[], function() {

  if (typeof App.Traxhead !== 'undefined') {
    return App.Traxhead;
  }

  // Initialize TRAXHEAD with code necessary during pageload
  var TRAXHEAD = App.Traxhead = {};

  TRAXHEAD.looksLoggedIn = function() {
    // could be auth_token or auth_token_development, etc...
    return !!document.cookie.match('auth_token');
  };

  TRAXHEAD.initFbAppId = function(options) {
    options = _.extend({music : false}, options);

    FB.init({appId: '166738216681933',
      status: true,
      channelUrl: '//8tracks.com/channel.html',
      cookie: true,
      xfbml: true,
      music: options['music'],
      oauth: true});

    // wait 500ms before making FB "loaded"
    setTimeout(function() { TRAXHEAD.FbLoaded = true; }, 500);
  };


  TRAXHEAD.onFbInit = function() {
    try {
      TRAXHEAD.initFbAppId();

      if (ParsedLocation.urlParams.load_fb_bridge) {
        TRAX.trackPageView.loadFbMusicBridge();
      }

      FB.Event.subscribe('edge.create', function(targetUrl) {
        if (App.Events) App.Events.gaSocial('facebook', 'like', targetUrl);
        //_gaq.push(['_trackSocial', 'facebook', 'like', targetUrl]);

      });

      FB.Event.subscribe('edge.remove', function(targetUrl) {
        if (App.Events) App.Events.gaSocial('facebook', 'unlike', targetUrl);
        // _gaq.push(['_trackSocial', 'facebook', 'unlike', targetUrl]);
      });

      FB.Event.subscribe('message.send', function(targetUrl) {
        if (App.Events) App.Events.gaSocial('facebook', 'send', targetUrl);
        // _gaq.push(['_trackSocial', 'facebook', 'send', targetUrl]);
      });

    } catch(e) {
    }
  };

  TRAXHEAD.onFbMusicInit = function() {
    try {
      TRAXHEAD.initFbAppId({music:true});
      App.views.fbPlayerIframeView.loadFbMusicBridge();
    } catch(e) {
    }
  };

  TRAXHEAD.zeroFill = function( number, width ) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number;
  };

  return TRAXHEAD;
});

define('lib/trax_utils', [], function(){
  var utils = {};

  utils.addCommas = function(nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
  };

  utils.coolNumber = function(count) {
      if (count < 500) {
        return count;
      } else if (count < 1000) {
        return count.toString().substr(0,1) + count.toString().substr(1,9);
      } else if (count <= 5000) {
        return count.toString().substr(0,1) + ',' + count.toString().substr(1,9);
      } else {
        return Math.floor(count/1000) + ',000+';
      }
  };

  utils.toUrlParam = function(param) {
    if (_.isString(param)) {
      return encodeURIComponent(param.replace(/_/g, '__').replace(/\s/g, '_').replace('+', '&&')).replace(/\//g, '%2F').replace(/\./g, '%5E');
    }
  };

  utils.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  utils.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  return utils;
});

define('lib/events', ['lib/client_storage', 'lib/traxhead', 'global_trax', 'lib/jsonh.jquery', 'lib/trax_utils'],
  function(ClientStorage, TRAXHEAD, TRAX, JSONH, Utils) {

    if (typeof App.Events !== 'undefined'){
      return App.Events;
    }

    var Events = App.Events = {

      pageView: function(currentPage, fullLocation, viewArgs) {
        Events.gaPageview(fullLocation);
        TraxEvents.pageView(currentPage, viewArgs);
      },

      postToStatsTimer : function(key, value) {
        Events.postToStats(key, value, 'timer');
      },

      postToStats : function(key, value, type) {
        type = type || 'counter';
        JSONH.now('/stats', { type : type, k : key, v : value}, null, { type : 'POST' });
      },

      postToLog: function(collection, json) {
        json['@collection'] = collection;
        JSONH.now('/log', json, null, { type: 'POST' });
      },

      startMix : function(mix, playType) {
        Events.gaTrack('Mix', 'Start', mix ? mix.id : null);

        if (playType) { //skipMix or NextMix
          // no playType means it's skipMix or NextMix
        }

        Events.setGACohort();
      },

      // set GA custom variable for Cohorts by FirstListenDate
      setGACohort: function() {
        if (ClientStorage.get('listened') === null) {
          ga('set', 'dimension1', Events.timestamp()); //First Listen Date
          ClientStorage.set('listened', 1);
        }
      },

      trackClick: function(eventName, eventProperties) {
        TraxEvents.trackClick(eventName, eventProperties);
      },

      likeMix: function(mix) {
        console.log('[EVENT] likeMix');
        Events.gaTrack('Mix', 'Like', mix ? mix.id : null);
      },

      commentOnMix: function(mix) {
        Events.gaTrack('Mix', 'Comment', mix ? mix.id : null);
      },

      playTrack : function(track, mix) {
        Events.gaTrack('Track', 'Play');
      },

      favTrack : function() {
        Events.gaTrack('Track', 'Fav');
      },

      buyTrack: function(domain){
        Events.gaTrack('Track', 'Buy', domain)
      },

      followUser: function() {
        Events.gaTrack('User', 'Follow');
      },

      selectInstagramPhoto: function() {
        Events.gaTrack('Instagram', 'SelectPhoto');
      },

      login: function(type) {
        Events.updateGaLoggedInState();
        Events.gaTrack('User', 'Login');
      },

      signup: function(type) {
        Events.updateGaLoggedInState();
        Events.gaPageview('/signup/success');
      },

      clickMixShare: function() {
        //RESTORE?
      },


      clickMixShareOption : function(options) {
        Events.gaSocial(options.network, options.action, options.url);
        //RESTORE using social events
      },

      shareMix: function(options) {
        Events.gaTrack('Mix Share', options.network);
      },

      clickUserShareOption: function(options) {
        Events.gaTrack('User Share', options.network);
      },

      addPreset : function() { },

      removePreset: function() { },

      clickFindFriends : function() { },

      enterMixEditMode : function() { },

      uploadTrack : function() {
        Events.gaTrack('Mix', 'TrackUpload');
      },

      trackUploadStarted : function() {
        Events.postToStats('js.track.upload.started');
      },

      trackUploadCancelled : function() {
        Events.postToStats('js.track.upload.cancelled');
      },

      trackUploadFinished : function() {
        Events.postToStats('js.track.upload.finished');
      },

      publishMix: function(mix) {
        Events.gaTrack('Mix', 'Publish', mix ? mix.id : null);
      },

      playNextMix: function(source) { },

      skipMix: function() { },

      TRACKS_REPORTED_COUNT_KEY : 'tracks_reported_count',

      reportTrack: function(track, mix) {
      },

      clickYoutube: function() {
      },

      clickExternalLink: function(external_url) {
      },

      sawPreroll: function(seconds_since_last_preroll){
        Events.postToStats('js.player.saw_preroll', 1);
        var properties = { event_type : 'ad' };
        if (seconds_since_last_preroll) properties['seconds_since_last_preroll'] = seconds_since_last_preroll;
        TraxEvents.track('view preroll', properties);
      },

      splashStep2Reported : false,
      splashStep2: function(tag) {
        if (!Events.splashStep2Reported) {
          Events.splashStep2Reported = true;
        }
      },

      splashStep3Reported : false,
      splashStep3: function(tags) {
        if (!Events.splashStep3Reported) {
          Events.splashStep3Reported = true;
        }
      },

      // Utilities

      sawSite : false,
      sawMix : false,

      init : function() {
        // first-time ish ever
        if (ClientStorage.get('saw_site') == '1') {
          Events.sawSite = true;
        } else {
          ClientStorage.set('saw_site', 1);
        }

        // mix page
        if (ClientStorage.get('saw_mix') == '1') {
          Events.sawMix = true;
        } else if (App.currentPage  == 'mix') {
          ClientStorage.set('saw_mix', 1);
        }

        // runs immediately in HTML body on 8tracks.com to enable AB testing
        if (!window.ga_initialized) {
          var defaults = 'auto';
          if (App.env == 'development') {
            defaults = { 'cookieDomain': 'none' };
          }

          ga('create', Events.GaProfileId(), defaults);
          ga('require', 'displayfeatures');
        }

        Events.updateGaLoggedInState();
        Events.updateGaPageVar();
        Events.setGaUrlParams();

        // Keep Alive every 10 minutes
        setInterval(Events.keepAlive, 600000);
      },

      // login & signup are reported separately, this also includes auto-login
      onUserChanged : function(onSignup) { },

      onUserUnset : function() { },

      onLogout : function() {
        TraxEvents.track('logout', { event_type: 'click', content_type: 'session' });
      },

      GaProfileId : function() {
        if (!_.isUndefined(App) && App.env == 'staging' || App.env == 'development') {
          return 'UA-2865123-14';
        } else {
          return 'UA-2865123-1';
        }
      },

      luckyOrangeActive : function() {
        if (ClientStorage.get('luckyOrange') === null) {
          // track 1%
          return ClientStorage.set('luckyOrange', (Math.random() < 0.01));
        } else {
          return ClientStorage.get('luckyOrange');
        }
      },

      gaSocial: function(network, action, url) {
        ga('send', 'social', network, action, url);
        console.log('[EVENT]', 'social', network, action, url);
      },

      gaTrack : function(category, action, opt_label, opt_value) {
        if (opt_label) opt_label = opt_label.toString();
        if (opt_value) opt_value = opt_value.toString();

        console.log('[EVENT] ' + category + ' ' + action + ' ' + (opt_label ? ('(' + opt_label + ': ' + opt_value + ')') : ''));

        ga('send', 'event', category, action, opt_label, opt_value);
      },

      gaPageview : function(url) {
        Events.updateGaPageVar();
        ga('send', 'pageview', url);
      },

      mpUrlsToTitles : {
        'forgot_password' : 'Forgot Password',
        'edit_password'   : 'Reset Password',
        'following'       : 'Following',
        'followers'       : 'Followers'
      },

      timestamp : function() {
        var currentTime = new Date();
        currentTime = new Date(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(),  currentTime.getUTCHours(), currentTime.getUTCMinutes(), currentTime.getUTCSeconds());

        return '' + currentTime.getFullYear() +
          TRAXHEAD.zeroFill((currentTime.getMonth()+1), 2) +
          TRAXHEAD.zeroFill(currentTime.getDate(), 2);
      },

      updateGaLoggedInState : function() {
        ga('set', 'dimension2', (TRAXHEAD.looksLoggedIn() ? 'In' : 'Out')); //Logged in/out
      },

      updateGaPageVar : function(){
        ga('set', 'dimension4', Events.gaPageVar()); //Page type
      },

      setGaUrlParams: function() {
        var params = window.ParsedLocation.urlParams;
        params.utm_campaign && ga('set', 'campaignName', params.utm_campaign);
        params.utm_source   && ga('set', 'campaignSource', params.utm_source);
        params.utm_medium   && ga('set', 'campaignMedium', params.utm_medium);
        params.utm_term     && ga('set', 'campaignKeyword', params.utm_term);
        params.utm_content  && ga('set', 'campaignContent', params.utm_content);
        ga('set', 'referrer', window.ParsedLocation.parsedReferrerUrl.source);
      },

      gaPageVar : function(){
        if (App.currentPage == 'browse') {
          if (App.views.browseView && App.views.browseView.artist_name) {
            return 'artist';
          } else if (App.views.browseView && App.views.browseView.tags.length > 0) {
            return 'tag';
          }
          return 'explore';
        }

        return App.currentPage;
      },

      keepAlive: function() {
        Events.gaTrack('Ignore', 'Keep-Alive');
      },

      blockedAd : function() {
        Events.gaTrack('Ad', 'Blocked');
      },

      onAdClick : function(){ },

      vwoTrack : function() {
      },

      clickAddToCollection: function() { },

      clickRemoveMixFromHistory: function() { },

      clickClearCollection: function() { },

      createCollection : function(){
        Events.gaTrack('Collection', 'Create');
      },

      addMixToCollection : function(mix){
        Events.gaTrack('Collection', 'AddMix', mix ? mix.id : null);
      }

    };


  Events.init();

  return Events;
});

define('models/track',['global_trax', 'models/modules/playable', 'lib/jsonh.jquery', 'lib/events'], function(TRAX, Playable, JSONH, Events){

  var Track = Backbone.Model.extend(Playable).extend({
    urlRoot: '/tracks',
    validationErrors: [],
    possibleValidationErrors: [ 'dupe', 'missing_metadata', 'repeat_artist', 'repeat_album', 'repeat_track', 'processing', 'saving' ],

    initialize: function() {
      if (TRAX.mix) {
        this.updateValidationErrors(TRAX.mix.validationErrorsForTrack(this.get('uid')));
      }

      _.bindAll(this, 'onUnselected', 'sendDestroyEvent', 'getYoutubeEmbed');
      this.bind('onUnselected', this.onUnselected);
    },

    sync: function(method, model, options) {
      JSONH.ajax({
        url: this.url(),
        data: this.toRails(),
        type: (method == 'create') ? 'POST' : 'PUT',
        complete: _.bind(function(json) {
          if (json.success) {
            options.success(model, json.track, options);
            if (json.mix) {
              TRAX.mix.set(json.mix);
            }
          } else {
            options.error(json.track);
          }
        }, this),
        spinner : '#track_update-spinner'});
    },

    mixAttrsToStore: function(){
      return { id: this.id };
    },

    isExternal: function() {
      if (this.get('stream_source') == 'ext_sc' || this.get('stream_source') == 'match_sc') {
        return true;
      }
      return false;
    },

    getStreamUrl: function(){
      return this.get('track_file_stream_url');
    },

    toRails: function() {
      var h = { track : {
        name         : this.get('name'),
        performer    : this.get('performer'),
        release_name : this.get('release_name'),
        year         : this.get('year'),
        buy_url      : this.get('buy_url')
      }};

      if (this.selected()) {
        h['mix_id'] = TRAX.mix.id;
      }

      return h;
    },

    selected: function() {
      return TRAX.mix ? TRAX.mix.hasTrackUid(this.get('uid')) : null;
    },

    onUnselected: function() {
      if (this.isPlaying()) {
        TRAX.previewPlayer.fadeOut();
      }
    },

    loadInfo: function() {
      var url = this.url();
      return $.ajax({
        url: url + '/info',
        data: { format: 'jsonh' }
      });
    },

    remove: function() {
      var url = this.url();

      var ajaxCall = $.ajax({
        type: 'delete',
        url: url
      });

      ajaxCall.success(this.sendDestroyEvent);
      return ajaxCall;
    },

    sendDestroyEvent: function() {
      this.trigger('destroy');
    },

    updateValidationErrors: function(errorCodes) {
      // console.log('updateValidationErrors', this.id, this.get('uid'), errorCodes);

      if (!_.isEqual(this.validationErrors, errorCodes)) {
        this.validationErrors = errorCodes;

        // MJC hack to include track level errors along with mix-level errors
        if (this.get('missing_metadata')) {
          this.validationErrors.push('missing_metadata');
        }

        if (_.include(this.validationErrors, 'processing') && TRAX.mix) {
          TRAX.mix.enableUpdatePolling();
        }

        this.trigger('onStateChange');
      }
    },

    openYoutubePopup: function() {
      Events.clickYoutube();

      TRAX.youtubePopup = window.open("about:blank", 'youtube', 'height=525,width=700');

      this.findOnYoutube(function(json){
        if (json && json.items && json.items.length) {
          var youtubeId = json.items[0].id.videoId;
          TRAX.youtubePopup.location.href = "http://www.youtube.com/embed/" + youtubeId + "?autoplay=1";

          TRAX.pausePlayback();
        } else {
          TRAX.youtubePopup.close();
          TRAX.show_flash_error("Sorry, we couldn't find a matching YouTube video for that track.");
        }
      });
    },

    getYoutubeEmbed: function(callback) {
      var callback = callback;

      if (this.attributes.you_tube_tracks.length > 0 ) {
        var youTubeId = false;
        for (i = 0; i < this.attributes.you_tube_tracks.length; i++) {
          if (WEB_SETTINGS.country_code &&
              this.attributes.you_tube_tracks[i].banned_countries &&
              this.attributes.you_tube_tracks[i].banned_countries.match(WEB_SETTINGS.country_code)) {
            //banned in this country! skip this one
          } else {
            youTubeId = this.attributes.you_tube_tracks[i].you_tube_id;
            break;
          }
        }
        if (youTubeId) {
          return callback.apply(window, [this.attributes.you_tube_id]);
        } else {
          return callback.apply(window);
        }
 
      }

      this.findOnYoutube(_.bind(function(json){
        if (json && json.items && json.items.length) {
          this.set('you_tube_id', json.items[0].id.videoId);
          callback.apply(window, [this.get('you_tube_id')]);
        } else {
          if (!json.error) {
            TRAX.show_flash_error("Sorry, we couldn't find a matching YouTube video for that track.");
            callback.apply();
          } else {
            if (json.error.errors[0].domain == 'usageLimits' || json.error.errors[0].domain == 'youtube.quota') {
              TRAX.show_flash_error("Hold on a second while we wait for Youtube...");
              _.delay(this.getYoutubeEmbed, 5000, callback);
            } else {
              callback.apply();
            }
          }
        }
      }, this));
    },

    findOnYoutube: function(options, successCallback) {
      if (_.isFunction(options)) {
        successCallback = options;
        options = { limit: 1 };
      }

      var apiKey = 'AIzaSyCQkZ4xk_6kpMOjsLOatcmIuY0oUFA9FoE';
      var limit = options.limit || 1;
      var performer = this.attributes['performer'];
      var title = this.attributes['name'];
      $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search?videoSyndicated=true&type=video&fields=items/id&part=id&key=' + apiKey + '&maxResults=' + limit,
        dataType: 'jsonp',
        data: { q : performer + ' ' + title },
        success: successCallback
      });
    },

    toggleFav: function(skipUpdate, mix) {
      skipUpdate = skipUpdate || false;

      !this.get('faved_by_current_user') && Events.favTrack();
      this.set({ 'faved_by_current_user' : !this.attributes['faved_by_current_user'] }, {silent : false});

      if (skipUpdate)
        return;

      var data = (!!mix) ? { 'from_mix_id': mix.id } : {};

      JSONH.now(
        '/tracks/' + this.id + '/toggle_fav',
        data,
        _.bind(function(json){
          if (this.attributes['faved_by_current_user'] != json.track.faved_by_current_user)
            this.toggleFav(true);
        }, this)
      );
    },

    is7digital : function(){
      return !!this.attributes['track_file_stream_url'].match('7digital');
    },

  });

  return Track;
});

define('models/external_track',['global_trax', 'models/track'], function(TRAX, Track){

  var ExternalTrack = Track.extend({
    initialize: function() {
      this.attributes = _.extend(this.attributes, this.mixAttrsToStore());
    },

    sync: function(){
      return false;
    },

    getStreamUrl: function() {
      throw 'Not implemented yet';
    },

    selected: function() {
      return TRAX.mix ? TRAX.mix.hasTrackUid(this.get('uid')) : null;
    },

    mixAttrsToStore: function() {
      throw 'Not implemented yet';
    },

    isExternal: function() {
      return true;
    }

  });

  return ExternalTrack;
});

define('models/soundcloud_track',['models/external_track'], function(ExternalTrack){
  var SoundcloudTrack = ExternalTrack.extend({
    getStreamUrl: function() {
      if (this.get('stream_url')) {
        if (this.get('stream_url').match(/\?client_id=/)) return this.get('stream_url');
        return this.get('stream_url') + (this.get('stream_url').match(/\?/) ? '&' : '?') + 'client_id=' + SOUNDCLOUD_CLIENT_ID;
      } else {
        alert('this track is not streamable');
        return null;
      }
    },

    mixAttrsToStore: function() {
      return({
        // for soundcloud_track backend
        id: this.get('id'),
        title: this.get("title"),
        permalink_url : this.get("permalink_url"),
        duration : this.get("duration"),
        playback_count : this.get("playback_count"),
        username: this.get("user") ? this.get("user").username : this.get("username"),
        stream_url: this.get('stream_url'),
        purchase_url: this.get('purchase_url'),
        release: this.get('release'),
        year: this.get('release_year'),
        // soundcloud_id: parseInt(this.get('id').split('-')[1], 10),

        // for track view
        name: this.get('title'),
        performer: this.get("user") ? this.get("user").username : '',

        // for external_track model
        url: this.get('stream_url'),

        // for track model
        release_name: this.get('release')
      });
    }
  });

  return SoundcloudTrack;
});

define('collections/soundcloud_tracks',['collections/_base_collection', 'models/soundcloud_track'], function(BaseCollection, SoundcloudTrack) {

  if (typeof SC_TRACKS !== 'undefined'){
    return SC_TRACKS;
  }


  var SoundcloudTracks = BaseCollection.extend({
    model: SoundcloudTrack,

    loadOne: function(attributes) {
      var id = attributes.id.toString();

      if (id.indexOf('sc') === -1) {
        attributes.id = 'sc-' + id;
        attributes.uid = 'sc-' + id;
      }
      return this.loadOneByAttributes(attributes);
    }
  });

  SC_TRACKS = new SoundcloudTracks();
  return SC_TRACKS;
});

define('models/fma_track',['models/external_track'], function(ExternalTrack) {
  var FMATrack = ExternalTrack.extend({
    getStreamUrl: function() {
      return this.get('track_url') + '/download';
    },

    mixAttrsToStore: function() {
      return({
        id: this.get('id'),
        title: this.get("track_title"),
        name: this.get('track_title'),
        performer: this.get("artist_name"),
        release_name: this.get('track_title'),
        year: null,
        url: this.getStreamUrl()
      });
    }
  });

  return FMATrack;
});

define('collections/fma_tracks',['collections/_base_collection', 'models/fma_track'], function(BaseCollection, FMATrack) {

  if (typeof FMA_TRACKS !== 'undefined'){
    return FMA_TRACKS;
  }


  var FMATracks = BaseCollection.extend({
    model: FMATrack,

    loadOne: function(attributes) {
      attributes.id = 'fma-' + attributes.track_id;
      return this.loadOneByAttributes(attributes);
    }
  });

  FMA_TRACKS = new FMATracks();
  return FMA_TRACKS;
});

define('collections/tracks',[ 'collections/_base_collection', 'models/track', 'collections/soundcloud_tracks', 'collections/fma_tracks'], function(BaseCollection, Track, soundcloudTracks, fmaTracks){

  if (typeof App.Collections.Tracks !== 'undefined'){
    return App.Collections.Tracks;
  }

  var Tracks = BaseCollection.extend({
    model: Track,

    getByUid : function(uid){
      if (_.isString(uid) && uid.match(/^sc-/)) {
        return soundcloudTracks.get(uid);
      }

      if (_.isString(uid) && uid.match(/^fma-/)) {
        return fmaTracks.get(uid);
      }

      var t = this.get(uid);

      // When getting a SC track that has an 8tracks ID, we attempt to return the matching SoundcloudTrack instance
      if (t && _.isString(t.get('uid')) && t.get('uid').match(/^(sc|ofm|fma)-/) && this.getByUid(t.get('uid')) ){
        return this.getByUid( t.get('uid') );
      }

      return t;
    },

    loadByUids : function(uids){
      m = [];
      _.each(uids, function(uid) {
        m.push(this.getByUid(uid));
      }, this);

      return m;
    }
  });

  App.Collections.Tracks = new Tracks();
  return App.Collections.Tracks;
});

define('collections/selected_tracks',['global_trax', 'collections/_base_collection', 'models/track', 'collections/tracks', 'lib/jsonh.jquery'], function(TRAX, BaseCollection, Track, tracksCollection, JSONH) {
  var SelectedTracks = BaseCollection.extend({
    model: Track,

    mixValidationUpdated : function(trackErrors) {
      console.log('mixValidationUpdated');

      this.forEach(function(t) {
        t.updateValidationErrors(trackErrors[t.get('uid')] || []);
      });
    },

    hasUid : function(uid){
      if (uid === undefined)
        return false;

      if (this.get(uid))
        return true;

      var uids = this.pluck('uid');

      return (_.indexOf(uids, uid) != -1);
    },


    update : function(track_or_file_ids) {
      var prev_track_ids = this.pluck("id");

      // extract track ids from the list
      var track_ids = _.filter(track_or_file_ids, function(id) { return !(id+'').match(/^f/); });

      var removed = _.difference(prev_track_ids, track_ids);
      var added   = _.difference(track_ids, prev_track_ids);

      _.each(removed, function(uid) {
        var track = tracksCollection.getByUid(uid);
        track.trigger('onUnselected');
      });

      _.each(added, function(uid, index) {
        tracksCollection.getByUid(uid).trigger('onSelected');
      });

      //TODO Update without using reset (increment but preserve order)
      this.reset(tracksCollection.loadByUids(track_ids));


      // notify new order for both tracks and track uploads (file)
      _.each(track_or_file_ids, _.bind(function(id, index) {
        // console.log('onChangeOrder:'+id, index + 1);
        this.trigger('onChangeOrder:'+id, index + 1);
      }, this));
    },


    // Store the current state of the mix.
    // - Sends all tracks back to the server for proper persistance.
    // - Suggest any description or tags if needed
    save: function() {
      // Change tracks: so that it "plucks" ids OR soundcloud attributes
      var data = {
        // Send all tracks for saving
        // tracks: _.pluck(this.models, 'id')
        tracks: _.map(this.models, function(track) {
          return track.mixAttrsToStore();
        })
      };

      if (TRAX.mix.suggestTags()) {
        data['suggest_tags'] = true;
      }

      if (this._updateTracksRequestId) {
        clearTimeout(this._updateTracksRequestId);
      }

      if (this._updateTracksRequest) {
        this._updateTracksRequest.abort();
      }

      this._updateTracksRequestId = setTimeout(_.bind(function(){
        this._updateTracksRequest = JSONH.now_with_context(
          '/mixes/' + TRAX.mix.id + '/update_tracks',
          data,
          this,
          function(json) {
            if (json.success && json.mix) TRAX.mix.set(json.mix);
          }, {
            type: 'POST',
            spinner: '#validation-spinner',
            showSave: true
          }
        );
      }, this), 700);
    },


    addTrack : function(newTrack, options) {
      console.log(newTrack, options);
      newTrack.trigger('onSelected');

      if (options && options.position) {
        // Does not trigger "add"
        var ids = this.pluck('id');
        // console.log('insert into',ids,newTrack.id,'at',options.position);
        var newIds = ids.slice(0, options.position-1).concat([newTrack.id]).concat(ids.slice(options.position-1));
        // console.log(newIds);
        this.update(newIds);
        this.trigger("add", newTrack, this, { position : options.position });

      } else {
        this.add(newTrack);
      }

      this.save();
    }

  });

  return SelectedTracks;
});

define('collections/tracks_played',['global_trax', 'collections/_base_collection', 'models/track', 'collections/tracks', 'lib/jsonh.jquery'], function(TRAX, BaseCollection, Track, tracksCollection, JSONH) {
  var TracksPlayed = BaseCollection.extend({
    model: Track
  });

  return TracksPlayed;
});


// Store to be used by Backbone.flexibleSync
define('models/modules/backbone_client_storage',['lib/client_storage'], 
       function(ClientStorage){
  var BackboneClientStorage = {

    getModel: function(model) {
      return ClientStorage.get(this._modelKey(model));
    },

    getModels: function(collection) {
      var collectionKey = this._collectionKey(collection);
      return _.map(ClientStorage.get(collectionKey), function(id) {
        return ClientStorage.get(collectionKey + '-' + id);
      });
    },

    setModel: function(model) {
      this._addToCollection(model);
      return ClientStorage.set(this._modelKey(model), model);
    },

    setModels: function(models) {
      _.each(models, function(m) {
        this.setModel(m);
      }, this);

      return models;
    },

    destroyModel: function(model) {
      this._removeFromCollection(model);
      return ClientStorage.destroy(this._modelKey(model));
    },

    // Util
    _modelKey: function(model) {
      return (model.storeKey || model.collection.storeKey) + '-' + model.id;
    },

    _collectionKey: function(collection) {
      return collection.storeKey;
    },

    _addToCollection : function(model) {
      if (model.collection) {
        var k = this._collectionKey(model.collection);
        var ids = ClientStorage.get(k);
        if (!ids) { ids = []; };
        ids.push(model.id);
        ClientStorage.set(k, ids);
      }
    },

    _removeFromCollection : function(model) {
      if (model.collection) {
        var k = this._collectionKey(model.collection);
        var ids = ClientStorage.get(k);
        if (!ids) { ids = []; };
        ids = _.reject(ids, function(id){return id == model.id.toString();});
        ClientStorage.set(k, ids);
      }
    }

  };

  return BackboneClientStorage;
});

define('models/modules/flexible_store',['models/modules/backbone_client_storage', 'lib/jsonh.jquery'], function(BackboneClientStorage, JSONH){

  Backbone.jsonhSync = function(method, modelOrCollection, options) {

    var toBackend = function(model) {
      var data = {};

      _.each(model.FIELDS_TO_BACKEND, function(f) {
        if (!_.isUndefined(model.get(f))) {
          // casts booleans into 1/0
          var v = model.get(f);
          if (v === true) { v = 1; }
          if (v === false) { v = 0; }

          data[f] = v;
        }
      });

      return data;
    };


    var model, collection, url, jsonhKey;

    if (_.isUndefined(modelOrCollection.id)) {
      collection = modelOrCollection;
      model      = null;
      url        = collection.urlRoot;
      jsonhKey   = collection.jsonhKey;
    } else {
      model      = modelOrCollection;
      collection = null;
      url        = model.url();
      jsonhKey   = model.jsonhKey || model.collection.jsonhKey;
    }

    if (_.isUndefined(options)) { options = {}; }

    var ajaxOptions = {
      url : url,
      type : Backbone.methodMap[method],
      complete : function(json) {
        if (json.success) {
          if (_.isFunction(options.success)) {
            options.success(modelOrCollection, json[jsonhKey], options);
          }
        } else {
          if (_.isFunction(options.error)) {
            options.error(modelOrCollection, json[jsonhKey], options);
          }
        }
      }
    };

    if (options.data) {
      ajaxOptions.data = options.data;
    }

    if (method === 'update') {
      ajaxOptions.data = ajaxOptions.data || {};
      ajaxOptions.data[jsonhKey] = toBackend(model);
    }

    return JSONH.ajax(ajaxOptions);
  };

  Backbone.flexibleSync = function(method, modelOrCollection, options) {
    if (_.isUndefined(options)) { options = {}; }
    var collection, model, jsonhOptions;

    if (_.isUndefined(modelOrCollection.id)) {
      collection = modelOrCollection;
      model = null;
    } else {
      model = modelOrCollection;
      collection = null;
    }

    if (method === 'read') {
      var foundLocally = false;
      var localValue;

      // try local storage first
      if (model) {
        // model
        localValue = BackboneClientStorage.getModel(model);
        if (localValue) {
          foundLocally = true;
          if (_.isFunction(options.success)) {
            options.success(model, localValue, options);
          }
        }
      } else if (collection) {
        // collection
        localValue = BackboneClientStorage.getModels(collection);
        if (localValue && localValue.length > 0) {
          foundLocally = true;
          if (_.isFunction(options.success)) {
            options.success(collection, localValue, options);
          }
        }
      }

      if (!foundLocally) {
        // not in local storage, get remotely
        jsonhOptions = _.clone(options);

        jsonhOptions.success = _.bind(function(json) {
          if (_.isFunction(options.success)) {
            // updates model's attributes
            options.success(this, json, options);
          }

          // 'this' is the model or collection here
          if (this.models) {
            BackboneClientStorage.setModels(this.models);
          } else {
            BackboneClientStorage.setModel(this);
          }
        }, model || collection);

        Backbone.jsonhSync(method, (model || collection), jsonhOptions);
      }

    } else if (method === 'create' || method === 'update') {
      BackboneClientStorage.setModel(model);
      Backbone.jsonhSync(method, model, jsonhOptions);

    } else if (method === 'delete') {
      BackboneClientStorage.destroyModel(model);
      Backbone.jsonhSync(method, model, jsonhOptions);
    }
  };

  var FlexibleStore = {
    localSave: function() {
      BackboneClientStorage.setModel(this);
    },

    localDestroy: function() {
      BackboneClientStorage.destroyModel(this);
    },

    sync: function(method, model, options) {
      return Backbone.flexibleSync(method, model, options);
    }

  };

  return FlexibleStore;
});

define('models/user',['global_trax', 'models/modules/flexible_store', 'lib/jsonh.jquery'], function(TRAX, FlexibleStore, JSONH){

  var User = Backbone.Model.extend(FlexibleStore).extend({
    urlRoot: '/users',

    // TRAXStore options
    storeKey: 'Users',
    jsonhKey: 'user',
    FIELDS_TO_BACKEND: [ 'login', 'bio', 'web_safe_browse', 'next_mix_prefs' ],

    // Contacts
    PARTNER_CONNECTED: 'connected',
    PARTNER_NOT_CONNECTED: 'not_connected',
    PARTNER_CONNECTED_BUT_EXPIRED: 'connected_but_expired',

    CONTACTS_UPDATING: 'updating',
    CONTACTS_ERROR: 'error',
    CONTACTS_UPDATED: 'updated',
    CONTACTS_UPDATED_BUT_EXPIRED: 'contacts_updated_but_expired',

    initialize: function(attrs) {
      // _.bindAll(this, 'setPresetsLocal');
    },

    isAdmin: function() {
      return this.get('admin');
    },

    isJuniorModerator: function() {
      return this.get('junior_moderator');
    },

    toggleFollow : function(options) {
      if(!options); options = {};

      if (!TRAX.currentUser) {
        return false;
      } else {
        TRAX.currentUser.trigger('follow');
      }

      JSONH.ajax({
        url : this.url() + '/toggle_follow',
        type : 'POST',
        data : {
          nonce : $('meta[name="8tnonce"]').attr('content')
        },
        complete :  _.bind(function(json){
          if (json.success && options.success) {

            options.success(json);
          }else if(options.error){
            options.error(json);
          }
        }, this)
      });
    },

    hasConnectedPartners : function() {
      return _.any(this.get('partners'), _.bind(function(p) {
        return p.status === this.PARTNER_CONNECTED || p.status === this.PARTNER_CONNECTED_BUT_EXPIRED;
      }, this));
    },

    hasConnected : function(partnerName) {
      return this.get('partners') &&
        this.get('partners')[partnerName] &&
        (this.get('partners')[partnerName]['status'] === this.PARTNER_CONNECTED ||
         this.get('partners')[partnerName]['status'] === this.PARTNER_CONNECTED_BUT_EXPIRED);
    },

    hasConnectedAndNotExpired : function(partnerName) {
      return this.get('partners') &&
        this.get('partners')[partnerName] &&
        this.get('partners')[partnerName]['status'] === this.PARTNER_CONNECTED;
    },

    updatingContactsFor : function(partnerName) {
      return (this.get('partners')[partnerName] &&
        this.get('partners')[partnerName]['contacts_status'] === this.CONTACTS_UPDATING);
    },

    updatingContacts : function() {
      return this.updatingContactsFor('facebook');
    },

    partnerContactsState : function(partnerName) {
      if (this.get('partners') && this.get('partners')[partnerName]) {
        var p = this.get('partners')[partnerName];
        var s = "";

        if (p.status === this.PARTNER_CONNECTED || p.status === this.PARTNER_CONNECTED_BUT_EXPIRED) {
          s = this.PARTNER_CONNECTED;
        } else {
          s = this.PARTNER_NOT_CONNECTED;
        }

        if (p.contacts_status) {
          s += ' ' + p.contacts_status;
        }

        return s;
      }
    },

    updateRecentMixes : function(recentMixes) {
      this.set('recent_mixes', recentMixes);
      this.set('has_recent_mixes', recentMixes.length > 0);
      this.localSave();
    },

    allPartnersConnected : function(){
      return this.hasConnected('facebook');
    },

    hasPresetSmartId : function(targetSmartId) {
      var inSmartIds = !!_.find(this.get('preset_smart_ids'), function(sid) {
        return sid.replace(/:safe$/, '') === targetSmartId.replace(/:safe$/, '');
      });

      if (inSmartIds) {
        return true;
      } else {
        // in order to cache some Expeditor caching problems for a bit...
        return !!_.find(this.get('presets'), function(tag_preset) { return (('tags:' + tag_preset) === targetSmartId); });
      }
    },


    hasYoutubeConnected: function() {
      return App.models.toc && App.models.toc.hasYoutubeRecommendations();
    },

    flag: function(userId) {
      return $.ajax('/user_flaggings.jsonh', {
        data: { flagged_user_id: userId },
        type: 'POST'
      });
    }
  });

  return User;
});

define('lib/sessions', ['global_trax', 'lib/traxhead', 'lib/client_storage', 'models/user', 'lib/events', 'lib/jsonh.jquery'],
  function(TRAX, TRAXHEAD, ClientStorage, User, Events, JSONH){

    if (typeof App.Sessions !== 'undefined'){
      return App.Sessions;
    }

    var sessions = App.Sessions = {};

    _.extend(sessions, Backbone.Events, {

      whenUserReadyOrChanged: function(callback, view) {
        if (TRAX.currentUser) {
          _.defer(callback, TRAX.currentUser);
        }

        if (view)
          view.listenTo(sessions, 'sessions:user_changed', callback);
      },

      _onUserChanged: function() {
        this.trigger('sessions:user_changed', TRAX.currentUser);
      },

      onPageLoad : function() {
        if (TRAXHEAD.looksLoggedIn()) {
          this.tryToSetCurrentUserFromPage() ||
          this.tryToSetCurrentUserFromStorage() ||
          this.tryToSetCurrentUserFromBackend();
        } else {
          //always get country code for first-time visitors
          this.getCountryCode();
        }
        this.logoutUserIfAuthenticationFailed();

        // reload user every 8 minutes
        setInterval(_.bind(this.tryToSetCurrentUserFromBackend, this), 8 * 60 * 1000);
      },

      // in case token expires for instance
      logoutUserIfAuthenticationFailed : function() {
        if (PAGE.failed_authentication && PAGE.failed_authentication.length > 0) {
          this.unsetCurrentUser();
        }
      },

      // used on user updating her own profile
      tryToSetCurrentUserFromPage : function() {
        if (PAGE.currentUser) {
          return this.setCurrentUserByAttributes(PAGE.currentUser);
        }
      },

      tryToSetCurrentUserFromStorage : function() {
        var id = ClientStorage.get('currentUserId');
        if (id) {
          if (ClientStorage.get('Users-'+id)) {
            TRAX.currentUser = new User(ClientStorage.get('Users-'+id));
          } else {
            TRAX.currentUser = new User({ id: ClientStorage.get('currentUserId') });
          }
          TRAX.currentUser.fetch({ success: _.bind(function() {
            this._onCurrentUserSet(true);
          }, this) });

          return true;
        }
        return false;
      },

      reloadIfOutdated: function() {
        // update from backend least every 8 minutes
        if (!TRAX.currentUser.get('last_logged_in') || (Date.now() - Date.parse(TRAX.currentUser.get('last_logged_in')) > (8 * 60 * 1000))) {
          this.tryToSetCurrentUserFromBackend();
          this.updateNotifications();
        }
      },

      updateNotifications : function(){
        JSONH.now('/users/'+TRAX.currentUser.id+'/notifications_count',
          _.bind(function(json) {
            if (json.success) {
              TRAX.currentUser.set('last_logged_in', new Date());
              TRAX.currentUser.set(json.user);
              TRAX.currentUser.localSave();
              this._onCurrentUserSet(true);
            }
          }, this)
        );
      },

      tryToSetCurrentUserFromBackend : function(callback) {
        JSONH.now('/users/current',
          {include: 'recent_mixes,web_preferences,tracking_settings'},
          _.bind(function(json) {
            if (json.success) {
              json.user.last_logged_in = new Date();
              this.setCurrentUserByAttributes(json);
              if (typeof(callback) == 'function') {
                callback.call();
              }
            } else {
              this.getCountryCode();
            }
          }, this),
        { unauthorized: function() { } });
      },

      getCountryCode : function(){
        //TODO get from backend
        var country_code = cookie.get('country_code3');
        if (country_code && country_code.length > 0 && typeof(WEB_SETTINGS) == 'Object' && country_code == WEB_SETTINGS['country_code']) {
          this.onCountryCodeSet(country_code);
        } else {
          $.ajax({
            url : '/users/current_country_code.jsonh',
            success : _.bind(function(json){
              var expires = new Date();
              expires.setTime(expires.getTime()+(60*60*1000)); //expire date in 1 hour
              cookie.set('country_code3', json.web_settings.country_code, { expires : expires.toGMTString() });
              WEB_SETTINGS = json.web_settings;
              this.onCountryCodeSet(json.web_settings.country_code);
            }, this)
          });
        }
      },

      onCountryCodeSet : function(country_code){
        if (!country_code) return;

        if (!TRAX.regionallyBlocked(country_code) || TRAX.currentUser && TRAX.currentUser.isJuniorModerator()) {
          //streaming is available!
          return;

        } else {
          $('body').addClass('international');
          this.showInternationalMessage();
        }
      },

      showInternationalMessage : function(){
        if (_.include(['mix', 'home', 'home_first_time', 'browse'], App.currentPage) && $('.international_message').length === 0 && !cookie.get('intl_ack')) {

          $('#youtube_player').before('<div class="international_message"><div class="container clearfix"><div class="row"><div class="col-md-12"><div class="message">'+
              '<span class="i-warning"></span> Unfortunately, some music can’t be played on 8tracks in your area right now. '+
              '<a href="http://blog.8tracks.com/2016/02/12/a-change-in-our-international-streaming/" target="_blank">Learn more &rarr;</a>'+
              '<a href="#" style="float: right;" onclick="$(\'.international_message\').hide(); window.cookie.set(\'intl_ack\', \'1\'); return false;"><span class="i-x"></span></a>'+
            '</div></div></div></div></div>');
        }
      },


      // called on login, signup, or auto-login for cached pages
      setCurrentUserByAttributes : function(json, options) {
        var user_json;
        if (json.user) {
          user_json = json.user;
        } else if (json.current_user) {
          user_json = json.current_user;
        } else {
          user_json = json;
        }

        if (!user_json) { return false; }

        var changed = true;
        if (TRAX.currentUser) {
          if (TRAX.currentUser.get('id') == user_json.id) {
            changed = false;
          }
          TRAX.currentUser.set(user_json);
        } else {
          TRAX.currentUser = new User(user_json);
        }

        if (options && options.backendLogin) {
          // set cookies
          cookie.set('L', TRAX.currentUser.id);
          cookie.set(this.authTokenCookieName(), TRAX.currentUser.get('user_token'));

          this.trigger("jsonh:current_user:set_from_backend", TRAX.currentUser);
        }

        this._onCurrentUserSet(changed, (options && options.onSignup));
        return true;
      },

      loggedIn : function() {
        return !!TRAX.currentUser;
      },

      currentUserId : function() {
        if (this.loggedIn()) {
          return TRAX.currentUser.id;
        }
      },

      loggedOut : function() {
        return !TRAX.currentUser;
      },

      logged_in : function() {
        return !!(TRAX.currentUser);
      },

      authTokenCookieName : function() {
        var cookieName = 'auth_token';

        try {
          if (App.env !== 'production') {
            cookieName += '_' + App.env;
          }
        } catch(e) {
        }

        return cookieName;
      },

      onFacebookConnectFailure : function(response) {
        // Events.mpTrack('Facebook Connect Failure', { 'Failure Reason' : response.error_type, 'Error Message' : response.error_message });

        // response has key: errors
        TRAX.update_flash({ errors: response.user_error_message });
      },

      // does NOT call backend so user could still be logged in through session
      unsetCurrentUser : function() {
        cookie.remove('L');
        cookie.remove(this.authTokenCookieName());
        cookie.remove('visitor_id');

        if (TRAX.currentUser) {
          TRAX.currentUser.localDestroy();
          TRAX.currentUser = null;
          this.redirectUser(false);
        }

        ClientStorage.clearAll();
        this.updatePermissionsDisplay();

        this.trigger('current_user:unset', TRAX.currentUser);
        Events.onUserUnset();
      },

      redirectUser :function(loggedIn) {
        var currentPage = App.currentPage;
        var onPublicPage = !!currentPage.match(/mix|user|browse/);

        var location = window.location.toString();
        var editPage = location.match(/\/edit$/);

        if (onPublicPage && !editPage)
          return;

        if (!loggedIn) {
          this.unsetCurrentUser();
        }

        App.views.appView.closeView();
        if (loggedIn) {
          App.views.appView.loadDashboardView('/');
        } else {
          App.views.appView.loadHomeLoggedOutView('/');
        }

      },

      // onBackendLogin happens after the use signs in via a remote AJAX request.
      //
      // 1. If the user had intended on going to a page that required login,
      //    onBackendLogin will redirect there.
      //
      // 2. If the user is staying on the same page, then assign TRAX.currentUser
      //    Finally, trigger
      //    the 'login:complete' event on sessions. Any code that requires
      //    sign in should bind to 'login:complete'.
      //
      onBackendLogin : function(json, skip_redirect) {
        var already_logged_in = sessions.loggedIn();

        this.setCurrentUserByAttributes(json, { backendLogin: true, onSignup: json.user_created });

        if (json.user_created) {
          Events.signup(json.type);
        } else {
          Events.login(json.type);
        }

        // redirect the user except if on mix page or user page
        if (!already_logged_in && !skip_redirect) {
          this.redirectUser(true);
        }

        $(document).trigger('onBackendLogin', [json, skip_redirect]);
        //bind to this trigger w/ the signature onBackendLogin(event, json, skip_redirect)
      },


      _onCurrentUserSet : function(changed, onSignup) {
        // Persist user client-side
        TRAX.currentUser.localSave();
        ClientStorage.set('currentUserId', TRAX.currentUser.id);

        // redirect user if necessary
        if (PAGE.attempted_path && PAGE.attempted_path !== '') {
          if (window.location.pathname != PAGE.attempted_path) {
            window.location.href = PAGE.attempted_path;
          }
        } else if ((App.currentPage === 'login' || App.currentPage === 'signup') && PAGE.attempted_path) {
          window.location.href = PAGE.attempted_path;
        }

        // Update display
        this.updatePermissionsDisplay();

        this.getCountryCode(); //force refresh of country code for 8t office test
        //this.onCountryCodeSet(TRAX.currentUser.get('country_code'));

        if (changed) {
          this._onUserChanged();
          Events.onUserChanged(onSignup);
        }

        this.reloadIfOutdated();

        this.hideAds();

        this.showTags();
      },

      updatePermissionsDisplay : function() {
        if (this.loggedIn()) {
          $('.p_logged_out').removeClass('on').addClass('off');
          $('.p_logged_in').removeClass('off').addClass('on');

          if (sessions.isAdmin()) {
            // show everything
            $('.p_at_least_owner, .p_admin').removeClass('off').addClass('on');

            // but hide "not admin" stuff
            $('.p_not_admin').removeClass('on').addClass('off');

          } else {
            // owner & recipient permissions
            $('.p_owner, .p_recipient').removeClass('on').addClass('off');
            $('[data-owner_id='+ TRAX.currentUser.id +'].p_owner').removeClass('off').addClass('on');
            $('[data-owner_id='+ TRAX.currentUser.id +'].p_at_least_owner').removeClass('off').addClass('on');
            $('[data-recipient_id='+ TRAX.currentUser.id +'].p_recipient').removeClass('off').addClass('on');
          }

          // not owner
          $('.p_not_owner').removeClass('on').addClass('off');
          $('[data-owner_id!='+ TRAX.currentUser.id +'].p_not_owner').removeClass('off').addClass('on');

          // not admin
          if (!sessions.isAdmin()) {
            $('.p_not_admin').removeClass('off').addClass('on');
          }

          // update like, fav, follow status
          this.update_toggle_statuses();
        } else {
          $('.p_logged_in').removeClass('on').addClass('off');
          $('.p_logged_out').removeClass('off').addClass('on');
        }
      },


      update_toggle_statuses : function() {
        var params={favs:[], likes:[], follows:[]};
        var some_data = false;

        $('form.like, a.like').each(function() {
          some_data = true;
          params['likes'][params['likes'].length] = $(this).attr('data-mix_id');
        });

        $('form.follow:not(.skip), a.follow:not(.skip)').each(function() {
          some_data = true;
          params['follows'][params['follows'].length] = $(this).attr('data-user_id');
        });

        // home logged in has the Favorite Tracks widget, no need to get Fav state again
        if (App.currentPage != 'home_logged_in') {
          $('form.fav, a.fav').each(function() {
            some_data = true;
            params['favs'][params['favs'].length] = $(this).attr('data-track_id');
          });
        }

        // Only execute Ajax call if there's some data to look up.
        if (some_data === false) {
          return;
        }

        JSONH.now('/users/' + TRAX.currentUser.id + '/values_for', params, function(json) {
          if (json.likes) {
            $.each(json.likes, function(mix_id, v) {
              //TODO remove when cache is clear
              var form=$('form.like[data-mix_id='+ mix_id +']');
              if (v) {
                $(form).addClass('active').removeClass('inactive');
                $(form).find('input[type|="submit"]').val('Unlike');
              } else {
                $(form).addClass('inactive').removeClass('active');
                $(form).find('input[type|="submit"]').val('Like');
              }
              //END
              var $link=$('a.like[data-mix_id='+ mix_id +']');
              if (v) {
                $link.addClass('active').removeClass('inactive'); //;.html('<span class="in">Unlike</span><span class="out">Liked</span>');
              } else {
                $link.addClass('inactive').removeClass('active'); //;.html('Like');
              }
            });
          }

          if (json.follows) {
            $.each(json.follows, function(user_id, v) {
              //TODO remove when cache is clear
              var form=$('form.follow[data-user_id='+ user_id +']');
              if (v) {
                $(form).addClass('active skip').removeClass('inactive');
                $(form).find('input[type|="submit"]').val('Unfollow');
              } else {
                $(form).addClass('inactive skip').removeClass('active');
                $(form).find('input[type|="submit"]').val('Follow');
              }
              //END

              var $link=$('a.follow[data-user_id='+ user_id +']');
              if (v) {
                $link.addClass('active skip').removeClass('inactive').html('<span class="in">Unfollow</span><span class="out">Following</span>');
              } else {
                if ($link.hasClass('active')) {
                  $link.addClass('inactive skip').removeClass('active').html('Follow');
                }
              }
            });
          }

          if (json.favs) {
            $.each(json.favs, function(track_id, v) {
              //TODO remove when cache is clear
              var form=$('form.fav[data-track_id='+ track_id +']');
              if (v) {
                $(form).addClass('active').removeClass('inactive');
              } else {
                $(form).addClass('inactive').removeClass('active');
              }
              //END

              var $link=$('a.fav[data-track_id='+ track_id +']');
              if (v) {
                $link.addClass('active').removeClass('inactive');
              } else {
                $link.addClass('inactive').removeClass('active');
              }
              //END
            });
          }
        }, { spinner:false });
      },

      hideAds : function(){
        if (!TRAX.showAds() && App.views.adsView) {
          App.views.adsView.close();
          delete App.views.adsView;
        }
      },

      showTags : function(){
        if (ClientStorage.get('always_show_tags') == 'yes') {
          $('body').addClass('always_show_tags');
        }
      },

      isAdmin : function() {
        return TRAX.currentUser && TRAX.currentUser.isAdmin();
      },

      isJuniorModerator : function() {
        return TRAX.currentUser && TRAX.currentUser.isJuniorModerator();
      },

      isOwner : function(obj) {
        if (obj) {
          var user_id = obj.get('user') ? obj.get('user').id : obj.get('user_id');
          return !!(TRAX.currentUser && user_id && user_id == TRAX.currentUser.id);
        }
      },

      isAtLeastOwner : function(obj) {
        return !!(this.isOwner(obj) || this.isAdmin());
      }

    });

    return sessions;
});

define('models/image',['global_trax', 'lib/sessions'], function(TRAX, sessions) {
  var TraxImage = Backbone.Model.extend({

    urlRoot: '/images',
    jsonhKey: 'image',
    FIELDS_TO_BACKEND: [ 'crop_x1', 'crop_y1', 'crop_width', 'crop_height' ],

    sync: Backbone.jsonhSync,

    initialize: function(options) {
      this.on('change', this.onChange);

      // TODO
      this.mix = options.mix;
    },

    onChange : function() {
      if (this.hasChanged('crop_x1') || this.hasChanged('crop_y1') ||
          this.hasChanged('crop_width') || this.hasChanged('crop_height')) {
        this.trigger('change:crop_values');
      }

      if (this.mix && (this.hasChanged('original_imgix_url') || this.hasChanged('cropped_imgix_url'))) {
        this.mix.trigger('image:change');
      }
    },

    mixpageUrl : function() {
      // if (this.get('original_imgix_url').match('.gif') && sessions.isAdmin()) {
      //   // original for admins gif
      //   return this.get('original_imgix_url');
      // } else {
        return this.croppedImgixUrlFor(521);
      // }
    },

    onDataUrlLoad : function(dataUrl) {
      var tmpImg = new Image();

      tmpImg.onload = _.bind(function() {
        if (tmpImg.width < 400 || tmpImg.height < 400) {
          TRAX.show_flash_error('Covers must be at least 400px by 400px.');
        } else {
          this.set({
            original_url : dataUrl,
            original_width: tmpImg.width,
            original_height: tmpImg.height,
            crop_x1: null,
            crop_y1: null,
            crop_height: null,
            crop_width: null
          });
        }
      }, this);

      tmpImg.src = dataUrl;
    },

    // CSS settings for an <img> tag wrapped around a square of size wide
    getCssFor: function(targetSize) {
      var scale, left, top, width, height;

      if (this.get('crop_width')) {
        // user-defined crop coords
        var widthScale  = targetSize / this.get('crop_width');
        var heightScale = targetSize / this.get('crop_height');

        return {
          width:       widthScale  * this.get('original_width'),
          height:      heightScale * this.get('original_height'),
          marginLeft: -widthScale  * this.get('crop_x1'),
          marginTop:  -heightScale * this.get('crop_y1')
        };

      } else {
        // default center crop

        if (this.get('original_height') < this.get('original_width')) {
          scale = targetSize / this.get('original_height');
          left = (this.get('original_width') - this.get('original_height')) / 2;
          top = 0;
        } else {
          scale = targetSize / this.get('original_width');
          left = 0;
          top = (this.get('original_height') - this.get('original_width')) / 2;
        }

        return {
          width:       scale * this.get('original_width'),
          height:      scale * this.get('original_height'),
          marginLeft: -scale * left,
          marginTop:  -scale * top
        };
      }

    },

    setDefaultCropAttributes : function(){
      if (this.get('original_height') < this.get('original_width')) {
        this.set('crop_x1', (this.get('original_width') - this.get('original_height')) / 2);
        this.set('crop_y1', 0);
        this.set('crop_width', this.get('original_height'));
      } else {
        this.set('crop_x1', 0);
        this.set('crop_y1', (this.get('original_height') - this.get('original_width')) / 2);
        this.set('crop_width', this.get('original_width'));
      }

      this.set('crop_height', this.get('crop_width'));
    },

    croppedImgixUrlFor: function(targetSize) {
      var url;

      if (this.get('cropped_imgix_url')) {
        url = this.get('cropped_imgix_url');
      } else {
        url = this.get('original_imgix_url');
      }

      return url + '&w=' + targetSize + '&h=' + targetSize;
    },

  });

  return TraxImage;
});

define('models/mix',['global_trax', 'models/modules/onready', 'collections/selected_tracks', 'collections/tracks', 'collections/tracks_played',
        'models/image', 'lib/jsonh.jquery', 'lib/events'],
       function(TRAX, OnReady, SelectedTracks, tracksCollection, TracksPlayed, Image, JSONH, Events){

  var Mix = Backbone.Model.extend(OnReady).extend({
    urlRoot: '/mixes',
    fieldsTouched: {},

    initialize: function(attrs) {
      _.bindAll(this, 'onValidationStatusChange', 'onTracksAttrChanged', 'onPublish');

      this.onTracksAttrChanged();
      this.onValidationStatusChange();

      this.bind('change:validation_status', this.onValidationStatusChange);
      this.bind('change:tracks', this.onTracksAttrChanged);

      this.initTracksPlayed();
    },

    initTracksPlayed : function(){
      if (this.tracksPlayed) {
        this.tracksPlayed.reset();
      } else {
        this.tracksPlayed = new TracksPlayed();
      }
    },

    //// VALIDATION ///////////////////////////////////

    onValidationStatusChange: function() {
      // cancel polling
      this.disableUpdatePolling();

      // pass validation to tracks
      if (this.tracks) {
        this.tracks.mixValidationUpdated(this.validationErrorsForTracks());
      }
    },

    enableUpdatePolling: function() {
    },

    disableUpdatePolling: function() {
      clearInterval(this.pollingTimer);
    },

    globalValidationErrors: function() {
      var categories = ['playlist', 'cover', 'name', 'tags', 'description'];
      var e = [ ];

      if (this.get('validation_status') && this.get('validation_status')['errors']) {
        _.each(this.get('validation_status')['errors'], function(errors, cat) {
          if (_.include(categories, cat)) {
            if(cat === "tags") {
              errors = '<a href="#mix_tags" class="js-scroll">' + errors + '</a>';
            }

            if(cat === "description") {
              errors = '<a href="#mix_description" class="js-scroll">' + errors + '</a>';
            }
            e = e.concat(errors);
          }
        });
      }

      return e;
    },

    onTracksAttrChanged : function() {
      if (this.get('tracks')) {
        if (this.tracks) {
          // update
          this.isReady('tracks');
        } else {
          // create
          this.tracks = new SelectedTracks(tracksCollection.load(this.get('tracks')));
          this.isReady('tracks');
        }
      }
    },

    withTracks: function(callback) {
      if (this.tracks && this.get('validation_status')) {
        callback();
      } else {
        this.fetch({ include: 'tracks publish_options dead_tracks',
                     success: callback });
      }
    },

    withInternationalTracks: function(callback){
      if (this.get('hasInternationalTracks')) {
        callback();
      } else {
        var self = this;
        return $.ajax(this.url()+'/tracks_for_international.jsonh').done(function(response) {
          self.tracks = new SelectedTracks(tracksCollection.load(response.tracks));
          self.set('hasInternationalTracks', true);
          callback();
        }).fail(function(response){
          self.trigger('international_error');
        });
      }
    },

    play: function() {
      // TODO: make sure player is ready
      TRAX.previewPlayer = new TRAX.PreviewPlayer();
    },

    publish: function() {
      var firstPublish = !this.get('first_published_at');

      if (this.get('publishable')) {
        this.save({ published: true }, {
          success: _.bind(this.onPublish, this, firstPublish)
        });
      }
    },

    onPublish: function(firstPublish) {
      this.trigger('publish', firstPublish);
    },

    unpublish: function() {
      this.save({ published: false });
    },

    deleteFromLocalStorage: function() {
      var name = this.get('name');
      var path = this.get('web_path');

      var recentMixes = TRAX.currentUser.get('recent_mixes');

      var rejected = _.reject(recentMixes, function (recent) {
        return recent.name == name && recent.url == path;
      });

      TRAX.currentUser.updateRecentMixes(rejected);
    },

    getTracksPlayed: function(callback) {
      if (this.playToken() && this.get('published')) {
        JSONH.now_with_context('/sets/' + this.playToken() + '/tracks_played', { mix_id: this.id, reverse: true }, this, function(json) {
          if (json.success && json.tracks && json.tracks.length > 0) {
            this.tracksPlayed.add(tracksCollection.load(json.tracks));
          }
          this.isReady('tracksPlayed');
        }, { spinner: false });
      } else {
        this.isReady('tracksPlayed');
      }
    },

    sync: function(method, model, options) {
      var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read'  : 'GET'
      };

      if (method == 'update') {
        data = this.toRails();
      } else if (method == 'read') {
        data = {};
      }

      data['api_version'] = 2.1;

      if (options.include) {
        data['include'] = options.include;
      }

      if (this._syncRequestId) {
        clearTimeout(this._syncRequestId);
      }

      if (this._syncRequest) {
        this._syncRequest.abort();
      }

      this._syncRequestId = setTimeout(_.bind(function(){
        this._syncRequest = JSONH.now_with_context(
          this.url(),
          data,
          this,
          function(json) {
            if (json.mix) {
              // this set should NOT trigger a remote save
              this.set(json.mix, {});
              options.success(this, json.mix, options);
            } else {
              if (options.error) {
                options.error(json.mix);
              } else {
                TRAX.update_flash(json);
              }

            }
          }, { type : methodMap[method],
               spinner : (options.spinner || '#validation-spinner'), showSave:true }
        );
      }, this), 700);

      // TODO Do we need to return this?
      return this._currentRequest;
    },


    saveIfChanged: function(attrs, options) {
      var _changed;
      for (var attr in attrs) {
        if (!_.isEqual(this.get(attr), attrs[attr])) {
          _changed = true;
          this.fieldsTouched[attr] = true;
          break;
        }
      }

      if (_changed) {
        return this.save(attrs, options);
      } else {
        // nothing saved
        return false;
      }
    },

    toRails: function() {
      return {
        mix : {
          name:        this.get('name'),
          description: this.get('description') || '',
          tag_list:    this.get('tag_list_cache'),
          unlisted:    this.get('unlisted'),
          nsfw:        this.get('nsfw'),
          published:   this.get('published')
        }
      };
    },

    // Only update if changed
    updateTracklist: function(track_ids) {
      this.tracks.update(track_ids);
      this.tracks.save();
    },

    setTags : function(tagsStr) {
      tagsStr = tagsStr.split(/\s*,\s*/).join(', ');
      this.saveIfChanged({ tag_list_cache: tagsStr }); //, { silent: true });
    },

    tagList : function() {
      return this.get('tag_list_cache').split(/\s*,\s*/);
    },

    suggestTags : function() {
      return !this.fieldsTouched['tag_list_cache'];
    },

    validationErrorsForTracks: function() {
      if (this.get('validation_status') &&
          this.get('validation_status').errors &&
          this.get('validation_status').errors.tracks) {
        return this.get('validation_status').errors.tracks;
      } else {
        return [];
      }
    },


    validationErrorsForTrack: function(track_id) {
      var trackErrors = this.validationErrorsForTracks();
      if (trackErrors && trackErrors[track_id]) {
        return trackErrors[track_id];
      } else {
        return [];
      }
    },

    validationErrorsForField: function(fieldName) {
      if (this.get('validation_status') &&
          this.get('validation_status').errors &&
          this.get('validation_status').errors[fieldName]) {
        return this.get('validation_status').errors[fieldName];
      } else {
        return [];
      }
    },

    hasTrackUid : function(uid) {
      return this.tracks && this.tracks.hasUid(uid);
    },

    hasAtLeast8Tracks : function() {
      return (this.tracks && this.tracks.length >= 8);
    },

    // DRY this
    playToken: function() {
      return cookie.get('play_token');
    },

    embedCodeHtml5: function(width, height){
      width  = width || 500;
      height = height || 281;
      return '<iframe src="https://8tracks.com/mixes/'+this.id+'/player_v3_universal" width="'+width+'" height="'+height+'" style="border: 0px none;"></iframe>';
    },

    loadImage: function() {
      this.image = new Image({ id: 'mix_'+this.id, mix : this });
      this.image.fetch();
      return this.image;
    },

    toggleLike: function() {
      var link = '/mixes/' + this.get('id') + '/toggle_like';
      var self = this;
      JSONH.now(link, {}, function(json){
        self.set('liked_by_current_user', json.mix.liked_by_current_user);
        if (json.mix.liked_by_current_user) {
          Events.likeMix(TRAX.mix);
        }
      });
    },

    fb_opts : function(){
      return {
        name: this.get('name'),
        description: this.get('description'),
        link: 'https://8tracks.com' + this.get('web_path'),
        picture: this.get('cover_urls').sq250
      };
    },

    sortedDeadTracks: function() {
      var deadTracks = this.get('dead_tracks');
      return _.sortBy(deadTracks, function(track) {
        return track.name;
      });
    },

    removeTrackFromGrave: function(trackId) {
      var graveUrl = "/mixes/"+this.id+"/dead_tracks/"+trackId+".jsonh";
      var self = this;

      return $.ajax(graveUrl, {
        type: 'DELETE'
      }).done(function(response) {
        self.set('dead_tracks', response.dead_tracks);
      });
    },

    restoreTrackFromGrave: function(trackId) {
      var track = _.find(this.get('dead_tracks'), function(track) {
        return track.id == trackId;
      });

      track = tracksCollection.load(track);

      this.tracks.addTrack(track);
    }
  });

  return Mix;
});

define('lib/carousel',[],function() {
  return {
    onCarouselClick : function(event) {
      $(event.currentTarget).addClass('checked').siblings().removeClass('checked');
      this.animateCarousels();
    },
    
    animateCarousels : function(){
      if (!this.carouselTimers) this.carouselTimers = [];
      var carousels = $('.carousel_slider');
      for(i = 0; i<=carousels.length; i++){
        this.animateCarousel(i, carousels[i]);
      }
      $('.slider__nav').click(_.bind(this.onCarouselClick, this));
    },
    
    animateCarousel : function(i, carouselEl){
      clearInterval(this.carouselTimers[i]);
      this.carouselTimers[i] = setInterval(function(){
        var current = $(carouselEl).children("input.checked").first();
        current.removeClass('checked');
        
        var next = current.next('input');
        if (next.length == 0) {
          next = $(carouselEl).children("input").first();
        } 
        //next.siblings('input').attr('checked', false);
        next.attr('checked',true).addClass('checked');
      }, 5000)
    }
  };
});

define('views/trax_view', ['lib/sessions', 'lib/carousel'], function(sessions) {

  return Backbone.View.extend({

    close : function(options) {
      if (_.isUndefined(options)) options = {};
      options = _.defaults(options, { keepDomElement: false });

      this.childViews && _.each(_.compact(this.childViews), function(child){
        child.close();
      });

      options.keepDomElement ? this.cleanupElement() : this.remove();

      this.unbind && this.unbind();

      if (this.onClose){
        this.onClose();
      }

      this.dormant = true;
    },

     cleanupElement: function(){
       this.$el.empty();
       this.undelegateEvents();
     },

     whenUserReadyOrChanged: function(callback) {
        sessions.whenUserReadyOrChanged(callback, this);
     },

     afterRender: function() {
     }

  });
});

// Prototype object for injecting helpers into template objects for mustache.
// Intialize a new one like so:
// var tplParams = new TplParams(json)

define('lib/_template_helpers', ['global_trax', 'lib/trax_utils'], function(TRAX, Utils){


var TplParams = function(options) {
  this.initTplParams(options);
};

TplParams.prototype.initTplParams = function(options) {
  //var keys = _.keys(options);
  //for (var i = 0; i < keys.length; i++) {
    //this[keys[i]] = options[keys[i]];
  //}
  _.extend(this, options);
};




//HELPERS are called with mustache blocks and arguments as the enclosed text, space-separated.
//If no other arguments are specified, the first/only argument is of the property to be processed.
//If the helper is property specific (e.g. always operates in the same context), no argument is needed.
// Examples:
// {{#helper}}property_name{{/helper}}
// {{#helper}}property_name argument1 argument2{{/helper}}
// {{{helper}}}

TplParams.prototype.escape = function(){
  return function(text){
    return escape(this[text]);
  }
}

TplParams.prototype.mix_cover_url = function() {
  return function(text) {
    return TplParams.prototype.imgix_url(text, this.cover_urls);
  };
};

TplParams.prototype.mixpage_mix_cover_url = function(text, render) {
  // if (this.cover_urls['use_original_on_mixpage']) {
  //   return this.cover_urls['original_url'];
  // } else {
    return TplParams.prototype.mix_cover_url(text);
  // }
};

TplParams.prototype.avatar_url = function() {
  return function(text) {
    return TplParams.prototype.imgix_url(text, this.avatar_urls);
  };
};

TplParams.prototype.mix_cover_img = function() {
  var cover_urls = this.cover_urls;
  return function(text) {
    return '<img src="'+TplParams.prototype.imgix_url(text, cover_urls)+'" class="cover" alt="'+_.escape(this.name)+'"  />';
  };
};


TplParams.prototype.avatar_img = function() {
  var avatar_urls = this.avatar_urls;
  return function(text) {
    return '<img src="'+TplParams.prototype.imgix_url(text, avatar_urls)+'" class="avatar" alt="'+_.escape(this.login)+'"/>';
  };
};


TplParams.prototype.external_img = function() {
  return function(text){
    args = text.split(/,\s*/);
    src_name = args[0];
    size = args[1];
    src = this[src_name];

    if (window.dpr !== undefined && window.dpr > 1) size = size * 2;

    return '<img src="'+external_image_url(src, size)+'" class="artist_photo" width="'+size+'"/>';
  }
};

// TplParams.prototype.lastfm_img = function() {
//   return function(text){
//     args = text.split(/,\s*/);
//     src_name = args[0];
//     size1 = args[1];
//     size2 = args[2];
//     src = this[src_name];

//     if (window.dpr !== undefined && window.dpr > 1) {
//       src = src.replace(new RegExp('\/('+size1+'|_)\/'), '/'+size2+'/');
//     } else {
//       src = src.replace(/\/_\//, '/'+size+'/') ;
//     }

//     return '<img src="'+src+'" class="artist_photo" />';
//   };
// };

//transforms
//https://upload.wikimedia.org/wikipedia/commons/f/f6/Jamie_Foxx_with_Kanye_West.jpg
//into
//https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jamie_Foxx_with_Kanye_West.jpg/160px-Jamie_Foxx_with_Kanye_West.jpg

// TplParams.prototype.wikipedia_img = function() {
//   return function(text){
//     var args = text.split(/,\s*/);
//     var src_name = args[0];
//     var size1 = args[1];
//     var size2 = args[2];
//     var size = size1;
//     var src = this[src_name];
//     if (window.dpr !== undefined && window.dpr > 1) size = size1 * 2;
//     if (src && src.match('/commons')) {
//       src = src.replace('/commons/', '/commons/thumb/');
//       src += '/' + size + 'px-' + src.split('/').slice(-1);
//     }
//     return src ? '<img src="'+src+'" class="artist_photo" />' : '';
//   };
// };


//transforms
//http://sphotos-c.ak.fbcdn.net/hphotos-ak-frc3/t1/s720x720/1506008_573340619410831_680266142_n.jpg
//into
//http://sphotos-c.ak.fbcdn.net/hphotos-ak-frc3/t1/s160x160/1506008_573340619410831_680266142_n.jpgJamie_Foxx_with_Kanye_West.jpg

// TplParams.prototype.facebook_img = function() {
//   return function(text){
//     var args = text.split(/,\s*/);
//     var src_name = args[0];
//     var size1 = args[1];
//     var src = this[src_name];
//     if (window.dpr !== undefined && window.dpr > 1) size = size1 * 2;
//     src = src.replace(/\/s[0-9]*x[0-9]*\//, '/s'+size1+'x'+size1+'/');
//     return src ? '<img src="'+src+'" class="artist_photo" />' : '';
//   };
// };

TplParams.prototype.mix_set_sort_path = function(){
  return function(text) {
    if (this.web_path.match(/(\/recent|\/popular|\/hot)/)) {
      return this.web_path.replace(/(\/recent|\/popular|\/hot)/, text);
    } else {
      return this.web_path + text;
    }
  };
};

TplParams.prototype.sort_name = function(){
  return { 'hot' : 'Trending', 'new' : 'Newest', 'recent' : 'Newest', 'popular' : 'Popular' }[this.sort];
};

TplParams.prototype.dj_mode = function(){
  return this.smart_type == 'dj';
};

TplParams.prototype.collection_mode = function(){
  return this.smart_type == 'collection';
};

//------- NUMBER / DATE / STRING FORMATTING -------

TplParams.prototype.cool_number = function() {
  return function(text){
    return Utils.coolNumber(this[text]);
  };
};

TplParams.prototype.human_number = function() {
  return function(text){
    return Utils.addCommas(this[text]);
  };
};

TplParams.prototype.human_date = function() {
  return function(text){
    var str = this[text]!== null ? this[text] : '';
    return TplParams.prototype.human_date_value()(str);
  };
};

TplParams.prototype.human_date_value = function() {
  return function(str){
    var parsed = '';

    if (str) {
      if (str.match('TZ|T')) { //process rails dates differently
        var datestr = str.split(/[-TZ]/);
        parsed = new Date(Date.parse(datestr.slice(0,3).join('/')+' '+datestr[3]));
      } else {
        parsed = new Date(Date.parse(str));
      }

      var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

      return months[parsed.getUTCMonth()] + ' ' + parsed.getDate() + ', ' + parsed.getFullYear();
    }
    return '';
  };
};

TplParams.prototype.human_duration = function() {
  return function(text){
    var secs = this[text];
    if (secs == 0) {
      return '0min';
    }
    return _.compact(_.collect([[60, 'sec'], [60, 'min'], [24, 'hr'], [1000, 'd']], function(increment){
      if (secs > 0){
        var n = secs % increment[0];
        secs = (secs - n) / increment[0];
        if (increment[1] != 'sec') return n + increment[1];
      }
    })).reverse().join(' ');

  };
};

TplParams.prototype.dynamic_font_size = function() {
  var login = this['login'];
  if (!login)
    return;

  var sizes = [
    [18, 16],
    [15, 18],
    [12, 20],
    [10, 24],
    [8, 25],
    [6, 26],
    [1, 28]
  ];

  for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i];
    if (login.length >= size[0])
      return size[1].toString() + 'px';
  }
};

TplParams.prototype.dynamic_font_size2 = function() {
  return function(text) {
    if (text.length > 20) {
      return "oversize";
    } else {
      return "";
    }
  };
};


TplParams.prototype.track_duration = function() {
  var secs = this['duration'];
  return _.compact(_.collect([[60, 'sec'], [60, 'min'], [24, 'hr'], [1000, 'd']], function(increment){
    if (secs > 0){
      var n = secs % increment[0];
      secs = (secs - n) / increment[0];
      return ("0" + (n + increment[1])).substr(-2);
    }
  })).reverse().join(':');
};

TplParams.prototype.soundcloud_year = function(){
  return this.release_date.substring(0, 4);
};

TplParams.prototype.first_sentence = function() {
  return function(text){
    var args = text.split(' ');
    var string = args[0] || '';

    string = (string.match(/.+/g) || []).join(' '); //fixes the case when people created line breaks with spaces

    var max_length = args[1] || 100;
    var parts = _.map(string.split('. '), function(str) { return str.trim() });
    if (parts[0].length > max_length) {
      return string.substring(0, max_length) + '...';
    } else if (parts.length > 1) {
      return parts[0] + '.';
    }

    return string;
  };
};


TplParams.prototype.pluralize = function() {
  return function(text){
    var args = text.split(' ');
    return (this[args[0]] == 1 ? args[1] : args[2]);
  };
};


TplParams.prototype.show_pagination = function(){
  if (this['total_entries']) {
    return this['total_entries'] > this['per_page'];
  } else if (this['pagination']) {
    return this['pagination']['total_pages'] > 1;
  }
};


//------- TAG HELPERS -------
// {{{list_tags}}}

TplParams.prototype.list_tags = function(text, plaintext){
  var tag_array;
  var arr = [];

  if (this['tag_list_cache']) {
    tag_array = this['tag_list_cache'].split(/,\s?/);
  } else if (this['top_tags']) {
    tag_array = this['top_tags'];
  } else {
    return '';
  }

  for (var i = 0; i < tag_array.length; i++) {
    arr.push(TplParams.prototype.tag(tag_array[i], false, false, plaintext ? '' : 'tag'));
  }

  return arr.join('');
};

TplParams.prototype.list_tags_plaintext = function(text){
  return TplParams.prototype.list_tags(this, [text, true]);
};

TplParams.prototype.link_top_genre = function(){
  if (!this['tags_list']) {
    return "";
  }

  var humanTopGenres = "";
  if (this['tags_list'].length == 1) {
    humanTopGenres += this['tags_list'][0];
  } else if (this['tags_list'].length == 2) {
    humanTopGenres += this['tags_list'][0] + ' and ' + this['tags_list'][1];
  } else {
    _.each(this['tags_list'], function(tag, index) {
      if (index != this['tags_list'].length - 1) {
        humanTopGenres += tag + ', ';
      } else {
        humanTopGenres += 'and ' + tag;
      }
    }, this);
  }

  var exploreUrlPathPart = _.collect(this['tags_list'], Utils.toUrlParam).join('+')
  var link = '<a href="/explore/' + exploreUrlPathPart + '">' + humanTopGenres + '</a>';

  return link;
};

// {{{list_genres}}}

TplParams.prototype.list_genres = function(){
  if (!this['genres']) {
    return '';
  }

  var arr = [];
  for (var i = 0; i < this['genres'].length; i++) {
    arr.push(TplParams.prototype.tag(this['genres'][i], false, false, ''));
  }

  return arr.join('');
};

// {{{list_artists}}}
TplParams.prototype.list_artists = function(){
  if (!this['artist_tags']) {
    return '';
  }

  var arr = [];
  for (var i = 0; i < this['artist_tags'].length; i++) {
    arr.push(TplParams.prototype.artist_link(this['artist_tags'][i], false, false, ''));
  }

  return arr.join('');
};

// {{{grid_tags}}}
TplParams.prototype.grid_tags = function() {
  if (!this['tag_list_cache']) {
    return '';
  }
  var tag_array = this['tag_list_cache'].split(/,\s?/);
  var arr = [];
  for (var i = 0 ; i < 5; i++) {
    if (tag_array[i]) {
      arr.push(TplParams.prototype.tag(tag_array[i], false, false, 'tag'));
    }
  }

  return arr.join(' ');
};


TplParams.prototype.first_tag = function() {
  if (!this['tag_list_cache']) {
    return '';
  }
  var tag_array = this['tag_list_cache'].split(/,\s?/);
  return tag_array[0];

  return arr.join('');
};


//------- PAGINATION HELPERS---------

TplParams.prototype.seo_pagination = function(){
  var link_structure = this.link_structure || ((this.web_path||this.path) + '/::page::');
  ret = '';
  if (this.pagination) {
    var pagination = this.pagination;
    var total_pages = (pagination.total_pages && pagination.total_pages <= 1000 ? pagination.total_pages : '1000+');
    if (!pagination.previous_page && !pagination.next_page) return '';

    ret += '<div class="new_pagination clear">';

    if (pagination.previous_page) {
      ret += '<div class="pages_before">';
      ret += '<a href="' + link_structure.replace('::page::', pagination.previous_page) + '" class="prev_page white_button"><span class="i-arrow-left"></span>&nbsp;&nbsp;Prev page</a> ';
      for (page = pagination.previous_page - 2; page <= pagination.previous_page; page++) {
        if (page > 0) {
          ret += '<a href="' + link_structure.replace('::page::', page) + '" class="white_button">' + page + '</a> ';
        }
      }
      ret += '</div>';
    }

    if (pagination.next_page) {
      ret += '<div class="pages_after">';
      ret += '<a href="' + link_structure.replace('::page::', pagination.next_page) + '" class="next_page white_button">Next page&nbsp;&nbsp;<span class="i-arrow-right"></span></a> ';

      for (page = pagination.next_page+2; page >= pagination.next_page; page--) {
        if (page <= pagination.total_pages) {
          ret += '<a href="' + link_structure.replace('::page::', page) + '" class="white_button">' + page + '</a> ';
        }
      }
      ret += '</div>';
    }

    ret += '<div class="page_counter">';
    if (pagination.previous_page || pagination.next_page) {
      ret += (pagination.page || pagination.current_page) + ' of ' + total_pages;
    }
    // if (this.id) {
    //   ret += '<a href="/mix_sets/'+this.id+'.rss" class="rss" title="RSS feed for these results"></a>';
    // }
    ret += '</div>';
    ret += '</div>';
  }

  return ret;
};


TplParams.prototype.more_pagination = function(include) {
  return function(text) {
    ret = '';
    if (this.pagination && this.pagination.next_page) {
      var path = this.path.replace(/[&|\?]page=[0-9]+/, '');
      path += path.indexOf('?') > -1 ? '&' : '?';

      ret += '<div class="more_pagination clear">';
      ret += '<a href="' + path + 'page=' + this.pagination.next_page + '&per_page=' + this.pagination.per_page + '&include='+this.include+'" class="more white_button">More</a> ';
      ret += '<div id="show-spinner" class="spin"><span style="display:none">&nbsp;</span></div>';
      ret += '</div>';
    }

    return ret;
  };
};

// {{#badge}}size{{/badge}}
TplParams.prototype.badge = function(){
  return function(text) {
    if (!this.designation) return '';
    var size = text;
    if (!size) size = 'small';
    var badge = '<span class="badge_'+size+' badge_'+this.designation+'">'
    if (this.designation == 'plus') {
      badge += '<a href="/plus" target="_blank">'+this.designation.replace('_', ' ')+'</a>'
    } else {
      badge += this.designation.replace('_', ' ')
    }
    return badge+'</span>';
  };
};

TplParams.prototype.page_break = function(increment, className){
  if (this.index != 1 && this.index % increment == 1) {
    return '</div><div class="' + className + '" style="display: none;">';
  }
  return '';
};

// {{#spinner}}id_prefix{{/spinner}}
TplParams.prototype.spinner = function() {
  return function(text){
    if (text) {
      id = 'id="'+text+'-spinner"';
    } else {
      id = '';
    }
    return '<div '+id+' class="spinner"><span class="spin"></span></div>';
  };
};

// MIX SET BITWISE HELPERS
TplParams.prototype.similar = function(block) {
  if (this.smart_type == 'similar'){ return block; }
  return false;
};


TplParams.prototype.collection_show_users = function() {
  if (this.mode.toLowerCase() == 'feed') {
    return 'mixes_with_users';
  } else {
    return false;
  }
};

TplParams.prototype.tag_link = function() {
  var tag = typeof(this) == 'object' ? this.name : this;
  return TplParams.prototype.tag(tag, false, false, 'tag', this.artist_avatar);
};

//seldom used on its own
TplParams.prototype.tag = function(tag_name, active, just_clicked, class_name, color1, color2, artist_avatar) {
  return '<a href="/explore/' + Utils.toUrlParam(tag_name) + '" class="'+
         class_name + ' ' +
         (active ? ' active' : '') +
         (just_clicked ? ' just_clicked' : '') +
         '" title="' + tag_name + '" ' +
         (color1 ? ' style="background-color:' + color1 + '; color:' + color2 + '; border-color: ' + color1+ '"' : '') + '>'
         + (artist_avatar ? '<img src="'+artist_avatar+'&w=64&h=64" class="avatar" />' : '') +
         '<span>' + tag_name + '</span>' +
         '</a>';
};


TplParams.prototype.artist_link = function(artist_name, active, just_clicked, class_name) {
  return '<a href="/explore/' + Utils.toUrlParam(artist_name) + '" class="tag '+
         class_name + ' ' +
         (active ? ' active' : '') +
         (just_clicked ? ' just_clicked' : '') +
         '" title="' + artist_name + '"><span>' + artist_name + '</span>' +
         '</a>';
};

TplParams.prototype.tags_path = function(tags, sort, page, q){
  newtags = _.collect(tags, Utils.toUrlParam).join('+');
  var controller = 'mixes';
  if(typeof(sort) == 'undefined'){ sort = ''; controller = 'explore'; }

  if (newtags.length > 0) {
    url = '/'+controller+'/'+newtags+'/'+sort+'?page='+page;
  } else {
    url = '/'+controller+'/all/'+sort+'?page='+page;
  }

  if(q){ url += '&q='+q; }

  return url;
};

TplParams.prototype.imgix_url = function(text, image_urls) {
  if(!image_urls) {
    return "";
  }

  var args = text.split(/,\s*/);
  var version = args[0];
  var imgix_params = args[1];
  var src, w, h, blur;
  if (imgix_params) {
    w = imgix_params.match(/w=(\d+)/i)[1];
    h = imgix_params.match(/h=(\d+)/i)[1];
    if (window.dpr == 2 || window.dpr == 3) {
      w = w*2;
      h = h*2;
    }

    // Used for web sponsored ad units
    var matches = imgix_params.match(/&blur=(\d+)/i)
    if (matches) {
      blur = matches[0];
    }
  }

  if (image_urls.cropped_imgix_url && w) {//only allow square images
    //use the original size if it's the same or less than requested
    if (image_urls.cropped_imgix_size <= w) {
      src = image_urls.cropped_imgix_url;
    } else { //find the closest preferred size at as large as requested
      var i = 0;
      while (i < IMGIX_PREFERRED_SIZES.length) {
        if ( IMGIX_PREFERRED_SIZES[i] >= w || (i == IMGIX_PREFERRED_SIZES.length - 1) ){
          w = IMGIX_PREFERRED_SIZES[i];
          break;
        }
        i += 1;
      }
      src = image_urls.cropped_imgix_url + '&w='+w+'&h='+w;
    }

  } else if (image_urls.original_imgix_url && imgix_params) {
    src = image_urls.original_imgix_url + '&' + imgix_params;
  } else if (image_urls.original && image_urls.original.match('imgix') && imgix_params) {
    src = image_urls.original + imgix_params;
  } else {
    src = image_urls[version];
  }

  if (blur) {
    src += blur;
  }

  // HTTPS
  if (src.match(/images\.8tracks\.com/)){
    if (PAGE.cloudflare_request && window.location.protocol == 'https:'){
      src = src.replace('http://images.8tracks.com', 'https://images.8tracks.com');
    } else { //temporary hack for bad DNS on images.8tracks.com
      src = src.replace('https://images.8tracks.com', 'https://d2ykdu8745rm9t.cloudfront.net');
    }
  }

  return src;
};

TplParams.prototype.dpr = function() {
  if (window.dpr !== undefined && window.dpr > 1) {
    return '@2x';
  }
};

TplParams.prototype.to_url_param = function(){
  return function(text) {
    return Utils.toUrlParam(this[text]);

  };
};

TplParams.prototype.buy_link_class = function(){
  if (this.buy_link) {
    if (!!this.buy_link.match(/:\/\/.*\.bandcamp.com\//)) {
      return 'bandcamp_buy';
    }
  }
};

TplParams.prototype.facebook_authorize_button = function(){
  return ''+
  '<a href="/auth/facebook" class="facebook_connect_button facebook-signup" data-site="facebook" data-win-height="362" data-win-name="facebook" data-win-width="640" rel="popup" target="_blank" title="Connect with Facebook">'+
  '  <span class="i-facebook icon"></span>'+
  '  <span class="text">SIGN IN</span>'+
  '</a>';
};

TplParams.prototype.google_plus_authorize_button = function(){
  var scope = "profile email https://www.googleapis.com/auth/youtube.readonly";
  return ''+
  '<div class="google-plus-container" id="gplus-button"> '+
    '<span class="i-gplus icon"></span> '+
    '<span class="text">SIGN IN</span>'+
  '</div>';
}


// Globally-namespaced object for invoking helpers without rendering any mustache, also for injecting helpers
if(!TRAX) TRAX = App.Trax;
TRAX.templateHelpers = new TplParams({});



String.prototype.to_url_param = function(){
  return Utils.toUrlParam(this);
};

String.prototype.blank = function(){
  return this.length === 0;
};

String.prototype.capitalize = function(){
  return this[0].toUpperCase() + this.substr(1)
};

String.fromCamelCase = function(){
  return this.match(/([A-Z]*[a-z0-9]+)/g).join('_').toLowerCase()
}

Number.prototype.to_human_number = function(){
  return Utils.addCommas(this);
};

Number.prototype.nonzero = function(){
  return this !== 0;
};

Number.prototype.hours_to_hours_and_minutes = function(){
  //return function(text) {
    var quarters_of_hours = Math.round(this * 4);
    var whole_hours = Math.floor(quarters_of_hours/4);
    var quarters = quarters_of_hours % 4;

    if (whole_hours > 0 && quarters > 0) {
      return whole_hours + 'h ' + (quarters*15) + 'm';
    } else if (whole_hours > 0 && quarters == 0) {
      return whole_hours + (whole_hours == 1 ? ' hour' : 'h');
    } else if (whole_hours == 0 && quarters > 0) { 
      return (quarters*15) + ' min'; 
    } else {
      return '0 hours';
    }
  //}
};

// Array.prototype.first = function(){
//   return this[0];
// };

// Array.prototype.to_list = function(){
//   return this.join(', ');
// };


  return TplParams;
});



define('lib/player/sm_track_player',['jquery.class', 'global_trax'], function(Class, TRAX){

  var SMTrackPlayer = Class.extend({
    initialize: function(options) {
      _.extend(this, Backbone.Events);

      _.bindAll(this, 'seekTo', 'fadeOut', 'fadeIn', 'on30Seconds', 'onListen', 'load', 'onSMReady', 'pauseRewind');


      this.soundManager = options.soundManager;
      this.currentTrack = null;
      this.smSound      = null;
      this.id           = null;

      this.bindSoundManagerEvents();

      // Debugging info
      this.loadCallsCount = 0; // Number of times .load() was called via the _.delay function
      this.oldTrigger = this.trigger;
      this.loggedEvents = [];
      this.trigger = function(){
        if(!arguments[0].match(/every|whilePlaying/)){
          // console.log("[SMTrackPlayer] Firing: " + arguments[0]);
          this.loggedEvents.push(arguments);
        }
        this.oldTrigger.apply(this,arguments);
      };
    },

    isTrackLoaded: function() {
      return !!this.smSound && !!this.currentTrack;
    },

    isPlaying: function() {
      return !!(this.smSound && !this.smSound.paused);
    },

    isPaused: function() {
      return(this.isPausedMuted || (this.smSound && this.smSound.paused));
    },

    // Expects a TRAX.Track object
    load: function(track, positionInMs, useEQData) {
      console.log('smTrackPlayer.load');
      if (!track) {
        throw "CUSTOM no track is set";
      }

      this.currentTrack = track;

      this.soundManager.onready(_.bind(function(){
        //define temp function to preserve arguments
        this.onSMReady(track, positionInMs, useEQData);
      }, this));

      return this.smSound;
    },

    onSMReady : function(track, positionInMs, useEQData) {
      track = track || this.currentTrack;

        console.log('soundManager.onReady');
        // var soundID = 't' + this.currentTrack.id;
        var soundID = 't' + track.id + (useEQData ? 'eq' : '');

        if (!this.currentTrack.get('track_file_stream_url')) {
          throw "CUSTOM this.currentTrack has no track_file_stream_url";
        }

        if (!_.isString(this.currentTrack.get('track_file_stream_url'))) {
          throw "CUSTOM this.currentTrack.get('track_file_stream_url') is not a string";
        }

        var self = this;


        this.smSound = this.soundManager.createSound(_.extend({
          id: soundID,
          url: this.currentTrack.get('track_file_stream_url'),
          onload : function(success) {
            // readyState == 2 is the failed to load state
            if (this.readyState == 2) {
              self.trigger('trackError', self.currentTrack);
            }
          },
          useEQData : useEQData
        }, this.soundManagerHandlers()));


        if (this.smSound) {
          this.id = soundID;

          if (positionInMs) {
            this.seekTo(positionInMs);
          }

        } else {
          // .createSound() returned false
          // Rerun this method in 200ms
          this.loadCallsCount += 1;
          if(this.loadCallsCount < 5) {
            _.delay(this.onSMReady, 200, track, positionInMs);
            return;
          }
          else {
            this.smSound = null;
            throw "CUSTOM could not load smSound. Tried " + this.loadCallsCount + " times. SoundManager.ok(): " + this.soundManager.ok();
          }
        }

        try {
          this.smSound.onposition(30000, this.on30Seconds);
          this.smSound.onposition((this.currentTrack.get('report_delay_s') || 1) * 1000, this.onListen);
        } catch(e) {
          throw "CUSTOM this.smSound is not set. \nthis.currentTrack=" + JSON.stringify(this.currentTrack) + "\n" + JSON.stringify(this.loggedEvents);
        }

        this.trigger('trackLoaded', this);

      return this.smSound;

    },

    unload: function(){
      this.currentTrack = null;

      if(this.smSound) {
        this.stop();

        this.soundManager.unload(this.smSound.sID);
      }
    },


    play: function() {
      if (!this.smSound) {
        return;
      }

      this.cancelPauseTimer();
      this.smSound.setVolume(this.soundManager.defaultOptions.volume);
      this.soundManager.play(this.smSound.sID);
      this.trigger("play");
    },

    stop: function(){
      if(!this.smSound) {
        return;
      }

      this.soundManager.stop(this.smSound.sID);
      this.trigger("stop");
    },

    // TODO Add in fadingOut/fadeIn logic. See MixPlayer#resume
    resume: function() {
      if (!this.smSound) {
        return;
      }

      
      this.cancelPauseTimer(true);
      this.soundManager.resume(this.smSound.sID);
      this.trigger("resume");
    },

    pause: function(options){
      if(!this.smSound) {
        return;
      }

      if (this.currentTrack && this.currentTrack.is7digital()) {
        //this.cancelPauseTimer();
        this.startPauseTimer();
      } else {
        this.soundManager.pause(this.smSound.sID);
      }
      this.trigger("pause");
    },

    seekTo: function(position) {

      if (position < 3000) {
        this.soundManager.unmute(this.smSound.sID);
        this.trigger('seekToFinished');
        return;
      }

      if (this.smSound && this.smSound.readyState == 2) {
        this.trigger('trackError', this.currentTrack);
        return false;
      }

      try {
        // If the targeted position is further than the file length,
        // go 3 seconds before the end
        if (this.smSound.loaded && position > this.smSound.duration) {
          position = Math.ceil(this.smSound.duration) - 3000;
        }
      }
      catch(e) {
        throw "CUSTOM this.smSound.duration error in SMTrackPlayer.seekTo().\n" + e.message + "\nthis.smSound=" + JSON.stringify(this.smSound) + "\n" + JSON.stringify(this.loggedEvents);
      }

      try {
        if (!this.smSound.duration || this.smSound.duration < position) {
          // file not loaded enough yet
          _.delay(this.seekTo, 200, position);

        } else {
          // file loaded far enough to resume
          this.soundManager.setPosition(this.smSound.sID, position);
          this.soundManager.unmute(this.smSound.sID);
          this.trigger('seekToFinished');
        }
      }
      catch(e) {
        throw "CUSTOM this.smSound.duration error #2 in SMTrackPlayer.seekTo().\n" + e.message + "\nthis.smSound=" + JSON.stringify(this.smSound) + "\n" + JSON.stringify(this.loggedEvents);
      }
    },

    setGlobalVolume: function(level) {
      this.soundManager.defaultOptions.volume = level;
    },

    setVolume: function(level) {
      if(!this.smSound) {
        return;
      }

      this.soundManager.setVolume(this.smSound.sID, level);
    },

    currentVolume: function() {
      if(this.isTrackLoaded()) {
        return this.smSound.volume;
      }
      else {
        return null;
      }
    },

    mute: function() {
      if(this.isTrackLoaded()){
        this.soundManager.mute(this.id);
        this.trigger("mute");
      }
    },

    unmute: function() {
      if(this.isTrackLoaded()){
        this.soundManager.unmute(this.id);
        this.trigger("unmute");
      }
    },

    fadeOut: function(callback, sID) {
      if (this.isPlaying()) {
        if (_.isUndefined(sID)) {
          sID = this.id;
        }

        var vol = parseInt(this.currentVolume(), 0);
        if (vol > 0) {
          this.soundManager.setVolume(sID, vol-1);
          if (this.id == sID) {
            _.delay(this.fadeOut, 15, callback, sID);
          }
        } else {
          if (_.isFunction(callback)) {
            callback();
          } else {
            this.pause();
          }
        }
      }

    },

    fadeIn: function() {
      if (this.isTrackLoaded()) {
        if (this.isPaused()) {
          this.resume();
        }

        var vol = parseInt(this.currentVolume(), 0);
        if (vol < this.soundManager.defaultOptions.volume) {
          this.soundManager.setVolume(this.id, vol+1);
          setTimeout(this.fadeIn, 15);
        }
      }
    },

    soundManagerHandlers: function() {
      return {
        onfinish : _.bind(function() {
          this.trigger('finish');
        }, this),

        onplay : _.bind(function() {
          this.trigger('onPlay');
        }, this),

        whileplaying : _.bind(function() {
          if (this.smSound) {
            var positionInSec = parseInt(this.smSound.position / 1000, 0);
            if (this.lastPositionInSec != positionInSec) {
              var durationInSec = parseInt(this.smSound.durationEstimate / 1000, 0);
              if (durationInSec > 0) {
                this.trigger('everySecond', positionInSec, durationInSec);
                this.lastPositionInSec = positionInSec;
              }
            }
          }
        }, this)
      };
    },


    bindSoundManagerEvents: function() {
      this.soundManager.ontimeout(function(status) {
        if (!status.success) {
          var message;

          if (status.error && status.error.type && status.error.type === 'FLASHBLOCK') {
            var fd = FlashDetect;
            var hasFlash = fd.installed;

            if (!hasFlash) {
              message = 'Looks like Flash is not installed. <a href="http://get.adobe.com/flashplayer/">Get it here</a>';
              if (this.soundManager.html5.m4a) {
                message += ' or <a href="javascript:TRAX.switchToHtml5Player()">switch to HTML5</a>';
              }
              TRAX.show_flash_error(message);

              return false;
            } else if (fd.major < this.soundManager.flashVersion) {
              message = 'Looks like your Flash plugin is outdated. <a href="http://get.adobe.com/flashplayer/">Get the update</a>';
              if (this.soundManager.html5.m4a) {
                message += ' or <a href="javascript:TRAX.switchToHtml5Player()">switch to HTML5</a>';
              }
              TRAX.show_flash_error(message);

              return false;
            }

            message = 'Looks like Flash is blocked, you need to whitelist this site (check the button below), or try <a href="/troubleshoot">troubleshooting</a>';
            if (this.soundManager.html5.m4a) {
              message += ' or <a href="javascript:TRAX.switchToHtml5Player()">switch to HTML5</a>';
            }
            TRAX.show_flash_error(message);


            this.soundManager.onready(function(status) {
              if (status.success) {
                TRAX.show_flash_error('Thanks! You can press play now.', true);
              }
            });
          } else {
            message = 'Sounds won\'t play.';
            if (status && status.error && status.error.type) {
              message += ' (Error type is ' + status.error.type + ').';
            }
            message += ' You can try <a href="/troubleshoot">troubleshooting</a>.';
            if (this.soundManager.html5.m4a) {
              message += ' or <a href="javascript:TRAX.switchToHtml5Player()">switch to HTML5</a>';
            }
            TRAX.show_flash_error(message);
          }
        }
      });
    },

    startPauseTimer : function(){
      this.pausePosition = this.smSound.position;
      this.pauseTimer = setInterval(this.pauseRewind, 1000);
      this.isPausedMuted = true;
      this.smSound.mute()
      this.pauseDuration = 0;
    },

    cancelPauseTimer : function(resetPosition){
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        if (resetPosition) this.pauseRewind();
        this.isPausedMuted = false;
        this.smSound.pause();
        this.smSound.unmute()
      }
    },

    pauseRewind : function(){ //hack to keep streaming tracks in memory to prevent cache invalidation for 7digital streams (which are timestamped URLs)
      this.smSound.setPosition(this.pausePosition);
      console.log('pauseRewind: '+  (this.pauseDuration += 1));
    },

    on30Seconds: function() {
      this.trigger('seconds:30');
    },

    onListen: function() {
      this.trigger('onListen');
    }

  });

  return SMTrackPlayer;
});

define('lib/cast_sender',['jquery.class', 'global_trax'], function(Class, TRAX) {
  if (typeof App.cast !== 'undefined') {
    return App.cast;
  }

  var Cast = Class.extend({
    initialize: function() {
      if (typeof App.cast !== 'undefined') {
        return App.cast;
      }

      this.session = null;

      _.extend(this, Backbone.Events);
      _.bindAll(this, 'receiverListener', 'sessionListener', 'messageListener',
               'onInitSuccess', 'onInitError', 'onMediaDiscovered', 'sendHandshake',
               'onRequestSessionSuccess', 'onTrackEnded', 'onRequestSessionError',
               'updateProgress', 'updatePlayState', 'isPlaying', 'isPaused', 'isInitialized',
               'onMediaError', 'updateLoadingState', 'stopCasting', 'isResumingSession',
               'sessionResumed', 'poll', 'startPolling', 'stopPolling', 'seekTo');
    },

    // Called when receiver become available or unavailable
    receiverListener: function (e) {
      if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        console.log("Chromecast found");
        this.devicesPresent = true;
        this.trigger('castDeviceFound');
      } else {
        this.devicesPresent = false;
        console.log("No chromecasts available");
      }
    },

    // Called when a session is created or found from before
    sessionListener: function (session) {
      console.log("Session listener invoked");
      this.session = session;
      this.connected = true;

      try {
        var mix = this.mix = App.Collections.Mixes.load(session.media[0].media.customData.mix);
        var track = this.track = App.Collections.Tracks.load(session.media[0].media.customData.track);
        var smart_id = this.smart_id = session.media[0].media.customData.smart_id;
        // this.resumingSession = true;
      } catch (e) {
        // console.log(e);
        // return this.stopCasting();
      }

      if (!App.views.mixPlayerView) {
        var playerPromise = $.Deferred();
        require(['pages/player'], function(e) {
          playerPromise.resolve(mix, smart_id);
        });

        $.when(playerPromise).done(function(mix, smart_id) {
          var mpv = App.views.mixPlayerView = new App.Views.MixPlayerView({ mix: mix, smart_id: smart_id});
          mpv.mixPlayer.track = track;
          mpv.show();
        });
      }

      this.trigger('connected');
      TRAX.chromecasting = true;
      this.startPolling();

      // Set up message listener
      session.addMessageListener(CHROMECAST_MSG_NS, this.messageListener);
      if (session.media.length !== 0) {
        this.onMediaDiscovered('onRequestSessionSuccess', session.media[0]);
      }
    },

    // Called whenever a message is sent from the receiver device
    messageListener: function(namespace, message) {
      console.log('cast_sender messageListener', namespace, message);
      try {
        var data = JSON.parse(message);
        if (data.method == 'progress_update')   { return this.updateProgress(data.progress, data.duration); }
        if (data.method == 'play_state_update') { return this.updatePlayState(data.playing); }
        if (data.method == 'loading_update')    { return this.updateLoadingState(data.loading); }
        if (data.method == 'ended')             { return this.onTrackEnded(); }
        if (data.method == 'disconnect')        { return this.stopCasting(); }
      } catch (e) {
        console.log("Bad message format", e);
      }
    },

    onTrackEnded: function() {
      console.log('cast_sender onTrackEnded');
      this.trigger('finish');
    },

    updateProgress: function (positionInSec, durationInSec) {
      console.log('cast_sender updateProgress', positionInSec, durationInSec);
      this.positionInSec = positionInSec;
      this.trigger('updateProgress', positionInSec,  durationInSec);
    },

    updatePlayState: function (state) {
      console.log('cast_sender updatePlayState', state);
      this.playing = !!state;
      this.trigger('updatePlayState', this.playing);
    },

    updateLoadingState: function(loading) {
      console.log('cast_sender updateLoadingState', loading);
      if (loading) {
        this.trigger('loading');
      } else {
        this.trigger('doneLoading');
      }
    },

    onInitSuccess: function () {
      console.log("cast_sender initialized");
      this.initialized = true;
      this.trigger('initialized');
    },

    onInitError: function () {
      console.log("cast_sender Initialization failure");
    },

    onMediaDiscovered: function (how, media) {
      console.log('cast_sender onMediaDiscovered', how, media);
      currentMedia = media;
    },

    onMediaError: function (e) {
      console.log('cast_sender onMediaError', e);
      this.trackLoaded = false;
      this.trigger('trackError');
    },

    onMediaSuccess: function (e) {
      console.log('cast_sender onMediaSuccess', e);
      this.trackLoaded = true;
    },

    sendMessage: function (message) {
      console.log('cast_sender sendMessage', message);
      
      if (!this.session) {
        console.log('cast_sender sendMessage: no Session')
        return this.stopCasting();
      }

      var self = this;
      this.session.sendMessage(CHROMECAST_MSG_NS,
                          message,
                          function(e) {
                            console.log('cast_sender sendMessage Success', e);
                          },
                          function onMessageFailure(e) {
                            console.log("cast_sender sendMessage Failure:", e);
                            self.stopCasting();
                            TraxEvents.chromeCastError(e);
                          });
    },


    // Sends the initial handshake which gets the app started
    sendHandshake: function () {
      console.log('cast_sender sendHandshake');
      this.sendMessage({
        method: 'handshake',
        device_id: '12345',
        play: false
      });
    },

    // Called when user requests a session and succeeds
    onRequestSessionSuccess: function (session) {
      console.log('cast_sender onRequestSessionSuccess', session);

      if (this.session && this.session.sessionId == session.sessionId) {
          console.log("Session resumed");
      } else {
        this.session = session;
        this.sendHandshake({ play: true });
      }
      this.connected = true;
      this.trigger('connected');
      this.startPolling();
      TRAX.chromecasting = true;
      TraxEvents.launchChromecast(App.views.mixPlayerView.mix.id);
      session.addMessageListener(CHROMECAST_MSG_NS, this.messageListener);
    },

    isResumingSession: function() {
      return !!this.resumingSession;
    },

    sessionResumed: function() {
      console.log('cast_sender sessionResumed');
      this.resumingSession = false;
      this.updateLoadingState(false);
      this.poll();
    },

    poll: function() {
      this.sendMessage({ method: 'poll' });
    },

    onRequestSessionError: function (e) {
      console.log('cast_sender onRequestSessionError', e);
    },

    stopCasting: function() {
      console.log('cast_sender stopCasting');
      var self = this;
      var cb = function() {
        self.connected = false;
        self.session = null;
        self.trigger('terminated');
      };

      this.session && this.session.stop(cb, cb);
      this.stopPolling();
      TRAX.chromecasting = false;
    },

    startPolling: function() {
      this.pollInterval = setInterval(this.poll, 5000);
    },

    stopPolling: function() {
      console.log('cast_sender stopPolling');
      clearInterval(this.pollInterval);
    },

    trackMetaData: function (track) {
      var metaData = new chrome.cast.media.MusicTrackMediaMetadata();
      metaData.title = track.name;
      metaData.artist = track.performer;
      return metaData;
    },

    playMix: function(playToken, mix) {
      console.log('cast_sender playMix', mix);
      this.playToken = playToken;
      this.mix = mix;

      this.sendMessage({
        method: 'playMix',
        playToken: playToken,
        mix: mix
      });
    },

    playTrack: function (mix, track, positionInMs) {
      console.log('cast_sender playTrack', mix, track, positionInMs);
      var self = this;
      var request;
      var playing = true;
      var mediaInfo = new chrome.cast.media.MediaInfo(track.track_file_stream_url);

      mediaInfo.contentType = "audio/mp4";
      mediaInfo.duration = track.duration;
      mediaInfo.metaData = this.trackMetaData(track);
      mediaInfo.customData = {
        mix: mix,
        track: track,
        positionInMs: positionInMs
      };
      request = new chrome.cast.media.LoadRequest(mediaInfo);

      this.session.loadMedia(request, function() {
        self.trigger('updatePlayState', playing);
      }, self.onMediaError);
    },

    isPaused: function() {
      return !this.playing;
    },

    isPlaying: function() {
      return !!this.playing;
    },

    isDevicePresent: function() {
      return !!this.devicesPresent;
    },

    isInitialized: function() {
      return !!this.initialized;
    },

    isConnected: function() {
      return !!this.connected;
    },

    pause: function() {
      this.sendMessage({
        method: 'action',
        action: 'pause'
      });
    },

    seekTo: function(seconds) {
      this.sendMessage({
        method: 'action',
        action: 'seek',
        time: seconds,
      });
    },

    setVolume: function(lvl) {
      this.session.setReceiverVolumeLevel(lvl);
    },

    resume: function() {
      this.sendMessage({
        method: 'action',
        action: 'resume'
      });
    },

    skip: function() {
      this.sendMessage({
        method: 'action',
        action: 'skip'
      });
    },

    // Called when user clicks cast button on mix player
    launchChromecastApp: function () {
      console.log('cast_sender launchChromecastApp');
      if (App.cast && App.cast.session) {
        this.session = App.cast.session;
        console.log("Resuming old session");
        this.onRequestSessionSuccess(this.session);
      } else {
        console.log("Launching chromecast app");
        var request = new chrome.cast.SessionRequest(CHROMECAST_APP_ID);
        chrome.cast.requestSession(this.onRequestSessionSuccess,
                                   this.onRequestSessionError,
                                   request);
      }
    }
  });

  // Called when chromecast is loaded
  App.cast = new Cast();
  return App.cast;
});

define('lib/player/cc_track_player',['jquery.class', 'lib/cast_sender'], function(Class, cast) {
  var CCTrackPlayer = Class.extend({

    initialize: function(options) {
      _.extend(this, Backbone.Events);
      _.bindAll(this, 'onUpdatePlayState', 'onTrackFinish', 'onUpdateProgress', 'onTrackError', 'doneLoading');

      this.globalVolume = 100;
      this.currentTrack = null;
      this.bindEvents();
    },

    bindEvents: function() {
      cast.on('updateProgress', this.onUpdateProgress);
      cast.on('updatePlayState', this.onUpdatePlayState);
      cast.on('loading', this.loading);
      cast.on('doneLoading', this.doneLoading);
      cast.on('finish', this.onTrackFinish);
      cast.on('trackError', this.onTrackError);
    },

    onTrackFinish: function() {
      this.trigger('finish');
    },

    isTrackLoaded: function() {
      return true;
    },

    isPlaying: function() {
      return cast.isPlaying();
    },

    isPaused: function() {
     return cast.isPaused();
    },

    load: function(track, positionInMs) {
      this.currentTrack = track;
      this.positionInMs = positionInMs;
      this.trigger('trackLoaded', this);
    },

    unload: function() {
      this.currentTrack = null;
    },

    onTrackError: function() {
      this.trigger('trackError', this.currentTrack);
    },

    onUpdateProgress: function(positionInSec, durationInSec) {
      this.trigger('everySecond', positionInSec, durationInSec);
    },

    onUpdatePlayState: function(playing) {
      this.trigger(playing ? 'onPlay' : 'pause');
    },

    doneLoading: function() {
     this.trigger('seekToFinished');
    },

    play: function() {
      cast.playTrack(this.mixToSendToChromeCast(), this.currentTrack.toJSON(), this.positionInMs);
      this.positionInMs = null;
      this.trigger('play');
    },

    stop: function() {
      this.trigger('stop');
    },

    pause: function() {
      cast.pause();
      this.trigger('pause');
    },

    resume: function() {
      cast.resume();
      this.trigger('resume');
    },

    setGlobalVolume: function(lvl) {
      this.volume = lvl;
      cast.setVolume(lvl / 100);
    },

    setVolume: function(lvl) {
      this.volume = lvl;
      cast.setVolume(lvl / 100);
    },

    currentVolume: function() {
      return this.volume;
    },

    mute: function() {
      this.trigger('mute');
    },

    unmute: function() {
      this.trigger('unmute');
    },

    fadeOut: function() {
      // todo
    },

    fadeIn: function () {
      // todo
    },

    // Todo - rethink
    mixToSendToChromeCast: function () {
      return App.views.mixPlayerView.mixPlayer.mix.toJSON();
    }


  });

  return CCTrackPlayer;
})
;

//
// Abstract/Manager track player class. It plays a track using one of the
// concrete players (SMTrackPlayer or YTTrackPlayer).
//
define('lib/player/track_player',['global_trax', 'jquery.class', 'lib/player/sm_track_player',
        'lib/player/cc_track_player'],
       function(TRAX, Class, SMTrackPlayer, CCTrackPlayer) {
  var TrackPlayer = Class.extend({

    initialize: function(options) {
      _.extend(this, Backbone.Events);
      _.bindAll(
        this,
        'onEverySecond', 'on30Seconds', 'onListen', 'onTrackPlayerPlay',
        'onTrackPlayerStop', 'onTrackPlayerResume', 'onTrackPlayerPause',
        'onTrackPlayerSeekToFinished', 'onTrackPlayerMute',
        'onTrackPlayerUnmute', 'onTrackPlayerFinish', 'onOnPlay', 'onTrackError',
        'onTrackLoaded'
      );

      this.currentPlayer      = null;

      this.soundManagerPlayer = null; // Instance of SMTrackPlayer
      this.soundManager      = options.soundManager || soundManager;

      // Default to SoundManager
      this.switchPlayer('soundManager');
    },

    id: function() {
      return this.currentPlayer.id;
    },

    name: function() {
      if (this.isChromeCast()) {
        return 'cc';
      }
      else {
        return "sm";
      }
    },

    isSoundManager: function() {
      return(this.soundManagerPlayer && this.currentPlayer == this.soundManagerPlayer);
    },

    isChromeCast: function() {
      return(this.chromeCastPlayer && this.currentPlayer == this.chromeCastPlayer);
    },

    initSoundManagerPlayer: function() {
      if (this.soundManagerPlayer) { return; }

      this.soundManagerPlayer = new SMTrackPlayer({
        soundManager: this.soundManager
      });
    },

    initChromeCastPlayer: function() {
      if (this.chromeCastPlayer) { return; }
      this.chromeCastPlayer = new CCTrackPlayer();
    },
    
    switchPlayer: function(playerName) {
      this.unbindEvents(this.currentPlayer);

    if (playerName == 'chromecast') {
        this.initChromeCastPlayer();
        this.currentPlayer = this.chromeCastPlayer;
        TRAX.clearCheckPlayingWindowTimer();
      } else {
        this.initSoundManagerPlayer();
        this.currentPlayer = this.soundManagerPlayer;
      }

      this.bindEvents(this.currentPlayer);
      this.setGlobalVolume(this.globalVolume);
      this.setVolume(this.globalVolume);
    },


    // PLAYER TRACK STATES ////////////////////////////////////////////////////

    isTrackLoaded: function() {
      return this.currentPlayer.isTrackLoaded() && this.currentPlayer.currentTrack;
    },

    isPlaying: function() {
      return this.currentPlayer.isPlaying();
    },

    isPaused: function() {
      return this.currentPlayer.isPaused();
    },


    // TRACK LOAD/UNLOAD /////////////////////////////////////////////////////

    loadTrackIfNecessary: function(track, continuePlaying) {
      if (!continuePlaying && !this.currentPlayer.currentTrack) {
        return;
      }

      // If track wasn't loaded by the current player OR the currentTrack is
      // different, load the new track.
      if (continuePlaying && track && (!this.currentPlayer.currentTrack ||
                                      (this.currentPlayer.currentTrack.id && this.currentPlayer.currentTrack.id != track.id))) {
        this.load(track, this.currentPositionInMs);

      } else if (continuePlaying) {
        this.seekTo(this.currentPositionInMs);
        this.play();
      }
    },

    load: function(track, positionInMs) {
      // Keep a reference to the track to determine when to trigger the
      // trackLoaded event.
      this.newTrack = track;

      this.currentPlayer.load(track, positionInMs);
    },

    unload: function() {
      this.currentPlayer.unload();
    },


    // TRACK CONTROLS ///////////////////////////////////////////////////////

    play: function() {
      console.log('trackPlayer.play()', this.name());
      this.currentPlayer.play();
    },

    stop: function() {
      this.currentPlayer.stop();
    },

    resume: function() {
      this.currentPlayer.resume();
    },

    pause: function(options){
      this.currentPlayer.pause();
    },

    seekTo: function(position) {
      console.log('seekTo', position);
      this.currentPlayer.seekTo(position);
    },

    setGlobalVolume: function(level) {
      this.globalVolume = level;
      this.currentPlayer.setGlobalVolume(level);
    },

    setVolume: function(level) {
      this.currentPlayer.setVolume(level);
    },

    currentVolume: function() {
      this.currentPlayer.currentVolume();
    },

    mute: function() {
      this.currentPlayer.mute();
    },

    unmute: function() {
      this.currentPlayer.unmute();
    },

    fadeOut: function(callback, sID) {
      this.currentPlayer.fadeOut(callback, sID);
    },

    fadeIn: function() {
      this.currentPlayer.fadeIn();
    },


    // EVENTS ////////////////////////////////////////////////////////////

    // TODO Possibly better implementation: instead of binding and throwing events
    // in the concrete player classes, pass a reference of TrackPlayer into
    // the concrete player and have the concrete player call methods on
    // TrackPlayer to fire off events. i.e., TrackPlayer is the only one
    // handling events rather than this current implementation of bubbling events
    // up.
    bindEvents: function(player) {
      player.on('everySecond', this.onEverySecond);
      player.on('seconds:30', this.on30Seconds);
      player.on('onListen', this.onListen);
      player.on('play', this.onTrackPlayerPlay);
      player.on('stop', this.onTrackPlayerStop);
      player.on('resume', this.onTrackPlayerResume);
      player.on('pause', this.onTrackPlayerPause);
      player.on('seekToFinished', this.onTrackPlayerSeekToFinished);
      player.on('mute', this.onTrackPlayerMute);
      player.on('unmute', this.onTrackPlayerUnmute);
      player.on('finish', this.onTrackPlayerFinish);
      player.on('onPlay', this.onOnPlay);
      player.on('trackError', this.onTrackError);
      player.on('trackLoaded', this.onTrackLoaded);

      // ChromeCast specific events
    },

    // Remove events from the currentPlayer. This is useful when switching
    // concrete players (e.g., SM -> YT) since the concrete players have
    // the possibility of firing off events even when they're not active.
    //
    // An example is when the YTTrackPlayer calls stop() on the YT.Player object.
    // The YT.Player object will fire off several state change events which
    // are then bubbled up to the TrackPlayer class causing unintended events
    // to fire.
    unbindEvents: function(player) {
      if (player) {
        player.off();
      }
    },

    onEverySecond: function(positionInSec, durationInSec) {
      this.currentPositionInMs = positionInSec * 1000;
      // console.log('onEverySecond', positionInSec);
      this.trigger('everySecond', positionInSec, durationInSec);
    },

    on30Seconds: function() {
      this.trigger('seconds:30');
    },

    onListen: function() {
      this.trigger('onListen');
    },

    onTrackPlayerPlay: function() {
      console.log('onTrackPlayerPlay');
      if (this.isSoundManager()) {
        TRAX.windowIsPlaying();
      }
      this.trigger('play');
    },

    onTrackPlayerStop: function() {
      this.trigger('stop');
    },

    onTrackPlayerResume: function() {
      console.log('onTrackPlayerResume');
      this.trigger('resume');
    },

    onTrackPlayerPause: function() {
      this.trigger('pause');
    },

    onTrackPlayerSeekToFinished: function() {
      this.trigger('seekToFinished');
    },

    onTrackPlayerMute: function() {
      this.trigger('mute');
    },

    onTrackPlayerUnmute: function() {
      this.trigger('unmute');
    },

    onTrackPlayerFinish: function() {
      console.log('onTrackPlayerFinish');
      this.trigger('finish');
    },

    onOnPlay: function() {
      this.trigger('onPlay');
    },

    onTrackError: function(track) {
      this.trigger('trackError', track);
    },

    onTrackLoaded: function(player) {
      var newTrackLoaded = !this.oldTrack || this.oldTrack.id != this.newTrack.id;
      this.oldTrack = this.newTrack;

      // There is a possbility that if the user starts playing in the YT player
      // and the YT player triggers an error before trigginer the trackLoaded
      // event, there's a race condition that happens between the SMTrackPlayer
      // and YTTrackPlayer on who calls trackLoaded first. This check ensures
      // that the current player is the only one that triggers the event and
      // not both players.
      if (player == this.currentPlayer) {
        this.trigger('trackLoaded', newTrackLoaded);
      }
    },

  });

  return TrackPlayer;
});

define('collections/mixes',['collections/_base_collection', 'models/mix'], function(BaseCollection, Mix) {

  if (typeof App.Collections.Mixes !== 'undefined') {
    return App.Collections.Mixes;
  }

  var Mixes = BaseCollection.extend({
    model: Mix
  });

  App.Collections.Mixes = new Mixes();
  return App.Collections.Mixes;
});

define(
  'lib/player/mix_player',['global_trax', 'jquery.class', 'lib/player/track_player', 'lib/client_storage', 'lib/events',
   'lib/jsonh.jquery', 'collections/tracks', 'collections/mixes', 'lib/cast_sender'],
  function(TRAX, Class, TrackPlayer, ClientStorage, Events,
           JSONH, tracksCollection, mixesCollection, cast) {
             
  AUDIO_AD_FREQUENCY  = 4; //number of tracks between audio ad breaks
  AUDIO_AD_POD_SIZE = 2;   //number of ads per ad break aka pod

  var MixPlayer = Class.extend({
    // Triggers: play, pause, resume, next, skip
    initialize: function(options) {
      // make global
      TRAX.mixPlayer = this;
      _.extend(this, Backbone.Events);
      _.bindAll(
        this,
        'doneLoading', 'play', 'pause', 'next', 'skip', 'fadeOut', 'fadeIn', 'onListen',
        'on30sec', 'onPlay', 'onEverySecond', 'reportTrackError', 'onTrackPlayerResume',
        'onTrackPlayerPause', 'onTrackLoaded', 'onFinish', 'launchCast', 'onCastConnected',
        'stopCasting', 'showNextMixView', 'nextTrack', 'skipTrack', 'audioAdComplete'
      );

      this.mix     =  options.mix;
      this.smart_id = options.smart_id;
      this.mixPlayerView = options.mixPlayerView;
      this.started = false;
      this.playing = false;
      this.loading = false;
      this.casting = false;

      this.track = null;
      this.firstPlay = true;

      this.initTrackPlayer(options);
      this.setVolume(ClientStorage.get('vol') || 80);
      
      this.mixPlayerView.on('audioAdComplete', this.audioAdComplete);
    },

    startLoading: function() {
      this.loading = true;
      this.trigger('startLoading');
    },

    doneLoading: function() {
      this.loading = false;
      this.trigger('doneLoading');
    },


    initTrackPlayer: function(options) {
      this.trackPlayer = new TrackPlayer({ soundManager: options.soundManager || soundManager });

      this.trackPlayer.bind('everySecond', this.onEverySecond);
      this.trackPlayer.bind('onPlay',      this.onPlay); // TODO Rename
      this.trackPlayer.bind('onListen',   this.onListen);
      this.trackPlayer.bind('seconds:30',  this.on30sec);
      this.trackPlayer.bind('trackError',  this.reportTrackError);
      this.trackPlayer.bind('pause',       this.onTrackPlayerPause);
      this.trackPlayer.bind('resume',      this.onTrackPlayerResume);
      this.trackPlayer.bind('seekToFinished', this.doneLoading);
      this.trackPlayer.bind('finish',         this.onFinish);
      this.trackPlayer.bind('trackLoaded',    this.onTrackLoaded);
    },

    // callback for TrackPlayer when play is started (can be either from play or
    // resume.
    onPlay: function() {
      console.log('mixPlayer onPlay')
      this.playing = true;
      this.trigger('smPlay');
      this.doneLoading();

      var pos = this.getPositionFromCookie();
      if (pos) {
        this.startLoading();
        this.trackPlayer.mute();
        if (pos > (this.track.get('report_delay_s') || 30) * 1000) {
          // already reported before
          this.startReported = true;
          this.playReported = true;
        }
        this.trackPlayer.seekTo(pos);
      }

      this.updateTitle();
    },

    onEverySecond: function(positionInSec, durationInSec) {
      this.whilePlaying(positionInSec, durationInSec);
    },

    onTrackPlayerPause: function() {
      if (!this.switchingPlayer) {
        this.playing = false;
        this.trigger('pause');

        this.updateTitle();
      }
    },

    onTrackPlayerResume: function() {
      if (!this.switchingPlayer) {
        this.playing = true;
        this.trigger('resume');
        this.updateTitle();
      }
    },

    updateTitle: function() {
      if (this.playing && !document.title.match(/^►/)) {
        document.title = '► ' + document.title;
      } else if (!this.playing && document.title.match(/^►/)) {
        document.title = document.title.replace('► ', '');
      }
    },

    play: function(playType) {
      console.log('MixPlayer.play()', playType);
      this.started = true;

      if (this.trackPlayer.isSoundManager()) {
        TRAX.windowIsPlaying();
      }

      if (this.trackPlayer.isTrackLoaded() && this.trackPlayer.isPaused()) {
        this.resume();
        //this.setsAPI('resume');
      } else if (this.trackPlayer.isTrackLoaded() && this.trackPlayer.isPlaying()) {
        this.pause();
        this.setsAPI('pause');
      } else {
        console.log('about to setsApi(play)');
        this.setsAPI('play', _.bind(function(json){
          if (json.smart_id) {
            // Sync with what the server is using
            this.smart_id = json.smart_id;
          }
        }, this), playType);
      }

      Events.startMix(this.mix, playType);
    },

    pause: function() {
      this.trackPlayer.pause();
      //this.setsAPI('pause');
    },

    toggle: function() {
      if (this.playing) {
        this.pause();
      } else {
        this.play();
      }
    },

    // fades outs smSound volume to 0
    fadeOut: function(callback, sID) {
      this.fadingOut = true;
      this.trackPlayer.fadeOut(callback, sID);
    },

    // brings back smSound volume to soundManager.defaultOptions.volume
    fadeIn: function() {
      this.fadingOut = false;
      this.trackPlayer.fadeIn();
    },


    resume: function() {
      this.trigger('resume');
      this.setsAPI('resume');

      if (this.fadingOut) {
        this.fadeIn();
      } else {
        this.trackPlayer.resume();
      }
    },

    onFinish: function() {
      this.trigger('finish');
      //verticalmass
      if (typeof(IDENTITY) == 'function') {
        IDENTITY('track', 'Completed Song', {
          artist: this.track.get('performer'), 
          track: this.track.get('name'),
          genre: this.mix.get('genres')[0] || this.mix.get('tag_list_cache').split(', ')[0],
          id: this.track.id
        });
      }
    },

    next: function() {      
      if (this.set && this.set.after_end) {
        this.timeForNextMix();
      } else if (this.track && this.track.get('sponsored')) {
        //track is likely an audio ad, let the callback work when the block is complete instead of calling next now
      } else {
        if (this.showAudioAd(this.nextTrack)) return; //show audio ad, then call back into this function
        this.nextTrack();
      }
    },
    
    nextTrack : function(){
      this.setsAPI('next');
    },

    skip: function() {
      if (!this.set) {
        this.playNextMix('go_button');
        return false;
      }

      //feature.fm
      if (this.set.after_end) {
        this.pause();
        this.timeForNextMix();
      } else {
        try {
          //DON'T play ads on skips (MJC 8/28/2018)
          var positionInSec = this.trackPlayer.currentPositionInMs / 1000;
          if (positionInSec < 60) {
            this.skipTrack();
          } else {
            //show audio ad, then call back into this function
            if (this.showAudioAd(this.skipTrack)) return;
            this.skipTrack(); 
          }
        } catch (e) {
          this.skipTrack();
        }
      }
    },
    
    skipTrack : function(){
      try {
        var positionInSec = this.trackPlayer.currentPositionInMs / 1000;
        TraxEvents.track('skip', { mix_id : this.mix.id, position : positionInSec });
      } catch(e) {
      }
      this.setsAPI('skip');
    },

    // Copy/Paste from PreviewPlayer
    setVolume: function(level) {
      if (level > 100) level = 100;
      if (level <= 0 ) level = 0;

      this.trackPlayer.setGlobalVolume(level);
      this.trackPlayer.setVolume(level);

      ClientStorage.set('vol', level);
    },

    // action can be: play, skip, next, report, next_mix
    setsAPI: function(action, callback, playType) {
      if (!this.checkPlayableAndCookies()) { return false; }

      this.trigger(action);

      if (_.indexOf(['pause', 'resume', 'report', 'track_started'], action) === -1) {
        this.startLoading();
      }

      this.withToken(_.bind(function() {

        JSONH.now_with_context('/sets/' + this.playToken + '/' + action, this.setsParams(action, playType), this, function(json) {
          if (json.success) {
            if (_.isFunction(callback)) { callback(json); }

            if (_.indexOf(['report', 'next_mix', 'track_started'], action) >= 0) {
              return;
            }

            if (json.set) {
              if (json.notices && json.set.track && json.set.track.full_length == false) {
                json.set.track.sample_notice = json.notices;
                json.notices = false;
              }

              this.updateSetAndPlay(json.set);
            }
          } else {
            this.doneLoading();
          }

          // listening quota interruption
          if (json.listening_quota) {
            if (json.listening_quota.weekly_quota_reached && json.status == 200) {
              //skip quota message when listening to own mixes
            } else {
              this.renderQuotaInterruption(json.listening_quota);
            }
          }

          if (json.notices) {
            options = {};
            // This is nasty and FRAGILE.
            if (json.notices.match('allow more than one listen')) {
              options.timeout = 15000;
              options.callback = _.bind(function() {
                this.pause();
                this.timeForNextMix();
              }, this);
            } else if (json.notices.match('license')) {
              this.trigger('skip_not_allowed');
            } else if (json.notices.match(/international|region/)) {
              this.trigger('regional_blocking');
              return false;
            }

            this.trigger('dmcaWarning', json.notices, options);
          }
        }, { spinner: false, with_lock: true, ignore_flash: true });
      }, this));
    },

    renderQuotaInterruption : function(listening_quota) {
      var quota_weekly_hours_used_percent =
            listening_quota.weekly_hours_quota_used / listening_quota.weekly_hours_quota;

      if (listening_quota.weekly_quota_reached) {
        var variation = "quota_reached";
      } else if(quota_weekly_hours_used_percent >= 0.8) {
        var variation = "quota_low";
      } else {
        return false;
      }

      if (TRAX.currentUser && TRAX.currentUser.get('subscribed')) return false;
        
      require(['views/quota_interruption_view'], function(QuotaInterruptionView) {
        App.views.quotaInterruptionView = new QuotaInterruptionView({
            listening_quota: listening_quota,
            variation: variation
          }).show();
      }, this);
    },

    unloadTrack : function() {
      if (this.track) {
        this.track.trigger('stopped');
        this.track = null;
      }

      this.startReported = false;
      this.playReported = false;

      this.trackPlayer.stop();
      this.trackPlayer.unload();
    },

    updateSetAndPlay: function(setAttr) {
      this.unloadTrack();
      this.set = setAttr;
      this.track = tracksCollection.load(setAttr.track); // may not contain a track

      if (this.set.at_beginning) {
        this.trigger('atMixBeginning');
      }

      if (this.set.at_end) {
        this.playing = false;
        this.timeForNextMix();
        this.trigger('atMixEnd');
      }

      if (this.set.at_last_track) {
        this.trigger('atMixLastTrack');
      }

      if (this.track) {
        this.trackPlayer.load(this.track);
        this.trackPlayer.play(); //keep .play() call within initial touch event/callback for mobile devices
        this.track.trigger('playing');

        if (this.track.get('track_file_stream_url').match(/feature\.fm/)) {
          this.mixPlayerView.loadFeatureFmTracking(this.track);
        }
      }
    },

    onTrackLoaded: function(isNewTrack) {
      if (isNewTrack) {
        Events.playTrack(this.track, this.mix);
        if (this.track && !this.track.get('sponsored')) { //don't include ads in the tracklist
          this.mix.tracksPlayed.push(this.track);
        }
        this.trigger('trackPlay', { track: this.track });
        //this.track.trigger('playing');
      }

      // if (App.cast.isResumingSession()) {
      //   App.cast.sessionResumed();
      // } else {
        this.trackPlayer.play();
      // }
      
      //verticalmass
      if (typeof(IDENTITY) == 'function') {
        IDENTITY('track', 'Played Song', {
          artist: this.track.get('performer'), 
          track: this.track.get('name'),
          genre: this.mix.get('genres')[0] || this.mix.get('tag_list_cache').split(', ')[0],
          id: this.track.id
        });
      }
    },

    switchToChromeCastPlayer: function(options) {
      console.log('switchToChromeCastPlayer', options);
      options = options || {};

      this.switchingPlayer = true;
      var wasPlaying = this.trackPlayer.isPlaying() || options.play;
      this.trackPlayer.pause();
      this.trackPlayer.switchPlayer("chromecast");

      this.switchingPlayer = false;
      this.trigger('switchedToChromeCast');
      this.trackPlayer.load(this.track);
    },

    switchToSoundManagerPlayer: function(options) {
      console.log('switchToSoundManagerPlayer', options);
      options = options || {};

      this.switchingPlayer = true;
      var wasPlaying = this.trackPlayer.isPlaying() || options.play;

      this.trackPlayer.pause();

      this.trackPlayer.switchPlayer("soundManager");
      this.trackPlayer.loadTrackIfNecessary(this.track, wasPlaying);

      this.switchingPlayer = false;
      this.trigger('switchedToSoundManager', {reason: options.reason});
    },

    revertToSoundManagerTemporarily: function(options) {
      this.switchToSoundManagerPlayer({play: true, reason: options.reason});
    },

    // called once a second
    whilePlaying: function(positionInSec, durationInSec) {
      this.trigger('whilePlaying', positionInSec, durationInSec);

      ClientStorage.set('m' + this.mix.id, this.trackPlayer.id() + '-' + (positionInSec*1000));
    },

    // returned in ms
    getPositionFromCookie: function() {
      var c = ClientStorage.get('m' + this.mix.id);

      if (c && this.trackPlayer.isTrackLoaded()) {
        // cookie name is the mix id
        // cookie value is the SM Sound ID and position in ms
        // example: '12345' -> 't8559-45'
        var arr = c.split('-');
        if (arr[0] == this.trackPlayer.id()) {
          return arr[1];
        }
      }

      return false;
    },

    onListen: function() {
      console.log('listening!')
      if (TRAX.currentUser && TRAX.currentUser.get('connected_facebook_user') && TRAX.currentUser.get('connected_facebook_user').post_listens) {
        if (!this.startReported) {
          this.startReported = true;
          this.setsAPI('track_started');
        }
      }
      if (!this.playReported) {
        this.playReported = true;
        if (this.track && !this.track.get('sponsored')) {
          this.setsAPI('report');
          Events.reportTrack(this.track, this.mix);
          console.log('reporting play at ' + this.trackPlayer.currentPositionInMs / 1000 + ' seconds');
        }
      }
    },

    on30sec: function() {
      if (!this.track.get('full_length')) {
        this.fadeOut();
        this.next();
      }
    },

    isPlaying: function() {
      return this.playing;
    },

    withToken: function(callback) {
      if (!(this.playToken || this.loadTokenFromCookie())) {
        JSONH.now_with_context('/sets/new', this, function(json) {
          if (json.success) {
            this.saveNewToken(json.play_token);
            callback();
          }
        }, { spinner: false });

      } else {
        callback();
      }
    },


    saveNewToken: function(playToken) {
      this.playToken = playToken;
      cookie.set('play_token', playToken);
    },


    loadTokenFromCookie: function() {
      var c = cookie.get('play_token');

      if (c && c != 'null' && c != 'undefined') {
        this.playToken = c;
      } else {
        // generate random number
        c = parseInt(Math.random()*1000000000,0);
        this.saveNewToken(c);
      }
      return c;
    },


    setsParams: function(action, playType) {
      var params = {
        player: this.currentlyPlayingWith(),
        include : 'track[faved+annotation+artist_details]',
      };

      var playTypes = {
        click : 'mix_start_click',
        quick : 'mix_start_click',
        auto  : 'mix_start_click',
        skip_mix   : 'skip_mix',
        end_of_mix : 'end_of_mix',
        go_button  : 'end_of_mix'
      }

      playTypeReport = playTypes[playType];


      if (playTypeReport) {
        if (this.firstPlay && playTypeReport == 'mix_start_click') {
          playTypeReport = 'first_mix_start_click'
          this.firstPlay = false;
        }

        params['play_type'] = playTypeReport;
      }

      if (action == 'next_mix') {
        params['include'] += ',user,mix_set';
      }

      if (this.mix) { params['mix_id']   = this.mix.id;   }

      // Only send smart_id on play and if the user initiated the play. auto
      // play or skip mix doesn't count.
      if (action == "play" && playTypeReport == "mix_start_click" || playTypeReport == "first_mix_start_click") {
        params['smart_id'] = this.smart_id;
      }

      if (this.track) { params['track_id'] = this.track.id; }

      return params;
    },

    // Remi hack
    currentlyPlayingWith: function() {
      return 'sm';
    },

    cookiesRequired: function() {
      if (window != parent) {
        // dont require cookies if inside a frame (like on stumbleupon)
        return false;
      }
      return App.env == 'production';
    },

    checkPlayableAndCookies: function() {
      if (!this.mix && !this.track) {
        TRAX.show_flash_error("A track_id or mix_id need to be set.");
        return false;
      }

      if (this.cookiesRequired() && !(cookie.enabled())) {
        TRAX.show_flash_error('Sorry, but you must <a href="http://www.google.com/cookies.html" rel="external">allow browser cookies</a> to play mixes on 8tracks.');
        return false;
      }

      return true;
    },

    reportTrackError: function(track) {
      track.set('unplayable', true);

      JSONH.now(
        '/tracks/' + track.id + '/report_error',
        {
          'stream_url' : track.get('track_file_stream_url'),
          'internet_connection' : navigator.onLine
        },
        _.bind(function(json) {
          // Wait a bit before calling next()
          _.delay(_.bind(function(){ this.next(); }, this), 1500);
        }, this)
      );
    },


    // NEXT MIX STUFF // // // // // // // // // // // // // //

    timeForNextMix: function(skip_feature_fm, skip_ad) {
      if (App.Trax.showAds() && this.set && !this.set.after_end && !skip_feature_fm) {
        return this.mixPlayerView.playFeatureFmTrack();
      }
      
      if (WEB_SETTINGS['interrupted_playback']) {
        App.Sessions.tryToSetCurrentUserFromBackend(this.showNextMixView);
      } else {
        this.showNextMixView()
      }
    },


    showNextMixView : function(){  
      this.setsAPI('next_mix', _.bind(function(json) {
        this.nextMix = mixesCollection.load(json.next_mix);

        // let the server tell us what the smart id is
        this.smart_id = json.smart_id

        require(['views/next_mix_view'], _.bind(function(NextMixView) {
          this.doneLoading();
          this.nextMixView = new NextMixView({
            nextMix: this.nextMix,
            mixPlayer: this
          });
          var skipInterruption = true; //with audio ads in place, don't interrupt between mixes for 8tracks plus prompt
          this.nextMixView.show(skipInterruption);
        }, this));

      }, this));

      return false;
    },

    skipMix: function() {
      Events.skipMix();

      this.setsAPI('skip_mix', _.bind(function(json) {
        this.nextMix = mixesCollection.load(json.next_mix);
        this.smart_id = json.smart_id;
        this.goToNextMix('skip_mix');
      }, this));
    },

    playNextMix: function(source) {
      this.fadeOut(this.unloadTrack());

      if (this.nextMix) {
        Events.playNextMix(source);
        this.goToNextMix(source);
      } else {
        this.setsAPI('next_mix', _.bind(function(json) {
          // console.log('next_mix callback', source);
          this.nextMix = mixesCollection.load(json.next_mix);
          this.smart_id = json.smart_id;
          this.playNextMix(source);
        }, this));
      }

      return;
    },

    goToNextMix : function(source){
      this.mix = this.nextMix;
      this.nextMix = null;
      this.trigger('nextMix', source);
    },

    launchCast: function() {
      this.on('connected', this.onCastConnected)
      cast.launchChromecastApp(this);
    },

    stopCasting: function() {
      cast.stopCasting();
      this.switchToSoundManagerPlayer();
    },

    onCastConnected: function() {
      console.log("Connected to chromecast");
      this.switchToChromeCastPlayer();
    },
    
    showAudioAd(callback, force) {
      var track_sponsored = (this.track && this.track.get('sponsored')); //don't call ads or increment counter for tracks that ARE ads
      if (this.mix.id == 8832562 || this.mix.id == 8832551 || this.mix.id == 8834068) return false;
      if (force || this.mix.id == 746512 || (App.Trax.showAds() && !track_sponsored && ClientStorage.increment('tracks_since_last_ad') >= AUDIO_AD_FREQUENCY)) {
        this.audioAdCallback = callback;
        this.mixPlayerView.showAudioAd(AUDIO_AD_POD_SIZE);
        ClientStorage.set('tracks_since_last_ad', 0);
        return true;
      }
      return false;
    },
    
    audioAdComplete : function(){
      this.audioAdCallback.call();
      this.audioAdCallback = null;
      App.views.adsView.showStickyAd();
    },

  });

  return MixPlayer;
});

// 8tracks patched version of Hogan.js 2.0.0
// adds support for lambdas with block access in precompiled templates
// PLUS require-js style AMD wrapper from hgn.js
// Revision author: Matthew Cieplak (matthew@8tracks.com)

define('hogan',['require','exports','module'],function(require, exports, module){

// START WRAPPED CODE
// ===========================================================================


/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */



var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];
      var func, offset;

      if (typeof tail == 'function') {
        func = tail;
        offset = this.buf.length;
      }

      if (!isArray(tail)) {
        section(context, partials, this);

        if (func){
          //evaluated block is now at the end of the buffer
          //substr it off for use as argument
          var arg = this.buf.substr(offset);
          this.buf = this.buf.substr(0, offset);

          // 8tracks
          // use the most recent context rather than the root
          // by assuming it's the last non-function value in context[]
          bunc = this.binderator(func, context[context.length-2]);
          this.b(bunc(arg));
        }

        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    binderator : function(func, context) {
      var nativeBind = Function.prototype.bind;
      if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, Array.prototype.slice.call(arguments, 1));
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      var func;
      if (typeof val == 'function') {
        val = this.ms(val, ctx, partials);
        if (typeof val == 'function') {
          func = val;
        }
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        if (func) {
          ctx.push(func);
        } else {
          ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
        }
      }

      return pass;
    },

    ms: function(func, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      return func.call(cx);
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val) {//} && (typeof val == 'object' && names[i] in val) || (typeof val.hasFunction[names[i]])) {
          cx = val;
          if (typeof(val[names[i]]) == 'function') {
            val = val[names[i]]();
          } else {
            val = val[names[i]] || '';
          }
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options || {};
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);

////////////




(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      tagTypes = {
        '#': 1, '^': 2, '/': 3,  '!': 4, '>': 5,
        '<': 6, '=': 7, '_v': 8, '{': 9, '&': 10
      };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push(new String(buf));
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) ||
          (!tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (!tokens[j].tag) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = tagTypes[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - ctag.length : i + otag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        token = null;

    while (tokens.length > 0) {
      token = tokens.shift();
      if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
        instructions.push(token);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else {
        instructions.push(token);
      }
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  Hogan.generate = function (tree, text, options) {
    var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
    if (options.asString) {
      return 'function(c,p,i){' + code + ';}';
    }

    return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function walk(tree) {
    var code = '';
    for (var i = 0, l = tree.length; i < l; i++) {
      var tag = tree[i].tag;
      if (tag == '#') {
        code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n),
                        tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
      } else if (tag == '^') {
        code += invertedSection(tree[i].nodes, tree[i].n,
                                chooseMethod(tree[i].n));
      } else if (tag == '<' || tag == '>') {
        code += partial(tree[i]);
      } else if (tag == '{' || tag == '&') {
        code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag == '\n') {
        code += text('"\\n"' + (tree.length-1 == i ? '' : ' + i'));
      } else if (tag == '_v') {
        code += variable(tree[i].n, chooseMethod(tree[i].n));
      } else if (tag === undefined) {
        code += text('"' + esc(tree[i]) + '"');
      }
    }
    return code;
  }

  function section(nodes, id, method, start, end, tags) {
    return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' +
           'c,p,0,' + start + ',' + end + ',"' + tags + '")){' +
           '_.rs(c,p,' +
           'function(c,p,_){' +
           walk(nodes) +
           '});c.pop();}';
  }

  function invertedSection(nodes, id, method) {
    return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' +
           walk(nodes) +
           '};';
  }

  function partial(tok) {
    return '_.b(_.rp("' +  esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
  }

  function tripleStache(id, method) {
    return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function variable(id, method) {
    return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
  }

  function text(id) {
    return '_.b(' + id + ');';
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  },

  Hogan.cache = {};

  Hogan.compile = function(text, options) {
    // options
    //
    // asString: false (default)
    //
    // sectionTags: [{o: '_foo', c: 'foo'}]
    // An array of object with o and c fields that indicate names for custom
    // section tags. The example above allows parsing of {{_foo}}{{/foo}}.
    //
    // delimiters: A string that overrides the default delimiters.
    // Example: "<% %>"
    //
    options = options || {};

    var key = text + '||' + !!options.asString;

    var t = this.cache[key];

    if (t) {
      return t;
    }

    t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = t;
  };
})(typeof exports !== 'undefined' ? exports : Hogan);



// END WRAPPED CODE
// ===========================================================================
});

/**
 * @license RequireJS text 2.0.0 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */


define('text',['module'], function (module) {
    'use strict';

    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = module.config(),
        text, fs;

    text = {
        version: '2.0.0',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r");
        },

        createXhr: function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i++) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var strip = false, index = name.indexOf("."),
                modName = name.substring(0, index),
                ext = name.substring(index + 1, name.length);

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                strip = strip === "strip";
                ext = ext.substring(0, index);
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var match = text.xdRegExp.exec(url),
                uProtocol, uHostName, uPort;
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName === hostname) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + '.' +
                                     parsed.ext) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (typeof process !== "undefined" &&
             process.versions &&
             !!process.versions.node) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (text.createXhr()) {
        text.get = function (url, callback, errback) {
            var xhr = text.createXhr();
            xhr.open('GET', url, true);

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (typeof Packages !== 'undefined') {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                stringBuffer, line,
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});

/**@license
 * RequireJS Hogan Plugin | v0.2.0 (2012/06/29)
 * Author: Miller Medeiros | MIT License
 */

define('hgn',['hogan', 'text'], function (hogan, text) {

    var DEFAULT_EXTENSION = '.mustache';

    var _buildMap = {};
    var _buildTemplateText = 'define("{{pluginName}}!{{moduleName}}", ["hogan"], function(hogan){'+
                             '  var tmpl = new hogan.Template({{{fn}}}, "", hogan, {});'+
                             // need to use apply to bind the proper scope.
                             '  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;'+
                             '});\n';
    var _buildTemplate;


    function load(name, req, onLoad, config){
        var hgnConfig = config.hgn || {};
        var fileName = name;
        fileName += hgnConfig && hgnConfig.templateExtension != null? hgnConfig.templateExtension : DEFAULT_EXTENSION;

        // load text files with text plugin
        text.get(req.toUrl(fileName), function(data){
            var compilationOptions = hgnConfig.compilationOptions? mixIn({}, hgnConfig.compilationOptions) : {};

            if (config.isBuild) {
                // store compiled function if build
                // and should always be a string
                compilationOptions.asString = true;
                _buildMap[name] = hogan.compile(data, compilationOptions);
            }

            // maybe it's required by some other plugin during build
            // so return the compiled template even during build
            var template = hogan.compile(data, compilationOptions);
            var render = bind(template.render, template);
            // add text property for debugging if needed.
            // it's important to notice that this value won't be available
            // after build.
            render.text = template.text;
            render.template = template;
            // return just the render method so it's easier to use
            onLoad( render );
        });
    }

    function bind(fn, context) {
        return function(){
            return fn.apply(context, arguments);
        };
    }

    function mixIn(target, source) {
        var key;
        for (key in source){
            if ( Object.prototype.hasOwnProperty.call(source, key) ) {
                target[key] = source[key];
            }
        }
        return target;
    }

    function write(pluginName, moduleName, writeModule){
        if(moduleName in _buildMap){
            if (! _buildTemplate) {
                // using templates to generate compiled templates, so meta :P
                _buildTemplate = hogan.compile( _buildTemplateText );
            }
            var fn = _buildMap[moduleName];
            writeModule( _buildTemplate.render({
                pluginName : pluginName,
                moduleName : moduleName,
                fn : fn
            }) );
        }
    }

    return {
        load : load,
        write : write
    };

});


define("hgn!templates/tracks/_track_played", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"track_details_container ");if(_.s(_.f("sample_notice",c,p,1),c,p,0,54,71,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("tooltip_container");});c.pop();}_.b("\">");_.b("\n" + i);if(_.s(_.f("sample_notice",c,p,1),c,p,0,110,199,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<div class=\"black_tooltip black_tooltip_up sample_notice_tooltip\">");_.b(_.v(_.f("sample_notice",c,p,0)));_.b("</div>");});c.pop();}_.b("\n" + i);_.b("\n" + i);_.b("<a id=\"fav_");_.b(_.v(_.f("id",c,p,0)));_.b("\" href=\"/tracks/");_.b(_.v(_.f("id",c,p,0)));_.b("/toggle_fav\" rel=\"nofollow\" class=\"fav ");if(_.s(_.f("faved_by_current_user",c,p,1),c,p,0,323,331,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" active ");});c.pop();}if(!_.s(_.f("faved_by_current_user",c,p,1),c,p,1,0,0,"")){_.b(" inactive ");};_.b("\" data-method=\"post\" data-track_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" title=\"Add this track to your favorites\">");_.b("\n" + i);_.b("  <span class=\"i-favorite\"></span>");_.b("\n" + i);_.b("</a>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("onDemand",c,p,1),c,p,0,560,664,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <a href=\"#\" class=\"player\" title=\"Play ");_.b(_.v(_.f("name",c,p,0)));_.b(" by ");_.b(_.v(_.f("performer",c,p,0)));_.b("\"><span class=\"i i-play\"></span></a>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"title_container ");if(!_.s(_.f("full_length",c,p,1),c,p,1,0,0,"")){_.b("tooltip_container");};_.b("\">");_.b("\n" + i);_.b("  <div class=\"title_artist\">");_.b("\n" + i);_.b("    <span class=\"t\">");_.b(_.v(_.f("name",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    <span class=\"by_artist\">by</span>");_.b("\n" + i);_.b("    <span class=\"a\">");_.b(_.v(_.f("performer",c,p,0)));_.b("</span>");_.b("\n" + i);if(_.s(_.f("sample_notice",c,p,1),c,p,0,925,978,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <span class=\"sample_notice\">Sample</span>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div id=\"track_details_");_.b(_.v(_.f("id",c,p,0)));_.b("\" class=\"track_details\">");_.b("\n" + i);if(_.s(_.f("unavailable",c,p,1),c,p,0,1086,1161,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <p>Sorry, this track is unavailable in your location right now.</p>");_.b("\n");});c.pop();}_.b("  ");_.b("\n" + i);_.b("  <div class=\"amazon\">");_.b("\n" + i);if(_.s(_.f("onDemand",c,p,1),c,p,0,1221,1312,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <!--a href=\"#\" class=\"spotify_deeplink\" title=\"Listen on Spotify\">Spotify</a-->");_.b("\n");});c.pop();}if(!_.s(_.f("onDemand",c,p,1),c,p,1,0,0,"")){if(!_.s(_.f("buy_link_class",c,p,1),c,p,1,0,0,"")){_.b("        <a href=\"#\" class=\"yt\" title=\"Listen on YouTube\">YouTube</a> <span class=\"pipe\"> | </span>");_.b("\n");};_.b("      <a href=\"");_.b(_.v(_.f("buy_link",c,p,0)));_.b("\" title=\"Download\" rel=\"external\" target=\"_blank\" class=\"buy ");_.b(_.v(_.f("buy_link_class",c,p,0)));_.b("\">");_.b(_.v(_.f("buy_text",c,p,0)));_.b("</a>");_.b("\n");};_.b("    ");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"track_metadata\">");_.b("\n" + i);if(_.s(_.d("release_name.length.nonzero",c,p,1),c,p,0,1720,1860,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <div class=\"album\">");_.b("\n" + i);_.b("        <span class=\"label\">Album:</span> ");_.b("\n" + i);_.b("        <span class=\"detail\">");_.b(_.v(_.f("release_name",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("      </div>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("year",c,p,1),c,p,0,1907,2036,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <div class=\"year\">");_.b("\n" + i);_.b("        <span class=\"label\">Year:</span>");_.b("\n" + i);_.b("        <span class=\"detail\">");_.b(_.v(_.f("year",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("      </div>");_.b("\n");});c.pop();}_.b("    <div style=\"clear: both;\"></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("track_annotation",c,p,1),c,p,0,2116,2440,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <div class=\"track_annotation\">");_.b("\n" + i);_.b("      <div class=\"annotation_text\">");_.b("\n" + i);_.b("        <span class=\"i-annotation\"></span>");_.b("\n" + i);_.b("    ");_.b("\n" + i);if(_.s(_.f("text",c,p,1),c,p,0,2253,2281,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          ");_.b(_.v(_.f("text",c,p,0)));_.b("\n");});c.pop();}if(!_.s(_.f("text",c,p,1),c,p,1,0,0,"")){_.b("          ");_.b(_.v(_.f("track_annotation",c,p,0)));_.b("\n");};_.b("\n" + i);_.b("        <a href=\"#\" class=\"close\"><span class=\"i-x\"></span></a>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define('views/track_played_view',['views/trax_view', 'hgn!templates/tracks/_track_played', 'global_trax', 'lib/_template_helpers', 'views/_base_view'], 
  function(TraxView, template, TRAX, TplParams, BaseView) {

  var TrackPlayedView = TraxView.extend({
    tagName: 'li',
    className: 'track',

    initialize: function(options) {
      _.bindAll(this, 'scrollTitle', 'onFavToggle', 'onFavClick');

      this.track = options.track;
      this.mix   = options.mix;
      this.onDemand = options.onDemand;
      if (this.onDemand) { this.$el.addClass('onDemand') };

      this.template = template;
      this.track.on('change:name, change:performer, change:release_name, change:buy_url', this.render, this);
      this.$el = $(this.el);

      this.track.on('change:faved_by_current_user', this.onFavToggle, this);
      this.track.on('playing', this.isPlaying, this);
      this.track.on('stopped', this.isStopped, this);
      this.track.on('change:unplayable', this.onError, this);
    },

    events : {
      'click .yt' : 'onYoutubeClick',
      'click .fav' : 'onFavClick',
      'click .track_annotation .i-x' : 'hideAnnotation',
      'click .i-annotation' : 'showAnnotation',
      'click .player' : 'togglePlay',
      'click' : 'togglePlay'
    },

    isPlaying: function(value) {
      this.$el.addClass('now_playing open').siblings().removeClass('now_playing open');
      // this.$('.track_details').resetHeightByChildren();
    },

    isStopped : function(){
      this.$el.removeClass('now_playing open');
      // this.$('.track_details').height(0);
    },

    render: function(atts) {
      var json = this.track.toJSON();
      if(this.track.get('you_tube_status') != 'banned') {
        json.showYouTubeLink = true;
      } else {
        json.showYouTubeLink = false;
      }

      json.onDemand = this.onDemand;

      var tplParams = new TplParams(json);
      this.$el.html(this.template(tplParams));
      this.$titleArtist = this.$('.title_artist');
      this.$album       = this.$('.album');

      return this;
    },

    onFavToggle : function(){
      if (this.track.get('faved_by_current_user')) {
        this.$('.fav').addClass('active');
      } else {
        this.$('.fav').removeClass('active');
      }
    },

    onFavClick: function(event) {
      var options = {};
      if (!TRAX.currentUser) {
        options.success_callback = _.bind(function() {
          this.track.toggleFav(false, this.mix);
        }, this);
        TRAX.showSignupView(options);
        return false;
      }

      var $link = $(event.currentTarget);
      $link.addClass('just_clicked').hover(function(){ }, function(){ $link.removeClass('just_clicked'); });

      this.track.trigger('fav');
      if (this.track.get('sponsored')) {
        this.track.toggleFav(true, this.mix); // silently update UI
      } else {
        this.track.toggleFav(false, this.mix);
        TRAX.refreshSidebarAd();
      }
      return false;
    },

    onError: function(event) {
      this.$el.addClass('unplayable');
      this.$('.track_details').prepend('<p class="unplayable_warning"><span class="i-warning"></span>Oops! We\'re having a problem loading this track. \u2639</p>');
    },

    onYoutubeClick: function(event) {
      this.track.openYoutubePopup();
      return false;
    },

    togglePlay: function(event) {
      if (!this.onDemand) return;
      this.track.trigger('togglePlay', this.track);
      return false;
    },

    marquee : function() {
      this.titleContainerWidth = this.$('.title_container').width();
      this.titleWidth = this.$titleArtist.width();
      if (this.titleWidth > this.titleContainerWidth) {
        this.$titleArtist.append('<span class="gap"></span>' + this.$titleArtist.html());
        this.titleScroller = setTimeout(this.scrollTitle, 8000);
      }
    },


    scrollTitle : function(){
      //duplicate content for circular scroll
      this.$titleArtist.css({'left' : 0});
      this.$titleArtist.animate({'left' : (-28 - this.titleWidth) }, 15000, 'linear', _.bind(function(){
        this.titleScroller = setTimeout(this.scrollTitle, 8000);
      }, this));
    },

    hideAnnotation : function(){
      this.$('.track_annotation').slideUp();
    },

    showAnnotation : function(){
      this.$('.track_annotation').slideDown();
    }

  });

  return TrackPlayedView;
});


define("hgn!templates/mixes/mix_player", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"player_controls\" class=\"player_controls player_gray dark-bg\">");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"player_controls_left\">");_.b("\n" + i);_.b("    <div id=\"player_spinner\"><span class=\"spin\"></span></div>");_.b("\n" + i);_.b("    <div id=\"player_mix\" class=\"tooltip_container\"></div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div id=\"player_play_button\" class=\"player_button\" title=\"Play\"><span class=\"i-play\"></span></div>");_.b("\n" + i);_.b("    <div id=\"player_pause_button\" class=\"player_button\" title=\"Pause\" style=\"display:none\"><span class=\"i-pause\"></span></div>");_.b("\n" + i);_.b("    <div id=\"player_skip_button\" class=\"player_button\" title=\"Skip\"><span class=\"i-skip\"></span></div>");_.b("\n" + i);_.b("    <div id=\"next_mix_button\" class=\"player_button\" title=\"Next\" style=\"display: none;\"><span class=\"i-next\"></span></div>");_.b("\n" + i);_.b("    <div id=\"player_like_button\" class=\"mix_like ");if(_.s(_.f("liked_by_current_user",c,p,1),c,p,0,758,764,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("active");});c.pop();}_.b(" player_button\"><span class=\"i-like\"></span></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"player_progress_bar\" class=\"player_progress_bar player_gray\">");_.b("\n" + i);_.b("    <div id=\"player_progress_bar_meter\" class=\"player_progress_bar_meter\"/>");_.b("\n" + i);_.b("    <ul id=\"now_playing\"></ul>");_.b("\n" + i);_.b("    <div id=\"dmca_warnings\"></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"tracks_played\" style=\"display: none;\">");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"player_controls_right\">");_.b("\n" + i);_.b("    <div id=\"use_chromecast\" class=\"player_button\" href=\"#\" rel=\"local\" title=\"Chromecast\">");_.b("\n" + i);_.b("      <span class=\"i-chromecast\"></span>");_.b("\n" + i);_.b("      <span class=\"i-chromecast_active\"></span>");_.b("\n" + i);_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div id=\"volume_controls_container\">");_.b("\n" + i);_.b("      <div id=\"player_volume\" class=\"hi\">");_.b("\n" + i);_.b("        <span class=\"i-volume-hi\"></span>");_.b("\n" + i);_.b("        <span class=\"i-volume-med\"></span>");_.b("\n" + i);_.b("        <span class=\"i-volume-lo\"></span>");_.b("\n" + i);_.b("        <span class=\"i-volume-mute\"></span>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"clear: both;\"></div>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("  <div id=\"sticky_player_box\" style=\"display: none;\">");_.b("\n" + i);_.b("    <div class=\"cta\">");_.b("\n" + i);_.b("      <a href=\"#\" class=\"close_ad\"><span class=\"i-x\"></span></a>");_.b("\n" + i);_.b("      Prefer music without ads?");_.b("\n" + i);_.b("      <strong><a href=\"/plus\" class=\"blue upgrade_button\">Try 8tracks Plus!</a></strong>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    ");_.b("\n" + i);_.b("    <div id=\"sticky_player_ad\" data-size=\"engager\" data-slot-name=\"Web_Player_Sticky_Box\"></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"on_demand_popup_cta\" style=\"display: none;\">");_.b("\n" + i);_.b("    <a href=\"#\" class=\"close\"><span class=\"i-x\"></span></a> &nbsp;&nbsp;&nbsp;");_.b("\n" + i);_.b("    <strong>You're out of skips</strong> <!-- &nbsp;&nbsp;&nbsp; <a href=\"#\" class=\"on_demand_prompt flatbutton button_blue\" style=\"border: 1px solid #fff;\">Get unlimited</a> -->");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_player_mix_details", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");if(_.s(_.f("mix",c,p,1),c,p,0,8,177,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\">");_.b("\n" + i);_.b("    ");if(_.s(_.f("mix_cover_img",c,p,1),c,p,0,57,74,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq56, w=100&h=100");});c.pop();}_.b("\n" + i);_.b("    <span class=\"black_tooltip black_tooltip_up\">");_.b("\n" + i);_.b("      ");_.b(_.v(_.f("name",c,p,0)));_.b("\n" + i);_.b("    </span>");_.b("\n" + i);_.b("  </a>");_.b("\n");});c.pop();}return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/artists/_player_details", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"background-blur-container\">");_.b("\n" + i);_.b("  <canvas class=\"background-blur\" width=\"100%\" height=\"100%\" style=\"width: 100%; height: 100%; opacity: 0.0;\"></canvas> ");_.b("\n" + i);_.b("      ");_.b("\n" + i);_.b("<div class=\"artist_details_container\">");_.b("\n" + i);_.b(" <div class=\"container\">");_.b("\n" + i);_.b("  <div class=\"row\">");_.b("\n" + i);_.b("    <div class=\"col-md-8\">");_.b("\n" + i);_.b("      <a href=\"#\" id=\"close_artist_details\" class=\"icon-link\"><span class=\"i-close\"></span></a>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("image_url",c,p,1),c,p,0,396,684,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("        <div id=\"artist_photo\" class=\"col-xl-2 col-lg-3 col-md-4 col-xs-4\">");_.b("\n" + i);_.b("          <a href=\"");_.b(_.v(_.f("image_url",c,p,0)));_.b("\" target=\"_blank\">");_.b("\n" + i);_.b("              <a href=\"");_.b(_.v(_.f("image_url",c,p,0)));_.b("\">");_.b("\n" + i);_.b("                ");if(_.s(_.f("external_img",c,p,1),c,p,0,596,610,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("image_url, 120");});c.pop();}_.b("\n" + i);_.b("              </a>");_.b("\n" + i);_.b("          </a> ");_.b("\n" + i);_.b("        </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("      <div id=\"artist_details\" class=\"col-xl-10 col-lg-9 col-md-8 col-sm-8 col-xs-8\">");_.b("\n" + i);_.b("        <div id=\"artist_bio\">");_.b("\n" + i);_.b("          <h4>");_.b(_.v(_.f("name",c,p,0)));_.b("</h4>");_.b("\n" + i);_.b("          <p>");_.b(_.t(_.f("bio_intro",c,p,0)));_.b("</p>");_.b("\n" + i);_.b("          <p><a class=\"flag_bio\" href=\"/artists/flag_bio?source=");_.b(_.v(_.d("info_source.source",c,p,0)));_.b("&source_id=");_.b(_.v(_.d("info_source.id",c,p,0)));_.b("\"><span class=\"i-flag\"></span> Flag incorrect bio</a></p>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("    ");_.b("\n" + i);_.b("        <div class=\"\">");_.b("\n" + i);_.b("          <ul>");_.b("\n" + i);_.b("            <li>");_.b("\n" + i);_.b("              <a href=\"/explore/");_.b(_.v(_.d("name.to_url_param",c,p,0)));_.b("\">More playlists with <strong>");_.b(_.v(_.f("name",c,p,0)));_.b("</strong> &rarr;</a>");_.b("\n" + i);_.b("            </li>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.d("info_source.bio_source",c,p,1),c,p,0,1295,1704,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("              <li>");_.b("\n" + i);_.b("                <a href=\"");_.b(_.v(_.f("bio_url",c,p,0)));_.b("\" class=\"favicon_");_.b(_.v(_.d("info_source.bio_source",c,p,0)));_.b("\" target=\"_blank\" rel=\"external\">");_.b(_.v(_.f("name",c,p,0)));_.b(" on ");_.b(_.v(_.d("info_source.bio_source.capitalize",c,p,0)));_.b("</a>");_.b("\n" + i);_.b("              </li>");_.b("\n" + i);_.b("              <li>");_.b("\n" + i);_.b("                <a href=\"http://openaura.com/artist/");_.b(_.v(_.d("info_source.id",c,p,0)));_.b("\" class=\"favicon_openaura\" target=\"_blank\" rel=\"external\">Powered by OpenAura</a>");_.b("\n" + i);_.b("              </li>");_.b("\n");});c.pop();}if(!_.s(_.d("info_source.bio_source",c,p,1),c,p,1,0,0,"")){_.b("              <a href=\"");_.b(_.v(_.f("bio_url",c,p,0)));_.b("\" class=\"favicon_");_.b(_.v(_.d("info_source.source",c,p,0)));_.b("\" target=\"_blank\" rel=\"external\">");_.b(_.v(_.f("name",c,p,0)));_.b(" on ");_.b(_.v(_.d("info_source.source.capitalize",c,p,0)));_.b("</a>");_.b("\n");};_.b("          </ul>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div><!--.row-->");_.b("\n" + i);_.b(" </div><!--.container-->");_.b("\n" + i);_.b("</div><!--.artist_details_container-->");_.b("\n" + i);_.b("</div><!--.background-blur-container-->");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/promo_views/detector", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"preroll_container\">");_.b("\n" + i);_.b("  <div id=\"detector\">");_.b("\n" + i);_.b("    <div id=\"plea1\" class=\"plea\">");_.b("\n" + i);_.b("      <p><img src=\"/images/extras/boombox_tears.png\" width=\"250\" height=\"151\"></p>");_.b("\n" + i);_.b("\n" + i);_.b("      <h3>Adblock detected, 8tracks dejected</h3>");_.b("\n" + i);_.b("      <p>We’re working hard to make 8tracks the best place for people who love discovering music, but we can’t do it without your support. Please consider whitelisting us to help keep 8tracks alive and well. </p>");_.b("\n" + i);_.b("\n" + i);_.b("      <p><a class=\"whitelist flatbutton button_blue\" href=\"#\">OK, for you I'll whitelist</a></p>");_.b("\n" + i);_.b("      <p>⎼⎼⎼⎼⎼⎼⎼ or ⎼⎼⎼⎼⎼⎼⎼</p>");_.b("\n" + i);_.b("      <p>Get unlimited, ad-free listening with 8tracks Plus</p>");_.b("\n" + i);_.b("      <p><a class=\"flatbutton upgrade button_gradient\" href=\"/plus\">Start my free 14-day trial</a></p>");_.b("\n" + i);_.b("      <br />");_.b("\n" + i);_.b("      <p id=\"countdown\"><strong>Your playlist will start in <span id=\"countdown_timer\">");_.b(_.v(_.f("countdown_length",c,p,0)));_.b("</span> seconds.</strong></p>");_.b("\n" + i);_.b("      <p id=\"countdown_complete\" style=\"display: none;\">");_.b("\n" + i);_.b("        <!--strong>Your playlist is starting now...</strong>");_.b("\n" + i);_.b("        <br /><br /-->");_.b("\n" + i);_.b("        <a class=\"close_button flatbutton gray_button\" href=\"#\">Close</a>");_.b("\n" + i);_.b("      </p>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div id=\"whitelist\" style=\"display: none;\">");_.b("\n" + i);_.b("      <h4>Thank you for supporting us! </h4>");_.b("\n" + i);_.b("      <p>Here's how to turn off your ad-blocker. </p>");_.b("\n" + i);_.b("\n" + i);_.b("      <p><img src=\"/images/extras/adblock_instructions.gif\" width=\"250\" height=\"250\" /></p>");_.b("\n" + i);_.b("\n" + i);_.b("  	  <p><a href=\"#\" class=\"refresh flatbutton button_blue\">OK, let’s play some music!</a></p>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div id=\"thanks\" style=\"display: none;\">");_.b("\n" + i);_.b("      <h1>Thanks for whitelisting 8tracks!</h1>");_.b("\n" + i);_.b("\n" + i);_.b("      <p>You're helping us keep streaming and supporting your favorite artists.</p>");_.b("\n" + i);_.b("\n" + i);_.b("      <img src=\"/images/plus/IlloA.png\" width=\"250\" />");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define(
  'views/detector_view',['views/trax_view', 'hgn!templates/promo_views/detector', 'lib/client_storage'],
  function(TraxView, template, ClientStorage) {

var DetectorView = TraxView.extend({
  el     : '#preroll_container',

  events : {
    'click .whitelist' : 'onWhitelistClick',
    'click .refresh'   : 'onRefreshClick',
    'click .close_button' : 'onClose'
  },

  initialize: function(options) {
    this.mixPlayerView = options.parent;
    _.bindAll(this, 'countdownCallback', 'onCountdownComplete');
    this.countdownLength = -1;
    this.render();
  },

  render: function() {
    var tplParams = { countdown_length : this.countdownLength };
    this.$el.html(template(tplParams)).addClass('active');

    if (this.countdownLength > 0) {
      this.countdownTimer = setInterval(this.countdownCallback, 1000); //delayed playback
    } else if (this.countdownLength < 0) {
      this.$('#countdown').hide(); //no timer, no playback
    } else {
      _.defer(this.onCountdownComplete); //instant playback, no delay
    }

    ClientStorage.destroy('whitelist_attempt');
  },

  countdownCallback : function() {
    this.countdownLength += -1;
    if (this.countdownLength == 0) {
      this.onCountdownComplete();
      return;
    } else {
      this.$('#countdown_timer').text(this.countdownLength);
    }
  },

  onCountdownComplete : function(){
    clearTimeout(this.countdownTimer);
    this.$('#countdown').hide();
    this.$('#countdown_complete').show();
    this.trigger('complete');
  },

  onWhitelistClick : function(){
    this.$('.plea').hide();
    this.$('#whitelist').show();
    clearTimeout(this.countdownTimer);
  },

  onRefreshClick : function(){
    //events whitelist
    ClientStorage.set('whitelist_attempt', 1);
    window.location.assign(location.protocol + '//' + location.hostname + (location.port == 80 ? '' : ':'+location.port) + location.pathname + '?reload=1#play=1');
    return false;
  },

  // joinExperiment : function(){
  //   if (this.timer_variation == 'control') {
  //     this.countdownLength = 0;
  //   } else if (this.timer_variation == 'no_timer') {
  //     this.countdownLength = -1;
  //   } else {
  //     this.countdownLength = parseInt(this.timer_variation.split('_')[0]);
  //   }
  //   this.render();
  // },

  onClose : function(){
    this.$el.removeClass('active');
    clearTimeout(this.countdownTimer);
    //this.mixPlayerView.resume();
  }




  });

  return DetectorView;
});

(function($){

  $.fn.volume = function(options){

    options = $.extend({
            min: 0,
            max: 100,
            scale: 1,
            initialVolume: 70,
            orientation : 'y',
            curve   : 'lin',
            visible : false
    }, options);

    var self = this;
    var $el = $(this);
    var timer, open, active, zeroHeight;
    var useLog, useX = false;

    if (options.orientation == 'x') {
      useX = true;
    }

    if (options.curve == 'log') {
      useLog = true;
    }

    var visible = options.visible;

    $el.append('<div class="volume-container"><div class="volume-range"><div class="volume-selector"></div></div></div><div class="volume-mute"></div>');
    var $container = $el.children('.volume-container');
    var $range     = $container.children('.volume-range');
    var $selector  = $range.children('.volume-selector');
    var $player_volume = $el.children('#player_volume');
    var $mute      = $el.children('.volume-mute');
    var change = options.change;

    var min = options.min;
    var max = options.max;
    var maxPx = useX ? $range.width() : $range.height();
    var volume, lastNonZeroVolume;
    var rgb_player_volume = options.rgb_player_volume;

    //$container.css('background', options.rgb_volume_container);

    var setup = function(){
      $el.hover(onEnter, deactivate);
      $range.on('mousedown', onStart);
      $player_volume.on('click', onMute);
    };

    var onEnter = function(){
      open = true;
      clearTimeout(timer);
      $el.addClass('open');
    };

    var onStart = function(event){
      active = true;
      if (useX) {
        zeroHeight = $range.offset().left;// + maxPx;
      } else {
        zeroHeight = $range.offset().top + maxPx;
      }
      $(window).on('mousemove', onMove);
      $(window).on('mouseup', onStop);

      onMove(event);
      return false;
    };

    var onStop = function(){
      active = false;
      if (open) { //close if mouse left during movement
        deactivate();
      }

      $(window).unbind('mouseup mousemove');
    };

    var deactivate = function(){
      if (open && !active) {
        timer = setTimeout(hide, 800);
      }
    };

    var hide = function(){
      $el.removeClass('open');
      open = false;
    };


    var onMove = function(event){
      var volPx = useX ? volPx =  event.pageX - zeroHeight : zeroHeight - event.pageY;
      if (volPx < 0) volPx = 0;
      if (volPx > maxPx) volPx = maxPx;
      if (useX) $selector.width(volPx);
      else      $selector.height(volPx);

      if (useLog) {
        onVolumeChange(expVolume(volPx, maxPx));
      } else {
        onVolumeChange(linearVolume(volPx, maxPx));
      }
    };

    var linearVolume = function(volume, maxVolume) {
      return ((volume / maxVolume) * max) * options.scale;
    };

    var expVolume = function(linearVolume, maxVolume) {
      return (Math.pow(linearVolume, 3) / Math.pow(maxVolume, 3)) * maxVolume * options.scale;
    };

    var volumeExp = function(expVolume, maxVolume) {
      return Math.pow(expVolume, 1/3) / Math.pow(maxVolume, 1/3) * maxVolume * options.scale;
    };


    var onVolumeChange = function(vol){
      volume = vol;
      change(volume);
      detectMute();
    };

    var detectMute = function(){
      if (volume > 0) {
        lastNonZeroVolume = volume;
        if (volume < 33) {
          $player_volume.removeClass('hi med mute').addClass('lo');
        } else if (volume < 66) {
          $player_volume.removeClass('hi lo mute').addClass('med');
        } else {
          $player_volume.removeClass('med lo mute').addClass('hi');
        }
      } else {
        $player_volume.removeClass('hi med lo').addClass('mute');
      }
    };

    // SETS DISPLAY ONLY
    var setVolume = function(vol) {
      volume = vol;
      var newHeight;
      if (useLog) {
        newHeight = volumeExp(vol, maxPx) / options.scale;
      } else {
        newHeight = linearVolume(vol, maxPx) / options.scale;
      }
      //var newHeight = Math.round((vol / max) * maxPx, 10);

      if (useX) $selector.width(Math.floor(newHeight));
      else      $selector.height(Math.floor(newHeight));
      detectMute();
    };

    var onMute = function(){
      if (volume === 0) {
        onVolumeChange(lastNonZeroVolume);
        setVolume(lastNonZeroVolume);
      } else {
        onVolumeChange(0);
        setVolume(0);
      }
    };

    setVolume(options.initialVolume / options.scale);
    setup();
  };

})(jQuery);

define("jquery.volume", function(){});


define("hgn!templates/tracks/featurefm", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"feature_fm\">");_.b("\n" + i);if(_.s(_.f("song",c,p,1),c,p,0,33,1615,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <style>");_.b("\n" + i);_.b("  #player_artist_info_button.active:before{");_.b("\n" + i);_.b("    border-top: 10px solid #2a0066;");_.b("\n" + i);_.b("  }");_.b("\n" + i);_.b("  </style>");_.b("\n" + i);_.b("  <!--div class=\"background_blur\"></div-->");_.b("\n" + i);_.b("  <div class=\"container\">");_.b("\n" + i);_.b("    <div class=\"row\">    ");_.b("\n" + i);_.b("      <div id=\"artist_details\" class=\"col-sm-8 col-xs-12\">");_.b("\n" + i);_.b("        <div id=\"artist_photo\"><a href=\"");if(_.s(_.f("soundcloud_url",c,p,1),c,p,0,352,357,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.v(_.d(".",c,p,0)));});c.pop();}if(!_.s(_.f("soundcloud_url",c,p,1),c,p,1,0,0,"")){_.b(_.v(_.f("buy_url",c,p,0)));};_.b("\"><img width=\"120\" src=\"");_.b(_.v(_.f("albumart_url",c,p,0)));_.b("\" /></a></div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div id=\"artist_bio\">");_.b("\n" + i);_.b("          <strong style=\"font-size: 16px;\">");_.b(_.v(_.d("artist.name",c,p,0)));_.b("</strong><br />");_.b("\n" + i);_.b("          ");if(_.s(_.d("artist.bio",c,p,1),c,p,0,610,631,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<p>");_.b(_.v(_.d("artist.bio",c,p,0)));_.b("</p>");});c.pop();}_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"feature_links\">");_.b("\n" + i);_.b("          <div id=\"button-test\" class=\"feature-fm-action-buttons\" data-song-play-id=\"");_.b(_.v(_.f("song_play_id",c,p,0)));_.b("\"></div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      ");_.b("\n" + i);_.b("      <div class=\"col-sm-4 hidden-xs\">");_.b("\n" + i);_.b("        <p>");_.b("\n" + i);if(_.s(_.f("soundcloud_url",c,p,1),c,p,0,924,1093,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <a href=\"");_.b(_.v(_.f("soundcloud_url",c,p,0)));_.b("\" target=\"_blank\" rel=\"external\"><span class=\"favicon_soundcloud\"></span>Hear on <strong>Soundcloud</strong></a><br />");_.b("\n");});c.pop();}if(_.s(_.f("buy_song_url",c,p,1),c,p,0,1140,1263,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <a href=\"");_.b(_.v(_.f("buy_song_url",c,p,0)));_.b("\" target=\"_blank\" rel=\"external\"><strong>Buy now &rarr;</strong></a><br />");_.b("\n");});c.pop();}_.b("          <a href=\"");_.b(_.v(_.f("share_url",c,p,0)));_.b("\" target=\"_blank\" rel=\"external\">Hear on <strong>Feature.fm</strong></a><br />");_.b("\n" + i);_.b("        </p>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"feature_logo\">");_.b("\n" + i);_.b("          Promoted via <a href=\"http://feature.fm\" target=\"_blank\"><img src=\"/assets/logo/featurefm.png\" width=\"80\" /></a>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define(
  'views/feature_fm_view',['global_trax', 'views/trax_view', 'lib/jsonh.jquery', 'lib/client_storage', 'hgn!templates/tracks/featurefm', 'collections/tracks'],
  function(TRAX, TraxView, JSONH, ClientStorage, template, tracksCollection){
var FeatureFmView = TraxView.extend({
  //el: '#player_box',

  api_key :   ((true || App.env == 'production') ? 'a24448de641e8639c531b7cec403c1ef' : '90f22e245826f29f49318be820168c92'),
  scriptUrl : ((true || App.env == 'production') ? '//cdn.feature.fm/widgets/init.js' : '//cdn.staging.feature.fm/widgets/init.js'),


  events: {
    //'click .external_link' : 'onExternalLinkClick',
  },

  initialize: function(options) {
    _.bindAll(this, 'show', 'enableTracking', 'render', 'onEverySecond', 'onSkip', 'onFinish', 'onFav', 'getTrack', 'resolve', 'bindTrackEvents', 'onIframeClose');

    this.mixPlayer     = options.mixPlayer;
    this.mixPlayerView = options.mixPlayerView;
    this.token         = ClientStorage.get('feature_fm_token');
  },

  setup : function(callback){
    var scriptUrl = this.scriptUrl;
    try {
      window.featureFM = (function (d,s,id) {
       var t, js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
           js.src=scriptUrl; fjs.parentNode.insertBefore(js, fjs);
          return window.featureFM || (t = { _e: [], ready: function(f){ t._e.push(f) } });
      }(document, "script", "featurefm-widgets"));

      window.featureFM.ready = _.bind(callback);
    } catch(e) {
      this.onFinish();
    }

    $('head').append('<link rel="stylesheet" href="https://ds6y5vhqiduvy.cloudfront.net/__iframe-8tracks-banner.css">');
  },

  show : function(){
    if (!window.featureFM) {
      this.setup(this.show);
      return;
    }
    this.organic = false;
    featureFM.api.setApiKey(this.api_key);

    if (this.token) {
      featureFM.api.setConsumer(this.token);
      this.getTrack();
    } else {
      this.identify(this.getTrack);
    }
  },


  enableTracking : function(track){
    if (track) {
      this.track = track;
      this.organic = true;
    }

    if (!window.featureFM) {
      this.setup(this.enableTracking);
      return;
    }

    //this.song_play_id = featureFM.util.getSongPlayIdFromStreamURL(track.getStreamUrl());
    this.song_play_id = this.track.getStreamUrl().match(/\/([0-9a-f]+)\??|$/i)[1];

    featureFM.api.setApiKey(this.api_key);

    if (this.token) {
      featureFM.api.setConsumer(this.token);
      this.bindTrackEvents();
    } else {
      this.identify(this.bindTrackEvents);
    }
  },

  identify : function(callback) {
    var identifier, gender, dob_year;
    if (TRAX.currentUser) {
      identifier = TRAX.currentUser.get('id');
      gender = ({ M : 'male', F : 'female' })[TRAX.currentUser.get('gender')] || null;
      dob_year = App.Trax.currentUser.get('dob_year');
    }
    featureFM.api.registerNewConsumer(identifier, gender, dob_year,
      _.bind(function(err, json){
        if (!err) {
          this.token = json.consumer_token;
          ClientStorage.set('feature_fm_token', this.token);
          featureFM.api.setConsumer(this.token);
          callback.call();
        } else {
          console.log(json.message);
          return false;
        }
      }, this), { type : 'POST' }
    );
  },

  getTrack : function(){
    var all_tags = _.union(this.mixPlayer.mix.get('genres'), this.mixPlayer.mix.get('tag_list_cache').split(', '));
    var genres = this.ffmGenres(all_tags);
    var tags = all_tags; //this.mixPlayer.mix.get('tag_list_cache').split(', ');
    var artists = _.union(this.mixPlayer.mix.get('top_artists'), this.mixPlayer.mix.get('related_artists'), this.mixPlayer.mix.get('artist_list'));

    featureFM.api.getFeaturedSongV3('play', 1, null, genres, tags, false, artists,
      _.bind(function(err, json){
        if (json.data && json.data['song']) {
          this.trackResponse = json.data;
          this.song_play_id  = this.trackResponse.song_play_id;
          this.playTrack(this.trackResponse.song);
          //this.render(this.trackResponse);
          this.renderBanner(json);
          App.views.adsView && App.views.adsView.closeStickyAd();
        } else {
          this.mixPlayer.timeForNextMix(true);
          this.close();
        }
      }, this), { type : 'POST' }
    );
  },

  // accept share urls and return tracks
  // https://www.feature.fm/share/53d03b5f43c6e5ec0b324ee9
  resolve : function(query, callback){
    if (query) this.query = query;
    if (callback) this.resolveCallback = callback;
    if (!window.featureFM) {
      this.setup(this.resolve);
      return;
    }
    featureFM.api.setApiKey(this.api_key);
    if (!this.token) {
      this.identify(this.resolve);
      return;
    }

    JSONH.now(this.query.replace('www', 'api').replace('staging', 'api.staging').replace('/share/', '/thread/'),
            { consumer_token : this.token, api_key : this.api_key },
            _.bind(function(json){

              if (!json.data.song.id) { //if no id returned, make one up from hex
                json.data.song.id = parseInt(json.data.song_play_id.slice(-10), 16);
              }
              var track = this.loadTrack(json.data.song);
              var external_track = track;
              external_track['track_file_stream_url'] = json.data.song.stream_url
              JSONH.now(
                '/tracks/fav_and_create',
                { external_track : external_track, skip_fav : 1 },
                this.resolveCallback,
                { type : 'POST' }
              );
            }, this)
    );

    this.query = null;
  },

  render: function(track_json) {
    //hide skins/superheaders
    //$('#headerboard, #jpsuperheader').empty();
    var html = template(track_json);
    $('#player_artist_details').html(html);
    this.mixPlayerView.showArtistDetails(true);
    this.mixPlayerView.showArtistPhoto();
    featureFM.widgets.loadButtons(this.token);
  },

  renderBanner : function(track_json) {
    $('#player_artist_details').removeClass('hidden-xs collapsed').addClass('feature_fm_details');
    featureFM.api.showBanner("player_artist_details", track_json);
    this.mixPlayerView.showArtistDetails(true);
    featureFM.hideBanner = this.onIframeClose;
  },

  onIframeClose : function(){
    $('#player_artist_details').addClass('collapsed');
    return false;
  },

  playTrack : function(track_json){
    var t = this.loadTrack(track_json)
    this.mixPlayer.unloadTrack();
    this.mixPlayer.updateSetAndPlay({ track : t, after_end : true });
    this.track = this.mixPlayer.track;
    this.bindTrackEvents();
    this.mixPlayerView.showCurrentTrack({ track : this.track });
  },

  bindTrackEvents : function(){
    this.mixPlayer.on('skip', this.onSkip);
    this.track.bind('fav', this.onFav);
    this.mixPlayer.trackPlayer.on('finish', this.onFinish);
    this.mixPlayer.trackPlayer.on('everySecond', this.onEverySecond);
  },

  loadTrack : function(track_json) {
    return {
      id         : 'ffm-' + track_json.id,
      uid        : 'ffm-' + track_json.id,
      partner    : 'ffm',
      partner_id : track_json.id,
      name       : track_json.title,
      performer  : track_json.artist.name,
      release_name : 'Promoted via Feature.fm',
      buy_link   : track_json.buy_song_url || track_json.soundcloud_url || track_json.share_url,
      buy_text   : track_json.buy_song_url ? 'Buy' : 'Share',
      duration   : track_json.duration,
      full_length : true,
      sponsored   : true,
      track_file_stream_url : track_json.stream_url + '?consumer_token='+this.token,
      artist : {
        name : track_json.artist.name,
        bio  : track_json.artist.bio,
        bio_url : track_json.artist.facebook_page_url
      }
    };
  },

  onEverySecond : function(positionSeconds, duration){
    featureFM.api.playProgressUpdate(positionSeconds, this.song_play_id);
  },

  onSkip : function(){
    var pos = (this.mixPlayer.trackPlayer.currentPositionInMs / 1000) || 0;
    featureFM.api.playProgressUpdate(pos, this.song_play_id);
    featureFM.api.reportSkip(this.song_play_id);
    this.onFinish();
  },

  onFinish : function(){
    this.close();
  },


  onFav : function(args){
    console.log('onFav: ');
    //report event
    featureFM.api.reportFavorite(this.song_play_id);
    var t = this.track.toJSON();
    if (!this.organic) {
      t['track_file_stream_url'] = this.trackResponse.song.stream_url; //remove consumer token
      JSONH.now(
        '/tracks/fav_and_create',
        { external_track : t },
        function(json){
          //success?
        },
        { type : 'POST' }
      );
    }
  },

  onClose : function(){
    this.mixPlayer.unbind('skip', this.onSkip);
    //this.mixPlayer.unbind('playing', this.onPlay);
    this.mixPlayer.trackPlayer.unbind('finish', this.onFinish);
    this.mixPlayer.trackPlayer.unbind('everySecond', this.onEverySecond);
    $('#player_artist_details').addClass('collapsed').removeClass('feature_fm_details');
    App.views.adsView.closeStickyAd();
    try{ 
      featureFM.api.destroyBanner(); //this causes exceptions usually, just a bug in their library
    } catch(e){
      //do nothing
    }
  },

  ffmGenres : function(tags){
    var genres = {
      "rock"              : 0,
       "classic rock"     : 0,
       "metal"            : 0,
       "punk"             : 0,
      "soul/r&b"          : 1,
       "soul"             : 1,
       "r&b"              : 1,
       "rnb"              : 1,
      "alternative/indie" : 2,
       "alternative"      : 2,
       "indie"            : 2,
       "indie rock"       : 2,
       "alternative rock" : 2,
      "pop"               : 3,
      "electronica/dance" : 4,
       "electronic"       : 4,
       "dance"            : 4,
       "dubstep"          : 4,
       "electro"          : 4,
       "trance"           : 4,
       "drum n bass"      : 4,
       "dnb"              : 4,
      "rap/hip hop"       : 5,
       "rap"              : 5,
       "hip hop"          : 5,
       "hip-hop"          : 5,
      "comedy/spoken word": 6,
       "comedy"           : 6,
       "spoken word"      : 6,
      "world"             : 7,
      "classical/opera"   : 8,
       "classical"        : 8,
       "opera"            : 8,
       "piano"            : 8,
      "reggae/ska"        : 9,
       "reggae"           : 9,
       "ska"              : 9,
       "dub"              : 9,
      "christian/gospel"  : 10,
       "christian"        : 10,
       "gospel"           : 10,
      "soundtracks"       : 11,
       "soundtrack"       : 11,
       "ost"              : 11,
      "new age"           : 12,
      "folk"              : 13,
       "indie folk"       : 13,
       "acoustic"         : 13,
       "singer-songwriter" : 13,
       "singer/songwriter" : 13,
      "latin"             : 14,
      "cast recordings/cabaret" : 15,
      "country"           : 16,
      "instrumental"      : 17,
      "children's"        : 18,
      "jazz"              : 19,
      "vocals"            : 20,
      "seasonal"          : 21,
       "christmas"        : 21,
      "blues"             : 22
    },

    matched_genres = [];
    for (var i = 0; i < tags.length; i++) {
      matched_genres.push(genres[tags[i]]);
    }
    return _.uniq(_.compact(matched_genres));
  }
});

  return FeatureFmView;
});


define("hgn!templates/mixes/_tracks_played", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<ul id=\"tracks_played\">");_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,40,162,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("tracks",c,p,1),c,p,0,56,148,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <li class=\"track\" data-id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\">");_.b("\n" + i);_.b(_.rp("tracks/track_played",c,p,"        "));_.b("      </li>");_.b("\n");});c.pop();}});c.pop();}_.b("</ul>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/reviews/_review_form", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<form id=\"new_thread_form\" accept-charset=\"UTF-8\" action=\"/reviews\" class=\"new_review displaymode\" method=\"post\">");_.b("\n" + i);_.b("  <div class=\"comment clearfix\">");_.b("\n" + i);_.b("    <img src=\"/images/avatars_v3/sq500.png\" class=\"avatar\" />");_.b("\n" + i);_.b("    ");if(_.s(_.f("spinner",c,p,1),c,p,0,225,236,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("review_form");});c.pop();}_.b("\n" + i);_.b("    <a class=\"submit\" tabindex=\"41\" href=\"#\"><span class=\"i-annotation\"></span></a>");_.b("\n" + i);_.b("    <div class=\"body\">");_.b("\n" + i);_.b("      <div style=\"position: relative;\">");_.b("\n" + i);_.b("        <div class=\"mentions_highlights\"></div>");_.b("\n" + i);_.b("        <textarea class=\"text prompt\" cols=\"40\" class=\"review_body\" name=\"review[body]\" rows=\"3\" placeholder=\"Write a response...\" tabindex=\"40\"></textarea>");_.b("\n" + i);_.b("        <input type=\"hidden\" name=\"review[body_encoded]\" value=\"\" />");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <hr />");_.b("\n" + i);_.b("\n" + i);_.b("      <input id=\"review_reviewable_id\"   name=\"review[reviewable_id]\" type=\"hidden\" value=\"");_.b(_.v(_.f("reviewable_id",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("      <input id=\"review_reviewable_type\" name=\"review[reviewable_type]\" type=\"hidden\" value=\"");_.b(_.v(_.f("reviewable_type",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("      <div class=\"validation_errors\"></div>");_.b("\n" + i);_.b("      <div class=\"row clear\" id=\"captcha_container\" style=\"height: 0px; overflow: hidden;\">");_.b("\n" + i);_.b("        <input type=\"hidden\" name=\"g-recaptcha-response\" value=\"\" />");_.b("\n" + i);_.b("        <div class=\"g-recaptcha\" data-sitekey=\"6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN\"></div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</form>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_mix_reviews", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"reviews\">");_.b("\n" + i);if(_.s(_.f("review_threads",c,p,1),c,p,0,40,74,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.rp("reviews/review_thread",c,p,"    "));});c.pop();}_.b("\n" + i);_.b("  ");_.b(_.t(_.f("seo_pagination",c,p,0)));_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/reviews/_review", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"comment clear ");if(_.s(_.f("parent_id",c,p,1),c,p,0,40,45,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("reply");});c.pop();}_.b("\" data-review_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-review_user_id=\"");_.b(_.v(_.f("user_id",c,p,0)));_.b("\">");_.b("\n" + i);if(_.s(_.f("user",c,p,1),c,p,0,131,234,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" rel=\"user\">");_.b("\n" + i);_.b("      ");if(_.s(_.f("avatar_img",c,p,1),c,p,0,192,207,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq72, w=75&h=75");});c.pop();}_.b("\n" + i);_.b("    </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("user",c,p,1),c,p,0,258,548,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <p class=\"byline\">");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"name turquoise\" data-user_id=\"");_.b(_.v(_.f("user_id",c,p,0)));_.b("\">");_.b(_.v(_.f("login",c,p,0)));_.b("</a>");_.b("\n" + i);_.b("        ");if(_.s(_.f("badge",c,p,1),c,p,0,397,402,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("small");});c.pop();}_.b("\n" + i);_.b("        <span class=\"datetime timeago\" title=\"");_.b(_.v(_.f("created_at_timestamp",c,p,0)));_.b("\">");if(_.s(_.f("human_date",c,p,1),c,p,0,500,510,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("created_at");});c.pop();}_.b("</span>");_.b("\n" + i);_.b("      </p>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"body ");if(!_.s(_.f("parent_id",c,p,1),c,p,1,0,0,"")){_.b("left");};_.b("\">");_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"body_text\">");_.b("\n" + i);_.b("        ");_.b(_.t(_.f("body_html",c,p,0)));_.b("\n" + i);_.b("        <span class=\"comment_links\">");_.b("\n" + i);_.b("          <a class=\"mark_as_spam icon-link\"  rel=\"login_required\" href=\"/reviews/");_.b(_.v(_.f("id",c,p,0)));_.b("/flag.jsonh\" title=\"Flag Spam\"><span class=\"i-flag\"></span></a>");_.b("\n" + i);_.b("          <a class=\"reply_review icon-link\"  rel=\"login_required\" href=\"#\" title=\"Reply\"><span class=\"i-reply\"></span></a>");_.b("\n" + i);_.b("          <a class=\"delete_review icon-link\" rel=\"login_required\" href=\"/reviews/");_.b(_.v(_.f("id",c,p,0)));_.b(".jsonh\" title=\"Delete\"><span class=\"i-x\"></span></a>");_.b("\n" + i);_.b("          <a class=\"flag_user icon-link no_button\" href=\"/user_flaggings\" data-user_name=");_.b(_.v(_.d("user.login",c,p,0)));_.b(" data-comment_id=");_.b(_.v(_.f("id",c,p,0)));_.b(" data-user_id=\"");_.b(_.v(_.d("user.id",c,p,0)));_.b("\" title=\"Block User\"><span class=\"i\">&#8416;</span></a>");_.b("\n" + i);_.b("        </span>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div style=\"clear: both;\"></div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/reviews/_review_thread", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"comment_thread_");_.b(_.v(_.f("id",c,p,0)));_.b("\" class=\"comment_thread\" data-thread_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" ");if(_.s(_.f("hidden",c,p,1),c,p,0,90,110,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("style=\"display:none\"");});c.pop();}_.b(">");_.b("\n" + i);if(_.s(_.f("reviews",c,p,1),c,p,0,136,162,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.rp("reviews/review",c,p,"  	"));});c.pop();}_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/reviews/_reply_form", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<form accept-charset=\"UTF-8\" action=\"/reviews\" class=\"new_review reply_form white_button_form\" method=\"post\">");_.b("\n" + i);_.b("	<div class=\"comment reply reply_form clearfix\">");_.b("\n" + i);if(_.s(_.f("user",c,p,1),c,p,0,171,275,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("	  	<img alt=\"");_.b(_.v(_.f("login",c,p,0)));_.b("\" class=\"avatar sq72\" src=\"");if(_.s(_.f("avatar_url",c,p,1),c,p,0,237,252,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq72, w=75&h=75");});c.pop();}_.b("\" />");_.b("\n");});c.pop();}_.b("  	<a class=\"submit\" tabindex=\"42\" href=\"#\"><span class=\"i-annotation\"></span></a>");_.b("\n" + i);_.b("		<div class=\"body\">");_.b("\n" + i);_.b("			  <p>Reply to thread <a class=\"cancel_reply\" href=\"#\">(cancel)</a></p>");_.b("\n" + i);_.b("			<div>");_.b("\n" + i);_.b("			  <div class=\"mentions_highlights\"></div>");_.b("\n" + i);_.b("				<textarea class=\"text prompt\" cols=\"40\" class=\"review_body\" name=\"review[body]\" rows=\"3\" placeholder=\"Enter your reply here\">");if(_.s(_.f("mentions",c,p,1),c,p,0,659,670,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("@");_.b(_.v(_.f("login",c,p,0)));_.b(" ");});c.pop();}_.b("</textarea>");_.b("\n" + i);_.b("				<input type=\"hidden\" name=\"review[body_encoded]\" value=\"");if(_.s(_.f("mentions",c,p,1),c,p,0,768,788,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("@[");_.b(_.v(_.f("id",c,p,0)));_.b(":");_.b(_.v(_.f("login",c,p,0)));_.b("] ");});c.pop();}_.b("\" />");_.b("\n" + i);_.b("				<hr />");_.b("\n" + i);_.b("			</div>");_.b("\n" + i);_.b("			<div class=\"comment_links\">");_.b("\n" + i);_.b("				<input id=\"review_mix_id\" name=\"review[reviewable_id]\" type=\"hidden\" value=\"");_.b(_.v(_.f("reviewable_id",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("				<input id=\"review_mix_id\" name=\"review[reviewable_type]\" type=\"hidden\" value=\"");_.b(_.v(_.f("reviewable_type",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("				<input id=\"review_parent_id\" name=\"review[parent_id]\" type=\"hidden\" value=\"");_.b(_.v(_.f("parent_id",c,p,0)));_.b("\">");_.b("\n" + i);_.b("				<div class=\"validation_errors\"></div>");_.b("\n" + i);_.b("	      <div class=\"row clear\" id=\"captcha_container\" style=\"height: 0px; overflow: hidden;\">");_.b("\n" + i);_.b("	      	<input type=\"hidden\" name=\"g-recaptcha-response\" value=\"\" />");_.b("\n" + i);_.b("	        <div class=\"g-recaptcha\" data-sitekey=\"6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN\"></div>");_.b("\n" + i);_.b("	      </div>");_.b("\n" + i);_.b("\n" + i);_.b("				");if(_.s(_.f("spinner",c,p,1),c,p,0,1493,1504,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("review_form");});c.pop();}_.b("\n" + i);_.b("			</div>");_.b("\n" + i);_.b("\n" + i);_.b("		</div><!-- bubble -->");_.b("\n" + i);_.b("	</div><!-- comment -->");_.b("\n" + i);_.b("</form>	");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.2.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */


(function (factory) {
  //8hack - we don't serve jquery as a amd module
  // if (typeof define === 'function' && define.amd) {
  //   // AMD. Register as an anonymous module.
  //   define(['jquery'], factory);
  // } else {
    // Browser globals
    factory(jQuery);
  // }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: true,
      localeTitle: false,
      cutoff: 1000 * 3600 * 24, // 1 day
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      var value = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      
      // Remi added this to support unix timestamps in html elements
      if (value.length == 10 || value.length == 13) {
        var intValue = parseInt(value,0);
        if (intValue == value) {
          // this is a Unix timestamp
          if (value.length == 10) {
            // add ms to make it compatible
            intValue *= 1000;
          }
          return new Date(intValue);
        }
      }

      return $t.parse(value);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function(){
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(time){
      $(this).data('timeago', { datetime: $t.parse(time) });
      refresh.apply(this);
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if(!fn){
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function(){
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var data = prepareData(this);
    var $s = $t.settings;

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff == 0 || distance(data.datetime) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

define("jquery.timeago", function(){});


define("hgn!templates/collections/add_to_collection", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"box_header\">");_.b("\n" + i);_.b("	<a class=\"shareClose\" href=\"#\" title=\"Close menu\" rel=\"local\"><span class=\"i-close\"></span></a>");_.b("\n" + i);_.b("	<span class=\"collecticon collection\"></span><strong>Add <em>");_.b(_.v(_.f("name",c,p,0)));_.b("</em> to a collection</strong>");_.b("\n" + i);_.b("	<div id=\"collections-spinner\" class=\"spin\"><span style=\"display: none;\"></span></div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<ul id=\"my_collections\">");_.b("\n" + i);_.b("    <li><br /><div style=\"margin: 0 auto;\" class=\"large-spinner\" id=\"my-collections-spinner\"></div><br /></li>");_.b("\n" + i);_.b("</ul>");_.b("\n" + i);_.b("\n" + i);_.b("<form action=\"/collections\" method=\"POST\" id=\"create_collection\">");_.b("\n" + i);_.b("	<input type=\"text\" id=\"new_collection_name\" name=\"collection[name]\" value=\"\" placeholder=\"New collection\" class=\"roundText\" tabindex=\"10\" />");_.b("\n" + i);_.b("  <input type=\"hidden\" name=\"mix_id\" value=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("	<input type=\"submit\" class=\"disabled turquoise_button flatbutton submit\" value=\"Create\" id=\"create_collection_button\" tabindex=\"12\" />");_.b("\n" + i);_.b("  <textarea name=\"collection[description]\" id=\"new_collection_description\" placeholder=\"Describe your collection (optional)\" class=\"roundText\" style=\"display: none;\" tabindex=\"11\"></textarea>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("</form>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/collections/my_collections", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");if(_.s(_.f("collections",c,p,1),c,p,0,16,665,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <li>");_.b("\n" + i);_.b("		<div data-id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" class=\"my_collection ");if(_.s(_.f("contains_mix",c,p,1),c,p,0,86,98,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("contains_mix");});c.pop();}_.b("\">");_.b("\n" + i);_.b("			<a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"view_link\" target=\"_blank\">View</a>");_.b("\n" + i);_.b("			<span class=\"status_icon\">");_.b("\n" + i);_.b("				<span class=\"i-plus\"></span>");_.b("\n" + i);_.b("				<span class=\"i-checkmark\"></span>");_.b("\n" + i);_.b("				<span class=\"i-x\"></span>");_.b("\n" + i);_.b("			</span>");_.b("\n" + i);_.b("			");if(!_.s(_.f("show_slug",c,p,1),c,p,1,0,0,"")){_.b(_.v(_.f("name",c,p,0)));};_.b("\n" + i);_.b("			");if(_.s(_.f("show_slug",c,p,1),c,p,0,386,394,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.v(_.f("slug",c,p,0)));});c.pop();}_.b("\n" + i);_.b("			<span class=\"mixes_count gray\">");_.b("\n" + i);if(_.s(_.f("queue_message",c,p,1),c,p,0,466,496,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("					");_.b(_.t(_.f("queue_message",c,p,0)));_.b("\n");});c.pop();}if(!_.s(_.f("queue_message",c,p,1),c,p,1,0,0,"")){_.b("					(");_.b(_.v(_.f("mixes_count",c,p,0)));_.b(" ");if(_.s(_.f("pluralize",c,p,1),c,p,0,569,599,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("mixes_count playlist playlists");});c.pop();}_.b(")");_.b("\n");};_.b("			</span>");_.b("\n" + i);_.b("		</div>");_.b("\n" + i);_.b("	</li>");_.b("\n");});c.pop();}_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/users/_about", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"full-width user_about profile clear favable vcard dark-bg\"  style=\"position: relative; overflow: hidden;\">");_.b("\n" + i);_.b("  <div class=\"background-blur-container\">");_.b("\n" + i);_.b("    <canvas class=\"background-blur\" width=\"100%\" height=\"100%\" style=\"width: 100%; height: 100%; opacity: 0.0;\" data-palette=\"");if(_.s(_.f("color_palette",c,p,1),c,p,0,305,311,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.v(_.d(".",c,p,0)));_.b(",");});c.pop();}_.b("\"></canvas>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"profile_top\" class=\"user_about about container\">");_.b("\n" + i);_.b("    <div class=\"row\">");_.b("\n" + i);_.b("      <div id=\"user_avatar\" class=\"col-xs-4 col-md-3 col-lg-2\">");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" rel=\"user\" title=\"");_.b(_.v(_.f("login",c,p,0)));_.b("'s profile\">");_.b("\n" + i);_.b("      	  ");if(_.s(_.f("avatar_img",c,p,1),c,p,0,592,610,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=100&h=100");});c.pop();}_.b("\n" + i);_.b("        </a>");_.b("\n" + i);_.b("        ");if(_.s(_.f("designation",c,p,1),c,p,0,663,718,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"badge_small ");_.b(_.v(_.f("designation",c,p,0)));_.b("_small\"></span>");});c.pop();}_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"user_details col-xs-8 col-md-9 col-lg-10\">");_.b("\n" + i);_.b("      	<h1 class=\"nickname fn\"><a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\">");_.b(_.v(_.f("login",c,p,0)));_.b("</a></h1>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("college_name",c,p,1),c,p,0,910,973,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          <div class=\"college\">");_.b(_.v(_.f("college_name",c,p,0)));_.b("</div>");_.b("\n");});c.pop();}if(!_.s(_.f("college_name",c,p,1),c,p,1,0,0,"")){_.b("          <div class=\"location\">");_.b(_.v(_.f("location",c,p,0)));_.b("</div>");_.b("\n");};_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"options p p_not_owner on ");if(_.s(_.f("location",c,p,1),c,p,0,1154,1159,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("fixed");});c.pop();}_.b("\" data-owner_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\">");_.b("\n" + i);_.b(_.rp("users/follow_button",c,p,"        	"));_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div><!--.row-->");_.b("\n" + i);_.b("    <div class=\"clear\"></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/users/_follow_button", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<a href=\"");_.b(_.v(_.f("path",c,p,0)));_.b("/toggle_follow\" title=\"Follow ");_.b(_.v(_.f("login",c,p,0)));_.b("\" class=\"follow turquoise_button flatbutton p p_not_owner\" data-owner_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-user_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" rel=\"signup_required nofollow\"><span class=\"text\">");_.b("\n" + i);if(_.s(_.f("followed_by_current_user",c,p,1),c,p,0,242,259,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    Following");_.b("\n");});c.pop();}if(!_.s(_.f("followed_by_current_user",c,p,1),c,p,1,0,0,"")){_.b("	  Follow");_.b("\n");};_.b("  </span>");_.b("\n" + i);_.b("</a>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/shared/sharing", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div>");_.b("\n" + i);_.b("  <div class=\"share-buttons-block\">");_.b("\n" + i);_.b("    <span class=\"share-group\">");_.b("\n" + i);if(_.s(_.f("facebook",c,p,1),c,p,0,92,356,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"fb popupShare flatbutton shareOpenGraph\"");_.b("\n" + i);_.b("        href=\"#\"");_.b("\n" + i);_.b("        title=\"Share on Facebook\"");_.b("\n" + i);_.b("        data-win-width=\"500\"");_.b("\n" + i);_.b("        data-win-height=\"800\"");_.b("\n" + i);_.b("        data-network=\"facebook\">");_.b("\n" + i);_.b("        <span class=\"logo i-facebook\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("twitter",c,p,1),c,p,0,389,968,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"tw popupShare flatbutton\"");_.b("\n" + i);_.b("        href=\"https://twitter.com/share?original_referer=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("&source=tweetbutton&text=");_.b(_.v(_.f("description",c,p,0)));_.b("&related=");_.b("\n" + i);_.b("        8tracks:%20The%20world's%20best%20internet%20radio,");_.b(_.v(_.f("related_twitter",c,p,0)));_.b("&url=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b(_.v(_.d("sources.twitter",c,p,0)));_.b("%3Futm_source=twitter.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=twitter_button\"");_.b("\n" + i);_.b("        rel=\"popup\"");_.b("\n" + i);_.b("        title=\"Tweet\"");_.b("\n" + i);_.b("        data-win-width=\"420\"");_.b("\n" + i);_.b("        data-win-height=\"550\"");_.b("\n" + i);_.b("        data-network=\"Twitter\">");_.b("\n" + i);_.b("        <span class=\"logo i-twitter\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("tumblr",c,p,1),c,p,0,999,2047,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"tb popupShare flatbutton\"");_.b("\n" + i);if(_.s(_.f("embedCode",c,p,1),c,p,0,1064,1187,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          href=\"http://www.tumblr.com/share/video?embed=");_.b(_.v(_.f("embedCode",c,p,0)));_.b("&name=");_.b(_.v(_.f("name",c,p,0)));_.b("&caption=");_.b(_.v(_.f("description_html",c,p,0)));_.b("\"");_.b("\n");});c.pop();}if(!_.s(_.f("embedCode",c,p,1),c,p,1,0,0,"")){if(_.s(_.f("image",c,p,1),c,p,0,1236,1554,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            href=\"http://www.tumblr.com/widgets/share/tool?posttype=photo&content=");_.b(_.v(_.f("tumblr_image",c,p,0)));_.b("&caption=");_.b(_.v(_.f("description_html",c,p,0)));_.b("&tags=");_.b(_.v(_.f("hash_tags",c,p,0)));_.b("&canonicalUrl=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("&clickthroughUrl=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("%3Futm_source=tumblr.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=tumblr_button\"");_.b("\n");});c.pop();}if(!_.s(_.f("image",c,p,1),c,p,1,0,0,"")){_.b("          href=\"http://www.tumblr.com/share/link?name=");_.b(_.v(_.f("name",c,p,0)));_.b("&description=");_.b(_.v(_.f("description_html",c,p,0)));_.b("&url=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("%3Futm_source=tumblr.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=tumblr_button\"");_.b("\n");};};_.b("        rel=\"popup\"");_.b("\n" + i);_.b("        title=\"Post to Tumblr\"");_.b("\n" + i);_.b("        data-win-width=\"450\"");_.b("\n" + i);_.b("        data-win-height=\"430\"");_.b("\n" + i);_.b("        data-network=\"Tumblr\">");_.b("\n" + i);_.b("        <span class=\"logo i-tumblr\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("    </span>");_.b("\n" + i);_.b("\n" + i);_.b("    <span class=\"share-group\">");_.b("\n" + i);if(_.s(_.f("stumbleupon",c,p,1),c,p,0,2125,2455,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"su popupShare flatbutton\"");_.b("\n" + i);_.b("        href=\"http://www.stumbleupon.com/submit?url=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        rel=\"popup\"");_.b("\n" + i);_.b("        title=\"Share on Stumbleupon\"");_.b("\n" + i);_.b("        data-win-width=\"800\"");_.b("\n" + i);_.b("        data-win-height=\"600\"");_.b("\n" + i);_.b("        data-network=\"Stumbleupon\">");_.b("\n" + i);_.b("        <span class=\"logo i-stumbleupon\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("      <!-- refactored using gplus share link for utm tracking -->");_.b("\n" + i);if(_.s(_.f("google",c,p,1),c,p,0,2556,3417,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"g-interactivepost gl popupShare flatbutton\"");_.b("\n" + i);_.b("        href=\"https://plus.google.com/share?url=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b("%3Futm_source=google.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=google_button\"");_.b("\n" + i);_.b("        rel=\"popup\"");_.b("\n" + i);_.b("        title=\"Share on Google+\"");_.b("\n" + i);_.b("        data-win-width=\"500\"");_.b("\n" + i);_.b("        data-win-height=\"600\"");_.b("\n" + i);_.b("        data-network=\"Google\">");_.b("\n" + i);_.b("      <!--   data-contenturl=\"");_.b(_.v(_.f("decoded_url",c,p,0)));_.b("?");_.b(_.v(_.d("sources.google",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        data-contentdeeplinkid=\"");_.b(_.v(_.f("path",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        data-clientid=\"");_.b(_.v(_.f("GOOGLE_CLIENT_ID",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        data-cookiepolicy=\"single_host_origin\"");_.b("\n" + i);_.b("        data-prefilltext=\"");_.b(_.v(_.f("hash_tags",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        data-calltoactionlabel=\"LISTEN\"");_.b("\n" + i);_.b("        data-calltoactionurl=\"");_.b(_.v(_.f("decoded_url",c,p,0)));_.b("?");_.b(_.v(_.d("sources.google",c,p,0)));_.b("\"");_.b("\n" + i);_.b("        data-network=\"Google\"");_.b("\n" + i);_.b("        data-calltoactiondeeplinkid=\"");_.b(_.v(_.f("path",c,p,0)));_.b("\" -->");_.b("\n" + i);_.b("        <span class=\"logo i-google-plus\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("pinterest",c,p,1),c,p,0,3450,3829,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a");_.b("\n" + i);_.b("       class=\"pn popupShare flatbutton\"");_.b("\n" + i);_.b("       href=\"http://pinterest.com/pin/create/button/?url=");_.b(_.v(_.f("url_escaped",c,p,0)));_.b(_.v(_.d("sources.pinterest",c,p,0)));if(_.s(_.f("image",c,p,1),c,p,0,3603,3627,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("&media=");_.b(_.v(_.f("image_escaped",c,p,0)));});c.pop();}_.b("\"");_.b("\n" + i);_.b("       rel=\"popup\"");_.b("\n" + i);_.b("       title=\"Pin it\"");_.b("\n" + i);_.b("       data-win-width=\"720\"");_.b("\n" + i);_.b("       data-height=\"560\"");_.b("\n" + i);_.b("       data-network=\"Pinterest\">");_.b("\n" + i);_.b("       <span class=\"logo i-pinterest\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("email",c,p,1),c,p,0,3861,4065,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a");_.b("\n" + i);_.b("       class=\"em popupShare flatbutton\"");_.b("\n" + i);_.b("       href=\"#\"");_.b("\n" + i);_.b("       rel=\"local\"");_.b("\n" + i);_.b("       data-network=\"Email\"");_.b("\n" + i);_.b("       title=\"Share via email\">");_.b("\n" + i);_.b("       <span class=\"logo i-email\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("embed",c,p,1),c,p,0,4093,4287,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a class=\"eb popupShare flatbutton\"");_.b("\n" + i);_.b("       href=\"#\"");_.b("\n" + i);_.b("       rel=\"local\"");_.b("\n" + i);_.b("       title=\"Embed player\"");_.b("\n" + i);_.b("       data-network=\"Embed\">");_.b("\n" + i);_.b("       <span class=\"logo i-embed\"></span>");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}_.b("    </span>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <a class=\"shareClose flatbutton\" href=\"#\" title=\"Close menu\" rel=\"local\">Close</a>");_.b("\n" + i);_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/pick_next_mix", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<h2>Pick next playlist</h2>");_.b("\n" + i);_.b("\n" + i);_.b("<div id=\"selected_nextmix\">");_.b("\n" + i);if(_.s(_.f("pick_next_mix",c,p,1),c,p,0,77,278,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <div class=\"mix selected\">");_.b("\n" + i);_.b("      <img alt=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" class=\"cover sq56\" default=\"true\" src=\"");_.b(_.v(_.d("cover_urls.sq56",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("      <div class=\"title\">");_.b(_.v(_.f("name",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("      ");_.b(_.v(_.d("user.login",c,p,0)));_.b("<br />");_.b("\n" + i);_.b("    </div>");_.b("\n");});c.pop();}if(!_.s(_.f("pick_next_mix",c,p,1),c,p,1,0,0,"")){_.b("    <div class=\"mix\">");_.b("\n" + i);_.b("      <img class=\"cover sq56\" default=\"true\" src=\"/images/mix_covers_v2/sq56.gif\" />");_.b("\n" + i);_.b("      <div class=\"title\">None selected</div>");_.b("\n" + i);_.b("    </div>");_.b("\n");};_.b("\n" + i);_.b("  <div id=\"nextmix_instructions\">");_.b("\n" + i);_.b("      To provide a better experience for listeners, pick another DJ's playlist &mdash; based on style, mood or theme &mdash; to play after this mix.  Subscribe to <a href=\"/plus\">8tracks+</a> to pick your own mix.");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("  <div class=\"clearfix\"></div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("<div id=\"pick_next_mix\">  ");_.b("\n" + i);_.b("    <div id=\"pick_controls\">");_.b("\n" + i);_.b("      <input id=\"mixes_q\" name=\"q\" placeholder=\"Search playlists\" type=\"text\" />");_.b("\n" + i);_.b("      <div id=\"nextmix-spinner\" class=\"spin\"><span style=\"display:none\">&nbsp;</span></div>");_.b("\n" + i);_.b("      <span class=\"searchtabs\">");_.b("\n" + i);_.b("        <a href=\"#\" id=\"likedmixes\" class=\"selected\">Liked playlists</a>");_.b("\n" + i);_.b("        <a href=\"#\" id=\"mixfeed\">Feed</a>");_.b("\n" + i);_.b("        <a href=\"#\" id=\"allmixes\" >All playlists</a>");_.b("\n" + i);_.b("          <a href=\"#\" id=\"mymixes\">My playlists</a>");_.b("\n" + i);_.b("      </span>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("    <div id=\"mix_selector\" class=\"results clear\">  ");_.b("\n" + i);_.b("    	  <ul id=\"mixes_search_results\">");_.b("\n" + i);_.b("        </ul>          ");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<form accept-charset=\"UTF-8\" action=\"/mixes/");_.b(_.v(_.d("mix.id",c,p,0)));_.b("\" class=\"edit_mix\" id=\"pick_next_mix_form\" method=\"post\">");_.b("\n" + i);_.b("<input id=\"mix_next_mix_id\" name=\"mix[next_mix_id]\" type=\"hidden\" value=\"");_.b(_.v(_.d("pick_next_mix.id",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"save\">");_.b("\n" + i);_.b("          <input class=\"green_bt\" name=\"mix[commit]\" title=\"Save\" type=\"submit\" value=\"Save\" />");_.b("\n" + i);_.b("          <div id=\"pick_next_mix-spinner\" class=\"spin\"><span style=\"display:none\">&nbsp;</span></div>");_.b("\n" + i);_.b("          <div style=\"clear: both;\"></div> ");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("</form>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_youtube_player", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"mix_youtube\" class=\"clearfix\" style=\"display: none;\">");_.b("\n" + i);_.b("  <div class=\"container\">");_.b("\n" + i);_.b("    <div class=\"row hidden-xs yt_title_placeholder\">");_.b("\n" + i);_.b("      <div class=\"col-xs-12\">");_.b("\n" + i);_.b("        <h1>");_.b(_.v(_.f("name",c,p,0)));_.b("</h1>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div class=\"row clear\">");_.b("\n" + i);_.b("      <div class=\"hidden-xs col-sm-1 col-md-2 col-xl-2\">&nbsp;</div>");_.b("\n" + i);_.b("      <div class=\"col-sm-10 col-md-8 col-xl-8\">");_.b("\n" + i);_.b("        <div id=\"mix_youtube_embed\"></div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      <div class=\"hidden-xs col-sm-1 col-md-2 col-xl-2\">&nbsp;</div>");_.b("\n" + i);_.b("    </div><!--.row-->");_.b("\n" + i);_.b("  </div><!--.container -->");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"mix_youtube_player_controls\" class=\"player_controls player_gray dark-bg clearfix clear\">");_.b("\n" + i);_.b("    <div class=\"background-blur-container\">");_.b("\n" + i);_.b("      <canvas class=\"background-blur\" width=\"100%\" height=\"100%\" style=\"width: 100%; height: 100%; opacity: 0.6;\"></canvas>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div class=\"container\">");_.b("\n" + i);_.b("      <div class=\"row\">");_.b("\n" + i);_.b("        <div class=\"player_controls_left col-xs-4 col-sm-3 col-md-3 col-lg-2 col-xl-2\">");_.b("\n" + i);_.b("          <div id=\"player_mix\" class=\"hidden-xs\">");_.b("\n" + i);_.b("            <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"cover-link\" title=\"View fullsize art\">");_.b("\n" + i);_.b("              <img src=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,1134,1152,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=100&h=100");});c.pop();}_.b("\" class=\"cover\" />");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("          <div id=\"youtube_rewind_button\" class=\"player_button\" title=\"Rewind\"><span class=\"i-rewind\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_play_button\" class=\"player_button\" title=\"Play\"><span class=\"i-play\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_pause_button\" class=\"player_button\" title=\"Pause\"><span class=\"i-pause\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_skip_button\" class=\"player_button\" title=\"Skip\"><span class=\"i-skip\"></span></div>");_.b("\n" + i);_.b("          <!--div id=\"next_mix_button\" class=\"player_button\" title=\"Next\" style=\"display: none;\"><span class=\"i-next\"></span></div-->");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"player_progress_bar player_gray col-xs-7 col-sm-6 col-md-7 col-lg-8 col-xl-8\">");_.b("\n" + i);_.b("          <ul id=\"now_playing\"></ul>");_.b("\n" + i);_.b("          <a href=\"#\" class=\"\" id=\"youtube_flag_button\" title=\"Wrong video\">");_.b("\n" + i);_.b("            <span class=\"hidden-xs hidden-sm\"><span class=\"optional\"><strong>Wrong video</strong></span></span>");_.b("\n" + i);_.b("            <span class=\"i-flag\"></span>");_.b("\n" + i);_.b("          </a>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      ");_.b("\n" + i);_.b("        <div class=\"hidden-xs col-sm-3 col-md-2 col-lg-2 col-xl-2 transparentbox\">");_.b("\n" + i);_.b("          <div class=\"mix_interactions\">");_.b("\n" + i);_.b("            <div id=\"youtube_like_button\" class=\"");if(_.s(_.f("liked_by_current_user",c,p,1),c,p,0,2425,2431,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("active");});c.pop();}_.b(" player_button\"><span class=\"i-like\"></span></div>            ");_.b("\n" + i);_.b("            <!--a id=\"add_button\" class=\"player_button\" href=\"#\" title=\"Add to collection\" rel=\"local\">");_.b("\n" + i);_.b("              <span class=\"i-collection\"></span>");_.b("\n" + i);_.b("            </a-->");_.b("\n" + i);_.b("            <div id=\"youtube_sticky_button\" class=\"player_button hidden-xs\" title=\"Sticky Player\"></div>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("          <div id=\"yt_share\" class=\"share_interactions interactbox\" style=\"display: none;\">");_.b("\n" + i);_.b("            <div class=\"like_share\" style=\"display: none;\">Liked! Share this mix with friends:</div>");_.b("\n" + i);_.b("            <div class=\"share_view\"></div>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"clear: both;\"></div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("     </div><!--.col-->");_.b("\n" + i);_.b("   </div><!-- .container -->");_.b("\n" + i);_.b("   <span></span>");_.b("\n" + i);_.b("</div><!--#mix_youtube-->");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/promo_views/youtube_connect", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div>");_.b("\n" + i);_.b("  	<div class=\"clearfix tooltip_container youtube-connect\">");_.b("\n" + i);_.b("      <div id=\"google_plus_youtube_connect\" class=\"google-plus-container flatbutton button_red hugebutton\" data-scope=\"https://www.googleapis.com/auth/youtube.readonly\">");_.b("\n" + i);_.b("        <span class=\"youtube_icon\">");_.b("\n" + i);_.b("          <span class=\"i i-you\"></span> <span class=\"i i-tube_container_cutout\"></span>");_.b("\n" + i);_.b("        </span>");_.b("\n" + i);_.b("\n" + i);_.b("        <span class=\"success\" style=\"display: none;\"><span class=\"i-checkmark\" style=\"display: inline-block;\"></span></span>");_.b("\n" + i);_.b("        Connect Youtube");_.b("\n" + i);_.b("        <div class=\"clearfix\"></div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <p class=\"success disconnect center\" style=\"display: none;\"><a href=\"/auth/google_plus/disconnect_youtube\" class=\"js-disconnect\">Disconnect Youtube</a></span>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("  <!--div style=\"display: none;\" class=\"success\">");_.b("\n" + i);_.b("    <p>Awesome! You've connected your Youtube account. Click play or choose a track to enjoy full on-demand playlists!</p> ");_.b("\n" + i);_.b("  </div-->");_.b("\n" + i);_.b("\n" + i);_.b("  <div style=\"display: none;\" class=\"error\"></div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div style=\"display: none;\" class=\"yt_user\"></div>  ");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"clear\"></div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/promo_views/youtube_disconnect", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"card\">");_.b("\n" + i);_.b("  <h6>Prefer radio-style streaming?</h6>");_.b("\n" + i);_.b("  <div class=\"instructions\">");_.b("\n" + i);_.b("    <p>Switch to audio-only radio-style streaming, with no advance tracklist and limited skips.</p>");_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"js-connected-sites\">");_.b("\n" + i);_.b("   	 <div class=\"js-connected-site clearfix tooltip_container youtube-connect\">");_.b("\n" + i);_.b("      <div class=\"google-plus-container external-account-chiclet\" style=\"float: left; font-size: 18px;\">");_.b("\n" + i);_.b("          <span class=\"i-you\" style=\"margin-right: -5px;\"></span> <span class=\"i i-tube_container_cutout\"></span>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("      <div>");_.b("\n" + i);_.b("        <span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Youtube</a></span>");_.b("\n" + i);_.b("        <span class=\"disconnect\"><a href=\"/auth/google_plus/disconnect_youtube\" class=\"js-disconnect\">Disconnect Youtube</a></span>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("   </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"clear\"></div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define('views/google_plus_view',['views/trax_view', 'lib/jsonh.jquery', 'lib/sessions', 'global_trax'], function(TraxView, JSONH, sessions, TRAX) {

  var GooglePlusView = TraxView.extend({

    initialize: function(options) {
      if (options) {
        this.customCallback      = options.customCallback;
        this.customErrorFunction = options.customErrorFunction;
      }

      _.bindAll(this, 'enabled', 'renderCustomButton', 'loadGapi', 'asyncGooglePlus', 'sendAuthCode', 'unauthorized', 'logIn', 'signInCallBack');

      if (_.isUndefined(window.googlePlusCallback)) {
        window.googlePlusCallback = _.bind(this.signInCallBack, this);
      }

      if (window.gapi) {
        // gapi.signin.go();
        gapi.load('auth2', this.loadGapi);
      }
    },

    enabled: function() {
      return true;
      // var user = App.Trax.currentUser;
      // return user && user.isAdmin();
    },

    renderCustomButton: function(id, extraOptions) {
      var buttonConfig = {
        scope: "email profile",
        client_id: GOOGLE_CLIENT_ID,
        redirecturi: "postmessage",
        //requestvisibleactions: "http://schemas.google.com/ListenActivity",
        cookiepolicy: "single_host_origin",
        callback: "googlePlusCallback"
      };

      if (!_.isUndefined(extraOptions)) {
        _.extend(buttonConfig, extraOptions);
      }
      
      gapi.signin2.render(id, buttonConfig);
    },

    loadGapi : function() {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      if (typeof auth2 == 'undefined') {
        auth2 = gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
          cookiepolicy: 'single_host_origin',
          //requestvisibleactions: "http://schemas.google.com/ListenActivity",
          scope: "email profile", 
        });
      }
      
      var buttons = $('.google-plus-container:not(.attached)');
      for(var i = 0; i < buttons.length; i++) {
        auth2.attachClickHandler(
          buttons[i],
          { scope : 'email profile ' + ($(buttons[i]).data('scope')||'') }, 
          this.signInCallBack,
          this.customErrorFunction || function(error) { console.log("error signing in"); }
        );
        $(buttons[i]).addClass('attached');
      }
    },

    asyncGooglePlus: function(id, extraOptions) {
      var el = $('#'+id);

      if (el.data('gapiattached'))
        return;

      this.renderCustomButton(id, extraOptions);
    },


    sendAuthCode: function(user) {
      var self = this;
      var authResult = user.getAuthResponse();
      id_token     = authResult.id_token;
      access_token = authResult.access_token;
      youtube_auth = authResult.scope && authResult.scope.match(/youtube/);
      
      /* write a new backend login method
       * https://developers.google.com/identity/sign-in/web/backend-auth
       * google_plus_controller.rb
       * google_plus_user.rb
       */

      JSONH.now('/auth/google-plus/callback', { access_token : access_token, youtube_auth : youtube_auth }, function(response){
        self.logIn(response);
        if (authResult.scope && authResult.scope.match(/youtube/)) {
          sessions.trigger('youtube-connected');
        }
      }, { type : 'POST' }).error(this.unauthorized);
    },

    unauthorized: function(xhr, status, error) {
      try {
        json = JSON.parse(xhr.responseText);
      } catch(e) {
        json = {};
      }
      if (json.user_error_message) {
        TRAX.show_flash_error(json.user_error_message, false);
      } else {      
        TRAX.show_flash_error("Something is wrong with Google+. Please try again.");
      }
    },

    logIn: function(response) {
      sessions.onBackendLogin(response);
    },

    signInCallBack: function(user) {
      var authResult = user.getAuthResponse();
      // var autoLogin = !authResult['g-oauth-window'];
      // if (autoLogin || !authResult.code)
      //   return;

      var youtube_auth = false;
      if (authResult.scope && authResult.scope.match(/youtube/)) {
        sessions.trigger('youtube-started');
      }

      this.sendAuthCode(user, youtube_auth);
      if (typeof this.customCallback == 'function') {
        this.customCallback.call(this, user);
      }
    }

  });

  return GooglePlusView;
});



define("hgn!templates/youtube/popup", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"youtube_popup\">");_.b("\n" + i);_.b("  <h2>Building your recommendations</h2>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"youtube-message\">");_.b("\n" + i);_.b("    <ul class=\"youtube-progress\">");_.b("\n" + i);_.b("      <div class=\"initial-progress\">");_.b("\n" + i);_.b("        <li>8tracks is analyzing your YouTube activity.</li>");_.b("\n" + i);_.b("        <li>Your recommended playlists will be ready in just a moment.</li>");_.b("\n" + i);_.b("        <hr />");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      <div class=\"extra-progress\">");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      <div class=\"error-progress\">");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </ul>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"youtube-fallback\" style=\"display:none;\">");_.b("\n" + i);_.b("    <hr />");_.b("\n" + i);_.b("    <div class=\"artist-search-fallback\">");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/facebook", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<a href=\"/auth/facebook\" class=\"facebook_connect_button facebook-connect external-account-chiclet\" data-site=\"facebook\" data-win-height=\"362\" data-win-name=\"facebook\" data-win-width=\"640\" rel=\"popup\" target=\"_blank\" title=\"Connect with Facebook\">");_.b("\n" + i);_.b("      <span class=\"i-facebook\"></span>");_.b("\n" + i);_.b("  </a>");_.b("\n" + i);_.b("\n" + i);_.b("<p>");_.b("\n" + i);_.b("  <span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Facebook</a></span>");_.b("\n" + i);_.b("  <span class=\"disconnect\"><a href=\"/auth/facebook/disconnect\" class=\"js-disconnect\">Disconnect Facebook</a></span>");_.b("\n" + i);_.b("</p>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,539,595,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"options clear\">");_.b("\n" + i);_.b("  <div class=\"optional\">Connect with Facebook to find your friends.</div>");_.b("\n" + i);_.b("  <div class=\"disconnect\">");_.b("\n" + i);if(_.s(_.f("connected_facebook_user",c,p,1),c,p,0,769,2745,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("	  	<div class=\"field clear checkbox\">");_.b("\n" + i);_.b("        <p>Let Facebook access:<span id=\"facebook-options-spinner\" class=\"spin\"><span style=\"display: none;\"></span></span></p>");_.b("\n" + i);_.b("\n" + i);_.b("        <label for=\"user_facebook_post_likes\">");_.b("\n" + i);_.b("          <input name=\"user[connected_facebook_user][post_likes]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("          <input type=\"checkbox\" name=\"user[connected_facebook_user][post_likes]\" ");if(_.s(_.f("post_likes",c,p,1),c,p,0,1173,1190,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_facebook_post_likes\">");_.b("\n" + i);_.b("          Playlists you like");_.b("\n" + i);_.b("        </label>");_.b("\n" + i);_.b("\n" + i);_.b("        <label for=\"user_facebook_post_mixes\">");_.b("\n" + i);_.b("          <input name=\"user[connected_facebook_user][post_mixes]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("          <input type=\"checkbox\" name=\"user[connected_facebook_user][post_mixes]\" ");if(_.s(_.f("post_mixes",c,p,1),c,p,0,1529,1546,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_facebook_post_mixes\">");_.b("\n" + i);_.b("          Playlists you publish");_.b("\n" + i);_.b("        </label>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("        <label for=\"user_facebook_post_favs\">");_.b("\n" + i);_.b("          <input name=\"user[connected_facebook_user][post_favs]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("          <input type=\"checkbox\" name=\"user[connected_facebook_user][post_favs]\" ");if(_.s(_.f("post_favs",c,p,1),c,p,0,1885,1902,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_facebook_post_favs\">");_.b("\n" + i);_.b("          Tracks you favorite");_.b("\n" + i);_.b("        </label>");_.b("\n" + i);_.b("\n" + i);_.b("			  <label for=\"user_facebook_post_listens\">");_.b("\n" + i);_.b("			  	<input name=\"user[connected_facebook_user][post_listens]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("			  	<input type=\"checkbox\" name=\"user[connected_facebook_user][post_listens]\" ");if(_.s(_.f("post_listens",c,p,1),c,p,0,2237,2254,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_facebook_post_listens\">");_.b("\n" + i);_.b("			    Tracks you listen to");_.b("\n" + i);_.b("        </label>");_.b("\n" + i);_.b("\n" + i);_.b("        <!--label for=\"user_facebook_post_follows\">");_.b("\n" + i);_.b("          <input name=\"user[connected_facebook_user][post_follows]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("          <input type=\"checkbox\" name=\"user[connected_facebook_user][post_follows]\" ");if(_.s(_.f("post_follows",c,p,1),c,p,0,2607,2624,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_facebook_post_follows\">");_.b("\n" + i);_.b("          Friends I follow");_.b("\n" + i);_.b("        </label-->");_.b("\n" + i);_.b(" ");_.b("\n" + i);_.b("			</div>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/lastfm", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<a href=\"/auth/lastfm\" class=\"lastfm_auth_button lastfm-connect js-connect external-account-chiclet\" data-site=\"lastfm\" data-win=\"lastfm\" rel=\"popup\" title=\"Connect with Last.fm\" data-win-width=\"960\" data-win-height=\"660\">");_.b("\n" + i);_.b("  <span class=\"i-lastfm\"></span>");_.b("\n" + i);_.b("</a>");_.b("\n" + i);_.b("<span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Last.fm</a></span>");_.b("\n" + i);_.b("<span class=\"disconnect\"><a href=\"/auth/lastfm/disconnect\" class=\"js-disconnect\">Disconnect Last.fm</a></span>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,489,545,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"options clear\">");_.b("\n" + i);_.b("  <div class=\"optional\">Scrobble tracks you hear on 8tracks with Last.fm.</div>");_.b("\n" + i);_.b("  <div class=\"disconnect\">");_.b("\n" + i);if(_.s(_.f("lastfm",c,p,1),c,p,0,708,1065,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("			<div class=\"field clear checkbox\">");_.b("\n" + i);_.b("			  <label>");_.b("\n" + i);_.b("			    <input name=\"user[show_lastfm_link]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("			  	<input type=\"checkbox\" name=\"user[show_lastfm_link]\" ");if(_.s(_.f("show_lastfm_link",c,p,1),c,p,0,909,926,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_show_lastfm_link\"/>");_.b("\n" + i);_.b("					Show a link to my Last.fm account on my profile");_.b("\n" + i);_.b("				</label>");_.b("\n" + i);_.b("			</div>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/instagram", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<a href=\"/auth/instagram\" class=\"instagram_auth_button instagram-connect js-connect external-account-chiclet\" data-site=\"instagram\" data-win=\"instagram\" rel=\"popup\" title=\"Connect with Instagram\" data-win-width=\"960\" data-win-height=\"660\">");_.b("\n" + i);_.b("  <span class=\"i-instagram\"></span>");_.b("\n" + i);_.b("</a>");_.b("\n" + i);_.b("<span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Instagram</a></span>");_.b("\n" + i);_.b("<span class=\"disconnect\"><a href=\"/auth/instagram/disconnect\" class=\"js-disconnect\">Disconnect instagram</a></span>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,516,572,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"options clear\">");_.b("\n" + i);_.b("  <div class=\"optional\">Use photos from your instagram feed as cover art.</div>");_.b("\n" + i);_.b("  <div class=\"disconnect\"></div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/google_plus", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"google-plus\">");_.b("\n" + i);_.b("  <div class=\"google-plus-container external-account-chiclet\">");_.b("\n" + i);_.b("      <span class=\"i-gplus\"></span>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div>");_.b("\n" + i);_.b("    <span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Google+</a></span>");_.b("\n" + i);_.b("    <span class=\"disconnect\"><a href=\"/auth/google_plus/disconnect\" class=\"js-disconnect\">Disconnect Google+</a></span>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,395,453,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("  <div class=\"options clear\">");_.b("\n" + i);_.b("    <div class=\"optional\">Login with your Google+ account.</div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/youtube", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"google-plus\">");_.b("\n" + i);_.b("  <div class=\"google-plus-container external-account-chiclet\" style=\"font-size: 22px;\">");_.b("\n" + i);_.b("      <span class=\"i-you\" style=\"margin-right: -5px;\"></span> <span class=\"i i-tube_container_cutout\"></span>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div>");_.b("\n" + i);_.b("    <span class=\"optional\"><a href=\"#\" class=\"alt-connect flatbutton button_blue_invert\">Youtube</a></span>");_.b("\n" + i);_.b("    <span class=\"disconnect\"><a href=\"/auth/google_plus/disconnect_youtube\" class=\"js-disconnect\">Disconnect Youtube</a></span>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,502,560,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("  <div class=\"options clear\">");_.b("\n" + i);_.b("    <div class=\"optional\">Connect Youtube to listen on-demand!</div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/external_accounts/spotify", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<a href=\"");_.b(_.v(_.f("url",c,p,0)));_.b("\" class=\"spotify_auth_button spotify-connect js-connect external-account-chiclet\" data-site=\"lastfm\" data-win=\"spotify\" rel=\"popup\" title=\"Connect with Spotify\" data-win-width=\"960\" data-win-height=\"660\">");_.b("\n" + i);_.b("  <span class=\"i-spotify\"></span>");_.b("\n" + i);_.b("</a>");_.b("\n" + i);_.b("<span class=\"optional\"><a href=\"");_.b(_.v(_.f("url",c,p,0)));_.b("\" class=\"alt-connect flatbutton button_blue_invert\">Connect Spotify</a></span>");_.b("\n" + i);_.b("<span class=\"disconnect\"><a href=\"/auth/spotify/disconnect\" class=\"js-disconnect\">Disconnect Spotify</a></span>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("tooltip",c,p,1),c,p,0,503,559,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"black_tooltip\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("tooltip",c,p,0)));_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"options clear\">");_.b("\n" + i);_.b("  <!--div class=\"optional\">Scrobble tracks you hear on 8tracks with Last.fm.</div>");_.b("\n" + i);_.b("  <div class=\"disconnect\">");_.b("\n" + i);if(_.s(_.f("lastfm",c,p,1),c,p,0,725,1082,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("			<div class=\"field clear checkbox\">");_.b("\n" + i);_.b("			  <label>");_.b("\n" + i);_.b("			    <input name=\"user[show_lastfm_link]\" type=\"hidden\" value=\"0\">");_.b("\n" + i);_.b("			  	<input type=\"checkbox\" name=\"user[show_lastfm_link]\" ");if(_.s(_.f("show_lastfm_link",c,p,1),c,p,0,926,943,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b(" value=\"1\" id=\"user_show_lastfm_link\"/>");_.b("\n" + i);_.b("					Show a link to my Last.fm account on my profile");_.b("\n" + i);_.b("				</label>");_.b("\n" + i);_.b("			</div>");_.b("\n");});c.pop();}_.b("  </div-->");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define('views/user_external_account_view',['global_trax', 'lib/sessions', 'lib/_template_helpers', 'lib/jsonh.jquery', 'views/trax_view',
  'hgn!templates/external_accounts/facebook',
  'hgn!templates/external_accounts/lastfm', 'hgn!templates/external_accounts/instagram', 'hgn!templates/external_accounts/google_plus', 'hgn!templates/external_accounts/youtube', 'hgn!templates/external_accounts/spotify', 'views/google_plus_view'],
  function(TRAX, sessions, TplParams, JSONH, TraxView,
    facebookTemplate, lastfmTemplate, instagramTemplate, googlePlusTemplate, youtubeTemplate, spotifyTemplate, GooglePlusView){

  var UserExternalAccountView = TraxView.extend({
    className : 'js-connected-site clearfix tooltip_container col-xs-12 col-md-3',

    templates : {
      google_plus: googlePlusTemplate,
      facebook   : facebookTemplate,
      lastfm     : lastfmTemplate,
      instagram  : instagramTemplate,
      youtube    : youtubeTemplate,
      spotify    : spotifyTemplate
    },

    tooltips : {
      contacts_updated_but_expired : 'Your account is connected but out of sync. Click to update now.',
      error :'There was an error connecting your account, please try again later.'
    },

    // BEHAVIORS
    initialize: function(options) {
      this.user = options.user;
      this.partner = options.partner;
      this.template = this.templates[this.partner];
      if (!this.template) return false; //only render extant partners

      _.bindAll(this, 'render', 'updateView');
      this.user.bind('change:partners', this.updateView);
    },

    events: {
      'click .js-disconnect' : 'partnerDisconnect',
      'click .js-connect' : 'partnerConnectedClick',
      'click .alt-connect': 'onAltConnectClick'
    },

    listenToFacebookSettingClick : function() {
      this.$("input[type=checkbox]").change(_.bind(this.onFacebookCheckboxClick, this));
    },

    onFacebookCheckboxClick : function(event) {
      var checkbox = event.currentTarget;
      if (checkbox.checked) {
        if (this.user.get('connected_facebook_user') && !this.user.get('connected_facebook_user').granted_publish_actions) {
          // need publish_actions
          this.askFacebookPublishPermission();
        }
      }

      this.saveSettings();
    },

    updateView: function() {
      this.render();
      this.afterRender();
    },

    saveSettings : function() {
      var data = {};
      _.each(this.$('input[type=checkbox]'), function(input){
        data[input.name] = input.checked;
      });

      JSONH.now(this.user.get('path'), data, _.bind(function(json){
        //updated
        this.user.set({partners : json.partners});
      }, this), { spinner : this.$('.spin'), type : 'PUT' });
    },

    askFacebookPublishPermission : function() {
      // scope = 'scope=publish_actions,user_friends';
      score = '';
      window.open('/auth/facebook?' + scope, 'facebook', 'height=' + 362 + ',width=' + 640);
    },

    render : function() {
      var params = this.user.toJSON();
      params['GOOGLE_CLIENT_ID'] = GOOGLE_CLIENT_ID;

      var tplParams = new TplParams(params);

      if (this.user.partnerContactsState(this.partner)) {
        _.each(this.user.partnerContactsState(this.partner).split(' '), _.bind(function(state){
          tplParams['tooltip'] = this.tooltips[state];
        }, this));
      }

      this.$el.html(this.template(tplParams));
      this.updateConnectState();

      if (this.partner == 'facebook') {
        this.listenToFacebookSettingClick();
      }

      return this;
    },

    afterRender: function() {
      if (this.partner == 'google_plus') {
        new GooglePlusView();
      }
    },

    partnerDisconnect : function(event){
      var link = $(event.currentTarget);
      link.jsonh_now(_.bind(function(json) {
        if (json.success) {
          this.user.set({partners: json.partners});
          this.user.localSave();
        }
      }, this), { type: 'DELETE' });

      return false;
    },

    updateConnectState : function() {
      this.$el.removeClass('not_connected connected contacts_updated_but_expired updating updated error');
      this.$el.addClass(this.user.partnerContactsState(this.partner));
    },

    partnerConnectedClick : function(event) {
      var el = this.$el;
      return el.hasClass('contacts_updated_but_expired') || el.hasClass('error') || el.hasClass('not_connected');
    },

    onAltConnectClick : function(event){
      this.$('.external-account-chiclet').click();
      return false;
    }
  });

  return UserExternalAccountView;
});

define(
  'views/youtube_connect_view',['views/trax_view', 'lib/sessions',
    'hgn!templates/promo_views/youtube_connect', 'hgn!templates/promo_views/youtube_disconnect', 'views/google_plus_view', 'hgn!templates/youtube/popup', 'views/user_external_account_view'
    //'views/user_top_artists_form_view'
  ],
  function(TraxView, sessions, template, disconnectTemplate, GooglePlusView, popupTemplate, UserExternalAccountView){

  var YoutubeConnectView = TraxView.extend({
    id: 'youtube_connect',
    className : 'bubble',

    events : {
      'click .js-disconnect' : 'onDisconnectClick'
    },

    initialize : function(opts){
      opts = opts || {};
      _.bindAll(this, 'onConnect', 'onConnectError', 'onCurrentUserSet', 'checkProgress', 'onError', 'loadArtistPage', 'onYoutubeConnected');
      this.childViews = [];
      this.listenTo(sessions, 'youtube-connected', this.onYoutubeConnected);
      this.listenTo(sessions, 'youtube-started', this.onYoutubeStarted);

      this.progress = [];
      this.attempts = 0;
      this.disconnect = opts.disconnect;
      this.whenUserReadyOrChanged(this.onCurrentUserSet);

    },

    AUTHENTICATING_MESSAGE: 0,
    CANT_CONNECT_YOUTUBE_MESSAGE: 1,
    NO_YOUTUBE_ACTIVITY_MESSAGE: 3,
    DONE_MESSAGE: 8,
    NOT_ENOUGH_DATA_MESSAGE: 9,

    progressMessages: [
      'Authenticating your account with Google.',
      "We could not connect your YouTube account.",
      'Talking to Youtube.',
      'No YouTube activity found.',
      'Recommendation server is taking too long to answer.',
      "Creating your taste profile.",
      "Feeding servers with YouTube favorites",
      "Creating recommendations.",
      'Done.',
      'There is not enough data in your YouTube profile. Like or Favorite some music on YouTube and try again.'
    ],

    render : function(){
      if (this.disconnect) {
        this.$el.html(disconnectTemplate());
        this.externalAccountView = new UserExternalAccountView({ partner : 'youtube', user : App.Trax.currentUser, el : this.$('.youtube-connect') });
        this.externalAccountView.updateView();
      } else {
        this.$el.html(template());
      }

      this.afterRender();
      return this;
    },

    afterRender: function() {
      var self = this;
      this.googlePlusView = new GooglePlusView({ customCallback : this.onConnect, customErrorFunction : this.onConnectError });
      this.childViews.push(this.googlePlusView);
    },

    onCurrentUserSet: function(user) {
      this.user = user;
      if (this.disconnect) {
        this.user.bind('change:partners', this.onYoutubeConnected);
      }

      if (this.user.hasConnected('youtube')){
        this.$('.success').show();
      }
    },

    onYoutubeStarted: function() {
      //debugger;
      //$.facebox(popupTemplate());
      //this.appendProgress([this.AUTHENTICATING_MESSAGE]);
    },

    onConnectError : function(){
      //debugger;
      this.$('.error').html('Sorry, we couldn\'t connect to YouTube. If you are using a <em>brand</em> account, try connecting a Gmail account instead.').show();
    },

    onConnect : function(user) {
      if (user) { 
        this.$('.yt_user').html(
          '<img src="'+user.getBasicProfile().getImageUrl()+'" class="avatar" />'+
          user.getBasicProfile().getGivenName() + ' ' + user.getBasicProfile().getFamilyName()
        ).show();
      }
    },

    onYoutubeConnected : function(){
      if (this.user.hasConnected('youtube')) {
        this.$('.error').hide();
        this.$('.success').show();
      }
      this.trigger('connected');
    },


    buildRecommendations: function() {
      $.get('/youtube/recommendations.jsonh').success(this.checkProgress).error(this.onError);
    },

    onError: function(response) {
      this.appendProgress(response.progress);
      this.appendProgress([this.CANT_CONNECT_YOUTUBE_MESSAGE], {error: true});

      this.$('.success').hide();
      this.$('.instructions').show();

      this.progress = [];
      this.attempts = 0;

      //this.setupArtistFallback();
    },

    checkProgress: function() {
      var self = this;
      this.attempts++;

      $.get('/youtube/progress.jsonh').success(function(response) {
        if (self.notEnoughYoutubeData(response.progress))
          return self.noDataFallback();

        self.appendProgress(response.progress);

        if (_.include(response.progress, self.DONE_MESSAGE.toString())) {
            self.showRecommendations(response);
        } else {
          if (self.attempts <= 40)
            _.delay(self.checkProgress, 4000);
          else
            self.timeout();
        }
      });
    },

    notEnoughYoutubeData: function(progressData) {
      return _.include(progressData, this.NOT_ENOUGH_DATA_MESSAGE.toString()) || _.include(progressData, this.NO_YOUTUBE_ACTIVITY_MESSAGE.toString());
    },

    noDataFallback: function() {
      this.appendProgress([this.NOT_ENOUGH_DATA_MESSAGE], {error: true});
      this.$('.success').hide();
      this.$('.instructions').show();

      this.setupArtistFallback();
    },

    timeout: function() {
      var self = this;
      this.onError({progress: []});
    },

    // setupArtistFallback: function() {
    //   this.topArtistView = new UserTopArtistsForm({onClose: this.loadArtistPage});
    //   this.topArtistView.render();

    //   $('.initial-progress').slideUp();
    //   $('.youtube-fallback').slideDown();
    //   $('.artist-search-fallback').html(this.topArtistView.$el);
    // },

    loadArtistPage: function() {
      jQuery(document).trigger('close.facebox');
      var artistElements = this.topArtistView.selectedArtistsElements();
      var topArtist = _.first(artistElements);
      App.router.navigate(topArtist.data('artist-path'), {trigger: true});
    },

    showRecommendations: function(response) {
      this.attempts = 0;
      App.models.toc.fetch();

      _.delay(function() {
        jQuery(document).trigger('close.facebox');
        App.router.navigate(response.mix_set.web_path, {trigger: true});
      }, 3000);
    },

    appendProgress: function(messages, options) {
      var isError = options && options.error;
      if (messages && messages.length && messages.sort) {
        messages = messages.sort();
      }

      if (this.progress == messages) {
        return;
      }

      if (isError) {
        $('.extra-progress').append('<li class="done"></li>');
      }

      var container = isError? $('.error-progress') : $('.extra-progress');
      var progressMessages = this.progressMessages;

      var lis = _.map(_.uniq(messages), function(messageIndex) {
        return $('<li></li>').text(progressMessages[messageIndex]);
      });

      container.html(lis);

      this.progress = _.uniq(_.union(this.progress.sort(), messages));
    },


    onDisconnectClick : function(event){
      var link = $(event.currentTarget);
      link.jsonh_now(_.bind(function(json) {
        if (json.success) {
          App.Trax.currentUser.set({partners: json.partners});
          App.Trax.currentUser.localSave();
        }
      }, this), { type: 'DELETE' });

      return false;
    }
  });

  return YoutubeConnectView;
});


define("hgn!templates/mixes/_spotify_player", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"mix_youtube\" class=\"spotify_player clearfix\" style=\"display: none;\">");_.b("\n" + i);_.b("  <div id=\"mix_youtube_player_controls\" class=\"player_controls player_gray dark-bg clearfix clear\">");_.b("\n" + i);_.b("    <div class=\"background-blur-container\">");_.b("\n" + i);_.b("      <canvas class=\"background-blur\" width=\"100%\" height=\"100%\" style=\"width: 100%; height: 100%; opacity: 0.6;\"></canvas>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div class=\"container\">");_.b("\n" + i);_.b("      <div class=\"row\">");_.b("\n" + i);_.b("        <div class=\"player_controls_left col-xs-4 col-sm-3 col-md-3 col-lg-2 col-xl-2\">");_.b("\n" + i);_.b("          <div id=\"player_mix\" class=\"hidden-xs\">");_.b("\n" + i);_.b("            <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"cover-link\" title=\"View fullsize art\">");_.b("\n" + i);_.b("              <img src=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,670,688,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=100&h=100");});c.pop();}_.b("\" class=\"cover\" />");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("          <div id=\"youtube_rewind_button\" class=\"player_button\" title=\"Rewind\"><span class=\"i-rewind\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_play_button\" class=\"player_button\" title=\"Play\"><span class=\"i-play\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_pause_button\" class=\"player_button\" title=\"Pause\"><span class=\"i-pause\"></span></div>");_.b("\n" + i);_.b("          <div id=\"youtube_skip_button\" class=\"player_button\" title=\"Skip\"><span class=\"i-skip\"></span></div>");_.b("\n" + i);_.b("          <!--div id=\"next_mix_button\" class=\"player_button\" title=\"Next\" style=\"display: none;\"><span class=\"i-next\"></span></div-->");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"player_progress_bar player_gray col-xs-7 col-sm-6 col-md-7 col-lg-8 col-xl-8\">");_.b("\n" + i);_.b("          <div class=\"player_progress_bar_meter\" id=\"player_progress_bar_meter\"></div>");_.b("\n" + i);_.b("          <div class=\"player_progress_bar_meter\" id=\"seek_bar\" style=\"opacity: 0;\"></div>");_.b("\n" + i);_.b("          <img id=\"spotify-track-img\" class=\"\"/>");_.b("\n" + i);_.b("          <ul id=\"now_playing\"></ul>");_.b("\n" + i);_.b("          <!--a href=\"#\" class=\"\" id=\"youtube_flag_button\" title=\"Wrong video\">");_.b("\n" + i);_.b("            <span class=\"i-flag\"></span>");_.b("\n" + i);_.b("          </a-->");_.b("\n" + i);_.b("          <a href=\"#\" class=\"spotify-deeplink spotify-deeplink-button\" target=\"_blank\"><span class=\"i-spotify\"></span></a>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      ");_.b("\n" + i);_.b("        <div class=\"hidden-xs col-sm-3 col-md-2 col-lg-2 col-xl-2 transparentbox\">");_.b("\n" + i);_.b("          <div class=\"mix_interactions\">");_.b("\n" + i);_.b("            <div id=\"youtube_like_button\" class=\"");if(_.s(_.f("liked_by_current_user",c,p,1),c,p,0,2203,2209,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("active");});c.pop();}_.b(" player_button\"><span class=\"i-like\"></span></div>            ");_.b("\n" + i);_.b("            <!--a id=\"add_button\" class=\"player_button\" href=\"#\" title=\"Add to collection\" rel=\"local\">");_.b("\n" + i);_.b("              <span class=\"i-collection\"></span>");_.b("\n" + i);_.b("            </a-->");_.b("\n" + i);_.b("            <!--div id=\"youtube_sticky_button\" class=\"player_button hidden-xs\" title=\"Sticky Player\"></div-->");_.b("\n" + i);_.b("            <div id=\"yt_share\" class=\"share_interactions interactbox\" style=\"display: none;\">");_.b("\n" + i);_.b("              <div class=\"like_share\" style=\"display: none;\">Liked! Share this mix with friends:</div>");_.b("\n" + i);_.b("              <div class=\"share_view\"></div>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("            <div id=\"volume_controls_container\">");_.b("\n" + i);_.b("              <div id=\"player_volume\" class=\"hi\">");_.b("\n" + i);_.b("                <span class=\"i-volume-hi\"></span>");_.b("\n" + i);_.b("                <span class=\"i-volume-med\"></span>");_.b("\n" + i);_.b("                <span class=\"i-volume-lo\"></span>");_.b("\n" + i);_.b("                <span class=\"i-volume-mute\"></span>");_.b("\n" + i);_.b("              </div>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"clear: both;\"></div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("     </div><!--.col-->");_.b("\n" + i);_.b("   </div><!-- .container -->");_.b("\n" + i);_.b("   <span></span>");_.b("\n" + i);_.b("</div><!--#mix_youtube-->");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

/* global module */



/**
 * Class representing the API
 */
var SpotifyWebApi = (function() {
  var _baseUri = 'https://api.spotify.com/v1';
  var _accessToken = null;
  var _promiseImplementation = null;

  var WrapPromiseWithAbort = function(promise, onAbort) {
    promise.abort = onAbort;
    return promise;
  };

  var _promiseProvider = function(promiseFunction, onAbort) {
    var returnedPromise;
    if (_promiseImplementation !== null) {
      var deferred = _promiseImplementation.defer();
      promiseFunction(
        function(resolvedResult) {
          deferred.resolve(resolvedResult);
        },
        function(rejectedResult) {
          deferred.reject(rejectedResult);
        }
      );
      returnedPromise = deferred.promise;
    } else {
      if (window.Promise) {
        returnedPromise = new window.Promise(promiseFunction);
      }
    }

    if (returnedPromise) {
      return new WrapPromiseWithAbort(returnedPromise, onAbort);
    } else {
      return null;
    }
  };

  var _extend = function() {
    var args = Array.prototype.slice.call(arguments);
    var target = args[0];
    var objects = args.slice(1);
    target = target || {};
    objects.forEach(function(object) {
      for (var j in object) {
        if (object.hasOwnProperty(j)) {
          target[j] = object[j];
        }
      }
    });
    return target;
  };

  var _buildUrl = function(url, parameters) {
    var qs = '';
    for (var key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
      }
    }
    if (qs.length > 0) {
      // chop off last '&'
      qs = qs.substring(0, qs.length - 1);
      url = url + '?' + qs;
    }
    return url;
  };

  var _performRequest = function(requestData, callback) {
    var req = new XMLHttpRequest();

    var promiseFunction = function(resolve, reject) {
      function success(data) {
        if (resolve) {
          resolve(data);
        }
        if (callback) {
          callback(null, data);
        }
      }

      function failure() {
        if (reject) {
          reject(req);
        }
        if (callback) {
          callback(req, null);
        }
      }

      var type = requestData.type || 'GET';
      req.open(type, _buildUrl(requestData.url, requestData.params));
      if (_accessToken) {
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
      }
      if (requestData.contentType) {
        req.setRequestHeader('Content-Type', requestData.contentType)
      }

      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          var data = null;
          try {
            data = req.responseText ? JSON.parse(req.responseText) : '';
          } catch (e) {
            console.error(e);
          }

          if (req.status >= 200 && req.status < 300) {
            success(data);
          } else {
            failure();
          }
        }
      };

      if (type === 'GET') {
        req.send(null);
      } else {
        var postData = null
        if (requestData.postData) {
          postData = requestData.contentType === 'image/jpeg' ? requestData.postData : JSON.stringify(requestData.postData)
        }
        req.send(postData);
      }
    };

    if (callback) {
      promiseFunction();
      return null;
    } else {
      return _promiseProvider(promiseFunction, function() {
        req.abort();
      });
    }
  };

  var _checkParamsAndPerformRequest = function(requestData, options, callback, optionsAlwaysExtendParams) {
    var opt = {};
    var cb = null;

    if (typeof options === 'object') {
      opt = options;
      cb = callback;
    } else if (typeof options === 'function') {
      cb = options;
    }

    // options extend postData, if any. Otherwise they extend parameters sent in the url
    var type = requestData.type || 'GET';
    if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
      requestData.postData = _extend(requestData.postData, opt);
    } else {
      requestData.params = _extend(requestData.params, opt);
    }
    return _performRequest(requestData, cb);
  };

  /**
   * Creates an instance of the wrapper
   * @constructor
   */
  var Constr = function() {};

  Constr.prototype = {
    constructor: SpotifyWebApi
  };

  /**
   * Fetches a resource through a generic GET request.
   *
   * @param {string} url The URL to be fetched
   * @param {function(Object,Object)} callback An optional callback
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getGeneric = function(url, callback) {
    var requestData = {
      url: url
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Fetches information about the current user.
   * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMe = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches current user's saved tracks.
   * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds a list of tracks to the current user's saved tracks.
   * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'PUT',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove a list of tracks from the current user's saved tracks.
   * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks',
      type: 'DELETE',
      postData: trackIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Checks if the current user's saved tracks contains a certain list of tracks.
   * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/tracks/contains',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of the albums saved in the current Spotify user's "Your Music" library.
   * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMySavedAlbums = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Save one or more albums to the current user's "Your Music" library.
   * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addToMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'PUT',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove one or more albums from the current user's "Your Music" library.
   * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeFromMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums',
      type: 'DELETE',
      postData: albumIds
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
   * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.containsMySavedAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/me/albums/contains',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top artists based on calculated affinity.
   * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopArtists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the current user’s top tracks based on calculated affinity.
   * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyTopTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/top/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get tracks from the current user’s recently played tracks.
   * See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyRecentlyPlayedTracks = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/recently-played'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Adds the current user as a follower of one or more other Spotify users.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Adds the current user as a follower of one or more artists.
   * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'PUT',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Add the current user as a follower of one playlist.
   * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed. For instance,
   * whether you want the playlist to be followed privately ({public: false})
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.followPlaylist = function(playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers',
      type: 'PUT',
      postData: {}
    };

    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Removes the current user as a follower of one or more other Spotify users.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Removes the current user as a follower of one or more artists.
   * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/',
      type: 'DELETE',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Remove the current user as a follower of one playlist.
   * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an empty value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.unfollowPlaylist = function(playlistId, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers',
      type: 'DELETE'
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more other Spotify users.
   * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the users sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingUsers = function(userIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: userIds.join(','),
        type: 'user'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Checks to see if the current user is following one or more artists.
   * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the user is following the artists sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.isFollowingArtists = function(artistIds, callback) {
    var requestData = {
      url: _baseUri + '/me/following/contains',
      type: 'GET',
      params: {
        ids: artistIds.join(','),
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Check to see if one or more Spotify users are following a specified playlist.
   * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
   * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an array of boolean values that indicate
   * whether the users are following the playlist sent in the request.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.areFollowingPlaylist = function(playlistId, userIds, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/followers/contains',
      type: 'GET',
      params: {
        ids: userIds.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, callback);
  };

  /**
   * Get the current user's followed artists.
   * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} [options] Options, being after and limit.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is an object with a paged object containing
   * artists.
   * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
   * artists objects. Not returned if a callback is given.
   */
  Constr.prototype.getFollowedArtists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/following',
      type: 'GET',
      params: {
        type: 'artist'
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches information about a specific user.
   * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUser = function(userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId)
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of the current user's playlists.
   * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
   * the permissions will be used.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getUserPlaylists = function(userId, options, callback) {
    var requestData;
    if (typeof userId === 'string') {
      requestData = {
        url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists'
      };
    } else {
      requestData = {
        url: _baseUri + '/me/playlists'
      };
      callback = options;
      options = userId;
    }
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a specific playlist.
   * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylist = function(playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks from a specific playlist.
   * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getPlaylistTracks = function(playlistId, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Creates a playlist and stores it in the current user's library.
   * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} userId The id of the user. If you know the Spotify URI it is easy
   * to find the id (e.g. spotify:user:<here_is_the_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.createPlaylist = function(userId, options, callback) {
    var requestData = {
      url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists',
      type: 'POST',
      postData: options
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Change a playlist's name and public/private state
   * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.changePlaylistDetails = function(playlistId, data, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId,
      type: 'PUT',
      postData: data
    };
    return _checkParamsAndPerformRequest(requestData, data, callback);
  };

  /**
   * Add tracks to a playlist.
   * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.addTracksToPlaylist = function(playlistId, uris, options, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'POST',
      postData: {
        uris: uris
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback, true);
  };

  /**
   * Replace the tracks of a playlist
   * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<string>} uris An array of Spotify URIs for the tracks
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.replaceTracksInPlaylist = function(playlistId, uris, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: { uris: uris }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Reorder tracks in a playlist
   * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {number} rangeStart The position of the first track to be reordered.
   * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
   * the end of the playlist, simply set insert_before to the position after the last track.
   * @param {Object} options An object with optional parameters (range_length, snapshot_id)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.reorderTracksInPlaylist = function(playlistId, rangeStart, insertBefore, options, callback) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'PUT',
      postData: {
        range_start: rangeStart,
        insert_before: insertBefore
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Remove tracks from a playlist
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylist = function(playlistId, uris, callback) {
    var dataToBeSent = uris.map(function(uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });

    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: { tracks: dataToBeSent }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying a snapshot id.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
   * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
   * string) and `positions` (which is an array of integers).
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function(playlistId, uris, snapshotId, callback) {
    var dataToBeSent = uris.map(function(uri) {
      if (typeof uri === 'string') {
        return { uri: uri };
      } else {
        return uri;
      }
    });
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        tracks: dataToBeSent,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
   * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
   * from the playlist.
   * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.removeTracksFromPlaylistInPositions = function(playlistId, positions, snapshotId, callback) {
    /* eslint-disable camelcase */
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/tracks',
      type: 'DELETE',
      postData: {
        positions: positions,
        snapshot_id: snapshotId
      }
    };
    /* eslint-enable camelcase */
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Upload a custom playlist cover image.
   * See [Upload A Custom Playlist Cover Image](https://developer.spotify.com/web-api/upload-a-custom-playlist-cover-image/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
   * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
   * @param {string} imageData Base64 encoded JPEG image data, maximum payload size is 256 KB.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.uploadCustomPlaylistCoverImage = function(playlistId, imageData, callback) {
    var requestData = {
      url: _baseUri + '/playlists/' + playlistId + '/images',
      type: 'PUT',
      postData: imageData.replace(/^data:image\/jpeg;base64,/, ''),
      contentType: 'image/jpeg'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Fetches an album from the Spotify catalog.
   * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbum = function(albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the tracks of an album from the Spotify catalog.
   * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
   * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbumTracks = function(albumId, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/' + albumId + '/tracks'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple albums from the Spotify catalog.
   * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
   * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAlbums = function(albumIds, options, callback) {
    var requestData = {
      url: _baseUri + '/albums/',
      params: { ids: albumIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a track from the Spotify catalog.
   * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTrack = function(trackId, options, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/tracks/' + trackId;
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple tracks from the Spotify catalog.
   * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getTracks = function(trackIds, options, callback) {
    var requestData = {
      url: _baseUri + '/tracks/',
      params: { ids: trackIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches an artist from the Spotify catalog.
   * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtist = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches multiple artists from the Spotify catalog.
   * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
   * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtists = function(artistIds, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/',
      params: { ids: artistIds.join(',') }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches the albums of an artist from the Spotify catalog.
   * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistAlbums = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/albums'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
   * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistTopTracks = function(artistId, countryId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/top-tracks',
      params: { country: countryId }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of artists related with a given one from the Spotify catalog.
   * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
   * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getArtistRelatedArtists = function(artistId, options, callback) {
    var requestData = {
      url: _baseUri + '/artists/' + artistId + '/related-artists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getFeaturedPlaylists = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/featured-playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
   * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getNewReleases = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/new-releases'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategories = function(options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
   * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategory = function(categoryId, options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} categoryId The id of the category. These can be found with the getCategories function
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getCategoryPlaylists = function(categoryId, options, callback) {
    var requestData = {
      url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Array<string>} types An array of item types to search across.
   * Valid types are: 'album', 'artist', 'playlist', and 'track'.
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.search = function(query, types, options, callback) {
    var requestData = {
      url: _baseUri + '/search/',
      params: {
        q: query,
        type: types.join(',')
      }
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Fetches albums from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchAlbums = function(query, options, callback) {
    return this.search(query, ['album'], options, callback);
  };

  /**
   * Fetches artists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchArtists = function(query, options, callback) {
    return this.search(query, ['artist'], options, callback);
  };

  /**
   * Fetches tracks from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchTracks = function(query, options, callback) {
    return this.search(query, ['track'], options, callback);
  };

  /**
   * Fetches playlists from the Spotify catalog according to a query.
   * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} query The search query
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.searchPlaylists = function(query, options, callback) {
    return this.search(query, ['playlist'], options, callback);
  };

  /**
   * Get audio features for a single track identified by its unique Spotify ID.
   * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTrack = function(trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-features/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio features for multiple tracks based on their Spotify IDs.
   * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
   * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioFeaturesForTracks = function(trackIds, callback) {
    var requestData = {
      url: _baseUri + '/audio-features',
      params: { ids: trackIds }
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get audio analysis for a single track identified by its unique Spotify ID.
   * See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
   * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAudioAnalysisForTrack = function(trackId, callback) {
    var requestData = {};
    requestData.url = _baseUri + '/audio-analysis/' + trackId;
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Create a playlist-style listening experience based on seed artists, tracks and genres.
   * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getRecommendations = function(options, callback) {
    var requestData = {
      url: _baseUri + '/recommendations'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Retrieve a list of available genres seed parameter values for recommendations.
   * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getAvailableGenreSeeds = function(callback) {
    var requestData = {
      url: _baseUri + '/recommendations/available-genre-seeds'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about a user’s available devices.
   * See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyDevices = function(callback) {
    var requestData = {
      url: _baseUri + '/me/player/devices'
    };
    return _checkParamsAndPerformRequest(requestData, {}, callback);
  };

  /**
   * Get information about the user’s current playback state, including track, track progress, and active device.
   * See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlaybackState = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Get the object currently being played on the user’s Spotify account.
   * See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.getMyCurrentPlayingTrack = function(options, callback) {
    var requestData = {
      url: _baseUri + '/me/player/currently-playing'
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Transfer playback to a new device and determine if it should start playing.
   * See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Array<string>} deviceIds A JSON array containing the ID of the device on which playback should be started/transferred.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.transferMyPlayback = function(deviceIds, options, callback) {
    var postData = options || {};
    postData.device_ids = deviceIds;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player',
      postData: postData
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Start a new context or resume current playback on the user’s active device.
   * See [Start/Resume a User’s Playback](https://developer.spotify.com/web-api/start-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.play = function(options, callback) {
    options = options || {};
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var postData = {};
    ['context_uri', 'uris', 'offset', 'position_ms'].forEach(function(field) {
      if (field in options) {
        postData[field] = options[field];
      }
    });
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/play',
      params: params,
      postData: postData
    };

    // need to clear options so it doesn't add all of them to the query params
    var newOptions = typeof options === 'function' ? options : {};
    return _checkParamsAndPerformRequest(requestData, newOptions, callback);
  };

  /**
   * Pause playback on the user’s account.
   * See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.pause = function(options, callback) {
    options = options || {};
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/pause',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to next track in the user’s queue.
   * See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToNext = function(options, callback) {
    options = options || {};
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/next',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Skips to previous track in the user’s queue.
   * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
   * Returning to the start of the current track should be performed using `.seek()`
   * See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.skipToPrevious = function(options, callback) {
    options = options || {};
    var params = 'device_id' in options ? {device_id: options.device_id} : null;
    var requestData = {
      type: 'POST',
      url: _baseUri + '/me/player/previous',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Seeks to the given position in the user’s currently playing track.
   * See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} position_ms The position in milliseconds to seek to. Must be a positive number.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.seek = function(position_ms, options, callback) {
    options = options || {};
    var params = {
      position_ms: position_ms
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/seek',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
   * See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {String} state A string set to 'track', 'context' or 'off'.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setRepeat = function(state, options, callback) {
    options = options || {};
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/repeat',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Set the volume for the user’s current playback device.
   * See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setVolume = function(volume_percent, options, callback) {
    options = options || {};
    var params = {
      volume_percent: volume_percent
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/volume',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Toggle shuffle on or off for user’s playback.
   * See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/) on
   * the Spotify Developer site for more information about the endpoint.
   *
   * @param {bool} state Whether or not to shuffle user's playback.
   * @param {Object} options A JSON object with options that can be passed.
   * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
   * one is the error object (null if no error), and the second is the value if the request succeeded.
   * @return {Object} Null if a callback is provided, a `Promise` object otherwise
   */
  Constr.prototype.setShuffle = function(state, options, callback) {
    options = options || {};
    var params = {
      state: state
    };
    if ('device_id' in options) {
      params.device_id = options.device_id;
    }
    var requestData = {
      type: 'PUT',
      url: _baseUri + '/me/player/shuffle',
      params: params
    };
    return _checkParamsAndPerformRequest(requestData, options, callback);
  };

  /**
   * Gets the access token in use.
   *
   * @return {string} accessToken The access token
   */
  Constr.prototype.getAccessToken = function() {
    return _accessToken;
  };

  /**
   * Sets the access token to be used.
   * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
   * the Spotify Developer site for more information about obtaining an access token.
   *
   * @param {string} accessToken The access token
   * @return {void}
   */
  Constr.prototype.setAccessToken = function(accessToken) {
    _accessToken = accessToken;
  };

  /**
   * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
   * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
   * for a list of some available options
   *
   * @param {Object} PromiseImplementation A Promises/A+ valid implementation
   * @throws {Error} If the implementation being set doesn't conform with Promises/A+
   * @return {void}
   */
  Constr.prototype.setPromiseImplementation = function(PromiseImplementation) {
    var valid = false;
    try {
      var p = new PromiseImplementation(function(resolve) {
        resolve();
      });
      if (typeof p.then === 'function' && typeof p.catch === 'function') {
        valid = true;
      }
    } catch (e) {
      console.error(e);
    }
    if (valid) {
      _promiseImplementation = PromiseImplementation;
    } else {
      throw new Error('Unsupported implementation of Promises/A+');
    }
  };

  return Constr;
})();

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = SpotifyWebApi;
}
;

define("vendor/spotify-web-api", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.SpotifyWebApi;
    };
}(this)));


define("hgn!templates/promo_views/spotify_connect", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div>");_.b("\n" + i);_.b("  <a href=\"");_.b(_.v(_.f("url",c,p,0)));_.b("\" class=\"spotify_auth_button spotify-connect js-connect flatbutton button_lime hugebutton\" data-site=\"lastfm\" data-win=\"spotify\" rel=\"popup\" title=\"Connect with Spotify\" data-win-width=\"960\" data-win-height=\"660\">");_.b("\n" + i);_.b("    <span class=\"success\" style=\"display: none;\"><span class=\"i-checkmark\"></span></span>");_.b("\n" + i);_.b("    <span class=\"i-spotify\"></span>");_.b("\n" + i);_.b("    Connect Spotify ");_.b("\n" + i);_.b("  </a>");_.b("\n" + i);_.b("\n" + i);_.b("  <p class=\"success disconnect center\" style=\"display: none;\"><a href=\"/auth/spotify/disconnect\" class=\"js-disconnect\">Disconnect Spotify</a></span>");_.b("\n" + i);_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("  <div style=\"display: none;\" class=\"error\"></div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div style=\"display: none;\" class=\"spotify_user\"></div>  ");_.b("\n" + i);_.b("\n" + i);_.b("  <div class=\"clear\"></div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define('views/spotify_connect_view',['global_trax', 'views/trax_view', 'views/user_external_account_view', 'hgn!templates/promo_views/spotify_connect'], function(TRAX, TraxView, UserExternalAccountView, template){

  var SpotifyConnectView = TraxView.extend({

    id: 'spotify_connect',
    className : 'js-connected-sites',
    url_params : 
    {
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email playlist-modify-private playlist-modify-public ugc-image-upload', //streaming user-read-birthdate 
      redirect_uri: window.location.protocol + '//' + window.location.host + '/spotify/connect',
      state: Math.random().toString(36).substring(2),
    },

    events : {
      'click .js-disconnect' : 'onDisconnectClick'
    },
    
    initialize : function(options){
      _.bindAll(this, 'onConnect', '_onCurrentUserSet', 'render');
      this.useLargeButton = options && options.useLargeButton;
      this.url = 'https://accounts.spotify.com/authorize?' + _.keys(this.url_params).map(key => key + '=' + encodeURIComponent(this.url_params[key])).join('&');
      App.Sessions.tryToSetCurrentUserFromBackend();
      this.whenUserReadyOrChanged(this._onCurrentUserSet);
    },

    _onCurrentUserSet : function(){
      if (TRAX.currentUser.hasConnected('spotify')) {
        this.$('.success').show();
      } else {
        this.render();
      }

      TRAX.currentUser.bind('change:partners', this.onConnect);
      //this.externalAccountsView = new UserExternalAccountView({ partner : 'spotify', user : TRAX.currentUser, el : this.el });
      //if (this.useLargeButton) this.externalAccountsView.on('rendered', this.render); //override changes made by the external view, this one is styled
      //this.render();

    },

    render : function(){
      //if (this.useLargeButton) {
      this.$el.html(template());
      // } else {
      //   this.$el.append(this.externalAccountsView.render().el);
      // }
      this.$('.alt-connect, .spotify-connect').attr('href', this.url);
      //this.onConnect();
      return this;
    },


    onConnect : function(){
      if (TRAX.currentUser.hasConnected('spotify')) {
        $.ajax('/auth/spotify/refresh',
          { success : _.bind(function(json) {
              SpotifyWebApi
              this._token = json.access_token;
              this.$('.success').show();
              this.trigger('connected');
            }, this)
          }
        );

      } else {
        this.$('.success').hide();
        this.$('.error').hide();
      }
    },

    onDisconnectClick : function(event){
      var link = $(event.currentTarget);
      link.jsonh_now(_.bind(function(json) {
        if (json.success) {
          TRAX.currentUser.set({partners: json.partners});
          TRAX.currentUser.localSave();
        }
      }, this), { type: 'DELETE' });

      return false;
    }

  });

  return SpotifyConnectView;
});


define("hgn!templates/mixes/_display", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"drop_box_overlay\" style=\"display: none;\"></div>");_.b("\n" + i);_.b("<div id=\"drop_box_text\" style=\"display: none;\">Drop files here to add tracks or artwork to your playlist</div>");_.b("\n" + i);_.b("\n" + i);_.b("<article id=\"mix_wrapper\" itemscope itemtype=\"http://schema.org/MusicRecording\" class=\"full-width\">");_.b("\n" + i);_.b("  <!-- schema.org tags -->");_.b("\n" + i);_.b("  <meta itemprop=\"url\" content=\"http://8tracks.com");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("\n" + i);_.b("  <div itemprop=\"byArtist\" itemscope itemtype=\"http://schema.org/MusicGroup\" style=\"display:none;\">");_.b("\n" + i);_.b("    <a href=\"");_.b(_.v(_.d("user.web_path",c,p,0)));_.b("\"><span itemprop=\"name\">");_.b(_.v(_.d("user.login",c,p,0)));_.b("</span></a>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div itemprop=\"audio\" itemscope itemtype=\"http://schema.org/AudioObject\" style=\"display: none;\">");_.b("\n" + i);_.b("    <meta itemprop=\"embedUrl\" content=\"https://8tracks.com/mixes/");_.b(_.v(_.f("id",c,p,0)));_.b("/player_v3_universal/autoplay\" />");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <meta name=\"thumbnailUrl\" content=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,823,841,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=100&h=100");});c.pop();}_.b("\" />");_.b("\n" + i);_.b("  <meta name=\"image\" content=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,912,930,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq500, w=640&h=640");});c.pop();}_.b("\" />");_.b("\n" + i);_.b("  <!-- end schema.org tags -->");_.b("\n" + i);_.b("\n" + i);_.b("	<div id=\"play_area\" class=\"clear\">");_.b("\n" + i);_.b("   <div class=\"background-blur-container displaymode\">");_.b("\n" + i);_.b("      <canvas class=\"background-blur\" width=\"100%\" height=\"100%\" style=\"width: 100%; height: 100%; opacity: 0.0;\" data-palette=\"");if(_.s(_.f("palette",c,p,1),c,p,0,1216,1222,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.v(_.d(".",c,p,0)));_.b(",");});c.pop();}_.b("\"></canvas>");_.b("\n" + i);_.b("      <!--div class=\"background-blur\" style=\"background-image: url('");if(_.s(_.f("mixpage_mix_cover_url",c,p,1),c,p,0,1340,1358,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq500, w=640&h=640");});c.pop();}_.b("');\"></div-->");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"container clearfix displaymode dark-bg\">");_.b("\n" + i);_.b("    <div class=\"row\" id=\"mix_audio\">");_.b("\n" + i);_.b("     <div class=\"col-xl-4 col-md-4 col-sm-6 clearfix\">");_.b("\n" + i);_.b("      <div id=\"mix_art_wrapper\">");_.b("\n" + i);_.b("    ");_.b("\n" + i);if(!_.s(_.f("async",c,p,1),c,p,1,0,0,"")){_.b("        <script>");_.b("\n" + i);_.b("          if (typeof($) !== 'function') {");_.b("\n" + i);_.b("            document.write('<div id=\"cover_facade\"></div>');");_.b("\n" + i);_.b("          }");_.b("\n" + i);_.b("          document.write('<div id=\"cover_facade\"></div>');");_.b("\n" + i);_.b("          window.hideFacade = function() {");_.b("\n" + i);_.b("            var facade = document.getElementById('cover_facade');");_.b("\n" + i);_.b("            if (facade) facade.className = 'hidden';");_.b("\n" + i);_.b("          }");_.b("\n" + i);_.b("          var src = '");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,2018,2036,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq500, w=640&h=640");});c.pop();}_.b("';");_.b("\n" + i);_.b("          if (src.match('imgix') && window.dpr !== 1) {");_.b("\n" + i);_.b("            src = src + '&dpr=' + window.dpr;");_.b("\n" + i);_.b("          }");_.b("\n" + i);_.b("\n" + i);_.b("          document.write('<img src=\"' + src + '\" class=\"cover sq500\" alt=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" id=\"cover_art\" onload=\"window.hideFacade()\"/>')");_.b("\n" + i);_.b("        </script>");_.b("\n" + i);_.b("\n" + i);_.b("        <noscript>");_.b("\n" + i);_.b("          <img src=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,2380,2398,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq500, w=640&h=640");});c.pop();}_.b("\" class=\"cover sq500\" alt=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" id=\"cover_art\" />");_.b("\n" + i);_.b("        </noscript>");_.b("\n");};if(_.s(_.f("async",c,p,1),c,p,0,2517,2712,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("        <div id=\"cover_facade\"></div>");_.b("\n" + i);_.b("        <img src=\"");if(_.s(_.f("mix_cover_url",c,p,1),c,p,0,2592,2610,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq500, w=640&h=640");});c.pop();}_.b("\" class=\"cover sq500\" alt=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" id=\"cover_art\" onload=\"hideFacade();\" />");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,2744,2832,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("        <!--span class=\"quick_actions\"><span class=\"unplayable\"></span></span-->");_.b("\n");});c.pop();}if(!_.s(_.f("read_only",c,p,1),c,p,1,0,0,"")){_.b("        <a href=\"#\" id=\"play_overlay\" class=\"quick_actions hidden-international hidden-xs\" onclick=\"window.playMixOnLoad=1; return false;\" tile=\"Play mix\" class=\"\">");_.b("\n" + i);_.b("          <span class=\"quick_actions\">");_.b("\n" + i);_.b("            <span class=\"quick_play\">");_.b("\n" + i);_.b("              <span class=\"i i-play\"></span>");_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("          </span>");_.b("\n" + i);_.b("        </a>");_.b("\n" + i);_.b("\n" + i);_.b("        <div id=\"play_loading\"><!-- class=\"hidden-md hidden-sm hidden-lg hidden-xl\"-->");_.b("\n" + i);_.b("          <div id=\"play_loading_spinner\"></div>");_.b("\n" + i);_.b("        </div>");_.b("\n");};_.b("\n" + i);_.b("      <span class=\"quick_actions secondary_cta visible-international hidden-xs\">");_.b("\n" + i);_.b("        <a href=\"#\" id=\"play_on_youtube_container\">");_.b("\n" + i);_.b("          <span class=\"flatbutton\" id=\"play_on_youtube\">");_.b("\n" + i);_.b("            <span class=\"i-play\"></span> Play via YouTube");_.b("\n" + i);_.b("          </span>");_.b("\n" + i);_.b("        </a>");_.b("\n" + i);_.b("      </span>");_.b("\n" + i);_.b("\n" + i);_.b("      <span class=\"quick_actions secondary_cta download hidden hidden-international hidden-xl hidden-lg hidden-md\">");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.f("dynamic_branch_io_deeplink",c,p,0)));_.b("\" id=\"openInAppContainer\">");_.b("\n" + i);_.b("          <span class=\"flatbutton\" id=\"openInApp\">");_.b("\n" + i);_.b("            <span class=\"i-mobile\"></span>");_.b("\n" + i);_.b("            <span class=\"text\">OPEN IN APP</span>");_.b("\n" + i);_.b("          </span>");_.b("\n" + i);_.b("        </a>");_.b("\n" + i);_.b("      </span>");_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"flaggings graybox tooltip_container\">");_.b("\n" + i);_.b("        <a class=\"flag_button nsfw red\" href=\"#\" rel=\"nofollow login_required\" data-href=\"/flaggings?flag=nsfw_cover&mix_id=");_.b(_.v(_.f("id",c,p,0)));_.b("\"><span class=\"i-flag\"></span> <span class=\"text\">NSFW</span></a>");_.b("\n" + i);_.b("        <a class=\"flag_button safe green\" href=\"#\" rel=\"nofollow login_required\" data-href=\"/flaggings?flag=safe_cover&mix_id=");_.b(_.v(_.f("id",c,p,0)));_.b("\"><span class=\"i-flag\"></span> <span class=\"text\">Safe</span></a>");_.b("\n" + i);_.b("        <!--");if(_.s(_.f("spinner",c,p,1),c,p,0,4527,4536,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("flaggings");});c.pop();}_.b("-->");_.b("\n" + i);_.b("        <div class=\"black_tooltip black_tooltip_up\">");_.b("\n" + i);_.b("          Is this playlist safe for work?");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    ");_.b("\n" + i);_.b("      <div class=\"graybox\" id=\"image_controls\">");_.b("\n" + i);_.b("        <a id=\"pinterest_button\" href=\"//www.pinterest.com/pin/create/button/?description=");_.b(_.v(_.f("name",c,p,0)));_.b("&amp;media=");if(_.s(_.f("cover_urls",c,p,1),c,p,0,4852,4881,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("escape",c,p,1),c,p,0,4863,4870,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("max1024");});c.pop();}});c.pop();}_.b("&amp;url=http://8tracks.com");_.b(_.v(_.f("web_path",c,p,0)));_.b("?utm_source=pinterest\" data-pin-do=\"buttonPin\" data-pin-config=\"none\" rel=\"popup\" data-win-width=\"770\" data-win-height=\"340\" target=\"_blank\" title=\"Share to pinterest\"><span class=\"i-pinterest\"></a>");_.b("\n" + i);_.b("        ");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.d("cover_urls.max1024",c,p,0)));_.b("\" title=\"View full size\" id=\"zoom\" target=\"_blank\" rel=\"external\"></a>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("      <div id=\"eight888\"></div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("certification",c,p,1),c,p,0,5326,5601,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("        <span class=\"certification ");_.b(_.v(_.f("certification",c,p,0)));_.b("\" title=\"This playlist is certified ");_.b(_.v(_.f("certification",c,p,0)));_.b("\">");_.b("\n" + i);_.b("          <span class=\"certification_icon\"></span> ");_.b("\n" + i);_.b("          ");_.b(_.v(_.f("certification",c,p,0)));_.b("\n" + i);_.b("          <meta itemprop=\"award\" content=\"");_.b(_.v(_.f("certification",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("        </span>");_.b("\n");});c.pop();}_.b("		</div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"col-xl-8 col-md-8 col-sm-6\">");_.b("\n" + i);_.b("    <div id=\"mix_details\" class=\"favable\">");_.b("\n" + i);_.b("      <h1 id=\"mix_name\" itemprop=\"name\" ");_.b("\n" + i);_.b("      class=\"");if(_.s(_.f("dynamic_font_size",c,p,1),c,p,0,5805,5813,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.v(_.f("name",c,p,0)));});c.pop();}_.b("\">");_.b("\n" + i);_.b("        ");_.b(_.v(_.f("name",c,p,0)));_.b("\n" + i);_.b("        ");if(!_.s(_.f("name",c,p,1),c,p,1,0,0,"")){_.b("<div class=\"display placeholder\">Title</div>");};_.b("\n" + i);_.b("      </h1>");_.b("\n" + i);_.b("\n" + i);_.b("      <div id=\"mix_description\" class=\"description clear displaymode\">");_.b("\n" + i);_.b("        <div class=\"metadata\">");_.b("\n" + i);_.b("          <div class=\"mix-data\">");_.b("\n" + i);if(_.s(_.f("published",c,p,1),c,p,0,6100,6305,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("              <!--span class=\"datetime date_ago dtstart\">");_.b("\n" + i);_.b("                ");if(_.s(_.f("human_date",c,p,1),c,p,0,6190,6208,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("first_published_at");});c.pop();}_.b("\n" + i);_.b("              </span> ");_.b("\n" + i);_.b("              <span class=\"pipe\"> | </span-->");_.b("\n");});c.pop();}_.b("\n" + i);if(_.s(_.f("duration",c,p,1),c,p,0,6346,6659,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("tracks_count",c,p,1),c,p,0,6378,6487,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("                <span id=\"tracks_count\" class=\"gray hidden-xs\">");_.b(_.v(_.f("tracks_count",c,p,0)));_.b(" tracks</span>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("              <meta itemprop=\"duration\" content=\"UserPlays:");_.b(_.v(_.f("duration",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("\n" + i);_.b("              <span class=\"pipe hidden-sm hidden-xs\"> | </span>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("            ");_.b("\n" + i);_.b("            <span class=\"plays_count i-play\" title=\"Number of plays\" ");if(!_.s(_.f("plays_count",c,p,1),c,p,1,0,0,"")){_.b("style=\"display: none;\"");};_.b(">");_.b("\n" + i);_.b("              <strong>&nbsp;");_.b(_.v(_.d("plays_count.to_human_number",c,p,0)));_.b("</strong>");_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("            <meta itemprop=\"interactionCount\" content=\"UserPlays:");_.b(_.v(_.f("plays_count",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("\n" + i);_.b("            &nbsp;&nbsp;");_.b("\n" + i);_.b("\n" + i);_.b("            <span class=\"likes_count i-like\" title=\"Number of likes\" ");if(!_.s(_.f("likes_count",c,p,1),c,p,1,0,0,"")){_.b("style=\"display: none;\"");};_.b(">");_.b("\n" + i);_.b("              <strong>&nbsp;");if(_.s(_.f("human_number",c,p,1),c,p,0,7183,7194,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("likes_count");});c.pop();}_.b("</strong>");_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("            <!--span class=\"gray\">(view latest)</span></span-->");_.b("\n" + i);_.b("            <meta itemprop=\"interactionCount\" content=\"UserLikes:");_.b(_.v(_.f("likes_count",c,p,0)));_.b("\" />");_.b("\n" + i);_.b("\n" + i);_.b("            <span class=\"pipe p p_at_least_owner off hidden-xs\"> | </span>");_.b("\n" + i);_.b("\n" + i);_.b("            <!--div id=\"mix_interactions_bottom\">");_.b("\n" + i);_.b("              <fb:like href=\"http://8tracks.com");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" layout=\"box_count\" action=\"like\" show_faces=\"false\" share=\"false\" id=\"facebook_like_mix\"></fb:like>");_.b("\n" + i);_.b("              <div class=\"g-plusone\" data-size=\"tall\" data-href=\"http://8tracks.com");_.b(_.v(_.f("web_path",c,p,0)));_.b("\"></div>");_.b("\n" + i);_.b("             </div-->");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("             <a id=\"stats_button\" href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("/stats\" title=\"View stats\" class=\"");if(!_.s(_.f("published",c,p,1),c,p,1,0,0,"")){_.b("inactive");};_.b(" p p_at_least_owner off hidden-xs\" data-owner_id=\"");_.b(_.v(_.d("user.id",c,p,0)));_.b("\">");_.b("\n" + i);_.b("                <span class=\"i-popular\"></span>");_.b("\n" + i);_.b("                Stats");_.b("\n" + i);_.b("              </a>");_.b("\n" + i);_.b("          </div><!--.mix-data-->");_.b("\n" + i);_.b("\n" + i);_.b("          <div id=\"mix_tags_display\" itemprop=\"keywords\">");_.b("\n" + i);_.b("            ");_.b(_.t(_.f("list_artists",c,p,0)));_.b("\n" + i);_.b("            ");_.b(_.t(_.f("list_tags",c,p,0)));_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"interactbox\" id=\"mix_buttons\">");_.b("\n" + i);_.b("\n" + i);_.b("          <div class=\"mix_interactions\">");_.b("\n" + i);_.b("            <a id=\"like_button\" href=\"/mixes/");_.b(_.v(_.f("id",c,p,0)));_.b("/toggle_like\" class=\"flatbutton like inactive edit_disable p p_not_owner on\" data-method=\"post\" data-mix_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-owner_id=\"");_.b(_.v(_.d("user.id",c,p,0)));_.b("\" rel=\"signup_required nofollow\" title=\"Add this playlist to my favorites\">");_.b("\n" + i);_.b("              <span class=\"i-like\"></span>");_.b("\n" + i);_.b("              <span class=\"text hidden-xs hidden-sm\">Like<span class=\"activated\">d</span></span>");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("\n" + i);_.b("            <a id=\"add_button\" class=\"flatbutton\" href=\"#\" title=\"Add to collection\" rel=\"local\">");_.b("\n" + i);_.b("              <span class=\"i-collection\"></span>");_.b("\n" + i);_.b("              <span class=\"text hidden-xs hidden-sm\">Collect</span>");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("\n" + i);_.b("            <a id=\"share_button\" class=\"flatbutton edit_disable\" title=\"Share\" href=\"#\" rel=\"signup_required local\" ");if(!_.s(_.f("published",c,p,1),c,p,1,0,0,"")){_.b("style=\"display: none;\"");};_.b(">");_.b("\n" + i);_.b("              <span class=\"i-share\"></span>");_.b("\n" + i);_.b("             <span class=\"text hidden-xs hidden-sm\">Share</span>");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("\n" + i);_.b("            <a id=\"edit_button\" href=\"#\" title=\"Edit playlist\" class=\"flatbutton ");if(_.s(_.f("published",c,p,1),c,p,0,9411,9420,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("published");});c.pop();}_.b(" p p_at_least_owner off\" data-owner_id=\"");_.b(_.v(_.d("user.id",c,p,0)));_.b("\">");_.b("\n" + i);_.b("              <span class=\"i-edit\"></span>");_.b("\n" + i);_.b("              <span id=\"edit_spinner\"></span>");_.b("\n" + i);_.b("              <span class=\"text hidden-xs hidden-sm\">Edit</span>");_.b("\n" + i);_.b("            </a>");_.b("\n" + i);_.b("\n" + i);_.b("            <!--a id=\"visualize\" href=\"#\" title=\"Visualize\" class=\"flatbutton hidden-xs\" style=\"display: none;\">");_.b("\n" + i);_.b("              <span class=\"i-logo\"></span>");_.b("\n" + i);_.b("              <span class=\"text hidden-xs hidden-sm\">celebrate</span>");_.b("\n" + i);_.b("            </a-->");_.b("\n" + i);_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("          <div id=\"add_to_collections\" style=\"display: none;\"></div>");_.b("\n" + i);_.b("            ");_.b("\n" + i);_.b("          <div id=\"share\" class=\"share_interactions\" style=\"display: none;\">");_.b("\n" + i);_.b("            <div class=\"like_share\" style=\"display: none;\">Liked! Share this mix with friends:</div>");_.b("\n" + i);_.b("            <div class=\"share_view\"></div>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("          <div id=\"share_by_email\" class=\"interactbox\" style=\"display: none;\">");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("      </div><!--mix_description-->");_.b("\n" + i);_.b("\n" + i);_.b("    </div><!--.mix_details -->");_.b("\n" + i);_.b("    </div><!--.col -->");_.b("\n" + i);_.b("   </div><!-- #mix_audio -->");_.b("\n" + i);_.b("   <div id=\"mix_youtube_inpage\" style=\"display: none;\">");_.b("\n" + i);_.b("      <h1 style=\"visibility: hidden;\">");_.b(_.v(_.f("name",c,p,0)));_.b("</h1>");_.b("\n" + i);_.b("      <div id=\"mix_youtube_placeholder\"></div>");_.b("\n" + i);_.b("   </div>");_.b("\n" + i);_.b("  </div><!-- .container -->");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b(" </div><!-- #play_area -->");_.b("\n" + i);_.b("</article><!-- #mix_wrapper -->");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,10745,12428,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div id=\"disabled_mix_field\" class=\"displaymode\">");_.b("\n" + i);_.b("   <div class=\"container\">");_.b("\n" + i);_.b("    <div class=\"row clearfix\">");_.b("\n" + i);_.b("      <div class=\"col-xs-12\">");_.b("\n" + i);_.b("        <div class=\"card wide_card\" id=\"disabled_mix_message\">");_.b("\n" + i);_.b("          <span class=\"unplayable\"></span>");_.b("\n" + i);_.b("          ");_.b("\n" + i);_.b("          <div class=\"disabled_cta\">");_.b("\n" + i);if(_.s(_.d("similar_mixes.mixes.length.nonzero?",c,p,1),c,p,0,11090,11288,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            Check out these similar <strong>");_.b(_.v(_.f("first_tag",c,p,0)));_.b("</strong> playlists ");_.b("\n" + i);_.b("            ");if(_.s(_.d("artist_list.first",c,p,1),c,p,0,11203,11236,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("featuring <strong>");_.b(_.v(_.d(".",c,p,0)));_.b("</strong> ");});c.pop();}_.b(" and other artists.");_.b("\n");});c.pop();}if(!_.s(_.d("similar_mixes.mixes.length.nonzero?",c,p,1),c,p,1,0,0,"")){_.b("            Check out some more <strong>");_.b(_.v(_.f("first_tag",c,p,0)));_.b("</strong> playlists ");_.b("\n" + i);_.b("            ");if(_.s(_.d("artist_list.first",c,p,1),c,p,0,11488,11504,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("featuring ");_.b(_.v(_.d(".",c,p,0)));_.b(" ");});c.pop();}_.b(" ");_.b("\n" + i);_.b("            in our library.");_.b("\n" + i);_.b("            <a href=\"/explore/");_.b(_.v(_.f("first_tag",c,p,0)));_.b("\" class=\"turquoise_button flatbutton\" style=\"float: right;\">EXPLORE ");_.b(_.v(_.f("first_tag",c,p,0)));_.b(" PLAYLISTS &rarr;</a>");_.b("\n");};_.b("          </div>");_.b("\n" + i);_.b("\n" + i);_.b("          <div>");_.b("\n" + i);_.b("            <span class=\"black\">");_.b(_.v(_.f("name",c,p,0)));_.b("</span> <span style=\"font-weight: normal;\">is currently not streamable.</span>");_.b("\n" + i);_.b("            <a class=\"learn-more turquoise\" target=\"_blank\" href=\"http://blog.8tracks.com/2015/07/24/soundcloud/\"><strong>Learn More</strong></a>.");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      ");_.b("\n" + i);_.b("      <div class=\"col-xs-12\" id=\"disabled_mix_related\">");_.b("\n" + i);if(_.s(_.d("similar_mixes.mixes",c,p,1),c,p,0,12193,12360,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          <div class=\"card col-xs-12 col-sm-12 col-md-6 mix_card mix\" data-id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-nsfw=\"");_.b(_.v(_.f("nsfw",c,p,0)));_.b("\">");_.b("\n" + i);_.b(_.rp("mixes/mix_card",c,p,"            "));_.b("          </div>");_.b("\n");});c.pop();}_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("   </div>");_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("\n" + i);_.b("<div class=\"container displaymode\">");_.b("\n" + i);_.b("  <div class=\"row\">");_.b("\n" + i);_.b("      <div class=\"hidden-md col-lg-1\"></div>");_.b("\n" + i);_.b("      <div class=\"col-md-12 col-lg-10\">");_.b("\n" + i);_.b("          <!--span class=\"advertisement_text\">ADVERTISEMENT</span-->");_.b("\n" + i);_.b("          <div class=\"billboard_container\">");_.b("\n" + i);_.b("            <div id=\"mix_video_masthead\"></div>");_.b("\n" + i);_.b("            <!--div class=\"advertisement\" id=\"Custom_Campaigns\" data-slot-name=\"Custom_Campaigns\" data-size=\"main_1\"></div-->");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("      <div class=\"hidden-md col-lg-1\">");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("<div class=\"displaymode\">");_.b("\n" + i);_.b("  <div id=\"soundmanager-debug-container\" style=\"display:none\">");_.b("\n" + i);_.b("    <h6>Player Debug Information <span>Can't play anything? <a href=\"http://www.schillmania.com/projects/soundmanager2/troubleshoot/\">Troubleshoot here</a></span></h6>");_.b("\n" + i);_.b("    <div id=\"soundmanager-debug\"></div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_likes", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"user_likes clearfix\">");_.b("\n" + i);if(_.s(_.f("likes",c,p,1),c,p,0,46,232,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("user",c,p,1),c,p,0,60,220,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" title=\"");_.b(_.v(_.f("login",c,p,0)));_.b("\" class=\"user_like\">");_.b("\n" + i);_.b("        <img src=\"");if(_.s(_.f("avatar_url",c,p,1),c,p,0,160,164,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq72");});c.pop();}_.b("\" class=\"thumbnail sq64\">");_.b("\n" + i);_.b("      </a>");_.b("\n");});c.pop();}});c.pop();}_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_sidebar_collection", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"sidebar_cards\">");_.b("\n" + i);_.b("  <div class=\"card header_card\">");_.b("\n" + i);_.b("  <h6>");_.b("\n" + i);_.b("    <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\">");_.b("\n" + i);_.b("    ");_.b(_.v(_.f("name",c,p,0)));_.b("\n" + i);_.b("    <span class=\"turquoise right\">");_.b(_.v(_.d("pagination.total_entries",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    </a>");_.b("\n" + i);_.b("  </h6>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div>");_.b("\n" + i);if(_.s(_.f("mixes",c,p,1),c,p,0,222,264,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(_.rp("mixes/sidebar_collection_mix",c,p,"    "));});c.pop();}_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("web_path",c,p,1),c,p,0,297,424,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <div class=\"card footer_card\">");_.b("\n" + i);_.b("  <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\">View all ");_.b(_.v(_.d("pagination.total_entries",c,p,0)));_.b(" playlists &rarr;</a>");_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_sidebar_collection_mix", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"card sidebar_mix\">");_.b("\n" + i);_.b("  <div class=\"cover\">");_.b("\n" + i);_.b("    <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("#");if(_.s(_.f("autoplay",c,p,1),c,p,0,92,99,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("play=1&");});c.pop();}_.b("smart_id=");_.b(_.v(_.f("smart_id",c,p,0)));_.b("\"rel=\"mix\" class=\"cover\">");_.b("\n" + i);_.b("      ");if(_.s(_.f("mix_cover_img",c,p,1),c,p,0,183,199,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=75&h=75");});c.pop();}_.b("\n" + i);_.b("      ");if(_.s(_.f("autoplay",c,p,1),c,p,0,237,306,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"play_circle_overlay\"><span class=\"i-play\"></span></span>");});c.pop();}_.b("\n" + i);_.b("    </a>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <a class=\"title black\" href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"black\">");_.b(_.v(_.f("name",c,p,0)));_.b("</a>");_.b("\n" + i);_.b("  <p class=\"tags\">");_.b(_.t(_.f("grid_tags",c,p,0)));_.b("</p>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_mix_card", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("  <div class=\"mix_element\">");_.b("\n" + i);_.b("    <div class=\"grid_square tooltip_container\">");_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"cover ");if(_.s(_.d("cover_urls.animated",c,p,1),c,p,0,125,133,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("animated");});c.pop();}_.b("\" ");if(_.s(_.d("cover_urls.animated",c,p,1),c,p,0,183,279,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("style=\"background-image: url('");_.b(_.v(_.d("cover_urls.static_cropped_imgix_url",c,p,0)));_.b("'); background-size: 100%;\"");});c.pop();}_.b(">");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("#smart_id=");_.b(_.v(_.f("smart_id",c,p,0)));_.b("\" class=\"mix_url\"");if(_.s(_.f("track_click",c,p,1),c,p,0,389,524,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" data-track=\"true\" data-event_name=\"");_.b(_.v(_.f("event_name",c,p,0)));_.b("\" ");if(_.s(_.f("event_properties",c,p,1),c,p,0,462,503,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("data-event_properties_");_.b(_.v(_.f("name",c,p,0)));_.b("=\"");_.b(_.v(_.f("val",c,p,0)));_.b("\" ");});c.pop();}});c.pop();}_.b(">");_.b("\n" + i);_.b("          ");if(_.s(_.f("mix_cover_img",c,p,1),c,p,0,570,588,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq250, w=245&h=245");});c.pop();}_.b("\n" + i);_.b("          ");if(_.s(_.f("certification",c,p,1),c,p,0,635,772,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"certification ");_.b(_.v(_.f("certification",c,p,0)));_.b("\" title=\"");_.b(_.v(_.f("certification",c,p,0)));_.b("\"><span class=\"certification_icon\"></span> ");_.b(_.v(_.f("certification",c,p,0)));_.b("</span>");});c.pop();}_.b("\n" + i);_.b("          ");if(_.s(_.f("is_promoted",c,p,1),c,p,0,817,888,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"sponsored\" title=\"Sponsored mix\" title=\"Sponsored\"></span>");});c.pop();}_.b("\n" + i);_.b("        </a>");_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,940,992,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          <span class=\"unplayable\"></span>");_.b("\n");});c.pop();}_.b("          ");_.b("\n" + i);_.b("        <div class=\"quick_actions\">");_.b("\n" + i);if(!_.s(_.f("read_only",c,p,1),c,p,1,0,0,"")){_.b("            <a class=\"quick_play\" href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("#smart_id=");_.b(_.v(_.f("smart_id",c,p,0)));_.b("&play=1\" title=\"play\"");if(_.s(_.f("track_click",c,p,1),c,p,0,1190,1325,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" data-track=\"true\" data-event_name=\"");_.b(_.v(_.f("event_name",c,p,0)));_.b("\" ");if(_.s(_.f("event_properties",c,p,1),c,p,0,1263,1304,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("data-event_properties_");_.b(_.v(_.f("name",c,p,0)));_.b("=\"");_.b(_.v(_.f("val",c,p,0)));_.b("\" ");});c.pop();}});c.pop();}_.b("><span class=\"i-play\"></span></a>");_.b("\n" + i);_.b("            <span class=\"pipe\"></span>");_.b("\n" + i);_.b("            <a class=\"quick_add\" data-mix_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-mix_name=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" title=\"Add to collection\" href=\"#\" ><span class=\"i-collection\"></span></a>");_.b("\n");};_.b("\n" + i);if(_.s(_.f("show_remove",c,p,1),c,p,0,1620,1851,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <span class=\"pipe\"></span>");_.b("\n" + i);_.b("            <a class=\"quick_remove\" data-smart-id=\"");_.b(_.v(_.f("smart_id",c,p,0)));_.b("\" data-mix-id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-mix-name=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\" title=\"Hide from your history\" href=\"#\"><span class=\"i-x\"></span></a>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("        ");if(_.s(_.d("cover_urls.animated",c,p,1),c,p,0,1916,1944,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"gif\">GIF</span>");});c.pop();}_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("      <h3 class=\"title black\">");_.b("\n" + i);_.b("        <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("#smart_id=");_.b(_.v(_.f("smart_id",c,p,0)));_.b("\"");if(_.s(_.f("track_click",c,p,1),c,p,0,2082,2184,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" data-track=\"true\" ");if(_.s(_.f("event_properties",c,p,1),c,p,0,2122,2163,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("data-event_properties_");_.b(_.v(_.f("name",c,p,0)));_.b("=\"");_.b(_.v(_.f("val",c,p,0)));_.b("\" ");});c.pop();}});c.pop();}_.b(">");_.b("\n" + i);_.b("          ");_.b(_.v(_.f("name",c,p,0)));_.b("\n" + i);_.b("        </a>");_.b("\n" + i);_.b("      </h3>");_.b("\n" + i);_.b("\n" + i);_.b("      <p class=\"byline mix_card_date\">");_.b("\n" + i);if(_.s(_.f("published",c,p,1),c,p,0,2308,2516,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          Published");_.b("\n" + i);_.b("          <span class=\"date\">");_.b("\n" + i);_.b("            <abbr class=\"timeago\" title=\"");_.b(_.v(_.f("first_published_at_timestamp",c,p,0)));_.b("\">");if(_.s(_.f("human_date",c,p,1),c,p,0,2449,2467,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("first_published_at");});c.pop();}_.b("</abbr>");_.b("\n" + i);_.b("          </span>");_.b("\n");});c.pop();}_.b("        ");if(!_.s(_.f("published",c,p,1),c,p,1,0,0,"")){_.b("Private playlist");};_.b("\n" + i);_.b("      </p>");_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"frontside\">");_.b("\n" + i);_.b("        <div class=\"mix-stats\">");_.b("\n" + i);_.b("          <span class=\"numbers\">");_.b("\n" + i);_.b("            <span class=\"plays_count i-miniplay\" title=\"Number of plays\">");_.b("\n" + i);_.b("              ");if(_.s(_.f("human_number",c,p,1),c,p,0,2796,2807,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("plays_count");});c.pop();}_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("            &nbsp;&nbsp;");_.b("\n" + i);_.b("            <span class=\"likes_count i-miniheart\" title=\"Number of likes\">");_.b("\n" + i);_.b("             ");if(_.s(_.f("human_number",c,p,1),c,p,0,2975,2986,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("likes_count");});c.pop();}_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("            &nbsp;&nbsp;");_.b("\n" + i);_.b("            <span class=\"tracks_count i-feed-bold\" title=\"Tracks count\">");_.b("\n" + i);_.b("              <!--");if(_.s(_.f("human_duration",c,p,1),c,p,0,3159,3167,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("duration");});c.pop();}_.b("-->");_.b("\n" + i);_.b("              ");if(_.s(_.f("tracks_count",c,p,1),c,p,0,3221,3246,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" ");_.b(_.v(_.f("tracks_count",c,p,0)));_.b(" tracks ");});c.pop();}_.b("\n" + i);_.b("            </span>");_.b("\n" + i);_.b("          </span>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"grid_tags tags\">");_.b("\n" + i);_.b("          ");_.b(_.t(_.f("list_artists",c,p,0)));_.b("\n" + i);_.b("          ");_.b(_.t(_.f("grid_tags",c,p,0)));_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("debug_info",c,p,1),c,p,0,3449,3544,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          <div class=\"debug_info black_tooltip\">");_.b("\n" + i);_.b("            ");_.b(_.t(_.d(".",c,p,0)));_.b("\n" + i);_.b("          </div>");_.b("\n");});c.pop();}_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("      <div class=\"description\">");_.b("\n" + i);_.b("        ");if(_.s(_.f("first_sentence",c,p,1),c,p,0,3633,3644,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("description");});c.pop();}_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("\n" + i);_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("  </div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mixes/_details", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"card displaymode\">");_.b("\n" + i);_.b("  <div id=\"user_byline\">");_.b("\n" + i);if(_.s(_.f("user",c,p,1),c,p,0,69,1055,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" rel=\"user\" title=\"");_.b(_.v(_.f("login",c,p,0)));_.b("'s profile\">");_.b("\n" + i);_.b("        ");if(_.s(_.f("avatar_img",c,p,1),c,p,0,162,180,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("sq100, w=100&h=100");});c.pop();}_.b("\n" + i);_.b("      </a>");_.b("\n" + i);_.b("\n" + i);_.b("      <span class=\"byline\">");_.b("\n" + i);_.b("        by <a class=\"propername\" href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" rel=\"user\">");_.b(_.v(_.f("login",c,p,0)));_.b("</a> ");_.b("\n" + i);_.b("        ");if(_.s(_.f("badge",c,p,1),c,p,0,333,338,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("small");});c.pop();}_.b("\n" + i);_.b("      </span>");_.b("\n" + i);_.b("\n" + i);_.b("      <span class=\"options p p_not_owner on ");if(_.s(_.f("location",c,p,1),c,p,0,421,426,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("fixed");});c.pop();}_.b("\" data-owner_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\">");_.b("\n" + i);if(_.s(_.f("followed_by_current_user",c,p,1),c,p,0,502,717,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("          <a href=\"");_.b(_.v(_.f("path",c,p,0)));_.b("/toggle_follow\" title=\"Follow ");_.b(_.v(_.f("login",c,p,0)));_.b("\" class=\"follow turquoise_button flatbutton p p_not_owner\" data-owner_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-user_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" rel=\"signup_required\">Following</a>");_.b("\n");});c.pop();}if(!_.s(_.f("followed_by_current_user",c,p,1),c,p,1,0,0,"")){_.b("            <a href=\"");_.b(_.v(_.f("path",c,p,0)));_.b("/toggle_follow\" title=\"Follow ");_.b(_.v(_.f("login",c,p,0)));_.b("\" class=\"follow turquoise_button flatbutton p p_not_owner\" data-owner_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-user_id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" rel=\"signup_required nofollow\">Follow</a>");_.b("\n");};_.b("      </span>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <hr class=\"divide\" />");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,1116,1266,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <div id=\"play_on_youtube_container\"><a href=\"#\" class=\"flatbutton\" id=\"play_on_youtube\"><span class=\"i-play\"></span> Play on YouTube</a></div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("\n" + i);_.b("  ");if(_.s(_.d("description_html.length.nonzero",c,p,1),c,p,0,1321,1335,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<h6>Notes</h6>");});c.pop();}_.b("\n" + i);_.b("  <div id=\"description_html\" itemprop=\"description\">");_.b("\n" + i);_.b("    ");_.b(_.t(_.f("description_html",c,p,0)));_.b("\n" + i);_.b("\n" + i);_.b("    <!--p><a href=\"#\" class=\"download_tracklist flatbutton turquoise_button\">Download Tracklist (.txt file) &rarr;</a></p-->");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <hr />");_.b("\n" + i);_.b("\n" + i);_.b("  <div id=\"playlists\">");_.b("\n" + i);_.b("    <div id=\"playlist\" class=\"playlist displaymode\"");if(!_.s(_.f("read_only",c,p,1),c,p,1,0,0,"")){_.b("style=\"display: none;\"");};_.b(">");_.b("\n" + i);_.b("      <ul id=\"tracks_played\">");_.b("\n" + i);if(_.s(_.f("read_only",c,p,1),c,p,0,1776,1934,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("tracks",c,p,1),c,p,0,1798,1914,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <li class=\"track\" data-id=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\">");_.b("\n" + i);_.b(_.rp("tracks/track_played",c,p,"              "));_.b("            </li>");_.b("\n");});c.pop();}});c.pop();}_.b("      </ul>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    ");_.b("\n" + i);if(_.s(_.f("tracks_count",c,p,1),c,p,0,1998,2060,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <h6 id=\"tracks_count\">");_.b(_.v(_.f("tracks_count",c,p,0)));_.b(" tracks</h6>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/mix_sets/_related_collections", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"sidebar_cards suggested_collections\">");_.b("\n" + i);_.b("  <div class=\"card header_card\">");_.b("\n" + i);_.b("    <h6> <span class=\"i-collection\" style=\"font-size: 20px;\"></span> Related collections</h6>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div>");_.b("\n" + i);_.b("\n" + i);if(_.s(_.f("collections",c,p,1),c,p,0,214,721,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <div class=\"suggested_collection card\">");_.b("\n" + i);_.b("      <a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"suggestion\">");_.b("\n" + i);_.b("        <div class=\"covers\" rel=\"mix\">");_.b("\n" + i);if(_.s(_.f("cover_urls",c,p,1),c,p,0,372,437,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <img src=\"");_.b(_.v(_.d(".",c,p,0)));_.b("\" class=\"cover_quarter\" />");_.b("\n");});c.pop();}_.b("        </div>");_.b("\n" + i);_.b("\n" + i);_.b("        <span class=\"title black clear\">");_.b(_.v(_.f("name",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("        <span class=\"featherweight\">by ");_.b(_.v(_.d("user.login",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("        <span class=\"gray\">(");_.b(_.v(_.f("mixes_count",c,p,0)));_.b(" ");if(_.s(_.f("pluralize",c,p,1),c,p,0,644,674,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("mixes_count playlist playlists");});c.pop();}_.b(")</span>");_.b("\n" + i);_.b("      </a>");_.b("\n" + i);_.b("    </div>");_.b("\n");});c.pop();}_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/blogs/_related_blogs", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"sidebar_cards\">");_.b("\n" + i);_.b("  <div class=\"card header_card\">");_.b("\n" + i);_.b("    <h6>");_.b("\n" + i);_.b("      Related Articles");_.b("\n" + i);_.b("    </h6>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("\n" + i);_.b("  <div>");_.b("\n" + i);if(_.s(_.f("related_blogs",c,p,1),c,p,0,143,558,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("      <div class=\"card blog_card dark-bg\">");_.b("\n" + i);_.b("        <div class=\"master_image\" style=\"background-image: url('");_.b(_.v(_.d("image_urls.original",c,p,0)));_.b("&w=300'); background-color: ");_.b(_.v(_.d("color_palette.last",c,p,0)));_.b(";\" class=\"master_image\">");_.b("\n" + i);_.b("          <div class=\"cardbg\">");_.b("\n" + i);_.b("            <h6><a href=\"");_.b(_.v(_.f("web_path",c,p,0)));_.b("\" class=\"black\">");_.b(_.v(_.f("title",c,p,0)));_.b("</strong></a></h6>");_.b("\n" + i);_.b("            <p class=\"tags\">");_.b(_.t(_.f("grid_tags",c,p,0)));_.b("</p>");_.b("\n" + i);_.b("          </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("      </div>");_.b("\n");});c.pop();}_.b("  </div>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});


define("hgn!templates/admin/_nsfw_stats", ["hogan"], function(hogan){  var tmpl = new hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"stats\">");_.b("\n" + i);_.b("  <strong>NSFW</strong> (<span class=\"not_safe_flags\">");_.b(_.v(_.d("flaggings.regular_flags",c,p,0)));_.b("</span>) <span class=\"not_safe_percent\">0%</span>");_.b("\n" + i);_.b("  <div class=\"not_safe stat\" style=\"width: 0%;\"></div>");_.b("\n" + i);_.b("  ");_.b("\n" + i);_.b("  <strong>Safe</strong> (<span class=\"safe_flags\">");_.b(_.v(_.d("flaggings.safe_flags",c,p,0)));_.b("</span>) <span class=\"safe_percent\">0%</span>");_.b("\n" + i);_.b("  <div class=\"safe stat\" style=\"width: 0;\"></div>");_.b("\n" + i);_.b("</div>");return _.fl();;}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});

define('views/mix_player_view',
  ['global_trax', 'lib/events', 'views/trax_view', 'lib/_template_helpers', 'lib/player/mix_player',
  'views/track_played_view', 'hgn!templates/mixes/mix_player', 'hgn!templates/mixes/_player_mix_details',
  'hgn!templates/artists/_player_details', 'lib/client_storage',
  'views/detector_view',
  'jquery.volume', 'jquery.hoverDelegate', 'lib/jsonh.jquery', 'views/feature_fm_view', 'lib/cast_sender'],
  function(TRAX, Events, TraxView, TplParams, MixPlayer,
    TrackPlayedView, mixPlayerTemplate, mixDetailsTemplate,
    ArtistDetailsTemplate, ClientStorage,
    DetectorView,
    Volume, hoverDelegate, JSONH, FeatureFmView, cast) {

PREROLL_TIMEOUT = 1000; //300000; //5 minutes
//PREROLL_TIMEOUT = 60000; //60 seconds

var MixPlayerView = TraxView.extend({
  el: '#player_box',

  initialize: function(options) {
    _.bindAll(this, 'play', 'onPlay', 'onPause', 'onSmPlay', 'onSkip', 'onFinish', 'onNext', 'onWhilePlaying', 'onVolumeChange', 'showSpinner', 'atMixEnd', 'atMixBeginning',
                    'hideSpinner', 'removeOnDemandYTPlayer', 'onTrackPlay', 'showCurrentTrack', 'switchSkipToNextMix', 'switchNextMixToSkip', 'onDmcaWarning', 'loadNextMix',
                    'hideArtistDetails', 'showArtistDetails', 'hideArtistDetailsLater',
                    'onCastButtonClick', 'onCastFound', 'onCastConnected', 'onCastDisconnected', 'onCastTerminated',
                    'onPrerollComplete', 'onPrerollBegin', 'onPrerollException', 'onAudioAdComplete', 'updateLikeState', 'onUserSet');

    this.childViews = [];

    this.mix = options.mix;
    this.smart_id = options.smart_id;
    this.mixPlayer = new MixPlayer({ mix: this.mix, smart_id : this.smart_id, mixPlayerView : this });

    // this.$el = $(this.el);
    this.$container = $('#player_container');
    this.$box       = $('#player_box');
    this.idSync();
  },

  render: function() {
    var tplParams = new TplParams({mix : this.mix.toJSON(), smart_id : this.smart_id});
    tplParams.tooltip_down = true;
    $(this.el).find('#player').html(mixPlayerTemplate(tplParams));
    this.$volume = this.$('#volume_controls_container');
    this.loadVolumeSlider();
    this.renderMix();



    this.mixPlayer.on('play skip resume pause', TRAX.refreshSidebarAd);

    this.$playButton  = this.$('#player_play_button');
    this.$pauseButton = this.$('#player_pause_button');
    this.$skipButton  = this.$('#player_skip_button');
    this.$nextButton  = this.$('#next_mix_button');
    this.$progressBar = this.$('#player_progress_bar');
    this.$progressBarMeter = this.$('#player_progress_bar_meter');
    this.$useChromecast = this.$("#use_chromecast");

    this.$nowPlaying   = this.$('#now_playing');
    this.$tracksPlayed = this.$('.tracks_played');
    this.$artistDetails = $('#player_artist_details');

    this.bindPlayerEvents();
    this.bindSpacebar();
    this.setupHover();

    this.setupChromeCast();
    this.$('#player_spinner').html(TRAX.spinner( { length : 10, radius: 10, color : "#ffffff", width: 2 }));

    window.onbeforeunload = this.onWindowUnload;
    
    $('#sale_header').empty().hide();

    return this;
  },

  loadMix: function(mix, smart_id) {
    if (this.mix) {
      this.mix.unbind('change:liked_by_current_user', this.updateLikeState);
    }

    this.mix = mix;
    this.mixPlayer.pause();
    this.mixPlayer.unloadTrack();
    this.mix.on('change:liked_by_current_user', this.updateLikeState);
    this.updateLikeState();

    if(smart_id) { this.smart_id = smart_id; }

    this.mixPlayer.mix      = this.mix;
    this.mixPlayer.smart_id = this.smart_id;
    this.hideSpinner();
    clearTimeout(this.skipTimer);
    this.switchNextMixToSkip();
    this.renderMix();
  },

  renderMix : function(){
    var tplParams = new TplParams({mix : this.mix.toJSON(), smart_id : this.smart_id});
    tplParams.tooltip_down = true;
    $(this.el).find('#player_mix').html(mixDetailsTemplate(tplParams));
    this.setGradient();
  },

  show : function(){
    this.render();
    this.$box.slideDown();
  },

  events: {
    'click #player_play_button' : 'playButton',
    'click #player_pause_button': 'pauseButton',
    'click #player_skip_button' : 'skipButton',
    'click #next_mix_button'    : 'nextButton',
    'click #use_chromecast'     : 'onCastButtonClick',
    'click #player_like_button' : 'likeButton',
    'click #close_artist_details, #player_artist_info_button, #now_playing .a' : 'toggleArtistDetails',
    'click #close_artist_details': 'disableArtistDetails',
    'click .flag_bio' : 'flagArtistBio',
    'click #sticky_player_box .close_ad' : 'closeStickyAd',
    'click .on_demand_popup_cta  .close' : 'closeOnDemandPrompt',
    'click .on_demand_prompt' : 'openOnDemandPopup'
  },

  onWindowUnload: function() {
    if (this.mixPlayer && this.mixPlayer.isPlaying()) {
      return "Your playlist is still playing.";
    }
  },

  bindPlayerEvents : function() {
    this.mixPlayer.on('play resume',  this.onPlay);
    this.mixPlayer.on('smPlay',       this.onSmPlay);
    this.mixPlayer.on('pause',        this.onPause);
    this.mixPlayer.on('skip',         this.onSkip);
    this.mixPlayer.on('finish',       this.onFinish);
    this.mixPlayer.on('next',         this.onNext);
    this.mixPlayer.on('whilePlaying', this.onWhilePlaying);
    this.mixPlayer.on('startLoading', this.showSpinner);
    this.mixPlayer.on('doneLoading',  this.hideSpinner);
    this.mixPlayer.on('trackPlay',    this.onTrackPlay);
    this.mixPlayer.on('dmcaWarning',  this.onDmcaWarning);

    this.mixPlayer.on('trackPlay', this.showCurrentTrack);

    this.mixPlayer.on('play resume skip next', this.removeOnDemandYTPlayer);
    this.mixPlayer.on('skip_not_allowed', this.switchSkipToNextMix);
    this.mixPlayer.on('repeat_listen_limit_reached', this.playNextMix);

    this.mixPlayer.on('nextMix', this.loadNextMix);
    this.mixPlayer.on('atMixEnd', this.atMixEnd);
    this.mixPlayer.on('atMixBeginning', this.atMixBeginning);
    this.mixPlayer.on('regional_blocking', this.onRegionalBlocking);
  },

  playButton: function() {
    if (!this.waitForPreroll) this.mixPlayer.play('click');
    App.views.appView.refreshAds();
    return false;
  },

  pauseButton: function() {
    if (this.waitForPreroll) return false;
    this.mixPlayer.pause();
    this.mixPlayer.setsAPI('pause');
    App.views.appView.refreshAds();
    return false;
  },

  toggle: function(){
    if (this.waitForPreroll) return false;
    this.mixPlayer.toggle();
    return false;
  },

  skipButton: function() {
    if (this.waitForPreroll) return false;

    if (App.Sessions.loggedOut() && WEB_SETTINGS['signup_required']) {
      this.showSignupNag();
      return false;
    }

    if (this.mix.id == 6437 && !this.feature_fm_view) {
      this.playFeatureFmTrack();
    } else {
      this.$('#player_progress_bar').removeClass('show_warnings');
      this.mixPlayer.skip();
    }
    App.views.appView.refreshAds();
    return false;
  },

  nextButton: function() {
    if (this.waitForPreroll) return false;

    this.mixPlayer.playNextMix('skip');
    clearTimeout(this.dmcaWarningsTimer);
    this.$('#player_progress_bar').removeClass('show_warnings');
    return false;
  },

  likeButton : function(event) {
    var options = {};
    if (!TRAX.currentUser) {
       options.success_callback = _.bind(function() {
          this.mix.toggleLike(false, this.mix);
        }, this);
        TRAX.showSignupView(options);
        return false;
    }

    this.$('#player_like_button').toggleClass('active');

    this.mix.toggleLike();
  },

  updateLikeState: function() {
    var $link = this.$('#player_like_button');

    if (this.mix.get('liked_by_current_user')) {
      $link.addClass('active').removeClass('inactive');
    } else {
      $link.removeClass('active').addClass('inactive');
    }
  },

  showCurrentTrack: function(options) {
    options.mix = this.mix;

    var view = new TrackPlayedView(options);
    view.render();//.isPlaying(true);
    view.$('.track_details').height('auto');

    //move previous track to list
    //TODO check if track belongs to same mix and clear tracklist if necessary
    if (this.nowPlayingTrackView) {
    }

    this.nowPlayingTrackView = view;
    this.$nowPlaying.empty().append(view.$el);
    this.nowPlayingTrackView.marquee();
    this.renderArtistDetails();
  },

  renderArtistDetails : function() {
    if (this.mixPlayer.track.get('artist_details')
        && this.mixPlayer.track.get('artist_details').bio_intro) {

      var artistParams = new TplParams(this.mixPlayer.track.get('artist_details'));

      if (artistParams.bio_intro == '--- !ruby/object:Nokogiri::XML::Element {}') {
        // quick fix: if error message, act as if no artist info was found.
        this.$artistDetails.empty().html('<div class="container"><div class="row"><div class="col-md-12">We don\'t have any information on this artist.</div></div></div>');
        this.hideArtistDetails();
      } else {
        artistParams.bio_intro = artistParams.bio_intro.replace(artistParams.name, '<strong>'+artistParams.name+'</strong>');
        this.$artistDetails.html(ArtistDetailsTemplate(artistParams));
        this.showArtistPhoto();

        if (this.shouldShowArtistInfo()) {
          this.showArtistDetails();
          this.hideArtistDetailsLater(true);
        }

        var canvas = this.$artistDetails.find('.background-blur')[0];
        TRAX.setGradient(canvas, this.mix.get('color_palette'), 2);
      }
    } else {
      this.$artistDetails.empty().html('<div class="container"><div class="row"><div class="col-md-12">We don\'t have any information on this artist.</div></div></div>');
      this.hideArtistDetails();
    }
  },

  showArtistPhoto : function(){
    var photo = this.$artistDetails.find('img')[0];
    if (photo) {
      photo.onerror = _.bind(function(event){
        this.$('#artist_photo').hide();
        this.$nowPlaying.removeClass('with_artist');
        var artistParams = new TplParams(this.mixPlayer.track.get('artist_details'));
        JSONH.now('/artists/report_invalid_image',
          { source : artistParams.info_source.source, source_id : artistParams.info_source.id },
          function(json){
            //whatever,
          }, { type : 'POST' }
        );
      }, this);

      this.$nowPlaying.prepend('<span id="player_artist_info_button" style="background-image: url(\''+photo.src+'\');"/>').addClass('with_artist');
    } else {
      this.$nowPlaying.prepend('<span id="player_artist_info_button" style="background-image: url(\'/images/avatars_v3/artist.1024.png\');"/>').addClass('with_artist');
    }
  },

  showArtistDetails : function(keepOpen){
    this.keepArtistDetailsOpen = keepOpen;
    clearTimeout(this.artist_hide_timer);
    this.$artistDetails.removeClass('collapsed');
  },

  toggleArtistDetails : function(){
    clearTimeout(this.artist_hide_timer);
    if (this.$artistDetails.hasClass('collapsed')){
      this.showArtistDetails(true);
      this.enableArtistDetails();
    } else {
      this.hideArtistDetails();
    }
  },

  shouldShowArtistInfo: function() {
    return App.Sessions.loggedIn() && !ClientStorage.get('disabled_artist_info');
  },

  disableArtistDetails: function() {
    ClientStorage.set('disabled_artist_info', true);
  },

  enableArtistDetails: function() {
    ClientStorage.destroy('disabled_artist_info');
  },

  hideArtistDetailsLater : function(force){
    if (!this.keepArtistDetailsOpen || force) {
     this.artist_hide_timer = setTimeout(this.hideArtistDetails, 8000);
    }
  },

  hideArtistDetails : function(){
    this.keepArtistDetailsOpen = false;
    this.$artistDetails.addClass('collapsed');
  },

  flagArtistBio : function(event){
    if ($(event.currentTarget).hasClass('disabled')) return false;
    $(event.currentTarget).addClass('disabled');

    JSONH.now(event.currentTarget.href, { }, function(){
      //flagged!
    });

    this.$('#artist_bio p').fadeOut().queue(function(){
      var $message = $('<p style="display: none;">Thanks for flagging! We\'ll review this biography.</p>');
      $('#artist_bio').append($message);
      $message.fadeIn();
    });
    return false;
  },

  setupChromeCast: function() {
    cast.on('initialized', this.onCastInitialized);
    cast.on('castDeviceFound', this.onCastFound);
    cast.on('connected', this.onCastConnected);
    cast.on('terminated', this.onCastTerminated);

    if (cast.isInitialized() && cast.isDevicePresent()) {
      this.onCastFound();
    }
  },

  onCastFound: function() {
    if (cast.isInitialized()) {
      this.$el.addClass('has_chromecast')
      if (cast.isConnected()) {
        this.onCastConnected();
      }
    } else {
      this.$el.removeClass('has_chromecast')
    }
  },

  onCastConnected: function() {
    this.mixPlayer.onCastConnected();
    this.$useChromecast.addClass('active');
  },

  onCastDisconnected: function() {
    this.mixPlayer.switchToSoundManagerPlayer();
    this.$useChromecast.removeClass('active');
  },

  onCastTerminated: function() {
    this.onCastDisconnected();
  },

  setupHover : function(){
    this.$artistDetails.hover(_.bind(function(){
      clearTimeout(this.artist_hide_timer);
    }));

    this.$el.hoverDelegate('#player_artist_details, #player_box',
      _.bind(function() {
        clearTimeout(this.artist_hide_timer);
      }, this),
      this.hideArtistDetailsLater,
      1000, 500
    );
  },

  // options:
  //   timeout: Time to wait before removing the DMCA warning from the
  //            player.
  //            Default:  6000.
  //
  //   callback: function to call after the DMCA warning is removed.
  //            Default: undefined.
  onDmcaWarning: function(message, options) {
    if (!options.timeout) {
      options.timeout = 6000;
    }

    $('#dmca_warnings').html('<p>'+message+'</p>');
    this.$('#player_progress_bar').addClass('show_warnings');


    clearTimeout(this.dmcaWarningsTimer);

    this.dmcaWarningsTimer = setTimeout(function() {
      $('#player_progress_bar').removeClass('show_warnings');
      if (_.isFunction(options.callback)) {
        options.callback()
      }
    }, options.timeout);

    this.showOnDemandPrompt();
  },

  showOnDemandPrompt : function(){
    if (TRAX.currentUser && (TRAX.currentUser.get('admin') || _.include(SPOTIFY_TEST_USERS, TRAX.currentUser.id))) { //spotify test user group
      this.$('.on_demand_popup_cta').fadeIn();
    }
  },

  closeOnDemandPrompt : function(){
    this.$('.on_demand_popup_cta').fadeOut();
    return false;
  },

  openOnDemandPopup : function(){
    require(['views/on_demand_connect_view'], function(OnDemandConnectView) {
      window.onDemandConnectView = new OnDemandConnectView();
    });
    this.closeOnDemandPrompt();
    return false;
  
  },


  onCastButtonClick: function(e) {
    if ($(e.currentTarget).hasClass("active")) {
      this.mixPlayer.stopCasting();
    } else {
      this.mixPlayer.launchCast()
    }
    return false;
  },

  play : function(){
    this.mixPlayer.play();
    return false;
  },

  onPlay: function() {
    if (App.views.mixView && this.playAlready) {
      App.views.mixView.overlay_animation('play');
    }

    this.$playButton.hide();
    this.$pauseButton.show();
    this.playAlready = true;
  },

  onPause: function() {
    if (App.views.mixView) {
      App.views.mixView.overlay_animation('pause');
    }
    this.$playButton.show();
    this.$pauseButton.hide();
  },

  onSkip: function() {
    if (App.views.mixView) {
      App.views.mixView.overlay_animation('skip');
    }
  },

  onFinish : function(){
    if (App.Sessions.loggedOut() && WEB_SETTINGS['signup_required']) {
      this.resumeOnSignup = true;
      this.showSignupNag();
    } else {
      this.mixPlayer.next();
    }
  },

  onNext: function() {
  },

  onTrackPlay : function() {
    this.$progressBarMeter.hide().css('transform', 'scaleX(0)');
    _.defer(_.bind(function() {this.$progressBarMeter.show(); }, this));
  },

  onSmPlay: function() {
    this.$playButton.hide();
    this.$pauseButton.show();
  },

  onWhilePlaying: function(positionInSec, durationInSec) {
    // this.$progressBarMeter.css('width',
    //   parseInt(positionInSec / durationInSec * this.$progressBar.width(), 10) + 'px');
    this.$progressBarMeter.css('transform', 'scaleX('+ (positionInSec / durationInSec) + ')');
  },

  switchSkipToNextMix : function() {
    seconds_remaining = 15;
    this.$skipButton.hide();
    this.$nextButton.show();
    this.skipTimer = setTimeout(this.switchNextMixToSkip, seconds_remaining*1000);
  },

  switchNextMixToSkip : function() {
    this.$nextButton.hide();
    this.$skipButton.show();
  },

  removeOnDemandYTPlayer: function() {
    $("#ytplayer").remove();
  },

  showSpinner: function() {
    this.$el.addClass('loading');
  },

  hideSpinner: function() {
    this.$el.removeClass('loading');
  },

  loadVolumeSlider: function() {
    var rgb_volume_container, rgb_player_volume;
    var colors = this.mix.get('color_palette');
    if (colors && colors.length > 0) {
      rgb_volume_container = rgb_player_volume = 'rgb(' + this.hexToDesaturatedRgb(colors[0]).join(',') + ')';
    } else {
      rgb_volume_container =  "rgb(30, 30, 30)";
      rgb_player_volume = "rgb(3, 3, 3)";
    }
    this.$volume.volume({
      initialVolume : soundManager.defaultOptions.volume,
      change : this.onVolumeChange,
      rgb_volume_container : rgb_volume_container,
      rgb_player_volume : rgb_player_volume
    });

  },

  hexToDesaturatedRgb: function(hex) {
    var average = 50;
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        Math.floor((parseInt(result[1], 16) * 1.5 + average)/2.5),
        Math.floor((parseInt(result[2], 16) * 1.5 + average)/2.5),
        Math.floor((parseInt(result[3], 16) * 1.5 + average)/2.5)
    ] : [];
  },

  onVolumeChange: function(volume) {
    this.mixPlayer.setVolume(volume);
    this.trigger('setVolume', volume);
  },

  // Callback for when the mixPlayer returns with the next_mix response
  loadNextMix : function(source){
    var playType = 'end_of_mix';
    if (source == 'skip') {
      playType = 'skip_mix';
    }

    // sets/next_mix will respond with the correct smart_id to use
    this.smart_id = this.mixPlayer.smart_id;

    // switch pages if still on now-playing mixpage
    if (App.views.mixView && App.currentView == App.views.mixView && App.views.mixView.mix == this.mix) {
      this.loadMix(this.mixPlayer.mix);
      App.router.navigate(this.mix.get('web_path'), { trigger : true });
      this.mixPlayer.play(playType);
      return;
    }

    this.loadMix(this.mixPlayer.mix);
    this.mixPlayer.play(playType);
  },

  atMixEnd : function(){
    this.onPause();
    this.hideSpinner();
    if (App.currentPage == 'mix' && App.currentView.mix == this.mix) {
      App.currentView.$('#play_overlay').show();
    }
  },

  atMixBeginning : function(){
    if (App.currentPage == 'mix' && App.currentView.mix == this.mix && App.currentView.mixTracksPlayedView) {
      App.currentView.mixTracksPlayedView.onAtMixBeginning();
    }
  },

  bindSpacebar: function() {
    $(document).bind('keydown', _.bind(function(event) {
      if (event.keyCode == 32 && !PAGE.editMode) {
        var focusedTag = document.activeElement.tagName;
        if (focusedTag != 'INPUT' && focusedTag != 'TEXTAREA') {
          this.mixPlayer.play();
          return false;
        }
      }
    }, this));
  },

  playMix : function(playType, skipPreroll) {
    if (!TRAX.showAds() || skipPreroll) {
      this.onPrerollComplete(playType);
      return false;
    } else if (!WEB_SETTINGS['preroll_enabled'] ||
                (ClientStorage.get('saw_preroll') && Date.now() - ClientStorage.get('saw_preroll') < PREROLL_TIMEOUT)// && App.env == 'production' //only show after timeout expires
               ){
      //if (App.views.adsView) App.views.adsView.showOverlay();
      this.onPrerollComplete(playType);
    } else {
      this.playType = playType;
      this.showPrerollAd();
    }
  },

  showPrerollAd: function() {
    Events.postToStats('js.mix_player_view.showPrerollAd');

    if (this.showAdblockDetector()) return;
    
    try{
      if (!cookie.get('play_token') && !cookie.get('auth_token') || this.mixView) {
        Events.postToStats('js.mix_player_view.showPrerollAd.skip.no_token');
        this.onPrerollComplete();
        return;
      } else if (window.innerWidth < 640) {
        Events.postToStats('js.mix_player_view.showPrerollAd.skip.small_screen');
        this.onPrerollComplete();
        return;
      } else if (App.views.prerollView) {
        Events.postToStats('js.mix_player_view.showPrerollAd.prerollView.already_loaded');
        App.views.prerollView.showAd(false);
      } else {
        Events.postToStats('js.mix_player_view.showPrerollAd.prerollView.loading');
        this.waitForPreroll = true
        this.loadPreroll();
      }
    } catch(error) {
      console.warn('Caught error in showPrerollAd:' + error);
      this.waitForPreroll = false;
      this.onPrerollComplete();
    }
  },
  
  idSync : function(){
    if (cookie.get('country_code3') == 'CA') {
      var cookieSyncScript = document.createElement("script");
      cookieSyncScript.src = "https://synchrobox.adswizz.com/register2.php";
      document.body.appendChild(cookieSyncScript);

      var cookieSyncScript2 = document.createElement("script");
      cookieSyncScript2.src = "https://cdn.adswizz.com/adswizz/js/SynchroClient2.js";
      document.body.appendChild(cookieSyncScript2);

    } else {
      var cookieSyncScript = document.createElement("script");
      cookieSyncScript.src = "https://playerservices.live.streamtheworld.com/api/idsync.js?stationId=167273";
      document.body.appendChild(cookieSyncScript);
    }
  },
    
  showAudioAd : function(num_ads){
    this.playingAudioAd = true;
    this.waitForPreroll = true;
    
    try{
      if (App.views.audioAdView) {
        App.views.audioAdView.playAdPod(num_ads);
      } else {
        this.loadAudioAd(num_ads);    
      }
    } catch(error) {
      console.warn('Caught error in showAudioAd:' + error);
      this.waitForPreroll = false;
      this.onAudioAdComplete();
    }
  },
  
  loadAudioAd : function(num_ads){
    require(['views/audio_ad_view'], _.bind(
      function(AudioAdView) {
        App.views.audioAdView = new AudioAdView({
          mixPlayer : this.mixPlayer
        });
        App.views.audioAdView.bind('onAdComplete', this.onAudioAdComplete);
        App.views.audioAdView.bind('onAdBegin', this.onMidrollBegin);
        App.views.audioAdView.playAdPod(num_ads);
      }, this
    ));
  },
  
  onMidrollBegin : function(current_ad, num_ads){
    var message = 'Here is a message from our sponsors. Your playlist will resume presently. (Ad '+current_ad+' of ' +num_ads+')';
    $('#dmca_warnings').html('<p>'+message+'</p>');
    $('#player_progress_bar').addClass('show_warnings');
  },
  
  onAudioAdComplete : function(){
    this.playingAudioAd = false;
    this.waitForPreroll = false;
    $('#player_progress_bar').removeClass('show_warnings');
    this.trigger('audioAdComplete');
  },
  
  loadPreroll : function(audioAd){
    require(['views/preroll_view'], _.bind(
      function(PrerollView) {
        App.views.prerollView = new PrerollView({
          el     : '#preroll_container',
          adUnit : 'VideoPreroll',
          size   : '640x360',
          unmuted : true,
          mixPlayerView : this
          //displaySize : '640x360'
        });
        App.views.prerollView.bind('onAdComplete', this.onPrerollComplete);
        App.views.prerollView.bind('onAdBegin', this.onPrerollBegin);
        App.views.prerollView.bind('onTimeout', this.onPrerollException);
        App.views.prerollView.bind('onAdEmpty', this.onPrerollEmpty);

        Events.postToStats('js.mix_player_view.showPrerollAd.prerollView.just_loaded');
        App.views.prerollView.showAd(audioAd);
      }, this),
      _.bind(function(err){
        //prevent errors from causing stuck player
        console.warn(err);
        this.waitForPreroll = false;
        this.onPrerollComplete();
      }, this)
    );
  },

  onPrerollException : function(){
    // Edge case: when user disables adBlock but the preroll still fails.
    // this causes the message to show up when it should not and also pauses playback
    this.waitForPreroll = false;
    if (this.mixPlayer.playing) return;
    this.onPrerollComplete();
    this.onPrerollEmpty();
  },

  onPrerollBegin : function(){
    var message = 'Here is a message from our sponsors. Your playlist will begin presently.'
    this.$('#dmca_warnings').html('<p>'+message+'</p>');
    $('#player_progress_bar').addClass('show_warnings');

    try {
      Events.saw_preroll((Date.now() - ClientStorage.get('saw_preroll')) / 1000);
    } catch(e) {
      //do nothing
    }
    ClientStorage.set('saw_preroll', Date.now());
  },

  onPrerollComplete : function(playType){
    this.waitForPreroll = false;
    if (App.views.prerollView) {
      App.views.prerollView.hide();
    }
    $('#player_progress_bar').removeClass('show_warnings');
    
      
    this.mixPlayer.play(playType || this.playType);
    this.playType = false;

    if (App.views.adsView && TRAX.showAds()) App.views.adsView.showStickyAd();
  },

  onPrerollEmpty : function(){
    //when no video is available, show a static 900x600 instead
    //if (App.views.adsView) App.views.adsView.showOverlay();
  },

  playFeatureFmTrack : function(){
    try {
      if (!this.feature_fm_view) {
        this.feature_fm_view = new FeatureFmView({ mixPlayer : this.mixPlayer, mixPlayerView : this });
      }
      this.feature_fm_view.show();
      //this.feature_fm_view.on('track_finished', this.loadNextMix);
    } catch(e) {
      this.mixPlayer.timeForNextMix(true);
    }
  },

  loadFeatureFmTracking : function(track) {
    if (!this.feature_fm_view) {
      this.feature_fm_view = new FeatureFmView({ mixPlayer : this.mixPlayer, mixPlayerView : this });
      this.feature_fm_view.enableTracking(track);
    }
  },

  setGradient : function() {
    var img = this.$('#player_mix .cover')[0];
    var canvas = this.$('.background-blur')[0];
    TRAX.setGradient(canvas, this.mix.get('color_palette'), 2);
    var colors = this.mix.get('color_palette');
    if (colors && colors.length > 0) {
      var rgb = 'rgb(' + this.hexToDesaturatedRgb(colors[0]).join(',') + ')';
      this.$('.volume-container').css("background", rgb);
    } else {
      this.$('.volume-container').css("background", 'rgb(30, 30, 30)');
    }
  },

  showSignupNag : function(){
    if (App.Sessions.logged_in() || !WEB_SETTINGS['signup_required']) return;
    //this.whenUserReadyOrChanged(this.onUserSet);
    $(document).bind('onBackendLogin', this.onUserSet);

    App.Trax.showSignupView({ template : 'first_play' });
  },

  onUserSet : function(json){
    $(document).unbind('onBackendLogin', this.onUserSet);
    if (this.resumeOnSignup) {
      this.resumeOnSignup = false;
      this.mixPlayer.next();
    }
  },

  onRegionalBlocking : function(){
    if (App.views.mixView && App.views.mixView.mix.id == this.mix.id) {
      App.views.mixView.playOnYoutube();
    } else {
      App.router.navigate(this.mix.get('web_path') + '#play=1', { trigger : true });
    }
  },

  showAdblockDetector : function(){
    if (App.Sessions.loggedOut() && WEB_SETTINGS['signup_required']) {
      //don't nag users for two things at once
      return;
    }

    if (ClientStorage.get('whitelist_attempt')) {
      if (window.adblock || (App.views.adsView && App.views.adsView.adblock)) {
        TraxEvents.track('adblock: failure', {});
        this.showDetectorView();
        return true;
      } else {
        ClientStorage.destroy('whitelist_attempt');
        Events.postToStats('js.mix_player_view.showPrerollAd.skip.whitelist_thanks');
        this.onPrerollComplete();
        return true;
      }
    } else if (window.adblock || (App.views.adsView && App.views.adsView.adblock)) {
      if (navigator.userAgent.match(/opera mobi/i)) return false;
      this.showDetectorView();

      // TRAX.show_flash_error_with_timeout('It looks like you have AdBlock enabled! Please consider whitelisting 8tracks.com. Your playlist will begin in 5 seconds.', 5000);
      // _.delay(this.onPrerollComplete, 5000);
      Events.postToStats('js.mix_player_view.showPrerollAd.skip.adblock');
      return true;
    }
  },

  showDetectorView : function(){
    this.detectorView = new DetectorView({ parent : this });
    this.detectorView.bind('complete', this.onPrerollComplete);
  },
  
  closeStickyAd : function(){
    App.views.adsView.closeStickyAd();
    return false;
  },

  onClose : function(){
    this.mixPlayer.pause();
  }




});

  return MixPlayerView;
});
define('views/mix_tracks_played_view', ['views/trax_view', 'global_trax', 'lib/sessions', 'collections/tracks', 'views/track_played_view', 'hgn!templates/mixes/_tracks_played', 'lib/_template_helpers'], 
  function(TraxView, TRAX, sessions, tracksCollection, TrackPlayedView, template, TplParams){

var MixTracksPlayedView = TraxView.extend({
  el: '#playlist',
  views : [],

  initialize: function(options) {
    this.mix = options.mix;
    this.mixView = options.mixView;
    this.onDemand = options.onDemand;
    this.tracks = options.tracks;

    //this.$nowPlaying   = this.$('#now_playing');

    _.bindAll(this, 'render', 'showTrackPlayed', 'onAtMixBeginning', 'loadTrackPlayed');

    if (!this.mix.get('read_only') && !this.onDemand) {
      this.mix.onReady('tracksPlayed', this.render);
      this.mix.getTracksPlayed();
    }
  },

  render: function() {
    if (!this.rendered) {
      this.rendered = true;
      this.$el.html(template(new TplParams(this.mix)));
      this.mix.tracksPlayed.on('add', this.showTrackPlayed);
    }
    this.$tracksPlayed = this.$('#tracks_played').addClass('displaymode');
      


    if (this.mix.get('read_only')) {
      _.each(this.mix.tracks.models, this.loadTrackPlayed);
    } else if (this.onDemand) {
      
      if (this.mix.tracks) {
        this.clearTracks();
        _.each(this.mix.tracks.models, this.showTrackPlayed);
        _.defer(this.mixView.adjustPlaylistHeight);
      }
      this.mix.tracksPlayed.off('add', this.showTrackPlayed);
    } else {
      this.clearTracks();
      _.each(this.mix.tracksPlayed.models, this.showTrackPlayed);
      _.defer(this.mixView.adjustPlaylistHeight);
    }
  },

  showTrackPlayed: function(track, el) {
    var atts = {track: track, mix: this.mix, onDemand : this.onDemand};
    if (el instanceof Element) atts.el = el;
    var view = new TrackPlayedView(atts);

    view.render();
    if (!atts.el) {
      this.$tracksPlayed.append(view.el).show();
    }
    this.$el.show();
    if (this.mixView) { this.mixView.adjustPlaylistHeight(); }

    this.views.push(view);

    return view;
  },

  loadTrackPlayed : function(track) {
    //var t = tracksCollection.load(track_attr);
    var view = new TrackPlayedView({track: track, mix: this.mix, el : this.$('#tracks_played .track[data-id="'+track.id+'"]') });
    this.views.push(view);
  },

  clearTracks : function(){
    _.each(this.views, function(view) {
      view.close;
      delete view;
    });
    this.$tracksPlayed.empty();
    this.views = [];
  },


  onAtMixBeginning: function() {
    this.$tracksPlayed.empty();
    this.mix.initTracksPlayed();
    _.defer(this.mixView.adjustPlaylistHeight);
  },

  onClose: function() {
    if (this.mixPlayer) {
      this.mix.unbind('onready:tracksPlayed', this.onAtMixBeginning);
    }
  }

});

  return MixTracksPlayedView;
});
define('views/youtube_player_view',
  ['global_trax', 'views/trax_view', 'hgn!templates/mixes/_youtube_player', 'views/track_played_view', 'lib/_template_helpers', 'lib/jsonh.jquery', 'collections/mixes'],
  function(TRAX, TraxView, template, TrackPlayedView, TplParams, JSONH, mixesCollection){
  var YoutubePlayerView = TraxView.extend({
    el: "#youtube_player",

    events : { 
      "click #youtube_play_button"   : "onYoutubePlayClick",
      "click #youtube_pause_button"  : "onYoutubePauseClick",
      "click #youtube_rewind_button" : "onYoutubeRewindClick",
      "click #youtube_skip_button"   : "onYoutubeSkipClick",
      "click #youtube_flag_button"   : "onYoutubeFlagClick",
      "click #youtube_sticky_button" : "toggleSticky",
      "click #youtube_like_button"   : "toggleLike"
    },

    initialize : function(options) {
      _.bindAll(this, 'play', 'onYoutubePlayerStateChange', 'onYoutubePlayerReady', 'onYoutubePlayerError', 'youtubeEvent', 'playNextTrackOnYoutube', 'onMixViewClose', 'whilePlaying', 'showNextMixView');
      //this.mix = options.mix;
      //this.loadMix(this.mix);
      
    },

    render : function(){
      if (!this.rendered) {
        var tplParams = new TplParams(this.mix.toJSON())
        this.$el.html(template(tplParams));
      } else {
        this.$('.cover-link').attr('href', this.mix.get('web_path'));
        this.$('.cover').attr('src', this.mix.get('cover_urls')["original_imgix_url"]+'&w=100&h=100');
        this.$('#youtube_like_button').toggleClass('active', this.mix.get('liked_by_current_user'));
      }
      this.setGradient();
      this.rendered = true;
    },

    loadMix : function(mix, smart_id){
      if (mix && mix != this.mix) {
        this.mix = mix;
        if (smart_id) this.smart_id = smart_id;
        this.render();
      }
    },

    play : function(mix, track, trackIndex, playType){
      this.youtubeTrackIndex = trackIndex ? trackIndex-1 : -1;
      if (!this.mix.get('hasInternationalTracks')) {
        this.mix.bind('international_error', _.bind(function(){
          TRAX.resetRegionalBlocking();
          //this.onPlayPauseClick();
        }, this));
        return this.mix.withInternationalTracks(this.play) && false;
      }

      if (!this.sticky) { //don't need to re-transform on subsequent mixes as player will be stickied
        $('#mix_audio').hide();
        $('#mix_youtube_inpage').show();
        $('#mix_youtube').fadeIn();
        $('#mix_youtube_embed').html(TRAX.spinner({ length : 10, radius: 10, color : '#fff' }));
      }

      if (typeof YT == 'object') {
        // library already initialized
        this.playNextTrackOnYoutube();
      } else {
        //load youtube library
        window.onYouTubePlayerAPIReady = _.bind(function() {
          this.playNextTrackOnYoutube();
        }, this);
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      if (track) {
        this.track = track;
      }
      this.setsAPI('play', _.bind(function(json){
        if (json.smart_id) {
          // Sync with what the server is using
          this.smart_id = json.smart_id;
        }
      }, this), playType);

      return false;
    },

    whilePlaying : function(){
      if (this.youtube_player.getCurrentTime() > 30) {
        this.setsAPI('report');
        clearInterval(this.onWhilePlaying);
      }
    },

    rewind : function(){
      if (this.youtube_player.getCurrentTime() < 5 && this.youtubeTrackIndex > 0) {
        this.youtubeTrackIndex += -2;
        this.playNextTrackOnYoutube();
        //play prev track
      } else {
        //rewind to beginning
        this.youtube_player.seekTo(0);
      }
      //TODO add rewind
    },

    onYoutubePlayClick : function(){
      this.youtube_player.playVideo();
      return false;
    },

    pause : function(){
      this.onYoutubePauseClick();
    },

    onYoutubePauseClick : function(){
      this.youtube_player.pauseVideo();
      return false;
    },

    onYoutubeRewindClick : function(){
      this.rewind();
      return false;
    },

    onYoutubeSkipClick : function(){
      try {
        this.setsAPI('skip'); } 
      catch(e) {

      }
      this.playNextTrackOnYoutube();
      this.youtubeEvent('skip');
      return false;
    },

    playNextTrackOnYoutube : function(track){
      this.youtubeTrackIndex += 1;
      if (this.youtubeTrackIndex == this.mix.tracks.length) {
        //TODO go to next mix  
        this.setsAPI('next_mix', this.showNextMixView);
        return;
      }

      //var t = TracksCollection.load( this.mix.get('tracks')[this.youtubeTrackIndex] );
      var t = this.mix.tracks.models[this.youtubeTrackIndex];
      t.trigger('playing');
      this.track = t;

      t.getYoutubeEmbed(_.bind(function(videoId){
        if (videoId) {
          if (this.youtube_player) {
            this.youtube_player.clearVideo();
            this.youtube_player.loadVideoById(videoId);
            this.youtubeEvent('play', videoId);
          } else {
            this.youtube_player = new YT.Player('mix_youtube_embed', {
              height: '100%',
              width: '100%',
              videoId: videoId,
              autoplay: 1,
              events: {
                'onReady': this.onYoutubePlayerReady,
                'onStateChange': this.onYoutubePlayerStateChange,
                'onError': this.onYoutubePlayerError,
              }
            });
          }
        } else { //track not found or already known unplayable in this geo
          t.set('unavailable', true);
          //this.youtubeTrackIndex += 1;
          _.defer(this.playNextTrackOnYoutube);
        }
      }, this));

      
      
      if (this.nowPlayingTrackYoutubeTrackView) this.nowPlayingTrackYoutubeTrackView.close({ keepDomElement : true });
      //show track in listing
      //this.mixTracksPlayedView.showTrackPlayed(t);

      //show track in player
      this.nowPlayingTrackYoutubeTrackView = new TrackPlayedView({ track : t, el : $('#mix_youtube #now_playing')[0]});
      this.nowPlayingTrackYoutubeTrackView.render();
      this.nowPlayingTrackYoutubeTrackView.marquee();
      clearInterval(this.onWhilePlaying);
      this.onWhilePlaying = setInterval(this.whilePlaying, 5000);
    },

    youtubeEvent : function(action, video_id){
      if (typeof video_id == 'undefined') {
        video_id = this.youtube_player.getVideoData().video_id;
      }
      //var title = this.youtube_player.getVideoData().title;
      //var author = this.youtube_player.getVideoData().author;
      var t = this.mix.tracks.models[this.youtubeTrackIndex];

      $.ajax('/you_tube_tracks/'+t.id+'/'+action, { data : { you_tube_id : video_id }, method : 'POST'});
    },

    onYoutubePlayerReady : function(event) {
      event.target.playVideo();
      this.youtubeEvent('play');
    },

    onYoutubePlayerStateChange : function(event){
      // event.data == player state codes
      // -1 – unstarted
      // 0 – ended
      // 1 – playing
      // 2 – paused
      // 3 – buffering
      // 5 – video cued
      switch (this.youtube_player.getPlayerState()) {
        case 0:
          this.playNextTrackOnYoutube(); break;
        case 1:
          this.$('#mix_youtube').addClass('playing'); break;
        case 2:
          this.$('#mix_youtube').removeClass('playing'); break;
      }
    },

    onYoutubePlayerError : function(event) {
      this.youtubeEvent('report_unplayable');

      // event.data == error codes
      // 2 – invalid request
      // 100 – not found
      // 101 – embedding not allowed
      // 150 – same as 101
      this.playNextTrackOnYoutube();
    },

    onYoutubeFlagClick : function(event) {
      this.youtubeEvent('flag_invalid');
      this.playNextTrackOnYoutube();
      TRAX.show_flash_error('This video has been flagged as an incorrect track. Thanks for letting us know!', true);
      return false;
    },

    isOnMixPage : function(){ 
      return App.views.mixView && App.views.mixView.mix.id == this.mix.id;
    },

    enterStickyMode : function(event) {
      this.$el.addClass('miniplayer');
      $('#mix_audio').show();
      $('#mix_youtube_inpage').hide();
      this.sticky = true;
    },

    exitStickyMode : function(event) {
      if (!this.isOnMixPage()) return false;

      this.$el.removeClass('miniplayer');
      $('#mix_audio').hide();
      $('#mix_youtube_inpage').show();
      this.sticky = false;
    },

    toggleSticky : function(){
      if (this.sticky) {
        this.exitStickyMode();
      } else {
        this.enterStickyMode();
      }
    },

    toggleLike : function(){
      this.$('#youtube_like_button').toggleClass('active', !this.mix.get('liked_by_current_user'));
      this.mix.toggleLike();
    },

    setGradient : function(){
      var img = this.$('.cover')[0];
      var canvas = this.$('.background-blur')[0];
      TRAX.setGradient(canvas, this.mix.get('color_palette'), 2, img);
    },

    // Callback for when the mixPlayer returns with the next_mix response
    showNextMixView : function(json){
      // sets/next_mix will respond with the correct smart_id to use
      this.nextMix = mixesCollection.load(json.next_mix);
      // let the server tell us what the smart id is
      this.smart_id = json.smart_id
      

      require(['views/next_mix_view'], _.bind(function(NextMixView) {
        this.nextMixView = new NextMixView({
          nextMix: this.nextMix,
          mixPlayer: this
        });
        var skipInterruption = true; //with audio ads in place, don't interrupt between mixes for 8tracks plus prompt
        this.nextMixView.show(skipInterruption);
      }, this));
    },

    playNextMix(play_type){
      this.enterStickyMode();
      // switch pages if still on now-playing mixpage
      if (App.views.mixView && App.currentView == App.views.mixView && App.views.mixView.mix == this.mix) {

        App.router.navigate(this.nextMix.get('web_path'), { trigger : true });
      }

      this.loadMix(this.nextMix);
      this.play();
      //this.mixPlayer.play(playType);
      return;
    },


    onMixViewClose : function() {
      this.enterStickyMode();
    },

    // action can be: play, skip, next, report, next_mix
    setsAPI: function(action, callback, playType) {
      this.withToken(_.bind(function() {
        JSONH.now_with_context('/sets/' + this.playToken + '/' + action, this.setsParams(action, playType), this, function(json) {
          if (json.success) {
            if (_.isFunction(callback)) { callback(json); }
          }
        }, { spinner: false, with_lock: true, ignore_flash: true });
      }, this));
    },

    setsParams(action, playType){
      var params = {
        player : 'yt',
        include : 'track[faved+annotation+artist_details]',
        stream_source : 'youtube'
      }

      if (action == 'next_mix') {
        params['include'] += ',user,mix_set';
      }

      if (this.mix) {   params['mix_id']   = this.mix.id;   }
      if (this.track) { params['track_id'] = this.track.id; }

      // Only send smart_id on play and if the user initiated the play. auto
      // play or skip mix doesn't count.
      if (action == "play" && playType == "click") {
        params['smart_id'] = this.smart_id;
        params['play_type'] = 'mix_start_click';
      }

      return params;
    },

    // duplicated from mix_player.js
    withToken: function(callback) {
      if (!(this.playToken || this.loadTokenFromCookie())) {
        JSONH.now_with_context('/sets/new', this, function(json) {
          if (json.success) {
            this.saveNewToken(json.play_token);
            callback();
          }
        }, { spinner: false });

      } else {
        callback();
      }
    },

    // duplicated from mix_player.js
    saveNewToken: function(playToken) {
      this.playToken = playToken;
      cookie.set('play_token', playToken);
    },

    // duplicated from mix_player.js
    loadTokenFromCookie: function() {
      var c = cookie.get('play_token');

      if (c && c != 'null' && c != 'undefined') {
        this.playToken = c;
      } else {
        // generate random number
        c = parseInt(Math.random()*1000000000,0);
        this.saveNewToken(c);
      }
      return c;
    }
  });

  return YoutubePlayerView; 
});
define('views/spotify_player_view',
  ['global_trax', 'views/trax_view', 'hgn!templates/mixes/_spotify_player', 'views/track_played_view', 'lib/_template_helpers', 'lib/jsonh.jquery', 'collections/mixes', 'vendor/spotify-web-api', 'jquery.volume'],
  function(TRAX, TraxView, template, TrackPlayedView, TplParams, JSONH, mixesCollection, SpotifyWebApi, Volume){
  var SpotifyPlayerView = TraxView.extend({
    el: "#youtube_player",

    events : { 
      "click #youtube_play_button"   : "onYoutubePlayClick",
      "click #youtube_pause_button"  : "onYoutubePauseClick",
      "click #youtube_rewind_button" : "onYoutubeRewindClick",
      "click #youtube_skip_button"   : "onYoutubeSkipClick",
      "click #youtube_flag_button"   : "onYoutubeFlagClick",
      "click #youtube_like_button"   : "toggleLike",
      "click .player_progress_bar"   : "onSeekClick",
      "click .spotify-deeplink"      : "onDeeplinkClick"
    },

    initialize : function(options) {
      _.bindAll(this, 'play', 'onSpotifyPlayerStateChange', 'onSpotifyError', 'youtubeEvent', 'playNextTrackOnYoutube', 'onMixViewClose', 'whilePlaying', 'showNextMixView', 'playerReady');
      //this.mix = options.mix;
      //this.loadMix(this.mix);
    },

    initSpotifyPlayer : function(){
      if (!window.spotifyApi) window.spotifyApi = new SpotifyWebApi();

      this._token = ''; //'BQC7dqydd5jG7IgJ5UIG-y5i44FXMuzpH4rEr8QjgeuHCZE3q5HEfatm6x2jcOYr08vvhj0G8204ulJn_WPNQXZBBfJ7m5e0Y0AoWKNa12eI9YsSRt6nGaet5l4yMjrs_uuup280C5cSlL9JbGJo_-ygu5xS0TwPh86uG2TXB755Gwb6jdzRTW4McC8';
      this.spotifyPlayer = new Spotify.Player({
        name: '8tracks localhost',
        getOAuthToken: cb => { 
          $.ajax('/auth/spotify/refresh',
            { success : _.bind(function(json) {
                this._token = json.access_token;
                spotifyApi.setAccessToken(this._token);
                cb(this._token);
              }, this)
            }
          );
        }
      });

      // Error handling
      this.spotifyPlayer.addListener('initialization_error', ({ message }) => { this.onSpotifyError(message, 'initialization_error'); });
      this.spotifyPlayer.addListener('authentication_error', ({ message }) => { this.onSpotifyError(message, 'authentication_error'); });
      this.spotifyPlayer.addListener('account_error', ({ message }) => { this.onSpotifyError(message, 'account_error'); });
      this.spotifyPlayer.addListener('playback_error', ({ message }) => { this.onSpotifyError(message, 'playback_error'); });

      // Playback status updates
      this.spotifyPlayer.addListener('player_state_changed', this.onSpotifyPlayerStateChange);
      
      // Ready
      this.spotifyPlayer.addListener('ready', _.bind(function(device_id){
        console.log('Ready with Device ID', device_id);
        this.device_id = device_id.device_id;
        this.playerReady();
      }, this));

      // Not Ready
      this.spotifyPlayer.addListener('not_ready', _.bind(function(device_id){
        console.log('Device ID has gone offline', device_id.device_id);
      }, this));

      // Connect to the player!
      this.spotifyPlayer.connect();

    },

    render : function(){
      if (!this.rendered) {
        var tplParams = new TplParams(this.mix.toJSON())
        this.$el.html(template(tplParams));
        this.$progressBarMeter = $('#player_progress_bar_meter');
        this.loadVolumeSlider();
        this.loadSeekSlider();
      } else {
        this.$('.cover-link').attr('href', this.mix.get('web_path'));
        this.$('.cover').attr('src', this.mix.get('cover_urls')["original_imgix_url"]+'&w=100&h=100');
        this.$('#youtube_like_button').toggleClass('active', this.mix.get('liked_by_current_user'));
      }
      this.setGradient();
      this.rendered = true;

    },

    loadMix : function(mix, smart_id){
      if (mix && mix != this.mix) {
        this.mix = mix;
        if (smart_id) this.smart_id = smart_id;
        this.render();
      }
    },

    play : function(mix, track, trackIndex, playType){
      this.youtubeTrackIndex = trackIndex ? trackIndex-1 : -1;
      if (!this.mix.get('hasInternationalTracks')) {
        this.mix.bind('international_error', _.bind(function(){
          TRAX.resetRegionalBlocking();
          //this.onPlayPauseClick();
        }, this));
        return this.mix.withInternationalTracks(this.play) && false;
      }

      $('#mix_youtube').fadeIn();
      
      if (typeof Spotify == 'object') {
        // library already initialized
        this.playNextTrackOnYoutube();
      } else {
        //load youtube library
        window.onSpotifyWebPlaybackSDKReady = _.bind(function() {
          this.initSpotifyPlayer();
          this.playNextTrackOnYoutube();
        }, this);
        var tag = document.createElement('script');
        tag.src = "https://sdk.scdn.co/spotify-player.js";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      if (track) {
        this.track = track;
      }
      this.setsAPI('play', _.bind(function(json){
        if (json.smart_id) {
          // Sync with what the server is using
          this.smart_id = json.smart_id;
        }
      }, this), playType);

      return false;
    },

    whilePlaying : function(){
      this.spotifyPlayer.getCurrentState().then(this.onSpotifyPlayerStateChange);
    },

    rewind : function(){
      this.spotifyPlayer.getCurrentState().then(_.bind(function(state){
        if (state.position > 5000 && this.youtubeTrackIndex > 0) {
          //rewind to beginning
          this.spotifyPlayer.seek(0);
        } else {
          //play prev track
          this.youtubeTrackIndex += -2;
          this.playNextTrackOnYoutube();
        }
      }, this));
    },

    onYoutubePlayClick : function(){
      this.spotifyPlayer.resume();
      return false;
    },

    pause : function(){
      this.onYoutubePauseClick();
    },

    togglePlay : function(){
      this.spotifyPlayer.togglePlay();
    },   

    onYoutubePauseClick : function(){
      this.spotifyPlayer.pause();
      return false;
    },

    onYoutubeRewindClick : function(){
      this.rewind();
      return false;
    },

    onSeekClick : function(event){
      if (event.target.href) return false;
      //var seek_percent = event.offsetX / event.currentTarget.clientWidth;
      var seek_percent = (event.clientX - event.currentTarget.offsetLeft) / event.currentTarget.clientWidth;
      this.spotifyPlayer.getCurrentState().then(_.bind(function(state){
        this.spotifyPlayer.seek(seek_percent * state.duration);
        //console.log('seek', seek_percent * state.duration);
        this.spotifyPlayer.resume();
      }, this));
    },

    onYoutubeSkipClick : function(){
      try {
        this.setsAPI('skip'); } 
      catch(e) {

      }
      this.spotifyPlayer.pause();
      this.playNextTrackOnYoutube();
      this.youtubeEvent('skip');
      return false;
    },

    playerReady : function() {
      this.playNextTrackOnYoutube();
    },

    playNextTrackOnYoutube : function(track){
      if (!this._token) return;

      this.youtubeTrackIndex += 1;
      if (this.youtubeTrackIndex == this.mix.tracks.length) {
        //TODO go to next mix  
        this.setsAPI('next_mix', this.showNextMixView);
        return;
      }

      this.reported = false;

      //var t = TracksCollection.load( this.mix.get('tracks')[this.youtubeTrackIndex] );
      var t = this.mix.tracks.models[this.youtubeTrackIndex];
      t.trigger('playing');
      this.track = t;

      if (t.get('spotify_id')) {
        spotify_id = t.get_spotify_id;
      }

      console.log('token: ', this._token);
      
      var query = t.get('name') + ' artist:'+t.get('performer');
      var options = {};
      var geo = cookie.get('country_code3');
      if (geo) options['market'] = geo;
      
      spotifyApi.searchTracks(
        query,
        options,
        _.bind(function(err, data) {
          if (data.tracks.items[0]) {
            var spotifyId = data.tracks.items[0].id;
            $.ajax({
             url: "https://api.spotify.com/v1/me/player/play?device_id=" + this.device_id,
             type: "PUT",
             data: '{"uris": ["spotify:track:'+spotifyId+'"]}',
             beforeSend: _.bind(function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + this._token );}, this),
             success: function(data) { 
               console.log(data)
             }
            });
          } else {
            //track not found or already known unplayable in this geo
            t.set('unavailable', true);
            _.defer(this.playNextTrackOnYoutube);
          }
        }, this)
      );

      
      
      if (this.nowPlayingTrackYoutubeTrackView) this.nowPlayingTrackYoutubeTrackView.close({ keepDomElement : true });
      //show track in listing
      //this.mixTracksPlayedView.showTrackPlayed(t);

      //show track in player
      this.nowPlayingTrackYoutubeTrackView = new TrackPlayedView({ track : t, el : $('#mix_youtube #now_playing')[0]});
      this.nowPlayingTrackYoutubeTrackView.render();
      this.nowPlayingTrackYoutubeTrackView.marquee();
    },

    youtubeEvent : function(action, video_id){
      if (typeof video_id == 'undefined') {
        video_id = this.youtube_player.getVideoData().video_id;
      }
      //var title = this.youtube_player.getVideoData().title;
      //var author = this.youtube_player.getVideoData().author;
      var t = this.mix.tracks.models[this.youtubeTrackIndex];

      $.ajax('/you_tube_tracks/'+t.id+'/'+action, { data : { you_tube_id : video_id }, method : 'POST'});
    },


    onSpotifyPlayerStateChange : function(state){
      //console.log(state)
      if (this.spotify_current_track_id != state.track_window.current_track.id) { 
        this.spotify_current_track_id = state.track_window.current_track.id;
        this.$('#spotify-track-img').attr('src', state.track_window.current_track.album.images[0].url);
        this.$('.spotify-deeplink').attr('href', 'https://open.spotify.com/' + state.track_window.current_track.uri.split(':').join('/').replace(/^spotify\//, ''));
      }  

      //$('#current-track-name').text(state.track_window.current_track.name);
      //var artists = state.track_window.current_track.artists.map(artist => { return artist.name}).join(', ');
      //$('#current-track-artist').text(artists);

      if (state.paused) {
        this.$('#mix_youtube').removeClass('playing');
        if (state.position == 0 && this.readyToAdvance) { //track finished?
          this.playNextTrackOnYoutube();
          this.readyToAdvance = false;
        }
        clearInterval(this.onWhilePlaying);
      } else {
        this.readyToAdvance = true;
        this.$('#mix_youtube').addClass('playing');
        clearInterval(this.onWhilePlaying);
        this.onWhilePlaying = setInterval(this.whilePlaying, 1000); 
      }
      
      this.$progressBarMeter.css('transform', 'scaleX('+ (state.position / state.duration) + ')');
      if (!this.reported && state.position / 1000 > 30) {
        this.setsAPI('report');
        this.reported = true;
      }
    },

    errorMessages : {
      initialization_error : 'Please check that the Spotify app is open and ready to play.',
      authentication_error : 'Please check that your Spotify account is connected.',
      account_error : 'Please check that your Spotify premium account is active.',
      playback_error : 'Please check that the Spotify app is able to play audio.'
    },

    onSpotifyError : function(message, errorType) {
      App.Trax.show_flash_error(message + '. ' + this.errorMessages[errorType]);
      console.log(message);
      this.close();
    },

    onYoutubeFlagClick : function(event) {
      this.youtubeEvent('flag_invalid');
      this.playNextTrackOnYoutube();
      TRAX.show_flash_error('This video has been flagged as an incorrect track. Thanks for letting us know!', true);
      return false;
    },

    isOnMixPage : function(){ 
      return App.views.mixView && App.views.mixView.mix.id == this.mix.id;
    },


    toggleLike : function(){
      this.$('#youtube_like_button').toggleClass('active', !this.mix.get('liked_by_current_user'));
      this.mix.toggleLike();
    },

    setGradient : function(){
      var img = this.$('.cover')[0];
      var canvas = this.$('.background-blur')[0];
      TRAX.setGradient(canvas, this.mix.get('color_palette'), 2, img);
    },

    // Callback for when the mixPlayer returns with the next_mix response
    showNextMixView : function(json){
      // sets/next_mix will respond with the correct smart_id to use
      this.nextMix = mixesCollection.load(json.next_mix);
      // let the server tell us what the smart id is
      this.smart_id = json.smart_id
      

      require(['views/next_mix_view'], _.bind(function(NextMixView) {
        this.nextMixView = new NextMixView({
          nextMix: this.nextMix,
          mixPlayer: this
        });
        var skipInterruption = true; //with audio ads in place, don't interrupt between mixes for 8tracks plus prompt
        this.nextMixView.show(skipInterruption);
      }, this));
    },

    playNextMix(play_type){
      // switch pages if still on now-playing mixpage
      if (App.views.mixView && App.currentView == App.views.mixView && App.views.mixView.mix == this.mix) {

        App.router.navigate(this.nextMix.get('web_path'), { trigger : true });
      }

      this.loadMix(this.nextMix);
      this.play();
      //this.mixPlayer.play(playType);
      return;
    },


    onMixViewClose : function() {
      //clean up player?
    },

    // action can be: play, skip, next, report, next_mix
    setsAPI: function(action, callback, playType) {
      this.withToken(_.bind(function() {
        JSONH.now_with_context('/sets/' + this.playToken + '/' + action, this.setsParams(action, playType), this, function(json) {
          if (json.success) {
            if (_.isFunction(callback)) { callback(json); }
          }
        }, { spinner: false, with_lock: true, ignore_flash: true });
      }, this));
    },

    setsParams(action, playType){
      var params = {
        player : 'yt',
        include : 'track[faved+annotation+artist_details]',
        stream_source : 'youtube'
      }

      if (action == 'next_mix') {
        params['include'] += ',user,mix_set';
      }

      if (this.mix) {   params['mix_id']   = this.mix.id;   }
      if (this.track) { params['track_id'] = this.track.id; }

      // Only send smart_id on play and if the user initiated the play. auto
      // play or skip mix doesn't count.
      if (action == "play" && playType == "click") {
        params['smart_id'] = this.smart_id;
        params['play_type'] = 'mix_start_click';
      }

      return params;
    },

    // duplicated from mix_player.js
    withToken: function(callback) {
      if (!(this.playToken || this.loadTokenFromCookie())) {
        JSONH.now_with_context('/sets/new', this, function(json) {
          if (json.success) {
            this.saveNewToken(json.play_token);
            callback();
          }
        }, { spinner: false });

      } else {
        callback();
      }
    },

    // duplicated from mix_player.js
    saveNewToken: function(playToken) {
      this.playToken = playToken;
      cookie.set('play_token', playToken);
    },

    // duplicated from mix_player.js
    loadTokenFromCookie: function() {
      var c = cookie.get('play_token');

      if (c && c != 'null' && c != 'undefined') {
        this.playToken = c;
      } else {
        // generate random number
        c = parseInt(Math.random()*1000000000,0);
        this.saveNewToken(c);
      }
      return c;
    },

    loadVolumeSlider: function() {
      rgb_volume_container =  "rgb(30, 30, 30)";
      rgb_player_volume = "rgb(3, 3, 3)";

      this.$('#volume_controls_container').volume({
        initialVolume : 80,
        change : this.onVolumeChange,
        rgb_volume_container : rgb_volume_container,
        rgb_player_volume : rgb_player_volume
      });
      this.$('.volume-container').css("background", rgb_player_volume);
    },

    onVolumeChange : function(volume){
      clearTimeout(this.volumeTimeout);
      this.volumeTimeout = setTimeout(function(){
        spotifyApi.setVolume(parseInt(volume));
      }, 100);
    },

    loadSeekSlider : function(){
      var $seek_bar = this.$('#seek_bar');
      var $progress_bar = this.$('.player_progress_bar');
      $progress_bar.mouseenter(function(event){
        $seek_bar.css({opacity : 1.0 });
      });
      $progress_bar.mouseleave(function(event){
        $seek_bar.css({opacity : 0.0 });
      });
      $progress_bar.mousemove(function(event){
        $seek_bar.css({width : (event.clientX - event.currentTarget.offsetLeft + 1) + 'px' });
      });
    },

    onDeeplinkClick : function(event){
      window.open(event.currentTarget.href);
      return false;
    }
  });

  return SpotifyPlayerView;
});
define('views/comments_view',
  ['views/trax_view', 'global_trax', 'lib/sessions', 'lib/events', 'lib/jsonh.jquery', 'lib/_template_helpers', 'lib/client_storage',
   'hgn!templates/reviews/_review_form', 'hgn!templates/mixes/_mix_reviews', 'hgn!templates/reviews/_review', 'hgn!templates/reviews/_review_thread', 'hgn!templates/reviews/_reply_form', 'jquery.timeago'],
 function(TraxView, TRAX, sessions, Events, JSONH, TplParams, ClientStorage, reviewFormTemplate, mixReviewsTemplate, reviewPartial, reviewThreadPartial, replyFormTemplate) {
  var CommentsView = TraxView.extend({
    el: '#comments',

    SPAM_REVIEWS_KEY: 'reviews_marked_as_spam',

    initialize : function(options) {
      _.bindAll(this, 'render', 'setDeletePermission', 'setBlockPermission', 'afterRender', 'setOwnershipPermission', 'onReviewBodyKeypress', 'renderCaptcha', 'onSubmit');
      this.reviewable = options.reviewable;
      this.reviewable_type = options.reviewable_type;
      this.per_page = options.per_page;
      this.reviews = options.reviews;
      this.onLoad = options.onLoad;

      this.whenUserReadyOrChanged(this.afterRender);
      sessions.bind('current_user:unset', this.afterRender);


      if (options.load) {
        this.$el = $(this.el);
        this.loadReviews();
      } else {
        this.afterRender();
      }

      this.matches = [];
    },

    afterRender : function() {
      this.updateFormAvatar();
      this.afterCommentRender();
      this.hideSpamReviews();
    },

    afterCommentRender : function(context) {
      // TODO: this may bind the same timeago events over and over:
      this.$('.timeago', context).timeago();

      this.setOwnershipPermissions(context || this.$el);
      this.setDeletePermissions(context || this.$el);
      this.setBlockPermissions(context || this.$el);
    },

    // TODO
    // * user badge on submit


    events : {
      "submit form"   : 'onSubmit',
      "click .submit" : 'onSubmit',
      "keydown .submit" : 'onSubmitKeydown',
      "click .delete_review"    : 'onDeleteClick',
      "click .new_pagination a" : 'paginateReviews',
      "click .reply_review"     : 'onReplyClick',
      'click .cancel_reply'     : 'onCancelReplyClick',
      "click .mark_as_spam"     : 'onMarkAsSpamClick',
      "click .flag_user"        : 'onFlagUserClick',
      'focus textarea'          : 'loadAutocompleteView',
      'keydown textarea'        : 'onReviewBodyKeydown'
    },

    loadReviews : function() {
      if (this.reviewable) {
        //url = '/mixes/' + this.reviewable.id + '/reviews';
        var url = (this.reviewable.get('web_path')) + '/comments';
        JSONH.now(url, { page : 1, per_page : this.per_page, include : 'pagination'}, this.render);
      }
    },

    render : function(json) {
      this.$el.empty();

      if (this.reviewable_type == 'Mix') {
        this.$el.append('<h6 id="comments_header"><span class="i-comment"></span> ' + (json.pagination.total_entries ? json.pagination.total_entries : '') + ' Comments</h6>').append('<hr class="divide" />');
       
        if (json.pagination.total_entries > json.pagination.per_page) {
          this.$('#comments_header').append(' (<a href="'+this.reviewable.get('web_path') + '/comments">view all</a>)');
        }
      }
      
      var currentUser = TRAX.currentUser ? TRAX.currentUser.toJSON() : false;
      var p = new TplParams({
        user : currentUser,
        reviewable_id  : this.reviewable.id,
        reviewable_type : this.reviewable_type
      });

      this.$el.append(reviewFormTemplate(p));

      var tplParams = new TplParams(json);
      tplParams.link_structure = this.reviewable.get('web_path')+'/comments/::page::';

      this.$el.append(mixReviewsTemplate(tplParams, {'reviews/review': reviewPartial.template, 'reviews/review_thread': reviewThreadPartial.template }));

      this.afterRender();

      if (json.current_page > 1) { //scroll on pagination
        $('body').scrollTop(this.$el.offset().top);
      } else if (typeof this.onLoad == 'function') {
        this.onLoad.call();
      }
    },

    updateFormAvatar : function() {
      var avatar_url;
      if (TRAX.currentUser) {
        avatar_url = TplParams.prototype.imgix_url('sq72, w=72&h=72&fit=crop', TRAX.currentUser.get('avatar_urls'));
      }
      $('form.new_review').find('img').attr('src', avatar_url);
    },

    setOwnershipPermissions: function(context) {
      _.each(this.$('.comment', context), this.setOwnershipPermission);
    },

    setDeletePermissions : function(context) {
      _.each(this.$('.comment', context), this.setDeletePermission);
    },

    setBlockPermissions: function(context) {
      _.each(this.$('.comment', context), this.setBlockPermission);
    },

    setOwnershipPermission: function (el) {
      $el = $(el);
      if (this.canDeleteComment($el)) {
        $el.addClass('comment_owner');
      } else {
        $el.removeClass('comment_owner');
      }
    },

    setDeletePermission : function(el) {
      var $el = $(el);
      if (this.canDeleteComment($el)) {
        $el.find('.delete_review').addClass('on');
      } else {
        $el.find('.delete_review').removeClass('on');
      }
    },

    setBlockPermission: function(el) {
      if (this.canFlagUser(el)) {
        $(el).find('.flag_user').addClass('on');
      } else {
        $(el).find('.flag_user').removeClass('on');
      }
    },

    canFlagUser: function(el) {
      var currentUser = TRAX.currentUser ? TRAX.currentUser.toJSON() : false;
      if (!currentUser)
        return false;

      var reviewerId = $(el).find('.flag_user').data("user_id");
      if (currentUser.id === reviewerId) {
        return false;
      }

      return (this.reviewable && this.reviewable.get('user') && this.reviewable.get('user').id === currentUser.id);
    },

    // Admins, comment owner or mix owner can delete comments.
    canDeleteComment : function($commentEl) {
      return (sessions.loggedIn() &&
               (sessions.isAdmin() ||
                sessions.isJuniorModerator() ||
                this.reviewable.get('user_id') === TRAX.currentUser.id ||
                $commentEl.data('review_user_id') === TRAX.currentUser.id));
    },

    fakeAttributesForBlockedReview: function (review) {
      reviewAttr['body_html'] = reviewAttr['body']
      reviewAttr['created_at_timestamp'] = new Date().getTime();
    },


    onSubmitKeydown : function(event) {
      if (event.which == 13) {
        this.onSubmit({ currentTarget : $(event.currentTarget).parents('form')[0] });
        return false;
      }
    },

    onSubmit : function(event) {
      if (!sessions.loggedIn()) {
        TRAX.showSignupView();
        return;
      }

      var $form = (event && event.currentTarget) ? $(event.currentTarget) : event;
      if (!$form.is('form')) $form = $form.parents('form');
      if ($form.data('busy') == '1' || $form.find('textarea').val().length == 0) return false;

      $form.data('busy', '1');
      if (this.recaptcha_id) {
        $form.data('g-recaptcha-response', grecaptcha.getResponse(this.recaptcha_id));
      }

      $form.jsonh_now(function(json) {
        $form.data('busy', '0');

        if (json.success) {
          var reviewAttr = json.review;
          reviewAttr['user'] = TRAX.currentUser.toJSON();
          reviewAttr['mix_user_id'] = this.reviewable ? this.reviewable.get('user_id') : null; 

          if(!!reviewAttr['reviewer_blocked']) {
            this.fakeAttributesForBlockedReview(reviewAttr);
          }

          if (json.review.parent_id) {
            // reply: we build a comment
            var tplParams = new TplParams(reviewAttr);
            var $reviewEl = $(reviewPartial(tplParams));
            $form.replaceWith($reviewEl);
            this.afterCommentRender($reviewEl);

          } else {
            // new comment: we build a thread
            var tplParams = new TplParams({
              id: (json.review.parent_id || json.review.id),
              reviews: [ reviewAttr ],
              hidden : true
            });

            var $threadEl = $(reviewThreadPartial(tplParams, {'reviews/review': reviewPartial.template }));
            $form.after($threadEl);
            $threadEl.slideDown();
            this.afterCommentRender($threadEl);

            // clear form
            $form.find('textarea, input[name="review[body_encoded]"]').val('');
            $form.find('.validation_errors, .mentions_highlights').empty();
            $form.find('#captcha_container').css({ height: '0px' });
            //this.recaptcha_id = null;
          }

          Events.commentOnMix(this.reviewable);
        } else {
          $form.find('.validation_errors').html(json.validation_errors);
          if (json.captcha) {
            this.renderCaptcha($form);
            this.showCaptcha($form);
          }
        }
      }, { spinner : $form.find('.spinner'), context : this, with_lock : true });

      return false;
    },

    renderCaptcha : function($form){
      if (!window.grecaptcha) {
        window.recaptchaCallback = _.bind(function(){ this.renderCaptcha($form) }, this);
        var script = document.createElement( 'script' );
        script.type = 'text/javascript';
        script.src = window.location.protocol+'//www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
        document.body.appendChild( script );
        window.recaptcha = true;
      } else {
        if (typeof this.recaptcha_id !== 'undefined') {
          grecaptcha.reset(this.recaptcha_id)
          return;
        }
        this.recaptcha_id = grecaptcha.render(
          $form.find('.g-recaptcha')[0],
          { 
            sitekey : '6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN',
            callback: _.bind(function(){
              this.onSubmit($form);
            }, this)
          }
        );
      }
    },

    showCaptcha : function($form){
      if (window.recaptcha) {
        $form.find('#captcha_container').animate({ height: '80px'});
      }
    },

    onDeleteClick: function(event) {
      var $link = $(event.currentTarget);
      var skipConfirm = !!event.skipConfirmation;

      if (skipConfirm || confirm("Are you sure you want to delete this comment?")) {
        var $review = $link.parents('.comment');
        var $thread = $review.parents('.comment_thread');

        $review.fadeOut(150);

        $link.jsonh_now(function(json) {
          if (json.success) {
            if ($review.hasClass('reply')) {
              $review.remove();
            } else {
              $thread.remove();
            }
          }
        }, {type: 'delete'});
      }

      return false;
    },

    onFlagUserClick: function(event) {
      var target = $(event.target);

      var userName = target.data("user_name");
      var wantsToBlock = confirm('Are you sure you want to block ' + userName +'? This will also remove this comment.');

      var userId = target.data("user_id");
      var commentId = target.data("comment_id");

      var currentUser = TRAX.currentUser;
      if (!(currentUser && userId && wantsToBlock)) {
        return false;
      }

      var isOwner = (this.reviewable.get('user').id === currentUser.id);
      var notFlaggingSelf = (currentUser.id !== userId);

      var self = this;
      if (isOwner && notFlaggingSelf) {
        var flagging = currentUser.flag(userId);
        flagging.success(function() {
          self.onCommentFlagged(commentId);
        });
      }

      return false;
    },

    onCommentFlagged: function(reviewId) {
      var reviewElement = $('.comment[data-review_id="'+reviewId+'"]');

      var event = jQuery.Event("click");
      event.skipConfirmation = true;
      reviewElement.find('a.delete_review').trigger(event);
    },

    onReplyClick: function(event) {
      if (sessions.loggedOut()) {
        return true;
      }
      
      var $link = $(event.currentTarget);
      var $thread = $link.parents('.comment_thread');
      var $threadReview = $thread.children('.comment:first');
      var $replyForm = $thread.find('.reply_form');

      if ($replyForm.length > 0) {
        // already rendered before

        if ($replyForm.is(':visible')) {
          $replyForm.hide();
          return false;
        } else {
          $replyForm.show();
          return false;
        }
      }
      
      var mixParams = this.reviewable ? this.reviewable.toJSON() : { id : $threadReview.data('mix_id') };
      
      var tplParams = new TplParams({
        'mix' : mixParams,
        'reviewable_id' : mixParams.id,
        'reviewable_type' : 'Mix',
        'user' : TRAX.currentUser.toJSON(),
        'parent_id' : $thread.data('thread_id'),
      });

      $thread.append(replyFormTemplate(tplParams));
      $textarea = $thread.find('.reply_form textarea');
      $textarea.focus(); //triggers new autocompleteview handlers, resets $input

      var commentors = _.reject(_.map($thread.find('a.name'), function(el){ 
        return { id : $(el).data('user_id'), term : $(el).text() }; }
      ), function(mention){ return mention.term == TRAX.currentUser.get('login'); });

      //removing duplicates in commentors

      var flags = [], l = commentors.length, i;
      for( i=0; i<l; i++) {
          if(flags[commentors[i].id]) continue;
          flags[commentors[i].id] = true;
          this.mentions.push(commentors[i]);
      }

      for (var i = 0; i < this.mentions.length; i++) {
        this.onReviewBodyKeypress(null, '@' + this.mentions[i].term + ' ');
      }

      if (this.autocompleteview) this.autocompleteView.setCaretPosition($textarea, $textarea.val().length);
    
      if (!$textarea.is(':visible')) {
        $('html, body').animate({
          scrollTop: $(".reply_form textarea").offset().top - 200
        }, 250);
      }

      return false;
    },

    onCancelReplyClick : function(event) {
      var $link = $(event.currentTarget);
      var $replyForm = $link.parents('form.new_review');

      if ($replyForm.length > 0) {
        $replyForm.remove();
      }

      return false;
    },

    onMarkAsSpamClick: function(event) {
      var $link = $(event.currentTarget);
      JSONH.now($link.attr("href"), function() {}, {spinner: true, type: 'post'});

      var reviewDiv = $link.parents(".comment");
      var reviewId;

      if (!reviewDiv.is(".reply")) {
        reviewDiv = reviewDiv.parents(".comment_thread");
        reviewId = reviewDiv.data('thread_id');
      } else {
        reviewId = reviewDiv.data('review_id');
      }

      reviewDiv.hide();

      // Store reviews the user has marked as spam
      var reviewsMarkedAsSpam = ClientStorage.get(this.SPAM_REVIEWS_KEY);
      if (_.isArray(reviewsMarkedAsSpam)) {
        reviewsMarkedAsSpam = reviewsMarkedAsSpam.split(',');
      } else {
        reviewsMarkedAsSpam = [];
      }

      reviewsMarkedAsSpam.push(reviewId);
      ClientStorage.set(
        this.SPAM_REVIEWS_KEY,
        reviewsMarkedAsSpam.join(',')
      );

      return false;
    },

    hideSpamReviews: function() {
      var reviewsMarkedAsSpam = ClientStorage.get(this.SPAM_REVIEWS_KEY);
      if (_.isString(reviewsMarkedAsSpam)) {
        reviewsMarkedAsSpam = reviewsMarkedAsSpam.split(',');
        _.each(reviewsMarkedAsSpam, function(id) {
          $("#" + id).remove();
        });
      }
    },

    paginateReviews: function(event) {
      var link = $(event.currentTarget);
      var href = link.attr('href');
      if (this.per_page) {
        href += href.indexOf('?') != -1 ? '&' : '?';
        href += 'per_page=' + this.per_page;
      }

      JSONH.now(href, this.render);

      return false;
    },

    loadAutocompleteView : function(event){
      var div = $(event.currentTarget).parent();

      //don't reload view on focus, but do reload for new replies
      if (this.autocompleteView) {
        if (this.autocompleteView.el == div[0]) {
          return;
        } else {
          this.autocompleteView.undelegateEvents();
          delete this.autocompleteView;
        }
      }

      this.$input        = div.find('textarea[name="review[body]"]');
      this.$encodedInput = div.find('input[name="review[body_encoded]"]');
      this.$highlights   = div.find('.mentions_highlights');

      require(['views/autocomplete_view'], _.bind(function(AutocompleteView){
        this.autocompleteView = new AutocompleteView({
            el : div,
            //encodedInput : encodedInput,
            endpoint : '/mentions/autocomplete',
            mix_id : this.reviewable ? this.reviewable.id : null,
            categories : ['users'],
            symbol : '@',
            showViewAll : false,
            autoSelect : true,
            placeholder : null, //Type someone\'s username to <strong>@tag</strong> them',
            emptyMessage : 'No users matched that name.',
            dataMapper : this.dataMapper,
            minQueryLength : 1,
            onEnter  : _.bind(this.onSearchEnter, this),
            onSelect : _.bind(this.onSearchSelect, this)
        });
      }, this));
      
      div.find('textarea:first').keypress(this.onReviewBodyKeypress);
      this.mentions = [];
    },

    dataMapper : function(json) {
      if (json.users.length) {
        json.users = _.map(json.users, function(user){
          user.name = user.login;
          user.data = { image_url : user.avatar_urls['sq72'] };
          return user;
        })
      } else {
        delete json.users;
      }
      return json;
    },

    onSearchEnter : function(q) {
      this.onSubmit({ currentTarget : $(event.currentTarget).parents('form')[0] });
      return false;
    },

    encodedParts : function(){
      return this.$encodedInput.val().match(/([^@]+|@\[[^\]]+\])/ig)
    },

    onReviewBodyKeydown : function(event){
      if (event && (event.which == 8 || event.which == 46)) _.defer(this.onReviewBodyKeypress);
      if (event && event.which == 9) {
        return false;
      }
    },

    onReviewBodyKeypress : function(event, mention){
      var text = this.$input.val();
      var typedCharacter = event ? String.fromCharCode(event.which) : null;
      var caretPosition;

      if (mention || typedCharacter) {
        caretPosition = this.autocompleteView && this.autocompleteView.caretPosition() || 0;
        var t = text.slice(0, caretPosition);
        if (mention) {
          t = t.split(/@[^@ ]*$/)[0]; //replace autocompleted phrase instead of appending
          text = t + mention + text.slice(caretPosition);
          caretPosition = t.length + mention.length; //for updating cursor
        } else {
          text = t + typedCharacter + text.slice(caretPosition);
        }
      }

      var html = text;
      var encoded = text;

      var i;
      for (i=0; i<this.mentions.length; i++) {
        var m = this.mentions[i];
        if (m) {
          if (text.match('@' + m.term)) {
            html = html.replace('@'+m.term, '<span>@'+m.term+'</span>');
            encoded = encoded.replace('@'+m.term, '@['+m.id+':'+m.term+']');
          }
        }
      }

      if (mention) { //adjust textbox contents if updated by autocomplete
        this.$input.val(text);
        if (this.autocompleteView) this.autocompleteView.setCaretPosition(this.$input[0], this.$input.val().length);
      }
      this.$highlights.html(html);
      this.$encodedInput.val(encoded);
    },

    onSearchSelect : function(el){
      var term = $(el).data('name');
      var text, matchRegex, encodedTerm, id = $(el).data('id');

      text = this.$encodedInput.val();
      id = $(el).data('id')

      var mention = {
        id : id,
        term : term,
      }

      this.mentions.push(mention);
      this.onReviewBodyKeypress(null, '@' + term + ' ');
      this.$input.focus();
      this.autocompleteView.onBlur();
      return false;

    },
  });

  return CommentsView;
});
define('views/user_about_view', ['views/trax_view', 'lib/_template_helpers', 'lib/link_helper', 'hgn!templates/users/_about', 'hgn!templates/users/_follow_button'], function(TraxView, TplParams, linkHelper, template, partial){
  var UserAboutView = TraxView.extend({
    id : 'user_about',

    events : {
      'click .follow' : 'onFollowClick'
    },

    initialize : function(options){
      this.user = options.user;
    },

    render : function(){
      var tplParams = new TplParams(this.user);
      this.$el.html(template(tplParams, { 'users/follow_button': partial.template }));
      this.afterRender();
      return this;
    },

    afterRender : function(){
    },

    onFollowClick : function(event){
      if (this.button_color_variation) {
        TraxEvents.track('follow button', { event_type : 'click', page_type : App.currentPage, variation : this.button_color_variation });
      }
      linkHelper.follow_link_click(event);
      return false;
    }
  });

  return UserAboutView;
});
define('views/sharing_view', ['global_trax', 'views/trax_view', 'hgn!templates/shared/sharing', 'lib/trax_facebook'],
       function(TRAX, TraxView, sharingTemplate, TraxFacebook){

  var SharingView = TraxView.extend({
    className : 'share_view',

    events : {
      'click .em' : 'onEmailClick',
      'click .eb' : 'onEmbedClick',
      'click .popupShare' : 'onPopupShareClick',
      'click .shareOpenGraph' : 'onShareOpenGraphClick'
    },

    initialize: function(options) {
      this.atts = {};
      this.childViews = [];
      this.mix = options.mix;
      this.atts.decoded_url = options.url;
      this.atts.url         = encodeURIComponent(options.url);
      this.atts.url_escaped = this.atts.url;
      this.atts.name        = encodeURIComponent(options.name);
      this.atts.embedCode   = typeof(options.embedCode) == 'string' ? encodeURIComponent(options.embedCode) : false;
      this.atts.image       = options.image;
      this.atts.description = encodeURIComponent(options.description);
      this.atts.description_html = options.description_html ? encodeURIComponent(options.description_html) : this.atts.description;
      this.atts.twitter_related = encodeURIComponent(options.twitter_related);
      if (this.mix) this.atts.path        = this.mix.get('path');
      
      TraxFacebook.loadFacebookJs();
      TraxFacebook.parseXFBML();

      this.atts.hash_tags = this.hashTags();

      _.each(options.buttons, _.bind(function(button){
        this.atts[button] = true;
      }, this));

      this.template = sharingTemplate;
    },

    hashTags: function() {
      if (this.mix) {
        var hashTags = ["8tracks", "playlist"];
        var genreTags = this.mix.get('tag_list_cache').split(",");
        var artistTags = this.mix.get('artist_tags');
        hashTags = hashTags.concat(genreTags, artistTags);
        hashTags = _.map(hashTags, function(tag){
          return (tag ? tag.replace('#', '') : '');
        });
        return hashTags;
      }
    },

    render : function(){
      //these utms aren't being added for fb at least... refactored in onShareOpenGraphClick() and sharing.mustache
      this.atts.sources = {
        //google:    escape('?utm_source=google.com&utm_medium=referral&utm_content=mix-page&utm_campaign=google_button'),
        //tumblr:    escape('?utm_source=tumblr.com&utm_medium=referral&utm_content=mix-page&utm_campaign=tumblr_button'),
        //twitter:   escape('?utm_source=twitter.com&utm_medium=referral&utm_content=mix-page&utm_campaign=twitter_button'),
        //facebook:  escape('?utm_source=facebook.com&utm_medium=referral&utm_content=mix-page&utm_campaign=facebook_button'),
        pinterest: escape('?utm_source=pinterest')
      }

      // tumblr share hates commas in URL params, even if encoded,
      // thus "?crop=0,0,500,500&fit=max" breaks the image when it gets truncated to "?crop=0"
      if (this.atts.image) {
        this.atts.tumblr_image = encodeURIComponent(this.atts.image.split('?')[0] + '?fm=jpg&fit=max&w=1024');
        this.atts.image_escaped = encodeURIComponent(this.atts.image);
      }

      this.atts['GOOGLE_CLIENT_ID'] = window.GOOGLE_CLIENT_ID;
      this.$el.html(this.template(this.atts));
      return this.el;
    },

    fileFormat: function() {
      return this.atts.image.includes("gif") ? "gif" : "jpg";
    },

    afterRender: function() {
      this.renderGooglePlus();
    },

    renderGooglePlus: function() {
      gapi.interactivepost.go();
    },

    onEmailClick : function(){
      if (!this.mixRecommendView) {
        require(['views/mix_recommend_view'], _.bind(function(MixRecommendView){
          this.mixRecommendView = new MixRecommendView({ mix : this.mix, user : TRAX.currentUser, parentView : this });
          this.childViews.push(this.mixRecommendView);
          $.facebox(this.mixRecommendView.render().el);
        }, this));
      } else {
        //this.$el.hide();
        $.facebox(this.mixRecommendView.el);
      }
      this.trigger('shareClick');

      return false;
    },

    onEmbedClick : function(event){
      this.trigger('shareClick');
      if (this.mix) {
        $.facebox('<div class="large-spinner" id="embed-spinner"></div>');

        var mix = this.mix;

        require(['views/embed_mix_lightbox_view'], function(EmbedMixLightboxView){
          var embedMixLightboxView = new EmbedMixLightboxView({mix: mix, $sidebarAd: $("#sidebar_ad") });
          embedMixLightboxView.show();
        });

        return false;
      }
      return true;
    },

    onPopupShareClick : function(event) {
      this.trigger('shareClick');
      if (this.mix) {
        var network = $(event.currentTarget).data('network');
        var mix_publisher = this.mix.get('user');
        TraxEvents.track('share attempt', {
          event_type: 'click',
          content_type: 'mix',
          page_type: 'mix',
          share_target: network,
          mix_id: this.mix.get('id'),
          profile_id: mix_publisher && mix_publisher.id,
        });

        App.Events.clickMixShareOption({
          network: network,
          action: 'share',
          url: 'https://8tracks.com' + this.mix.get('web_path')
        });
        
        if (typeof(IDENTITY) == 'function') {
          IDENTITY('track', 'Shared to Social', {
            label: network //name of social platform
          });
        }
      }
    },

    onShareOpenGraphClick: function() {
      this.trigger('shareClick');
      var url = unescape(this.atts.url).replace(/^https{0,1}:/, 'https:');
      FB.ui({
        method: 'share',
        href: url.concat('?utm_source=facebook.com&utm_medium=referral&utm_content=mix-page&utm_campaign=facebook_button')
      }, function(response){});
    }
  });

  return SharingView;
});
// App.views.mixView represents the Mixes#show action. The object is initialized
// after the page is loaded (see mixes#show.erb file).
define('views/add_to_collection_view',
  ['global_trax', 'views/trax_view', 'lib/jsonh.jquery', 'lib/_template_helpers', 'lib/events',
   'hgn!templates/collections/add_to_collection', 'hgn!templates/collections/my_collections' ],
  function(TRAX, TraxView, JSONH, TplParams, Events, addToCollectionTemplate, myCollectionsTemplate) {
var AddToCollectionView = TraxView.extend({
  className: "add_to_collections",

  collections : null,

  closeTimer : null,

  events: {
    "click .my_collection"          : 'onCollectionClick',
    "submit #create_collection"     : 'createCollection',
    "keyup #new_collection_name"    : 'onNameEnter'
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'cancelClose', 'close', 'closeStillLater');
    this.mix = options.mix;
    if (this.mix.attributes) this.mix = this.mix.toJSON();
  },

  loadCollections : function(){
    JSONH.now('/users/' + TRAX.currentUser.id + '/editable_collections', { mix_id : this.mix.id }, _.bind(function(json){
      for (var i = json.collections.length - 1; i >= 0; i--) {
        json.collections[i].id = json.collections[i].id;
      }

      this.collections = new Backbone.Collection(json.collections);
      var listen_later = this.collections.where({slug : 'listen-later', mixes_count : 0});
      if (listen_later.length) listen_later[0].set({queue_message : '(save to dashboard)'});

      this.renderMixSets();
    }, this), { spinner : this.$('#my-collections-spinner')});
  },

  render: function() {
    this.$el.html(addToCollectionTemplate(this.mix)).show();
    if (this.collections) {
      this.renderMixSets();
    } else {
      this.loadCollections();
    }
    return this.el;
  },

  showInFacebox : function(){
    $.facebox(this.$el);
    this.faceboxed = true;
    this.render();
  },

  renderMixSets : function(){
    var tplParams = new TplParams({collections : this.collections.toJSON()});
    if (TRAX.currentUser.get('admin')) {
      tplParams.show_slug = this.show_slug;
    }
    this.$('#my_collections').html(myCollectionsTemplate(tplParams)).show();
  },

  show_slug : function(){
    return this.smart_id == 'collection:featured' || this.smart_id == 'collection:homepage'
  },

  onCollectionClick : function(event) {
    if ($(event.target).hasClass('view_link')) return true;
    
    this.cancelClose();
    var $link = $(event.currentTarget);
    var collection_id = $link.data('id');
    var params = { collection_mix : { collection_id : collection_id, mix_id : this.mix.id } };
    var method, url;
    var mixes_count = this.collections.get(collection_id).get('mixes_count');

    if ($link.hasClass('contains_mix')) {
      method = 'DELETE';
      url = '/collections_mixes/destroy';
      mixes_count += -1;
    } else {
      method = 'POST';
      url = '/collections_mixes';
      mixes_count += 1;
    }

    $link.toggleClass('contains_mix');
    $link.addClass('just_clicked').hover(function(){ }, function(){ $link.removeClass('just_clicked'); });
    $link.find('.mixes_count').html('('+mixes_count + (mixes_count == 1 ? ' mix' : ' mixes')+')');

    JSONH.now(url, params, _.bind(function(json){
      if (json.status == 200){
        this.collections.get(json.collection.id).set({mixes_count : json.collection.mixes_count});
        Events.addMixToCollection(this.mix);
      }

      if(this.faceboxed) {
        this.closeLater();
      }
    }, this), { spinner : false, type : method });

    this.updateCurrentUser();

    return false;
  },

  createCollection : function(event){
    if (this.$('#new_collection_name').val().length > 0) {
      this.cancelClose();
      this.$('#create_collection_button').hide();

      this.$('#create_collection').jsonh_now(_.bind(function(json){
        this.collections.add(json.collection);
        this.render();
        this.$('#my_collections').scrollTop(5000);
        Events.createCollection(this.mix);
        Events.addMixToCollection(this.mix);

        App.views.tocView && App.views.tocView.reload();
      }, this), { spinner : this.$('#collections-spinner') });
    }

    this.closeLater();
    this.updateCurrentUser();

    return false;
  },

  onNameEnter : function(event){
    this.cancelClose();
    if ($(event.target).val().length > 0){
      this.$('#create_collection_button').removeClass('disabled');
      this.$('#new_collection_description').slideDown();
    } else {
      this.$('#create_collection_button').addClass('disabled');
    }
  },

  closeLater : function(){
    $(document).bind('close.facebox', this.closeStillLater);

    this.closeTimer = setTimeout(function(){
      $.facebox.close();
    }, 2500);
  },

  closeStillLater : function(){
    setTimeout(this.close, 2000);
  },

  cancelClose : function(){
    clearTimeout(this.closeTimer);
  },

  updateCurrentUser : function(){
    TRAX.currentUser.set('uses_collections', true);
    TRAX.currentUser.localSave();
  },

  onClose : function(){
    this.cancelClose();
    $(document).unbind('close.facebox', this.close);
    //placeholder for memory cleanup
  }


});

  return AddToCollectionView;
});
define('views/pick_next_mix_view', ['views/trax_view', 'global_trax', 'hgn!templates/mixes/pick_next_mix', 'lib/jsonh.jquery'], function(TraxView, TRAX,  template, JSONH) {

  var PickNextMixView = TraxView.extend({
    id : 'pick_next_mix_wrapper',
    search_timer : null,

    initialize: function(options) {
      this.$el = $(this.el);
      this.mix = options.mix;
      //this.html = options.html;

      _.bindAll(this, 'search_q');
      this.template = template;
    },


    render: function(pick_next_mix) {
      this.$el.html( this.template({ mix : this.mix, pick_next_mix : pick_next_mix }));
    },

    show: function() {
      JSONH.now_with_context('/mixes/'+this.mix.id+'/next_mix', this, function(json){
        this.render(json.pick_next_mix);
        $.facebox(this.el);
        this.search_next_mixes('liked');
      });
    },

    events: {
      'click .save input'              : 'save',
      'click #mix_selector li.enabled' : 'pick',
      'click .searchtabs a'            : 'switchView',
      'keyup #mixes_q'                 : 'delayed_search',
      'click #mix_selector .more'      : 'more'
    },

    save : function(event){
      JSONH.now(
        this.$('#pick_next_mix_form')[0].action,
        { mix : { next_mix_id : $('#mix_next_mix_id').val() } },
        function(){
          $.facebox.close();
          setTimeout(function(){
            TRAX.update_flash({notices:"Next mix selected successfully."});
          }, 750);
        },
        {type:'PUT'}
      );
      return false;
    },

    pick : function(event){
      var mix = $(event.currentTarget);
      $('#mix_selector .mix').removeClass('selected');
      mix.addClass('selected');
      var mix_id = mix.attr('id').split('mix_');
      $('#mix_next_mix_id').val(mix_id[1]);
      $('#selected_nextmix .mix').html(mix.html()).addClass('selected');
      return false;
    },

    switchView : function(event){
      $(event.currentTarget).addClass('selected').siblings().removeClass('selected');
        switch(event.currentTarget.id){
          case 'allmixes':
            this.search_next_mixes('hot', 1);
            break;
          case 'mixfeed':
            this.search_next_mixes('following', 1);
            break;
          case 'mymixes':
            this.search_next_mixes('own', 1);
            break;
          case 'likedmixes':
            this.search_next_mixes('liked', 1);
            break;
        }
      return false;
    },

    delayed_search : function(){
      clearTimeout(this.search_timer);
      this.search_timer = setTimeout(this.search_q, 250);
      return false;
    },

    search_q : function() {
      this.search_next_mixes( "/mixes.jsonh?&include=mixes_with_users&q="+encodeURIComponent(this.$('#mixes_q').val()) );
      this.$('.searchtabs #allmixes').addClass('selected').siblings().removeClass('selected');
    },

    search_next_mixes : function(view, page) {
      this.$('#nextmix-spinner').children('span').show();
      var url = '/mixes.jsonh?view='+view+'&include=mixes_with_users,pages&page='+page;
      $.getJSON(url, _.bind(function(json) {
          var mixSet = json.mix_set;

          var output = '';
          if (mixSet.pagination.current_page == 1) {
            output = '<ul id="mixes_search_results">';
          }

          for (key in mixSet.mixes) {
            var mix = mixSet.mixes[key];
            output += this.next_mix_partial(mix);
          }

          if(mixSet.pagination.current_page == 1){ // show new query results
            output += '</ul>';
            if(mixSet.pagination.next_page){
              output += '<div class="pagination more_pagination"><a href="#" data-view="'+view+'" data-page="'+mixSet.pagination.next_page+'" class="more flatbutton turquoise_button" title="More">More</a></div>';
            }
            this.$('#mix_selector').html(output);

          }else{ // show more results
            this.$('#mixes_search_results').append(output);
            if(mixSet.pagination.next_page){
              this.$('#mix_selector .more').data('page', mixSet.pagination.next_page);
            }else{
              this.$('#mix_selector .more_pagination').hide();
            }
          }

          $('#nextmix-spinner').children('span').hide();
          this.search_timer=null;
        }, this)
      );
    },

    more : function(event){
      this.search_next_mixes($(event.currentTarget).data('view'), $(event.currentTarget).data('page'));
      return false;
    },

    next_mix_partial : function(mix){
      var able = 'enabled';

      if (mix.user.id === TRAX.currentUser.id && !TRAX.currentUser.get('subscribed')) {
        able = 'disabled';
      }

      return '<li class="'+able+' mix" id="mix_'+mix.id+'"><img src="'+mix.cover_urls.sq56+'" class="cover sq56">'+
             '<div class="title">'+mix.name.substring(0,50)+'</div>'+
              mix.user.login+'</li>';
    }
  });

  return PickNextMixView;
});
define('lib/link_helper', ['global_trax', 'lib/sessions', 'lib/events', 'views/add_to_collection_view', 'lib/jsonh.jquery'],
  function(TRAX, sessions, Events, AddToCollectionView, JSONH){
  var api = {};

  var last_callback_id;

  api.follow_link_click = function(event) {
    $link = $(event.currentTarget);

    if (sessions.loggedIn()) {
      api.toggle_link($link);

      if ($link.hasClass('active')) {
        $link.html('<span class="out">Following</span><span class="in">Unfollow</span>');
        Events.followUser();
      } else {
        $link.html('Follow');
      }

      // Auto-collapse user?
      if ($link.hasClass('collapse_user')) {
        $link.closest('.user_about').slideUp(250);
      }
    } else {
      TRAX.showSignupView();
    }

    // we're about to open a request to Rails
    var callback_id = Math.random();
    last_callback_id = callback_id;

    function showAsFollowing() {
      $link.addClass('active').removeClass('inactive').html('<span class="out">Following</span><span class="in">Unfollow</span>');
      $link.siblings('.follow_counter').addClass('active').removeClass('inactive');
      $link.attr('href', $link.attr('href').replace(/follow|toggle_follow/, 'unfollow'));
    };

    function showAsNotFollowing() {
      $link.removeClass('active').addClass('inactive').html('Follow');
      $link.siblings('.follow_counter').removeClass('active').addClass('inactive');
      $link.attr('href', $link.attr('href').replace(/unfollow|toggle_follow/, 'follow'));
    };

    function invertButton() {
      $link.hasClass('active') ? showAsNotFollowing() : showAsFollowing();
    };
    var nonce = $('meta[name="8tnonce"]').attr('content');

    $link.jsonh_now(function(json){
      if (callback_id==last_callback_id && json.success && json.user) {
        json.user.followed_by_current_user ? showAsFollowing() : showAsNotFollowing();
      } else if (json.success) { //invalid nonce - refresh and try again
        api.refresh_nonce(api.follow_link_click, [event]);
      } else {
        invertButton();
        TRAX.update_flash(json);
      }
    }, { data : { nonce : nonce }});

    TRAX.refreshSidebarAd();
  };

  api.toggle_link = function($link) {
    // toggling state
    $link.toggleClass('active');
    $link.toggleClass('inactive');

    // marking form 'just_clicked' to apply special css
    $link.addClass('just_clicked');

    $link.hover(
      function(){ //do nothing
      },
      function(){
        $link.removeClass('just_clicked');
      }
    );
    return true;
  };

  api.quick_add_click = function(event) {
    var mix_id   = $(event.currentTarget).data('mix_id');
    var mix_name = $(event.currentTarget).data('mix_name');
    App.views.addToCollectionView = new AddToCollectionView({mix : { id : mix_id, name : mix_name }});
    App.views.addToCollectionView.showInFacebox();
    Events.clickAddToCollection();
  };

  api.quick_remove_click = function(event) {
    var mix_id   = $(event.currentTarget).data('mix-id');
    var smartId  = $(event.currentTarget).data('smart-id');
    var promise = $.Deferred();
    JSONH.now('/mix_sets/'+smartId+'/hide_mix', { mix_id: mix_id }, promise.resolve, { type: 'POST' });
    Events.clickRemoveMixFromHistory();
    return promise;
  };

  api.clear_collection_click = function(event) {
    var url = $(event.currentTarget).attr('href');
    var promise = $.Deferred();

    if (confirm('Are you sure you want to remove all the mixes from this collection?')) {
      JSONH.now(url, {}, promise.resolve, { type: 'DELETE' });
      Events.clickClearCollection();
    }
    return promise;
  };

  api.upgrade_link_click = function(event, buttonName) {
    App.views.appView.loadSubscriptionView(event.currentTarget.href || '/plus');
    
    ga('ec:addProduct', {              // Provide product details in a productFieldObject.
      'id': '8tracks_plus',            // Product ID (string).
      'name': '8tracks plus'         // Product name (string).
    });

    ga('ec:setAction', 'click', {       // click action.
      'list': (buttonName || 'Upgrade button')     // Product list (string).
    });

    ga('send', 'event', 'UX', 'click', 'Upgrade', {
      hitCallback: function() {
        //do nothing
      }
    });

    TraxEvents.track('subscribe button cta', { event_type: 'click', page_type: App.currentPage });
  };

  api.refresh_nonce = function(callback, args){
    JSONH.now('/users/new_token.jsonh', function(json){
      $('meta[name="8tnonce"]').attr('content', json.nonce);
      callback.apply(this, args);
    });
  };

  return api;
});
define('lib/trax_facebook', ['lib/traxhead'], function(TRAXHEAD) {
  var api = {};

  api.loadFacebookJs = _.once(function() {
    if (ParsedLocation.urlParams && ParsedLocation.urlParams['extJs'] == 'nope') {
      return false;
    }

    window.fbAsyncInit = TRAXHEAD.onFbInit;

    // regular JS
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=166738216681933";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });


  api.loadFacebookMusicJs = _.once(function() {
    window.fbAsyncInit = TRAXHEAD.onFbMusicInit;

    // JS with FB.Music
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all/vb.js#xfbml=1&appId=166738216681933";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });


  api.parseXFBML = function(el, callback) {
    if (TRAXHEAD.FbLoaded) {
      FB.XFBML.parse(el, callback);
    } else {
      api.loadFacebookJs();
      _.delay(api.parseXFBML, 100, el, callback);
    }
  };

  api.openFbDialog = function(method, options, callback) {
    // try again until FB is loaded
    if (typeof(FB) === 'undefined') {
      api.loadFacebookJs();
      _.delay(this.openFbDialog, 500, method, options, callback);
      return;
    }

    var opts = _.extend(options, {
      method: method,
      display: 'dialog',
      app_id: 166738216681933
    });

    FB.ui(
      opts,
      _.bind(function() {
        if (_.isFunction(callback)) { callback(); }
        App.Events.shareMix({ network : 'facebook', action : (method + ' Dialog'), mix: this.mix });
        this.hideSharing();
      }, this)
    );
  };

  return api;
});
define('views/_base_view', [], function(){
  // OLD-STYLE slideDown function - uses 'height:auto' while hidden to calculate height and show the object.
  $.fn.resetHeight = function(){
    var ob = this;

    ob.hide();
    ob.css('height','auto');

    var targetHeight = ob.height();

    ob.css('height',0);
    ob.show();

    // need delay()/defer() or it doesnt work in FF, dont ask me why.
    _.defer(function() {
      ob.height(targetHeight+'px');
    });
  };

  // NEW-STYLE height adjust function. Can be used with CSS3 transitions for slideDown effects or adjusting from one fixed height to another.
  // Measures the height of the container contents and resets container height to that value.
  // Naive logic simply totals the heights of all of the first-order child elements, so the DOM must be simple for it to function.
  // (i.e. No vertical margins, only padding, and all floated elements in containers with clearfixes)
  $.fn.resetHeightByChildren = function(){
    var ob = this;
    ob.show();
    var targetHeight = 0;
    _.each(ob.children(), function(child){
      targetHeight += $(child).height();
    });

    // need delay()/defer() or it doesnt work in FF, dont ask me why.
    _.defer(function() {
      ob.height(targetHeight+'px');
    });
  };

  $.fn.mergeHtmlAndAttributes = function(newElement){
    var $newElement = $(newElement);
    this.html($newElement.html());
    for (var i in $newElement[0].attributes) {
      if ($newElement[0].attributes[i].nodeName == 'class') {
        this.addClass($newElement[0].attributes[i].value);
      } else {
        this.attr($newElement[0].attributes[i].nodeName, $newElement[0].attributes[i].value);
      }
    }
  };

  return $;
});
/*
With apologies to hoverIntent,
hoverDelegate is a jQuery extension
to allow high-level delegation of
jQuery-style hover events with
a hoverIntent-style delay.

*/

define('jquery.hoverDelegate', [], function() {
    $.fn.hoverDelegate = function(selector, over, out, timein, timeout) {
    if (_.isUndefined(timein)) {
      timein = 100;
    }

    if (_.isUndefined(timeout)) {
      timeout = 100;
    }

    this.delegate(
      selector,
      'mouseover mouseout',
      function(e){
        //copied from jquery
        var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
        while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
        if ( p == this ) { return false; }

        var ob = this;
        if(typeof(ob.hoverDelegateState) == 'undefined'){
          ob.hoverDelegateState = 0;
          ob.hoverDelegateOver  = _.bind(over, this);
          ob.hoverDelegateOut   = _.bind(out, this);
        }

        if(e.type == 'mouseover'){
          if (ob.hoverDelegateState === 0) {
            ob.hoverDelegateTimer = setTimeout(function(){
              ob.hoverDelegateState = 1;
              ob.hoverDelegateOver();
            }, timein);
          }else{
            clearTimeout(ob.hoverDelegateTimer);
          }
        }else{ // if e.type == 'mouseout'
          // if hoverIntent state is true, then call the mouseOut function after the specified delay
          if (ob.hoverDelegateState === 1) {
            ob.hoverDelegateTimer = setTimeout( function(){
              ob.hoverDelegateState = 0;
              ob.hoverDelegateOut();
            }, timeout);
          }else{
            clearTimeout(ob.hoverDelegateTimer);
          }
        }
      }
    );
  };

  return $;
});
/*













*/
 
 // App.views.mixView represents the Mixes#show action. The object is initialized
// after the page is loaded (see mixes#show.erb file).
define('views/mix_view',
  ['global_trax', 'lib/trax_utils', 'lib/sessions', 'lib/events', 'views/trax_view', 'views/mix_player_view', 'views/mix_tracks_played_view', 'views/comments_view', 'views/user_about_view',
   'views/sharing_view', 'views/add_to_collection_view', 'views/pick_next_mix_view', 
   'views/youtube_player_view', 'views/youtube_connect_view', 'views/spotify_player_view', 'views/spotify_connect_view',
   'hgn!templates/mixes/_display', 'hgn!templates/mixes/_likes', 'hgn!templates/mixes/_sidebar_collection',
   'hgn!templates/mixes/_sidebar_collection_mix', 'hgn!templates/mixes/_mix_card', 'hgn!templates/tracks/_track_played',
   'hgn!templates/mixes/_details', 'hgn!templates/mix_sets/_related_collections', 'hgn!templates/blogs/_related_blogs',
   'hgn!templates/admin/_nsfw_stats',
   'lib/link_helper', 'lib/jsonh.jquery', 'lib/_template_helpers', 'lib/trax_facebook', 'views/_base_view', 'jquery.hoverDelegate'],
  function(TRAX, Utils, sessions, Events, TraxView, MixPlayerView, MixTracksPlayedView, CommentsView, UserAboutView,
    SharingView, AddToCollectionView, PickNextMixView, 
    YoutubePlayerView, YoutubeConnectView, SpotifyPlayerView, SpotifyConnectView,
    mixTemplate, mixLikesTemplate, sidebarCollectionTemplate,
    sidebarCollectionMixPartial, mixCardPartial, trackPlayedPartial,
    mixDetailsTemplate, relatedCollectionsTemplate, relatedBlogsTemplate,
    statsTemplate,
   linkHelper, JSONH, TplParams, TraxFacebook){

  var MixView = TraxView.extend({
    el: "#belly",

    events: {
      "click #edit_button"        : 'switchToEditView',
      "click .mix_art img"        : 'mixArtPopup',
      "click .likes_count"        : 'likesDisplay',
      "click .flag_button"        : 'flagMix',
      "click .flag_genres"        : 'flagGenres',
      "click #like_button"        : 'onLikeClick',
      "click #share_button"       : 'toggleSharing',
      "click #yt_share_button"    : 'toggleSharing',
      "click .shareClose"         : 'hideSharing',
      "click #add_button"         : 'onAddClick',
      "click #next_mix_button"    : 'nextMixButton',
      "click #pick_next_mix_button" : 'pickNextMixLightbox',
      "click .sidebar_collection .view_all" : 'viewAllMixes',
      "click #play_overlay, #overlay_animation"  : 'onPlayPauseClick',
      //"touchend #mix_details, #play_overlay, #overlay_animation"  : 'onPlayPauseClick',
      "click #description_html a" : "onDescriptionLinkClick",
      "click #pinterest_button"   : "onPinterestButtonClick",
      "click #play_on_youtube"    : "playOnYoutube",
      "click #visualize"          : "visualize",
      "click .on_demand_prompt" : "openOnDemandPopup",
      "click #save_to_spotify" : 'onSaveToSpotifyClick',
      "click .download_tracklist" : 'onDownloadTracklistClick'
    },

    initialize: function(options) {
      this.childViews = [];
      this.mix           = options.mix;
      this.reviews       = options.reviews;
      this.user_mixes    = options.user_mixes;
      this.similar_mixes = options.similar_mixes;
      this.related_collections = options.related_collections;
      this.related_blogs       = options.related_blogs;
      this.eights = 0;

      this.smart_id      = ParsedLocation.urlHashParams['smart_id'];

      _.bindAll(this, 'onMixPathChanged', 'onMixNameChanged', 'onTagsChange', 'onDescriptionChange', 'onTracksCountChange',
                      'togglePublish', 'switchToEditView', 'hideSharing', 'initTracksPlayed',
                      'adjustPlaylistHeight', 'onPlayerStateChange', 'onMixCoverUrlChange', 'showModeratorControls',
                      'initComments', 'initPlayer', 'updateLikeState', 'play', 'onKeyup', 'showStats', 'openInApp', 'onTrackTogglePlay', 'saveTracksToNewSpotifyPlaylist', 'saveNextTrackToSpotify', 'finishSpotifyPlaylist');

      // in case img onload() hasnt fired
      setTimeout(window.hideFacade, 2000);

      this.mix.on('change:liked_by_current_user', this.updateLikeState);

      //if (window.navigator.userAgent.match(/iphone|ipad|android/i)) {
        window.dummySound = soundManager.createSound({
          id: 'silence',
          url: '/silence.mp3', //about:blank no longer works :(
        });
        window.dummySound.load();
        $('#play_overlay').click(function(event){
          window.dummySound.play();
        });
      //}

      $(document).on('keydown', this.onKeyup);
    },

    afterRender : function(){

      this.setGradient();

      this.$mixName  = this.$('#mix_name');
      this.$playlist = this.$("#playlist");

      this.whenUserReadyOrChanged(_.bind(this.onUserSet, this));

      this.initTracksPlayed(); //do we still need for logged out users??
      this.initComments();
      sessions.updatePermissionsDisplay();
      this.togglePublish();

      if (!this.userAboutView) {
        this.userAboutView = new UserAboutView({ el : this.$('#user_byline'), user : this.mix.get('user')});
        this.userAboutView.afterRender();
        this.childViews.push(this.userAboutView);
      }

      this.updateCounts();
      this.toggleSidebarStyle();

      this.freezeSharing = false;

      if (ParsedLocation.urlHashParams['show_mix_likes'] === '1') {
        this.likesDisplay();
      }

      if (window.playMixOnLoad || ParsedLocation.urlHashParams['play'] || ParsedLocation.urlParams['play']) {
        var playType = 'auto';
        if (window.playMixOnLoad) {
          playType = 'click';
        }
        window.playMixOnLoad = false;
        // in case Play was clicked already
        this.initPlayer(playType);
      }

      $('#play_overlay').removeClass('hidden-xs'); //play button must directly call .play() on mobile devices, so don't show until playback is available
      $('#play_loading').remove();

      $('#mix_details').attr('onclick', null);

      if (App.views.mixPlayerView && App.views.mixPlayerView.mix && App.views.mixPlayerView.mix.id == this.mix.id) {
        this.mixPlayerView = App.views.mixPlayerView;
        this.mixPlayer = App.views.mixPlayerView.mixPlayer;
        this.onPlayerStateChange();
      }

      this.renderPlusOne();
      TraxFacebook.loadFacebookJs();
      TraxFacebook.parseXFBML();

      // Edit mode
      this.initializeEditMode();

      this.showCarousel();
      this.openInApp();

      if (TRAX.isSubscribed()) {
        $('.advertisement').hide();
      }
    },

    showOnDemandPrompt : function(){
      $('.sidebar .on_demand_prompt').remove();
      if (TRAX.currentUser.hasConnected("spotify")) {
        this.$('.sidebar').first().prepend('<div><a class="flatbutton hugebutton button_lime_invert on_demand_prompt active" href="#" style="margin: 0 0 10px;"><span class="i-checkmark"></span> Spotify Connected</a></div>');
      } else {
        this.$('.sidebar').first().prepend('<div><a class="flatbutton hugebutton button_lime on_demand_prompt" href="#" style="margin: 0 0 10px;">Connect Spotify</a></div>');
      }
    },

    setGradient : function(){
      var img = this.$('#cover_art')[0];
      var canvas = this.$('.background-blur')[0];
      TRAX.setGradient(canvas, this.mix.get('color_palette'), 4, img);

      var collections;
      canvases = this.$('.background-blur.unrendered');

      _.each(canvases, function(canvas){
        TRAX.setGradient(canvas, false,  2)
      });
    },

    onUserSet : function(){
      this.initTracksPlayed();

      this.showModeratorControls();
      if (sessions.isAtLeastOwner(this.mix)) {
        this.$('#stats_button').show();
        // this.$('#play_overlay').css({ display : 'block' });
        // this.$('#play_on_youtube_container').parent().css({'top' : '80px'});
      } else {
        this.$('#stats_button').hide();
      }

      //this.showOnDemandPrompt();
        
      if (TRAX.currentUser && (TRAX.currentUser.get('admin') || TRAX.isSubscribed() )){ // _.include(SPOTIFY_TEST_USERS, TRAX.currentUser.id))) { //spotify test user group
        $('#save_to_spotify').show();
      }
    },

    initComments : function() {
      if (!PAGE.serverRendered) {
        var $comments = $('<div id="comments" class="card displaymode"><img src="/assets/spinner/spinner-large.gif" id="reviews-spinner" /></div>');
        this.$('#mix_content').append($comments);

        this.commentsView = new CommentsView({
          reviewable : this.mix,
          reviewable_type : 'Mix',
          per_page : 8,
          load : true,
          onLoad : this.showSidebarAdBTF,
          el : $comments
        });

      } else {
        // initial pageload
        this.commentsView = new CommentsView({
          reviewable : this.mix,
          reviewable_type : 'Mix',
          per_page : 8,
          reviews : this.reviews
        });
        //this.showSidebarAdBTF();
      }

      this.childViews.push(this.commentsView);
    },

    showSidebarAdBTF : function(){
      if ($('#mix_comments .comment').length > 3) {
        $('#sidebar').append('<div class="sidebar_ad_wrapper"><div id="sidebar_ad_btf"></div></div>');
        App.views.adsView.appendSidebarAd()
      }
      if (!PAGE.serverRendered && App.views.adsView) {
        App.views.adsView.fillEmptyAds();
        //App.views.adsView.refreshExistingAds();
      }
    },

    renderPlusOne: function() {
      if (window.gapi) {
        gapi.plusone.go();
      }
    },

    render: function() {

      if(this.mixEditView) {
        delete this.mixEditView;
      }

      //RENDER MIX
      var tplParams = new TplParams(this.mix.toJSON());
      tplParams.async = true;
      if (tplParams.read_only) {
        tplParams.similar_mixes = this.similar_mixes;
      }

      this.$el.html(mixTemplate(tplParams, {'mixes/mix_card' : mixCardPartial.template}));

      //this.$el.append(
      var tpl = '<div class="container">'+
      '  <div id="superheader_box" class="hidden-xs hidden-sm hidden">'+
      '    <div style="" class="advertisement" id="Superheader" data-slot-name="Web_Prebid_Banner" data-size="main_1"></div>'+
      '  </div>'+
      '  <div class="row">'+
      '    <div id="sidebar" class="sidebar displaymode">' +
      '       <div id="sidebar_ad">'+
      '         <span class="advertisement_text">ADVERTISEMENT</span>'+
      '         <div class="advertisement" id="Mixpage_Sidebar" data-slot-name="Web_Prebid_Box" data-size="side_1"></div>'+
      '       </div>'+
      '       <div id="youtube_connect_container" class="displaymode"></div>'+
      '    </div>'+
      '    <div id="mix_content" class="content">'+
      '      <div class="displaymode"><div id="moderator" style="display: none;" class="card"></div></div>' +
      '    </div>'+
      '    <div id="tracklists" class="editmode" style="display: none;">'+
      '      <div class="col-xs-12 col-md-6 col-lg-6"><div id="track_selection" class="card"></div></div>'+
      '      <div class="col-xs-12 col-md-6 col-lg-6"><div id="track_search" class="card"></div></div>'+
      '    </div>'+
      '    <div id="lower_sidebar" class="sidebar displaymode" style="display: block;"></div>'+
      '  </div>'+
      '</div>'; //);
      this.$el.append(tpl);
      this.$('#mix_content').prepend(mixDetailsTemplate(tplParams, {'tracks/track_played' : trackPlayedPartial.template}));

      //RENDER SIDEBAR
      var $sidebar = $('<div class="displaymode"></div>');


      //RENDER DJ MIXES
      if (this.user_mixes) {
        var userMixesTplParams = new TplParams(this.user_mixes);
        $sidebar.append(sidebarCollectionTemplate(userMixesTplParams, {'mixes/sidebar_collection_mix' : sidebarCollectionMixPartial.template}));
      }

      //RENDER RELATED ARTICLES
      if (this.related_blogs && this.related_blogs.length > 0) {
        var relatedTplParams = new TplParams({ related_blogs : this.related_blogs});
        $sidebar.append(relatedBlogsTemplate(relatedTplParams));
      }


      //RENDER SIMILAR MIXES
      if (this.similar_mixes && this.similar_mixes.mixes.length > 0 && !this.mix.get('read_only')) {
        var similarTplParams = new TplParams(this.similar_mixes);
        $sidebar.append(sidebarCollectionTemplate(similarTplParams, {'mixes/sidebar_collection_mix' : sidebarCollectionMixPartial.template}));
      }

      this.mix.on('image:change', this.onMixCoverUrlChange);

      //RENDER RELATED COLLECTIONS
      if (this.related_collections && this.related_collections.collections.length > 0) {
        var relatedTplParams = new TplParams(this.related_collections);
        $sidebar.append(relatedCollectionsTemplate(relatedTplParams));
      }

      this.$('#lower_sidebar').empty().append($sidebar);

      //if (typeof(FB) != 'undefined') FB.XFBML.parse(document.getElementById('content'));

      this.afterRender();
    },

    bindMixEvents : function() {
      this.mix.on('change:path',             this.onMixPathChanged);
      this.mix.on('change:name',             this.onMixNameChanged);
      this.mix.on('change:published',        this.togglePublish);
      this.mix.on('change:description_html', this.onDescriptionChange);
      this.mix.on('change:tracks_count',     this.onTracksCountChange);
      this.mix.on('change:tag_list_cache',   this.onTagsChange);

      this.mix.on('image:change', this.onMixCoverUrlChange);
    },

    onMixCoverUrlChange : function() {
      this.$('#play_area .cover').attr('src', this.mix.image.mixpageUrl());
      this.$('#zoom').hide();
    },

    bindMixPlayerEvents : function() {
      this.onPlayerStateChange();
      this.mixPlayer.on('play resume pause', this.onPlayerStateChange);
      this.mixPlayer.on('switchedToYoutube', this.setHeight);
      this.mixPlayer.on('switchedToSoundManager', this.setHeight);

      // don't rotate ad on autoplay
      if (!this.mixPlayer.autoPlay) {
        this.mixPlayer.on('play', this.rotateSidebarAdOnPlay);
      }
    },

    toggleSidebarStyle : function() {
      // if (!TRAX.showAds()) {
      //   this.$('#sidebar .sidebar_collection .black_tooltip_up').removeClass('black_tooltip_up');
      // }
    },

    initializeEditMode: function() {
      $('#edit_spinner').html(TRAX.spinner({ length : 5, radius: 5, color : '#eee' })).show();

      if (window.location.href.match(/\/edit$/)) {
        this.urlIsEditMode = true;
      }

      if (!this.mix.get('published') || this.urlIsEditMode) {
        this.switchToEditView();
      }

      this.bindMixEvents();
      this.replaceState();
    },

    switchToEditView: function() {
      if (window.navigator.userAgent.match(/iphone|ipad|android/i)) {
        App.Trax.show_flash_error('Sorry, mix editing doesn\'t work on mobile devices yet. Please try again using a desktop browser.', true);
        return false;
      }

      $('#edit_button').addClass('loading');
      var view = this;

      require(['views/mix_edit_view'], function(MixEditView) {
        $('#edit_button').removeClass('loading');
        if (!view.mixEditView) {
          view.mixEditView = new MixEditView({mix : view.mix});
          view.childViews.push(view.mixEditView);
        }
        view.mixEditView.editMode();
      });
      return false;
    },

    onMixPathChanged: function() {
      // console.log('onMixPathChanged', this.mix.get('web_path'));
      this.replaceState();
    },

    replaceState: function() {
      if (ParsedLocation.urlParams['keep_params']) return false;
      TRAX.pushCurrentState(this.mix.get('web_path') + (PAGE.editMode ? '/edit' : ''), true);
    },

    onMixNameChanged: function() {
      document.title = this.mixPageTitle();
      this.$('#mix_name').html(this.mix.get('name'));
    },

    mixPageTitle: function() {
      return this.mix.get('name') + ' | ' + this.mix.get('user').login;
    },

    onDescriptionChange: function() {
      var description = this.mix.get('description');
      var htmlDescription = this.mix.get('description_html');

      this.$('#description_html').html('<p>' + htmlDescription + '</p>');
    },

    onTracksCountChange: function() {
      this.$('#tracks_count').html('('+ this.mix.get('tracks_count') +' tracks)');
    },

    onTagsChange : function() {
      this.$('#mix_tags_display').html(TRAX.templateHelpers.list_tags.call(this.mix.toJSON()));
    },

    onMixCoverImgixUrlChange : function() {
      $('#play_area .cover').attr('src', this.mix.get('cover_imgix_url') + '&w=525');
    },

    togglePublish : function() {
      if (this.mix.get('published')) {
        this.$('#embed_button, #share_button, #fb_share').show();
        this.$('#edit_button').addClass('published');
      } else {
        this.$('#embed_button, #share_button, #fb_share').hide();
        this.$('#edit_button').removeClass('published');
      }
    },

    showPublishedStatusView: function() {
      if (sessions.isAtLeastOwner(this.mix)) {
        new TRAX.PublishStatusView({ mix: TRAX.mix }).show();
      }
    },

    initPlayer: function(playType) {
      
      //block all mix playback
      // this.playOnYoutube(null, null, null, playType);
      // return false;


      if (!TRAX.isReady) {
        _.delay(this.initPlayer, 150, playType);
        return false;
      }

      if (this.onDemand || App.views.youtubePlayerView || App.views.spotifyPlayerView) return;

      window.playMixOnLoad = false; //reset state variable so it doesn't take over newly-loaded pages
      //TODO takeover currently-playing mix if applicable

      // if ($('body').hasClass('international')) {
      //   this.playOnYoutube();
      //   return false;
      // }

      if (App.Trax.regionallyBlocked() && !this.intlPlaybackAllowed()) {
        this.playOnYoutube(null, null, null, playtype);
        return;
      }

      if (!App.views.mixPlayerView) {
        App.views.mixPlayerView = new MixPlayerView({ mix: this.mix, smart_id : this.smart_id });
        App.views.mixPlayerView.show();
      } else {
        App.views.mixPlayerView.loadMix(this.mix, this.smart_id);
      }

      this.mixPlayer = App.views.mixPlayerView.mixPlayer;

      App.views.mixPlayerView.loadMix(this.mix, this.smart_id);

      this.bindMixPlayerEvents();

      var skipPreroll = (this.mix.id == this.carousel_mix_id);
      //use view instead of player to trigger preroll if applicable
      App.views.mixPlayerView.playMix('click', skipPreroll);
      //this.mixPlayer.play('click');

      this.$('#visualize').show();

      return this.mixPlayer;
    },

    intlPlaybackAllowed : function(){
      return TRAX.currentUser &&
             (sessions.isAtLeastOwner(this.mix) ||
              TRAX.currentUser.isJuniorModerator());
    },

    play: function () {
      if (this.onDemand) {
        this.playOnDemand();
        return;
      }

      if (this.mixPlayer) {
        this.mixPlayer.play('auto');
      } else {
        this.onPlayPauseClick();
      }
      return false;
    },

    initTracksPlayed: function() {
      console.log('initTracksPlayed onDemand:', this.onDemand);
      if (TRAX.currentUser && (TRAX.currentUser.hasConnected("youtube")) && !this.onDemand) { // || TRAX.currentUser.hasConnected("spotify"))) {
        this.onDemand = true
        this.provider =  'youtube'; //TRAX.currentUser.hasConnected("spotify") ? 'spotify' : 'youtube';
        this.mix.withInternationalTracks(this.initTracksPlayed);
      } else {
        if (this.mixTracksPlayedView) {
          console.log(1);
          //if (this.mixTracksPlayedView.onDemand != this.onDemand) { //switching to ondemand or loading first page
            this.mixTracksPlayedView.onDemand = this.onDemand;
            this.mixTracksPlayedView.render();
            console.log(2);
          //}
        } else { //initializing tracks played
          console.log(3);
          this.mixTracksPlayedView = new MixTracksPlayedView({ mix: this.mix, mixView: this, onDemand: this.onDemand });
          if (this.onDemand) this.mixTracksPlayedView.render();
          this.childViews.push(this.mixTracksPlayedView);
        }

        if (this.mix.tracks) {
          this.mix.tracks.on('togglePlay', this.onTrackTogglePlay);
        }

        //var ondemand_test_ids = [784339, 2988065, 13255675, 346484, 1509153, 686669, 15231, 9353096, 9997488];
        
      }//$('#playlist').append(this.mixTracksPlayedView.$tracks_played);
    },

    openOnDemandPopup : function(){
      require(['views/on_demand_connect_view'], function(OnDemandConnectView) {
        window.onDemandConnectView = new OnDemandConnectView();
      });
    },


    onTrackTogglePlay : function(track) {
      this.playOnDemand({}, track, App.views.mixView.mix.tracks.indexOf(track), 'click')
    },

    updateCounts: function() {
      JSONH.now_with_context(
        '/mixes/' + this.mix.id + '/counts',
        this,
        function(json) {
          if (json.plays_count && json.plays_count>0) this.$('#mix_description .plays_count').html('&nbsp;'+Utils.addCommas(json.plays_count));
          if (json.likes_count && json.likes_count>0) this.$('#mix_description .likes_count').html('&nbsp;'+Utils.addCommas(json.likes_count));// + ' <span class="gray">(view all)</span>');
        }
      );
    },

    mixArtPopup: function(event) {
      if (PAGE.editMode) {
        $("#cover_art_upload_link").click();
      }
    },

    likesDisplay: function(event) {
      $('.likes_count').addClass('active');
      $('#mix_likes').toggleClass('active');
      if ($('#mix_likes').hasClass('active')) {
        JSONH.now('/mixes/' + this.mix.id + '/likes', function(json) {
          var tplParams = new TplParams(json);
          $('#mix_likes').html(mixLikesTemplate(tplParams)).slideDown('fast');
          //TODO add paging behaviors
        });
      } else {
        $('.likes_count').removeClass('active');
        $('#mix_likes').slideUp('fast');
      }
      return false;
    },

    viewAllMixes : function(event) {
      var $link = $(event.currentTarget);
      $link.hide().siblings('.spin').children('span').show();

      JSONH.now($link.attr('href'), _.bind(function(json) {
        _.each(json.mix_set.mixes, function(mix) {
          mix.smart_id = json.mix_set.smart_id;
        });

        var tplParams = new TplParams(json.mix_set);
        tplParams.pagination.next_page = false;

        var allMixes = sidebarCollectionTemplate(tplParams, {'mixes/sidebar_collection_mix' : sidebarCollectionMixPartial.template } );
        $link.parents('.sidebar_collection').replaceWith(allMixes);
        TRAX.refreshSidebarAd();
      }, this));

      return false;
    },

    flagGenres : function(event) {
      var $link = $(event.currentTarget);

      this.$('.genres').fadeOut();

      JSONH.now($link.data('href'), _.bind(function(json) {
      }, this), { with_lock : true, type: 'POST', spinner : this.$('#flaggings-spinner') });
    },

    // TODO Turn this into a view object
    flagMix: function(event) {
      var $link = $(event.currentTarget);

      if (!sessions.loggedIn()) {
        TRAX.showSignupView();
        return false;
      }

      if (!$link.hasClass('flagged')) {
        $link.addClass('flagged');
        JSONH.now($link.data('href'), _.bind(function(json) {
          this.$('.flaggings').removeClass('tooltip_container').html(statsTemplate(json.mix)).prepend('<a href="/nsfw" class="tooltip_container dws_logo"><img src="/assets/logo/DWS.logo.mini.png" /><div class="black_tooltip black_tooltip_up">Join the 8tracks Department of Workplace Safety!</div></a>');
          this.mix.set('flaggings', json.mix.flaggings);
          this.animate_stats(this.$('.flaggings'), this.mix);
        }, this), { with_lock : true, type: 'POST', spinner : this.$('#flaggings-spinner') });
      }

      return false;
    }, // flagMix

     animate_stats : function($mix, mix) {
        if (!$mix || !mix) return false;
        var total_flags =  mix.get('flaggings').safe_flags + mix.get('flaggings').regular_flags + mix.get('flaggings').admin_flags + mix.get('flaggings').admin_safe_flags;
        var safe_percent = Math.round((mix.get('flaggings').safe_flags + mix.get('flaggings').admin_safe_flags) * 100 / total_flags) || 0;
        var nsfw_percent = Math.round((mix.get('flaggings').regular_flags + mix.get('flaggings').admin_flags)   * 100 / total_flags) || 0;

        $mix.find('.safe_percent').text(safe_percent + '%');
        $mix.find('.safe_flags').text(  mix.get('flaggings').safe_flags + mix.get('flaggings').admin_safe_flags );
        $mix.find('.safe.stat').width(  safe_percent + '%');
        $mix.find('.not_safe_percent').text(nsfw_percent + '%');
        $mix.find('.not_safe_flags').text(  mix.get('flaggings').regular_flags + mix.get('flaggings').admin_flags );
        $mix.find('.not_safe.stat').width(  nsfw_percent + '%');
      },

    nextMixButton: function() {
      if (this.mixPlayer) {
        TRAX.overlay_animation('next_mix');
        this.mixPlayer.skipMix();
      }

      return false;
    },


    adjustPlaylistHeight: function() {
      // _.each(this.$('#playlist, #selected_tracks'), function(playlist) {
      //   //adjust height of playlist so hovering doesn't change document height
      //   p = $(playlist);
      //   tracks = p.find('.track, .track_placeholder');

      //   if (tracks.length > 0) {
      //     var height = 0;
      //     _.each(tracks, function(track) {
      //       height = height + $(track).height() + 10;
      //     });
      //     p.css('min-height', (height + 37) );
      //   } else {
      //      p.hide();
      //   }

      // });

      // this.setHeight();
    },

    setHeight: function(){
      if (TRAX.dialogView) {
        TRAX.dialogView.setWindowVars();
      }
    },

    onLikeClick : function(event) {
      $link = $(event.currentTarget);

      if (sessions.loggedIn()) {
        TRAX.refreshSidebarAd();
        linkHelper.toggle_link($link);

        if ($link.hasClass('active')) {
          this.overlay_animation('like');

          if(!this.$('#share_button').hasClass('active')){
            this.toggleSharing({from_like: true});
            this.shareTimer = _.delay(this.hideSharing, 5000);
          };
        }

        this.mix.toggleLike();

      } else {
        var options = {};
        options.success_callback = _.bind(function() {
          this.mix.toggleLike(false, this.mix);
        }, this);
        TRAX.showSignupView(options);
      }
      return false;
    },

    updateLikeState: function() {
      var $link = this.$('#like_button');

      if (this.mix.get('liked_by_current_user')) {
        $link.addClass('active').removeClass('inactive');
        if (this.mix.get('user').id == 645) {
          TRAX.show_flash_error_with_timeout('secret mode unlocked. press 8888 to access vizimalizer.');
        }
      } else {
        $link.removeClass('active').addClass('inactive');
      }
    },

    toggleSharing: function(options) {
      clearTimeout(this.shareTimer);
      if (!this.sharingView) {
        var description;
        if (_.include(this.mix.get('genres'), 'hip hop') || this.mix.get('tag_list_cache').match(/beats|hip hop|rap|bass/)) {
          description = 'These #beats doe! (via @8tracks)';
        } else {
          description = 'This is why I love @8tracks #NP ' + (this.mix.get('genres').length > 0 ? '#'+this.mix.get('genres')[0] + ' ' : '');
        }

        var el = (options.currentTarget && (options.currentTarget.id == 'yt_share_button')) ? '#yt_share .share_view' : '#share .share_view';

        this.sharingView = new SharingView({
          el              : el,
          mix             : this.mix,
          url             : 'https://8tracks.com' + this.mix.get('web_path'),
          name            : this.mix.get('name'),
          image           : this.mix.get('cover_urls')['cropped_imgix_url'] ,
          //embedCode       : this.mix.embedCodeHtml5(),
          description     : description,
          description_html: 'Check out this playlist on @8tracks: <a href="http://8tracks.com' + this.mix.get('web_path') + '?utm_campaign=tumblr_button&utm_source=tumblr.com&utm_medium=referral">' + this.mix.get('name') + '</a> by <a href="http://8tracks.com' + this.mix.get('user').web_path + '?utm_campaign=tumblr_button&utm_source=tumblr.com&utm_medium=referral">' + this.mix.get('user').login + '</a>.',
          twitter_related : this.mix.get('user').twitter_username,
          buttons         : ['facebook', 'twitter', 'tumblr', 'google', 'email', 'embed']//'stumbleupon', 'pinterest',
        });
        this.childViews.push(this.sharingView);
        this.sharingView.render();
        this.sharingView.afterRender();
        this.sharingView.on('shareClick', this.hideSharing);
      }

      if (!this.$('#share_button').hasClass('active')) {
        this.hideSharing();

        this.$('#mix_recommend, .mix_interactions').hide();
        this.$('.share_view').show();
        this.$('.share_interactions').fadeIn(150);
        this.$('#share_button, #mix_buttons').addClass('active');
        if (options.from_like) {
          this.$('.like_share').show();
        } else {
          this.$('.like_share').hide();
        }

        // close Sharing on ESC
        $(document).bind('keydown.sharing', _.bind(function(e) {
          if (e.keyCode == 27) this.hideSharing();
          return true;
        }, this));

        Events.clickMixShare();

        // we don't want to create a share event if this pops open due to liking a mix
        var from_like = options && options.from_like;
        var event_type = from_like ? 'auto show' : 'click';
        var mix_publisher = this.mix.get('user');
        TraxEvents.track('share dialog opened', {
          event_type:   event_type,
          content_type: 'mix',
          page_type:    'mix',
          mix_id: this.mix.get('id'),
          profile_id: mix_publisher && mix_publisher.id,
        });
      } else {
        this.hideSharing();
      }

      return false;
    },

    hideSharing: function() {
      // in case the FB dialog is open
      try {
        FB.Dialog.remove(FB.Dialog._active);
      } catch(e) {
        //Facebook not loaded
      }

      this.$('.share_interactions').hide();
      this.$('.mix_interactions').fadeIn(150);
      this.$('#share_button, #add_button, #mix_buttons').removeClass('active');
      $(document).unbind('keydown.sharing');
      return false;
    },

    shareByEmail: function() {
      return false;
    },

    selectURL: function(event) {
      $(event.currentTarget).focus().select();
      return false;
    },

    pickNextMixLightbox: function(event) {
      var pickNextMixView = new PickNextMixView({mix:this.mix});
      this.childViews.push(pickNextMixView);
      pickNextMixView.show();
      return false;
    },

    onPlayPauseClick : function(event) {
      if (this.onDemand) {
        if (App.views.spotifyPlayerView && App.views.spotifyPlayerView.mix.id == this.mix.id) {
          App.views.spotifyPlayerView.togglePlay();
        } else {
          this.playOnDemand();
        }
        return;
      }

      
      console.log('onPlayPauseClick', this.mixPlayer);
      if (event && !_.include(['play_overlay', 'overlay_animation'], event.currentTarget.id)) {
        return true;
        // do not propagate clicks on child elements
      }

      if (App.views.mixPlayerView && App.views.mixPlayerView.mix.id == this.mix.id) {
        App.views.mixPlayerView.mixPlayer.toggle();
      } else {
        this.initPlayer();
        return false;
      }
    
      return false;
    },

    onPlayerStateChange : function(force) {
      console.log('onPlayerStateChange:'+force);
      // console.log('onPlayerStateChange');

      if ((this.mixPlayer && this.mixPlayer.started) || force) {
        this.$('#play_overlay .quick_play').hide();
        //this.showCarousel();
      }
    },


    overlay_animation : function(animation_name) {
      $('#overlay_animation').remove();
      $overlay = $('<div id="overlay_animation" class="'+animation_name+'"></div>');
      this.$('#play_area').prepend($overlay);
      // $overlay.show().fadeOut(1000).queue(function() {
      //   $(this).remove();
      // });
    },


    onAddClick : function(event){
      if (!TRAX.currentUser) {
        TRAX.showSignupView();
        return false;
      }
      var addToCollectionView = new AddToCollectionView({mix : this.mix});
      var el = addToCollectionView.render();
      $.facebox(el);
      Events.clickAddToCollection();
      return false;
    },

    onDescriptionLinkClick : function(event){
      if (event.currentTarget.host == window.location.host) {
        App.router.navigate(event.currentTarget.pathname, { trigger: true });
        return false;
      }
    },

    showModeratorControls : function() {
      if (TRAX.currentUser && (TRAX.currentUser.get('admin') || TRAX.currentUser.get('moderator'))) {
        var currentView = this;
        require(['views/moderator_view'], function(ModeratorView) {
          currentView.moderatorView = new ModeratorView({ mix : currentView.mix });
          currentView.childViews.push(this.moderatorView);
        });
      }
    },

    onPinterestButtonClick: function() {
      App.Events.clickMixShareOption({
        network: "Pinterest",
        action: "share",
        url: "https://8tracks.com" + this.mix.get('web_path')
      });
    },

    onClose : function() {
      this.$('#play_area').unbind('hover');

      if (this.mixPlayer) {
        this.mixPlayer.unbind('play resume pause', this.onPlayerStateChange);
        this.mixPlayer.unbind('play', this.rotateSidebarAdOnPlay);
      }

      this.cleanupSidebar();

      PAGE.editMode = null;

      $(document).unbind('onkeyup', this.onKeyup);

      if (App.views.youtubePlayerView) {
        App.views.youtubePlayerView.onMixViewClose();
      } else if (App.views.spotifyPlayerView) {
        App.views.spotifyPlayerView.onMixViewClose();
      }
    },

    onKeyup : function(event){
      if (App.views.mixPlayerView) {
        if (event.which == 56) {
          this.eights += 1;
        } else {
          this.eights = 0;
        }

        if (this.eights == 4) {
          this.visualize();
        }
      }
    },

    cleanupSidebar: function() {
      $('#moderator').remove();
      $('#sidebar .displaymode > :not(".sidebar_ad_wrapper")').remove();
    },

    visualize : function(){
      if (App.views.eight888View && App.views.eight888View.renderer) return false;
      require(['views/8888_view'], function(Eight8888View) {
        App.views.eight888View = new Eight8888View();
      })
      return false;
    },

    onViewStatsClick : function(event) {
      if (this.statsView) {
        this.$('#stats').slideDown();
      } else {
        var statsPromise = $.Deferred();
        var viewPromise  = $.Deferred();
        $(event.currentTarget).jsonh_now(function(json){
          statsPromise.resolve(json);
        });

        if (App.Views.MixStatsView) {
          viewPromise.resolve(App.Views.MixStatsView);
        } else {
          require(['views/mix_stats_view'], function(MixStatsView) {
            App.Views.MixStatsView = MixStatsView;
            viewPromise.resolve();
          });
        }

        $.when(statsPromise, viewPromise).done(this.showStats);
        return false;
      }
    },

    showStats : function(statsPromise, viewPromise) {
      this.statsView = new App.Views.MixStatsView({
        mix : this.mix,
        stats : statsPromise.stats,
        serverRendered : false
      });
      this.$('#stats').slideDown();
    },

    carousel_mixes : {
      6996593 : {
        clickthrough : 'http://www.cwtv.com/shows/crazy-ex-girlfriend/',
        impression_tracker : 'http://8trx.com/1Vlrn6L',
        images : ['https://s3.amazonaws.com/8tr.ad.assets/carousel_images/CW_Crazy%20Ex_eCards_1.png',
                  'https://s3.amazonaws.com/8tr.ad.assets/carousel_images/CW_Crazy%20Ex_eCards_2.png',
                  'https://s3.amazonaws.com/8tr.ad.assets/carousel_images/CW_Crazy%20Ex_eCards_3.jpg',
                  'https://s3.amazonaws.com/8tr.ad.assets/carousel_images/CW_Crazy%20Ex_eCards_4.png']
      },
      5325046 : {
        impression_tracker : 'http://8trx.com/1PdSvkz',
        clickthrough : 'http://8trx.com/1l2csOt' //http://Gillette.com/SPECTRE'
      }
    },

    showCarousel : function(){
      if (_.include(_.keys(this.carousel_mixes), String(this.mix.id))) {
        var self = this;
        require(['views/carousel_view'], function(CarouselView){
          self.$('#mix_art_wrapper').addClass('carousel');
          self.$('#play_area').addClass('has_carousel');
          self.carouselView = App.views.carouselView = new CarouselView({ el : self.$('#mix_art_wrapper').parent(), data : self.carousel_mixes[self.mix.id] });
        });
      }

    },

    playOnDemand : function(event, track, trackIndex, playType){
      if (App.views.mixPlayerView) {
        App.views.mixPlayerView.close();
        delete App.views.mixPlayerView;
      }

      if (this.sharingView) {
        this.hideSharing();
        this.sharingView.close();
        delete this.sharingView;
      }

      this.$('#play_overlay .quick_play').hide();

      if (this.provider == 'spotify') {
        this.playOnSpotify(event, track, trackIndex, playType);
      } else {
        this.playOnYoutube(event, track, trackIndex, playType);
      }
    },

    playOnYoutube : function(event, track, trackIndex, playType){
      if (!App.views.youtubePlayerView) {
        App.views.youtubePlayerView = new YoutubePlayerView({mix : this.mix, smart_id : this.smart_id});
      }
      
      App.views.youtubePlayerView.loadMix(this.mix, this.smart_id);
      App.views.youtubePlayerView.play(this.mix, track, trackIndex, playType);
    },

    playOnSpotify : function(event, track, trackIndex, playType){
      if (!App.views.spotifyPlayerView) {
        App.views.spotifyPlayerView = new SpotifyPlayerView({mix : this.mix, smart_id : this.smart_id});
      }
      
      App.views.spotifyPlayerView.loadMix(this.mix, this.smart_id);
      App.views.spotifyPlayerView.play(this.mix, track, trackIndex, playType);
    },


    onSaveToSpotifyClick : function(){
      if (TRAX.currentUser.hasConnected("spotify")) {
        $('.sidebar .on_demand_prompt').remove();
        this.mix.withInternationalTracks(this.saveTracksToNewSpotifyPlaylist);
      } else {
        this.openOnDemandPopup();
      }
      this.spotifyTrackIndex = 0;
    },

    saveTracksToNewSpotifyPlaylist(){
      // if (!this.mix.tracks.models[this.spotifyTrackIndex]) {
      //   //this.mix.withInternationalTracks(this.saveTracksToNewSpotifyPlaylist);
      //   return;
      // }
      
      if (!window.spotifyApi) window.spotifyApi = new SpotifyWebApi();

      if (!spotifyApi.getAccessToken()) {
        $.ajax('/auth/spotify/refresh',
            { success : _.bind(function(json) {
                spotifyApi.setAccessToken(json.access_token);
                this.saveTracksToNewSpotifyPlaylist();
              }, this)
            }
          );
        return;
      }

      if (!this.spotifyUserId) {
        spotifyApi.getMe({}, _.bind(function(err, user){
          if (err || !user) {
            TRAX.show_flash_error('Unable to find your Spotify account. Please make sure you\'re logged in at <a href="http://open.spotify.com">open.spotify.com</a>.');
            return;
          } else {
            this.spotifyUserId = user.id;
            this.saveTracksToNewSpotifyPlaylist();
          }
        }, this));
        return;
      }

      var mixname = this.mix.get('name');
      if (App.Trax.currentUser.id != this.mix.get('user_id')) {
        mixname += ' by ' + this.mix.get('user').login;
      }

      spotifyApi.createPlaylist(this.spotifyUserId, { name : mixname, description : this.mix.get('description').substr(0, 300) }, _.bind(function(err, data){
        if (err) {
          this.openOnDemandPopup();
          App.Trax.show_flash_error('An error ocurred while creating a new Spotify playlist. Please disconnect and re-connect your Spotify account, then reload the page.');
          console.log(err);
          return;
        } 
        this.spotifyPlaylistId = data.id;
        this.spotifyPlaylistUrl = data.uri;

        $.facebox('<div id="spotify_save_popup">'+
          '<h2 id="spotify_save_popup_title"><span class="i-spotify" style="float: right; padding:24px;"></span> <span class="title">Saving tracks to Spotify...</span></h2>'+
          '<h3 id="spotify_progress">Progress <span id="spotify_track_progress">0</span> of ' + this.mix.tracks.length + '</h3>'+
          '<ol id="spotify_tracks_saved"></ol>'+
          '</div>');

        this.spotify_track_ids = [];

        this.saveNextTrackToSpotify();

      }, this));


    },

    saveNextTrackToSpotify : function(){
      if (this.spotifyTrackIndex == this.mix.tracks.length) {
        this.finishSpotifyPlaylist();
        return;
      }

      var t = this.mix.tracks.models[this.spotifyTrackIndex];

      var query = t.get('name') + ' artist:'+t.get('performer');
      var options = {};
      // var geo = cookie.get('country_code3');
      // if (geo) options['market'] = geo;

      $('#spotify_tracks_saved').append("<li><strong>"+t.get('name') + '</strong> <em>by</em> '+t.get('performer'));

      spotifyApi.searchTracks(
        query,
        options,
        _.bind(function(err, data) {
          if (data.tracks.items[0]) {
            //var spotifyId = 
            //track.set('spotifyId') = data.tracks.items[0].id;
            this.spotify_track_ids.push('spotify:track:'+data.tracks.items[0].id);
            $('#spotify_tracks_saved').children().last().addClass('success');
          } else {
            if (err && err.code == 429) {
              //rate limited!! try again  todo
              // return
            } else {
              //track not found or already known unplayable in this geo
              t.set('unavailable', true);
              $('#spotify_tracks_saved').children().last().addClass('error');
            }
          }
          this.spotifyTrackIndex += 1;
          $('#spotify_track_progress').html(this.spotifyTrackIndex);
          _.delay(this.saveNextTrackToSpotify, 250);
        }, this)
      );
    },

    finishSpotifyPlaylist : function(){
      console.log('finishing spotify playlist!');
      spotifyApi.addTracksToPlaylist(this.spotifyPlaylistId, _.first(this.spotify_track_ids, 100), _.bind(function(err, data){
          // if (this.spotify_track_ids.length > 100) { //TODO loop and save the rest
          //   this.spotify_track_ids = _.rest(this.spotify_track_ids, 100);
          //   _.delay(this.finishSpotifyPlaylist, 1000);
          //   return;
          // } 

          if (err) {
            App.Trax.show_flash_error('Error adding tracks to playlist.');
            return;
          } 

          //UPLOAD THE IMAGE
          if (!this.spotifyImgSaved) {
            $('#spotify_progress').html('Uploading cover art...');
            toDataURL(this.mix.get('cover_urls')['sq500'], _.bind(function(dataUrl) {
              spotifyApi.uploadCustomPlaylistCoverImage(this.spotifyPlaylistId, dataUrl, _.bind(function(err, data){
                $('#spotify_progress').remove();
                $('#spotify_save_popup_title .title').text('Playlist saved to Spotify!').after(
                  '<p>View your playlist: <a href="'+this.spotifyPlaylistUrl+'">'+this.mix.get('name')+'</a></p>');
                $('#spotify_tracks_saved').before(
                  '<p><strong><a href="#" class="download_playlist_tracklist">Download playlist tracklist (.txt)</a></strong></p>');
                $('.download_playlist_tracklist').click(_.bind(this.downloadPlaylist, this));
              }, this));
            }, this));
          }

      }, this));
    },

    downloadPlaylist : function(){
      var text = this.mix.get('name') + "\r\n";
      text += 'by ' + this.mix.get('user').login + "\r\n";
      var i = 1;

      _.each(this.mix.tracks.models, function(track){
        text += i +'. ' + track.get('name') + ' by ' + track.get('performer') + "\r\n";
        i++;
      });

      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', '8tracks-'+this.mix.get('user').login+'-'+this.mix.get('name') + '.txt');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },

    onDownloadTracklistClick : function(event){
      this.mix.withInternationalTracks(_.bind(this.downloadPlaylist, this));
      return false;
    },


    openInApp : function() {
      if (window.device != 'desktop') {
        this.$(".quick_actions.download").removeClass("hidden");
        if (this.mix.get('dynamic_branch_io_deeplink')) {
          $('.inlineAppBanner a').attr('href', this.mix.get('dynamic_branch_io_deeplink'));
        }
        // this.setBranchLink(
        //   "mix",
        //   this.mix.id,
        //   this.mix.get('name'),
        //   this.mix.get('cover_urls'),
        //   this.mix.get('color_palette')
        // );
      }
    },

    // setBranchLink : function(type, id, name, image_urls, color_palette) {
    //   (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-v1.6.1.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"init data addListener removeListener setIdentity logout track link sendSMS referrals credits creditHistory applyCode validateCode getCode redeem banner closeBanner".split(" "), 0);

    //   branch.init('key_live_dbaFfXT9w2wtsTSSnOuvJocgdmf6PNH8', function(err, data) {
    //     if (err != null) {
    //       console.log("branch error");
    //       $('#openInAppContainer').attr('href', branch_link);
    //       return;
    //     }
    //   });

    //   var branch_data = {
    //     type: type,
    //     name: name,
    //     id: String(id)
    //   };

    //   if (image_urls) {
    //     branch_data.static_cropped_imgix_url = image_urls.static_cropped_imgix_url;
    //     branch_data.cropped_imgix_size = image_urls.cropped_imgix_size;
    //   }

    //   if (color_palette) {
    //     branch_data.image_color_palette = color_palette.join()
    //   }

    //   branch.link({
    //     data: branch_data
    //   }, function(err, branch_link) {
    //     if (err != null) {
    //       console.log("branch error");
    //       return;
    //     }
    //     $('#openInAppContainer').attr('href', branch_link);
    //     console.log("branch_link: " + branch_link);
    //   });
    // },

  });

    window.toDataURL = function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    }


    window.hideFacade = function() {
      var facade = document.getElementById('cover_facade');
      if (facade) facade.className = 'hidden';
    };

    return MixView;
});

define('pages/mixes_show',['global_trax', 'models/mix', 'views/mix_view', 'views/user_about_view', 'collections/mixes'], function(TRAX, Mix, MixView, UserAboutView, Mixes){

  //store view classes for async use
  if (!App.Views.MixView) {
    App.Views.MixView = MixView;
    App.Views.UserAboutView = UserAboutView;
    App.Models.Mix = Mix;
  }

  //run render callbacks on async
  if (!PAGE.serverRendered) App.views.appView.showMixView();

  // instantiate on server-rendered pages
  if (PAGE.serverRendered) {
    TRAX.mix = Mixes.load(PAGE.mix);
    App.currentView = App.views.mixView = new MixView({mix: TRAX.mix});
    App.views.mixView.afterRender();
  }


});

