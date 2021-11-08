(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","  ":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
// PATCHED BY 8tracks
// TO EXPOSE PUBLIC METHODS urlError, methodMap
// AND ADD method getValue

//     Backbone.js 0.9.10

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to array methods.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.10';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
    } else if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
    } else {
      return true;
    }
  };

  // Optimized internal dispatch function for triggering events. Tries to
  // keep the usual cases speedy (most Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length;
    switch (args.length) {
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
    return;
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
    return;
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
    return;
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
    return;
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, or an events map,
    // to a `callback` function. Passing `"all"` will bind the callback to
    // all events fired.
    on: function(name, callback, context) {
      if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
      this._events || (this._events = {});
      var list = this._events[name] || (this._events[name] = []);
      list.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind events to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      this.on(name, once, context);
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var list, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (list = this._events[name]) {
          events = [];
          if (callback || context) {
            for (j = 0, k = list.length; j < k; j++) {
              ev = list[j];
              if ((callback && callback !== ev.callback &&
                               callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                events.push(ev);
              }
            }
          }
          this._events[name] = events;
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // An inversion-of-control version of `on`. Tell *this* object to listen to
    // an event in another object ... keeping track of what it's listening to.
    listenTo: function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      obj.on(name, typeof name === 'object' ? this : callback, this);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return;
      if (obj) {
        obj.off(name, typeof name === 'object' ? this : callback, this);
        if (!name && !callback) delete listeners[obj._listenerId];
      } else {
        if (typeof name === 'object') callback = this;
        for (var id in listeners) {
          listeners[id].off(name, callback, this);
        }
        this._listeners = {};
      }
      return this;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options && options.collection) this.collection = options.collection;
    if (options && options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // ----------------------------------------------------------------------

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // ---------------------------------------------------------------------

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
      };
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, success, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      success = options.success;
      options.success = function(model, resp, options) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
      };

      // Finish configuring and sending the Ajax request.
      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(model, resp, options) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
      };

      if (this.isNew()) {
        options.success(this, null, options);
        return false;
      }

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return !this.validate || !this.validate(this.attributes, options);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire a general
    // `"error"` event and call the error callback, if specified.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, options || {});
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this.models = [];
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, model, attrs, existing, doSort, add, at, sort, sortAttr;
      add = [];
      at = options.at;
      sort = this.comparator && (at == null) && options.sort != false;
      sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(attrs = models[i], options))) {
          this.trigger('invalid', this, attrs, options);
          continue;
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.merge) {
            existing.set(attrs === model ? model.attributes : attrs, options);
            if (sort && !doSort && existing.hasChanged(sortAttr)) doSort = true;
          }
          continue;
        }

        // This is a new model, push it to the `add` list.
        add.push(model);

        // Listen to added models' events, and index models for lookup by
        // `id` and by `cid`.
        model.on('all', this._onModelEvent, this);
        this._byId[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (add.length) {
        if (sort) doSort = true;
        this.length += add.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(add));
        } else {
          push.apply(this.models, add);
        }
      }

      // Silently sort the collection if appropriate.
      if (doSort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = add.length; i < l; i++) {
        (model = add[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (doSort) this.trigger('sort', this, options);

      return this;
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      this._idAttr || (this._idAttr = this.model.prototype.idAttribute);
      return this._byId[obj.id || obj.cid || obj[this._idAttr] || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) {
        throw new Error('Cannot sort a set without a comparator');
      }
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Smartly update a collection with a change set of models, adding,
    // removing, and merging as necessary.
    update: function(models, options) {
      options = _.extend({add: true, merge: true, remove: true}, options);
      if (options.parse) models = this.parse(models, options);
      var model, i, l, existing;
      var add = [], remove = [], modelMap = {};

      // Allow a single model (or no argument) to be passed.
      if (!_.isArray(models)) models = models ? [models] : [];

      // Proxy to `add` for this case, no need to iterate...
      if (options.add && !options.remove) return this.add(models, options);

      // Determine which models to add and merge, and which to remove.
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i];
        existing = this.get(model);
        if (options.remove && existing) modelMap[existing.cid] = true;
        if ((options.add && !existing) || (options.merge && existing)) {
          add.push(model);
        }
      }
      if (options.remove) {
        for (i = 0, l = this.models.length; i < l; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) remove.push(model);
        }
      }

      // Remove models (if applicable) before we add and merge the rest.
      if (remove.length) this.remove(remove, options);
      if (add.length) this.add(add, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      options || (options = {});
      if (options.parse) models = this.parse(models, options);
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models.slice();
      this._reset();
      if (models) this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `update: true` is passed, the response
    // data will be passed through the `update` method instead of `reset`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      options.success = function(collection, resp, options) {
        var method = options.update ? 'update' : 'reset';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
      };
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function() {
      this.length = 0;
      this.models.length = 0;
      this._byId  = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) return false;
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    },

    sortedIndex: function (model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        this.trigger('route', name, args);
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    var success = options.success;
    options.success = function(resp) {
      if (success) success(model, resp, options);
      model.trigger('sync', model, resp, options);
    };

    var error = options.error;
    options.error = function(xhr) {
      if (error) error(model, xhr, options);
      model.trigger('error', model, xhr, options);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };


  Backbone.getValue = getValue;
  Backbone.urlError = urlError;
  Backbone.methodMap = methodMap;


}).call(this);
/** @license


 SoundManager 2: JavaScript Sound for the Web
 ----------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.97a.20170601
*/

