(function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(
){},Class.extend=function(n){function o(){!e&&this.initialize&&this.initialize.apply
(this,arguments)}var r=this.prototype;e=!0;var i=new this;e=!1;for(var s in n)i[s
]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,t){return function(
){var n=this._super;this._super=r[e];var i=t.apply(this,arguments);return this._super=
n,i}}(s,n[s]):n[s];return o.prototype=i,o.constructor=o,o.extend=arguments.callee
,o}})(),define("jquery.class",function(e){return function(){var t,n;return t||e.window
.Class}}(this)),define("lib/client_storage",[],function(){return TraxClientStorage
}),define("global_trax",["lib/client_storage"],function(e){function r(e){return _
.isObject(e)?_.map(e,function(e,t){return _.map(e,function(e){return t.charAt(0).
toUpperCase()+t.slice(1)+" "+e+"."})}):e}if(typeof App.Trax!="undefined")return App
.Trax;var t=App.Trax={};t.View=Backbone.View.extend({});var n;t.hide_flash_timer=
function(e){e=e||1e4,n=setTimeout(function(){$(".flash_container").slideUp()},e)}
,t.hide_flash_error=function(){$(".flash_container").slideUp()},t.hide_flash_notices=
function(){$(".flash_container ul.notices").size()>0&&$(".flash_container ul.errors"
).size()===0&&t.hide_flash_timer()},t.show_flash_error=function(e,n){t.update_flash
({errors:e},6e4),n&&t.hide_flash_timer()},t.show_flash_error_with_timeout=function(
e,n){t.update_flash({errors:e},n)},t.show_private_redirection_message=function(){
t.show_flash_error("Oops! It looks like the mix you are trying to listen to is not currently available. In the meantime, check out these playlists."
)},t.update_flash=function(e,i,s){str="",e.errors&&(str+='<ul class="errors"><li>'+
r(e.errors)+"</li></ul>"),e.notices&&(str+='<ul class="notices"><li>'+r(e.notices
)+"</li></ul>");if(str.length>0){clearTimeout(n),str='<div class="flash_container" onclick="$(\'.flash_container\').slideUp(); return false;"><div class="container clearfix"><div class="row"><div class="col-md-12"><a href="#" onclick="$(this).parents(\'.flash_container\').slideUp(); return false;" class="close" title="Hide warning"><span class="i-x"></span></a>'+
str+"</div></div></div>";var o;_.isUndefined(s)&&($("#facebox .content").is(":visible"
)?s=$("#facebox .content"):s=$("#thin_header")),o=$(".flash_container",s),o.length>0?
o.replaceWith(str):s.prepend(str),t.hide_flash_timer(i)}},t.show_overlay=function(
){return $("#body_overlay").show().addClass("visible"),!1},t.hide_overlay=function(
){return $("#body_overlay, #footer").removeClass("visible"),_.delay(function(){$("#body_overlay"
).hide()},200),!1},$("#body_overlay").click(t.hide_overlay),t.overlay_animation=function(
e){return!1},t.isSubscribed=function(){return t.currentUser&&t.currentUser.get("subscribed"
)},t.showAds=function(){return t.isSubscribed()?!1:!0},t.windowIsPlaying=function(
){t.windowId||(t.windowId=Math.round(Math.random()*1e9));if(t.checkPlayingWindowTimer
)return;e.set("playingWindowId",t.windowId),t.checkPlayingWindowTimer=setInterval
(t.checkPlayingWindow,500)},t.checkPlayingWindow=function(){_.isNull(e.get("playingWindowId"
))?e.set("playingWindowId",t.windowId):e.get("playingWindowId")!==t.windowId&&(t.
clearCheckPlayingWindowTimer(),t.pausePlayback())},t.clearCheckPlayingWindowTimer=
function(){t.checkPlayingWindowTimer&&(clearInterval(t.checkPlayingWindowTimer),t
.checkPlayingWindowTimer=null)},t.pausePlayback=function(){_.isUndefined(t.mixPlayer
)||t.mixPlayer.pause(),_.isUndefined(t.previewPlayer)||t.previewPlayer.pause()},t
.isOwner=function(e){if(e){var n=e.get("user")?e.get("user").id:e.get("user_id");
return!!t.currentUser&&!!n&&n==t.currentUser.id}},t.refreshSidebarAd=function(){App
.views.adsView&&App.views.adsView.refreshSidebarAd(!1)},t.sslHostUrl=function(){return App
.env=="production"?"https://8tracks.com":"http://"+window.location.host},t.initial_focus=
function(e){$(".initial_focus",e).each(function(){this.focus(),input_in_focus=this
,$(this).parent().addClass("focus")})},t.show_application_spinner=function(){$("#header-spinner span"
).show()},t.pushCurrentState=function(e,t){App.router&&App.router.navigate(e,{trigger
:!1,replace:t});return},t.quick_play_click=function(e){var t=$(e.currentTarget),n=
$.Deferred(),r=$.Deferred(),s;e.currentTarget.hash.length>0?s=ParsedLocation.parseParamsStr
(e.currentTarget.hash.substring(1)).smart_id:s=null,t.addClass("loading"),t.jsonh_now
(function(e){n.resolve(e.mix,s)}),App.Views.MixPlayerView?r.resolve(t):require(["pages/player"
],function(){r.resolve(t)}),$.when(n,r).done(i)},t.play_from_embed=function(e,t){
App.views.mixPlayerView?s(e,null,t):require(["pages/player"],function(){s(e,null,
t)})},t.play_page=function(e){return App.views.mixView?App.views.mixView.play():App
.views.browseView?App.views.browseView.play():App.views.userProfileView&&App.views
.userProfileView.play(),$("#page_description").slideUp(),!1};var i=function(e,t){
t.removeClass("loading");var n=e[0],r=e[1];s(n,r)},s=function(e,t,n){var r=App.Collections
.Mixes.load(e);App.views.mixPlayerView?App.views.mixPlayerView.loadMix(r,t):(App.
views.mixPlayerView=new App.Views.MixPlayerView({mix:r,smart_id:t}),App.views.mixPlayerView
.show()),App.views.mixPlayerView.playMix("quick"),n&&n.ui.startElement.show()};return t
.setGradient=function(e,t,n,r){try{var n=2,i=!1,s=!1;e.style.opacity>0&&(i=e,e=$('<canvas class="background-blur" width="100%" height="100%" style="width: 100%; height: 100%; opacity: 0.6;"></canvas>'
)[0],$(i).before(e));if(!t||t.length==0){var o=$(e).data("palette");o&&o.length>0&&
(t=o.split(","))}var u=e.getContext("2d"),a=u.createLinearGradient(0,40,100,20);if(!
t||t.length==0)return;_.each(t,function(e,t){if(!e||!e.match||!e.match(/#[a-f0-9]{6}/i
))return;if(t<n){var r=t/(n-1);typeof e=="string"?a.addColorStop(r,e):a.addColorStop
(r,"rgb("+e[0]+", "+e[1]+", "+e[2]+")")}}),u.fillStyle=a,u.fillRect(0,0,100,100),
e.style.opacity=.6,i&&(i.style.opacity=0,setTimeout(function(){i.remove()},2500))
,$(e).removeClass("unrendered")}catch(f){console.log("Trax.setGradient():",f.message
)}},t.spinner=function(e){var t=(new Spinner(_.extend({lines:11,length:3,width:2,
radius:4,color:"#333",speed:1,trail:77,hwaccel:!0,className:"spin"},e))).spin();return t
.el},t.regionallyBlocked=function(e){return e||(e=cookie.get("country_code3")||""
),_.include(WHITELIST_COUNTRY_CODES,e.toLowerCase())?!1:App.sessions&&App.sessions
.isJuniorModerator()?!1:!0},t.resetRegionalBlocking=function(){cookie.remove("country_code3"
)},t}),define("lib/jsonh.jquery",["jquery.class","global_trax"],function(e,t){var n=
function(){var n={},r=function(e,t,n,r,s){return _.isFunction(r)||(s=r,r=n,n=t,t=
null),s||(s={}),s.context=n,i(e,t,r,s)},i=function(e,t,n,r){_.isFunction(t)&&(r=n
,n=t,t=null);var i={url:e,data:t,complete:n};return r&&(i=$.extend(i,r)),f(i)},s=
{},o=function(e,t,n){return n&&s[e]?!1:e(e,t,function(){n&&delete s[e]})},u=function(
e,t,n){var r={complete:t};n=n||{};if(e.nodeName.toUpperCase()=="FORM")r.action="submit"
,r.form=e;else{if(e.nodeName.toUpperCase()!="A")throw"You must pass a <form> or an <a> tag"
;r.action="click",r.url=$(e).attr("href")}return n.spinner=="none"?r.spinner=null
:n.spinner!==null?r.spinner=n.spinner:$(e).find(".spin").length>0&&(r.spinner=$(e
).find(".spin")),n.error&&(r.error=n.error),n.data!==null&&(r.data=n.data),n.context&&
(r.context=n.context),r.ignore_flash=n.ignore_flash,r.type=n.type,r.with_lock=n.with_lock
,r.element=e,r},a=e.extend({initialize:function(e){_.bindAll(this,"sendRequest","send"
,"unlock","_jsonhComplete"),this.options=e,this.requestOptions={},this.requestOptions
.url=e.url,this.requestOptions.form=e.form,this.requestOptions.data=e.data,this.requestOptions
.type=e.type,e.headers?this.requestOptions.headers=e.headers:this.requestOptions.
headers={},App.api_key&&(this.requestOptions.headers["X-Api-Key"]=App.api_key),e.
context&&(this.options.complete=$.proxy(e.complete,e.context),this.options.unauthorized=
$.proxy(e.unauthorized,e.context)),e.spinner!==null?this.spinner=$(e.spinner):$("#facebox .content"
).is(":visible")?this.spinner=$("#facebox-spinner"):this.spinner=$("#header-spinner"
),this.spinnerSpan=this.spinner.children(".spin"),_.isFunction(this.options.complete
)?this.originalCompleteFn=this.options.complete:this.originalCompleteFn=function(
){},_.isFunction(this.options.error)&&(this.errorFn=this.options.error),this.requestOptions
.complete=this._jsonhComplete,this.options.unauthorized&&(this.requestOptions.unauthorized=
this.options.unauthorized),this.requestOptions.jsonhRequest=this},send:function()
{return this.isLocked()&&s[this.sendRequest]?!1:this.sendRequest()},sendRequest:function(
){return this.spinnerSpan.removeClass("saved").css({opacity:1}),c(this.requestOptions
)},isLocked:function(){return this.options.with_lock},unlock:function(){this.isLocked
()&&delete s[this.sendRequest]},_jsonhComplete:function(e){this.unlock(),this.options
.showSave?(this.spinner.addClass("saved"),this.spinnerSpan.css({opacity:0}),setTimeout
(_.bind(function(){this.spinner.children("i").fadeOut(1e3,function(){$(this).parent
().removeClass("saved"),$(this).css("display","")})},this),1200)):this.spinnerSpan
.css({opacity:0}),e.status!=500&&e.status!=503?this.originalCompleteFn.apply(this
.options.element||this,[e]):_.isFunction(this.options.error)?this.errorFn.apply(this
.options.element||this,[e]):t.update_flash(e)}}),f=function(e){var t=new a(e);return t
.send()},l=function(e){var t=[];return $.each(e,function(e,n){t[t.length]={name:e
,value:n}}),t},c=function(e){var n=e.form&&e.form.action||e.url,r=e.data||{},i;if(
e.form){var s=$(e.form).serializeArray();r=$.merge(s,l(r)),i=$(e.form).attr("method"
)}else i="GET";if(e.type=="PUT"||e.type=="put")e.type="POST",r._method="PUT";else if(
e.type=="DELETE"||e.type=="delete")e.type="DELETE",r._method="DELETE";$.isArray(r
)?r[r.length]={name:"format",value:"jsonh"}:typeof r=="string"?r+="&format=jsonh"
:r.format="jsonh";var o={url:n,data:r,type:e.type||i,dataType:e.dataType||"json",
headers:e.headers||{}};return o.complete=function(n,r){var i={};if(r=="abort")return;
if(n.responseText===" ")i.status="500";else try{i=$.parseJSON(n.responseText),window
.LAST_JSON=i}catch(s){i.status="500"}if(_.isUndefined(i)||_.isNull(i))i={status:"500"
};i.status?i.success=parseInt(i.status,0)>=200&&parseInt(i.status,0)<300:i.success=
n.status>=200&&n.status<300||n.status===304||n.status===1223,i.status=parseInt(i.
status,0),i.status===500&&(i.flash={errors:"Oops, there was a problem!<br/>We have been notified."
});if(i.status===401){if(typeof App.Sessions=="undefined")return;App.Sessions.unsetCurrentUser
(),_.isFunction(e.unauthorized)?e.unauthorized(i):(t.showSignupView(),App.views.appView&&
App.views.appView.loadingState(!1));var o=function(){e.jsonhRequest.send()};App.Sessions
.unbind("jsonh:current_user:set_from_backend",o).bind("jsonh:current_user:set_from_backend"
,o),$(document).bind("close.facebox",function(){App.Sessions.unbind("jsonh:current_user:set_from_backend"
,o)})}else _.isFunction(e.complete)&&e.complete(i),i.status!==401&&!(e.jsonhRequest&&
e.jsonhRequest.options&&e.jsonhRequest.options.ignore_flash)&&t.update_flash(i)},
$.ajax(o)};return n.build_options=u,n.ajax=f,n.now=i,n.now_with_context=r,n};return $
.fn.extend({jsonh_now:function(e,t){var r=n();return $(this).each(function(){var n=
r.build_options(this,e,t);r.ajax(n)})},jsonhify:function(e,t){var r=n();return $(
this).each(function(){var n=r.build_options(this,e,t);$(this)[n.action](function(
){return r.ajax(n),!1})})}}),n()}),define("lib/traxhead",[],function(){if(typeof 
App.Traxhead!="undefined")return App.Traxhead;var e=App.Traxhead={};return e.looksLoggedIn=
function(){return!!document.cookie.match("auth_token")},e.initFbAppId=function(t)
{t=_.extend({music:!1},t),FB.init({appId:"166738216681933",status:!0,channelUrl:"//8tracks.com/channel.html"
,cookie:!0,xfbml:!0,music:t.music,oauth:!0}),setTimeout(function(){e.FbLoaded=!0}
,500)},e.onFbInit=function(){try{e.initFbAppId(),ParsedLocation.urlParams.load_fb_bridge&&
TRAX.trackPageView.loadFbMusicBridge(),FB.Event.subscribe("edge.create",function(
e){App.Events&&App.Events.gaSocial("facebook","like",e)}),FB.Event.subscribe("edge.remove"
,function(e){App.Events&&App.Events.gaSocial("facebook","unlike",e)}),FB.Event.subscribe
("message.send",function(e){App.Events&&App.Events.gaSocial("facebook","send",e)}
)}catch(t){}},e.onFbMusicInit=function(){try{e.initFbAppId({music:!0}),App.views.
fbPlayerIframeView.loadFbMusicBridge()}catch(t){}},e.zeroFill=function(e,t){return t-=
e.toString().length,t>0?(new Array(t+(/\./.test(e)?2:1))).join("0")+e:e},e}),define
("models/modules/backbone_client_storage",["lib/client_storage"],function(e){var t=
{getModel:function(t){return e.get(this._modelKey(t))},getModels:function(t){var n=
this._collectionKey(t);return _.map(e.get(n),function(t){return e.get(n+"-"+t)})}
,setModel:function(t){return this._addToCollection(t),e.set(this._modelKey(t),t)}
,setModels:function(e){return _.each(e,function(e){this.setModel(e)},this),e},destroyModel
:function(t){return this._removeFromCollection(t),e.destroy(this._modelKey(t))},_modelKey
:function(e){return(e.storeKey||e.collection.storeKey)+"-"+e.id},_collectionKey:function(
e){return e.storeKey},_addToCollection:function(t){if(t.collection){var n=this._collectionKey
(t.collection),r=e.get(n);r||(r=[]),r.push(t.id),e.set(n,r)}},_removeFromCollection
:function(t){if(t.collection){var n=this._collectionKey(t.collection),r=e.get(n);
r||(r=[]),r=_.reject(r,function(e){return e==t.id.toString()}),e.set(n,r)}}};return t
}),define("models/modules/flexible_store",["models/modules/backbone_client_storage"
,"lib/jsonh.jquery"],function(e,t){Backbone.jsonhSync=function(e,n,r){var i=function(
e){var t={};return _.each(e.FIELDS_TO_BACKEND,function(n){if(!_.isUndefined(e.get
(n))){var r=e.get(n);r===!0&&(r=1),r===!1&&(r=0),t[n]=r}}),t},s,o,u,a;_.isUndefined
(n.id)?(o=n,s=null,u=o.urlRoot,a=o.jsonhKey):(s=n,o=null,u=s.url(),a=s.jsonhKey||
s.collection.jsonhKey),_.isUndefined(r)&&(r={});var f={url:u,type:Backbone.methodMap
[e],complete:function(e){e.success?_.isFunction(r.success)&&r.success(n,e[a],r):_
.isFunction(r.error)&&r.error(n,e[a],r)}};return r.data&&(f.data=r.data),e==="update"&&
(f.data=f.data||{},f.data[a]=i(s)),t.ajax(f)},Backbone.flexibleSync=function(t,n,
r){_.isUndefined(r)&&(r={});var i,s,o;_.isUndefined(n.id)?(i=n,s=null):(s=n,i=null
);if(t==="read"){var u=!1,a;s?(a=e.getModel(s),a&&(u=!0,_.isFunction(r.success)&&
r.success(s,a,r))):i&&(a=e.getModels(i),a&&a.length>0&&(u=!0,_.isFunction(r.success
)&&r.success(i,a,r))),u||(o=_.clone(r),o.success=_.bind(function(t){_.isFunction(
r.success)&&r.success(this,t,r),this.models?e.setModels(this.models):e.setModel(this
)},s||i),Backbone.jsonhSync(t,s||i,o))}else t==="create"||t==="update"?(e.setModel
(s),Backbone.jsonhSync(t,s,o)):t==="delete"&&(e.destroyModel(s),Backbone.jsonhSync
(t,s,o))};var n={localSave:function(){e.setModel(this)},localDestroy:function(){e
.destroyModel(this)},sync:function(e,t,n){return Backbone.flexibleSync(e,t,n)}};return n
}),define("models/user",["global_trax","models/modules/flexible_store","lib/jsonh.jquery"
],function(e,t,n){var r=Backbone.Model.extend(t).extend({urlRoot:"/users",storeKey
:"Users",jsonhKey:"user",FIELDS_TO_BACKEND:["login","bio","web_safe_browse","next_mix_prefs"
],PARTNER_CONNECTED:"connected",PARTNER_NOT_CONNECTED:"not_connected",PARTNER_CONNECTED_BUT_EXPIRED
:"connected_but_expired",CONTACTS_UPDATING:"updating",CONTACTS_ERROR:"error",CONTACTS_UPDATED
:"updated",CONTACTS_UPDATED_BUT_EXPIRED:"contacts_updated_but_expired",initialize
:function(e){},isAdmin:function(){return this.get("admin")},isJuniorModerator:function(
){return this.get("junior_moderator")},toggleFollow:function(t){!t,t={};if(!e.currentUser
)return!1;e.currentUser.trigger("follow"),n.ajax({url:this.url()+"/toggle_follow"
,type:"POST",data:{nonce:$('meta[name="8tnonce"]').attr("content")},complete:_.bind
(function(e){e.success&&t.success?t.success(e):t.error&&t.error(e)},this)})},hasConnectedPartners
:function(){return _.any(this.get("partners"),_.bind(function(e){return e.status===
this.PARTNER_CONNECTED||e.status===this.PARTNER_CONNECTED_BUT_EXPIRED},this))},hasConnected
:function(e){return this.get("partners")&&this.get("partners")[e]&&(this.get("partners"
)[e].status===this.PARTNER_CONNECTED||this.get("partners")[e].status===this.PARTNER_CONNECTED_BUT_EXPIRED
)},hasConnectedAndNotExpired:function(e){return this.get("partners")&&this.get("partners"
)[e]&&this.get("partners")[e].status===this.PARTNER_CONNECTED},updatingContactsFor
:function(e){return this.get("partners")[e]&&this.get("partners")[e].contacts_status===
this.CONTACTS_UPDATING},updatingContacts:function(){return this.updatingContactsFor
("facebook")},partnerContactsState:function(e){if(this.get("partners")&&this.get("partners"
)[e]){var t=this.get("partners")[e],n="";return t.status===this.PARTNER_CONNECTED||
t.status===this.PARTNER_CONNECTED_BUT_EXPIRED?n=this.PARTNER_CONNECTED:n=this.PARTNER_NOT_CONNECTED
,t.contacts_status&&(n+=" "+t.contacts_status),n}},updateRecentMixes:function(e){
this.set("recent_mixes",e),this.set("has_recent_mixes",e.length>0),this.localSave
()},allPartnersConnected:function(){return this.hasConnected("facebook")},hasPresetSmartId
:function(e){var t=!!_.find(this.get("preset_smart_ids"),function(t){return t.replace
(/:safe$/,"")===e.replace(/:safe$/,"")});return t?!0:!!_.find(this.get("presets")
,function(t){return"tags:"+t===e})},hasYoutubeConnected:function(){return App.models
.toc&&App.models.toc.hasYoutubeRecommendations()},flag:function(e){return $.ajax("/user_flaggings.jsonh"
,{data:{flagged_user_id:e},type:"POST"})}});return r}),define("lib/carousel",[],function(
){return{onCarouselClick:function(e){$(e.currentTarget).addClass("checked").siblings
().removeClass("checked"),this.animateCarousels()},animateCarousels:function(){this
.carouselTimers||(this.carouselTimers=[]);var e=$(".carousel_slider");for(i=0;i<=
e.length;i++)this.animateCarousel(i,e[i]);$(".slider__nav").click(_.bind(this.onCarouselClick
,this))},animateCarousel:function(e,t){clearInterval(this.carouselTimers[e]),this
.carouselTimers[e]=setInterval(function(){var e=$(t).children("input.checked").first
();e.removeClass("checked");var n=e.next("input");n.length==0&&(n=$(t).children("input"
).first()),n.attr("checked",!0).addClass("checked")},5e3)}}}),define("hogan",["require"
,"exports","module"],function(e,t,n){var r={};(function(e,t){function a(e){return String
(e===null||e===undefined?"":e)}function f(e){return e=a(e),u.test(e)?e.replace(n,"&amp;"
).replace(r,"&lt;").replace(i,"&gt;").replace(s,"&#39;").replace(o,"&quot;"):e}e.
Template=function(e,n,r,i){this.r=e||this.r,this.c=r,this.options=i,this.text=n||""
,this.buf=t?[]:""},e.Template.prototype={r:function(e,t,n){return""},v:f,t:a,render
:function(t,n,r){return this.ri([t],n||{},r)},ri:function(e,t,n){return this.r(e,
t,n)},rp:function(e,t,n,r){var i=n[e];return i?(this.c&&typeof i=="string"&&(i=this
.c.compile(i,this.options)),i.ri(t,n,r)):""},rs:function(e,t,n){var r=e[e.length-1
],i,s;typeof r=="function"&&(i=r,s=this.buf.length);if(!l(r)){n(e,t,this);if(i){var o=
this.buf.substr(s);this.buf=this.buf.substr(0,s),bunc=this.binderator(i,e[e.length-2
]),this.b(bunc(o))}return}for(var u=0;u<r.length;u++)e.push(r[u]),n(e,t,this),e.pop
()},binderator:function(e,t){var n=Function.prototype.bind;if(e.bind===n&&n)return n
.apply(e,Array.prototype.slice.call(arguments,1));var r=Array.prototype.slice.call
(arguments,2);return function(){return e.apply(t,r.concat(Array.prototype.slice.call
(arguments)))}},s:function(e,t,n,r,i,s,o){var u;if(l(e)&&e.length===0)return!1;var a
;return typeof e=="function"&&(e=this.ms(e,t,n),typeof e=="function"&&(a=e)),u=e===""||!!
e,!r&&u&&t&&(a?t.push(a):t.push(typeof e=="object"?e:t[t.length-1])),u},ms:function(
e,t,n){var r=t[t.length-1];return e.call(r)},d:function(e,t,n,r){var i=e.split("."
),s=this.f(i[0],t,n,r),o=null;if(e==="."&&l(t[t.length-2]))return t[t.length-1];for(
var u=1;u<i.length;u++)s?(o=s,typeof s[i[u]]=="function"?s=s[i[u]]():s=s[i[u]]||""
):s="";return r&&!s?!1:(!r&&typeof s=="function"&&(t.push(o),s=this.lv(s,t,n),t.pop
()),s)},f:function(e,t,n,r){var i=!1,s=null,o=!1;for(var u=t.length-1;u>=0;u--){s=
t[u];if(s&&typeof s=="object"&&e in s){i=s[e],o=!0;break}}return o?(!r&&typeof i=="function"&&
(i=this.lv(i,t,n)),i):r?!1:""},ho:function(e,t,n,r,i){var s=this.c,o=this.options||
{};o.delimiters=i;var r=e.call(t,r);return r=r==null?String(r):r.toString(),this.
b(s.compile(r,o).render(t,n)),!1},b:t?function(e){this.buf.push(e)}:function(e){this
.buf+=e},fl:t?function(){var e=this.buf.join("");return this.buf=[],e}:function()
{var e=this.buf;return this.buf="",e},ls:function(e,t,n,r,i,s,o){var u=t[t.length-1
],a=null;if(!r&&this.c&&e.length>0)return this.ho(e,u,n,this.text.substring(i,s),
o);a=e.call(u);if(typeof a=="function"){if(r)return!0;if(this.c)return this.ho(a,
u,n,this.text.substring(i,s),o)}return a},lv:function(e,t,n){var r=t[t.length-1],
i=e.call(r);if(typeof i=="function"){i=a(i.call(r));if(this.c&&~i.indexOf("{{"))return this
.c.compile(i,this.options).render(r,n)}return a(i)}};var n=/&/g,r=/</g,i=/>/g,s=/\'/g
,o=/\"/g,u=/[&<>\"\']/,l=Array.isArray||function(e){return Object.prototype.toString
.call(e)==="[object Array]"}})(typeof t!="undefined"?t:r),function(e){function u(
e){e.n.substr(e.n.length-1)==="}"&&(e.n=e.n.substring(0,e.n.length-1))}function a
(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}function f(e,t,n){if(t.charAt
(n)!=e.charAt(0))return!1;for(var r=1,i=e.length;r<i;r++)if(t.charAt(n+r)!=e.charAt
(r))return!1;return!0}function l(e,t,n,r){var i=[],s=null,o=null;while(e.length>0
){o=e.shift();if(o.tag=="#"||o.tag=="^"||c(o,r))n.push(o),o.nodes=l(e,o.tag,n,r),
i.push(o);else{if(o.tag=="/"){if(n.length===0)throw new Error("Closing tag without opener: /"+
o.n);s=n.pop();if(o.n!=s.n&&!h(o.n,s.n,r))throw new Error("Nesting error: "+s.n+" vs. "+
o.n);return s.end=o.i,i}i.push(o)}}if(n.length>0)throw new Error("missing closing tag: "+
n.pop().n);return i}function c(e,t){for(var n=0,r=t.length;n<r;n++)if(t[n].o==e.n
)return e.tag="#",!0}function h(e,t,n){for(var r=0,i=n.length;r<i;r++)if(n[r].c==
e&&n[r].o==t)return!0}function p(e){return e.replace(s,"\\\\").replace(n,'\\"').replace
(r,"\\n").replace(i,"\\r")}function d(e){return~e.indexOf(".")?"d":"f"}function v
(e){var t="";for(var n=0,r=e.length;n<r;n++){var i=e[n].tag;i=="#"?t+=m(e[n].nodes
,e[n].n,d(e[n].n),e[n].i,e[n].end,e[n].otag+" "+e[n].ctag):i=="^"?t+=g(e[n].nodes
,e[n].n,d(e[n].n)):i=="<"||i==">"?t+=y(e[n]):i=="{"||i=="&"?t+=b(e[n].n,d(e[n].n)
):i=="\n"?t+=E('"\\n"'+(e.length-1==n?"":" + i")):i=="_v"?t+=w(e[n].n,d(e[n].n)):
i===undefined&&(t+=E('"'+p(e[n])+'"'))}return t}function m(e,t,n,r,i,s){return"if(_.s(_."+
n+'("'+p(t)+'",c,p,1),'+"c,p,0,"+r+","+i+',"'+s+'")){'+"_.rs(c,p,"+"function(c,p,_){"+
v(e)+"});c.pop();}"}function g(e,t,n){return"if(!_.s(_."+n+'("'+p(t)+'",c,p,1),c,p,1,0,0,"")){'+
v(e)+"};"}function y(e){return'_.b(_.rp("'+p(e.n)+'",c,p,"'+(e.indent||"")+'"));'
}function b(e,t){return"_.b(_.t(_."+t+'("'+p(e)+'",c,p,0)));'}function w(e,t){return"_.b(_.v(_."+
t+'("'+p(e)+'",c,p,0)));'}function E(e){return"_.b("+e+");"}var t=/\S/,n=/\"/g,r=/\n/g
,i=/\r/g,s=/\\/g,o={"#":1,"^":2,"/":3,"!":4,">":5,"<":6,"=":7,_v:8,"{":9,"&":10};
e.scan=function(n,r){function S(){v.length>0&&(m.push(new String(v)),v="")}function x
(){var e=!0;for(var n=b;n<m.length;n++){e=m[n].tag&&o[m[n].tag]<o._v||!m[n].tag&&
m[n].match(t)===null;if(!e)return!1}return e}function T(e,t){S();if(e&&x())for(var n=
b,r;n<m.length;n++)m[n].tag||((r=m[n+1])&&r.tag==">"&&(r.indent=m[n].toString()),
m.splice(n,1));else t||m.push({tag:"\n"});g=!1,b=m.length}function N(e,t){var n="="+
E,r=e.indexOf(n,t),i=a(e.substring(e.indexOf("=",t)+1,r)).split(" ");return w=i[0
],E=i[1],r+n.length-1}var i=n.length,s=0,l=1,c=2,h=s,p=null,d=null,v="",m=[],g=!1
,y=0,b=0,w="{{",E="}}";r&&(r=r.split(" "),w=r[0],E=r[1]);for(y=0;y<i;y++)h==s?f(w
,n,y)?(--y,S(),h=l):n.charAt(y)=="\n"?T(g):v+=n.charAt(y):h==l?(y+=w.length-1,d=o
[n.charAt(y+1)],p=d?n.charAt(y+1):"_v",p=="="?(y=N(n,y),h=s):(d&&y++,h=c),g=y):f(
E,n,y)?(m.push({tag:p,n:a(v),otag:w,ctag:E,i:p=="/"?g-E.length:y+w.length}),v="",
y+=E.length-1,h=s,p=="{"&&(E=="}}"?y++:u(m[m.length-1]))):v+=n.charAt(y);return T
(g,!0),m},e.generate=function(t,n,r){var i='var _=this;_.b(i=i||"");'+v(t)+"return _.fl();"
;return r.asString?"function(c,p,i){"+i+";}":new e.Template(new Function("c","p","i"
,i),n,e,r)},e.parse=function(e,t,n){return n=n||{},l(e,"",[],n.sectionTags||[])},
e.cache={},e.compile=function(e,t){t=t||{};var n=e+"||"+!!t.asString,r=this.cache
[n];return r?r:(r=this.generate(this.parse(this.scan(e,t.delimiters),e,t),e,t),this
.cache[n]=r)}}(typeof t!="undefined"?t:r)}),define("text",["module"],function(e){"use strict"
;var t=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im
,r=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!="undefined"&&location
.href,s=i&&location.protocol&&location.protocol.replace(/\:/,""),o=i&&location.hostname
,u=i&&(location.port||undefined),a=[],f=e.config(),l,c;return l={version:"2.0.0",
strip:function(e){if(e){e=e.replace(n,"");var t=e.match(r);t&&(e=t[1])}else e="";
return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g
,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace
(/[\r]/g,"\\r")},createXhr:function(){var e,n,r;if(typeof XMLHttpRequest!="undefined"
)return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(n=0;n<3;n++){
r=t[n];try{e=new ActiveXObject(r)}catch(i){}if(e){t=[r];break}}return e},parseName
:function(e){var t=!1,n=e.indexOf("."),r=e.substring(0,n),i=e.substring(n+1,e.length
);return n=i.indexOf("!"),n!==-1&&(t=i.substring(n+1,i.length),t=t==="strip",i=i.
substring(0,n)),{moduleName:r,ext:i,strip:t}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/
,useXhr:function(e,t,n,r){var i=l.xdRegExp.exec(e),s,o,u;return i?(s=i[2],o=i[3],
o=o.split(":"),u=o[1],o=o[0],(!s||s===t)&&(!o||o===n)&&(!u&&!o||u===r)):!0},finishLoad
:function(e,t,n,r){n=t?l.strip(n):n,f.isBuild&&(a[e]=n),r(n)},load:function(e,t,n
,r){if(r.isBuild&&!r.inlineText){n();return}f.isBuild=r.isBuild;var a=l.parseName
(e),c=a.moduleName+"."+a.ext,h=t.toUrl(c),p=f.useXhr||l.useXhr;!i||p(h,s,o,u)?l.get
(h,function(t){l.finishLoad(e,a.strip,t,n)},function(e){n.error&&n.error(e)}):t([
c],function(e){l.finishLoad(a.moduleName+"."+a.ext,a.strip,e,n)})},write:function(
e,t,n,r){if(a.hasOwnProperty(t)){var i=l.jsEscape(a[t]);n.asModule(e+"!"+t,"define(function () { return '"+
i+"';});\n")}},writeFile:function(e,t,n,r,i){var s=l.parseName(t),o=s.moduleName+"."+
s.ext,u=n.toUrl(s.moduleName+"."+s.ext)+".js";l.load(o,n,function(t){var n=function(
e){return r(u,e)};n.asModule=function(e,t){return r.asModule(e,u,t)},l.write(e,o,
n,i)},i)}},typeof process!="undefined"&&process.versions&&!!process.versions.node?
(c=require.nodeRequire("fs"),l.get=function(e,t){var n=c.readFileSync(e,"utf8");n
.indexOf("﻿")===0&&(n=n.substring(1)),t(n)}):l.createXhr()?l.get=function(e,t,n){
var r=l.createXhr();r.open("GET",e,!0),f.onXhr&&f.onXhr(r,e),r.onreadystatechange=
function(i){var s,o;r.readyState===4&&(s=r.status,s>399&&s<600?(o=new Error(e+" HTTP status: "+
s),o.xhr=r,n(o)):t(r.responseText))},r.send(null)}:typeof Packages!="undefined"&&
(l.get=function(e,t){var n="utf-8",r=new java.io.File(e),i=java.lang.System.getProperty
("line.separator"),s=new java.io.BufferedReader(new java.io.InputStreamReader(new 
java.io.FileInputStream(r),n)),o,u,a="";try{o=new java.lang.StringBuffer,u=s.readLine
(),u&&u.length()&&u.charAt(0)===65279&&(u=u.substring(1)),o.append(u);while((u=s.
readLine())!==null)o.append(i),o.append(u);a=String(o.toString())}finally{s.close
()}t(a)}),l}),define("hgn",["hogan","text"],function(e,t){function o(i,s,o,f){var l=
f.hgn||{},c=i;c+=l&&l.templateExtension!=null?l.templateExtension:n,t.get(s.toUrl
(c),function(t){var n=l.compilationOptions?a({},l.compilationOptions):{};f.isBuild&&
(n.asString=!0,r[i]=e.compile(t,n));var s=e.compile(t,n),c=u(s.render,s);c.text=s
.text,c.template=s,o(c)})}function u(e,t){return function(){return e.apply(t,arguments
)}}function a(e,t){var n;for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e
[n]=t[n]);return e}function f(t,n,o){if(n in r){s||(s=e.compile(i));var u=r[n];o(
s.render({pluginName:t,moduleName:n,fn:u}))}}var n=".mustache",r={},i='define("{{pluginName}}!{{moduleName}}", ["hogan"], function(hogan){  var tmpl = new hogan.Template({{{fn}}}, "", hogan, {});  function render(){ return tmpl.render.apply(tmpl, arguments); } render.template = tmpl; return render;});\n'
,s;return{load:o,write:f}}),define("hgn!templates/users/login_lightbox",["hogan"]
,function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="clearfix session_form" id="login_lightbox">'
),r.b("\n"+n),r.b('  <div class="col-xs-12 col-sm-12 col-md-6 center" id="signup_message">'
),r.b("\n"+n),r.s(r.f("image",e,t,1),e,t,0,142,231,"{{ }}")&&(r.rs(e,t,function(e
,t,n){n.b('      <img src="/images/people/'),n.b(n.v(n.f("image",e,t,0))),n.b('" class="signup-img hidden-xs hidden-sm" />'
),n.b("\n")}),e.pop()),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="col-xs-12 col-sm-12 col-md-6" id="login_form">'
),r.b("\n"+n),r.b("    <br />"),r.b("\n"+n),r.b('    <div id="signup_wrapper">'),
r.b("\n"+n),r.b("      <br />"),r.b("\n"+n),r.b('      <h3 class="maintext">'),r.
b(r.v(r.f("header",e,t,0))),r.b("</h3>"),r.b("\n"+n),r.b('      <p class="subtext center">'
),r.b(r.t(r.f("subhed",e,t,0))),r.b("</p>"),r.b("\n"+n),r.b("\n"+n),r.b(r.rp("login_form"
,e,t,"      ")),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+
n),r.b('  <a class="clear signup_endnote signup noaccount" href="/signup">'),r.b("\n"+
n),r.b("    Need an account? <strong>Sign up here.</strong>"),r.b("\n"+n),r.b("  </a>"
),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define
("hgn!templates/users/_login_form",["hogan"],function(e){function n(){return t.render
.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r.b(n=
n||""),r.b('<div class="js-connected-sites clearfix">'),r.b("\n"+n),r.b('    <a href="/auth/facebook" class="facebook_connect_button facebook-signup " data-site="facebook" data-win-height="362" data-win-name="facebook" data-win-width="640" rel="popup" target="_blank" title="Connect with Facebook">'
),r.b("\n"+n),r.b('        <span class="i-facebook icon"></span>'),r.b("\n"+n),r.
b('        <span class="text">SIGN IN</span>'),r.b("\n"+n),r.b("    </a>"),r.b("\n"+
n),r.b("  "),r.b("\n"+n),r.b('    <div class="google-plus-container" id="gplus-button" title="Connect with Google+">'
),r.b("\n"+n),r.b('      <span class="i-gplus icon"></span>'),r.b("\n"+n),r.b('      <span class="text">SIGN IN</span>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n)
,r.b('<br class="clear" />'),r.b("\n"+n),r.b("\n"+n),r.b('<form action="/sessions" id="login_form" class="signup_form clear" method="POST">'
),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="inner">'),r.b("\n"+n),r.b("\n"+n),r.
b("    <!-- username or email -->"),r.b("\n"+n),r.b('    <div class="row clear">'
),r.b("\n"+n),r.b('      <span class="i-profile field-icon"></span>'),r.b("\n"+n)
,r.b('      <input type="text" name="login" id="login" class="inputText initial_focus" tabindex="11" placeholder="Username or email" />'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("\n"+n),r.b("    <!-- password -->"
),r.b("\n"+n),r.b('    <div class="row clear">'),r.b("\n"+n),r.b('      <span class="i-password field-icon"></span>'
),r.b("\n"+n),r.b('      <input type="password" name="password" id="password" class="inputText" tabindex="12" placeholder="Password" />'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b('    <div class="terms">'),r.b("\n"+
n),r.b('      <a href="/forgot_password" class="terms" tabindex="15">Forgot your password?</a>'
),r.b("\n"+n),r.b('      <div id="login_form-spinner" class="spin"><span style="display:none">&nbsp;</span></div>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("\n"+n),r.b('    <input type="hidden" name="attempted_path" id="attempted_path" value="'
),r.b(r.v(r.f("attempted_path",e,t,0))),r.b('">'),r.b("\n"+n),r.b("    "),r.b("\n"+
n),r.b("    <!-- login cta -->"),r.b("\n"+n),r.b('    <div class="row clear">'),r
.b("\n"+n),r.b('      <div class="large-spinner"></div>  '),r.b("\n"+n),r.b('      <input type="submit" name="commit" value="Log in" class="submit button_blue flatbutton">'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("    "),r.b("\n"+n),r.b("  </div><!--.inner-->"
),r.b("\n"+n),r.b("\n"+n),r.b("</form>"),r.b("\n"),r.fl()},"",e,{});return n.template=
t,n}),define("views/google_plus_view",["views/trax_view","lib/jsonh.jquery","lib/sessions"
,"global_trax"],function(e,t,n,r){var i=e.extend({initialize:function(e){e&&(this
.customCallback=e.customCallback,this.customErrorFunction=e.customErrorFunction),
_.bindAll(this,"enabled","renderCustomButton","loadGapi","asyncGooglePlus","sendAuthCode"
,"unauthorized","logIn","signInCallBack"),_.isUndefined(window.googlePlusCallback
)&&(window.googlePlusCallback=_.bind(this.signInCallBack,this)),window.gapi&&gapi
.load("auth2",this.loadGapi)},enabled:function(){return!0},renderCustomButton:function(
e,t){var n={scope:"email profile",client_id:GOOGLE_CLIENT_ID,redirecturi:"postmessage"
,cookiepolicy:"single_host_origin",callback:"googlePlusCallback"};_.isUndefined(t
)||_.extend(n,t),gapi.signin2.render(e,n)},loadGapi:function(){typeof auth2=="undefined"&&
(auth2=gapi.auth2.init({client_id:GOOGLE_CLIENT_ID,cookiepolicy:"single_host_origin"
,scope:"email profile"}));var e=$(".google-plus-container:not(.attached)");for(var t=0
;t<e.length;t++)auth2.attachClickHandler(e[t],{scope:"email profile "+($(e[t]).data
("scope")||"")},this.signInCallBack,this.customErrorFunction||function(e){console
.log("error signing in")}),$(e[t]).addClass("attached")},asyncGooglePlus:function(
e,t){var n=$("#"+e);if(n.data("gapiattached"))return;this.renderCustomButton(e,t)
},sendAuthCode:function(e){var r=this,i=e.getAuthResponse();id_token=i.id_token,access_token=
i.access_token,youtube_auth=i.scope&&i.scope.match(/youtube/),t.now("/auth/google-plus/callback"
,{access_token:access_token,youtube_auth:youtube_auth},function(e){r.logIn(e),i.scope&&
i.scope.match(/youtube/)&&n.trigger("youtube-connected")},{type:"POST"}).error(this
.unauthorized)},unauthorized:function(e,t,n){try{json=JSON.parse(e.responseText)}
catch(i){json={}}json.user_error_message?r.show_flash_error(json.user_error_message
,!1):r.show_flash_error("Something is wrong with Google+. Please try again.")},logIn
:function(e){n.onBackendLogin(e)},signInCallBack:function(e){var t=e.getAuthResponse
(),r=!1;t.scope&&t.scope.match(/youtube/)&&n.trigger("youtube-started"),this.sendAuthCode
(e,r),typeof this.customCallback=="function"&&this.customCallback.call(this,e)}})
;return i}),define("hgn!templates/users/_signup_form",["hogan"],function(e){function n
(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=
this;return r.b(n=n||""),r.b("<div>"),r.b("\n"+n),r.b('  <div class="js-connected-sites clearfix">'
),r.b("\n"+n),r.b('     <a href="/auth/facebook" class="facebook_connect_button facebook-signup" data-site="facebook" data-win-height="362" data-win-name="facebook" data-win-width="640" rel="popup" target="_blank" title="Connect with Facebook">'
),r.b("\n"+n),r.b('        <span class="i-facebook icon"></span>'),r.b("\n"+n),r.
b('        <span class="text">SIGN IN</span>'),r.b("\n"+n),r.b("    </a>"),r.b("\n"+
n),r.b('    <div class="google-plus-container" id="gplus-button">'),r.b("\n"+n),r
.b('        <span class="i-gplus icon"></span>'),r.b("\n"+n),r.b('        <span class="text">SIGN IN</span>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>  "),r.b("\n"+n),r.b("\n"+
n),r.s(r.f("hide_flash_container",e,t,1),e,t,1,0,0,"")||(r.b('    <div class="flash_container"></div>'
),r.b("\n")),r.b("  "),r.b("\n"+n),r.b("\n"+n),r.b(' <form method="post" id="signup_form" class="signup_form session_form clear" action="/users/create_get.json">'
),r.b("\n"+n),r.b("  <!-- signup form in lightbox -->"),r.b("\n"+n),r.b('  <fieldset class="clear">'
),r.b("\n"+n),r.b('  <div class="inner">'),r.b("\n"+n),r.b('    <div class="email-signup" style="display: block;">'
),r.b("\n"+n),r.b("\n"+n),r.b("      <!-- email -->"),r.b("\n"+n),r.b('      <div class="row clear email-field">'
),r.b("\n"+n),r.b('        <span class="i-email field-icon"></span>'),r.b("\n"+n)
,r.b('        <span class="email i-checkmark available availability"></span>'),r.
b("\n"+n),r.b('        <span class="email unavailable availability">INVALID<span class="i-x"></span></span>'
),r.b("\n"+n),r.b('        <input type="text" id="user_email" name="user[email]" class="initial_focus inputText" tabindex="115" placeholder="Email" />'
),r.b("\n"+n),r.b('        <div class="prompt hidden-xs">'),r.b("\n"+n),r.b("          Enter your email address."
),r.b("\n"+n),r.b('          <div class="validation">'),r.b("\n"+n),r.b("            "
),r.b(r.v(r.d("errors.email",e,t,0))),r.b("\n"+n),r.b("          </div>"),r.b("\n"+
n),r.b("        </div>"),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),
r.b("      <!-- username -->"),r.b("\n"+n),r.b('      <div class="row clear login-field">'
),r.b("\n"+n),r.b('        <span class="i-profile field-icon"></span>'),r.b("\n"+
n),r.b('        <span class="login i-checkmark available availability"></span>'),
r.b("\n"+n),r.b('        <span class="login unavailable availability">UNAVAILABLE<span class="i-x"></span></span>'
),r.b("\n"+n),r.b('        <input type="text" id="user_login" name="user[login]" class="inputText" tabindex="116" maxlength="22" placeholder="Username" />'
),r.b("\n"+n),r.b('        <div class="prompt  hidden-xs">'),r.b("\n"+n),r.b("          Pick a username 2-40 characters long.<br />"
),r.b("\n"+n),r.b("          You can always change this later!"),r.b("\n"+n),r.b('          <div class="validation">'
),r.b("\n"+n),r.b("            "),r.b(r.v(r.d("errors.username",e,t,0))),r.b(" ")
,r.b(r.v(r.d("errors.slug",e,t,0))),r.b("\n"+n),r.b("          </div>"),r.b("\n"+
n),r.b("        </div>        "),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+
n),r.b("      <!-- password -->"),r.b("\n"+n),r.b('      <div class="row clear password-field">'
),r.b("\n"+n),r.b('        <span class="i-password field-icon"></span>'),r.b("\n"+
n),r.b('        <span class="pass i-checkmark available availability"></span>'),r
.b("\n"+n),r.b('        <span class="pass unavailable availability">INVALID<span class="i-x"></span></span>'
),r.b("\n"+n),r.b('        <input type="password" id="user_password" name="user[password]" class="inputText" tabindex="117" placeholder="Password" />'
),r.b("\n"+n),r.b('        <div class="prompt  hidden-xs">'),r.b("\n"+n),r.b("          Enter a password from 4-22 characters in length."
),r.b("\n"+n),r.b('          <div class="validation">'),r.b("\n"+n),r.b("            "
),r.b(r.v(r.d("errors.password",e,t,0))),r.b("\n"+n),r.b("          </div>"),r.b("\n"+
n),r.b("        </div>"),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),
r.b("\n"+n),r.b("      <!-- recaptcha -->"),r.b("\n"+n),r.b('      <div class="row clear" id="captcha_container" style="height: auto">'
),r.b("\n"+n),r.b('        <div class="g-recaptcha" data-sitekey="6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN"></div>'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),r.b("      <!-- signup cta + terms -->"
),r.b("\n"+n),r.b('      <div class="row clear">      '),r.b("\n"+n),r.b('        <input type="submit" class="submit button_blue flatbutton" value="Sign up" tabindex="118" />'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b('      <div class="terms">'),r.
b("\n"+n),r.b('        <input type="hidden" name="user[nonce]" value="'),r.b(r.v(
r.f("nonce",e,t,0))),r.b('" id="user_nonce" />'),r.b("\n"+n),r.b('        <input type="hidden" name="user[agree_to_terms]" value="1" />'
),r.b("\n"+n),r.b('        By signing up you agree to the 8tracks <a href="/terms" target="_blank" class="turquoise">terms of service.</a>'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div><!--.inner-->"
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("attempted_path",e,t,1),e,t,0,3567,3647,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b('    <input type="hidden" name="attempted_path" value="'
),n.b(n.v(n.f("attempted_path",e,t,0))),n.b('" />'),n.b("\n")}),e.pop()),r.b("\n"+
n),r.b('  <div class="clear"></div>'),r.b("\n"+n),r.b("  </fieldset>"),r.b("\n"+n
),r.b(" </form>"),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=
t,n}),define("hgn!templates/users/signup_lightbox",["hogan"],function(e){function n
(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=
this;return r.b(n=n||""),r.b('<div class="clearfix session_form" id="signup_lightbox">'
),r.b("\n"+n),r.b('  <div class="col-xs-12 col-sm-12 col-md-6 center" id="signup_message">'
),r.b("\n"+n),r.s(r.f("image",e,t,1),e,t,0,143,232,"{{ }}")&&(r.rs(e,t,function(e
,t,n){n.b('      <img src="/images/people/'),n.b(n.v(n.f("image",e,t,0))),n.b('" class="signup-img hidden-xs hidden-sm" />'
),n.b("\n")}),e.pop()),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="col-xs-12 col-sm-12 col-md-6" id="signup">'
),r.b("\n"+n),r.b('    <div id="signup_wrapper">'),r.b("\n"+n),r.b('      <h3 class="maintext">'
),r.b(r.v(r.f("header",e,t,0))),r.b("</h3>"),r.b("\n"+n),r.b('      <p class="subtext center">'
),r.b(r.v(r.f("subhed",e,t,0))),r.b("</p>"),r.b("\n"+n),r.b("\n"+n),r.b(r.rp("signup_form"
,e,t,"      ")),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+
n),r.b("\n"+n),r.b('  <a class="clear signup_endnote login" href="/login">'),r.b("\n"+
n),r.b("    Already have an account? <strong>Log in here.</strong>"),r.b("\n"+n),
r.b("  </a>"),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=
t,n}),define("collections/_base_collection",[],function(){return typeof App.Collections
.BaseCollection!="undefined"?App.Collections.BaseCollection:(App.Collections.BaseCollection=
Backbone.Collection.extend({load:function(e){if(_.isArray(e)){var t=[];return _.each
(e,function(e){t.push(this.loadOne(e))},this),t}return this.loadOne(e)},loadOne:function(
e){return this.loadOneByAttributes(e)},loadOneByAttributes:function(e){if(_.isUndefined
(e))return!1;var t=this.get(e.id);return t?t.set(e):this.add(e),this.get(e.id)}})
,App.Collections.BaseCollection)}),define("models/suggested_user",[],function(){return Backbone
.Model.extend({})}),define("collections/suggested_social_users",["collections/_base_collection"
,"models/suggested_user","lib/jsonh.jquery"],function(e,t,n){var r=e.extend({model
:t,initialize:function(e){this.partner=e,this.attempts=0,_.bindAll(this,"loadFriends"
,"getWhenLoaded","loadOne","_updateAndReload","onError","onDoneLoading")},loadFriends
:function(){this.attempts=0,$.getJSON("/who_to_follow/"+this.partner+"/get_and_reload.jsonh"
,this._updateAndReload).error(this.onError)},getWhenLoaded:function(){this.attempts=
this.attempts+1,$.getJSON("/who_to_follow/"+this.partner+"/get_when_loaded.jsonh"
,this._updateAndReload).error(this.onError)},_updateAndReload:function(e){var t=this
;_.each(e.suggested_friends,function(e){!e.suggested_user||t.loadOne(e)}),e.state
.contacts_status!="updated"&&this.attempts<15?_.delay(this.getWhenLoaded,1e3):this
.attempts==15?this.onError():this.onDoneLoading()},onError:function(){this.trigger
("suggested_friends:not_responding")},onDoneLoading:function(){this.trigger("suggested_friends:done_loading"
)}});return r}),define("lib/_template_helpers",["global_trax","lib/trax_utils"],function(
e,t){var n=function(e){this.initTplParams(e)};return n.prototype.initTplParams=function(
e){_.extend(this,e)},n.prototype.escape=function(){return function(e){return escape
(this[e])}},n.prototype.mix_cover_url=function(){return function(e){return n.prototype
.imgix_url(e,this.cover_urls)}},n.prototype.mixpage_mix_cover_url=function(e,t){return n
.prototype.mix_cover_url(e)},n.prototype.avatar_url=function(){return function(e)
{return n.prototype.imgix_url(e,this.avatar_urls)}},n.prototype.mix_cover_img=function(
){var e=this.cover_urls;return function(t){return'<img src="'+n.prototype.imgix_url
(t,e)+'" class="cover" alt="'+_.escape(this.name)+'"  />'}},n.prototype.avatar_img=
function(){var e=this.avatar_urls;return function(t){return'<img src="'+n.prototype
.imgix_url(t,e)+'" class="avatar" alt="'+_.escape(this.login)+'"/>'}},n.prototype
.external_img=function(){return function(e){return args=e.split(/,\s*/),src_name=
args[0],size=args[1],src=this[src_name],window.dpr!==undefined&&window.dpr>1&&(size*=2
),'<img src="'+external_image_url(src,size)+'" class="artist_photo" width="'+size+'"/>'
}},n.prototype.mix_set_sort_path=function(){return function(e){return this.web_path
.match(/(\/recent|\/popular|\/hot)/)?this.web_path.replace(/(\/recent|\/popular|\/hot)/
,e):this.web_path+e}},n.prototype.sort_name=function(){return{hot:"Trending","new"
:"Newest",recent:"Newest",popular:"Popular"}[this.sort]},n.prototype.dj_mode=function(
){return this.smart_type=="dj"},n.prototype.collection_mode=function(){return this
.smart_type=="collection"},n.prototype.cool_number=function(){return function(e){
return t.coolNumber(this[e])}},n.prototype.human_number=function(){return function(
e){return t.addCommas(this[e])}},n.prototype.human_date=function(){return function(
e){var t=this[e]!==null?this[e]:"";return n.prototype.human_date_value()(t)}},n.prototype
.human_date_value=function(){return function(e){var t="";if(e){if(e.match("TZ|T")
){var n=e.split(/[-TZ]/);t=new Date(Date.parse(n.slice(0,3).join("/")+" "+n[3]))}
else t=new Date(Date.parse(e));var r=["January","February","March","April","May","June"
,"July","August","September","October","November","December"];return r[t.getUTCMonth
()]+" "+t.getDate()+", "+t.getFullYear()}return""}},n.prototype.human_duration=function(
){return function(e){var t=this[e];return t==0?"0min":_.compact(_.collect([[60,"sec"
],[60,"min"],[24,"hr"],[1e3,"d"]],function(e){if(t>0){var n=t%e[0];t=(t-n)/e[0];if(
e[1]!="sec")return n+e[1]}})).reverse().join(" ")}},n.prototype.dynamic_font_size=
function(){var e=this.login;if(!e)return;var t=[[18,16],[15,18],[12,20],[10,24],[8
,25],[6,26],[1,28]];for(var n=0;n<t.length;n++){var r=t[n];if(e.length>=r[0])return r
[1].toString()+"px"}},n.prototype.dynamic_font_size2=function(){return function(e
){return e.length>20?"oversize":""}},n.prototype.track_duration=function(){var e=
this.duration;return _.compact(_.collect([[60,"sec"],[60,"min"],[24,"hr"],[1e3,"d"
]],function(t){if(e>0){var n=e%t[0];return e=(e-n)/t[0],("0"+(n+t[1])).substr(-2)
}})).reverse().join(":")},n.prototype.soundcloud_year=function(){return this.release_date
.substring(0,4)},n.prototype.first_sentence=function(){return function(e){var t=e
.split(" "),n=t[0]||"";n=(n.match(/.+/g)||[]).join(" ");var r=t[1]||100,i=_.map(n
.split(". "),function(e){return e.trim()});return i[0].length>r?n.substring(0,r)+"..."
:i.length>1?i[0]+".":n}},n.prototype.pluralize=function(){return function(e){var t=
e.split(" ");return this[t[0]]==1?t[1]:t[2]}},n.prototype.show_pagination=function(
){if(this.total_entries)return this.total_entries>this.per_page;if(this.pagination
)return this.pagination.total_pages>1},n.prototype.list_tags=function(e,t){var r,
i=[];if(this.tag_list_cache)r=this.tag_list_cache.split(/,\s?/);else{if(!this.top_tags
)return"";r=this.top_tags}for(var s=0;s<r.length;s++)i.push(n.prototype.tag(r[s],!1
,!1,t?"":"tag"));return i.join("")},n.prototype.list_tags_plaintext=function(e){return n
.prototype.list_tags(this,[e,!0])},n.prototype.link_top_genre=function(){if(!this
.tags_list)return"";var e="";this["tags_list"].length==1?e+=this.tags_list[0]:this
["tags_list"].length==2?e+=this.tags_list[0]+" and "+this.tags_list[1]:_.each(this
.tags_list,function(t,n){n!=this["tags_list"].length-1?e+=t+", ":e+="and "+t},this
);var n=_.collect(this.tags_list,t.toUrlParam).join("+"),r='<a href="/explore/'+n+'">'+
e+"</a>";return r},n.prototype.list_genres=function(){if(!this.genres)return"";var e=
[];for(var t=0;t<this.genres.length;t++)e.push(n.prototype.tag(this.genres[t],!1,!1
,""));return e.join("")},n.prototype.list_artists=function(){if(!this.artist_tags
)return"";var e=[];for(var t=0;t<this.artist_tags.length;t++)e.push(n.prototype.artist_link
(this.artist_tags[t],!1,!1,""));return e.join("")},n.prototype.grid_tags=function(
){if(!this.tag_list_cache)return"";var e=this.tag_list_cache.split(/,\s?/),t=[];for(
var r=0;r<5;r++)e[r]&&t.push(n.prototype.tag(e[r],!1,!1,"tag"));return t.join(" "
)},n.prototype.first_tag=function(){if(!this.tag_list_cache)return"";var e=this.tag_list_cache
.split(/,\s?/);return e[0]},n.prototype.seo_pagination=function(){var e=this.link_structure||
(this.web_path||this.path)+"/::page::";ret="";if(this.pagination){var t=this.pagination
,n=t.total_pages&&t.total_pages<=1e3?t.total_pages:"1000+";if(!t.previous_page&&!
t.next_page)return"";ret+='<div class="new_pagination clear">';if(t.previous_page
){ret+='<div class="pages_before">',ret+='<a href="'+e.replace("::page::",t.previous_page
)+'" class="prev_page white_button"><span class="i-arrow-left"></span>&nbsp;&nbsp;Prev page</a> '
;for(page=t.previous_page-2;page<=t.previous_page;page++)page>0&&(ret+='<a href="'+
e.replace("::page::",page)+'" class="white_button">'+page+"</a> ");ret+="</div>"}
if(t.next_page){ret+='<div class="pages_after">',ret+='<a href="'+e.replace("::page::"
,t.next_page)+'" class="next_page white_button">Next page&nbsp;&nbsp;<span class="i-arrow-right"></span></a> '
;for(page=t.next_page+2;page>=t.next_page;page--)page<=t.total_pages&&(ret+='<a href="'+
e.replace("::page::",page)+'" class="white_button">'+page+"</a> ");ret+="</div>"}
ret+='<div class="page_counter">';if(t.previous_page||t.next_page)ret+=(t.page||t
.current_page)+" of "+n;ret+="</div>",ret+="</div>"}return ret},n.prototype.more_pagination=
function(e){return function(e){ret="";if(this.pagination&&this.pagination.next_page
){var t=this.path.replace(/[&|\?]page=[0-9]+/,"");t+=t.indexOf("?")>-1?"&":"?",ret+='<div class="more_pagination clear">'
,ret+='<a href="'+t+"page="+this.pagination.next_page+"&per_page="+this.pagination
.per_page+"&include="+this.include+'" class="more white_button">More</a> ',ret+='<div id="show-spinner" class="spin"><span style="display:none">&nbsp;</span></div>'
,ret+="</div>"}return ret}},n.prototype.badge=function(){return function(e){if(!this
.designation)return"";var t=e;t||(t="small");var n='<span class="badge_'+t+" badge_"+
this.designation+'">';return this.designation=="plus"?n+='<a href="/plus" target="_blank">'+
this.designation.replace("_"," ")+"</a>":n+=this.designation.replace("_"," "),n+"</span>"
}},n.prototype.page_break=function(e,t){return this.index!=1&&this.index%e==1?'</div><div class="'+
t+'" style="display: none;">':""},n.prototype.spinner=function(){return function(
e){return e?id='id="'+e+'-spinner"':id="","<div "+id+' class="spinner"><span class="spin"></span></div>'
}},n.prototype.similar=function(e){return this.smart_type=="similar"?e:!1},n.prototype
.collection_show_users=function(){return this.mode.toLowerCase()=="feed"?"mixes_with_users"
:!1},n.prototype.tag_link=function(){var e=typeof this=="object"?this.name:this;return n
.prototype.tag(e,!1,!1,"tag",this.artist_avatar)},n.prototype.tag=function(e,n,r,
i,s,o,u){return'<a href="/explore/'+t.toUrlParam(e)+'" class="'+i+" "+(n?" active"
:"")+(r?" just_clicked":"")+'" title="'+e+'" '+(s?' style="background-color:'+s+"; color:"+
o+"; border-color: "+s+'"':"")+">"+(u?'<img src="'+u+'&w=64&h=64" class="avatar" />'
:"")+"<span>"+e+"</span>"+"</a>"},n.prototype.artist_link=function(e,n,r,i){return'<a href="/explore/'+
t.toUrlParam(e)+'" class="tag '+i+" "+(n?" active":"")+(r?" just_clicked":"")+'" title="'+
e+'"><span>'+e+"</span>"+"</a>"},n.prototype.tags_path=function(e,n,r,i){newtags=
_.collect(e,t.toUrlParam).join("+");var s="mixes";return typeof n=="undefined"&&(
n="",s="explore"),newtags.length>0?url="/"+s+"/"+newtags+"/"+n+"?page="+r:url="/"+
s+"/all/"+n+"?page="+r,i&&(url+="&q="+i),url},n.prototype.imgix_url=function(e,t)
{if(!t)return"";var n=e.split(/,\s*/),r=n[0],i=n[1],s,o,u,a;if(i){o=i.match(/w=(\d+)/i
)[1],u=i.match(/h=(\d+)/i)[1];if(window.dpr==2||window.dpr==3)o*=2,u*=2;var f=i.match
(/&blur=(\d+)/i);f&&(a=f[0])}if(t.cropped_imgix_url&&o)if(t.cropped_imgix_size<=o
)s=t.cropped_imgix_url;else{var l=0;while(l<IMGIX_PREFERRED_SIZES.length){if(IMGIX_PREFERRED_SIZES
[l]>=o||l==IMGIX_PREFERRED_SIZES.length-1){o=IMGIX_PREFERRED_SIZES[l];break}l+=1}
s=t.cropped_imgix_url+"&w="+o+"&h="+o}else t.original_imgix_url&&i?s=t.original_imgix_url+"&"+
i:t.original&&t.original.match("imgix")&&i?s=t.original+i:s=t[r];return a&&(s+=a)
,s.match(/images\.8tracks\.com/)&&(PAGE.cloudflare_request&&window.location.protocol=="https:"?
s=s.replace("http://images.8tracks.com","https://images.8tracks.com"):s=s.replace
("https://images.8tracks.com","https://d2ykdu8745rm9t.cloudfront.net")),s},n.prototype
.dpr=function(){if(window.dpr!==undefined&&window.dpr>1)return"@2x"},n.prototype.
to_url_param=function(){return function(e){return t.toUrlParam(this[e])}},n.prototype
.buy_link_class=function(){if(this.buy_link&&!!this.buy_link.match(/:\/\/.*\.bandcamp.com\//
))return"bandcamp_buy"},n.prototype.facebook_authorize_button=function(){return'<a href="/auth/facebook" class="facebook_connect_button facebook-signup" data-site="facebook" data-win-height="362" data-win-name="facebook" data-win-width="640" rel="popup" target="_blank" title="Connect with Facebook">  <span class="i-facebook icon"></span>  <span class="text">SIGN IN</span></a>'
},n.prototype.google_plus_authorize_button=function(){var e="profile email https://www.googleapis.com/auth/youtube.readonly"
;return'<div class="google-plus-container" id="gplus-button"> <span class="i-gplus icon"></span> <span class="text">SIGN IN</span></div>'
},e||(e=App.Trax),e.templateHelpers=new n({}),String.prototype.to_url_param=function(
){return t.toUrlParam(this)},String.prototype.blank=function(){return this.length===0
},String.prototype.capitalize=function(){return this[0].toUpperCase()+this.substr
(1)},String.fromCamelCase=function(){return this.match(/([A-Z]*[a-z0-9]+)/g).join
("_").toLowerCase()},Number.prototype.to_human_number=function(){return t.addCommas
(this)},Number.prototype.nonzero=function(){return this!==0},Number.prototype.hours_to_hours_and_minutes=
function(){var e=Math.round(this*4),t=Math.floor(e/4),n=e%4;return t>0&&n>0?t+"h "+
n*15+"m":t>0&&n==0?t+(t==1?" hour":"h"):t==0&&n>0?n*15+" min":"0 hours"},n}),define
("hgn!templates/suggested_users/suggested_user",["hogan"],function(e){function n(
){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this
;return r.b(n=n||""),r.b('<div class="user_about">'),r.b("\n"+n),r.b('  <div class="avatar">'
),r.b("\n"+n),r.b('    <a href="'),r.b(r.v(r.f("profile_path",e,t,0))),r.b('" class="avatar" rel="external">'
),r.b("\n"+n),r.b("      "),r.s(r.f("avatar_img",e,t,1),e,t,0,131,146,"{{ }}")&&(
r.rs(e,t,function(e,t,n){n.b("sq56, w=56&h=56")}),e.pop()),r.b("\n"+n),r.b("    </a>"
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="options">'
),r.b("\n"+n),r.b('    <a href="/users/'),r.b(r.v(r.f("id",e,t,0))),r.b('/toggle_follow" class="follow '
),r.b(r.v(r.f("activeClass",e,t,0))),r.b(" p p_not_owner "),r.b(r.v(r.f("onOffState"
,e,t,0))),r.b(' skip" title="Follow this DJ">'),r.b(r.v(r.f("followButtonText",e,
t,0))),r.b("</a>"),r.b("\n"+n),r.b("\n"+n),r.b("    <!-- hide button goes here -->"
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="profile-info">'
),r.b("\n"+n),r.b('      <a href="'),r.b(r.v(r.f("profile_path",e,t,0))),r.b('" class="propername" rel="external">'
),r.b(r.v(r.f("login",e,t,0))),r.b("</a> "),r.b("\n"+n),r.b("      "),r.s(r.f("mixes_count"
,e,t,1),e,t,0,539,631,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('<span class="gray medium">'
),n.b(n.v(n.f("mixes_count",e,t,0))),n.b(" mix"),n.s(n.f("multiple_mixes",e,t,1),
e,t,0,603,605,"{{ }}")&&(n.rs(e,t,function(e,t,n){n.b("es")}),e.pop()),n.b("</span>"
)}),e.pop()),r.b("\n"+n),r.b('    <p class="friends">'),r.b("\n"+n),r.b("      ")
,r.b(r.v(r.f("full_name",e,t,0))),r.b("\n"+n),r.b("    </p>"),r.b("\n"+n),r.b("  </div>"
),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define
("collections/suggested_users",["collections/_base_collection","models/modules/flexible_store"
,"models/suggested_user","models/modules/backbone_client_storage","lib/jsonh.jquery"
],function(e,t,n,r,i){if(typeof App.Collections.SuggestedUsers!="undefined")return App
.Collections.SuggestedUsers;var s=e.extend({model:n,url:"/suggested_friends.jsonh"
,parse:function(e,t){return e.suggested_friends},follow:function(e){this.callBackend
(e,"follow")},hide:function(e){this.callBackend(e,"hide")},callBackend:function(e
,t){this.remove(this.get(e)),i.now_with_context("/suggested_friends/"+e+"/"+t,{ids_to_exclude
:_.map(this.models,function(e){return e.id})},this,function(e){e.next_friend&&this
.loadOne(e.next_friend),t==="follow"&&this.trigger("suggested_users:follow"),this
.models.length===0&&this.trigger("empty")})}});return App.Collections.SuggestedUsers=new 
s({}),App.Collections.SuggestedUsers}),define("views/suggested_user_view",["global_trax"
,"views/trax_view","models/user","lib/_template_helpers","hgn!templates/suggested_users/suggested_user"
,"collections/suggested_users"],function(e,t,n,r,i,s){var o=t.extend({tagName:"div"
,className:"suggested-user clear",initialize:function(e){this.$el=$(this.el),this
.suggestedUser=e.suggestedUser,this.user=new n(this.suggestedUser.get("suggested_user"
)),_.bindAll(this,"onChange"),this.suggestedUser.bind("change",this.onChange),this
.user.bind("change",this.onChange)},events:{"click .follow":"follow"},render:function(
){var e=new r({id:this.user.id,email:this.user.get("email"),login:this.user.get("login"
),full_name:"",location:"",mixes_count:this.user.get("public_mixes_count"),multiple_mixes
:this.user.get("public_mixes_count")>1,profile_path:this.user.get("web_path"),avatar_path
:this.user.get("avatar_urls").sq56,twitter_username:this.user.get("twitter_username"
),lastfm_username:this.user.get("lastfm_username"),gp_friend:this.suggestedUser.get
("gp_friend"),fb_friend:this.suggestedUser.get("fb_friend"),avatar_urls:this.user
.get("avatar_urls")});return this.user.has("first_name")&&this.user.has("last_name"
)&&(e.full_name=this.user.get("first_name")+" "+this.user.get("last_name")),this.
user.has("neighborhood")&&(e.location+=this.user.get("neighborhood")),this.user.has
("city")&&(e.location.length>0&&(e.location+=", "),e.location+=this.user.get("city"
)),e.onOffState=this.user.get("fav_owner")?"off":"on",e.followButtonText=e.isFollowing?"Unfollow"
:"Follow",this.$el.html(i(e)),this},follow:function(){return $(this.el).slideUp()
,this.$(".user_about").fadeOut(),e.overlay_animation("follow"),s.follow(this.suggestedUser
.id),!1},onChange:function(e,t){}});return o}),define("hgn!templates/news_feed/_friends_finder"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b("<div>"),r.b("\n"+n
),r.b(r.rp("header_partial",e,t,"  ")),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b('<hr style="margin-top: -13px;" />'
),r.b("\n"+n),r.b("\n"+n),r.b('<div class="friends_container">'),r.b("\n"+n),r.b('  <div class="suggested_people">'
),r.b("\n"+n),r.b('    <p class="blank_state">'),r.b("\n"+n),r.b("      We couldn't find any more of your friends right now. <br />"
),r.b("\n"+n),r.b("      Please try another service."),r.b("\n"+n),r.b("    </p>"
),r.b("\n"+n),r.b("\n"+n),r.b('    <p class="error_state">'),r.b("\n"+n),r.b("      There is something wrong with your connection. <br />"
),r.b("\n"+n),r.b("      Please try connecting your account again."),r.b("\n"+n),
r.b("    </p>"),r.b("\n"+n),r.b('    <img src="/assets/spinner/spinner-large.gif" class="suggested_people_spinner" alt="loading">'
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"),r.fl()},"",e,{});return n
.template=t,n}),define("views/base_friends_finder_view",["views/trax_view","collections/suggested_social_users"
,"views/suggested_user_view","hgn!templates/news_feed/_friends_finder"],function(
e,t,n,r){var i=e.extend({events:{"click .show_services":"onShowServices"},initialize
:function(e){_.bindAll(this,"renderSuggestedUser","onCurrentUserSet","onShowServices"
,"onDoneLoading","onNotResponding"),this.parent=e.parent,this.partner=e.partner,this
.suggestedSocialUsers=new t(this.partner),this.suggestedUserViews=[],this.whenUserReadyOrChanged
(this.onCurrentUserSet),this.init()},startLoading:function(){this.suggestedSocialUsers
.reset(),this.listenTo(this.suggestedSocialUsers,"add",this.renderSuggestedUser),
this.listenTo(this.suggestedSocialUsers,"suggested_friends:done_loading",this.onDoneLoading
),this.listenTo(this.suggestedSocialUsers,"suggested_friends:not_responding",this
.onNotResponding),this.suggestedSocialUsers.loadFriends(this.partner)},render:function(
){$(".service_options").animate({"margin-top":0}),this.$el.html(r({},{header_partial
:this.headerPartial.template}))},renderSuggestedUser:function(e){var t=new n({suggestedUser
:e});this.suggestedUserViews[e.id]=t,this.$el.find(".suggested_people").prepend(t
.render().el)},onCurrentUserSet:function(e){e.hasConnected(this.partner)&&this.startLoading
(),this.render()},onDoneLoading:function(){this.$el.find(".suggested_people_spinner"
).hide(),this.hasSuggestions()||this.$el.find(".blank_state").show()},onNotResponding
:function(){this.$el.find(".suggested_people_spinner").hide(),this.hasSuggestions
()||this.$el.find(".error_state").show()},hasSuggestions:function(){return this.suggestedUserViews
.length>0},onShowServices:function(e){e.preventDefault(),this.parent.render(),this
.close()}});return i}),define("hgn!templates/news_feed/_facebook_header",["hogan"
],function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="find_friends_line facebook-line" data-partner="facebook">'
),r.b("\n"+n),r.b('  <span class="i-facebook icon suggested_facebook"></span>'),r
.b("\n"+n),r.b('  <span class="find_friends_text">'),r.b("\n"+n),r.b('    <h3 style="font-size:20px;">Facebook Friends</h3>'
),r.b("\n"+n),r.b("  </span>"),r.b("\n"+n),r.b('  <div class="clearfix"></div>'),
r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b("<p>Facebook friends you are not yet following on 8tracks.</p>"
),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define("views/facebook_friends_finder_view"
,["views/base_friends_finder_view","hgn!templates/news_feed/_facebook_header"],function(
e,t){var n=e.extend({init:function(){this.headerPartial=t}});return n}),define("hgn!templates/news_feed/_google_plus_header"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="find_friends_line google_plus-line" data-partner="google_plus">'
),r.b("\n"+n),r.b('  <span class="i-google-plus icon suggested_google_plus"></span>'
),r.b("\n"+n),r.b('  <span class="find_friends_text">'),r.b("\n"+n),r.b('    <h3 style="font-size:20px;">Google+ Friends</h3>'
),r.b("\n"+n),r.b("  </span>"),r.b("\n"+n),r.b('  <div class="clearfix"></div>'),
r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b("<p>Google+ friends you are not yet following on 8tracks.</p>"
),r.fl()},"",e,{});return n.template=t,n}),define("views/google_plus_friends_finder_view"
,["views/base_friends_finder_view","hgn!templates/news_feed/_google_plus_header"]
,function(e,t){var n=e.extend({init:function(){this.headerPartial=t}});return n})
,define("hgn!templates/news_feed/find_your_friends",["hogan"],function(e){function n
(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=
this;return r.b(n=n||""),r.b("<h2>Find friends</h2>"),r.b("\n"+n),r.b("\n"+n),r.b
("Connect your other accounts to find friends using 8tracks."),r.b("\n"+n),r.b("\n"+
n),r.b("<hr />"),r.b("\n"+n),r.b("\n"+n),r.b('<div class="service_options">'),r.b
("\n"+n),r.b('  <div class="find_friends_line facebook-line" data-partner="facebook">'
),r.b("\n"+n),r.b('    <span class="i-facebook icon suggested_facebook"></span>')
,r.b("\n"+n),r.b('    <span class="find_friends_text">'),r.b("\n"+n),r.b('      <a href="#" class="find_friends"><strong>Facebook Friends</strong></a>'
),r.b("\n"+n),r.b("    </span>"),r.b("\n"+n),r.b('    <div class="clearfix"></div>'
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div id="google_plus_find_friends" class="find_friends_line google_plus-line" data-partner="google_plus">'
),r.b("\n"+n),r.b('    <span class="i-google-plus icon suggested_google_plus"></span>'
),r.b("\n"+n),r.b('    <span class="find_friends_text">'),r.b("\n"+n),r.b('      <a href="#" class="find_friends"><strong>Google+ Circles</strong></a>'
),r.b("\n"+n),r.b("    </span>"),r.b("\n"+n),r.b('    <div class="clearfix"></div>'
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r
.b("\n"+n),r.b('<div class="friends_container"> '),r.b("\n"+n),r.b("</div>"),r.b("\n"
),r.fl()},"",e,{});return n.template=t,n}),define("views/find_friends_view",["views/trax_view"
,"views/facebook_friends_finder_view","views/google_plus_friends_finder_view","hgn!templates/news_feed/find_your_friends"
,"lib/sessions","views/google_plus_view"],function(e,t,n,r,i,s){var o=e.extend({id
:"find_friends",tagName:"div",events:{"click .find_friends_line":"findFriendsForService"
},friend_finders:{facebook:t,google_plus:n},initialize:function(){_.bindAll(this,"onCurrentUserSet"
),this.childViews=[],this.whenUserReadyOrChanged(this.onCurrentUserSet),this.googlePlusView=new 
s,this.childViews.push(this.googlePlusView)},render:function(){return this.$el.html
(r()),this.delegateEvents(),this},show:function(){$.facebox(this.el),this.googlePlusView
.asyncGooglePlus("google_plus_find_friends")},findFriendsForService:function(e){var t=
$(e.currentTarget),n=t.data("partner");this.currentPartner=n,this.promptLogin(n)}
,showPartnerView:function(e){var t=this.friend_finders[e],n=e+"FriendsFinderView"
,r=this[n],i=this[n]=new t({parent:this,partner:e});r||this.childViews.push(i),this
.$el.html(i.$el),this.undelegateEvents()},promptLogin:function(e){this.currentPartner=
e,e=="facebook"&&window.open("/auth/facebook","facebook","height=362,width=640")}
,onCurrentUserSet:function(e){this.user=e;var t=this;this.listenTo(i,"jsonh:current_user:set_from_backend"
,function(e){t.showPartnerView(t.currentPartner||"google_plus"),t.currentPartner=
null,t.stopListening(i)})},onClose:function(){this.$el.html("")}});return o}),define
("hgn!templates/shared/_auth_nav_logged_in",["hogan"],function(e){function n(){return t
.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r
.b(n=n||""),r.b('<a href="#" class="nav_item toggleDropdown bullets" id="menu_link" data-dropdown-id="footer"><span class="bullet">•••</span></a>'
),r.b("\n"+n),r.b("\n"+n),r.b('<div id="logged_in_topnav">'),r.b("\n"+n),r.b('  <div id="topnav_element">'
),r.b("\n"+n),r.b('    <a href="#" data-dropdown-id="logged_in_dropdown" data-href="'
),r.s(r.f("web_path",e,t,1),e,t,0,264,276,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b
(n.v(n.f("web_path",e,t,0)))}),e.pop()),r.s(r.f("web_path",e,t,1),e,t,1,0,0,"")||
r.b(r.v(r.f("path",e,t,0))),r.b('" class="toggleDropdown nav_item" id="profile_link" rel="user">'
),r.b("\n"+n),r.b('      <img alt="'),r.b(r.v(r.f("login",e,t,0))),r.b('" class="avatar sq56" src="'
),r.s(r.f("avatar_url",e,t,1),e,t,0,454,469,"{{ }}")&&(r.rs(e,t,function(e,t,n){n
.b("sq56, w=56&h=56")}),e.pop()),r.b('" title="Go to '),r.b(r.v(r.f("login",e,t,0
))),r.b("'s profile\" />"),r.b("\n"+n),r.b("    </a>"),r.b("\n"+n),r.b('    <span id="unread_notifications" class="unread_notifications notifications_counter '
),r.s(r.d("unread_notifications_count.nonzero",e,t,1),e,t,0,657,663,"{{ }}")&&(r.
rs(e,t,function(e,t,n){n.b("active")}),e.pop()),r.b('">'),r.b(r.v(r.f("unread_notifications_count"
,e,t,0))),r.b("</span>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div id="logged_in_dropdown" class="dropdown">'
),r.b("\n"+n),r.b('    <a class="menu-item profile_link" href="'),r.s(r.f("web_path"
,e,t,1),e,t,0,858,870,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(n.v(n.f("web_path",
e,t,0)))}),e.pop()),r.s(r.f("web_path",e,t,1),e,t,1,0,0,"")||r.b(r.v(r.f("path",e
,t,0))),r.b('">'),r.b("\n"+n),r.b('      <span class="i-profile"></span>'),r.b("\n"+
n),r.b("      Profile"),r.b("\n"+n),r.b("    </a>"),r.b("\n"+n),r.b("\n"+n),r.b('    <div class="'
),r.s(r.f("has_recent_mixes",e,t,1),e,t,0,1019,1029,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b("create-mix")}),e.pop()),r.b('">'),r.b("\n"+n),r.b('      <a class="menu-item create_mix_link" href="/create_mix">'
),r.b("\n"+n),r.b('      <span class="i-plus"></span>  Create playlist</a>'),r.b("\n"+
n),r.b("\n"+n),r.s(r.f("has_recent_mixes",e,t,1),e,t,0,1200,1709,"{{ }}")&&(r.rs(
e,t,function(e,t,r){r.b('      <div class="recent-mixes dropdown">'),r.b("\n"+n),
r.b('        <a class="new-playlist item menu-item" href="/create_mix">New playlist</a>'
),r.b("\n"+n),r.b("        "),r.s(r.f("spinner",e,t,1),e,t,0,1346,1358,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("recent-mixes")}),e.pop()),r.b("\n"+n),r.b('        <div class="recent-mixes-body">'
),r.b("\n"+n),r.b('          <div class="continue-editing item">Continue editing...</div>'
),r.b("\n"+n),r.b('          <div class="recent-mixes-list">'),r.b("\n"+n),r.b(r.
rp("recent_mixes",e,t,"            ")),r.b("          </div>"),r.b("\n"+n),r.b('          <!--div class="item"><a href="'
),r.b(r.v(r.f("web_path",e,t,0))),r.b('" class="view-all item">View all &rarr;</a></div-->'
),r.b("\n"+n),r.b("        </div>"),r.b("\n"+n),r.b("      </div>"),r.b("\n")}),e
.pop()),r.b("    </div>"),r.b("\n"+n),r.b("\n"+n),r.s(r.f("has_recent_mixes",e,t,1
),e,t,0,1768,1967,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('      <a class="menu-item" href="'
),r.s(r.f("web_path",e,t,1),e,t,0,1815,1833,"{{ }}")&&(r.rs(e,t,function(e,t,n){n
.b("/users"),n.b(n.v(n.f("web_path",e,t,0)))}),e.pop()),r.s(r.f("web_path",e,t,1)
,e,t,1,0,0,"")||r.b(r.v(r.f("path",e,t,0))),r.b('/comments">'),r.b("\n"+n),r.b('        <span class="i-annotation"></span>'
),r.b("\n"+n),r.b("        Comments"),r.b("\n"+n),r.b("      </a>"),r.b("\n")}),e
.pop()),r.b("\n"+n),r.b('    <a class="menu-item unread_notifications_link" href="/notifications">'
),r.b("\n"+n),r.b('      <span class="i-notifications"></span>'),r.b("\n"+n),r.b('      <span class="inverted_counter unread_notifications">'
),r.b(r.v(r.f("unread_notifications_count",e,t,0))),r.b("</span>"),r.b("\n"+n),r.
b("      Notifications"),r.b("\n"+n),r.b("    </a>"),r.b("\n"+n),r.b("\n"+n),r.b('    <a class="menu-item settings_link" href="'
),r.s(r.f("web_path",e,t,1),e,t,0,2292,2310,"{{ }}")&&(r.rs(e,t,function(e,t,n){n
.b("/users"),n.b(n.v(n.f("web_path",e,t,0)))}),e.pop()),r.s(r.f("web_path",e,t,1)
,e,t,1,0,0,"")||(r.b("/users"),r.b(r.v(r.f("path",e,t,0)))),r.b('/edit">'),r.b("\n"+
n),r.b('      <span class="i-settings"></span>'),r.b("\n"+n),r.b("      Settings"
),r.b("\n"+n),r.b("    </a>"),r.b("\n"+n),r.b("\n"+n),r.b("    "),r.s(r.f("admin"
,e,t,1),e,t,0,2449,2553,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('<a class="menu-item" href="#" onclick="App.views.appView.loadOnboarding(); return false;">Onboarding</a>'
)}),e.pop()),r.b("\n"+n),r.b("\n"+n),r.b("    <hr />"),r.b("\n"+n),r.b("\n"+n),r.
b('    <!--a class="menu-item logout_link" href="/logout" id="logout_link">'),r.b
("\n"+n),r.b('      <span class="i-x"></span>'),r.b("\n"+n),r.b("      Log out"),
r.b("\n"+n),r.b("    </a-->"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("subscribed",e,t,1),e,t,1,0,0,"")||(r.b('  <a href="/plus" target="_blank" class="button_gradient flatbutton hidden-sm hidden-xs nav_item upgrade_button upgrade"><strong>Upgrade</strong></a>'
),r.b("\n")),r.s(r.f("subscribed",e,t,1),e,t,0,2921,3042,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b('  <a href="/create_mix" target="_blank" class="button_blue flatbutton hidden-sm hidden-xs nav_item"><strong>New mix</a>'
),n.b("\n")}),e.pop()),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/shared/_auth_nav_logged_out"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<a href="#" class="nav_item bullets toggleDropdown" id="menu_link" data-dropdown-id="footer"><span class="bullet">•••</span></a>'
),r.b("\n"+n),r.b('<a href="'),r.b(r.v(r.f("ssl_host_url",e,t,0))),r.b('/signup" class="hidden-xs signup nav_item button_blue flatbutton" id="signup_link">Sign up</a>'
),r.b("\n"+n),r.b('<a href="'),r.b(r.v(r.f("ssl_host_url",e,t,0))),r.b('/login" class="hidden-xs hidden-sm login nav_item">Log in</a>'
),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/shared/auth_nav_recent_mixes"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("recent_mixes",
e,t,1),e,t,0,17,266,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('    <a href="'),r.b(
r.v(r.f("url",e,t,0))),r.b('" class="mix menu-item">'),r.b("\n"+n),r.b('      <img src="'
),r.b(r.v(r.f("cover_url",e,t,0))),r.b('" height="28" width="28">'),r.b("\n"+n),r
.b('      <span class="title">'),r.b(r.v(r.f("name",e,t,0))),r.b("</span>"),r.b("\n"+
n),r.b('      <span class="detail">'),r.b(r.v(r.f("tracks_count",e,t,0))),r.b(" tracks</span>"
),r.b("\n"+n),r.b('      <div style="clear: both;"></div>'),r.b("\n"+n),r.b("    </a>"
),r.b("\n")}),e.pop()),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/shared/_sale_header"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div id="sale_header" class="clearfix">'
),r.b("\n"+n),r.b(' <div id="sale_header_gradient" class="clearfix">'),r.b("\n"+n
),r.b('  <div class="container">'),r.b("\n"+n),r.b('    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-8" id="sale_message">'
),r.b("\n"+n),r.b('      <a class="hidesale" href="#" onclick="hidesale(); return false;"><span class="i-x"></span></a> '
),r.b("\n"+n),r.b("\n"+n),r.b("      "),r.b(r.t(r.f("hed",e,t,0))),r.b("\n"+n),r.
b("      "),r.b(r.t(r.f("msg",e,t,0))),r.b("\n"+n),r.b("\n"+n),r.b("      </p>"),
r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b('    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-4" id="sale_cta">'
),r.b("\n"+n),r.b('      <!--img src="/images/logo/payment_methods.png" width="150" height="22"/> &nbsp;-->'
),r.b("\n"+n),r.b('      <a href="'),r.b(r.v(r.f("url",e,t,0))),r.b('" class="flatbutton '
),r.b(r.v(r.f("button_class",e,t,0))),r.b('" target="_blank">'),r.b("\n"+n),r.b("        "
),r.b(r.t(r.f("cta",e,t,0))),r.b("\n"+n),r.b("      </a>"),r.b("\n"+n),r.b("    </div>"
),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b(" </div>"),r.b("\n"+n),r.b("\n"+n),
r.b(" <style>"),r.b("\n"+n),r.b("  #sale_header{"),r.b("\n"+n),r.b("    padding: 15px 0;"
),r.b("\n"+n),r.b("    /*position: fixed;"),r.b("\n"+n),r.b("    bottom: 0;"),r.b
("\n"+n),r.b("    left: 0;"),r.b("\n"+n),r.b("    */"),r.b("\n"+n),r.b("    position: relative;"
),r.b("\n"+n),r.b("    width: 100%;"),r.b("\n"+n),r.b("    color: #eee;"),r.b("\n"+
n),r.b("    z-index: 100;"),r.b("\n"+n),r.b("    background: "),r.b(r.v(r.f("color"
,e,t,0))),r.b("; /* Old browsers */"),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b("\n"+
n),r.b("  #sale_header strong{"),r.b("\n"+n),r.b("    color: #fff;"),r.b("\n"+n),
r.b("  }"),r.b("\n"+n),r.b("\n"+n),r.b("  #sale_header a{"),r.b("\n"+n),r.b("    color: #fff;"
),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b("  "),r.b("\n"+n),r.b("  #sale_header a:hover{"
),r.b("\n"+n),r.b("    color: #eee;"),r.b("\n"+n),r.b("    text-decoration: none;"
),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b("\n"+n),r.b("  #sale_message{"),r.b("\n"+
n),r.b("    padding: 10px 0 0 5px;"),r.b("\n"+n),r.b("    font-size: 17px;"),r.b("\n"+
n),r.b("    line-height: 20px;"),r.b("\n"+n),r.b("    text-align: right;"),r.b("\n"+
n),r.b("  }"),r.b("\n"+n),r.b("\n"+n),r.b("  #sale_header img{"),r.b("\n"+n),r.b("    vertical-align: middle;"
),r.b("\n"+n),r.b("    margin: 10px 0;"),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b("\n"+
n),r.b("  #sale_header a.hidesale{"),r.b("\n"+n),r.b("    color: #666; "),r.b("\n"+
n),r.b("    background-color: #fff; "),r.b("\n"+n),r.b("    border-radius: 50%; "
),r.b("\n"+n),r.b("    width: 22px; height: 22px; "),r.b("\n"+n),r.b("    text-align: center; "
),r.b("\n"+n),r.b("    position: absolute; "),r.b("\n"+n),r.b("    left: -25px; "
),r.b("\n"+n),r.b("    font-size: 14px; "),r.b("\n"+n),r.b("    line-height: 25px;"
),r.b("\n"+n),r.b("    text-indent: 1px;"),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b
("\n"+n),r.b("  #sale_header .flatbutton{"),r.b("\n"+n),r.b("    font-weight: bold;"
),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b("\n"+n),r.b("\n"+n),r.b(" </style>"),r.b
("\n"+n),r.b("\n"+n),r.b(" <style>"),r.b("\n"+n),r.b("  @media(max-width: 1279px) {"
),r.b("\n"+n),r.b("    #sale_message, #sale_cta{"),r.b("\n"+n),r.b("      text-align: center;"
),r.b("\n"+n),r.b("      padding: 8px 25px;"),r.b("\n"+n),r.b("    }"),r.b("\n"+n
),r.b("    #sale_header a.hidesale{"),r.b("\n"+n),r.b("      left: 0;"),r.b("\n"+
n),r.b("    }"),r.b("\n"+n),r.b("  }"),r.b("\n"+n),r.b(" </style>"),r.b("\n"+n),r
.b("\n"+n),r.b("</div> "),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/collections/add_to_collection"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="box_header">'
),r.b("\n"+n),r.b('	<a class="shareClose" href="#" title="Close menu" rel="local"><span class="i-close"></span></a>'
),r.b("\n"+n),r.b('	<span class="collecticon collection"></span><strong>Add <em>'
),r.b(r.v(r.f("name",e,t,0))),r.b("</em> to a collection</strong>"),r.b("\n"+n),r
.b('	<div id="collections-spinner" class="spin"><span style="display: none;"></span></div>'
),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b('<ul id="my_collections">'
),r.b("\n"+n),r.b('    <li><br /><div style="margin: 0 auto;" class="large-spinner" id="my-collections-spinner"></div><br /></li>'
),r.b("\n"+n),r.b("</ul>"),r.b("\n"+n),r.b("\n"+n),r.b('<form action="/collections" method="POST" id="create_collection">'
),r.b("\n"+n),r.b('	<input type="text" id="new_collection_name" name="collection[name]" value="" placeholder="New collection" class="roundText" tabindex="10" />'
),r.b("\n"+n),r.b('  <input type="hidden" name="mix_id" value="'),r.b(r.v(r.f("id"
,e,t,0))),r.b('" />'),r.b("\n"+n),r.b('	<input type="submit" class="disabled turquoise_button flatbutton submit" value="Create" id="create_collection_button" tabindex="12" />'
),r.b("\n"+n),r.b('  <textarea name="collection[description]" id="new_collection_description" placeholder="Describe your collection (optional)" class="roundText" style="display: none;" tabindex="11"></textarea>'
),r.b("\n"+n),r.b("  "),r.b("\n"+n),r.b("</form>"),r.b("\n"),r.fl()},"",e,{});return n
.template=t,n}),define("hgn!templates/collections/my_collections",["hogan"],function(
e){function n(){return t.render.apply(t,arguments)}var t=new e.Template(function(
e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("collections",e,t,1),e,t,0,16,665,"{{ }}"
)&&(r.rs(e,t,function(e,t,r){r.b("  <li>"),r.b("\n"+n),r.b('		<div data-id="'),r.
b(r.v(r.f("id",e,t,0))),r.b('" class="my_collection '),r.s(r.f("contains_mix",e,t
,1),e,t,0,86,98,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("contains_mix")}),e.pop()
),r.b('">'),r.b("\n"+n),r.b('			<a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b('" class="view_link" target="_blank">View</a>'
),r.b("\n"+n),r.b('			<span class="status_icon">'),r.b("\n"+n),r.b('				<span class="i-plus"></span>'
),r.b("\n"+n),r.b('				<span class="i-checkmark"></span>'),r.b("\n"+n),r.b('				<span class="i-x"></span>'
),r.b("\n"+n),r.b("			</span>"),r.b("\n"+n),r.b("			"),r.s(r.f("show_slug",e,t,1)
,e,t,1,0,0,"")||r.b(r.v(r.f("name",e,t,0))),r.b("\n"+n),r.b("			"),r.s(r.f("show_slug"
,e,t,1),e,t,0,386,394,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(n.v(n.f("slug",e,t,0
)))}),e.pop()),r.b("\n"+n),r.b('			<span class="mixes_count gray">'),r.b("\n"+n),
r.s(r.f("queue_message",e,t,1),e,t,0,466,496,"{{ }}")&&(r.rs(e,t,function(e,t,n){
n.b("					"),n.b(n.t(n.f("queue_message",e,t,0))),n.b("\n")}),e.pop()),r.s(r.f("queue_message"
,e,t,1),e,t,1,0,0,"")||(r.b("					("),r.b(r.v(r.f("mixes_count",e,t,0))),r.b(" ")
,r.s(r.f("pluralize",e,t,1),e,t,0,569,599,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b
("mixes_count playlist playlists")}),e.pop()),r.b(")"),r.b("\n")),r.b("			</span>"
),r.b("\n"+n),r.b("		</div>"),r.b("\n"+n),r.b("	</li>"),r.b("\n")}),e.pop()),r.b("\n"
),r.fl()},"",e,{});return n.template=t,n}),define("views/add_to_collection_view",
["global_trax","views/trax_view","lib/jsonh.jquery","lib/_template_helpers","lib/events"
,"hgn!templates/collections/add_to_collection","hgn!templates/collections/my_collections"
],function(e,t,n,r,i,s,o){var u=t.extend({className:"add_to_collections",collections
:null,closeTimer:null,events:{"click .my_collection":"onCollectionClick","submit #create_collection"
:"createCollection","keyup #new_collection_name":"onNameEnter"},initialize:function(
e){_.bindAll(this,"render","cancelClose","close","closeStillLater"),this.mix=e.mix
,this.mix.attributes&&(this.mix=this.mix.toJSON())},loadCollections:function(){n.
now("/users/"+e.currentUser.id+"/editable_collections",{mix_id:this.mix.id},_.bind
(function(e){for(var t=e.collections.length-1;t>=0;t--)e.collections[t].id=e.collections
[t].id;this.collections=new Backbone.Collection(e.collections);var n=this.collections
.where({slug:"listen-later",mixes_count:0});n.length&&n[0].set({queue_message:"(save to dashboard)"
}),this.renderMixSets()},this),{spinner:this.$("#my-collections-spinner")})},render
:function(){return this.$el.html(s(this.mix)).show(),this.collections?this.renderMixSets
():this.loadCollections(),this.el},showInFacebox:function(){$.facebox(this.$el),this
.faceboxed=!0,this.render()},renderMixSets:function(){var t=new r({collections:this
.collections.toJSON()});e.currentUser.get("admin")&&(t.show_slug=this.show_slug),
this.$("#my_collections").html(o(t)).show()},show_slug:function(){return this.smart_id=="collection:featured"||
this.smart_id=="collection:homepage"},onCollectionClick:function(e){if($(e.target
).hasClass("view_link"))return!0;this.cancelClose();var t=$(e.currentTarget),r=t.
data("id"),s={collection_mix:{collection_id:r,mix_id:this.mix.id}},o,u,a=this.collections
.get(r).get("mixes_count");return t.hasClass("contains_mix")?(o="DELETE",u="/collections_mixes/destroy"
,a+=-1):(o="POST",u="/collections_mixes",a+=1),t.toggleClass("contains_mix"),t.addClass
("just_clicked").hover(function(){},function(){t.removeClass("just_clicked")}),t.
find(".mixes_count").html("("+a+(a==1?" mix":" mixes")+")"),n.now(u,s,_.bind(function(
e){e.status==200&&(this.collections.get(e.collection.id).set({mixes_count:e.collection
.mixes_count}),i.addMixToCollection(this.mix)),this.faceboxed&&this.closeLater()}
,this),{spinner:!1,type:o}),this.updateCurrentUser(),!1},createCollection:function(
e){return this.$("#new_collection_name").val().length>0&&(this.cancelClose(),this
.$("#create_collection_button").hide(),this.$("#create_collection").jsonh_now(_.bind
(function(e){this.collections.add(e.collection),this.render(),this.$("#my_collections"
).scrollTop(5e3),i.createCollection(this.mix),i.addMixToCollection(this.mix),App.
views.tocView&&App.views.tocView.reload()},this),{spinner:this.$("#collections-spinner"
)})),this.closeLater(),this.updateCurrentUser(),!1},onNameEnter:function(e){this.
cancelClose(),$(e.target).val().length>0?(this.$("#create_collection_button").removeClass
("disabled"),this.$("#new_collection_description").slideDown()):this.$("#create_collection_button"
).addClass("disabled")},closeLater:function(){$(document).bind("close.facebox",this
.closeStillLater),this.closeTimer=setTimeout(function(){$.facebox.close()},2500)}
,closeStillLater:function(){setTimeout(this.close,2e3)},cancelClose:function(){clearTimeout
(this.closeTimer)},updateCurrentUser:function(){e.currentUser.set("uses_collections"
,!0),e.currentUser.localSave()},onClose:function(){this.cancelClose(),$(document)
.unbind("close.facebox",this.close)}});return u}),define("lib/link_helper",["global_trax"
,"lib/sessions","lib/events","views/add_to_collection_view","lib/jsonh.jquery"],function(
e,t,n,r,i){var s={},o;return s.follow_link_click=function(r){function u(){$link.addClass
("active").removeClass("inactive").html('<span class="out">Following</span><span class="in">Unfollow</span>'
),$link.siblings(".follow_counter").addClass("active").removeClass("inactive"),$link
.attr("href",$link.attr("href").replace(/follow|toggle_follow/,"unfollow"))}function a
(){$link.removeClass("active").addClass("inactive").html("Follow"),$link.siblings
(".follow_counter").removeClass("active").addClass("inactive"),$link.attr("href",
$link.attr("href").replace(/unfollow|toggle_follow/,"follow"))}function f(){$link
.hasClass("active")?a():u()}$link=$(r.currentTarget),t.loggedIn()?(s.toggle_link(
$link),$link.hasClass("active")?($link.html('<span class="out">Following</span><span class="in">Unfollow</span>'
),n.followUser()):$link.html("Follow"),$link.hasClass("collapse_user")&&$link.closest
(".user_about").slideUp(250)):e.showSignupView();var i=Math.random();o=i;var l=$('meta[name="8tnonce"]'
).attr("content");$link.jsonh_now(function(t){i==o&&t.success&&t.user?t.user.followed_by_current_user?
u():a():t.success?s.refresh_nonce(s.follow_link_click,[r]):(f(),e.update_flash(t)
)},{data:{nonce:l}}),e.refreshSidebarAd()},s.toggle_link=function(e){return e.toggleClass
("active"),e.toggleClass("inactive"),e.addClass("just_clicked"),e.hover(function(
){},function(){e.removeClass("just_clicked")}),!0},s.quick_add_click=function(e){
var t=$(e.currentTarget).data("mix_id"),i=$(e.currentTarget).data("mix_name");App
.views.addToCollectionView=new r({mix:{id:t,name:i}}),App.views.addToCollectionView
.showInFacebox(),n.clickAddToCollection()},s.quick_remove_click=function(e){var t=
$(e.currentTarget).data("mix-id"),r=$(e.currentTarget).data("smart-id"),s=$.Deferred
();return i.now("/mix_sets/"+r+"/hide_mix",{mix_id:t},s.resolve,{type:"POST"}),n.
clickRemoveMixFromHistory(),s},s.clear_collection_click=function(e){var t=$(e.currentTarget
).attr("href"),r=$.Deferred();return confirm("Are you sure you want to remove all the mixes from this collection?"
)&&(i.now(t,{},r.resolve,{type:"DELETE"}),n.clickClearCollection()),r},s.upgrade_link_click=
function(e,t){App.views.appView.loadSubscriptionView(e.currentTarget.href||"/plus"
),ga("ec:addProduct",{id:"8tracks_plus",name:"8tracks plus"}),ga("ec:setAction","click"
,{list:t||"Upgrade button"}),ga("send","event","UX","click","Upgrade",{hitCallback
:function(){}}),TraxEvents.track("subscribe button cta",{event_type:"click",page_type
:App.currentPage})},s.refresh_nonce=function(e,t){i.now("/users/new_token.jsonh",
function(n){$('meta[name="8tnonce"]').attr("content",n.nonce),e.apply(this,t)})},
s}),define("jquery.hoverDelegate",[],function(){return $.fn.hoverDelegate=function(
e,t,n,r,i){_.isUndefined(r)&&(r=100),_.isUndefined(i)&&(i=100),this.delegate(e,"mouseover mouseout"
,function(e){var s=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget
;while(s&&s!=this)try{s=s.parentNode}catch(e){s=this}if(s==this)return!1;var o=this
;typeof o.hoverDelegateState=="undefined"&&(o.hoverDelegateState=0,o.hoverDelegateOver=
_.bind(t,this),o.hoverDelegateOut=_.bind(n,this)),e.type=="mouseover"?o.hoverDelegateState===0?
o.hoverDelegateTimer=setTimeout(function(){o.hoverDelegateState=1,o.hoverDelegateOver
()},r):clearTimeout(o.hoverDelegateTimer):o.hoverDelegateState===1?o.hoverDelegateTimer=
setTimeout(function(){o.hoverDelegateState=0,o.hoverDelegateOut()},i):clearTimeout
(o.hoverDelegateTimer)})},$}),define("hgn!templates/shared/autocomplete",["hogan"
],function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("results",e,t,1),e,t,0,12
,354,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('  <li class="result '),r.b(r.v(r.f("type"
,e,t,0))),r.b('" data-href="/explore/'),r.s(r.f("to_url_param",e,t,1),e,t,0,80,84
,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("term")}),e.pop()),r.b('" data-tag="'),r
.b(r.v(r.f("term",e,t,0))),r.b('">'),r.b("\n"+n),r.b("    "),r.s(r.f("selected_tags"
,e,t,1),e,t,0,146,201,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('<span class="tag">'
),n.b(n.v(n.d(".",e,t,0))),n.b("</span>&nbsp;&nbsp;+&nbsp;&nbsp;")}),e.pop()),r.b
(" "),r.b("\n"+n),r.b('    <span class="tag">'),r.b(r.v(r.f("term",e,t,0))),r.b("</span>"
),r.b("\n"+n),r.b("    "),r.s(r.f("count",e,t,1),e,t,0,273,335,"{{ }}")&&(r.rs(e,
t,function(e,t,n){n.b('<span class="count">'),n.b(n.v(n.d("count.to_human_number"
,e,t,0))),n.b(" playlists</span>")}),e.pop()),r.b("\n"+n),r.b("  </li>"),r.b("\n"
)}),e.pop()),r.b("\n"+n),r.b("\n"+n),r.s(r.d("mtags.length.nonzero",e,t,1),e,t,0,394
,431,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('  <li class="header skip">Tags</li>'
),n.b("\n")}),e.pop()),r.s(r.f("mtags",e,t,1),e,t,0,467,640,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('  <li class="result mtag" data-href="'),r.b(r.v(r.f("path",e,t,0))),r
.b('">'),r.b("\n"+n),r.b('    <span class="tag">'),r.b(r.v(r.d("data.tag1",e,t,0)
)),r.b("</span>"),r.b("\n"+n),r.b("    "),r.s(r.d("data.tag2",e,t,1),e,t,0,577,617
,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('+ <span class="tag">'),n.b(n.v(n.d("data.tag2"
,e,t,0))),n.b("</span>")}),e.pop()),r.b("\n"+n),r.b("  </li>"),r.b("\n")}),e.pop(
)),r.b("\n"+n),r.s(r.d("tags.length.nonzero",e,t,1),e,t,0,676,713,"{{ }}")&&(r.rs
(e,t,function(e,t,n){n.b('  <li class="header skip">Tags</li>'),n.b("\n")}),e.pop
()),r.s(r.f("tags",e,t,1),e,t,0,747,949,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('  <li class="result mtag" data-href="'
),r.b(r.v(r.f("path",e,t,0))),r.b('" data-tag="'),r.b(r.v(r.f("name",e,t,0))),r.b
('">'),r.b("\n"+n),r.b('    <span class="tag">'),r.b(r.v(r.f("name",e,t,0))),r.b("</span>"
),r.b("\n"+n),r.b("    "),r.s(r.f("count",e,t,1),e,t,0,868,930,"{{ }}")&&(r.rs(e,
t,function(e,t,n){n.b('<span class="count">'),n.b(n.v(n.d("count.to_human_number"
,e,t,0))),n.b(" playlists</span>")}),e.pop()),r.b("\n"+n),r.b("  </li>"),r.b("\n"
)}),e.pop()),r.b("\n"+n),r.s(r.d("artists.length.nonzero",e,t,1),e,t,0,987,1027,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b('  <li class="header skip">Artists</li>'),n.b("\n"
)}),e.pop()),r.s(r.f("artists",e,t,1),e,t,0,1067,1459,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('  <li class="result artist" data-href="'),r.b(r.v(r.f("path",e,t,0)))
,r.b('" data-name="'),r.b(r.v(r.f("name",e,t,0))),r.b('" data-id="'),r.b(r.v(r.f("id"
,e,t,0))),r.b('">'),r.b("\n"+n),r.b('  <div class="thumb_container">'),r.b("\n"+n
),r.b("    <img"),r.b("\n"+n),r.s(r.d("data.artist_image_url",e,t,1),e,t,0,1227,1268
,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('    src="'),n.b(n.v(n.d("data.artist_image_url"
,e,t,0))),n.b('"'),n.b("\n")}),e.pop()),r.s(r.d("data.artist_image_url",e,t,1),e,
t,1,0,0,"")||(r.b('    src="'),r.b(r.v(r.d("data.original_imgix_url",e,t,0))),r.b
('"'),r.b("\n")),r.b('    class="thumb">'),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n
),r.b("  <strong>"),r.b(r.v(r.f("name",e,t,0))),r.b("</strong>"),r.b("\n"+n),r.b("  </li>"
),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("\n"+n),r.s(r.d("users.length.nonzero",e,t
,1),e,t,0,1499,1537,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('  <li class="header skip">Users</li>'
),n.b("\n")}),e.pop()),r.s(r.f("users",e,t,1),e,t,0,1573,1866,"{{ }}")&&(r.rs(e,t
,function(e,t,r){r.b('  <li class="result user" data-href="'),r.b(r.v(r.f("path",
e,t,0))),r.b('" data-id="'),r.b(r.v(r.f("id",e,t,0))),r.b('" data-name="'),r.b(r.
v(r.f("name",e,t,0))),r.b('" data-email="'),r.b(r.v(r.d("data.email",e,t,0))),r.b
('">'),r.b("\n"+n),r.b('    <span class="user">'),r.b("\n"+n),r.b('      <div class="thumb_container">'
),r.b("\n"+n),r.b('        <img src="'),r.b(r.v(r.d("data.image_url",e,t,0))),r.b
('" class="thumb">'),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("      <strong>"
),r.b(r.v(r.f("name",e,t,0))),r.b("</strong>"),r.b("\n"+n),r.b("    </span>"),r.b
("\n"+n),r.b("  </li>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.d("mixes.length.nonzero"
,e,t,1),e,t,0,1903,1945,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('  <li class="header skip">Playlists</li>'
),n.b("\n")}),e.pop()),r.s(r.f("mixes",e,t,1),e,t,0,1981,2360,"{{ }}")&&(r.rs(e,t
,function(e,t,r){r.b('  <li class="result mix" data-href="'),r.b(r.v(r.f("web_path"
,e,t,0))),r.b('">'),r.b("\n"+n),r.b('    <div class="thumb_container">'),r.b("\n"+
n),r.s(r.d("data.image_url",e,t,1),e,t,0,2092,2152,"{{ }}")&&(r.rs(e,t,function(e
,t,n){n.b('        <img src="'),n.b(n.v(n.d("data.image_url",e,t,0))),n.b('" class="thumb">'
),n.b("\n")}),e.pop()),r.s(r.d("cover_urls.sq56",e,t,1),e,t,0,2198,2259,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b('        <img src="'),n.b(n.v(n.d("cover_urls.sq56"
,e,t,0))),n.b('" class="thumb">'),n.b("\n")}),e.pop()),r.b("    </div>"),r.b("\n"+
n),r.b("    <strong>"),r.b(r.v(r.f("name",e,t,0))),r.b("</strong> <br />"),r.b("\n"+
n),r.b("    "),r.b(r.v(r.d("data.user_login",e,t,0))),r.b("\n"+n),r.b("  </li>"),
r.b("\n")}),e.pop()),r.b("\n"+n),r.b("\n"+n),r.s(r.d("collections.length.nonzero"
,e,t,1),e,t,0,2404,2448,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('  <li class="header skip">Collections</li>'
),n.b("\n")}),e.pop()),r.s(r.f("collections",e,t,1),e,t,0,2496,2725,"{{ }}")&&(r.
rs(e,t,function(e,t,r){r.b('  <li class="result collection" data-href="'),r.b(r.v
(r.f("path",e,t,0))),r.b('">'),r.b("\n"+n),r.b('    <div class="thumb_container">'
),r.b("\n"+n),r.b('      <img src="'),r.b(r.v(r.d("data.image_url",e,t,0))),r.b('" class="thumb">'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("    <strong>"),r.b(r.v(r.f("name"
,e,t,0))),r.b("</strong> by <strong>"),r.b(r.v(r.d("data.user_login",e,t,0))),r.b
("</strong>"),r.b("\n"+n),r.b("  </li>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("\n"+
n),r.s(r.f("colleges",e,t,1),e,t,0,2757,3e3,"{{ }}")&&(r.rs(e,t,function(e,t,r){r
.b('  <li class="result college" data-id="'),r.b(r.v(r.f("id",e,t,0))),r.b('" data-name="'
),r.b(r.v(r.d("data.institution_name",e,t,0))),r.b('">'),r.b("\n"+n),r.b('    <strong><span class="college_name"> '
),r.b(r.v(r.d("data.institution_name",e,t,0))),r.b(" </span></strong>"),r.b("\n"+
n),r.b('    <span class="college_location gray"> '),r.b(r.v(r.d("data.location",e
,t,0))),r.b("</span>"),r.b("\n"+n),r.b("  </li>"),r.b("\n")}),e.pop()),r.b("\n"+n
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("show_view_all",e,t,1),e,t,0,3035,3201,"{{ }}")&&
(r.rs(e,t,function(e,t,r){r.b('<li class="result view_all">'),r.b("\n"+n),r.b('  <a href="/search/'
),r.b(r.v(r.f("encoded_query",e,t,0))),r.b('/results">'),r.b("\n"+n),r.b('    <span class="i-search"></span>View all results for "<em>'
),r.b(r.v(r.f("query",e,t,0))),r.b('</em>"'),r.b("\n"+n),r.b("  </a>"),r.b("\n"+n
),r.b("</li>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.b('<li class="skip algolia_placeholder" style="text-align: right; padding: 15px 5px;">'
),r.b("\n"+n),r.b('  <a href="http://algolia.com/" target="_blank" style="color: #666;">Powered by <img title="Algolia" src="/images/logo/algolia_logotype.png" height="20" style="display: inline-block; margin-bottom: -5px;"/></a>'
),r.b("\n"+n),r.b("</li>"),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/layouts/browse"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div id="station" class="dark_bg clearfix"></div><!--station/search-->'
),r.b("\n"+n),r.b("\n"+n),r.b('<div id="explore_description" class="clearfix"></div><!--seo text-->'
),r.b("\n"+n),r.b("\n"+n),r.b('<div id="related_artists"></div><!-- filters -->')
,r.b("\n"+n),r.b("  "),r.b("\n"+n),r.b('<div id="explore" class="container"><!-- results -->'
),r.b("\n"+n),r.b('  <div class="browse_header"></div>'),r.b("\n"+n),r.b("\n"+n),
r.b('  <div class="mix_set"></div>'),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="row">'
),r.b("\n"+n),r.b('    <div class="col-md-12">'),r.b("\n"+n),r.b('      <div id="collections">'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b('      <div id="mixes_paging"></div>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"
),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/layouts/_home_logged_in"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="clear container" id="homepage_body">'
),r.b("\n"+n),r.b('  <div class="row">'),r.b("\n"+n),r.b('    <div id="left_masthead" class="col-md-12">'
),r.b("\n"+n),r.b('      <div class="big_menu">'),r.b("\n"+n),r.b('        <a class="item '
),r.s(r.f("home",e,t,1),e,t,0,177,185,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("selected"
)}),e.pop()),r.b('"               href="/">Home</a>'),r.b("\n"+n),r.b('        <a class="item '
),r.s(r.f("history",e,t,1),e,t,0,263,271,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("selected"
)}),e.pop()),r.b('"         href="/home/listened">History</a>'),r.b("\n"+n),r.b('        <a class="item '
),r.s(r.f("feed",e,t,1),e,t,0,359,367,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("selected"
)}),e.pop()),r.b('"               href="/home/feed">Feed</a>'),r.b("\n"+n),r.b('        <a class="item '
),r.s(r.f("liked",e,t,1),e,t,0,452,460,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("selected"
)}),e.pop()),r.b('"             href="/home/liked">Liked</a>'),r.b("\n"+n),r.b('        <a class="item '
),r.s(r.f("listen_later",e,t,1),e,t,0,553,561,"{{ }}")&&(r.rs(e,t,function(e,t,n)
{n.b("selected")}),e.pop()),r.b('" href="/home/listen_later">Listen Later</a>'),r
.b("\n"+n),r.s(r.f("admin",e,t,1),e,t,0,641,817,"{{ }}")&&(r.rs(e,t,function(e,t,
r){r.b('          <a class="item '),r.s(r.f("youtube_rec",e,t,1),e,t,0,683,691,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("selected")}),e.pop()),r.b('" href="/home/youtube_rec">YouTube Recs</a>'
),r.b("\n"+n),r.b('          <a class="item" href="/home_beta">Home beta</a>'),r.
b("\n")}),e.pop()),r.b('        <!--a class="item '),r.s(r.f("published",e,t,1),e
,t,0,868,876,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("selected")}),e.pop()),r.b('" href="/mix_sets/dj">Published</a-->'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("mix_set",e,t,1),e,t,0,976,1078,"{{ }}")&&(r.rs
(e,t,function(e,t,r){r.b('    <h4 class="collection_title clear '),r.b(r.v(r.f("sort"
,e,t,0))),r.b(' tooltip_container">'),r.b("\n"+n),r.b("      "),r.b(r.t(r.f("html_name"
,e,t,0))),r.b("\n"+n),r.b("    </h4>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("\n"+
n),r.b('  <div class="row">'),r.b("\n"+n),r.b('    <div class="col-md-12">'),r.b("\n"+
n),r.b('      <div id="listening_quota" style="display: none;"></div>'),r.b("\n"+
n),r.b("      "),r.b("\n"+n),r.b("      <!-- high-impact ad units -->"),r.b("\n"+
n),r.b('      <div id="featured_collection_unit"><div id="sponsored_mix"></div></div>'
),r.b("\n"+n),r.b('      <div id="featured_collection" style="display: none;"></div>'
),r.b("\n"+n),r.b('      <div id="headerboard" class="advertisement" data-size="HPTO" data-slot-name="HPTO"></div>'
),r.b("\n"+n),r.b('      <div id="video_masthead" class="video_masthead" style="display: none;"></div>'
),r.b("\n"+n),r.b("      "),r.b("\n"+n),r.b("\n"+n),r.b("\n"+n),r.b('      <div class="clear"></div>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+
n),r.b("\n"+n),r.b('  <div class="row">'),r.b("\n"+n),r.b('    <div class="col-md-12">'
),r.b("\n"+n),r.b('      <div id="mix_sets">'),r.b("\n"+n),r.s(r.f("mix_set",e,t,1
),e,t,0,1727,1776,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b("          "),r.b("\n"+
n),r.b(r.rp("mixes/mix_set",e,t,"          "))}),e.pop()),r.b("      </div>"),r.b
("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.
b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define
("hgn!templates/layouts/_home_segmented",["hogan"],function(e){function n(){return t
.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r
.b(n=n||""),r.b('<div class="clear container" id="homepage_body">'),r.b("\n"+n),r
.b('  <div class="row">'),r.b("\n"+n),r.b('    <div class="col-md-12">'),r.b("\n"+
n),r.b("\n"+n),r.b('      <div id="listening_quota" style="display: none;"></div>'
),r.b("\n"+n),r.b("      "),r.b("\n"+n),r.b("      <!-- high-impact ad units -->"
),r.b("\n"+n),r.b('      <div id="featured_collection_unit"><div id="sponsored_mix"></div></div>'
),r.b("\n"+n),r.b('      <div id="featured_collection" style="display: none;"></div>'
),r.b("\n"+n),r.b('      <div id="headerboard" class="advertisement" data-size="HPTO" data-slot-name="HPTO"></div>'
),r.b("\n"+n),r.b('      <div id="video_masthead" class="video_masthead" style="display: none;"></div>'
),r.b("\n"+n),r.b("\n"+n),r.b("\n"+n),r.b('      <div class="clear"></div>'),r.b("\n"+
n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b("\n"+
n),r.b('  <div class="row" id="dashboard">'),r.b("\n"+n),r.b('    <div class="col-md-12">'
),r.b("\n"+n),r.b('      <div id="segments">'),r.b("\n"+n),r.b("      </div>"),r.
b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>")
,r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/layouts/_collection"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<article id="collection_wrapper">'
),r.b("\n"+n),r.b('  <div id="collection_details"></div>'),r.b("\n"+n),r.b("\n"+n
),r.b("\n"+n),r.b('  <div class="container clearfix displaymode">'),r.b("\n"+n),r
.b('    <div class="row">'),r.b("\n"+n),r.b('      <div class="mix_set" id="mix_set_sortable" data-id="">'
),r.b("\n"+n),r.b('        <div class="mixes"></div>'),r.b("\n"+n),r.b("      </div>"
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</article>"
),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/layouts/_news_feed"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="clear container" id="homepage_body">'
),r.b("\n"+n),r.b('  <div class="row">'),r.b("\n"+n),r.b('    <div id="left_masthead" class="col-md-12">'
),r.b("\n"+n),r.b("      <br /><br />"),r.b("\n"+n),r.b('      <h4 class="collection_title clear '
),r.b(r.v(r.f("sort",e,t,0))),r.b(' tooltip_container">Mixes by DJs you follow</h4>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+
n),r.b('  <div class="row">'),r.b("\n"+n),r.b('    <div class="col-md-12">'),r.b("\n"+
n),r.b('      <div id="mix_sets">'),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r
.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"),r.b("\n"),
r.fl()},"",e,{});return n.template=t,n}),define("lib/events",["lib/client_storage"
,"lib/traxhead","global_trax","lib/jsonh.jquery","lib/trax_utils"],function(e,t,n
,r,i){if(typeof App.Events!="undefined")return App.Events;var s=App.Events={pageView
:function(e,t,n){s.gaPageview(t),TraxEvents.pageView(e,n)},postToStatsTimer:function(
e,t){s.postToStats(e,t,"timer")},postToStats:function(e,t,n){n=n||"counter",r.now
("/stats",{type:n,k:e,v:t},null,{type:"POST"})},postToLog:function(e,t){t["@collection"
]=e,r.now("/log",t,null,{type:"POST"})},startMix:function(e,t){s.gaTrack("Mix","Start"
,e?e.id:null),t,s.setGACohort()},setGACohort:function(){e.get("listened")===null&&
(ga("set","dimension1",s.timestamp()),e.set("listened",1))},trackClick:function(e
,t){TraxEvents.trackClick(e,t)},likeMix:function(e){console.log("[EVENT] likeMix"
),s.gaTrack("Mix","Like",e?e.id:null)},commentOnMix:function(e){s.gaTrack("Mix","Comment"
,e?e.id:null)},playTrack:function(e,t){s.gaTrack("Track","Play")},favTrack:function(
){s.gaTrack("Track","Fav")},buyTrack:function(e){s.gaTrack("Track","Buy",e)},followUser
:function(){s.gaTrack("User","Follow")},selectInstagramPhoto:function(){s.gaTrack
("Instagram","SelectPhoto")},login:function(e){s.updateGaLoggedInState(),s.gaTrack
("User","Login")},signup:function(e){s.updateGaLoggedInState(),s.gaPageview("/signup/success"
)},clickMixShare:function(){},clickMixShareOption:function(e){s.gaSocial(e.network
,e.action,e.url)},shareMix:function(e){s.gaTrack("Mix Share",e.network)},clickUserShareOption
:function(e){s.gaTrack("User Share",e.network)},addPreset:function(){},removePreset
:function(){},clickFindFriends:function(){},enterMixEditMode:function(){},uploadTrack
:function(){s.gaTrack("Mix","TrackUpload")},trackUploadStarted:function(){s.postToStats
("js.track.upload.started")},trackUploadCancelled:function(){s.postToStats("js.track.upload.cancelled"
)},trackUploadFinished:function(){s.postToStats("js.track.upload.finished")},publishMix
:function(e){s.gaTrack("Mix","Publish",e?e.id:null)},playNextMix:function(e){},skipMix
:function(){},TRACKS_REPORTED_COUNT_KEY:"tracks_reported_count",reportTrack:function(
e,t){},clickYoutube:function(){},clickExternalLink:function(e){},sawPreroll:function(
e){s.postToStats("js.player.saw_preroll",1);var t={event_type:"ad"};e&&(t.seconds_since_last_preroll=
e),TraxEvents.track("view preroll",t)},splashStep2Reported:!1,splashStep2:function(
e){s.splashStep2Reported||(s.splashStep2Reported=!0)},splashStep3Reported:!1,splashStep3
:function(e){s.splashStep3Reported||(s.splashStep3Reported=!0)},sawSite:!1,sawMix
:!1,init:function(){e.get("saw_site")=="1"?s.sawSite=!0:e.set("saw_site",1),e.get
("saw_mix")=="1"?s.sawMix=!0:App.currentPage=="mix"&&e.set("saw_mix",1);if(!window
.ga_initialized){var t="auto";App.env=="development"&&(t={cookieDomain:"none"}),ga
("create",s.GaProfileId(),t),ga("require","displayfeatures")}s.updateGaLoggedInState
(),s.updateGaPageVar(),s.setGaUrlParams(),setInterval(s.keepAlive,6e5)},onUserChanged
:function(e){},onUserUnset:function(){},onLogout:function(){TraxEvents.track("logout"
,{event_type:"click",content_type:"session"})},GaProfileId:function(){return!_.isUndefined
(App)&&App.env=="staging"||App.env=="development"?"UA-2865123-14":"UA-2865123-1"}
,luckyOrangeActive:function(){return e.get("luckyOrange")===null?e.set("luckyOrange"
,Math.random()<.01):e.get("luckyOrange")},gaSocial:function(e,t,n){ga("send","social"
,e,t,n),console.log("[EVENT]","social",e,t,n)},gaTrack:function(e,t,n,r){n&&(n=n.
toString()),r&&(r=r.toString()),console.log("[EVENT] "+e+" "+t+" "+(n?"("+n+": "+
r+")":"")),ga("send","event",e,t,n,r)},gaPageview:function(e){s.updateGaPageVar()
,ga("send","pageview",e)},mpUrlsToTitles:{forgot_password:"Forgot Password",edit_password
:"Reset Password",following:"Following",followers:"Followers"},timestamp:function(
){var e=new Date;return e=new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate
(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds()),""+e.getFullYear()+t.zeroFill
(e.getMonth()+1,2)+t.zeroFill(e.getDate(),2)},updateGaLoggedInState:function(){ga
("set","dimension2",t.looksLoggedIn()?"In":"Out")},updateGaPageVar:function(){ga("set"
,"dimension4",s.gaPageVar())},setGaUrlParams:function(){var e=window.ParsedLocation
.urlParams;e.utm_campaign&&ga("set","campaignName",e.utm_campaign),e.utm_source&&
ga("set","campaignSource",e.utm_source),e.utm_medium&&ga("set","campaignMedium",e
.utm_medium),e.utm_term&&ga("set","campaignKeyword",e.utm_term),e.utm_content&&ga
("set","campaignContent",e.utm_content),ga("set","referrer",window.ParsedLocation
.parsedReferrerUrl.source)},gaPageVar:function(){if(App.currentPage=="browse")return App
.views.browseView&&App.views.browseView.artist_name?"artist":App.views.browseView&&
App.views.browseView.tags.length>0?"tag":"explore";return App.currentPage},keepAlive
:function(){s.gaTrack("Ignore","Keep-Alive")},blockedAd:function(){s.gaTrack("Ad"
,"Blocked")},onAdClick:function(){},vwoTrack:function(){},clickAddToCollection:function(
){},clickRemoveMixFromHistory:function(){},clickClearCollection:function(){},createCollection
:function(){s.gaTrack("Collection","Create")},addMixToCollection:function(e){s.gaTrack
("Collection","AddMix",e?e.id:null)}};return s.init(),s}),define("lib/router",[],
function(){return Backbone.Router.extend({routes:{"":"homepage",home:"homepage",home_beta
:"dashboard",homepage:"homepage","home/feed(/:page)":"feed","home(/:smart_id(/:page))"
:"home_mix_set","mixes/:id/soundcloud_matches":"reload",mixes:"explore","mixes(/:tags)(/:sort(/:page))"
:"explore","mixes/songs/:q_artist(/:sort(/:page))":"explore",explore:"explore","explore(/q/:query)"
:"explore","explore(/:tags)(/:sort(/:page))":"explore","explore/songs/:q_artist(/:sort(/:page))"
:"explore","mix_sets/:smart_id(/:page)":"mix_set","subscriptions/new":"subscription"
,"subscriptions/best-deal-ever":"subscription",plus:"subscription","plus/about":"reload"
,"search/:query/results(/:offset)":"search","search/:query/:type(/:offset)":"search"
,"users/:user_slug/favorite_tracks":"favorite_tracks","news-feed":"feed",notifications
:"notifications",about:"html",api:"html","apps(/:platform)":"html",artists:"html"
,content_policy:"html",copyright:"html",festivals:"html",labels:"html",licensing:"html"
,media:"html","help/media_kit":"reload",blog:"html",contact_us:"html",wordpress:"html"
,joomla:"html",privacy:"html",team:"html",terms:"html",login:"html",signup:"html"
,"/help/(:action)":"html",nsfw:"nsfw",advertising:"reload",switchfoot:"reload",xbox
:"reload",jobs:"reload",refunds:"reload","plus_faq(#:question)":"reload","subscriptions(/:action)"
:"reload","subscriptions/:id/edit":"reload","subscriptions/:id":"reload","city(/:city)(/:country)"
:"reload",help:"reload",account:"reload","users/:id/edit":"reload",create_mix:"create_mix"
,"settings/1":"reload",admin:"reload",troubleshoot:"reload",troubleshooting:"reload"
,uploader:"reload","faq(#:question)":"reload",iphone:"reload",android:"reload",windows8
:"reload",store:"reload",tags:"reload","api_urls(/:id/edit)":"reload","developers/(:action)"
:"reload","collections/:collection_slug":"collection","blogs(/:id/:action)":"reload"
,"blogs/:id":"blog","articles(/:page)":"reload",":user_slug":"profile",":user_slug/mixes(/:page)"
:"profile",":user_slug/liked_mixes(/:page)":"profile",":user_slug/article/:slug":"blog"
,":user_slug/:mix_slug":"mix",":user_slug/:mix_slug/edit":"mix",":user_slug/:mix_slug/stats"
:"mix_stats",":user_slug/collections/:collection_slug(/:page)":"collection","users/:user_slug/:action"
:"reload","assets/(:folder)(/:image)":"reload"},initialize:function(e){this.appView=
e.appView},explore:function(e){this.appView.loadBrowseView(this.getPath())},home_mix_set
:function(e,t){this.appView.loadMixSetView(this.getPath())},mix_set:function(e,t)
{this.appView.loadMixSetView(this.getPath())},search:function(e){this.appView.loadSearchView
(this.getPath())},profile:function(e){this.appView.loadUserView(this.getPath())},
mix:function(e,t){this.appView.loadMixView(this.getPath())},mix_edit:function(e,t
){},mix_stats:function(e,t){this.appView.loadMixStatsView(this.getPath())},feed:function(
e){this.appView.loadNewsFeedView(e)},notifications:function(){this.appView.loadNotificationsView
()},collection:function(e,t){this.appView.loadCollectionView(this.getPath())},homepage
:function(){this.appView.loadHomepageView()},dashboard:function(){this.appView.loadDashboardView
()},favorite_tracks:function(e){this.appView.loadFavoriteTracksView(this.getPath(
))},blog:function(e){this.appView.loadBlogView(this.getPath())},subscription:function(
){return this.appView.loadSubscriptionView(this.getPath()),!1},html:function(e){var t=
this.appView.loadHTML(this.getPath())},create_mix:function(){App.Sessions.loggedIn
()?this.reload():this.html()},nsfw:function(e){this.appView.loadNSFW()},reload:function(
){return App.views.mixPlayerView&&App.views.mixPlayerView.mixPlayer.isPlaying()||
window.location.hash?(window.open(this.getPath()),!1):(window.location=this.getPath
(),!1)},getPath:function(){return Backbone.history._hasPushState?window.location.
pathname+window.location.search+window.location.hash:window.location.hash.substring
(1)}})}),define("lib/trax_utils",[],function(){var e={};return e.addCommas=function(
e){e+="";var t=e.split("."),n=t[0],r=t.length>1?"."+t[1]:"",i=/(\d+)(\d{3})/;while(
i.test(n))n=n.replace(i,"$1,$2");return n+r},e.coolNumber=function(e){return e<500?
e:e<1e3?e.toString().substr(0,1)+e.toString().substr(1,9):e<=5e3?e.toString().substr
(0,1)+","+e.toString().substr(1,9):Math.floor(e/1e3)+",000+"},e.toUrlParam=function(
e){if(_.isString(e))return encodeURIComponent(e.replace(/_/g,"__").replace(/\s/g,"_"
).replace("+","&&")).replace(/\//g,"%2F").replace(/\./g,"%5E")},e.capitalizeFirstLetter=
function(e){return e.charAt(0).toUpperCase()+e.slice(1)},e.toTitleCase=function(e
){return e.replace(/\w\S*/g,function(e){return e.charAt(0).toUpperCase()+e.substr
(1).toLowerCase()})},e}),define("lib/sessions",["global_trax","lib/traxhead","lib/client_storage"
,"models/user","lib/events","lib/jsonh.jquery"],function(e,t,n,r,i,s){if(typeof App
.Sessions!="undefined")return App.Sessions;var o=App.Sessions={};return _.extend(
o,Backbone.Events,{whenUserReadyOrChanged:function(t,n){e.currentUser&&_.defer(t,
e.currentUser),n&&n.listenTo(o,"sessions:user_changed",t)},_onUserChanged:function(
){this.trigger("sessions:user_changed",e.currentUser)},onPageLoad:function(){t.looksLoggedIn
()?this.tryToSetCurrentUserFromPage()||this.tryToSetCurrentUserFromStorage()||this
.tryToSetCurrentUserFromBackend():this.getCountryCode(),this.logoutUserIfAuthenticationFailed
(),setInterval(_.bind(this.tryToSetCurrentUserFromBackend,this),48e4)},logoutUserIfAuthenticationFailed
:function(){PAGE.failed_authentication&&PAGE.failed_authentication.length>0&&this
.unsetCurrentUser()},tryToSetCurrentUserFromPage:function(){if(PAGE.currentUser)return this
.setCurrentUserByAttributes(PAGE.currentUser)},tryToSetCurrentUserFromStorage:function(
){var t=n.get("currentUserId");return t?(n.get("Users-"+t)?e.currentUser=new r(n.
get("Users-"+t)):e.currentUser=new r({id:n.get("currentUserId")}),e.currentUser.fetch
({success:_.bind(function(){this._onCurrentUserSet(!0)},this)}),!0):!1},reloadIfOutdated
:function(){if(!e.currentUser.get("last_logged_in")||Date.now()-Date.parse(e.currentUser
.get("last_logged_in"))>48e4)this.tryToSetCurrentUserFromBackend(),this.updateNotifications
()},updateNotifications:function(){s.now("/users/"+e.currentUser.id+"/notifications_count"
,_.bind(function(t){t.success&&(e.currentUser.set("last_logged_in",new Date),e.currentUser
.set(t.user),e.currentUser.localSave(),this._onCurrentUserSet(!0))},this))},tryToSetCurrentUserFromBackend
:function(e){s.now("/users/current",{include:"recent_mixes,web_preferences,tracking_settings"
},_.bind(function(t){t.success?(t.user.last_logged_in=new Date,this.setCurrentUserByAttributes
(t),typeof e=="function"&&e.call()):this.getCountryCode()},this),{unauthorized:function(
){}})},getCountryCode:function(){var e=cookie.get("country_code3");e&&e.length>0&&typeof 
WEB_SETTINGS=="Object"&&e==WEB_SETTINGS["country_code"]?this.onCountryCodeSet(e):
$.ajax({url:"/users/current_country_code.jsonh",success:_.bind(function(e){var t=new 
Date;t.setTime(t.getTime()+36e5),cookie.set("country_code3",e.web_settings.country_code
,{expires:t.toGMTString()}),WEB_SETTINGS=e.web_settings,this.onCountryCodeSet(e.web_settings
.country_code)},this)})},onCountryCodeSet:function(t){if(!t)return;if(!e.regionallyBlocked
(t)||e.currentUser&&e.currentUser.isJuniorModerator())return;$("body").addClass("international"
),this.showInternationalMessage()},showInternationalMessage:function(){_.include(
["mix","home","home_first_time","browse"],App.currentPage)&&$(".international_message"
).length===0&&!cookie.get("intl_ack")&&$("#youtube_player").before('<div class="international_message"><div class="container clearfix"><div class="row"><div class="col-md-12"><div class="message"><span class="i-warning"></span> Unfortunately, some music can’t be played on 8tracks in your area right now. <a href="http://blog.8tracks.com/2016/02/12/a-change-in-our-international-streaming/" target="_blank">Learn more &rarr;</a><a href="#" style="float: right;" onclick="$(\'.international_message\').hide(); window.cookie.set(\'intl_ack\', \'1\'); return false;"><span class="i-x"></span></a></div></div></div></div></div>'
)},setCurrentUserByAttributes:function(t,n){var i;t.user?i=t.user:t.current_user?
i=t.current_user:i=t;if(!i)return!1;var s=!0;return e.currentUser?(e.currentUser.
get("id")==i.id&&(s=!1),e.currentUser.set(i)):e.currentUser=new r(i),n&&n.backendLogin&&
(cookie.set("L",e.currentUser.id),cookie.set(this.authTokenCookieName(),e.currentUser
.get("user_token")),this.trigger("jsonh:current_user:set_from_backend",e.currentUser
)),this._onCurrentUserSet(s,n&&n.onSignup),!0},loggedIn:function(){return!!e.currentUser
},currentUserId:function(){if(this.loggedIn())return e.currentUser.id},loggedOut:
function(){return!e.currentUser},logged_in:function(){return!!e.currentUser},authTokenCookieName
:function(){var e="auth_token";try{App.env!=="production"&&(e+="_"+App.env)}catch(
t){}return e},onFacebookConnectFailure:function(t){e.update_flash({errors:t.user_error_message
})},unsetCurrentUser:function(){cookie.remove("L"),cookie.remove(this.authTokenCookieName
()),cookie.remove("visitor_id"),e.currentUser&&(e.currentUser.localDestroy(),e.currentUser=
null,this.redirectUser(!1)),n.clearAll(),this.updatePermissionsDisplay(),this.trigger
("current_user:unset",e.currentUser),i.onUserUnset()},redirectUser:function(e){var t=
App.currentPage,n=!!t.match(/mix|user|browse/),r=window.location.toString(),i=r.match
(/\/edit$/);if(n&&!i)return;e||this.unsetCurrentUser(),App.views.appView.closeView
(),e?App.views.appView.loadDashboardView("/"):App.views.appView.loadHomeLoggedOutView
("/")},onBackendLogin:function(e,t){var n=o.loggedIn();this.setCurrentUserByAttributes
(e,{backendLogin:!0,onSignup:e.user_created}),e.user_created?i.signup(e.type):i.login
(e.type),!n&&!t&&this.redirectUser(!0),$(document).trigger("onBackendLogin",[e,t]
)},_onCurrentUserSet:function(t,r){e.currentUser.localSave(),n.set("currentUserId"
,e.currentUser.id),PAGE.attempted_path&&PAGE.attempted_path!==""?window.location.
pathname!=PAGE.attempted_path&&(window.location.href=PAGE.attempted_path):(App.currentPage==="login"||
App.currentPage==="signup")&&PAGE.attempted_path&&(window.location.href=PAGE.attempted_path
),this.updatePermissionsDisplay(),this.getCountryCode(),t&&(this._onUserChanged()
,i.onUserChanged(r)),this.reloadIfOutdated(),this.hideAds(),this.showTags()},updatePermissionsDisplay
:function(){this.loggedIn()?($(".p_logged_out").removeClass("on").addClass("off")
,$(".p_logged_in").removeClass("off").addClass("on"),o.isAdmin()?($(".p_at_least_owner, .p_admin"
).removeClass("off").addClass("on"),$(".p_not_admin").removeClass("on").addClass("off"
)):($(".p_owner, .p_recipient").removeClass("on").addClass("off"),$("[data-owner_id="+
e.currentUser.id+"].p_owner").removeClass("off").addClass("on"),$("[data-owner_id="+
e.currentUser.id+"].p_at_least_owner").removeClass("off").addClass("on"),$("[data-recipient_id="+
e.currentUser.id+"].p_recipient").removeClass("off").addClass("on")),$(".p_not_owner"
).removeClass("on").addClass("off"),$("[data-owner_id!="+e.currentUser.id+"].p_not_owner"
).removeClass("off").addClass("on"),o.isAdmin()||$(".p_not_admin").removeClass("off"
).addClass("on"),this.update_toggle_statuses()):($(".p_logged_in").removeClass("on"
).addClass("off"),$(".p_logged_out").removeClass("off").addClass("on"))},update_toggle_statuses
:function(){var t={favs:[],likes:[],follows:[]},n=!1;$("form.like, a.like").each(
function(){n=!0,t.likes[t.likes.length]=$(this).attr("data-mix_id")}),$("form.follow:not(.skip), a.follow:not(.skip)"
).each(function(){n=!0,t.follows[t.follows.length]=$(this).attr("data-user_id")})
,App.currentPage!="home_logged_in"&&$("form.fav, a.fav").each(function(){n=!0,t.favs
[t.favs.length]=$(this).attr("data-track_id")});if(n===!1)return;s.now("/users/"+
e.currentUser.id+"/values_for",t,function(e){e.likes&&$.each(e.likes,function(e,t
){var n=$("form.like[data-mix_id="+e+"]");t?($(n).addClass("active").removeClass("inactive"
),$(n).find('input[type|="submit"]').val("Unlike")):($(n).addClass("inactive").removeClass
("active"),$(n).find('input[type|="submit"]').val("Like"));var r=$("a.like[data-mix_id="+
e+"]");t?r.addClass("active").removeClass("inactive"):r.addClass("inactive").removeClass
("active")}),e.follows&&$.each(e.follows,function(e,t){var n=$("form.follow[data-user_id="+
e+"]");t?($(n).addClass("active skip").removeClass("inactive"),$(n).find('input[type|="submit"]'
).val("Unfollow")):($(n).addClass("inactive skip").removeClass("active"),$(n).find
('input[type|="submit"]').val("Follow"));var r=$("a.follow[data-user_id="+e+"]");
t?r.addClass("active skip").removeClass("inactive").html('<span class="in">Unfollow</span><span class="out">Following</span>'
):r.hasClass("active")&&r.addClass("inactive skip").removeClass("active").html("Follow"
)}),e.favs&&$.each(e.favs,function(e,t){var n=$("form.fav[data-track_id="+e+"]");
t?$(n).addClass("active").removeClass("inactive"):$(n).addClass("inactive").removeClass
("active");var r=$("a.fav[data-track_id="+e+"]");t?r.addClass("active").removeClass
("inactive"):r.addClass("inactive").removeClass("active")})},{spinner:!1})},hideAds
:function(){!e.showAds()&&App.views.adsView&&(App.views.adsView.close(),delete App
.views.adsView)},showTags:function(){n.get("always_show_tags")=="yes"&&$("body").
addClass("always_show_tags")},isAdmin:function(){return e.currentUser&&e.currentUser
.isAdmin()},isJuniorModerator:function(){return e.currentUser&&e.currentUser.isJuniorModerator
()},isOwner:function(t){if(t){var n=t.get("user")?t.get("user").id:t.get("user_id"
);return!!e.currentUser&&!!n&&n==e.currentUser.id}},isAtLeastOwner:function(e){return!!
this.isOwner(e)||!!this.isAdmin()}}),o}),define("views/login_view",["global_trax"
,"views/trax_view","hgn!templates/users/login_lightbox","hgn!templates/users/_login_form"
,"lib/sessions","views/google_plus_view","lib/jsonh.jquery"],function(e,t,n,r,i,s
,o){var u=t.extend({id:"login_container",className:"clear",initialize:function(e)
{_.bindAll(this,"onBackendLogin"),this.attempted_path=e.attempted_path,this.success_callback=
e.success_callback,$(document).bind("onBackendLogin",this.onBackendLogin)},events
:{"click a.signup":"onSignupClick","submit #login_form":"onSubmit","click .forgot"
:"onForgot","click .facebook_connect_button":"onFbConnect"},onSubmit:function(){var e=
{login:this.$("#login").val(),password:this.$("#password").val(),attempted_path:this
.attempted_path||this.$("#attempted_path").val(),play_token:cookie.get("play_token"
),include:"recent_mixes,web_preferences,tracking_settings",api_version:"2.1"};return this
.$("form").addClass("loading"),o.now_with_context("/sessions/create_get.json",e,this
,function(e){this.$("form").removeClass("loading");if(e.success){var t=!!this.attempted_path||!!
this.success_callback;i.onBackendLogin(e,t)}},{with_lock:!0,dataType:"json",spinner
:"#login_form-spinner",headers:{}}),!1},onBackendLogin:function(e){typeof this.success_callback=="function"?
this.success_callback.call():this.attempted_path&&(window.location=this.attempted_path
),$.facebox.close(),_.delay(_.bind(function(){this.close()},this),1e3)},render:function(
){var t=String.fromCharCode(97+Math.floor(Math.random()*7)).toUpperCase(),i={header
:"Good to see you again!",subhed:"Sign in to explore all the <br /> new mixes we found for you."
,image:"People_1000px"+t+".png"};return this.$el.html(n(i,{login_form:r.template}
)),$.facebox(this.$el,{dontRemove:!0,flush:!0}),this.msg&&e.show_flash_error(this
.msg),new s,this},show:function(t){t.msg&&(this.msg=t.msg);if(this.$el.text()!==""
){$.facebox(this.$el,{dontRemove:!0});return}o.now("/login",_.bind(function(t){t.
success&&(t.logged_in?i.setCurrentUserByAttributes(t):(this.render(),e.initial_focus
(this.$el)))},this))},onSignupClick:function(){return e.showSignupView({attempted_path
:this.attempted_path,success_callback:this.success_callback}),this.close(),!1},onForgot
:function(){return $.facebox.close(),!0},onFbConnect:function(){},onClose:function(
){$(document).unbind("onBackendLogin",this.onBackendLogin)}});return u}),define("views/signup_view"
,["global_trax","views/trax_view","lib/sessions","views/google_plus_view","lib/jsonh.jquery"
,"lib/client_storage","hgn!templates/users/_signup_form","hgn!templates/users/signup_lightbox"
],function(e,t,n,r,i,s,o,u){var a=t.extend({id:"signup",className:"clear",initialize
:function(e){_.bindAll(this,"checkLogin","checkEmail","checkPassword","onBackendLogin"
,"renderCaptcha","updateToken"),this.onPage=e.onPage,this.attempted_path=e.attempted_path
,this.success_callback=e.success_callback,this.message=e.message,this.template=e.
template,$(document).bind("onBackendLogin",this.onBackendLogin),this.validation={
login:null,email:null,password:null}},renderCaptcha:function(){if(!window.grecaptcha
){window.recaptchaCallback=this.renderCaptcha;var e=document.createElement("script"
);e.type="text/javascript",e.src=window.location.protocol+"//www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit"
,document.body.appendChild(e),window.recaptcha=!0}else{if(this.recaptcha_id)return;
this.recaptcha_id=grecaptcha.render(this.$(".g-recaptcha")[0],{sitekey:"6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN"
})}},showCaptcha:function(){window.recaptcha&&(this.$("#captcha_container").animate
({height:"80px"}),this.$(".js-connected-sites").slideUp())},events:{"click a.login"
:"onLoginClick","submit #signup_form":"onSubmit","click .facebook_connect_button"
:"onFbConnect","keydown input":"clearValidation","keyup #user_login":"checkLogin"
,"keyup #user_email":"checkEmail","keyup #user_password":"checkPassword","focus input"
:"onInputFocus","blur input":"onInputBlur"},onSubmit:function(){var t={user:{login
:this.$("#user_login").val(),password:this.$("#user_password").val(),email:this.$
("#user_email").val(),agree_to_terms:"1",nonce:this.$("#user_nonce").val()},template
:this.template,attempted_path:this.attempted_path,include:"recent_mixes,web_preferences,tracking_settings"
,api_version:"2.1"};typeof grecaptcha!="undefined"&&(t.user["g-recaptcha-response"
]=grecaptcha.getResponse(this.recaptcha_id));var r=null;return this.$(".flash_container"
)&&(r=this.$el),this.$("form").addClass("loading"),i.now_with_context("/users/create_get.json"
,t,this,function(t){this.$("form").removeClass("loading");if(t.success){var i=!!this
.attempted_path||!!this.success_callback;n.onBackendLogin(t,!0),i?s.set("show_onboarding_later"
,!0):this.showOnboardingView()}else t.errors=t.validation_errors,this.updateToken
(t),e.update_flash(t,null,r),typeof grecaptcha!="undefined"&&grecaptcha.reset(this
.recaptcha_id)},{with_lock:!0,dataType:"json",headers:{},ignore_flash:!!r}),!1},onBackendLogin
:function(e,t){typeof this.success_callback=="function"?this.success_callback.call
():this.attempted_path&&(window.location=this.attempted_path),$.facebox.close(),this
.template=="first_play"&&(t.user_created?TraxEvents.track("first play signup prompt: signup"
,{variation:"copy_"+this.variation}):TraxEvents.track("first play signup prompt: login"
,{variation:"copy_"+this.variation})),_.delay(_.bind(function(){this.close()},this
),1e3)},show:function(){if(this.rendered||this.onPage)return;this.render(),e.initial_focus
(this.$el)},render:function(){var e=this.templateParams();return e.hide_flash_container=!
this.onPage,this.onPage?this.$el.html(o()):(this.$el.html(u(e,{signup_form:o.template
})),$.facebox(this.$el,{dontRemove:!0,flush:!0}),new r({el:this.$el}),this.template=="first_play"?
this.$(".g-recaptcha").hide():this.renderCaptcha()),this.message&&App.Trax.show_flash_error
(this.message),this.requestToken(),this.rendered=!0,this},templateParams:function(
){var e=String.fromCharCode(97+Math.floor(Math.random()*7)).toUpperCase(),t={image
:"People_1000px"+e+".png"};if(this.template=="first_play"){var n=[{header:"No strangers allowed!"
,subhed:"Want to access this playlist? Sign up now to unlock the magic."},{header
:"Introduce yourself!",subhed:"Join our community to listen to full playlists."},
{header:"Almost ready!",subhed:"Before you can listen to this playlist in full, you have to sign up."
},{header:"Want to keep going?",subhed:"After this first track, you'll have to sign up to hear the rest of this playlist."
}],r=n[Math.floor(Math.random()*n.length)];t.header=r.header,t.subhed=r.subhed}else t
.header="Join the 8tracks community",t.subhed="Save your favorite mixes and make your own."
;return t},onLoginClick:function(){return e.showLoginView({attempted_path:this.attempted_path
,success_callback:this.success_callback}),this.onPage||this.close(),!1},onInputFocus
:function(e){$(e.currentTarget).parent(".row").addClass("focus")},onInputBlur:function(
e){$(e.currentTarget).parent(".row").removeClass("focus")},clearValidation:function(
e){if(e.keyCode==13)return!0;if(e.keyCode==9)return e.currentTarget.type=="password"&&!
e.shiftKey?(this.$(".submit").focus(),!1):!0;var t={},n=e.currentTarget.name.match
(/\[(.+)\]/)[1];t[n]=null,this.updateValidation(t)},checkLogin:_.debounce(function(
e){var t=this.$("#user_login").val();if(t.length==0){this.updateValidation({login
:null});return}this.userRequest&&this.userRequest.abort(),this.$(".reminder").show
(),this.userRequest=i.now("/users/check_username",{login:t},_.bind(function(e){this
.updateValidation({login:e.available})},this))},250),checkEmail:_.debounce(function(
e){var t=this.$("#user_email").val();if(t.length<4)return;var n=t.indexOf("@"),r=
t.indexOf(".");while(r!=-1&&r!=t.length-1&&t.indexOf(".",r+1)!=-1)r=t.indexOf("."
,r+1);var i=n<1||r<1||r<n||n==t.length-1||r==t.length-1||t.indexOf("@",n+1)!=-1;this
.updateValidation({email:!i})},250),checkPassword:_.debounce(function(e){var t=e.
currentTarget.value;if(t.length==0){this.updateValidation({password:null});return}
var n=t.length>=4&&t.length<=22;n&&this.showCaptcha(),this.updateValidation({password
:n})},250),updateValidation:function(e){this.validation=_.extend(this.validation,
e);var t=!0;_.each(this.validation,_.bind(function(e,n){var r=this.$("."+n+"-field"
);e==0?(t=!1,r.addClass("invalid").removeClass("valid")):_.isNull(e)?(r.removeClass
("invalid valid"),t=!1):r.addClass("valid").removeClass("invalid")},this)),t?this
.$(".submit").removeAttr("disabled").removeClass("disabled"):this.$(".submit").attr
("disabled","disabled").addClass("disabled")},onFbConnect:function(){},requestToken
:function(){i.now("/users/new_token.jsonh",{},this.updateToken)},updateToken:function(
e){this.$('input[name="user[nonce]"]').val(e.nonce)},showOnboardingView:function(
){App.views.appView.loadOnboarding()},onClose:function(){$(document).unbind("onBackendLogin"
,this.onBackendLogin)}});return a}),define("views/auth_nav_view",["global_trax","views/trax_view"
,"lib/sessions","lib/events","views/find_friends_view","hgn!templates/shared/_auth_nav_logged_in"
,"hgn!templates/shared/_auth_nav_logged_out","hgn!templates/shared/auth_nav_recent_mixes"
,"hgn!templates/shared/_sale_header","lib/_template_helpers","lib/link_helper","jquery.hoverDelegate"
],function(e,t,n,r,i,s,o,u,a,f,l){var c=t.extend({el:"#thin_header",initialize:function(
e){this.loggedInTemplate=s,this.loggedOutTemplate=o,_.bindAll(this,"onCurrentUserSet"
,"onCurrentUserUnset","renderRecentMixes","toggleDropdown","showFooter"),this.whenUserReadyOrChanged
(this.onCurrentUserSet),n.bind("current_user:unset",this.onCurrentUserUnset),this
.$navlinks=this.$(".navlinks"),this.setupHover(),_.delay(this.renderSaleHeader,2e3
)},events:{"click a.toggleDropdown":"toggleDropdown","click .dropdown a":"closeDropdown"
,"click a.login":"onLoginClick","click a.signup":"onSignupClick","click .show_footer"
:"showFooter","click .upgrade":"onUpgradeClick","click #profile_link":"onProfileLinkClick"
,"click .create_mix_link":"onCreateMixClick","click .navlinks a":"onMixNavigationClick"
,"click #logout_link":"onLogoutClick","click .find_friends_link":"onFindFriendsClick"
,"click .unread_notifications_link":"onUnreadNotificationsClick"},onLoginClick:function(
){if(App.currentPage!=="login"&&App.currentPage!=="signup")return e.showLoginView
(),!1},onSignupClick:function(){if(App.currentPage!=="login"&&App.currentPage!=="signup"
)return e.showSignupView(),!1},showFooter:function(){return this.toggleDropdown({
currentTarget:this.$(".bullets")[0]}),!0},closeDropdown:function(){return this.toggleDropdown
(),!0},toggleDropdown:function(e){$(document).unbind("click",this.toggleDropdown)
;if(e)var t=$(e.currentTarget).data("dropdown-id"),n=$(e.currentTarget).hasClass("active"
);return this.$(".toggleDropdown").removeClass("active"),this.$(".dropdown").removeClass
("visible"),e&&t&&($("#"+t).toggleClass("visible",!n),$(e.currentTarget).toggleClass
("active",!n),n||$(document).bind("click",this.toggleDropdown)),!1},onFindFriendsClick
:function(){return _.isUndefined(App.views.findFriendsView)&&(App.views.findFriendsView=new 
i({}),r.clickFindFriends()),App.views.findFriendsView.render().show(),!1},render:
function(){var t=this.$("#auth_nav");if(n.logged_in()){var r=new f(e.currentUser.
toJSON());t.html(this.loggedInTemplate(r)),this.renderRecentMixes(),t.addClass("logged_in"
),e.currentUser.get("admin")&&this.$(".p_admin").show()}else{var r={ssl_host_url:
e.sslHostUrl()};t.html(this.loggedOutTemplate(r)),t.removeClass("logged_in")}return this
},renderRecentMixes:function(){this.$("#recent-mixes-spinner span").hide(),this.$
(".recent-mixes-list").html(u({recent_mixes:e.currentUser.get("recent_mixes")}))}
,onMixNavigationClick:function(e){return $(e.currentTarget).addClass("active").siblings
().removeClass("active default"),!0},onCreateMixClick:function(){if(!!this.createMixClicked
)return!1;this.createMixClicked=!0},onCurrentUserSet:function(){if(n.loggedIn()){
if(this.$("#logged_in_topnav").length===0)this.render();else{var t=e.currentUser.
get("unread_notifications_count"),r=this.$(".unread_notifications");t>99?(r.text("99+"
),r.show()):t>0?(r.text(t),r.show()):r.hide()}$("#logged_out_header").remove(),e.
isSubscribed()&&($(".hidden-subscribed").hide(),this.loadRetainSnippet()),typeof 
IDENTITY=="function"&&IDENTITY("track","User Identify",{email:e.currentUser.get("email"
)})}this.renderSaleHeader(),this.setupHover()},onLogoutClick:function(){return r.
onLogout(),n.unsetCurrentUser(),!1},onCurrentUserUnset:function(){this.render(),this
.$("p_logged_out").show(),this.$("p_logged_in").hide()},setupHover:function(){$(this
.el).hoverDelegate("#logged_in_topnav",function(){$(this).addClass("active")},function(
){var e=this;_.delay(function(){$(e).removeClass("active")})},0,500),$(this.el).hoverDelegate
(".create-mix",_.bind(function(){this.$(".create-mix").addClass("active"),this.updateRecentMixes
()},this),function(){$(this).removeClass("active")},0,500)},onProfileLinkClick:function(
e){return $("#logged_in_topnav").hasClass("active")?!0:!1},updateRecentMixes:function(
){Math.floor((Date.now()-Date.parse(App.Trax.currentUser.get("last_logged_in")))/1e3
)>120&&(this.$("#recent-mixes-spinner span").show(),App.Sessions.tryToSetCurrentUserFromBackend
(this.renderRecentMixes))},onUnreadNotificationsClick:function(){this.$(".unread_notifications"
).text("0").hide(),e.currentUser.set("unread_notifications_count",0),e.currentUser
.localSave()},onUpgradeClick:function(){return l.upgrade_link_click(event,"Header upgrade button"
),!1},renderSaleHeader:function(){if(App.currentPage=="new_subscription"||App.currentPage=="edit_subscription"
)return!1;if($("#sale_header").length>0)return!1;if(App.Trax.regionallyBlocked())
return!1;if(App.Trax.isSubscribed())return!1;if(new Date>new Date(2018,4,31))return!1
;if(cookie.get("may_sale_saw")&&Date.now()-parseInt(cookie.get("may_sale_saw"))<864e5
)return!1;var e=[{color:"#112c4b",hed:"<strong>⏰ Sale ending May 31:</strong>",msg
:"  get 40% off ad-free 8tracks Plus and all the perks for just <strike>$4.99</strike> <strong>$2.99/mo<strike>!"
,cta:"Start my free trial",num:1,url:"https://8tracks.com/subscriptions/best-deal-ever"
,button_class:"button_blue"}],t=0;e[t]&&($("#player_container").prepend(a(e[t])),
window.hidesale=function(){return $("#sale_header").empty().hide(),cookie.set("may_sale_saw"
,Date.now()),cookie.remove("hidesale"),!1})},loadRetainSnippet:function(){(function(
e,t,n,r,i,s,o){e.ProfitWellObject=i,e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push
(arguments)},e[i].l=1*new Date,s=t.createElement(n),o=t.getElementsByTagName(n)[0
],s.async=1,s.src=r,o.parentNode.insertBefore(s,o)})(window,document,"script","https://dna8twue3dlxq.cloudfront.net/js/profitwell.js"
,"profitwell"),profitwell("auth_token","65a0b80406bb183d06cc668c34445b5f"),profitwell
("user_id",e.currentUser.id)}});return c}),define("views/autocomplete_view",["views/trax_view"
,"hgn!templates/shared/autocomplete","lib/jsonh.jquery","lib/trax_utils"],function(
e,t,n,r){var i=e.extend({initialize:function(e){_.bindAll(this,"render","search","onBlur"
),this.placeholder=e.placeholder,this.emptyMessage=e.emptyMessage,this.queryOptions=
e.queryOptions,this.interval=e.interval||250,this.endpoint=e.endpoint||"/algolia/search.jsonh"
,this.showViewAll=!1,this.autoSelect=_.isUndefined(e.autoSelect)?!0:e.autoSelect,
this.mix_id=e.mix_id,this.dataMapper=e.dataMapper,this.minQueryLength=e.minQueryLength||1
,this.$input=e.$input||this.$('input[type="text"]:first'),this.localSearch=e.localSearch
,this.$input.length==0&&(this.$input=this.$("textarea:first")),this.$results=this
.$(".autocomplete"),this.$results.length==0&&(this.$results=$('<div class="autocomplete"></div>'
),this.$el.append(this.$results)),this.$results.hide(),this.symbol=e.symbol,this.
query="",this.searchLater=_.debounce(this.search,this.interval),this.template=t,this
.onEnterCallback=e.onEnter,this.onSelectCallback=e.onSelect,this.$input.is(":focus"
)&&this.onFocus()},events:{"click #search_button":"onSearchClick","click .result:not(.view_all)"
:"onClick","click .view_all":"onViewAll","mouseenter .result":"onHover",'focus input[type="text"]'
:"onFocus",'blur  input[type="text"]':"onBlur",'keyup input[type="text"]':"onKeyUp"
,'keydown input[type="text"]':"onKeyDown","focus textarea":"onFocus","blur textarea"
:"onBlur","keyup textarea":"onKeyUp","keydown textarea":"onKeyDown","submit form"
:"onEnter"},all_categories:["mixes","users","tags","mtags","artists","colleges","collections"
],onSearchClick:function(e){return this.$("#search_button").length>0&&($("#thin_header"
).addClass("searching"),this.$("input:first").focus()),!1},search:function(e){var t=
e||this.$input.val();this.query=t;if(t&&t.length>=this.minQueryLength){this.symbol&&
(t=t.replace(/^@/,"")),this.cancel(!1),this.$el.addClass("loading");if(this.localSearch
)return this.localSearch.call(this,t);this.request=n.now(this.endpoint,_.extend({
q:t,types:this.categories,mix_id:this.mix_id},this.queryOptions||{}),_.bind(function(
e){typeof this.dataMapper=="function"&&(e=this.dataMapper(e)),this.render(e)},this
))}else this.cancel(!0)},cancel:function(e){this.request&&this.request.abort(),e&&
(this.$el.removeClass("loading"),this.render)},clear:function(){this.$results.empty
().hide()},render:function(e){e?(e.results&&e.results.length>0||e.mixes||e.users||
e.tags||e.colleges?(e.show_view_all=this.showViewAll,e.query=this.query,e.selected_tags=
this.filter,e.encoded_query=encodeURIComponent(this.query),this.$results.html(this
.template(e)).css("display","")):this.emptyMessage?this.$results.html('<div class="placeholder">'+
this.emptyMessage+"</div>").css("display",""):this.$results.html('<div class="placeholder">Search <strong>'+
this.query+"</strong> by keyword &rarr;</div>").css("display",""),this.autoSelect==1?
this.navigate(!0):this.autoSelect=="exact_match_only"&&this.$('.result[data-tag="'+
this.query+'"]:first').addClass("selected")):this.clear(),this.$el.removeClass("loading"
),this.$input.is(":focus")&&!this.$tokenfield&&this.$el.addClass("active")},onHover
:function(e){$(e.currentTarget).addClass("selected").siblings().removeClass("selected"
)},onFocus:function(e){this.$tokenfield||this.$el.addClass("active"),this.showPlaceholder
()},onBlur:function(e){(!this.$tokenfield||!this.$tokenfield.hasClass("focus"))&&
_.delay(_.bind(function(){this.$el.removeClass("active")},this),200),this.$("#search_button"
).length>0&&$("#thin_header").removeClass("searching")},onClick:function(e){this.
onSelect($(e.currentTarget))},onViewAll:function(e){return this.$input.val(""),this
.onSearchEnter(this.query)},onEnter:function(e){return this.currentSelection().length==1?
this.currentSelection().hasClass("view_all")?this.onSearchEnter(this.$input.val()
):this.onSelect(this.currentSelection()):typeof this.onEnterCallback=="function"?
this.onEnterCallback.call(null,this.$input.val()):this.onSearchEnter(this.$input.
val()),this.onBlur(),!1},onSearchEnter:function(e){if(e=="")return;url="/explore/"+
r.toUrlParam(e)+"/popular",App.router.navigate(url,{trigger:!0}),this.$input.val(""
),this.$el.removeClass("active")},onSelect:function(e){return typeof this.onSelectCallback=="function"?
this.onSelectCallback.call(null,e):this.onSearchSelect(e),!1},onSearchSelect:function(
e){App.router.navigate(e.data("href"),{trigger:!0}),this.$input.val(""),this.$el.
removeClass("active")},currentSelection:function(){return this.$(".selected").first
()},onKeyUp:function(e){switch(e.which){case 27:this.$input.blur();break;case 38:
case 40:case 13:return e.preventDefault,!1;default:if(this.symbol){var t=e.target
.value.substring(0,this.caretPosition()),n=t.match(/@\S*$/i);n&&n[0]?this.search(
n[0]):this.render()}else this.searchLater(),this.showPlaceholder()}return!1},showPlaceholder
:function(){this.$input.val()==""&&this.render()},setFilter:function(e){e.length>0?
this.$input.attr("placeholder",""):this.$input.attr("placeholder",this.placeholder
),this.filter=e,this.render()},onKeyDown:function(e){switch(e.which){case 38:return this
.navigate(!1),!1;case 40:return this.navigate(!0),!1;case 13:return this.onEnter(
),e.preventDefault,!1;default:return this.currentSelection().removeClass("selected"
),!0}},navigate:function(e){var t=this.currentSelection();t.length==1&&(t.removeClass
("selected"),e?t.nextAll("li.result:first").addClass("selected"):t.prevAll("li.result:first"
).addClass("selected"));if(t.length==0||this.currentSelection().length==0)var n=this
.$("li.result:"+(e?"first":"last")).addClass("selected")},caretPosition:function(
e){var e=this.$input[0],t,n,r;return e.selectionStart?e.selectionStart:document.selection?
(e.focus(),t=document.selection.createRange(),t?(r=e.createTextRange(),n=r.duplicate
(),r.moveToBookmark(t.getBookmark()),n.setEndPoint("EndToStart",r),n.text.length)
:0):0},setCaretPosition:function(e,t){var n;if(e.setSelectionRange){e.focus(),e.setSelectionRange
(t,t);return}if(e.createTextRange)return n=e.createTextRange(),n.collapse(!0),n.moveEnd
("character",t),n.moveStart("character",t),n.select()}});return i}),define("views/safe_browse_view"
,["global_trax","views/trax_view"],function(e,t){return t.extend({el:"#safe_browse_container"
,web_safe_browse:!0,events:{"click #safe_browse":"toggleMode"},initialize:function(
e){this.$el=$(this.el),this.whenUserReadyOrChanged(_.bind(this.updateView,this)),
this.updateView()},webSafe:function(){return e.currentUser?e.currentUser.get("web_safe_browse"
):_.isUndefined(cookie.get("web_safe_browse"))?(this.setSetting(!0),!0):cookie.get
("web_safe_browse")},updateView:function(){this.webSafe()?this.$el.addClass("enabled"
).removeClass("disabled"):this.$el.addClass("disabled").removeClass("enabled")},toggleMode
:function(e){return $(e.currentTarget).rel=="external"?!0:(this.setSetting(this.$el
.hasClass("disabled")),this.updateView(),!1)},setSetting:function(t){e.currentUser?
e.currentUser.save({web_safe_browse:t}):cookie.set("web_safe_browse",t)}})}),PREBID_TIMEOUT=1e3
,OVERLAY_TIMEOUT=12e4,define("views/ads_view",["global_trax","views/trax_view"],function(
e,t){return t.extend({initialize:function(){_.bindAll(this,"setRefreshTimer","fillEmptyAds"
,"onFocus"),this.nextAdSize=0,this.refreshable=!1,this.refresh_minimum_ms=2e4,this
.adSlots={},this.loadProperIO();var e=document.getElementsByClassName("afs_ads"),
t=e[e.length-1];if(!t||t.innerHTML.length==0||t.clientHeight===0){this.adblock=!0
;return}this.adblock=window.adblock,googletag.cmd.push(this.dfpLoaded);var n=document
.createElement("script");n.setAttribute("src","//www.googletagservices.com/tag/js/gpt.js"
),document.getElementsByTagName("head").item(0).appendChild(n),window.special_ops||
(window.special_ops={}),window.onfocus=this.onFocus},dfpLoaded:function(){googletag
.pubads().enableSingleRequest(),googletag.pubads().disableInitialLoad(),googletag
.pubads().collapseEmptyDivs(!0),googletag.enableServices()},loadProperIO:function(
){propertag={},propertag.cmd=propertag.cmd||[],propertag.cmd.push(this.fillEmptyAds
),function(){var e=document.createElement("script");e.async=!0,e.type="text/javascript"
;var t="https:"==document.location.protocol;e.src=(t?"https:":"http:")+"//global.proper.io/8tracks.min.js"
;var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)}
()},fillEmptyAds:function(e){this.setTargeting();if(this.targeting.nsfw){this.clearEmptyAds
();return}var t=$(".advertisement").removeClass("advertisement"),n=[],r=[];for(var i=0
;i<t.length;i++)this.createProperSlot($(t[i]))},properSizeMap:{box:"content",boxcard
:"side",smallbox:"content",banner:"main"},properIncrements:{},properUnits:{},clearEmptyAds
:function(){$(".advertisement").hide()},createProperSlot:function(e){var t="proper-ad-8tracks_"
,n=e.data("size"),r=(this.properIncrements[n]||0)+1;this.properIncrements[n]=r,r>1&&
(n+="-"+r),e.addClass("proper-ad-unit"),e.html('<div id="'+t+n+'"></div>');var i=
this;propertag.cmd.push(function(){proper_display("8tracks_"+n)})},refreshExistingAds
:function(){var e=$(".proper-ad-unit");for(i=0;i<e.length;i++){var t=$(e[i]).children
().first()[0].id;ProperMedia.ad_project.refreshSlotByName(t.replace("proper-ad-",""
))}},renderOverlay:function(e){this.waitingForOverlay=!1;if(e.isEmpty){$("#web_overlay_container"
).remove(),console.log("ADS: empty_overlay");return}if(TraxClientStorage.get("saw_overlay"
)&&Date.now()-TraxClientStorage.get("saw_overlay")<OVERLAY_TIMEOUT){console.log("[ADS] waiting to show overlay"
);return}TraxClientStorage.set("saw_overlay",Date.now()),console.log("ADS: showing overlay"
);if(e.size[0]==1&&e.size[1]==1){$("#web_overlay_container").addClass("hidden");return}
$("#web_overlay_container, #body_overlay").addClass("visible").fadeIn(),$("#web_overlay_container .close, #body_overlay"
).click(_.bind(this.onOverlayClose,this))},onOverlayClose:function(){return $("#web_overlay_container"
).remove(),$("#body_overlay").fadeOut().removeClass("visible"),!1},onFaceboxClose
:function(){$("#web_overlay").remove(),$(document).unbind("close.facebox",this.onFaceboxClose
)},refreshSidebarAd:function(e){if(this.refreshable===!0||e===!0)this.refreshExistingAds
(),this.setRefreshTimer()},setRefreshTimer:function(e){this.refreshable=!1,clearTimeout
(this.refresh_timer),this.refresh_timer=setTimeout(_.bind(function(){this.refreshable=!0
},this),e?e:this.refresh_minimum_ms)},delayRefresh:function(e){this.setRefreshTimer
(e*1e3)},randomAd:function(e){return this.nextAd(e)},resetAds:function(){this.nextAdSize=0
},nextAd:function(e){var t,n="ad_"+Math.floor(Math.random()*1e5,0);return e?(this
.nextAdSize=0,this.adCard("ad_card card half_card",e,n,"Web_Prebid_Box",!0)):this
.nextAdSize==0?(this.nextAdSize=1,this.adFlexBox(n)):(this.nextAdSize=0,this.adBanner
(n))},adBox:function(e){return this.adCard("ad_card card half_card","box",e,"Web_Prebid_Box"
,!0)},adFlexBox:function(e){return this.adCard("ad_card card half_card","flexbox"
,e,"Web_Prebid_Box",!0)},adBanner:function(e){return this.adCard("banner_container"
,"main_1",e,"Web_Prebid_Banner",!0)},adCard:function(e,t,n,r,i){return'<div class="'+
e+'">'+'  <div class="advertisement ad_'+t+'" id="'+n+'" data-slot-name="'+r+'" data-size="'+
t+'"></div>'+(i?'<p class="plus_cta"><a href="/plus" target="_blank">Remove ads</a></p>'
:"")+"</div>"+"</div>"},appendSidebarAd:function(){return!1},setTargeting:function(
){this.targeting={kill_all_ads:!0},this.targeting.tags=["page_"+this.targetPage()
],App.currentPage=="mix"?App.views.mixView?(_.each(App.views.mixView.mix.tagList(
),_.bind(function(e){this.targeting.tags.push(e.to_url_param())},this)),this.targeting
.nsfw=App.views.mixView.mix.get("nsfw"),this.targeting.mix_id=App.views.mixView.mix
.id):(this.targeting.nsfw=PAGE.mix.nsfw?!0:!1,this.targeting.tags.push("dj_"+PAGE
.mix.user.web_path.replace("/","")),_.each(PAGE.mix.tag_list_cache.split(", "),_.
bind(function(e){this.targeting.tags.push(e.to_url_param())},this))):App.currentPage=="user"?
App.views.userProfileView:App.currentPage=="browse"&&(App.views.exploreView?this.
targeting.tags=App.views.exploreView.tags:this.targeting.tags=PAGE.tags),_.intersection
(this.targeting.tags,this.dirtyWords).length>0&&(this.targeting.nsfw=!0),$('.mix_square[data-nsfw="true"]'
).length>0&&(this.targeting.nsfw=!0),window.special_ops=this.targeting,this.targeting
.nsfw?window.special_ops.isolated=1:window.special_ops.isolated=0},setTargetingDfp
:function(){this.targeting={env:App.env,page:this.targetPage(),dj:null,mix_id:null
,gender:null,age_group:null,tags:[],nsfw:"false",first_impression:"false"},App.currentPage=="mix"?
App.views.mixView?(this.targeting.dj=App.views.mixView.mix.get("user").login,this
.targeting.tags=App.views.mixView.mix.tagList(),this.targeting.nsfw=App.views.mixView
.mix.get("nsfw")?"true":"false",this.targeting.mix_id=App.views.mixView.mix.id):(
this.targeting.dj=PAGE.mix.user.login,this.targeting.tags=PAGE.mix.tag_list_cache
.split(", "),this.targeting.nsfw=PAGE.mix.nsfw?"true":"false",this.targeting.mix_id=
PAGE.mix.id):App.currentPage=="user"?(App.views.userProfileView?this.targeting.dj=
App.views.userProfileView.user.login:this.targeting.dj=PAGE.user.login,this.targeting
.nsfw=$('.mix_square[data-nsfw="true"]').length>0?"true":"false"):App.currentPage=="browse"?
App.views.exploreView?this.targeting.tags=App.views.exploreView.tags:this.targeting
.tags=PAGE.tags:App.currentPage=="collection"?this.targeting.nsfw=App.views.collectionEditView
.collection.get("nsfw"):App.currentPage=="track"&&(this.targeting.nsfw=_.contains
(["Sky Ferreira"],$("#track_info .a").text().trim())?"true":"false",this.targeting
.nsfw==0&&(this.targeting.nsfw=$('.mix[data-nsfw="true"]').length>0?!0:!1)),this.
targeting.tags&&this.targeting.tags.length>0&&(this.targeting.tags=this.cleanValues
(this.targeting.tags)),this.targeting.dj&&(this.targeting.dj=this.cleanValue(this
.targeting.dj));if(App.Sessions.loggedIn()){this.targeting.gender=App.Trax.currentUser
.get("gender");if(!this.targeting.age_group&&App.Trax.currentUser.get("dob_year")
){var e=(new Date).getFullYear()-App.Trax.currentUser.get("dob_year")-1,t=[[13,"Under 13"
],[18,"13-17"],[21,"18-20"],[25,"21-24"],[30,"25-29"],[35,"30-34"],[45,"35-44"],[55
,"45-54"],[65,"55-64"],[1e3,"Over 65"]],n=_.find(t,function(t){return e<t[0]});this
.targeting.age_group=n[1]}}typeof window.ParsedLocation.urlParams["test_mode"]!="undefined"&&
(this.targeting.test_mode=window.ParsedLocation.urlParams.test_mode),window.special_ops=
this.targeting,this.targeting.nsfw?window.special_ops.isolated=1:window.special_ops
.isolated=0},targetPage:function(){return App.currentPage=="home_logged_in"||App.
currentPage=="home_returning"||App.currentPage=="home_segmented"||App.currentPage=="home_first_time"?"home"
:App.currentPage},clearAds:function(){return!0},cleanValue:function(e){return e.replace
(/[\"\'=!+#*~;\^\(\)<>\[\]]+/ig,"")},cleanValues:function(e){return _.collect(e,this
.cleanValue)},showOverlay:function(e){if(this.waitingForOverlay&&!e)return;TraxClientStorage
.get("saw_overlay")&&Date.now()-TraxClientStorage.get("saw_overlay")<OVERLAY_TIMEOUT&&!
e&&console.log("[ADS] waiting to show overlay"),this.waitingForOverlay=!0;var t=$
("#web_overlay_container");t.length==0?(t=$('<div id="web_overlay_container"></div>'
),$("body").append(t),t.html('<div id="web_overlay" data-slot-name="Web_Overlay" data-size="overlay_oop"></div><a href="#" class="close"><span class="i-x"></span></a>'
),this.adSlots.web_overlay||(this.adSlots.web_overlay=this.createProperSlot($("#web_overlay"
)))):ProperMedia.ad_project.refreshSlotByName("8tracks_overlay_oop")},showStickyAd
:function(){if(window.outerHeight<640||window.outerWidth<900)return!1;this.adSlots
.sticky_player_ad?ProperMedia.ad_project.refreshSlotByName("8tracks_engager"):this
.adSlots.sticky_player_ad=this.createProperSlot($("#sticky_player_ad"))||!0,$("#sticky_player_box"
).show()},closeStickyAd:function(){this.adSlots.sticky_player_ad&&delete this.adSlots
.sticky_player_ad,$("#sticky_player_box").hide()},onFocus:function(){this.refreshSidebarAd
()},dirtyWords:["sex","smoke","nsfw","sexy","kink","daddy","femdom","lesbian","lolita"
]})}),define("views/app_view",["global_trax","views/trax_view","lib/jsonh.jquery"
,"lib/client_storage","hgn!templates/layouts/browse","hgn!templates/layouts/_home_logged_in"
,"hgn!templates/layouts/_home_segmented","hgn!templates/layouts/_collection","hgn!templates/layouts/_news_feed"
],function(e,t,n,r,i,s,o,u,a){var f=t.extend({initialize:function(){_.bindAll(this
,"showMixView","showNewsFeedView","showDashboardView","showBrowseView","showSearchView"
,"showCollectionView","showFavoriteTracksView","showUserView","cancel","showNotificationsView"
,"_renderMixOrFollowRedirect","showMixStatsView","showOnboarding","showBlogView","showSubscriptionView"
)},loadViewData:function(t,r,i,s,o){this.cancel(),PAGE.serverRendered=!1,delete this
.json,s||this.loadingState(!0);var u=function(e){ParsedLocation.init(),this.json=
e,i(e)};u=_.bind(u,this);var a=function(t,n){this.loadingState(!1);if(typeof o=="function"
)return o();t&&t.status&&t.status!=200&&e.update_flash({notices:"Sorry, something went wrong loading that page."
})};a=_.bind(a,this),this.request=n.now(t,r,u,{error:a})},closeView:function(){$.
facebox.close(),App.currentView&&App.currentView.close(),App.views.mastheadView&&
(console.log("closing masthead view"),App.views.mastheadView.close({keepDomElement
:!0})),App.views.adsView&&App.views.adsView.resetAds(),this._deleteDormantViews()
,this._cleanupDOM(),this.loadingState(!1)},_deleteDormantViews:function(){_.each(
this.dormantViews(),function(e){delete App.views[e]})},_cleanupDOM:function(){$("#sidebar, #plus_header"
).remove(),$("#site_header").show(),$("#main").html('<div id="belly"><div id="content"></div><div id="sidebar"></div></div>'
),$("#interstitial_container, #headerboard, #superheader_box, .prWrap").empty(),$
("#page_description").hide(),$("#body_overlay, .dropdown").removeClass("visible")
,$("#legacy_container").removeClass("container")},dormantViews:function(){var e=[
];return _.each(App.views,function(t,n){t.dormant===!0&&e.push(n)}),e},loadingState
:function(e){e?($("#loading-stripe").show(),$("#loadingbar").addClass("waiting").
width(50+Math.random()*30+"%")):($("#loadingbar").width("100%"),_.delay(function(
){$("#loading-stripe").fadeOut(500,function(){$("#loadingbar").removeClass("loading"
).width("0%")})},200));return},showView:function(e,t){App.currentView=e,App.currentView
.render(t),scrollTo(0,0)},trackPageview:function(){if(App.Events){var e=window.location
.pathname+window.location.search,t;if(App.currentPage=="mix"){var n=App.views.mixView?
App.views.mixView.mix.id:PAGE.mix.id;t={mix_id:n}}else if(App.currentPage=="browse"
){t={};var r=[];App.views.exploreView?(r=App.views.exploreView.tags,t.sort=App.views
.exploreView.sort):PAGE.serverRendered&&(t.sort=PAGE.sort,r=PAGE.tags),r[0]&&(t.tag1=
r[0]),r[1]&&(t.tag2=r[1]),r[2]&&(t.tag3=r[2]),r[3]&&(t.tag4=r[3]),r[4]&&(t.tag5=r
[4])}App.Events.pageView(App.currentPage,e,t)}},updateTitle:function(e){var t=App
.views.mixPlayerView&&App.views.mixPlayerView.mixPlayer.playing?"► ":"";document.
title=t+e+" | 8tracks | Handcrafted internet radio"},refreshAds:function(){App.views
.adsView?(App.views.adsView.fillEmptyAds(!0),App.views.adsView.refreshExistingAds
()):$(".sidebar_ad_wrapper").hide()},cancel:function(){this.request&&this.request
.abort()},loadMixView:function(t){if(App.views.mixView&&t.match(App.views.mixView
.mix.get("web_path"))){t.match(/\/edit$/)?App.views.mixView.switchToEditView():App
.views.mixView.mixEditView&&App.views.mixView.mixEditView.unEditMode();return}App
.views.adsView&&e.showAds()&&!t.match("play=1")&&App.views.adsView.showOverlay(),
this.loadViewData(t,{include:"description_html,likes_count,user_with_followed,genres,artist_tags"
},this._renderMixOrFollowRedirect),require(["pages/mixes_show"]),!window.dummySound&&!
App.views.mixPlayerView&&(window.dummySound=soundManager.createSound({id:"silence"
,url:"about:blank"}),window.dummySound.load(),window.dummySound.play())},_renderMixOrFollowRedirect
:function(){if(this.json&&this.json.mix)return this.showMixView();if(!this.json)return;
var e=ParsedLocation.parse(window.location.href),t=e.urlHashParams.s,n="/";return!
t||(n="/explore/q/"+t),this.json.mix_set&&!t&&(n=this.json.mix_set.web_path),App.
router.navigate(n+"#private",{trigger:!0})},showMixView:function(){if(this.json&&
App.Views.MixView){if(!this.json.mix)return!1;this.closeView();var t=App.Collections
.Mixes.load(this.json.mix);App.views.mixView=new App.Views.MixView({mix:t,user_mixes
:this.json.user_mixes,similar_mixes:this.json.similar_mixes,related_collections:this
.json.related_collections,related_blogs:this.json.related_blogs}),e.mix=t,this.showView
(App.views.mixView),App.currentPage="mix",this.updateTitle(this.json.mix.name+" by "+
this.json.mix.user.login),this.trackPageview()}},loadMixStatsView:function(e){this
.loadViewData(e,{},this.showMixStatsView),require(["pages/mixes_stats"])},showMixStatsView
:function(){this.json&&App.Views.MixStatsView&&(this.closeView(),$("#content").empty
().html('<div id="stats"></div>'),$("#sidebar").empty(),App.views.mixStatsView=new 
App.Views.MixStatsView(this.json),this.showView(App.views.mixStatsView,this.json)
,App.currentPage="stats",this.updateTitle("Stats for "+this.json.mix.name),this.trackPageview
())},loadBrowseView:function(e){var t=App.Views.ExploreView&&App.currentView instanceof 
App.Views.ExploreView;t&&App.currentView.unloadContent();var n=["likes_count","user"
,"length","artist_tags","nsfw"];e.match("recommended")&&n.push("recommended_story[reason_object]"
);var i={include:"details,mixes["+n.join(",")+"],pagination,relative_name,current_user_prefs,explore_filters"
};r.get("browse_sort")&&(i.sort=r.get("browse_sort")),this.loadViewData(e,i,this.
showBrowseView,t),require(["pages/mixes_index"])},showBrowseView:function(){if(this
.json&&App.Views.ExploreView){var t=App.Views.ExploreView&&App.currentView instanceof 
App.Views.ExploreView;t||this.closeView();var n=i({});$("#content").empty().html(
n);var r=this.json.mix_set.tags_list;App.views.exploreView=new App.Views.ExploreView
({initialTags:r}),App.currentPage="browse",this.showView(App.views.exploreView,this
.json),App.views.exploreView.afterRender(),this.updateTitle(this.json.mix_set.relative_name||"Explore"
),this.trackPageview(),this.refreshAds(),window.location.hash.match("#private")&&
e.show_private_redirection_message()}},loadSearchView:function(e){var t=App.Views
.SearchView&&App.currentView instanceof App.Views.SearchView;this.loadViewData(e,
{},this.showSearchView,t),require(["pages/search_results"])},showSearchView:function(
){this.json&&App.Views.SearchResultsView&&(this.closeView(),$("#content").empty()
.html('<div id="search_page"></div>'),App.views.searchResultsView=new App.Views.SearchResultsView
,this.showView(App.views.searchResultsView,this.json),App.views.searchResultsView
.afterRender(this.json),App.currentPage="search",this.trackPageview(),this.refreshAds
(),window.location.hash.match("#private")&&e.show_private_redirection_message())}
,loadCollectionView:function(e){var t="details,user[profile+location_summary],mixes[likes_count,length,artist_tags],pagination,mix_cluster,length"
;this.loadViewData(e,{include:t},this.showCollectionView),require(["pages/collection_edit"
])},showCollectionView:function(){if(this.json&&App.Views.CollectionEditView){this
.closeView(),$("#content").empty().html(u({}));var e=new App.Models.Collection(this
.json.collection);App.views.collectionEditView=new App.Views.CollectionEditView({
collection:e}),this.showView(App.views.collectionEditView,this.json),App.views.collectionEditView
.appendItems(App.views.collectionEditView.renderItems()),App.views.collectionEditView
.afterRender(),App.currentPage="collection",this.updateTitle(this.json.collection
.name),this.trackPageview(),this.refreshAds()}},loadHomepageView:function(e,t){App
.Sessions.logged_in()?this.loadDashboardView("/"):this.loadHomeLoggedOutView("/")
},loadDashboardView:function(e,t){t||this.loadViewData("/",{},this.showDashboardView
);if(App.Views.DashboardView){this.showDashboardView();return}require(["views/dashboard_view"
],_.bind(function(e){App.Views.DashboardView=e,this.showDashboardView()},this))},
showDashboardView:function(){this.json&&App.Views.DashboardView&&(this.closeView(
),this.loadingState(!1),$("#content").html(o()),App.currentView=App.views.dashboardView=new 
App.Views.DashboardView(this.json),App.currentPage="home_beta",this.showView(App.
views.dashboardView,this.json),this.updateTitle("Home"),this.trackPageview())},loadHomeLoggedOutView
:function(e){var t=$.Deferred(),n=$.Deferred();this.loadViewData("/",function(e){
t.resolve(e)}),require(["views/home_first_time_view"],function(e){n.resolve(e)}),
$.when(t,n).done(_.bind(function(e,t){this.closeView(),$("#belly").html('<div id="background_video_box"><div id="home_first_time"><div id="homepage_body" class="container first_time_home">  <div id="headerboard" class="advertisement" data-size="hpto" data-slot-name="HPTO" style="display: none;"></div>  <div id="featured_collection"></div>  <div id="mix_cluster"></div></div>'
),App.currentPage="home",App.views.homeFirstTimeView=new t,this.showView(App.views
.homeFirstTimeView,e),this.updateTitle("Home"),this.trackPageview()},this))},loadMixSetView
:function(e){var t=["likes_count","user","length","artist_tags"],n={include:"details,mixes["+
t.join(",")+"],pagination,current_user_prefs"},r=$.Deferred(),i=$.Deferred();this
.loadViewData(e,n,function(e){r.resolve(e)}),require(["views/mix_set_view"],function(
e){App.Views.MixSetView=e,i.resolve(e)}),$.when(r,i).done(_.bind(function(e,t){this
.closeView(),App.currentPage="mix_set",$("#belly").html('<div class="container"><div class="row"><div id="mix_set"></div></div></div>'
),App.views.mixSetView=new t({mix_set:e.mix_set,showTitle:!0,showAds:!0,el:"#mix_set"
}),this.showView(App.views.mixSetView,e),this.updateTitle(e.mix_set.name),this.trackPageview
()},this))},loadNewsFeedView:function(e){this.loadViewData("/news-feed",{include:"web+pagination+stories_count"
,page:e},this.showNewsFeedView,!1),require(["pages/news_feed"])},showNewsFeedView
:function(){if(!App.Views.NewsFeedView||!this.json||!this.json.news_feed)return;$
("#belly").html(a),App.views.newsFeedView=new App.Views.NewsFeedView(this.json.news_feed
),App.views.newsFeedView.render(),App.currentView=App.views.newsFeedView,this.loadingState
(!1),App.currentPage="feed",this.updateTitle("Playlists by DJs you follow"),this.
trackPageview(),this.refreshAds()},loadNotificationsView:function(){this.loadViewData
("/notifications",{},this.showNotificationsView,!1),require(["pages/notifications"
])},showNotificationsView:function(){if(!App.Views.NotificationsView||!this.json||!
this.json.notifications)return;this.closeView(),$("#content").html('<div class="container"><div class="row"><div class="col-md-12"><br /><h1>Notifications</h1><div id="notifications"></div><div style="display: none;" class="large-spinner" id="stories-spinner"></div></div></div></div>'
),App.views.notificationsView=new App.Views.NotificationsView(this.json.news_feed
),this.showView(App.views.notificationsView,this.json),this.loadingState(!1),App.
currentPage="feed",this.updateTitle("Notifications"),this.trackPageview(),this.refreshAds
()},loadFavoriteTracksView:function(e){this.loadViewData(e,{include:"user[profile+location_summary]+pagination"
},this.showFavoriteTracksView,!1),require(["pages/favorite_tracks"])},showFavoriteTracksView
:function(){this.json&&App.Views.FavoriteTracksView&&(this.closeView(),$("#content"
).html('<div id="favorite_tracks"><ul class="tracks big_tracks playlist"></ul></div>'
),App.views.favoriteTracksView=new App.Views.FavoriteTracksView({favorites:{tracks
:this.json.tracks,pagination:this.json.pagination,user:this.json.user},user:this.
json.user,rendered:!1,mini_player:!1}),this.showView(App.views.favoriteTracksView
,this.json),this.loadingState(!1),App.currentPage="favorite_tracks",this.updateTitle
("Favorite Tracks"),this.trackPageview(),this.refreshAds())},loadUserView:function(
e){this.loadViewData(e,{include:"profile_counts"},this.showUserView,!1,_.bind(function(
){this.loadHTML(e)},this)),require(["pages/users_show"])},showUserView:function()
{if(this.json&&App.Views.UserProfileView){if(!this.json.user)return this.loadHTML
(window.location.pathname),!1;this.closeView(),App.views.userProfileView=new App.
Views.UserProfileView({user:this.json.user}),this.showView(App.views.userProfileView
,this.json),App.currentPage="user",this.updateTitle(this.json.user.login),this.trackPageview
(),this.refreshAds()}},loadHTML:function(t,n){return this.cancel(),this.loadingState
(!0),$.ajax(t,{success:_.bind(function(e){this.loadingState(!1),this.closeView();
var r=$(e);$("#belly").replaceWith(r.find("#belly"));var i=e.match("<title>(.*?)</title>"
)[1];this.updateTitle(i),t=="mix_madness"?require(["pages/mix_madness"]):App.currentPage="other"
,scrollTo(0,0),typeof n=="function"&&n()},this),error:_.bind(function(t){this.loadingState
(!1),e.update_flash({notices:"Sorry, something went wrong loading that page."})},
this)})},loadNSFW:function(){this.cancel();var e=$.Deferred(),t=$.Deferred();this
.loadHTML("/nsfw",function(){e.resolve()}),require(["views/nsfw_view"],function(e
){t.resolve(e)}),$.when(e,t).done(function(e,t){App.currentView=App.views.nsfwView=new 
t})},loadOnboarding:function(){App.router.navigate("/home/onboarding",{trigger:!1
}),require(["views/onboarding_view"],this.showOnboarding)},showOnboarding:function(
e){App.Views.OnboardingView||(App.Views.OnboardingView=e),this.closeView(),App.views
.onboardingView=new e({}),this.showView(App.views.onboardingView,{}),App.currentPage="onboarding"
,this.updateTitle("Welcome to 8tracks"),this.trackPageview()},loadBlogView:function(
e){this.loadViewData(e,{},this.showBlogView),require(["views/blog_view"],_.bind(function(
e){App.Views.BlogView=e,this.showBlogView()},this))},showBlogView:function(){this
.json&&App.Views.BlogView&&(this.closeView(),$("#content").empty(),$("#sidebar").
empty(),App.views.blogView=new App.Views.BlogView(this.json),this.showView(App.views
.blogView,this.json),App.currentPage="blog",this.updateTitle(this.json.blog.title
),this.trackPageview())},loadSubscriptionView:function(e){return this.cancel(),this
.loadingState(!0),$.ajax(e+"?lightbox=1"+e.split("?")[1],{success:_.bind(function(
e){var t=$(e);$.facebox(t.find("#content").removeClass("clearfix"),{flush:!0}),this
.json={subscription:!0},this.showSubscriptionView()},this)}),require(["views/subscription_view"
],_.bind(function(e){App.Views.SubscriptionView=e,this.showSubscriptionView()},this
)),!1},showSubscriptionView:function(){this.json&&App.Views.SubscriptionView&&(this
.loadingState(!1),App.views.subscriptionView=new App.Views.SubscriptionView({lightbox
:!0}),window.gRecaptchaCallback=function(e){App.views.subscriptionView.gRecaptchaCallback
(e)})}});return f}),define("views/trax_view",["lib/sessions","lib/carousel"],function(
e){return Backbone.View.extend({close:function(e){_.isUndefined(e)&&(e={}),e=_.defaults
(e,{keepDomElement:!1}),this.childViews&&_.each(_.compact(this.childViews),function(
e){e.close()}),e.keepDomElement?this.cleanupElement():this.remove(),this.unbind&&
this.unbind(),this.onClose&&this.onClose(),this.dormant=!0},cleanupElement:function(
){this.$el.empty(),this.undelegateEvents()},whenUserReadyOrChanged:function(t){e.
whenUserReadyOrChanged(t,this)},afterRender:function(){}})}),define("initializer"
,["lib/jsonh.jquery","lib/events","lib/router","lib/trax_utils","views/login_view"
,"views/signup_view","views/auth_nav_view","views/autocomplete_view","views/safe_browse_view"
,"views/ads_view","views/app_view","lib/sessions","global_trax","lib/traxhead","lib/client_storage"
],function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d){function b(e){if(e.data("method")!=="delete"
)return;var t=e.data("confirm");if(t===undefined||confirm(t)){var n=$('<form method="post" action="'+
e.attr("href")+'"></form>'),r='<input name="_method" value="delete" type="hidden" />'
;n.hide().append(r).appendTo("body"),n.submit()}return!1}function w(e){if(e.target
.activeElement.nodeName=="IFRAME"&&App.Trax.mixPlayer&&App.Trax.mixPlayer.isPlaying
())return"Playback will be interrupted! Proceed?"}var v=function(){var e=cookie.get
("initial_source");return e||ParsedLocation.parsedReferrerUrl&&ParsedLocation.parsedReferrerUrl
.host!=="8tracks.com"&&(e=ParsedLocation.parsedReferrerUrl.host,cookie.set("initial_source"
,e)),e},m=function(){var e=_.keys(ParsedLocation.urlHashParams),t=_.contains(e,"private"
);t&&h.show_private_redirection_message()},g=function(){$.facebox.settings.opacity=.36
,$.facebox.settings.loadingImage="/assets/spinner/spinner-large.gif",$.facebox.settings
.closeImage="/assets/buttons/closelabel.png",$.facebox.html='      <div id="facebox" style="display:none;">       <div class="popup">         <div class="content">         </div>         <a href="#" class="close"><img src="/assets/buttons/closelabel.png" title="close" class="close_image" /></a>       </div>     </div>'
,$("a[rel*=facebox]").facebox()};h.showLoginView=function(e){return App.views.loginView=new 
i(e||{}),App.views.loginView.show(e||{}),!1},h.showSignupView=function(e){return App
.views.signupView=new s(e||{}),App.views.signupView.show(),!1},h.showAuthNavView=
function(){App.views.authNavView=new o({el:"#thin_header"}),App.views.authNavView
.render()};var y=function(e){$("body").on("click","a",function(e){if(e.altKey||e.
ctrlKey||e.metaKey||e.shiftKey||this.getAttribute&&this.getAttribute("href").match
(/^#/))return!0;if(this.rel.match("external")||this.rel==="me"){this.target="_blank"
,this.className.match("buy")?t.buyTrack(this.hostname.match(/[^.]+\.[^.]+$/)):t.clickExternalLink
(this.href);return}if(!c.loggedIn()){var n={};if(this.rel==="login_required")return this
.pathname!="/login"&&(n.attempted_path=this.href),h.showLoginView(n),!1;if(this.rel
.match("signup_required"))return this.pathname!="/signup"&&(n.attempted_path=this
.href),h.showSignupView(n),!1}if(this.rel==="popup"){if(this.href.match(/\/auth\/facebook$/
)&&window.navigator.userAgent.match(/android/i)){var r=this.href+"?attempted_path="+
(PAGE.attempted_path||window.location.pathname)+"&display=touch";return window.location=
r,!1}var i=$(this),s="popup";i.data("win-name")&&(s=i.data("win-name"));var o=500
;parseInt(i.data("win-height"),10)&&(o=i.data("win-height"));var u=500;parseInt(i
.data("win-width"),10)&&(u=i.data("win-width")),console.log("opening popup",this.
href);var a=window.open(this.href,s,"height="+o+",width="+u);return window.focus&&
a.focus(),!1}if(this.rel=="play_page")return h.play_page(),!1;var f=$(this);if(f.
data("track")==="true"||f.data("track")===!0){var l=f.data(),p="click",d={};for(key in 
f.data())if(key==="event_name"&&(l[key]!=""||!_.isNull(l[key])||!_.isUndefined(l[
key])))p=l[key];else{if(!key.match(/^event_properties_/))continue;var v=key.replace
(/^event_properties_/,"");d[v]=l[key]}!_.isNull(p)&&!_.isUndefined(p)&&App.Events
.trackClick(p,d)}return this.hostname==window.location.hostname&&!PAGE.noHistory?
(this.pathname=="/plus"?App.views.appView.loadSubscriptionView("/plus"):App.router&&
App.router.navigate(this.pathname+this.hash,{trigger:!0}),!1):h.mixPlayer&&h.mixPlayer
.isPlaying()?(this.target="_blank",!0):b(f)})},E=function(){try{(d.get("hide_welcome_text"
)||App.env=="development")&&$("#page_description").hide()}catch(e){throw"Error in hide_seo_text() "+
e}},S=function(){window.location.href.match("no_mobile_ui")&&cookie.set("no_mobile_ui"
,"temp",{expires:""})};return self.init=function(){var e=v();m(),c.onPageLoad(),g
(),y(),h.hide_flash_notices(),E(),S(),h.showAuthNavView();var t=new a({});App.views
.autocompleteView=new u({el:"#search",endpoint:"/search/combined_autocomplete.jsonh"
,autoSelect:"exact_match_only",queryOptions:{tags_per_page:6,mixes_per_page:3,users_per_page
:3}}),$(document).ready(function(){h.isReady=!0,h.showAds()&&(App.views.adsView=new 
f({}),App.views.dfpView=App.views.adsView),App.views.appView=new l,App.router=new 
n({appView:App.views.appView}),App.views.appView.trackPageview(),App.router.on("route"
,function(e,t){jQuery("sellwild").removeAttr("observed")});if(!PAGE.noHistory){var e=!0
;window.location.hash.length>1&&(window.history&&window.history.pushState&&window
.history.replaceState?window.history.replaceState({},document.title,window.location
.pathname+window.location.search):e=!1),Backbone.history.start({pushState:!0,silent
:e,hashChange:!0})}else Backbone.history.start({pushState:!1,hashChange:!1,silent
:!0});window.addEventListener("beforeunload",w),$(window).on("scroll",_.throttle(
function(){$("#thin_header").toggleClass("stuck",window.scrollY>0)},50))})},self.
init(),self});