(function(h,g){function J(sb,J){function ha(b){return c.preferFlash&&G&&!c.ignoreFlash&&c.flash[b]!==g&&c.flash[b]}function r(b){return function(d){var e=this._s;e&&e._a?d=b.call(this,d):(e&&e.id?c._wD(e.id+": Ignoring "+d.type):c._wD("HTML5::Ignoring "+d.type),d=null);return d}}this.setupOptions={url:sb||null,flashVersion:8,debugMode:!0,debugFlash:!1,useConsole:!0,consoleOnly:!0,waitForWindowLoad:!1,bgColor:"#ffffff",useHighPerformance:!1,flashPollingInterval:null,html5PollingInterval:null,flashLoadTimeout:1E3,
wmode:null,allowScriptAccess:"always",useFlashBlock:!1,useHTML5Audio:!0,forceUseGlobalHTML5Audio:!1,ignoreMobileRestrictions:!1,html5Test:/^(probably|maybe)$/i,preferFlash:!1,noSWFCache:!1,idPrefix:"sound"};this.defaultOptions={autoLoad:!1,autoPlay:!1,from:null,loops:1,onid3:null,onerror:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onposition:null,onstop:null,onfinish:null,multiShot:!0,multiShotEvents:!1,position:null,pan:0,playbackRate:1,stream:!0,to:null,
type:null,usePolicyFile:!1,volume:100};this.flash9Options={onfailure:null,isMovieStar:null,usePeakData:!1,useWaveformData:!1,useEQData:!1,onbufferchange:null,ondataerror:null};this.movieStarOptions={bufferTime:3,serverURL:null,onconnect:null,duration:null};this.audioFormats={mp3:{type:['audio/mpeg; codecs="mp3"',"audio/mpeg","audio/mp3","audio/MPA","audio/mpa-robust"],required:!0},mp4:{related:["aac","m4a","m4b"],type:['audio/mp4; codecs="mp4a.40.2"',"audio/aac","audio/x-m4a","audio/MP4A-LATM","audio/mpeg4-generic"],
required:!1},ogg:{type:["audio/ogg; codecs=vorbis"],required:!1},opus:{type:["audio/ogg; codecs=opus","audio/opus"],required:!1},wav:{type:['audio/wav; codecs="1"',"audio/wav","audio/wave","audio/x-wav"],required:!1},flac:{type:["audio/flac"],required:!1}};this.movieID="sm2-container";this.id=J||"sm2movie";this.debugID="soundmanager-debug";this.debugURLParam=/([#?&])debug=1/i;this.versionNumber="V2.97a.20170601";this.altURL=this.movieURL=this.version=null;this.enabled=this.swfLoaded=!1;this.oMC=null;
this.sounds={};this.soundIDs=[];this.didFlashBlock=this.muted=!1;this.filePattern=null;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.features={buffering:!1,peakData:!1,waveformData:!1,eqData:!1,movieStar:!1};this.sandbox={type:null,types:{remote:"remote (domain-based) rules",localWithFile:"local with file access (no internet access)",localWithNetwork:"local with network (internet access only, no local access)",localTrusted:"local, trusted (local+internet access)"},description:null,
noRemote:null,noLocal:null};this.html5={usingFlash:null};this.flash={};this.ignoreFlash=this.html5Only=!1;var V,c=this,Ya=null,l=null,E,v=navigator.userAgent,ia=h.location.href.toString(),m=document,xa,Za,ya,n,H=[],za=!0,C,W=!1,X=!1,q=!1,y=!1,ja=!1,p,tb=0,Y,A,Aa,Q,Ba,O,R,S,$a,Ca,Da,ka,z,la,P,Ea,Z,ma,na,T,ab,Fa,bb=["log","info","warn","error"],Ga,Ha,cb,aa=null,Ia=null,t,Ja,U,db,oa,pa,K,w,ba=!1,Ka=!1,eb,fb,gb,qa=0,ca=null,ra,L=[],da,u=null,hb,sa,ea,ib,M,ta,La,jb,x,kb=Array.prototype.slice,B=!1,Ma,G,
Na,lb,I,mb,Oa,fa,nb=0,Pa,Qa=v.match(/(ipad|iphone|ipod)/i),Ra=v.match(/android/i),N=v.match(/msie|trident/i),ub=v.match(/webkit/i),ua=v.match(/safari/i)&&!v.match(/chrome/i),Sa=v.match(/opera/i),va=v.match(/(mobile|pre\/|xoom)/i)||Qa||Ra,Ta=!ia.match(/usehtml5audio/i)&&!ia.match(/sm2-ignorebadua/i)&&ua&&!v.match(/silk/i)&&v.match(/OS\sX\s10_6_([3-7])/i),Ua=h.console!==g&&console.log!==g,Va=m.hasFocus!==g?m.hasFocus():null,wa=ua&&(m.hasFocus===g||!m.hasFocus()),ob=!wa,pb=/(mp3|mp4|mpa|m4a|m4b)/i,ga=
m.location?m.location.protocol.match(/http/i):null,vb=ga?"":"//",qb=/^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4|m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,rb="mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),wb=new RegExp("\\.("+rb.join("|")+")(\\?.*)?$","i");this.mimePattern=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.useAltURL=!ga;ib=[null,"MEDIA_ERR_ABORTED","MEDIA_ERR_NETWORK","MEDIA_ERR_DECODE","MEDIA_ERR_SRC_NOT_SUPPORTED"];var Wa;try{Wa=Audio!==g&&(Sa&&opera!==g&&10>opera.version()?
new Audio(null):new Audio).canPlayType!==g}catch(xb){Wa=!1}this.hasHTML5=Wa;this.setup=function(b){var d=!c.url;b!==g&&q&&u&&c.ok()&&(b.flashVersion!==g||b.url!==g||b.html5Test!==g)&&K(t("setupLate"));Aa(b);if(!B)if(va){if(!c.setupOptions.ignoreMobileRestrictions||c.setupOptions.forceUseGlobalHTML5Audio)L.push(z.globalHTML5),B=!0}else c.setupOptions.forceUseGlobalHTML5Audio&&(L.push(z.globalHTML5),B=!0);if(!Pa&&va)if(c.setupOptions.ignoreMobileRestrictions)L.push(z.ignoreMobile);else if(c.setupOptions.useHTML5Audio&&
!c.setupOptions.preferFlash||c._wD(z.mobileUA),c.setupOptions.useHTML5Audio=!0,c.setupOptions.preferFlash=!1,Qa)c.ignoreFlash=!0;else if(Ra&&!v.match(/android\s2\.3/i)||!Ra)c._wD(z.globalHTML5),B=!0;b&&(d&&Z&&b.url!==g&&c.beginDelayedInit(),Z||b.url===g||"complete"!==m.readyState||setTimeout(P,1));Pa=!0;return c};this.supported=this.ok=function(){return u?q&&!y:c.useHTML5Audio&&c.hasHTML5};this.getMovie=function(c){return E(c)||m[c]||h[c]};this.createSound=function(b,d){function e(){f=oa(f);c.sounds[f.id]=
new V(f);c.soundIDs.push(f.id);return c.sounds[f.id]}var a,f;a=null;a="soundManager.createSound(): "+t(q?"notOK":"notReady");if(!q||!c.ok())return K(a),!1;d!==g&&(b={id:b,url:d});f=A(b);f.url=ra(f.url);f.id===g&&(f.id=c.setupOptions.idPrefix+nb++);f.id.toString().charAt(0).match(/^[0-9]$/)&&c._wD("soundManager.createSound(): "+t("badID",f.id),2);c._wD("soundManager.createSound(): "+f.id+(f.url?" ("+f.url+")":""),1);if(w(f.id,!0))return c._wD("soundManager.createSound(): "+f.id+" exists",1),c.sounds[f.id];
if(sa(f))a=e(),c.html5Only||c._wD(f.id+": Using HTML5"),a._setup_html5(f);else{if(c.html5Only)return c._wD(f.id+": No HTML5 support for this sound, and no Flash. Exiting."),e();if(c.html5.usingFlash&&f.url&&f.url.match(/data:/i))return c._wD(f.id+": data: URIs not supported via Flash. Exiting."),e();8<n&&(null===f.isMovieStar&&(f.isMovieStar=!!(f.serverURL||f.type&&f.type.match(qb)||f.url&&f.url.match(wb))),f.isMovieStar&&(c._wD("soundManager.createSound(): using MovieStar handling"),1<f.loops&&p("noNSLoop")));
f=pa(f,"soundManager.createSound(): ");a=e();8===n?l._createSound(f.id,f.loops||1,f.usePolicyFile):(l._createSound(f.id,f.url,f.usePeakData,f.useWaveformData,f.useEQData,f.isMovieStar,f.isMovieStar?f.bufferTime:!1,f.loops||1,f.serverURL,f.duration||null,f.autoPlay,!0,f.autoLoad,f.usePolicyFile),f.serverURL||(a.connected=!0,f.onconnect&&f.onconnect.apply(a)));f.serverURL||!f.autoLoad&&!f.autoPlay||a.load(f)}!f.serverURL&&f.autoPlay&&a.play();return a};this.destroySound=function(b,d){if(!w(b))return!1;
var e=c.sounds[b],a;e.stop();e._iO={};e.unload();for(a=0;a<c.soundIDs.length;a++)if(c.soundIDs[a]===b){c.soundIDs.splice(a,1);break}d||e.destruct(!0);delete c.sounds[b];return!0};this.load=function(b,d){return w(b)?c.sounds[b].load(d):!1};this.unload=function(b){return w(b)?c.sounds[b].unload():!1};this.onposition=this.onPosition=function(b,d,e,a){return w(b)?c.sounds[b].onposition(d,e,a):!1};this.clearOnPosition=function(b,d,e){return w(b)?c.sounds[b].clearOnPosition(d,e):!1};this.start=this.play=
function(b,d){var e=null,a=d&&!(d instanceof Object);if(!q||!c.ok())return K("soundManager.play(): "+t(q?"notOK":"notReady")),!1;if(w(b,a))a&&(d={url:d});else{if(!a)return!1;a&&(d={url:d});d&&d.url&&(c._wD('soundManager.play(): Attempting to create "'+b+'"',1),d.id=b,e=c.createSound(d).play())}null===e&&(e=c.sounds[b].play(d));return e};this.setPlaybackRate=function(b,d,e){return w(b)?c.sounds[b].setPlaybackRate(d,e):!1};this.setPosition=function(b,d){return w(b)?c.sounds[b].setPosition(d):!1};this.stop=
function(b){if(!w(b))return!1;c._wD("soundManager.stop("+b+")",1);return c.sounds[b].stop()};this.stopAll=function(){var b;c._wD("soundManager.stopAll()",1);for(b in c.sounds)c.sounds.hasOwnProperty(b)&&c.sounds[b].stop()};this.pause=function(b){return w(b)?c.sounds[b].pause():!1};this.pauseAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].pause()};this.resume=function(b){return w(b)?c.sounds[b].resume():!1};this.resumeAll=function(){var b;for(b=c.soundIDs.length-1;0<=
b;b--)c.sounds[c.soundIDs[b]].resume()};this.togglePause=function(b){return w(b)?c.sounds[b].togglePause():!1};this.setPan=function(b,d){return w(b)?c.sounds[b].setPan(d):!1};this.setVolume=function(b,d){var e,a;if(b!==g&&!isNaN(b)&&d===g){e=0;for(a=c.soundIDs.length;e<a;e++)c.sounds[c.soundIDs[e]].setVolume(b);return!1}return w(b)?c.sounds[b].setVolume(d):!1};this.mute=function(b){var d=0;b instanceof String&&(b=null);if(b){if(!w(b))return!1;c._wD('soundManager.mute(): Muting "'+b+'"');return c.sounds[b].mute()}c._wD("soundManager.mute(): Muting all sounds");
for(d=c.soundIDs.length-1;0<=d;d--)c.sounds[c.soundIDs[d]].mute();return c.muted=!0};this.muteAll=function(){c.mute()};this.unmute=function(b){b instanceof String&&(b=null);if(b){if(!w(b))return!1;c._wD('soundManager.unmute(): Unmuting "'+b+'"');return c.sounds[b].unmute()}c._wD("soundManager.unmute(): Unmuting all sounds");for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].unmute();c.muted=!1;return!0};this.unmuteAll=function(){c.unmute()};this.toggleMute=function(b){return w(b)?c.sounds[b].toggleMute():
!1};this.getMemoryUse=function(){var c=0;l&&8!==n&&(c=parseInt(l._getMemoryUse(),10));return c};this.disable=function(b){var d;b===g&&(b=!1);if(y)return!1;y=!0;p("shutdown",1);for(d=c.soundIDs.length-1;0<=d;d--)Ga(c.sounds[c.soundIDs[d]]);Ga(c);Y(b);x.remove(h,"load",R);return!0};this.canPlayMIME=function(b){var d;c.hasHTML5&&(d=ea({type:b}));!d&&u&&(d=b&&c.ok()?!!(8<n&&b.match(qb)||b.match(c.mimePattern)):null);return d};this.canPlayURL=function(b){var d;c.hasHTML5&&(d=ea({url:b}));!d&&u&&(d=b&&
c.ok()?!!b.match(c.filePattern):null);return d};this.canPlayLink=function(b){return b.type!==g&&b.type&&c.canPlayMIME(b.type)?!0:c.canPlayURL(b.href)};this.getSoundById=function(b,d){if(!b)return null;var e=c.sounds[b];e||d||c._wD('soundManager.getSoundById(): Sound "'+b+'" not found.',2);return e};this.onready=function(b,d){if("function"===typeof b)q&&c._wD(t("queue","onready")),d||(d=h),Ba("onready",b,d),O();else throw t("needFunction","onready");return!0};this.ontimeout=function(b,d){if("function"===
typeof b)q&&c._wD(t("queue","ontimeout")),d||(d=h),Ba("ontimeout",b,d),O({type:"ontimeout"});else throw t("needFunction","ontimeout");return!0};this._writeDebug=function(b,d){var e,a;if(!c.setupOptions.debugMode)return!1;if(Ua&&c.useConsole){if(d&&"object"===typeof d)console.log(b,d);else if(bb[d]!==g)console[bb[d]](b);else console.log(b);if(c.consoleOnly)return!0}e=E("soundmanager-debug");if(!e)return!1;a=m.createElement("div");0===++tb%2&&(a.className="sm2-alt");d=d===g?0:parseInt(d,10);a.appendChild(m.createTextNode(b));
d&&(2<=d&&(a.style.fontWeight="bold"),3===d&&(a.style.color="#ff3333"));e.insertBefore(a,e.firstChild);return!0};-1!==ia.indexOf("sm2-debug=alert")&&(this._writeDebug=function(c){h.alert(c)});this._wD=this._writeDebug;this._debug=function(){var b,d;p("currentObj",1);b=0;for(d=c.soundIDs.length;b<d;b++)c.sounds[c.soundIDs[b]]._debug()};this.reboot=function(b,d){c.soundIDs.length&&c._wD("Destroying "+c.soundIDs.length+" SMSound object"+(1!==c.soundIDs.length?"s":"")+"...");var e,a,f;for(e=c.soundIDs.length-
1;0<=e;e--)c.sounds[c.soundIDs[e]].destruct();if(l)try{N&&(Ia=l.innerHTML),aa=l.parentNode.removeChild(l)}catch(g){p("badRemove",2)}Ia=aa=u=l=null;c.enabled=Z=q=ba=Ka=W=X=y=B=c.swfLoaded=!1;c.soundIDs=[];c.sounds={};nb=0;Pa=!1;if(b)H=[];else for(e in H)if(H.hasOwnProperty(e))for(a=0,f=H[e].length;a<f;a++)H[e][a].fired=!1;d||c._wD("soundManager: Rebooting...");c.html5={usingFlash:null};c.flash={};c.html5Only=!1;c.ignoreFlash=!1;h.setTimeout(function(){d||c.beginDelayedInit()},20);return c};this.reset=
function(){p("reset");return c.reboot(!0,!0)};this.getMoviePercent=function(){return l&&"PercentLoaded"in l?l.PercentLoaded():null};this.beginDelayedInit=function(){ja=!0;P();setTimeout(function(){if(Ka)return!1;na();la();return Ka=!0},20);S()};this.destruct=function(){c._wD("soundManager.destruct()");c.disable(!0)};V=function(b){var d,e,a=this,f,h,k,F,m,q,r=!1,D=[],v=0,Xa,y,u=null,z;e=d=null;this.sID=this.id=b.id;this.url=b.url;this._iO=this.instanceOptions=this.options=A(b);this.pan=this.options.pan;
this.volume=this.options.volume;this.isHTML5=!1;this._a=null;z=!this.url;this.id3={};this._debug=function(){c._wD(a.id+": Merged options:",a.options)};this.load=function(b){var d=null,e;b!==g?a._iO=A(b,a.options):(b=a.options,a._iO=b,u&&u!==a.url&&(p("manURL"),a._iO.url=a.url,a.url=null));a._iO.url||(a._iO.url=a.url);a._iO.url=ra(a._iO.url);e=a.instanceOptions=a._iO;c._wD(a.id+": load ("+e.url+")");if(!e.url&&!a.url)return c._wD(a.id+": load(): url is unassigned. Exiting.",2),a;a.isHTML5||8!==n||
a.url||e.autoPlay||c._wD(a.id+": Flash 8 load() limitation: Wait for onload() before calling play().",1);if(e.url===a.url&&0!==a.readyState&&2!==a.readyState)return p("onURL",1),3===a.readyState&&e.onload&&fa(a,function(){e.onload.apply(a,[!!a.duration])}),a;a.loaded=!1;a.readyState=1;a.playState=0;a.id3={};if(sa(e))d=a._setup_html5(e),d._called_load?c._wD(a.id+": Ignoring request to load again"):(a._html5_canplay=!1,a.url!==e.url&&(c._wD(p("manURL")+": "+e.url),a._a.src=e.url,a.setPosition(0)),a._a.autobuffer=
"auto",a._a.preload="auto",a._a._called_load=!0);else{if(c.html5Only)return c._wD(a.id+": No flash support. Exiting."),a;if(a._iO.url&&a._iO.url.match(/data:/i))return c._wD(a.id+": data: URIs not supported via Flash. Exiting."),a;try{a.isHTML5=!1,a._iO=pa(oa(e)),a._iO.autoPlay&&(a._iO.position||a._iO.from)&&(c._wD(a.id+": Disabling autoPlay because of non-zero offset case"),a._iO.autoPlay=!1),e=a._iO,8===n?l._load(a.id,e.url,e.stream,e.autoPlay,e.usePolicyFile):l._load(a.id,e.url,!!e.stream,!!e.autoPlay,
e.loops||1,!!e.autoLoad,e.usePolicyFile)}catch(f){p("smError",2),C("onload",!1),T({type:"SMSOUND_LOAD_JS_EXCEPTION",fatal:!0})}}a.url=e.url;return a};this.unload=function(){0!==a.readyState&&(c._wD(a.id+": unload()"),a.isHTML5?(F(),a._a&&(a._a.pause(),u=ta(a._a))):8===n?l._unload(a.id,"about:blank"):l._unload(a.id),f());return a};this.destruct=function(b){c._wD(a.id+": Destruct");a.isHTML5?(F(),a._a&&(a._a.pause(),ta(a._a),B||k(),a._a._s=null,a._a=null)):(a._iO.onfailure=null,l._destroySound(a.id));
b||c.destroySound(a.id,!0)};this.start=this.play=function(b,d){var e,f,k,F,h;f=!0;e=a.id+": play(): ";d=d===g?!0:d;b||(b={});a.url&&(a._iO.url=a.url);a._iO=A(a._iO,a.options);a._iO=A(b,a._iO);a._iO.url=ra(a._iO.url);a.instanceOptions=a._iO;if(!a.isHTML5&&a._iO.serverURL&&!a.connected)return a.getAutoPlay()||(c._wD(e+" Netstream not connected yet - setting autoPlay"),a.setAutoPlay(!0)),a;sa(a._iO)&&(a._setup_html5(a._iO),m());if(1===a.playState&&!a.paused){f=a._iO.multiShot;if(!f)return c._wD(e+"Already playing (one-shot)",
1),a.isHTML5&&a.setPosition(a._iO.position),a;c._wD(e+"Already playing (multi-shot)",1)}b.url&&b.url!==a.url&&(a.readyState||a.isHTML5||8!==n||!z?a.load(a._iO):z=!1);if(a.loaded)c._wD(e.substr(0,e.lastIndexOf(":")));else if(0===a.readyState){c._wD(e+"Attempting to load");if(a.isHTML5||c.html5Only)if(a.isHTML5)a.load(a._iO);else return c._wD(e+"Unsupported type. Exiting."),a;else a._iO.autoPlay=!0,a.load(a._iO);a.instanceOptions=a._iO}else{if(2===a.readyState)return c._wD(e+"Could not load - exiting",
2),a;c._wD(e+"Loading - attempting to play...")}!a.isHTML5&&9===n&&0<a.position&&a.position===a.duration&&(c._wD(e+"Sound at end, resetting to position: 0"),b.position=0);a.paused&&0<=a.position&&(!a._iO.serverURL||0<a.position)?(c._wD(e+"Resuming from paused state",1),a.resume()):(a._iO=A(b,a._iO),(!a.isHTML5&&null!==a._iO.position&&0<a._iO.position||null!==a._iO.from&&0<a._iO.from||null!==a._iO.to)&&0===a.instanceCount&&0===a.playState&&!a._iO.serverURL&&(f=function(){a._iO=A(b,a._iO);a.play(a._iO)},
a.isHTML5&&!a._html5_canplay?(c._wD(e+"Beginning load for non-zero offset case"),a.load({_oncanplay:f})):a.isHTML5||a.loaded||a.readyState&&2===a.readyState||(c._wD(e+"Preloading for non-zero offset case"),a.load({onload:f})),a._iO=y()),(!a.instanceCount||a._iO.multiShotEvents||a.isHTML5&&a._iO.multiShot&&!B||!a.isHTML5&&8<n&&!a.getAutoPlay())&&a.instanceCount++,a._iO.onposition&&0===a.playState&&q(a),a.playState=1,a.paused=!1,a.position=a._iO.position===g||isNaN(a._iO.position)?0:a._iO.position,
a.isHTML5||(a._iO=pa(oa(a._iO))),a._iO.onplay&&d&&(a._iO.onplay.apply(a),r=!0),a.setVolume(a._iO.volume,!0),a.setPan(a._iO.pan,!0),1!==a._iO.playbackRate&&a.setPlaybackRate(a._iO.playbackRate),a.isHTML5?2>a.instanceCount?(m(),e=a._setup_html5(),a.setPosition(a._iO.position),e.play()):(c._wD(a.id+": Cloning Audio() for instance #"+a.instanceCount+"..."),k=new Audio(a._iO.url),F=function(){x.remove(k,"ended",F);a._onfinish(a);ta(k);k=null},h=function(){x.remove(k,"canplay",h);try{k.currentTime=a._iO.position/
1E3}catch(c){K(a.id+": multiShot play() failed to apply position of "+a._iO.position/1E3)}k.play()},x.add(k,"ended",F),a._iO.volume!==g&&(k.volume=Math.max(0,Math.min(1,a._iO.volume/100))),a.muted&&(k.muted=!0),a._iO.position?x.add(k,"canplay",h):k.play()):(f=l._start(a.id,a._iO.loops||1,9===n?a.position:a.position/1E3,a._iO.multiShot||!1),9!==n||f||(c._wD(e+"No sound hardware, or 32-sound ceiling hit",2),a._iO.onplayerror&&a._iO.onplayerror.apply(a))));return a};this.stop=function(b){var d=a._iO;
1===a.playState&&(c._wD(a.id+": stop()"),a._onbufferchange(0),a._resetOnPosition(0),a.paused=!1,a.isHTML5||(a.playState=0),Xa(),d.to&&a.clearOnPosition(d.to),a.isHTML5?a._a&&(b=a.position,a.setPosition(0),a.position=b,a._a.pause(),a.playState=0,a._onTimer(),F()):(l._stop(a.id,b),d.serverURL&&a.unload()),a.instanceCount=0,a._iO={},d.onstop&&d.onstop.apply(a));return a};this.setAutoPlay=function(b){c._wD(a.id+": Autoplay turned "+(b?"on":"off"));a._iO.autoPlay=b;a.isHTML5||(l._setAutoPlay(a.id,b),b&&
!a.instanceCount&&1===a.readyState&&(a.instanceCount++,c._wD(a.id+": Incremented instance count to "+a.instanceCount)))};this.getAutoPlay=function(){return a._iO.autoPlay};this.setPlaybackRate=function(b){var d=Math.max(.5,Math.min(4,b));d!==b&&c._wD(a.id+": setPlaybackRate("+b+"): limiting rate to "+d,2);if(a.isHTML5)try{a._iO.playbackRate=d,a._a.playbackRate=d}catch(e){c._wD(a.id+": setPlaybackRate("+d+") failed: "+e.message,2)}return a};this.setPosition=function(b){b===g&&(b=0);var d=a.isHTML5?
Math.max(b,0):Math.min(a.duration||a._iO.duration,Math.max(b,0));a.position=d;b=a.position/1E3;a._resetOnPosition(a.position);a._iO.position=d;if(!a.isHTML5)b=9===n?a.position:b,a.readyState&&2!==a.readyState&&l._setPosition(a.id,b,a.paused||!a.playState,a._iO.multiShot);else if(a._a){if(a._html5_canplay){if(a._a.currentTime.toFixed(3)!==b.toFixed(3)){c._wD(a.id+": setPosition("+b+")");try{a._a.currentTime=b,(0===a.playState||a.paused)&&a._a.pause()}catch(e){c._wD(a.id+": setPosition("+b+") failed: "+
e.message,2)}}}else if(b)return c._wD(a.id+": setPosition("+b+"): Cannot seek yet, sound not ready",2),a;a.paused&&a._onTimer(!0)}return a};this.pause=function(b){if(a.paused||0===a.playState&&1!==a.readyState)return a;c._wD(a.id+": pause()");a.paused=!0;a.isHTML5?(a._setup_html5().pause(),F()):(b||b===g)&&l._pause(a.id,a._iO.multiShot);a._iO.onpause&&a._iO.onpause.apply(a);return a};this.resume=function(){var b=a._iO;if(!a.paused)return a;c._wD(a.id+": resume()");a.paused=!1;a.playState=1;a.isHTML5?
(a._setup_html5().play(),m()):(b.isMovieStar&&!b.serverURL&&a.setPosition(a.position),l._pause(a.id,b.multiShot));!r&&b.onplay?(b.onplay.apply(a),r=!0):b.onresume&&b.onresume.apply(a);return a};this.togglePause=function(){c._wD(a.id+": togglePause()");if(0===a.playState)return a.play({position:9!==n||a.isHTML5?a.position/1E3:a.position}),a;a.paused?a.resume():a.pause();return a};this.setPan=function(b,c){b===g&&(b=0);c===g&&(c=!1);a.isHTML5||l._setPan(a.id,b);a._iO.pan=b;c||(a.pan=b,a.options.pan=
b);return a};this.setVolume=function(b,d){b===g&&(b=100);d===g&&(d=!1);a.isHTML5?a._a&&(c.muted&&!a.muted&&(a.muted=!0,a._a.muted=!0),a._a.volume=Math.max(0,Math.min(1,b/100))):l._setVolume(a.id,c.muted&&!a.muted||a.muted?0:b);a._iO.volume=b;d||(a.volume=b,a.options.volume=b);return a};this.mute=function(){a.muted=!0;a.isHTML5?a._a&&(a._a.muted=!0):l._setVolume(a.id,0);return a};this.unmute=function(){a.muted=!1;var b=a._iO.volume!==g;a.isHTML5?a._a&&(a._a.muted=!1):l._setVolume(a.id,b?a._iO.volume:
a.options.volume);return a};this.toggleMute=function(){return a.muted?a.unmute():a.mute()};this.onposition=this.onPosition=function(b,c,d){D.push({position:parseInt(b,10),method:c,scope:d!==g?d:a,fired:!1});return a};this.clearOnPosition=function(a,b){var c;a=parseInt(a,10);if(!isNaN(a))for(c=0;c<D.length;c++)a!==D[c].position||b&&b!==D[c].method||(D[c].fired&&v--,D.splice(c,1))};this._processOnPosition=function(){var b,c;b=D.length;if(!b||!a.playState||v>=b)return!1;for(--b;0<=b;b--)c=D[b],!c.fired&&
a.position>=c.position&&(c.fired=!0,v++,c.method.apply(c.scope,[c.position]));return!0};this._resetOnPosition=function(a){var b,c;b=D.length;if(!b)return!1;for(--b;0<=b;b--)c=D[b],c.fired&&a<=c.position&&(c.fired=!1,v--);return!0};y=function(){var b=a._iO,d=b.from,e=b.to,f,g;g=function(){c._wD(a.id+': "To" time of '+e+" reached.");a.clearOnPosition(e,g);a.stop()};f=function(){c._wD(a.id+': Playing "from" '+d);if(null!==e&&!isNaN(e))a.onPosition(e,g)};null===d||isNaN(d)||(b.position=d,b.multiShot=
!1,f());return b};q=function(){var b,c=a._iO.onposition;if(c)for(b in c)if(c.hasOwnProperty(b))a.onPosition(parseInt(b,10),c[b])};Xa=function(){var b,c=a._iO.onposition;if(c)for(b in c)c.hasOwnProperty(b)&&a.clearOnPosition(parseInt(b,10))};m=function(){a.isHTML5&&eb(a)};F=function(){a.isHTML5&&fb(a)};f=function(b){b||(D=[],v=0);r=!1;a._hasTimer=null;a._a=null;a._html5_canplay=!1;a.bytesLoaded=null;a.bytesTotal=null;a.duration=a._iO&&a._iO.duration?a._iO.duration:null;a.durationEstimate=null;a.buffered=
[];a.eqData=[];a.eqData.left=[];a.eqData.right=[];a.failures=0;a.isBuffering=!1;a.instanceOptions={};a.instanceCount=0;a.loaded=!1;a.metadata={};a.readyState=0;a.muted=!1;a.paused=!1;a.peakData={left:0,right:0};a.waveformData={left:[],right:[]};a.playState=0;a.position=null;a.id3={}};f();this._onTimer=function(b){var c,f=!1,g={};(a._hasTimer||b)&&a._a&&(b||(0<a.playState||1===a.readyState)&&!a.paused)&&(c=a._get_html5_duration(),c!==d&&(d=c,a.duration=c,f=!0),a.durationEstimate=a.duration,c=1E3*a._a.currentTime||
0,c!==e&&(e=c,f=!0),(f||b)&&a._whileplaying(c,g,g,g,g));return f};this._get_html5_duration=function(){var b=a._iO;return(b=a._a&&a._a.duration?1E3*a._a.duration:b&&b.duration?b.duration:null)&&!isNaN(b)&&Infinity!==b?b:null};this._apply_loop=function(a,b){!a.loop&&1<b&&c._wD("Note: Native HTML5 looping is infinite.",1);a.loop=1<b?"loop":""};this._setup_html5=function(b){b=A(a._iO,b);var c=B?Ya:a._a,d=decodeURI(b.url),e;B?d===decodeURI(Ma)&&(e=!0):d===decodeURI(u)&&(e=!0);if(c){if(c._s)if(B)c._s&&
c._s.playState&&!e&&c._s.stop();else if(!B&&d===decodeURI(u))return a._apply_loop(c,b.loops),c;e||(u&&f(!1),c.src=b.url,Ma=u=a.url=b.url,c._called_load=!1)}else b.autoLoad||b.autoPlay?(a._a=new Audio(b.url),a._a.load()):a._a=Sa&&10>opera.version()?new Audio(null):new Audio,c=a._a,c._called_load=!1,B&&(Ya=c);a.isHTML5=!0;a._a=c;c._s=a;h();a._apply_loop(c,b.loops);b.autoLoad||b.autoPlay?a.load():(c.autobuffer=!1,c.preload="auto");return c};h=function(){if(a._a._added_events)return!1;var b;a._a._added_events=
!0;for(b in I)I.hasOwnProperty(b)&&a._a&&a._a.addEventListener(b,I[b],!1);return!0};k=function(){var b;c._wD(a.id+": Removing event listeners");a._a._added_events=!1;for(b in I)I.hasOwnProperty(b)&&a._a&&a._a.removeEventListener(b,I[b],!1)};this._onload=function(b){var d=!!b||!a.isHTML5&&8===n&&a.duration;b=a.id+": ";c._wD(b+(d?"onload()":"Failed to load / invalid sound?"+(a.duration?" -":" Zero-length duration reported.")+" ("+a.url+")"),d?1:2);d||a.isHTML5||(!0===c.sandbox.noRemote&&c._wD(b+t("noNet"),
1),!0===c.sandbox.noLocal&&c._wD(b+t("noLocal"),1));a.loaded=d;a.readyState=d?3:2;a._onbufferchange(0);d||a.isHTML5||a._onerror();a._iO.onload&&fa(a,function(){a._iO.onload.apply(a,[d])});return!0};this._onerror=function(b,c){a._iO.onerror&&fa(a,function(){a._iO.onerror.apply(a,[b,c])})};this._onbufferchange=function(b){if(0===a.playState||b&&a.isBuffering||!b&&!a.isBuffering)return!1;a.isBuffering=1===b;a._iO.onbufferchange&&(c._wD(a.id+": Buffer state change: "+b),a._iO.onbufferchange.apply(a,[b]));
return!0};this._onsuspend=function(){a._iO.onsuspend&&(c._wD(a.id+": Playback suspended"),a._iO.onsuspend.apply(a));return!0};this._onfailure=function(b,d,e){a.failures++;c._wD(a.id+": Failure ("+a.failures+"): "+b);if(a._iO.onfailure&&1===a.failures)a._iO.onfailure(b,d,e);else c._wD(a.id+": Ignoring failure")};this._onwarning=function(b,c,d){if(a._iO.onwarning)a._iO.onwarning(b,c,d)};this._onfinish=function(){var b=a._iO.onfinish;a._onbufferchange(0);a._resetOnPosition(0);a.instanceCount&&(a.instanceCount--,
a.instanceCount||(Xa(),a.playState=0,a.paused=!1,a.instanceCount=0,a.instanceOptions={},a._iO={},F(),a.isHTML5&&(a.position=0)),a.instanceCount&&!a._iO.multiShotEvents||!b||(c._wD(a.id+": onfinish()"),fa(a,function(){b.apply(a)})))};this._whileloading=function(b,c,d,e){var f=a._iO;a.bytesLoaded=b;a.bytesTotal=c;a.duration=Math.floor(d);a.bufferLength=e;a.durationEstimate=a.isHTML5||f.isMovieStar?a.duration:f.duration?a.duration>f.duration?a.duration:f.duration:parseInt(a.bytesTotal/a.bytesLoaded*
a.duration,10);a.isHTML5||(a.buffered=[{start:0,end:a.duration}]);(3!==a.readyState||a.isHTML5)&&f.whileloading&&f.whileloading.apply(a)};this._whileplaying=function(b,c,d,e,f){var k=a._iO;if(isNaN(b)||null===b)return!1;a.position=Math.max(0,b);a._processOnPosition();!a.isHTML5&&8<n&&(k.usePeakData&&c!==g&&c&&(a.peakData={left:c.leftPeak,right:c.rightPeak}),k.useWaveformData&&d!==g&&d&&(a.waveformData={left:d.split(","),right:e.split(",")}),k.useEQData&&f!==g&&f&&f.leftEQ&&(b=f.leftEQ.split(","),
a.eqData=b,a.eqData.left=b,f.rightEQ!==g&&f.rightEQ&&(a.eqData.right=f.rightEQ.split(","))));1===a.playState&&(a.isHTML5||8!==n||a.position||!a.isBuffering||a._onbufferchange(0),k.whileplaying&&k.whileplaying.apply(a));return!0};this._oncaptiondata=function(b){c._wD(a.id+": Caption data received.");a.captiondata=b;a._iO.oncaptiondata&&a._iO.oncaptiondata.apply(a,[b])};this._onmetadata=function(b,d){c._wD(a.id+": Metadata received.");var e={},f,g;f=0;for(g=b.length;f<g;f++)e[b[f]]=d[f];a.metadata=
e;a._iO.onmetadata&&a._iO.onmetadata.call(a,a.metadata)};this._onid3=function(b,d){c._wD(a.id+": ID3 data received.");var e=[],f,g;f=0;for(g=b.length;f<g;f++)e[b[f]]=d[f];a.id3=A(a.id3,e);a._iO.onid3&&a._iO.onid3.apply(a)};this._onconnect=function(b){b=1===b;c._wD(a.id+": "+(b?"Connected.":"Failed to connect? - "+a.url),b?1:2);if(a.connected=b)a.failures=0,w(a.id)&&(a.getAutoPlay()?a.play(g,a.getAutoPlay()):a._iO.autoLoad&&a.load()),a._iO.onconnect&&a._iO.onconnect.apply(a,[b])};this._ondataerror=
function(b){0<a.playState&&(c._wD(a.id+": Data error: "+b),a._iO.ondataerror&&a._iO.ondataerror.apply(a))};this._debug()};ma=function(){return m.body||m.getElementsByTagName("div")[0]};E=function(b){return m.getElementById(b)};A=function(b,d){var e=b||{},a,f;a=d===g?c.defaultOptions:d;for(f in a)a.hasOwnProperty(f)&&e[f]===g&&(e[f]="object"!==typeof a[f]||null===a[f]?a[f]:A(e[f],a[f]));return e};fa=function(b,c){b.isHTML5||8!==n?c():h.setTimeout(c,0)};Q={onready:1,ontimeout:1,defaultOptions:1,flash9Options:1,
movieStarOptions:1};Aa=function(b,d){var e,a=!0,f=d!==g,h=c.setupOptions;if(b===g){a=[];for(e in h)h.hasOwnProperty(e)&&a.push(e);for(e in Q)Q.hasOwnProperty(e)&&("object"===typeof c[e]?a.push(e+": {...}"):c[e]instanceof Function?a.push(e+": function() {...}"):a.push(e));c._wD(t("setup",a.join(", ")));return!1}for(e in b)if(b.hasOwnProperty(e))if("object"!==typeof b[e]||null===b[e]||b[e]instanceof Array||b[e]instanceof RegExp)f&&Q[d]!==g?c[d][e]=b[e]:h[e]!==g?(c.setupOptions[e]=b[e],c[e]=b[e]):Q[e]===
g?(K(t(c[e]===g?"setupUndef":"setupError",e),2),a=!1):c[e]instanceof Function?c[e].apply(c,b[e]instanceof Array?b[e]:[b[e]]):c[e]=b[e];else if(Q[e]===g)K(t(c[e]===g?"setupUndef":"setupError",e),2),a=!1;else return Aa(b[e],e);return a};x=function(){function b(a){a=kb.call(a);var b=a.length;e?(a[1]="on"+a[1],3<b&&a.pop()):3===b&&a.push(!1);return a}function c(b,d){var g=b.shift(),h=[a[d]];if(e)g[h](b[0],b[1]);else g[h].apply(g,b)}var e=h.attachEvent,a={add:e?"attachEvent":"addEventListener",remove:e?
"detachEvent":"removeEventListener"};return{add:function(){c(b(arguments),"add")},remove:function(){c(b(arguments),"remove")}}}();I={abort:r(function(){c._wD(this._s.id+": abort")}),canplay:r(function(){var b=this._s,d;if(!b._html5_canplay){b._html5_canplay=!0;c._wD(b.id+": canplay");b._onbufferchange(0);d=b._iO.position===g||isNaN(b._iO.position)?null:b._iO.position/1E3;if(this.currentTime!==d){c._wD(b.id+": canplay: Setting position to "+d);try{this.currentTime=d}catch(e){c._wD(b.id+": canplay: Setting position of "+
d+" failed: "+e.message,2)}}b._iO._oncanplay&&b._iO._oncanplay()}}),canplaythrough:r(function(){var b=this._s;b.loaded||(b._onbufferchange(0),b._whileloading(b.bytesLoaded,b.bytesTotal,b._get_html5_duration()),b._onload(!0))}),durationchange:r(function(){var b=this._s,d;d=b._get_html5_duration();isNaN(d)||d===b.duration||(c._wD(this._s.id+": durationchange ("+d+")"+(b.duration?", previously "+b.duration:"")),b.durationEstimate=b.duration=d)}),ended:r(function(){var b=this._s;c._wD(b.id+": ended");
b._onfinish()}),error:r(function(){var b=ib[this.error.code]||null;c._wD(this._s.id+": HTML5 error, code "+this.error.code+(b?" ("+b+")":""));this._s._onload(!1);this._s._onerror(this.error.code,b)}),loadeddata:r(function(){var b=this._s;c._wD(b.id+": loadeddata");b._loaded||ua||(b.duration=b._get_html5_duration())}),loadedmetadata:r(function(){c._wD(this._s.id+": loadedmetadata")}),loadstart:r(function(){c._wD(this._s.id+": loadstart");this._s._onbufferchange(1)}),play:r(function(){this._s._onbufferchange(0)}),
playing:r(function(){c._wD(this._s.id+": playing "+String.fromCharCode(9835));this._s._onbufferchange(0)}),progress:r(function(b){var d=this._s,e,a,f;e=0;var g="progress"===b.type,k=b.target.buffered,h=b.loaded||0,m=b.total||1;d.buffered=[];if(k&&k.length){e=0;for(a=k.length;e<a;e++)d.buffered.push({start:1E3*k.start(e),end:1E3*k.end(e)});e=1E3*(k.end(0)-k.start(0));h=Math.min(1,e/(1E3*b.target.duration));if(g&&1<k.length){f=[];a=k.length;for(e=0;e<a;e++)f.push(1E3*b.target.buffered.start(e)+"-"+
1E3*b.target.buffered.end(e));c._wD(this._s.id+": progress, timeRanges: "+f.join(", "))}g&&!isNaN(h)&&c._wD(this._s.id+": progress, "+Math.floor(100*h)+"% loaded")}isNaN(h)||(d._whileloading(h,m,d._get_html5_duration()),h&&m&&h===m&&I.canplaythrough.call(this,b))}),ratechange:r(function(){c._wD(this._s.id+": ratechange")}),suspend:r(function(b){var d=this._s;c._wD(this._s.id+": suspend");I.progress.call(this,b);d._onsuspend()}),stalled:r(function(){c._wD(this._s.id+": stalled")}),timeupdate:r(function(){this._s._onTimer()}),
waiting:r(function(){var b=this._s;c._wD(this._s.id+": waiting");b._onbufferchange(1)})};sa=function(b){return b&&(b.type||b.url||b.serverURL)?b.serverURL||b.type&&ha(b.type)?!1:b.type?ea({type:b.type}):ea({url:b.url})||c.html5Only||b.url.match(/data:/i):!1};ta=function(b){var d;b&&(d=ua?"about:blank":c.html5.canPlayType("audio/wav")?"data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==":"about:blank",b.src=d,b._called_unload!==g&&(b._called_load=!1));B&&(Ma=null);
return d};ea=function(b){if(!c.useHTML5Audio||!c.hasHTML5)return!1;var d=b.url||null;b=b.type||null;var e=c.audioFormats,a;if(b&&c.html5[b]!==g)return c.html5[b]&&!ha(b);if(!M){M=[];for(a in e)e.hasOwnProperty(a)&&(M.push(a),e[a].related&&(M=M.concat(e[a].related)));M=new RegExp("\\.("+M.join("|")+")(\\?.*)?$","i")}(a=d?d.toLowerCase().match(M):null)&&a.length?a=a[1]:b&&(d=b.indexOf(";"),a=(-1!==d?b.substr(0,d):b).substr(6));a&&c.html5[a]!==g?d=c.html5[a]&&!ha(a):(b="audio/"+a,d=c.html5.canPlayType({type:b}),
d=(c.html5[a]=d)&&c.html5[b]&&!ha(b));return d};jb=function(){function b(a){var b,e=b=!1;if(!d||"function"!==typeof d.canPlayType)return b;if(a instanceof Array){k=0;for(b=a.length;k<b;k++)if(c.html5[a[k]]||d.canPlayType(a[k]).match(c.html5Test))e=!0,c.html5[a[k]]=!0,c.flash[a[k]]=!!a[k].match(pb);b=e}else a=d&&"function"===typeof d.canPlayType?d.canPlayType(a):!1,b=!(!a||!a.match(c.html5Test));return b}if(!c.useHTML5Audio||!c.hasHTML5)return u=c.html5.usingFlash=!0,!1;var d=Audio!==g?Sa&&10>opera.version()?
new Audio(null):new Audio:null,e,a,f={},h,k;h=c.audioFormats;for(e in h)if(h.hasOwnProperty(e)&&(a="audio/"+e,f[e]=b(h[e].type),f[a]=f[e],e.match(pb)?(c.flash[e]=!0,c.flash[a]=!0):(c.flash[e]=!1,c.flash[a]=!1),h[e]&&h[e].related))for(k=h[e].related.length-1;0<=k;k--)f["audio/"+h[e].related[k]]=f[e],c.html5[h[e].related[k]]=f[e],c.flash[h[e].related[k]]=f[e];f.canPlayType=d?b:null;c.html5=A(c.html5,f);c.html5.usingFlash=hb();u=c.html5.usingFlash;return!0};z={notReady:"Unavailable - wait until onready() has fired.",
notOK:"Audio support is not available.",domError:"soundManagerexception caught while appending SWF to DOM.",spcWmode:"Removing wmode, preventing known SWF loading issue(s)",swf404:"soundManager: Verify that %s is a valid path.",tryDebug:"Try soundManager.debugFlash = true for more security details (output goes to SWF.)",checkSWF:"See SWF output for more debug info.",localFail:"soundManager: Non-HTTP page ("+m.location.protocol+" URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
waitFocus:"soundManager: Special case: Waiting for SWF to load with window focus...",waitForever:"soundManager: Waiting indefinitely for Flash (will recover if unblocked)...",waitSWF:"soundManager: Waiting for 100% SWF load...",needFunction:"soundManager: Function object expected for %s",badID:'Sound ID "%s" should be a string, starting with a non-numeric character',currentObj:"soundManager: _debug(): Current sound objects",waitOnload:"soundManager: Waiting for window.onload()",docLoaded:"soundManager: Document already loaded",
onload:"soundManager: initComplete(): calling soundManager.onload()",onloadOK:"soundManager.onload() complete",didInit:"soundManager: init(): Already called?",secNote:"Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",badRemove:"soundManager: Failed to remove Flash node.",shutdown:"soundManager.disable(): Shutting down",
queue:"soundManager: Queueing %s handler",smError:"SMSound.load(): Exception: JS-Flash communication failed, or JS error.",fbTimeout:"No flash response, applying .swf_timedout CSS...",fbLoaded:"Flash loaded",fbHandler:"soundManager: flashBlockHandler()",manURL:"SMSound.load(): Using manually-assigned URL",onURL:"soundManager.load(): current URL already assigned.",badFV:'soundManager.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',as2loop:"Note: Setting stream:false so looping can work (flash 8 limitation)",
noNSLoop:"Note: Looping not implemented for MovieStar formats",needfl9:"Note: Switching to flash 9, required for MP4 formats.",mfTimeout:"Setting flashLoadTimeout = 0 (infinite) for off-screen, mobile flash case",needFlash:"soundManager: Fatal error: Flash is needed to play some required formats, but is not available.",gotFocus:"soundManager: Got window focus.",policy:"Enabling usePolicyFile for data access",setup:"soundManager.setup(): allowed parameters: %s",setupError:'soundManager.setup(): "%s" cannot be assigned with this method.',
setupUndef:'soundManager.setup(): Could not find option "%s"',setupLate:"soundManager.setup(): url, flashVersion and html5Test property changes will not take effect until reboot().",noURL:"soundManager: Flash URL required. Call soundManager.setup({url:...}) to get started.",sm2Loaded:"SoundManager 2: Ready. "+String.fromCharCode(10003),reset:"soundManager.reset(): Removing event callbacks",mobileUA:"Mobile UA detected, preferring HTML5 by default.",globalHTML5:"Using singleton HTML5 Audio() pattern for this device.",
ignoreMobile:"Ignoring mobile restrictions for this device."};t=function(){var b,c,e,a;b=kb.call(arguments);c=b.shift();if((a=z&&z[c]?z[c]:"")&&b&&b.length)for(c=0,e=b.length;c<e;c++)a=a.replace("%s",b[c]);return a};oa=function(b){8===n&&1<b.loops&&b.stream&&(p("as2loop"),b.stream=!1);return b};pa=function(b,d){b&&!b.usePolicyFile&&(b.onid3||b.usePeakData||b.useWaveformData||b.useEQData)&&(c._wD((d||"")+t("policy")),b.usePolicyFile=!0);return b};K=function(b){Ua&&console.warn!==g?console.warn(b):
c._wD(b)};xa=function(){return!1};Ga=function(b){for(var c in b)b.hasOwnProperty(c)&&"function"===typeof b[c]&&(b[c]=xa)};Ha=function(b){b===g&&(b=!1);(y||b)&&c.disable(b)};cb=function(b){var d=null;if(b)if(b.match(/\.swf(\?.*)?$/i)){if(d=b.substr(b.toLowerCase().lastIndexOf(".swf?")+4))return b}else b.lastIndexOf("/")!==b.length-1&&(b+="/");b=(b&&-1!==b.lastIndexOf("/")?b.substr(0,b.lastIndexOf("/")+1):"./")+c.movieURL;c.noSWFCache&&(b+="?ts="+(new Date).getTime());return b};Da=function(){n=parseInt(c.flashVersion,
10);8!==n&&9!==n&&(c._wD(t("badFV",n,8)),c.flashVersion=n=8);var b=c.debugMode||c.debugFlash?"_debug.swf":".swf";c.useHTML5Audio&&!c.html5Only&&c.audioFormats.mp4.required&&9>n&&(c._wD(t("needfl9")),c.flashVersion=n=9);c.version=c.versionNumber+(c.html5Only?" (HTML5-only mode)":9===n?" (AS3/Flash 9)":" (AS2/Flash 8)");8<n?(c.defaultOptions=A(c.defaultOptions,c.flash9Options),c.features.buffering=!0,c.defaultOptions=A(c.defaultOptions,c.movieStarOptions),c.filePatterns.flash9=new RegExp("\\.(mp3|"+
rb.join("|")+")(\\?.*)?$","i"),c.features.movieStar=!0):c.features.movieStar=!1;c.filePattern=c.filePatterns[8!==n?"flash9":"flash8"];c.movieURL=(8===n?"soundmanager2.swf":"soundmanager2_flash9.swf").replace(".swf",b);c.features.peakData=c.features.waveformData=c.features.eqData=8<n};ab=function(b,c){l&&l._setPolling(b,c)};Fa=function(){c.debugURLParam.test(ia)&&(c.setupOptions.debugMode=c.debugMode=!0);if(!E(c.debugID)){var b,d,e,a;if(!(!c.debugMode||E(c.debugID)||Ua&&c.useConsole&&c.consoleOnly)){b=
m.createElement("div");b.id=c.debugID+"-toggle";d={position:"fixed",bottom:"0px",right:"0px",width:"1.2em",height:"1.2em",lineHeight:"1.2em",margin:"2px",textAlign:"center",border:"1px solid #999",cursor:"pointer",background:"#fff",color:"#333",zIndex:10001};b.appendChild(m.createTextNode("-"));b.onclick=db;b.title="Toggle SM2 debug console";v.match(/msie 6/i)&&(b.style.position="absolute",b.style.cursor="hand");for(a in d)d.hasOwnProperty(a)&&(b.style[a]=d[a]);d=m.createElement("div");d.id=c.debugID;
d.style.display=c.debugMode?"block":"none";if(c.debugMode&&!E(b.id)){try{e=ma(),e.appendChild(b)}catch(f){throw Error(t("domError")+" \n"+f.toString());}e.appendChild(d)}}}};w=this.getSoundById;p=function(b,d){return b?c._wD(t(b),d):""};db=function(){var b=E(c.debugID),d=E(c.debugID+"-toggle");b&&(za?(d.innerHTML="+",b.style.display="none"):(d.innerHTML="-",b.style.display="block"),za=!za)};C=function(b,c,e){if(h.sm2Debugger!==g)try{sm2Debugger.handleEvent(b,c,e)}catch(a){return!1}return!0};U=function(){var b=
[];c.debugMode&&b.push("sm2_debug");c.debugFlash&&b.push("flash_debug");c.useHighPerformance&&b.push("high_performance");return b.join(" ")};Ja=function(){var b=t("fbHandler"),d=c.getMoviePercent(),e={type:"FLASHBLOCK"};c.html5Only||(c.ok()?(c.didFlashBlock&&c._wD(b+": Unblocked"),c.oMC&&(c.oMC.className=[U(),"movieContainer","swf_loaded"+(c.didFlashBlock?" swf_unblocked":"")].join(" "))):(u&&(c.oMC.className=U()+" movieContainer "+(null===d?"swf_timedout":"swf_error"),c._wD(b+": "+t("fbTimeout")+
(d?" ("+t("fbLoaded")+")":""))),c.didFlashBlock=!0,O({type:"ontimeout",ignoreInit:!0,error:e}),T(e)))};Ba=function(b,c,e){H[b]===g&&(H[b]=[]);H[b].push({method:c,scope:e||null,fired:!1})};O=function(b){b||(b={type:c.ok()?"onready":"ontimeout"});if(!q&&b&&!b.ignoreInit||"ontimeout"===b.type&&(c.ok()||y&&!b.ignoreInit))return!1;var d={success:b&&b.ignoreInit?c.ok():!y},e=b&&b.type?H[b.type]||[]:[],a=[],f,d=[d],g=u&&!c.ok();b.error&&(d[0].error=b.error);b=0;for(f=e.length;b<f;b++)!0!==e[b].fired&&a.push(e[b]);
if(a.length)for(b=0,f=a.length;b<f;b++)a[b].scope?a[b].method.apply(a[b].scope,d):a[b].method.apply(this,d),g||(a[b].fired=!0);return!0};R=function(){h.setTimeout(function(){c.useFlashBlock&&Ja();O();"function"===typeof c.onload&&(p("onload",1),c.onload.apply(h),p("onloadOK",1));c.waitForWindowLoad&&x.add(h,"load",R)},1)};Na=function(){if(G!==g)return G;var b=!1,c=navigator,e,a=h.ActiveXObject,f;try{f=c.plugins}catch(m){f=void 0}if(f&&f.length)(c=c.mimeTypes)&&c["application/x-shockwave-flash"]&&
c["application/x-shockwave-flash"].enabledPlugin&&c["application/x-shockwave-flash"].enabledPlugin.description&&(b=!0);else if(a!==g&&!v.match(/MSAppHost/i)){try{e=new a("ShockwaveFlash.ShockwaveFlash")}catch(k){e=null}b=!!e}return G=b};hb=function(){var b,d,e=c.audioFormats;Qa&&v.match(/os (1|2|3_0|3_1)\s/i)?(c.hasHTML5=!1,c.html5Only=!0,c.oMC&&(c.oMC.style.display="none")):c.useHTML5Audio&&(c.html5&&c.html5.canPlayType||(c._wD("SoundManager: No HTML5 Audio() support detected."),c.hasHTML5=!1),Ta&&
c._wD("soundManager: Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id=32159 - "+(G?"will use flash fallback for MP3/MP4, if available":" would use flash fallback for MP3/MP4, but none detected."),1));if(c.useHTML5Audio&&c.hasHTML5)for(d in da=!0,e)e.hasOwnProperty(d)&&e[d].required&&(c.html5.canPlayType(e[d].type)?c.preferFlash&&(c.flash[d]||c.flash[e[d].type])&&(b=!0):(da=!1,b=!0));c.ignoreFlash&&(b=!1,da=!0);c.html5Only=c.hasHTML5&&c.useHTML5Audio&&
!b;return!c.html5Only};ra=function(b){var d,e,a=0;if(b instanceof Array){d=0;for(e=b.length;d<e;d++)if(b[d]instanceof Object){if(c.canPlayMIME(b[d].type)){a=d;break}}else if(c.canPlayURL(b[d])){a=d;break}b[a].url&&(b[a]=b[a].url);b=b[a]}return b};eb=function(b){b._hasTimer||(b._hasTimer=!0,!va&&c.html5PollingInterval&&(null===ca&&0===qa&&(ca=setInterval(gb,c.html5PollingInterval)),qa++))};fb=function(b){b._hasTimer&&(b._hasTimer=!1,!va&&c.html5PollingInterval&&qa--)};gb=function(){var b;if(null===
ca||qa)for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].isHTML5&&c.sounds[c.soundIDs[b]]._hasTimer&&c.sounds[c.soundIDs[b]]._onTimer();else clearInterval(ca),ca=null};T=function(b){b=b!==g?b:{};"function"===typeof c.onerror&&c.onerror.apply(h,[{type:b.type!==g?b.type:null}]);b.fatal!==g&&b.fatal&&c.disable()};lb=function(){if(Ta&&Na()){var b=c.audioFormats,d,e;for(e in b)if(b.hasOwnProperty(e)&&("mp3"===e||"mp4"===e)&&(c._wD("soundManager: Using flash fallback for "+e+" format"),c.html5[e]=
!1,b[e]&&b[e].related))for(d=b[e].related.length-1;0<=d;d--)c.html5[b[e].related[d]]=!1}};this._setSandboxType=function(b){var d=c.sandbox;d.type=b;d.description=d.types[d.types[b]!==g?b:"unknown"];"localWithFile"===d.type?(d.noRemote=!0,d.noLocal=!1,p("secNote",2)):"localWithNetwork"===d.type?(d.noRemote=!1,d.noLocal=!0):"localTrusted"===d.type&&(d.noRemote=!1,d.noLocal=!1)};this._externalInterfaceOK=function(b){if(!c.swfLoaded){var d;C("swf",!0);C("flashtojs",!0);c.swfLoaded=!0;wa=!1;Ta&&lb();b&&
b.replace(/\+dev/i,"")===c.versionNumber.replace(/\+dev/i,"")?setTimeout(ya,N?100:1):(d='soundManager: Fatal: JavaScript file build "'+c.versionNumber+'" does not match Flash SWF build "'+b+'" at '+c.url+". Ensure both are up-to-date.",setTimeout(function(){throw Error(d);},0))}};na=function(b,d){function e(){var a=[],b,d=[];b="SoundManager "+c.version+(!c.html5Only&&c.useHTML5Audio?c.hasHTML5?" + HTML5 audio":", no HTML5 audio support":"");c.html5Only?c.html5PollingInterval&&a.push("html5PollingInterval ("+
c.html5PollingInterval+"ms)"):(c.preferFlash&&a.push("preferFlash"),c.useHighPerformance&&a.push("useHighPerformance"),c.flashPollingInterval&&a.push("flashPollingInterval ("+c.flashPollingInterval+"ms)"),c.html5PollingInterval&&a.push("html5PollingInterval ("+c.html5PollingInterval+"ms)"),c.wmode&&a.push("wmode ("+c.wmode+")"),c.debugFlash&&a.push("debugFlash"),c.useFlashBlock&&a.push("flashBlock"));a.length&&(d=d.concat([a.join(" + ")]));c._wD(b+(d.length?" + "+d.join(", "):""),1);mb()}function a(a,
b){return'<param name="'+a+'" value="'+b+'" />'}if(W&&X)return!1;if(c.html5Only)return Da(),e(),c.oMC=E(c.movieID),ya(),X=W=!0,!1;var f=d||c.url,h=c.altURL||f,k=ma(),l=U(),n=null,n=m.getElementsByTagName("html")[0],p,r,q,n=n&&n.dir&&n.dir.match(/rtl/i);b=b===g?c.id:b;Da();c.url=cb(ga?f:h);d=c.url;c.wmode=!c.wmode&&c.useHighPerformance?"transparent":c.wmode;null!==c.wmode&&(v.match(/msie 8/i)||!N&&!c.useHighPerformance)&&navigator.platform.match(/win32|win64/i)&&(L.push(z.spcWmode),c.wmode=null);k=
{name:b,id:b,src:d,quality:"high",allowScriptAccess:c.allowScriptAccess,bgcolor:c.bgColor,pluginspage:vb+"www.macromedia.com/go/getflashplayer",title:"JS/Flash audio component (SoundManager 2)",type:"application/x-shockwave-flash",wmode:c.wmode,hasPriority:"true"};c.debugFlash&&(k.FlashVars="debug=1");c.wmode||delete k.wmode;if(N)f=m.createElement("div"),r=['<object id="'+b+'" data="'+d+'" type="'+k.type+'" title="'+k.title+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">',
a("movie",d),a("AllowScriptAccess",c.allowScriptAccess),a("quality",k.quality),c.wmode?a("wmode",c.wmode):"",a("bgcolor",c.bgColor),a("hasPriority","true"),c.debugFlash?a("FlashVars",k.FlashVars):"","</object>"].join("");else for(p in f=m.createElement("embed"),k)k.hasOwnProperty(p)&&f.setAttribute(p,k[p]);Fa();l=U();if(k=ma())if(c.oMC=E(c.movieID)||m.createElement("div"),c.oMC.id)q=c.oMC.className,c.oMC.className=(q?q+" ":"movieContainer")+(l?" "+l:""),c.oMC.appendChild(f),N&&(p=c.oMC.appendChild(m.createElement("div")),
p.className="sm2-object-box",p.innerHTML=r),X=!0;else{c.oMC.id=c.movieID;c.oMC.className="movieContainer "+l;p=l=null;c.useFlashBlock||(c.useHighPerformance?l={position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",overflow:"hidden"}:(l={position:"absolute",width:"6px",height:"6px",top:"-9999px",left:"-9999px"},n&&(l.left=Math.abs(parseInt(l.left,10))+"px")));ub&&(c.oMC.style.zIndex=1E4);if(!c.debugFlash)for(q in l)l.hasOwnProperty(q)&&(c.oMC.style[q]=l[q]);try{N||c.oMC.appendChild(f),
k.appendChild(c.oMC),N&&(p=c.oMC.appendChild(m.createElement("div")),p.className="sm2-object-box",p.innerHTML=r),X=!0}catch(u){throw Error(t("domError")+" \n"+u.toString());}}W=!0;e();return!0};la=function(){if(c.html5Only)return na(),!1;if(l)return!1;if(!c.url)return p("noURL"),!1;l=c.getMovie(c.id);l||(aa?(N?c.oMC.innerHTML=Ia:c.oMC.appendChild(aa),aa=null,W=!0):na(c.id,c.url),l=c.getMovie(c.id));"function"===typeof c.oninitmovie&&setTimeout(c.oninitmovie,1);Oa();return!0};S=function(){setTimeout($a,
1E3)};Ca=function(){h.setTimeout(function(){K("soundManager: useFlashBlock is false, 100% HTML5 mode is possible. Rebooting with preferFlash: false...");c.setup({preferFlash:!1}).reboot();c.didFlashBlock=!0;c.beginDelayedInit()},1)};$a=function(){var b,d=!1;c.url&&!ba&&(ba=!0,x.remove(h,"load",S),G&&wa&&!Va?p("waitFocus"):(q||(b=c.getMoviePercent(),0<b&&100>b&&(d=!0)),setTimeout(function(){b=c.getMoviePercent();d?(ba=!1,c._wD(t("waitSWF")),h.setTimeout(S,1)):(q||(c._wD("soundManager: No Flash response within expected time. Likely causes: "+
(0===b?"SWF load failed, ":"")+"Flash blocked or JS-Flash security error."+(c.debugFlash?" "+t("checkSWF"):""),2),!ga&&b&&(p("localFail",2),c.debugFlash||p("tryDebug",2)),0===b&&c._wD(t("swf404",c.url),1),C("flashtojs",!1,": Timed out"+(ga?" (Check flash security or flash blockers)":" (No plugin/missing SWF?)"))),!q&&ob&&(null===b?c.useFlashBlock||0===c.flashLoadTimeout?(c.useFlashBlock&&Ja(),p("waitForever")):!c.useFlashBlock&&da?Ca():(p("waitForever"),O({type:"ontimeout",ignoreInit:!0,error:{type:"INIT_FLASHBLOCK"}})):
0===c.flashLoadTimeout?p("waitForever"):!c.useFlashBlock&&da?Ca():Ha(!0)))},c.flashLoadTimeout)))};ka=function(){if(Va||!wa)return x.remove(h,"focus",ka),!0;Va=ob=!0;p("gotFocus");ba=!1;S();x.remove(h,"focus",ka);return!0};Oa=function(){L.length&&(c._wD("SoundManager 2: "+L.join(" "),1),L=[])};mb=function(){Oa();var b,d=[];if(c.useHTML5Audio&&c.hasHTML5){for(b in c.audioFormats)c.audioFormats.hasOwnProperty(b)&&d.push(b+" = "+c.html5[b]+(!c.html5[b]&&u&&c.flash[b]?" (using flash)":c.preferFlash&&
c.flash[b]&&u?" (preferring flash)":c.html5[b]?"":" ("+(c.audioFormats[b].required?"required, ":"")+"and no flash support)"));c._wD("SoundManager 2 HTML5 support: "+d.join(", "),1)}};Y=function(b){if(q)return!1;if(c.html5Only)return p("sm2Loaded",1),q=!0,R(),C("onload",!0),!0;var d=!0,e;c.useFlashBlock&&c.flashLoadTimeout&&!c.getMoviePercent()||(q=!0);e={type:!G&&u?"NO_FLASH":"INIT_TIMEOUT"};c._wD("SoundManager 2 "+(y?"failed to load":"loaded")+" ("+(y?"Flash security/load error":"OK")+") "+String.fromCharCode(y?
10006:10003),y?2:1);y||b?(c.useFlashBlock&&c.oMC&&(c.oMC.className=U()+" "+(null===c.getMoviePercent()?"swf_timedout":"swf_error")),O({type:"ontimeout",error:e,ignoreInit:!0}),C("onload",!1),T(e),d=!1):C("onload",!0);y||(c.waitForWindowLoad&&!ja?(p("waitOnload"),x.add(h,"load",R)):(c.waitForWindowLoad&&ja&&p("docLoaded"),R()));return d};Za=function(){var b,d=c.setupOptions;for(b in d)d.hasOwnProperty(b)&&(c[b]===g?c[b]=d[b]:c[b]!==d[b]&&(c.setupOptions[b]=c[b]))};ya=function(){if(q)return p("didInit"),
!1;if(c.html5Only)return q||(x.remove(h,"load",c.beginDelayedInit),c.enabled=!0,Y()),!0;la();try{l._externalInterfaceTest(!1),ab(!0,c.flashPollingInterval||(c.useHighPerformance?10:50)),c.debugMode||l._disableDebug(),c.enabled=!0,C("jstoflash",!0),c.html5Only||x.add(h,"unload",xa)}catch(b){return c._wD("js/flash exception: "+b.toString()),C("jstoflash",!1),T({type:"JS_TO_FLASH_EXCEPTION",fatal:!0}),Ha(!0),Y(),!1}Y();x.remove(h,"load",c.beginDelayedInit);return!0};P=function(){if(Z)return!1;Z=!0;Za();
Fa();!G&&c.hasHTML5&&(c._wD("SoundManager 2: No Flash detected"+(c.useHTML5Audio?". Trying HTML5-only mode.":", enabling HTML5."),1),c.setup({useHTML5Audio:!0,preferFlash:!1}));jb();!G&&u&&(L.push(z.needFlash),c.setup({flashLoadTimeout:1}));m.removeEventListener&&m.removeEventListener("DOMContentLoaded",P,!1);la();return!0};La=function(){"complete"===m.readyState&&(P(),m.detachEvent("onreadystatechange",La));return!0};Ea=function(){ja=!0;P();x.remove(h,"load",Ea)};Na();x.add(h,"focus",ka);x.add(h,
"load",S);x.add(h,"load",Ea);m.addEventListener?m.addEventListener("DOMContentLoaded",P,!1):m.attachEvent?m.attachEvent("onreadystatechange",La):(C("onload",!1),T({type:"NO_DOM2_EVENTS",fatal:!0}))}if(!h||!h.document)throw Error("SoundManager requires a browser with window and document objects.");var V=null;h.SM2_DEFER!==g&&SM2_DEFER||(V=new J);"object"===typeof module&&module&&"object"===typeof module.exports?(module.exports.SoundManager=J,module.exports.soundManager=V):"function"===typeof define&&
define.amd&&define(function(){return{constructor:J,getInstance:function(g){!h.soundManager&&g instanceof Function&&(g=g(J),g instanceof J&&(h.soundManager=g));return h.soundManager}}});h.SoundManager=J;h.soundManager=V})(window);

// prefer flash in Safari and Firefox (AAC+ support is spotty)
var preferFlash = false;
  //(navigator.userAgent.indexOf("Safari") > -1) && !(navigator.userAgent.indexOf('Chrome') > -1) || (navigator.userAgent.indexOf('Firefox') > -1) ;

soundManager.setup({
  forceUseGlobalHTML5Audio: true,
  flashVersion: 9,
  preferFlash: (localStorage && localStorage.getItem('flash') ? true : preferFlash),
  useHighPerformance: true,
  useConsole: true,
  consoleOnly: true,
  url: '/swf/sm2',
  useFlashBlock: false, //!(App.isEmbed || App.isMobileWeb),
  useHTML5Audio : true, //!!window.navigator.userAgent.match(/webkit/i);
  flashLoadTimeout: 2000,
  flashPollingInterval : 200,
  flash9Options : {
    usePeakData : true
  },
  debugMode : false
});
(function(t,e){if(typeof exports=="object")module.exports=e();else if(typeof define=="function"&&define.amd)define(e);else t.Spinner=e()})(this,function(){"use strict";var t=["webkit","Moz","ms","O"],e={},i;function o(t,e){var i=document.createElement(t||"div"),o;for(o in e)i[o]=e[o];return i}function n(t){for(var e=1,i=arguments.length;e<i;e++)t.appendChild(arguments[e]);return t}var r=function(){var t=o("style",{type:"text/css"});n(document.getElementsByTagName("head")[0],t);return t.sheet||t.styleSheet}();function s(t,o,n,s){var a=["opacity",o,~~(t*100),n,s].join("-"),f=.01+n/s*100,l=Math.max(1-(1-t)/o*(100-f),t),d=i.substring(0,i.indexOf("Animation")).toLowerCase(),u=d&&"-"+d+"-"||"";if(!e[a]){r.insertRule("@"+u+"keyframes "+a+"{"+"0%{opacity:"+l+"}"+f+"%{opacity:"+t+"}"+(f+.01)+"%{opacity:1}"+(f+o)%100+"%{opacity:"+t+"}"+"100%{opacity:"+l+"}"+"}",r.cssRules.length);e[a]=1}return a}function a(e,i){var o=e.style,n,r;if(o[i]!==undefined)return i;i=i.charAt(0).toUpperCase()+i.slice(1);for(r=0;r<t.length;r++){n=t[r]+i;if(o[n]!==undefined)return n}}function f(t,e){for(var i in e)t.style[a(t,i)||i]=e[i];return t}function l(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)if(t[o]===undefined)t[o]=i[o]}return t}function d(t){var e={x:t.offsetLeft,y:t.offsetTop};while(t=t.offsetParent)e.x+=t.offsetLeft,e.y+=t.offsetTop;return e}var u={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:1/4,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};function p(t){if(typeof this=="undefined")return new p(t);this.opts=l(t||{},p.defaults,u)}p.defaults={};l(p.prototype,{spin:function(t){this.stop();var e=this,n=e.opts,r=e.el=f(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),s=n.radius+n.length+n.width,a,l;if(t){t.insertBefore(r,t.firstChild||null);l=d(t);a=d(r);f(r,{left:(n.left=="auto"?l.x-a.x+(t.offsetWidth>>1):parseInt(n.left,10)+s)+"px",top:(n.top=="auto"?l.y-a.y+(t.offsetHeight>>1):parseInt(n.top,10)+s)+"px"})}r.setAttribute("role","progressbar");e.lines(r,e.opts);if(!i){var u=0,p=(n.lines-1)*(1-n.direction)/2,c,h=n.fps,m=h/n.speed,y=(1-n.opacity)/(m*n.trail/100),g=m/n.lines;(function v(){u++;for(var t=0;t<n.lines;t++){c=Math.max(1-(u+(n.lines-t)*g)%m*y,n.opacity);e.opacity(r,t*n.direction+p,c,n)}e.timeout=e.el&&setTimeout(v,~~(1e3/h))})()}return e},stop:function(){var t=this.el;if(t){clearTimeout(this.timeout);if(t.parentNode)t.parentNode.removeChild(t);this.el=undefined}return this},lines:function(t,e){var r=0,a=(e.lines-1)*(1-e.direction)/2,l;function d(t,i){return f(o(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:t,boxShadow:i,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*r+e.rotate)+"deg) translate("+e.radius+"px"+",0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(;r<e.lines;r++){l=f(o(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:i&&s(e.opacity,e.trail,a+r*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"});if(e.shadow)n(l,f(d("#000","0 0 4px "+"#000"),{top:2+"px"}));n(t,n(l,d(e.color,"0 0 1px rgba(0,0,0,.1)")))}return t},opacity:function(t,e,i){if(e<t.childNodes.length)t.childNodes[e].style.opacity=i}});function c(){function t(t,e){return o("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}r.addRule(".spin-vml","behavior:url(#default#VML)");p.prototype.lines=function(e,i){var o=i.length+i.width,r=2*o;function s(){return f(t("group",{coordsize:r+" "+r,coordorigin:-o+" "+-o}),{width:r,height:r})}var a=-(i.width+i.length)*2+"px",l=f(s(),{position:"absolute",top:a,left:a}),d;function u(e,r,a){n(l,n(f(s(),{rotation:360/i.lines*e+"deg",left:~~r}),n(f(t("roundrect",{arcsize:i.corners}),{width:o,height:i.width,left:i.radius,top:-i.width>>1,filter:a}),t("fill",{color:i.color,opacity:i.opacity}),t("stroke",{opacity:0}))))}if(i.shadow)for(d=1;d<=i.lines;d++)u(d,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(d=1;d<=i.lines;d++)u(d);return n(e,l)};p.prototype.opacity=function(t,e,i,o){var n=t.firstChild;o=o.shadow&&o.lines||0;if(n&&e+o<n.childNodes.length){n=n.childNodes[e+o];n=n&&n.firstChild;n=n&&n.firstChild;if(n)n.opacity=i}}}var h=f(o("group"),{behavior:"url(#default#VML)"});if(!a(h,"transform")&&h.adj)c();else i=a(h,"animation");return p});
/*
 * Facebox (for jQuery)
 * version: 1.2 (05/05/2008)
 * @requires jQuery v1.2 or later
 *
 * Examples at http://famspam.com/facebox/
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2007, 2008 Chris Wanstrath [ chris@ozmm.org ]
 *
 * Usage:
 *
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox()
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 *
 *    jQuery.facebox('some html')
 *    jQuery.facebox('some html', 'my-groovy-style')
 *
 *  The above will open a facebox with "some html" as the content.
 *
 *    jQuery.facebox(function($) {
 *      $.get('blah.html', function(data) { $.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page, an image, or the contents of a div:
 *
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ ajax: 'remote.html' }, 'my-groovy-style')
 *    jQuery.facebox({ image: 'stairs.jpg' })
 *    jQuery.facebox({ image: 'stairs.jpg' }, 'my-groovy-style')
 *    jQuery.facebox({ div: '#box' })
 *    jQuery.facebox({ div: '#box' }, 'my-groovy-style')
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *    afterClose.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 * options: { class:'...', dontRemove:true/false }
 */

(function($) {
  $.facebox = function(data, options) {
    if (!options) { options = {}; }    
    this.currentOptions = options;
    this.previousOptions = this.currentOptions || {};
    
    $.facebox.loading(this.previousOptions);

    if (data.ajax) {
      fillFaceboxFromAjax(data.ajax, options);
    } else if (data.image) {
      fillFaceboxFromImage(data.image, options);
    } else if (data.div) { 
      fillFaceboxFromHref(data.div, options);
    } else if ($.isFunction(data)) {
      data.call($);
    } else {
      $.facebox.reveal(data, options);
    }
  };

  /*
   * Public, $.facebox methods
   */

  $.extend($.facebox, {
    settings: {
      opacity      : 0.2,
      overlay      : true,
      loadingImage : '/assets/spinner/spinner-large.gif',
      closeImage   : '/assets/buttons/closelabel.png',
      imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
      faceboxHtml  : '\
    <div id="facebox" style="display:none;"> \
      <div class="popup"> \
        <div class="content"> \
        </div> \
        <a href="#" class="close" title="Close window"></a> \
      </div> \
    </div>'
    },


    loading: function(options) {
      init();

      if ($('#facebox .loading').length == 1) return true;
      if (!options.skipReveal) {
        showOverlay();
      }

      if (options.dontRemove) {
        $('#facebox .content').children().detach();        
      }

      if (options.flush){
        $('#facebox .content').addClass('flush');
      } else {
        $('#facebox .content').removeClass('flush');
      }

      $('#facebox .content').empty();


      $('#facebox .body').children().hide().end().
        append('<div class="loading"><img src="'+$.facebox.settings.loadingImage+'"/></div>');

      $('#facebox').css({
        //top: (getPageHeight() / 10) + 50,
        //left:  $(window).width() / 2 - 205
      });

      if (!options.skipReveal){
        $('#facebox').show();
      }
      
      $(document).bind('keydown.facebox', function(e) {
        if (e.keyCode == 27) $.facebox.close();
        return true;
      });

      $(document).trigger('loading.facebox');
    },

    reveal: function(data, options) {
      $(document).trigger('beforeReveal.facebox');
      if (options['class']) { 
        $('#facebox .content').addClass(options['class']);
      }
      $('#facebox .content').append(data);
      $('#facebox .loading').remove();
      if (options.skipReveal) {
        return;
      }
      $.facebox.afterReveal(options);
    },

    afterReveal : function(options){
      if (!options || !options.skipReveal) {
        showOverlay();
      }

      $('#facebox').show();
      $('#facebox .body').children().fadeIn('normal');
      $(document).trigger('reveal.facebox').trigger('afterReveal.facebox');
    },

    close: function() {
      $(document).trigger('close.facebox');
      return false;
    }
  });

  /*
   * Public, $.fn methods
   */

  $.fn.facebox = function(settings) {
    if ($(this).length == 0) return;

    init(settings);

    function clickHandler() {
      $.facebox.loading();

      // support for rel="facebox.inline_popup" syntax, to add a class
      // also supports deprecated "facebox[.inline_popup]" syntax
      var klass = this.rel.match(/facebox\[?\.(\w+)\]?/);
      if (klass) klass = klass[1];

      fillFaceboxFromHref(this.href, options);
      return false;
    }

    return this.bind('click.facebox', clickHandler);
  };

  /*
   * Private methods
   */

  // called one time to setup facebox on this page
  function init(settings) {
    if ($.facebox.settings.inited) return true;
    else $.facebox.settings.inited = true;

    $(document).trigger('init.facebox');
    makeCompatible();

    var imageTypes = $.facebox.settings.imageTypes.join('|');
    $.facebox.settings.imageTypesRegexp = new RegExp('\.(' + imageTypes + ')$', 'i');

    if (settings) $.extend($.facebox.settings, settings);
    $('body').append($.facebox.settings.faceboxHtml);

    var preload = [ new Image(), new Image() ];
    preload[0].src = $.facebox.settings.closeImage;
    preload[1].src = $.facebox.settings.loadingImage;

    $('#facebox').find('.b:first, .bl').each(function() {
      preload.push(new Image());
      preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1');
    });

    $('#facebox .close').click($.facebox.close);
    $('#facebox .close_image').attr('src', $.facebox.settings.closeImage);
  }

  // getPageScroll() by quirksmode.com
  function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll,yScroll);
  }

  // Adapted from getPageSize() by quirksmode.com
  function getPageHeight() {
    var windowHeight;
    if (self.innerHeight) {	// all except Explorer
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  }

  // Backwards compatibility
  function makeCompatible() {
    var $s = $.facebox.settings;

    $s.loadingImage = $s.loading_image || $s.loadingImage;
    $s.closeImage = $s.close_image || $s.closeImage;
    $s.imageTypes = $s.image_types || $s.imageTypes;
    $s.faceboxHtml = $s.facebox_html || $s.faceboxHtml;
  }

  // Figures out what you want to display and displays it
  // formats are:
  //     div: #id
  //   image: blah.extension
  //    ajax: anything else
  function fillFaceboxFromHref(href, options) {
    // div
    if (href.match(/#/)) {
      var url    = window.location.href.split('#')[0];
      var target = href.replace(url,'');
      if (target == '#') return;
      $.facebox.reveal($(target).html(), options['class']);

    // image
    } else if (href.match($.facebox.settings.imageTypesRegexp)) {
      fillFaceboxFromImage(href, options);
    // ajax
    } else {
      fillFaceboxFromAjax(href, options);
    }
  }

  function fillFaceboxFromImage(href, options) {
    var image = new Image();
    image.onload = function() {
      $.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', options['class']);
    };
    image.src = href;
  }

  function fillFaceboxFromAjax(href, options) {
    $.get(href, function(data) { $.facebox.reveal(data, options['class']); });
  }

  function skipOverlay() {
    return ($.facebox.settings.overlay == false || $.facebox.settings.opacity === null);
  }

  function showOverlay() {
    if (skipOverlay()) return;

    if ($('#facebox_overlay').length == 0)
      $("body").append('<div id="facebox_overlay" class="facebox_hide"></div>');

    $('#facebox_overlay').hide().addClass("facebox_overlayBG")
      .css('opacity', $.facebox.settings.opacity)
      .click(function() { $(document).trigger('close.facebox'); })
      .fadeIn(200);
    return false;
  }

  function hideOverlay() {
    if (skipOverlay()) return;

    $('#facebox_overlay').fadeOut(200, function() {
      $("#facebox_overlay").removeClass("facebox_overlayBG");
      $("#facebox_overlay").addClass("facebox_hide");
      $("#facebox_overlay").remove();
    });

    return false;
  }

  /*
   * Bindings
   */

  $(document).bind('close.facebox', function() {
    $(document).unbind('keydown.facebox');
    $('#facebox').fadeOut(function() {
      $('#facebox .content').removeClass().addClass('content');
      $('#facebox .loading').remove();
      $(document).trigger('afterClose.facebox');
    });
    hideOverlay();
  });

})(jQuery);
/* easyAB v1.0.2 | (c) 2013 @_srom | srom.github.io/easyAB | MIT @license */

/**
 * easyAB is a light-weight jQuery / Zepto plugin for quickly and easily setting up A/B tests.
 * @see srom.github.io/easyAB
 * @author Romain Strock (Twitter: @_srom)
 * @version v1.0.2
 */

(function($) {

  /**
   * The seed used to select the bucket.
   * @type {number}
   * @private
   */
  var _seed;

  /**
   * The name of the test.
   * @type {string}
   * @private
   */
  var _name;

  /**
   * The selected alternative.
   * @type {string|function}
   * @private
   */
  var _alternative;

  /**
   * The bucket used to select the alternative.
   * @type {number}
   * @private
   */
  var _bucket;

  /**
   * Checks whether we're in dev mode.
   * @type {boolean}
   * @private
   */
  var _dev;

  /**
   * Regex used to set the _dev variable.
   * @type {RegExp}
   * @private
   * @const
   */
  var _DEV_REGEX = /#!dev/;

  /**
   * The name of the cookie that is set.
   * @type {string}
   * @private
   * @const
   */
  var _COOKIE_NAME = '_easyab_seed';

  /**
   * Uses the seed and the number of buckets to choose
   * the bucket value.
   * @param {number} buckets The number of buckets.
   * @return {number} The selected bucket.
   * @private
   */
  function _getBucket(buckets) {
    var seed;
    if (!_dev) {
      // prod mode: gets the existing seed if exists or
      // creates a new seed
      if (!_seed) {
        _seed = _makeSeed();
      }
      seed = _seed;
    } else {
      // dev mode: always pick a new random seed
      seed = Number(_dev) || 0;
    }
    // returns the bucket number
    return Math.floor(seed % buckets);
  }

  /**
   * Checks if a cookie containing the seed is available. If not, this
   * method generates a random seed and store it in a cookie.
   * @return {number} The seed.
   * @private
   */
  function _makeSeed() {
    var seed = _readCookie(_COOKIE_NAME);
    if (!seed) {
      seed = Math.random() * 999;
      _setCookie(_COOKIE_NAME, seed, 30);
    }
    return seed;
  }

  /**
   * Sets a cookie.
   * @param {string} name The cookie's name.
   * @param {number|string} value The cookie's value.
   * @pram {number} days The expiration time in days.
   * @private
   */
  function _setCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  /**
   * Reads a cookie.
   * @param {string} name The cookie's name.
   * @return {string|number} The cookie's value.
   * @private
   */
  function _readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  /**
   * Display the alternative.
   * @param {jQuery} $obj The jQuery object.
   * @private
   */
  function _display($obj) {
    if (_alternative['alternative']) {
      var alternative = _alternative['alternative'];
      if (typeof alternative === 'string') {
        // display the text alternative
        $obj.text(alternative);
      } else if (typeof alternative === 'function') {
        // execute the alternative function
        alternative($obj);
      }
    }
  }

  /**
   * Sets a Google Analytics' custom variable.
   * @param {string} slot The slot.
   * @param {string} name The name (or key) of the custom var.
   * @param {string} value The value of the custom var.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackCustomVar(slot, name, value, options) {
    var scope = options['scope'] || 3;
    // window['_gaq'].push(['_setCustomVar',
    //     slot,
    //     name,
    //     value,
    //     scope
    //   ]);
    ga('set', 'dimension'+slot, value); //name, scope no longer set on client

  }

  /**
   * Sets a Google Analytics' event.
   * Please note that the default value of the event's parameter 'non interaction'
   * is usually false. Here, the default value is true because A/B tests should
   * not affect the bounce rate.
   * @param {string} category The category.
   * @param {string} action The action.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackEvent(category, action, options) {
    var label = options['event-label'] || undefined,
        value = options['event-value'] || undefined,
        noninteraction = ['event-noninteraction'] || true;
    // window['_gaq'].push(['_trackEvent',
    //     category,
    //     action,
    //     label,
    //     value,
    //     noninteraction
    //   ]);
    ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      noninteraction : noninteraction
    });
  }

  /**
   * Logs a message.
   * @param {string} msg The message that will be logged.
   * @private
   */
  function _log(msg) {
    if (typeof window['console'] !== 'undefined'
      && typeof msg === 'string') {
      return window['console']['log'](msg);
    }
  }

  /**
   * Tracks the test using Google Analytics.
   * @param {Object} options The options.
   * @private
   */
  function _track(options) {
    // checks if the GA variable has been initialised
    //if (typeof window['_gaq'] !== 'undefined') {
    if (typeof window.ga !== 'undefined') {
      var value = '',
          slot = options['slot'];
      if (_bucket !== 0) {
        // alternative
        value = _alternative['value'] || 'alternative' + _bucket;
      } else {
        // default
        value = options['default-value'] || 'default';
      }
      if (_dev) {
        // dev mode: only logs the information about the events or custom vars
        if (slot) {
          _log(_name + ' : ' + value + ' (custom var ' + slot + ')');
        } else {
          _log(_name + ' : ' + value + ' (event)');
        }
      } else if (slot) {
        // tracks a custom variable if a slot has been specified
        _trackCustomVar(slot, _name, value, options);
      } else {
        // tracks an event
       _trackEvent(_name, value, options);
      }
    }
  }

  /**
   * easyAB plugin definition.
   * @param {Object} options The options.
   */
  $.fn.easyab = function(options) {
    if (!options
        || typeof options !== 'object'
        || !navigator.cookieEnabled) {
      return this;
    } else {
      _name = options['name'];
      if (_name && options['alternatives']) {
          //_dev = _DEV_REGEX.test(window.location) || (ParsedLocation
          _dev = ParsedLocation ? ParsedLocation.urlParams['abtest'] : false;
          _bucket = _getBucket(options['alternatives'].length + 1);
          if (_bucket !== 0) {
            _alternative = options['alternatives'][_bucket - 1];
          }
          _track(options);
      }
      return this.each(function() {
        var $this = $(this);
        if (_bucket !== 0) {
          _display($this);
        }
      });
    }
  };
// works both with Zepto and jQuery !
})(window['jQuery'] || window['Zepto']);
(function () {
    // Object.assign polyfill from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){"use strict";if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var r=Object(e),t=1;t<arguments.length;t++){var n=arguments[t];if(void 0!==n&&null!==n){n=Object(n);for(var o=Object.keys(Object(n)),a=0,c=o.length;c>a;a++){var i=o[a],b=Object.getOwnPropertyDescriptor(n,i);void 0!==b&&b.enumerable&&(r[i]=n[i])}}}return r}});

    var sixpack = {base_url: "http://localhost:5000", ip_address: null, user_agent: null, timeout: 1000};

    // check for node module loader
    var on_node = false;
    if (typeof module !== "undefined" && typeof require !== "undefined") {
        on_node = true;
        module.exports = sixpack;
    } else {
        window["sixpack"] = sixpack;
    }

    sixpack.generate_client_id = function () {
        // from http://stackoverflow.com/questions/105034
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };

    sixpack.Session = function (options) {
        Object.assign(this, sixpack, options);
        if (!this.client_id) {
            this.client_id = this.generate_client_id();
        }
        if (!on_node) {
            this.user_agent = this.user_agent || (window && window.navigator && window.navigator.userAgent);
        }
    };

    sixpack.Session.prototype = {
        participate: function(experiment_name, alternatives, traffic_fraction, force, callback) {
            if (typeof traffic_fraction === "function") {
                callback = traffic_fraction;
                traffic_fraction = null;
                force = null;
            }
            else if (typeof traffic_fraction === "string") {
                callback = force;
                force = traffic_fraction;
                traffic_fraction = null;
            }
            if (typeof force === "function") {
                callback = force;
                force = null;
            }

            if (!(/^[a-z0-9][a-z0-9\-_ ]*$/).test(experiment_name)) {
                return callback(new Error("Bad experiment_name"));
            }

            if (alternatives.length < 2) {
                return callback(new Error("Must specify at least 2 alternatives"));
            }

            for (var i = 0; i < alternatives.length; i += 1) {
                if (!(/^[a-z0-9][a-z0-9\-_ ]*$/).test(alternatives[i])) {
                    return callback(new Error("Bad alternative name: " + alternatives[i]));
                }
            }
            var params = {client_id: this.client_id,
                          experiment: experiment_name,
                          alternatives: alternatives};
            if (!on_node && force == null) {
                var regex = new RegExp("[\\?&]sixpack-force-" + experiment_name + "=([^&#]*)");
                var results = regex.exec(window.location.search);
                if(results != null) {
                    force = decodeURIComponent(results[1].replace(/\+/g, " "));
                }
            }
            if (traffic_fraction !== null && !isNaN(traffic_fraction)) {
                params.traffic_fraction = traffic_fraction;
            }
            if (force != null && _in_array(alternatives, force)) {
                return callback(null, {"status": "ok", "alternative": {"name": force}, "experiment": {"version": 0, "name": experiment_name}, "client_id": this.client_id});
            }
            if (this.ip_address) {
                params.ip_address = this.ip_address;
            }
            if (this.user_agent) {
                params.user_agent = this.user_agent;
            }
            return _request(this.base_url + "/participate", params, this.timeout, function(err, res) {
                if (err) {
                    res = {status: "failed",
                           error: err,
                           alternative: {name: alternatives[0]}};
                }
                return callback(null, res);
            });
        },
        convert: function(experiment_name, kpi, callback) {
            if (typeof kpi === 'function') {
                callback = kpi;
                kpi = null;
            }
            if (!(/^[a-z0-9][a-z0-9\-_ ]*$/).test(experiment_name)) {
                return callback(new Error("Bad experiment_name"));
            }

            var params = {client_id: this.client_id,
                          experiment: experiment_name};
            if (this.ip_address) {
                params.ip_address = this.ip_address;
            }
            if (this.user_agent) {
                params.user_agent = this.user_agent;
            }
            if (kpi) {
                params.kpi = kpi;
            }
            return _request(this.base_url + "/convert", params, this.timeout, function(err, res) {
                if (err) {
                    res = {status: "failed",
                           error: err};
                }
                return callback(null, res);
            });
        }
    };

    var counter = 0;

    var _request = function(uri, params, timeout, callback) {
        var timed_out = false;
        var timeout_handle = setTimeout(function () {
            timed_out = true;
            return callback(new Error("request timed out"));
        }, timeout);

        if (!on_node) {
            var cb = "callback" + (++counter);
            params.callback = "sixpack." + cb
            sixpack[cb] = function (res) {
                if (!timed_out) {
                    clearTimeout(timeout_handle);
                    return callback(null, res);
                }
            }
        }
        var url = _request_uri(uri, params);
        if (!on_node) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
        } else {
            var http = require('http');
            var req = http.get(url, function(res) {
                var body = "";
                res.on('data', function(chunk) {
                    return body += chunk;
                });
                return res.on('end', function() {
                    var data;
                    if (res.statusCode == 500) {
                        data = {status: "failed", response: body};
                    } else {
                        data = JSON.parse(body);
                    }
                    if (!timed_out) {
                        clearTimeout(timeout_handle);
                        return callback(null, data);
                    }
                });
            });
            req.on('error', function(err) {
                if (!timed_out) {
                    clearTimeout(timeout_handle);
                    return callback(err);
                }
            });
        }
    };

    var _request_uri = function(endpoint, params) {
        var query_string = [];
        var e = encodeURIComponent;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var vals = params[key];
                if (Object.prototype.toString.call(vals) !== '[object Array]') {
                    vals = [vals];
                }
                for (var i = 0; i < vals.length; i += 1) {
                    query_string.push(e(key) + '=' + e(vals[i]));
                }
            }
        }
        if (query_string.length) {
            endpoint += '?' + query_string.join('&');
        }
        return endpoint;
    };

    var _in_array = function(a, v) {
        for(var i = 0; i < a.length; i++) {
            if(a[i] === v) {
                return true;
            }
        }
        return false;
    };
})();
// parseUri 1.2.2 - renamed to UrlParser
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

var UrlParser = {};
UrlParser.parse = function(str) {

  var options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
      name:   "queryKey",
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  };

  var	o   = options,
  m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
  uri = {},
  i   = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};
window.ParsedLocation = {
  init : function() {
    var url = window.location.href;

    //fix location parsing with hash-based urls in IE<10
    if (window.location.pathname === '/' && _.indexOf(window.location.hash.substr(1), '#') > 0) {
      url = window.location.protocol + window.location.host + '/' + window.location.hash.substr(1);
    }

    this.parsedReferrerUrl = UrlParser.parse(document.referrer);
    _.extend(this, this.parse(url));
  },

  parseParamsStr : function(str) {
    res = {};
    _.each(str.split('&'), function(pair) {
      var s = pair.split('=');
      res[s[0]] = s[1];
    });
    return res;
  },

  parser: UrlParser,

  parse: function(url) {
    var whitelist = ['test_mode', 'google_preview', 'clickthrough', 'utm_expid', 'abtest', 'pbjs_debug'];
    var object = {};

    object.parsedUrl         = UrlParser.parse(url);
    object.urlParams         = this.parseParamsStr(object.parsedUrl.query);
    object.urlHashParams     = this.parseParamsStr(object.parsedUrl.anchor);

    var notInWhiteList = function (param) {
      return typeof object.urlParams[param] === 'undefined'
    }

    if (_.all(whitelist, notInWhiteList)) {
      if (window.history && window.history.pushState && window.history.replaceState){
        var newUrl = window.location.pathname;
        var hashParams = Object.keys(object.urlHashParams).join('#');
        if (hashParams) {
          newUrl = newUrl + "#" + hashParams;
        }
        if (!(typeof PAGE != 'undefined' && PAGE.noHistory)) {
          window.history.replaceState({}, '', newUrl);
        }
      }
    }

    return object;
  }
};

window.ParsedLocation.init();
!function (document, undefined) {

	var utils = {

		// Is the given value an array? Use ES5 Array.isArray if it's available.
		isArray: Array.isArray || function (value) {
			return Object.prototype.toString.call(value) === '[object Array]';
		},

		// Is the given value a plain object / an object whose constructor is `Object`?
		isPlainObject: function (value) {
      // from underscore.js
      return value !== void 0 && value === Object(value);
		},

		// Convert an array-like object to an array - for example `arguments`.
		toArray: function (value) {
			return Array.prototype.slice.call(value);
		},

		// Get the keys of an object. Use ES5 Object.keys if it's available.
		getKeys: Object.keys || function (obj) {
			var keys = [],
          key = '';
			for (key in obj) {
				if (obj.hasOwnProperty(key)) keys.push(key);
			}
			return keys;
		},

		// Unlike JavaScript's built-in escape functions, this method
		// only escapes characters that are not allowed in cookies.
		escape: function (value) {
			if (value === undefined) {
				return '';
			}

			// Remi: added toString()
			try {
				return value.toString().replace(/[,;"\\=\s%]/g, function (character) {
					return encodeURIComponent(character);
				});
			} catch(e) {
        msg = "TRAX " + e.message + ' : cookie.escape(' + value + ')';
        window.postError(msg);
        return value;
      }
		},

		// Return fallback if the value is undefined, otherwise return value.
		retrieve: function (value, fallback) {
			return value === undefined ? fallback : value;
		}

	};

	var cookie = function () {
		return cookie.get.apply(cookie, arguments);
	};

	cookie.defaults = {};

	cookie.expiresMultiplier = 60 * 60 * 24;

	cookie.set = function (key, value, options) {
		if (utils.isPlainObject(key)) { // Then `key` contains an object with keys and values for cookies, `value` contains the options object.


			for (var k in key) { // TODO: `k` really sucks as a variable name, but I didn't come up with a better one yet.
				if (key.hasOwnProperty(k)) this.set(k, key[k], value);
			}

		} else {
			if (!options) {
        options = {};
      } else if (typeof(options) === "number") {
				options = { expires : options };
      } else if (!utils.isPlainObject(options)) {
				options = {};
      }

			var expires, expiresType;

			try {
				expires = (options.expires !== void 0) ? options.expires : (this.defaults.expires || ''); // Empty string for session cookies.
				expiresType = typeof(expires);

        if (expiresType === 'string' && expires !== '') {
          expires = new Date(expires);
        } else if (expiresType === 'number') {
          // This is needed because IE does not support the `max-age` cookie attribute.
          expires = new Date(+new Date() + 1000 * this.expiresMultiplier * expires);
        }
      } catch(e) {
        // if anything goes wrong, default to future date.
        var msg = 'CUSTOM cookie setting error for key:' + key + ' message:'+ e.message + ' options=' + JSON.stringify(options);
        expires = new Date(2020,1,1);
        window.postError(msg);
      }

			if (expires !== '' && 'toGMTString' in expires) {
        expires = ';expires=' + expires.toGMTString();
      }

			var path = options.path || this.defaults.path; // TODO: Too much code for a simple feature.
			path = path ? ';path=' + path : '';

			var domain = _.isUndefined(options.domain) ? this.defaults.domain : options.domain;
			domain = (domain && domain.length > 0) ? ';domain=' + domain : '';

			var secure = options.secure || this.defaults.secure ? ';secure' : '';

      // Remi: always remove cookie from default domain before setting the new value
      // document.cookie = utils.escape(key) + "=;expires=Mon, 01 Jan 1999 00:00:00 GMT" + path + secure;

      // then finally set it
			document.cookie = utils.escape(key) + '=' + utils.escape(value) + expires + path + domain + secure;
		}

		return this; // Return the `cookie` object to make chaining possible.

	};

	// TODO: This is commented out, because I didn't come up with a better method name yet. Any ideas?
	// cookie.setIfItDoesNotExist = function (key, value, options) {
	//	if (this.get(key) === undefined) this.set.call(this, arguments);
	// },

	cookie.remove = function (keys) {
		keys = utils.isArray(keys) ? keys : utils.toArray(arguments);

		for (var i = 0, l = keys.length; i < l; i++) {
			this.set(keys[i], '', -1);
			this.set(keys[i], '', { expires : -1, domain : App.cookieDomain });
			this.set(keys[i], '', { expires : -1, domain : '' });
			this.set(keys[i], '', { domain : '', expires: -1 });
		}

		return this; // Return the `cookie` object to make chaining possible.
	};

	cookie.empty = function () {

		return this.remove(utils.getKeys(this.all()));

	};

	cookie.get = function (keys, fallback) {
		fallback = fallback || undefined;
		var cookies = this.all();

		if (utils.isArray(keys)) {

			var result = {};

			for (var i = 0, l = keys.length; i < l; i++) {
				var value = keys[i];
				result[value] = utils.retrieve(cookies[value], fallback);
			}

			return result;

		} else return utils.retrieve(cookies[keys], fallback);

	};

	cookie.all = function () {

		if (document.cookie === '') return {};

		var cookies = document.cookie.split('; '),
		result = {};

		for (var i = 0, l = cookies.length; i < l; i++) {
			var item = cookies[i].split('=');
			result[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
		}

		return result;

	};

	cookie.enabled = function () {
		var ret = cookie.set('_', '_').get('_') === '_';
        cookie.remove('_');
		return ret;
	};

	// If an AMD loader is present use AMD.
	// If a CommonJS loader is present use CommonJS.
	// Otherwise assign the `cookie` object to the global scope.

	if (typeof define === 'function' && define.amd) {
		define(function () {
			return cookie;
		});
	} else if (typeof exports !== 'undefined') {
		exports.cookie = cookie;
	} else window.cookie = cookie;

}(document);

cookie.defaults.expires = 365;
cookie.defaults.path = '/';
cookie.defaults.domain = App.cookieDomain;

var store = window.localStorage;
var localStorageEnabled = function(){
  var mod = 'test';
  try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
}

if (!localStorageEnabled()){
   store = {
    _data       : {},
    setItem     : function(id, val) { return this._data[id] = String(val); },
    getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
    removeItem  : function(id) { return delete this._data[id]; },
    clear       : function() { return this._data = {}; }
  };
  window.localStorage = store;
}

var TraxClientStorage = {
  get: function(key) {
    var v = store.getItem(key);

    try {
      return v ? JSON.parse(v) : null;
    } catch(e) {
      // invalid value in storage
      store.removeItem(key);
      return null;
    }
  },

  set: function(key, value) {
    store.setItem(key, JSON.stringify(value));
    return value;
  },

  destroy: function(key) {
    return store.removeItem(key);
  },

  clearAll: function() {
    return store.clear();
  },

  increment: function(key, delta) {
    if (!delta) { delta = 1; }
    return TraxClientStorage.set(key, (TraxClientStorage.get(key) || 0) + delta);
  }
};
// Overview
// Experiments are defined in the backend with:
// - start date, end date, conditions for selection
// - persistance
// - integration with Event Tracking system
//
// The frontend get a list of all experiments from:
// - a PAGE variation on first load, then from
// - an API afterwards, every 5 minutes
//
// Then, when a visitor is hitting a "fork" where a variation needs to be selected,
// - the local store already has a variation name to show
// - if this is the first time the visitor JOINS the experiment, we notify the backend.

// The possible states for a given visitor/experiment (aka variation definition) are:
// - not_running: experiment is not on, variation will always be "control".
// - excluded: the visitor does not pass selection, variation will always be "control".
// - selected: the visitor passes conditions but had never experienced this experiment
// - joined: the visitor has experienced this experiment so we persist the variation
var TraxExperiments = function() {
  var api = {};
  var experimentVariations = [];
  var VARIATION_CONTROL = 'control';
  var STATE_SELECTED = 'selected';
  var STATE_JOINED = 'joined';
  var UPDATE_FREQUENCY_MS = 5 * 60 * 1000; // update Variations every 5 minutes

  // THE Public entry point of the Experiment system.
  //
  // This is called when an experiment fork is reached:
  // - it will return a variation name
  // - it will persist joined variations by notifying the backend
  api.onExperimentFork = function(experimentName) {
    console.log('onExperimentFork', experimentName);

    if (vd = variationDefForExperiment(experimentName)) {
      console.log('found Variation Definition', vd);

      if (vd['state'] == STATE_SELECTED) {
        // selected for experiment but not joined yet
        onExperimentJoined(vd);
      }
      return vd['variation'];

    } else {
      // cannot find this experiment
      console.log('cannot find Variation Definition for', experimentName);
      return VARIATION_CONTROL;
    }
  }

  // Useful for debugging
  api.getExperimentVariations = function() {
    return experimentVariations;
  };

  // Stores the variation locally and remotely.
  function onExperimentJoined(variationDef) {
    console.log('onExperimentJoined', variationDef);

    // update local store
    variationDef['state'] = STATE_JOINED;

    // notify backend
    notifyBackend(variationDef);
  };

  // Returns the variation definition object for a given experiment
  // ex: {experiment: "explore_popular", variation: "control", state: "joined"}
  function variationDefForExperiment(experimentName) {
    return _.findWhere(experimentVariations, { experiment: experimentName });
  };

  // Takes variation definition and notifies backend that an Experiment was joined.
  function notifyBackend(variationDef) {
    if (!TraxEvents.validTrackingIds()) { return };

    $.ajax({
      url: '/experiment_variations/join_experiment.jsonh',
      type: 'post',
      dataType : 'json',
      data: { experiment : variationDef['experiment'],
              variation : variationDef['variation'] }
    });
  }

  // Load the latest variations from the backend
  function updateExperimentVariationsFromBackend() {
    console.log('updateExperimentVariationsFromBackend');

    $.ajax({
      url: '/experiment_variations.jsonh',
      type: 'get',
      dataType : 'json'
    }).success(function(json) {
      console.log('updateExperimentVariationsFromBackend: updated to', json.experiment_variations);
      experimentVariations = json.experiment_variations;
    });
  };

  // Will schedule a regular update of variations from backend
  function scheduleExperimentVariationsUpdate() {
    setTimeout(function(){
      updateExperimentVariationsFromBackend();
      scheduleExperimentVariationsUpdate()
    }, UPDATE_FREQUENCY_MS);
  };

  // called on first load
  function init() {
    if (typeof(PAGE) == "undefined") {
      // in an embed, no experiments
    } else {
      // on Web, use PAGE variable, but watch out we still cache some pages in Varnish
      if (PAGE.experimentVariations) {
        experimentVariations = PAGE.experimentVariations;
      }

      // update now from Backend, and every 5 minutes
      updateExperimentVariationsFromBackend();
      scheduleExperimentVariationsUpdate();
    }
  };

  init();

  return api;
}();


var TraxEvents = function() {

  // Setup
  var api = {
    apiKey: null
  };

  // Private vars
  var eventsUrl = App.isMobileWeb ? '/events.json' : '/events';

  var VISITOR_ID_COOKIE = "visitor_id";

  function getVisitorId() {
    return cookie.get(VISITOR_ID_COOKIE);
  };

  // Tracking is enabled if the backend set tracking cookies properly.
  api.validTrackingIds = function() {
    var visitorId = getVisitorId();

    if (_.isUndefined(visitorId) || _.isNull(visitorId) || visitorId.length < 36) {
      console.warn('Event Tracking is disabled. visitorId is invalid', visitorId);
      cookie.remove(VISITOR_ID_COOKIE);
      visitorId = null;
      return false;
    }

    return true;
  }


  // AJAX POST event data to 8tracks.com
  function postEvent(eventName, properties) {
    if (!api.validTrackingIds()) { return };

    // Add client's timestamp.
    properties.client_timestamp = new Date().getTime();

    // Helps with debugging to know if they're on TLS
    properties.protocol = document.location.protocol;

    // Massage event data into ajax data
    var eventData = {
      name: eventName,
      properties: properties
    };

    // TODO Might not need this if all the cookie checking is correctly set.
    var headers = {};

    if (App.api_key) {
      // Watch out: global namespace
      headers['X-Api-Key'] = App.api_key;
    }

    return $.ajax({
      url: eventsUrl,
      type: 'post',
      data: eventData,
      headers: headers
    });
  }

  function cleanupView(view) {
    var viewParts = view.split(/^home_/);

    if (_.size(viewParts) >= 2) {
      return { name: 'home', type: _.rest(viewParts).join("") }
    }

    return { name: view, type: 'regular' };
  }

  //// PUBLIC API ///////

  api.track = function(name, properties) {
    postEvent(name, properties);
  };

  api.pageView = function(viewName, viewArgs) {
    var view = cleanupView(viewName);

    var eventProperties = {
      view_type: view.type,
      page_type: view.name
    };

    if (viewArgs) {
      eventProperties = _.extend(eventProperties, viewArgs);
    }

    api.track('view', eventProperties);
  };

  api.launchChromecast = function(mixId) {
    api.track('launch chromecast', { mix_id: mixId, event_type: 'chromecast' });
  };

  api.chromeCastError = function(error) {
    var properties = {
      user_agent: navigator.userAgent,
      error: error,
      event_type: 'chromecast'
    };

    api.track('chromecast failure', properties);
  };

  api.trackClick = function(eventName, eventProperties) {
    api.track(eventName, eventProperties);
  };

  return api;
}();
// So firebug console messages dont cause errors on production

if (!("console" in window) || !("firebug" in console))
{
  var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

  window.console = {};
  for (var i = 0; i < names.length; ++i) {
    window.console[names[i]] = function(msg) {};
  }
}
;

window.errorCount = 0;

window.postError = function(message, url, line) {
  if (window.errorCount >= 3) {
    return;
  } else {
    window.errorCount += 1;
  }

  message = message.toString();

  if (url) { url = url.toString(); }
  if (!line) { line = 0; }
  if (!message) { return; }
  if (!url || url === '') { url = window.location.href; }

  if (url == 'http://127.0.0.1:37935/xpopup.js') { return; }
  if (message == 'Error: Permission denied to access property \'toString\''){ return; }
  if (url.match(/block.*(aspx|cgi)/)) { return; }
  if (!url.match('.8tracks.com')) { return; }
  if (url.match('graph.facebook.com')) { return; }
  if (message == 'Error: Script error') { return; }
  if (navigator.userAgent.match(/MSIE (3|4|5|6|7)|Googlebot/)) { return; }

  if (typeof(App) != 'undefined' && App.currentPage) { url = '[' + App.currentPage + '] ' + url; }

  var messagesToIgnore = [
    "to call method Location.toString",
    "Error loading script",
    "Cannot read property 'availWidth' of null",
    "Unable to set property 'getFlashVariable' of undefined or null reference",
    "Unable to set property 'flashGetMessage' of undefined or null reference",
    "Unable to set property 'evidonCustomL3' of undefined or null reference",
    "NS_ERROR_UNEXPECTED: Component returned failure code: 0x8000ffff"
  ];

  var shouldIgnore = false;
  _.each(messagesToIgnore, function(ignoredMessage) {
    if (message.match(ignoredMessage)) {
      shouldIgnore = true;
    }
  });

  if (shouldIgnore) {
    return;
  }

  if (message.match('to call method Location.toString') ||
      message.match('Error loading script') ||
      (message === 'Script error.' && line === 0)) {
    return;

  // If googlebot - only report errors 5% of the time
  } else if (navigator.userAgent.match(/Googlebot\/2.1; \+http:\/\/www.google.com\/bot.html/) && Math.random() < 0.05) {
    return;
  } else {
    // dont show anything to users
  }

  var desc = line + ": " + message + '\nreferrer: ' + document.referrer; // + "\n" + printStackTrace().join('\n');

  $.ajax({ url: '/log_entries.jsonh',
                type: "POST",
                data: { 'log_entry[title]': "Error",
                        'log_entry[url]': url,
                        'log_entry[description]': desc,
                        'log_entry[user_agent]': navigator.userAgent }});

  $('#quote').html('ERROR! ' + url + '<br>' + desc.replace(/\n/g,'<br>'));
  return true;
};

window.onerror = function (message, url, line) {
  window.postError(message, url, line);
};










