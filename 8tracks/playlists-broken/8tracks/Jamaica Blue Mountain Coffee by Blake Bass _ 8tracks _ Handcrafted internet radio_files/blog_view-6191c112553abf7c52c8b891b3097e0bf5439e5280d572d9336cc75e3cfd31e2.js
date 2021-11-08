define("lib/client_storage",[],function(){return TraxClientStorage}),define("global_trax"
,["lib/client_storage"],function(e){function r(e){return _.isObject(e)?_.map(e,function(
e,t){return _.map(e,function(e){return t.charAt(0).toUpperCase()+t.slice(1)+" "+e+"."
})}):e}if(typeof App.Trax!="undefined")return App.Trax;var t=App.Trax={};t.View=Backbone
.View.extend({});var n;t.hide_flash_timer=function(e){e=e||1e4,n=setTimeout(function(
){$(".flash_container").slideUp()},e)},t.hide_flash_error=function(){$(".flash_container"
).slideUp()},t.hide_flash_notices=function(){$(".flash_container ul.notices").size
()>0&&$(".flash_container ul.errors").size()===0&&t.hide_flash_timer()},t.show_flash_error=
function(e,n){t.update_flash({errors:e},6e4),n&&t.hide_flash_timer()},t.show_flash_error_with_timeout=
function(e,n){t.update_flash({errors:e},n)},t.show_private_redirection_message=function(
){t.show_flash_error("Oops! It looks like the mix you are trying to listen to is not currently available. In the meantime, check out these playlists."
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
)},t}),define("lib/traxhead",[],function(){if(typeof App.Traxhead!="undefined")return App
.Traxhead;var e=App.Traxhead={};return e.looksLoggedIn=function(){return!!document
.cookie.match("auth_token")},e.initFbAppId=function(t){t=_.extend({music:!1},t),FB
.init({appId:"166738216681933",status:!0,channelUrl:"//8tracks.com/channel.html",
cookie:!0,xfbml:!0,music:t.music,oauth:!0}),setTimeout(function(){e.FbLoaded=!0},500
)},e.onFbInit=function(){try{e.initFbAppId(),ParsedLocation.urlParams.load_fb_bridge&&
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
}),function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=
function(){},Class.extend=function(n){function o(){!e&&this.initialize&&this.initialize
.apply(this,arguments)}var r=this.prototype;e=!0;var i=new this;e=!1;for(var s in 
n)i[s]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,
t){return function(){var n=this._super;this._super=r[e];var i=t.apply(this,arguments
);return this._super=n,i}}(s,n[s]):n[s];return o.prototype=i,o.constructor=o,o.extend=
arguments.callee,o}}(),define("jquery.class",function(e){return function(){var t,
n;return t||e.window.Class}}(this)),define("lib/jsonh.jquery",["jquery.class","global_trax"
],function(e,t){var n=function(){var n={},r=function(e,t,n,r,s){return _.isFunction
(r)||(s=r,r=n,n=t,t=null),s||(s={}),s.context=n,i(e,t,r,s)},i=function(e,t,n,r){_
.isFunction(t)&&(r=n,n=t,t=null);var i={url:e,data:t,complete:n};return r&&(i=$.extend
(i,r)),f(i)},s={},o=function(e,t,n){return n&&s[e]?!1:e(e,t,function(){n&&delete 
s[e]})},u=function(e,t,n){var r={complete:t};n=n||{};if(e.nodeName.toUpperCase()=="FORM"
)r.action="submit",r.form=e;else{if(e.nodeName.toUpperCase()!="A")throw"You must pass a <form> or an <a> tag"
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
){return r.ajax(n),!1})})}}),n()}),define("models/modules/flexible_store",["models/modules/backbone_client_storage"
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
,{data:{flagged_user_id:e},type:"POST"})}});return r}),define("lib/trax_utils",[]
,function(){var e={};return e.addCommas=function(e){e+="";var t=e.split("."),n=t[0
],r=t.length>1?"."+t[1]:"",i=/(\d+)(\d{3})/;while(i.test(n))n=n.replace(i,"$1,$2"
);return n+r},e.coolNumber=function(e){return e<500?e:e<1e3?e.toString().substr(0
,1)+e.toString().substr(1,9):e<=5e3?e.toString().substr(0,1)+","+e.toString().substr
(1,9):Math.floor(e/1e3)+",000+"},e.toUrlParam=function(e){if(_.isString(e))return encodeURIComponent
(e.replace(/_/g,"__").replace(/\s/g,"_").replace("+","&&")).replace(/\//g,"%2F").
replace(/\./g,"%5E")},e.capitalizeFirstLetter=function(e){return e.charAt(0).toUpperCase
()+e.slice(1)},e.toTitleCase=function(e){return e.replace(/\w\S*/g,function(e){return e
.charAt(0).toUpperCase()+e.substr(1).toLowerCase()})},e}),define("lib/events",["lib/client_storage"
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
("Collection","AddMix",e?e.id:null)}};return s.init(),s}),define("lib/sessions",["global_trax"
,"lib/traxhead","lib/client_storage","models/user","lib/events","lib/jsonh.jquery"
],function(e,t,n,r,i,s){if(typeof App.Sessions!="undefined")return App.Sessions;var o=
App.Sessions={};return _.extend(o,Backbone.Events,{whenUserReadyOrChanged:function(
t,n){e.currentUser&&_.defer(t,e.currentUser),n&&n.listenTo(o,"sessions:user_changed"
,t)},_onUserChanged:function(){this.trigger("sessions:user_changed",e.currentUser
)},onPageLoad:function(){t.looksLoggedIn()?this.tryToSetCurrentUserFromPage()||this
.tryToSetCurrentUserFromStorage()||this.tryToSetCurrentUserFromBackend():this.getCountryCode
(),this.logoutUserIfAuthenticationFailed(),setInterval(_.bind(this.tryToSetCurrentUserFromBackend
,this),48e4)},logoutUserIfAuthenticationFailed:function(){PAGE.failed_authentication&&
PAGE.failed_authentication.length>0&&this.unsetCurrentUser()},tryToSetCurrentUserFromPage
:function(){if(PAGE.currentUser)return this.setCurrentUserByAttributes(PAGE.currentUser
)},tryToSetCurrentUserFromStorage:function(){var t=n.get("currentUserId");return t?
(n.get("Users-"+t)?e.currentUser=new r(n.get("Users-"+t)):e.currentUser=new r({id
:n.get("currentUserId")}),e.currentUser.fetch({success:_.bind(function(){this._onCurrentUserSet
(!0)},this)}),!0):!1},reloadIfOutdated:function(){if(!e.currentUser.get("last_logged_in"
)||Date.now()-Date.parse(e.currentUser.get("last_logged_in"))>48e4)this.tryToSetCurrentUserFromBackend
(),this.updateNotifications()},updateNotifications:function(){s.now("/users/"+e.currentUser
.id+"/notifications_count",_.bind(function(t){t.success&&(e.currentUser.set("last_logged_in"
,new Date),e.currentUser.set(t.user),e.currentUser.localSave(),this._onCurrentUserSet
(!0))},this))},tryToSetCurrentUserFromBackend:function(e){s.now("/users/current",
{include:"recent_mixes,web_preferences,tracking_settings"},_.bind(function(t){t.success?
(t.user.last_logged_in=new Date,this.setCurrentUserByAttributes(t),typeof e=="function"&&
e.call()):this.getCountryCode()},this),{unauthorized:function(){}})},getCountryCode
:function(){var e=cookie.get("country_code3");e&&e.length>0&&typeof WEB_SETTINGS=="Object"&&
e==WEB_SETTINGS["country_code"]?this.onCountryCodeSet(e):$.ajax({url:"/users/current_country_code.jsonh"
,success:_.bind(function(e){var t=new Date;t.setTime(t.getTime()+36e5),cookie.set
("country_code3",e.web_settings.country_code,{expires:t.toGMTString()}),WEB_SETTINGS=
e.web_settings,this.onCountryCodeSet(e.web_settings.country_code)},this)})},onCountryCodeSet
:function(t){if(!t)return;if(!e.regionallyBlocked(t)||e.currentUser&&e.currentUser
.isJuniorModerator())return;$("body").addClass("international"),this.showInternationalMessage
()},showInternationalMessage:function(){_.include(["mix","home","home_first_time"
,"browse"],App.currentPage)&&$(".international_message").length===0&&!cookie.get("intl_ack"
)&&$("#youtube_player").before('<div class="international_message"><div class="container clearfix"><div class="row"><div class="col-md-12"><div class="message"><span class="i-warning"></span> Unfortunately, some music can’t be played on 8tracks in your area right now. <a href="http://blog.8tracks.com/2016/02/12/a-change-in-our-international-streaming/" target="_blank">Learn more &rarr;</a><a href="#" style="float: right;" onclick="$(\'.international_message\').hide(); window.cookie.set(\'intl_ack\', \'1\'); return false;"><span class="i-x"></span></a></div></div></div></div></div>'
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
this.isOwner(e)||!!this.isAdmin()}}),o}),define("lib/carousel",[],function(){return{
onCarouselClick:function(e){$(e.currentTarget).addClass("checked").siblings().removeClass
("checked"),this.animateCarousels()},animateCarousels:function(){this.carouselTimers||
(this.carouselTimers=[]);var e=$(".carousel_slider");for(i=0;i<=e.length;i++)this
.animateCarousel(i,e[i]);$(".slider__nav").click(_.bind(this.onCarouselClick,this
))},animateCarousel:function(e,t){clearInterval(this.carouselTimers[e]),this.carouselTimers
[e]=setInterval(function(){var e=$(t).children("input.checked").first();e.removeClass
("checked");var n=e.next("input");n.length==0&&(n=$(t).children("input").first())
,n.attr("checked",!0).addClass("checked")},5e3)}}}),define("views/trax_view",["lib/sessions"
,"lib/carousel"],function(e){return Backbone.View.extend({close:function(e){_.isUndefined
(e)&&(e={}),e=_.defaults(e,{keepDomElement:!1}),this.childViews&&_.each(_.compact
(this.childViews),function(e){e.close()}),e.keepDomElement?this.cleanupElement():
this.remove(),this.unbind&&this.unbind(),this.onClose&&this.onClose(),this.dormant=!0
},cleanupElement:function(){this.$el.empty(),this.undelegateEvents()},whenUserReadyOrChanged
:function(t){e.whenUserReadyOrChanged(t,this)},afterRender:function(){}})}),define
("lib/_template_helpers",["global_trax","lib/trax_utils"],function(e,t){var n=function(
e){this.initTplParams(e)};return n.prototype.initTplParams=function(e){_.extend(this
,e)},n.prototype.escape=function(){return function(e){return escape(this[e])}},n.
prototype.mix_cover_url=function(){return function(e){return n.prototype.imgix_url
(e,this.cover_urls)}},n.prototype.mixpage_mix_cover_url=function(e,t){return n.prototype
.mix_cover_url(e)},n.prototype.avatar_url=function(){return function(e){return n.
prototype.imgix_url(e,this.avatar_urls)}},n.prototype.mix_cover_img=function(){var e=
this.cover_urls;return function(t){return'<img src="'+n.prototype.imgix_url(t,e)+'" class="cover" alt="'+
_.escape(this.name)+'"  />'}},n.prototype.avatar_img=function(){var e=this.avatar_urls
;return function(t){return'<img src="'+n.prototype.imgix_url(t,e)+'" class="avatar" alt="'+
_.escape(this.login)+'"/>'}},n.prototype.external_img=function(){return function(
e){return args=e.split(/,\s*/),src_name=args[0],size=args[1],src=this[src_name],window
.dpr!==undefined&&window.dpr>1&&(size*=2),'<img src="'+external_image_url(src,size
)+'" class="artist_photo" width="'+size+'"/>'}},n.prototype.mix_set_sort_path=function(
){return function(e){return this.web_path.match(/(\/recent|\/popular|\/hot)/)?this
.web_path.replace(/(\/recent|\/popular|\/hot)/,e):this.web_path+e}},n.prototype.sort_name=
function(){return{hot:"Trending","new":"Newest",recent:"Newest",popular:"Popular"
}[this.sort]},n.prototype.dj_mode=function(){return this.smart_type=="dj"},n.prototype
.collection_mode=function(){return this.smart_type=="collection"},n.prototype.cool_number=
function(){return function(e){return t.coolNumber(this[e])}},n.prototype.human_number=
function(){return function(e){return t.addCommas(this[e])}},n.prototype.human_date=
function(){return function(e){var t=this[e]!==null?this[e]:"";return n.prototype.
human_date_value()(t)}},n.prototype.human_date_value=function(){return function(e
){var t="";if(e){if(e.match("TZ|T")){var n=e.split(/[-TZ]/);t=new Date(Date.parse
(n.slice(0,3).join("/")+" "+n[3]))}else t=new Date(Date.parse(e));var r=["January"
,"February","March","April","May","June","July","August","September","October","November"
,"December"];return r[t.getUTCMonth()]+" "+t.getDate()+", "+t.getFullYear()}return""
}},n.prototype.human_duration=function(){return function(e){var t=this[e];return t==0?"0min"
:_.compact(_.collect([[60,"sec"],[60,"min"],[24,"hr"],[1e3,"d"]],function(e){if(t>0
){var n=t%e[0];t=(t-n)/e[0];if(e[1]!="sec")return n+e[1]}})).reverse().join(" ")}
},n.prototype.dynamic_font_size=function(){var e=this.login;if(!e)return;var t=[[18
,16],[15,18],[12,20],[10,24],[8,25],[6,26],[1,28]];for(var n=0;n<t.length;n++){var r=
t[n];if(e.length>=r[0])return r[1].toString()+"px"}},n.prototype.dynamic_font_size2=
function(){return function(e){return e.length>20?"oversize":""}},n.prototype.track_duration=
function(){var e=this.duration;return _.compact(_.collect([[60,"sec"],[60,"min"],
[24,"hr"],[1e3,"d"]],function(t){if(e>0){var n=e%t[0];return e=(e-n)/t[0],("0"+(n+
t[1])).substr(-2)}})).reverse().join(":")},n.prototype.soundcloud_year=function()
{return this.release_date.substring(0,4)},n.prototype.first_sentence=function(){return function(
e){var t=e.split(" "),n=t[0]||"";n=(n.match(/.+/g)||[]).join(" ");var r=t[1]||100
,i=_.map(n.split(". "),function(e){return e.trim()});return i[0].length>r?n.substring
(0,r)+"...":i.length>1?i[0]+".":n}},n.prototype.pluralize=function(){return function(
e){var t=e.split(" ");return this[t[0]]==1?t[1]:t[2]}},n.prototype.show_pagination=
function(){if(this.total_entries)return this.total_entries>this.per_page;if(this.
pagination)return this.pagination.total_pages>1},n.prototype.list_tags=function(e
,t){var r,i=[];if(this.tag_list_cache)r=this.tag_list_cache.split(/,\s?/);else{if(!
this.top_tags)return"";r=this.top_tags}for(var s=0;s<r.length;s++)i.push(n.prototype
.tag(r[s],!1,!1,t?"":"tag"));return i.join("")},n.prototype.list_tags_plaintext=function(
e){return n.prototype.list_tags(this,[e,!0])},n.prototype.link_top_genre=function(
){if(!this.tags_list)return"";var e="";this["tags_list"].length==1?e+=this.tags_list
[0]:this["tags_list"].length==2?e+=this.tags_list[0]+" and "+this.tags_list[1]:_.
each(this.tags_list,function(t,n){n!=this["tags_list"].length-1?e+=t+", ":e+="and "+
t},this);var n=_.collect(this.tags_list,t.toUrlParam).join("+"),r='<a href="/explore/'+
n+'">'+e+"</a>";return r},n.prototype.list_genres=function(){if(!this.genres)return""
;var e=[];for(var t=0;t<this.genres.length;t++)e.push(n.prototype.tag(this.genres
[t],!1,!1,""));return e.join("")},n.prototype.list_artists=function(){if(!this.artist_tags
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
("hogan",["require","exports","module"],function(e,t,n){var r={};(function(e,t){function a
(e){return String(e===null||e===undefined?"":e)}function f(e){return e=a(e),u.test
(e)?e.replace(n,"&amp;").replace(r,"&lt;").replace(i,"&gt;").replace(s,"&#39;").replace
(o,"&quot;"):e}e.Template=function(e,n,r,i){this.r=e||this.r,this.c=r,this.options=
i,this.text=n||"",this.buf=t?[]:""},e.Template.prototype={r:function(e,t,n){return""
},v:f,t:a,render:function(t,n,r){return this.ri([t],n||{},r)},ri:function(e,t,n){
return this.r(e,t,n)},rp:function(e,t,n,r){var i=n[e];return i?(this.c&&typeof i=="string"&&
(i=this.c.compile(i,this.options)),i.ri(t,n,r)):""},rs:function(e,t,n){var r=e[e.
length-1],i,s;typeof r=="function"&&(i=r,s=this.buf.length);if(!l(r)){n(e,t,this)
;if(i){var o=this.buf.substr(s);this.buf=this.buf.substr(0,s),bunc=this.binderator
(i,e[e.length-2]),this.b(bunc(o))}return}for(var u=0;u<r.length;u++)e.push(r[u]),
n(e,t,this),e.pop()},binderator:function(e,t){var n=Function.prototype.bind;if(e.
bind===n&&n)return n.apply(e,Array.prototype.slice.call(arguments,1));var r=Array
.prototype.slice.call(arguments,2);return function(){return e.apply(t,r.concat(Array
.prototype.slice.call(arguments)))}},s:function(e,t,n,r,i,s,o){var u;if(l(e)&&e.length===0
)return!1;var a;return typeof e=="function"&&(e=this.ms(e,t,n),typeof e=="function"&&
(a=e)),u=e===""||!!e,!r&&u&&t&&(a?t.push(a):t.push(typeof e=="object"?e:t[t.length-1
])),u},ms:function(e,t,n){var r=t[t.length-1];return e.call(r)},d:function(e,t,n,
r){var i=e.split("."),s=this.f(i[0],t,n,r),o=null;if(e==="."&&l(t[t.length-2]))return t
[t.length-1];for(var u=1;u<i.length;u++)s?(o=s,typeof s[i[u]]=="function"?s=s[i[u
]]():s=s[i[u]]||""):s="";return r&&!s?!1:(!r&&typeof s=="function"&&(t.push(o),s=
this.lv(s,t,n),t.pop()),s)},f:function(e,t,n,r){var i=!1,s=null,o=!1;for(var u=t.
length-1;u>=0;u--){s=t[u];if(s&&typeof s=="object"&&e in s){i=s[e],o=!0;break}}return o?
(!r&&typeof i=="function"&&(i=this.lv(i,t,n)),i):r?!1:""},ho:function(e,t,n,r,i){
var s=this.c,o=this.options||{};o.delimiters=i;var r=e.call(t,r);return r=r==null?
String(r):r.toString(),this.b(s.compile(r,o).render(t,n)),!1},b:t?function(e){this
.buf.push(e)}:function(e){this.buf+=e},fl:t?function(){var e=this.buf.join("");return this
.buf=[],e}:function(){var e=this.buf;return this.buf="",e},ls:function(e,t,n,r,i,
s,o){var u=t[t.length-1],a=null;if(!r&&this.c&&e.length>0)return this.ho(e,u,n,this
.text.substring(i,s),o);a=e.call(u);if(typeof a=="function"){if(r)return!0;if(this
.c)return this.ho(a,u,n,this.text.substring(i,s),o)}return a},lv:function(e,t,n){
var r=t[t.length-1],i=e.call(r);if(typeof i=="function"){i=a(i.call(r));if(this.c&&~
i.indexOf("{{"))return this.c.compile(i,this.options).render(r,n)}return a(i)}};var n=/&/g
,r=/</g,i=/>/g,s=/\'/g,o=/\"/g,u=/[&<>\"\']/,l=Array.isArray||function(e){return Object
.prototype.toString.call(e)==="[object Array]"}})(typeof t!="undefined"?t:r),function(
e){function u(e){e.n.substr(e.n.length-1)==="}"&&(e.n=e.n.substring(0,e.n.length-1
))}function a(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}function f(e,t
,n){if(t.charAt(n)!=e.charAt(0))return!1;for(var r=1,i=e.length;r<i;r++)if(t.charAt
(n+r)!=e.charAt(r))return!1;return!0}function l(e,t,n,r){var i=[],s=null,o=null;while(
e.length>0){o=e.shift();if(o.tag=="#"||o.tag=="^"||c(o,r))n.push(o),o.nodes=l(e,o
.tag,n,r),i.push(o);else{if(o.tag=="/"){if(n.length===0)throw new Error("Closing tag without opener: /"+
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
,s;return{load:o,write:f}}),define("hgn!templates/reviews/_review_form",["hogan"]
,function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<form id="new_thread_form" accept-charset="UTF-8" action="/reviews" class="new_review displaymode" method="post">'
),r.b("\n"+n),r.b('  <div class="comment clearfix">'),r.b("\n"+n),r.b('    <img src="/images/avatars_v3/sq500.png" class="avatar" />'
),r.b("\n"+n),r.b("    "),r.s(r.f("spinner",e,t,1),e,t,0,225,236,"{{ }}")&&(r.rs(
e,t,function(e,t,n){n.b("review_form")}),e.pop()),r.b("\n"+n),r.b('    <a class="submit" tabindex="41" href="#"><span class="i-annotation"></span></a>'
),r.b("\n"+n),r.b('    <div class="body">'),r.b("\n"+n),r.b('      <div style="position: relative;">'
),r.b("\n"+n),r.b('        <div class="mentions_highlights"></div>'),r.b("\n"+n),
r.b('        <textarea class="text prompt" cols="40" class="review_body" name="review[body]" rows="3" placeholder="Write a response..." tabindex="40"></textarea>'
),r.b("\n"+n),r.b('        <input type="hidden" name="review[body_encoded]" value="" />'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),r.b("        <hr />"),r
.b("\n"+n),r.b("\n"+n),r.b('      <input id="review_reviewable_id"   name="review[reviewable_id]" type="hidden" value="'
),r.b(r.v(r.f("reviewable_id",e,t,0))),r.b('" />'),r.b("\n"+n),r.b('      <input id="review_reviewable_type" name="review[reviewable_type]" type="hidden" value="'
),r.b(r.v(r.f("reviewable_type",e,t,0))),r.b('" />'),r.b("\n"+n),r.b('      <div class="validation_errors"></div>'
),r.b("\n"+n),r.b('      <div class="row clear" id="captcha_container" style="height: 0px; overflow: hidden;">'
),r.b("\n"+n),r.b('        <input type="hidden" name="g-recaptcha-response" value="" />'
),r.b("\n"+n),r.b('        <div class="g-recaptcha" data-sitekey="6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN"></div>'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),r.b("    </div>"),r.b("\n"+
n),r.b("  </div>"),r.b("\n"+n),r.b("</form>"),r.b("\n"),r.fl()},"",e,{});return n
.template=t,n}),define("hgn!templates/mixes/_mix_reviews",["hogan"],function(e){function n
(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=
this;return r.b(n=n||""),r.b('<div id="reviews">'),r.b("\n"+n),r.s(r.f("review_threads"
,e,t,1),e,t,0,40,74,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(n.rp("reviews/review_thread"
,e,t,"    "))}),e.pop()),r.b("\n"+n),r.b("  "),r.b(r.t(r.f("seo_pagination",e,t,0
))),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),
define("hgn!templates/reviews/_review",["hogan"],function(e){function n(){return t
.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r
.b(n=n||""),r.b('<div class="comment clear '),r.s(r.f("parent_id",e,t,1),e,t,0,40
,45,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("reply")}),e.pop()),r.b('" data-review_id="'
),r.b(r.v(r.f("id",e,t,0))),r.b('" data-review_user_id="'),r.b(r.v(r.f("user_id",
e,t,0))),r.b('">'),r.b("\n"+n),r.s(r.f("user",e,t,1),e,t,0,131,234,"{{ }}")&&(r.rs
(e,t,function(e,t,r){r.b('    <a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b('" rel="user">'
),r.b("\n"+n),r.b("      "),r.s(r.f("avatar_img",e,t,1),e,t,0,192,207,"{{ }}")&&(
r.rs(e,t,function(e,t,n){n.b("sq72, w=75&h=75")}),e.pop()),r.b("\n"+n),r.b("    </a>"
),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("user",e,t,1),e,t,0,258,548,"{{ }}")&&
(r.rs(e,t,function(e,t,r){r.b('      <p class="byline">'),r.b("\n"+n),r.b('        <a href="'
),r.b(r.v(r.f("web_path",e,t,0))),r.b('" class="name turquoise" data-user_id="'),
r.b(r.v(r.f("user_id",e,t,0))),r.b('">'),r.b(r.v(r.f("login",e,t,0))),r.b("</a>")
,r.b("\n"+n),r.b("        "),r.s(r.f("badge",e,t,1),e,t,0,397,402,"{{ }}")&&(r.rs
(e,t,function(e,t,n){n.b("small")}),e.pop()),r.b("\n"+n),r.b('        <span class="datetime timeago" title="'
),r.b(r.v(r.f("created_at_timestamp",e,t,0))),r.b('">'),r.s(r.f("human_date",e,t,1
),e,t,0,500,510,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("created_at")}),e.pop()),
r.b("</span>"),r.b("\n"+n),r.b("      </p>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.b
("\n"+n),r.b('    <div class="body '),r.s(r.f("parent_id",e,t,1),e,t,1,0,0,"")||r
.b("left"),r.b('">'),r.b("\n"+n),r.b("\n"+n),r.b('      <div class="body_text">')
,r.b("\n"+n),r.b("        "),r.b(r.t(r.f("body_html",e,t,0))),r.b("\n"+n),r.b('        <span class="comment_links">'
),r.b("\n"+n),r.b('          <a class="mark_as_spam icon-link"  rel="login_required" href="/reviews/'
),r.b(r.v(r.f("id",e,t,0))),r.b('/flag.jsonh" title="Flag Spam"><span class="i-flag"></span></a>'
),r.b("\n"+n),r.b('          <a class="reply_review icon-link"  rel="login_required" href="#" title="Reply"><span class="i-reply"></span></a>'
),r.b("\n"+n),r.b('          <a class="delete_review icon-link" rel="login_required" href="/reviews/'
),r.b(r.v(r.f("id",e,t,0))),r.b('.jsonh" title="Delete"><span class="i-x"></span></a>'
),r.b("\n"+n),r.b('          <a class="flag_user icon-link no_button" href="/user_flaggings" data-user_name='
),r.b(r.v(r.d("user.login",e,t,0))),r.b(" data-comment_id="),r.b(r.v(r.f("id",e,t
,0))),r.b(' data-user_id="'),r.b(r.v(r.d("user.id",e,t,0))),r.b('" title="Block User"><span class="i">&#8416;</span></a>'
),r.b("\n"+n),r.b("        </span>"),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),
r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("\n"+n),r.b('    <div style="clear: both;"></div>'
),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=t,n}),define
("hgn!templates/reviews/_review_thread",["hogan"],function(e){function n(){return t
.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r
.b(n=n||""),r.b('<div id="comment_thread_'),r.b(r.v(r.f("id",e,t,0))),r.b('" class="comment_thread" data-thread_id="'
),r.b(r.v(r.f("id",e,t,0))),r.b('" '),r.s(r.f("hidden",e,t,1),e,t,0,90,110,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b('style="display:none"')}),e.pop()),r.b(">"),r.b("\n"+
n),r.s(r.f("reviews",e,t,1),e,t,0,136,162,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b
(n.rp("reviews/review",e,t,"  	"))}),e.pop()),r.b("</div>"),r.fl()},"",e,{});return n
.template=t,n}),define("hgn!templates/reviews/_reply_form",["hogan"],function(e){
function n(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t
,n){var r=this;return r.b(n=n||""),r.b('<form accept-charset="UTF-8" action="/reviews" class="new_review reply_form white_button_form" method="post">'
),r.b("\n"+n),r.b('	<div class="comment reply reply_form clearfix">'),r.b("\n"+n)
,r.s(r.f("user",e,t,1),e,t,0,171,275,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('	  	<img alt="'
),n.b(n.v(n.f("login",e,t,0))),n.b('" class="avatar sq72" src="'),n.s(n.f("avatar_url"
,e,t,1),e,t,0,237,252,"{{ }}")&&(n.rs(e,t,function(e,t,n){n.b("sq72, w=75&h=75")}
),e.pop()),n.b('" />'),n.b("\n")}),e.pop()),r.b('  	<a class="submit" tabindex="42" href="#"><span class="i-annotation"></span></a>'
),r.b("\n"+n),r.b('		<div class="body">'),r.b("\n"+n),r.b('			  <p>Reply to thread <a class="cancel_reply" href="#">(cancel)</a></p>'
),r.b("\n"+n),r.b("			<div>"),r.b("\n"+n),r.b('			  <div class="mentions_highlights"></div>'
),r.b("\n"+n),r.b('				<textarea class="text prompt" cols="40" class="review_body" name="review[body]" rows="3" placeholder="Enter your reply here">'
),r.s(r.f("mentions",e,t,1),e,t,0,659,670,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b
("@"),n.b(n.v(n.f("login",e,t,0))),n.b(" ")}),e.pop()),r.b("</textarea>"),r.b("\n"+
n),r.b('				<input type="hidden" name="review[body_encoded]" value="'),r.s(r.f("mentions"
,e,t,1),e,t,0,768,788,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("@["),n.b(n.v(n.f("id"
,e,t,0))),n.b(":"),n.b(n.v(n.f("login",e,t,0))),n.b("] ")}),e.pop()),r.b('" />'),
r.b("\n"+n),r.b("				<hr />"),r.b("\n"+n),r.b("			</div>"),r.b("\n"+n),r.b('			<div class="comment_links">'
),r.b("\n"+n),r.b('				<input id="review_mix_id" name="review[reviewable_id]" type="hidden" value="'
),r.b(r.v(r.f("reviewable_id",e,t,0))),r.b('" />'),r.b("\n"+n),r.b('				<input id="review_mix_id" name="review[reviewable_type]" type="hidden" value="'
),r.b(r.v(r.f("reviewable_type",e,t,0))),r.b('" />'),r.b("\n"+n),r.b('				<input id="review_parent_id" name="review[parent_id]" type="hidden" value="'
),r.b(r.v(r.f("parent_id",e,t,0))),r.b('">'),r.b("\n"+n),r.b('				<div class="validation_errors"></div>'
),r.b("\n"+n),r.b('	      <div class="row clear" id="captcha_container" style="height: 0px; overflow: hidden;">'
),r.b("\n"+n),r.b('	      	<input type="hidden" name="g-recaptcha-response" value="" />'
),r.b("\n"+n),r.b('	        <div class="g-recaptcha" data-sitekey="6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN"></div>'
),r.b("\n"+n),r.b("	      </div>"),r.b("\n"+n),r.b("\n"+n),r.b("				"),r.s(r.f("spinner"
,e,t,1),e,t,0,1493,1504,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("review_form")}),
e.pop()),r.b("\n"+n),r.b("			</div>"),r.b("\n"+n),r.b("\n"+n),r.b("		</div><!-- bubble -->"
),r.b("\n"+n),r.b("	</div><!-- comment -->"),r.b("\n"+n),r.b("</form>	"),r.b("\n"
),r.fl()},"",e,{});return n.template=t,n}),function(e){e(jQuery)}(function(e){function r
(){var n=i(this),r=t.settings;return isNaN(n.datetime)||(r.cutoff==0||o(n.datetime
)<r.cutoff)&&e(this).text(s(n.datetime)),this}function i(n){n=e(n);if(!n.data("timeago"
)){n.data("timeago",{datetime:t.datetime(n)});var r=e.trim(n.text());t.settings.localeTitle?
n.attr("title",n.data("timeago").datetime.toLocaleString()):r.length>0&&(!t.isTime
(n)||!n.attr("title"))&&n.attr("title",r)}return n.data("timeago")}function s(e){
return t.inWords(o(e))}function o(e){return(new Date).getTime()-e.getTime()}e.timeago=
function(t){return t instanceof Date?s(t):typeof t=="string"?s(e.timeago.parse(t)
):typeof t=="number"?s(new Date(t)):s(e.timeago.datetime(t))};var t=e.timeago;e.extend
(e.timeago,{settings:{refreshMillis:6e4,allowFuture:!0,localeTitle:!1,cutoff:864e5
,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now"
,seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour"
,hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months"
,year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(
t){function l(r,i){var s=e.isFunction(r)?r(i,t):r,o=n.numbers&&n.numbers[i]||i;return s
.replace(/%d/i,o)}var n=this.settings.strings,r=n.prefixAgo,i=n.suffixAgo;this.settings
.allowFuture&&t<0&&(r=n.prefixFromNow,i=n.suffixFromNow);var s=Math.abs(t)/1e3,o=
s/60,u=o/60,a=u/24,f=a/365,c=s<45&&l(n.seconds,Math.round(s))||s<90&&l(n.minute,1
)||o<45&&l(n.minutes,Math.round(o))||o<90&&l(n.hour,1)||u<24&&l(n.hours,Math.round
(u))||u<42&&l(n.day,1)||a<30&&l(n.days,Math.round(a))||a<45&&l(n.month,1)||a<365&&
l(n.months,Math.round(a/30))||f<1.5&&l(n.year,1)||l(n.years,Math.round(f)),h=n.wordSeparator||""
;return n.wordSeparator===undefined&&(h=" "),e.trim([r,c,i].join(h))},parse:function(
t){var n=e.trim(t);return n=n.replace(/\.\d+/,""),n=n.replace(/-/,"/").replace(/-/
,"/"),n=n.replace(/T/," ").replace(/Z/," UTC"),n=n.replace(/([\+\-]\d\d)\:?(\d\d)/
," $1$2"),new Date(n)},datetime:function(n){var r=t.isTime(n)?e(n).attr("datetime"
):e(n).attr("title");if(r.length==10||r.length==13){var i=parseInt(r,0);if(i==r)return r
.length==10&&(i*=1e3),new Date(i)}return t.parse(r)},isTime:function(t){return e(
t).get(0).tagName.toLowerCase()==="time"}});var n={init:function(){var n=e.proxy(
r,this);n();var i=t.settings;i.refreshMillis>0&&setInterval(n,i.refreshMillis)},update
:function(n){e(this).data("timeago",{datetime:t.parse(n)}),r.apply(this)}};e.fn.timeago=
function(e,t){var r=e?n[e]:n.init;if(!r)throw new Error("Unknown function name '"+
e+"' for timeago");return this.each(function(){r.call(this,t)}),this},document.createElement
("abbr"),document.createElement("time")}),define("jquery.timeago",function(){}),define
("views/comments_view",["views/trax_view","global_trax","lib/sessions","lib/events"
,"lib/jsonh.jquery","lib/_template_helpers","lib/client_storage","hgn!templates/reviews/_review_form"
,"hgn!templates/mixes/_mix_reviews","hgn!templates/reviews/_review","hgn!templates/reviews/_review_thread"
,"hgn!templates/reviews/_reply_form","jquery.timeago"],function(e,t,n,r,i,s,o,u,a
,f,l,c){var h=e.extend({el:"#comments",SPAM_REVIEWS_KEY:"reviews_marked_as_spam",
initialize:function(e){_.bindAll(this,"render","setDeletePermission","setBlockPermission"
,"afterRender","setOwnershipPermission","onReviewBodyKeypress","renderCaptcha","onSubmit"
),this.reviewable=e.reviewable,this.reviewable_type=e.reviewable_type,this.per_page=
e.per_page,this.reviews=e.reviews,this.onLoad=e.onLoad,this.whenUserReadyOrChanged
(this.afterRender),n.bind("current_user:unset",this.afterRender),e.load?(this.$el=
$(this.el),this.loadReviews()):this.afterRender(),this.matches=[]},afterRender:function(
){this.updateFormAvatar(),this.afterCommentRender(),this.hideSpamReviews()},afterCommentRender
:function(e){this.$(".timeago",e).timeago(),this.setOwnershipPermissions(e||this.
$el),this.setDeletePermissions(e||this.$el),this.setBlockPermissions(e||this.$el)
},events:{"submit form":"onSubmit","click .submit":"onSubmit","keydown .submit":"onSubmitKeydown"
,"click .delete_review":"onDeleteClick","click .new_pagination a":"paginateReviews"
,"click .reply_review":"onReplyClick","click .cancel_reply":"onCancelReplyClick","click .mark_as_spam"
:"onMarkAsSpamClick","click .flag_user":"onFlagUserClick","focus textarea":"loadAutocompleteView"
,"keydown textarea":"onReviewBodyKeydown"},loadReviews:function(){if(this.reviewable
){var e=this.reviewable.get("web_path")+"/comments";i.now(e,{page:1,per_page:this
.per_page,include:"pagination"},this.render)}},render:function(e){this.$el.empty(
),this.reviewable_type=="Mix"&&(this.$el.append('<h6 id="comments_header"><span class="i-comment"></span> '+
(e.pagination.total_entries?e.pagination.total_entries:"")+" Comments</h6>").append
('<hr class="divide" />'),e.pagination.total_entries>e.pagination.per_page&&this.
$("#comments_header").append(' (<a href="'+this.reviewable.get("web_path")+'/comments">view all</a>)'
));var n=t.currentUser?t.currentUser.toJSON():!1,r=new s({user:n,reviewable_id:this
.reviewable.id,reviewable_type:this.reviewable_type});this.$el.append(u(r));var i=new 
s(e);i.link_structure=this.reviewable.get("web_path")+"/comments/::page::",this.$el
.append(a(i,{"reviews/review":f.template,"reviews/review_thread":l.template})),this
.afterRender(),e.current_page>1?$("body").scrollTop(this.$el.offset().top):typeof 
this.onLoad=="function"&&this.onLoad.call()},updateFormAvatar:function(){var e;t.
currentUser&&(e=s.prototype.imgix_url("sq72, w=72&h=72&fit=crop",t.currentUser.get
("avatar_urls"))),$("form.new_review").find("img").attr("src",e)},setOwnershipPermissions
:function(e){_.each(this.$(".comment",e),this.setOwnershipPermission)},setDeletePermissions
:function(e){_.each(this.$(".comment",e),this.setDeletePermission)},setBlockPermissions
:function(e){_.each(this.$(".comment",e),this.setBlockPermission)},setOwnershipPermission
:function(e){$el=$(e),this.canDeleteComment($el)?$el.addClass("comment_owner"):$el
.removeClass("comment_owner")},setDeletePermission:function(e){var t=$(e);this.canDeleteComment
(t)?t.find(".delete_review").addClass("on"):t.find(".delete_review").removeClass("on"
)},setBlockPermission:function(e){this.canFlagUser(e)?$(e).find(".flag_user").addClass
("on"):$(e).find(".flag_user").removeClass("on")},canFlagUser:function(e){var n=t
.currentUser?t.currentUser.toJSON():!1;if(!n)return!1;var r=$(e).find(".flag_user"
).data("user_id");return n.id===r?!1:this.reviewable&&this.reviewable.get("user")&&
this.reviewable.get("user").id===n.id},canDeleteComment:function(e){return n.loggedIn
()&&(n.isAdmin()||n.isJuniorModerator()||this.reviewable.get("user_id")===t.currentUser
.id||e.data("review_user_id")===t.currentUser.id)},fakeAttributesForBlockedReview
:function(e){reviewAttr.body_html=reviewAttr.body,reviewAttr.created_at_timestamp=
(new Date).getTime()},onSubmitKeydown:function(e){if(e.which==13)return this.onSubmit
({currentTarget:$(e.currentTarget).parents("form")[0]}),!1},onSubmit:function(e){
if(!n.loggedIn()){t.showSignupView();return}var i=e&&e.currentTarget?$(e.currentTarget
):e;return i.is("form")||(i=i.parents("form")),i.data("busy")=="1"||i.find("textarea"
).val().length==0?!1:(i.data("busy","1"),this.recaptcha_id&&i.data("g-recaptcha-response"
,grecaptcha.getResponse(this.recaptcha_id)),i.jsonh_now(function(e){i.data("busy"
,"0");if(e.success){var n=e.review;n.user=t.currentUser.toJSON(),n.mix_user_id=this
.reviewable?this.reviewable.get("user_id"):null,!n.reviewer_blocked||this.fakeAttributesForBlockedReview
(n);if(e.review.parent_id){var o=new s(n),u=$(f(o));i.replaceWith(u),this.afterCommentRender
(u)}else{var o=new s({id:e.review.parent_id||e.review.id,reviews:[n],hidden:!0}),
a=$(l(o,{"reviews/review":f.template}));i.after(a),a.slideDown(),this.afterCommentRender
(a),i.find('textarea, input[name="review[body_encoded]"]').val(""),i.find(".validation_errors, .mentions_highlights"
).empty(),i.find("#captcha_container").css({height:"0px"})}r.commentOnMix(this.reviewable
)}else i.find(".validation_errors").html(e.validation_errors),e.captcha&&(this.renderCaptcha
(i),this.showCaptcha(i))},{spinner:i.find(".spinner"),context:this,with_lock:!0})
,!1)},renderCaptcha:function(e){if(!window.grecaptcha){window.recaptchaCallback=_
.bind(function(){this.renderCaptcha(e)},this);var t=document.createElement("script"
);t.type="text/javascript",t.src=window.location.protocol+"//www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit"
,document.body.appendChild(t),window.recaptcha=!0}else{if(typeof this.recaptcha_id!="undefined"
){grecaptcha.reset(this.recaptcha_id);return}this.recaptcha_id=grecaptcha.render(
e.find(".g-recaptcha")[0],{sitekey:"6LcPDgAVAAAAALdCGqdrjGFD4vfYLCgDibQYn3gN",callback
:_.bind(function(){this.onSubmit(e)},this)})}},showCaptcha:function(e){window.recaptcha&&
e.find("#captcha_container").animate({height:"80px"})},onDeleteClick:function(e){
var t=$(e.currentTarget),n=!!e.skipConfirmation;if(n||confirm("Are you sure you want to delete this comment?"
)){var r=t.parents(".comment"),i=r.parents(".comment_thread");r.fadeOut(150),t.jsonh_now
(function(e){e.success&&(r.hasClass("reply")?r.remove():i.remove())},{type:"delete"
})}return!1},onFlagUserClick:function(e){var n=$(e.target),r=n.data("user_name"),
i=confirm("Are you sure you want to block "+r+"? This will also remove this comment."
),s=n.data("user_id"),o=n.data("comment_id"),u=t.currentUser;if(!(u&&s&&i))return!1
;var a=this.reviewable.get("user").id===u.id,f=u.id!==s,l=this;if(a&&f){var c=u.flag
(s);c.success(function(){l.onCommentFlagged(o)})}return!1},onCommentFlagged:function(
e){var t=$('.comment[data-review_id="'+e+'"]'),n=jQuery.Event("click");n.skipConfirmation=!0
,t.find("a.delete_review").trigger(n)},onReplyClick:function(e){if(n.loggedOut())
return!0;var r=$(e.currentTarget),i=r.parents(".comment_thread"),o=i.children(".comment:first"
),u=i.find(".reply_form");if(u.length>0)return u.is(":visible")?(u.hide(),!1):(u.
show(),!1);var a=this.reviewable?this.reviewable.toJSON():{id:o.data("mix_id")},f=new 
s({mix:a,reviewable_id:a.id,reviewable_type:"Mix",user:t.currentUser.toJSON(),parent_id
:i.data("thread_id")});i.append(c(f)),$textarea=i.find(".reply_form textarea"),$textarea
.focus();var l=_.reject(_.map(i.find("a.name"),function(e){return{id:$(e).data("user_id"
),term:$(e).text()}}),function(e){return e.term==t.currentUser.get("login")}),h=[
],p=l.length,d;for(d=0;d<p;d++){if(h[l[d].id])continue;h[l[d].id]=!0,this.mentions
.push(l[d])}for(var d=0;d<this.mentions.length;d++)this.onReviewBodyKeypress(null
,"@"+this.mentions[d].term+" ");return this.autocompleteview&&this.autocompleteView
.setCaretPosition($textarea,$textarea.val().length),$textarea.is(":visible")||$("html, body"
).animate({scrollTop:$(".reply_form textarea").offset().top-200},250),!1},onCancelReplyClick
:function(e){var t=$(e.currentTarget),n=t.parents("form.new_review");return n.length>0&&
n.remove(),!1},onMarkAsSpamClick:function(e){var t=$(e.currentTarget);i.now(t.attr
("href"),function(){},{spinner:!0,type:"post"});var n=t.parents(".comment"),r;n.is
(".reply")?r=n.data("review_id"):(n=n.parents(".comment_thread"),r=n.data("thread_id"
)),n.hide();var s=o.get(this.SPAM_REVIEWS_KEY);return _.isArray(s)?s=s.split(",")
:s=[],s.push(r),o.set(this.SPAM_REVIEWS_KEY,s.join(",")),!1},hideSpamReviews:function(
){var e=o.get(this.SPAM_REVIEWS_KEY);_.isString(e)&&(e=e.split(","),_.each(e,function(
e){$("#"+e).remove()}))},paginateReviews:function(e){var t=$(e.currentTarget),n=t
.attr("href");return this.per_page&&(n+=n.indexOf("?")!=-1?"&":"?",n+="per_page="+
this.per_page),i.now(n,this.render),!1},loadAutocompleteView:function(e){var t=$(
e.currentTarget).parent();if(this.autocompleteView){if(this.autocompleteView.el==
t[0])return;this.autocompleteView.undelegateEvents(),delete this.autocompleteView
}this.$input=t.find('textarea[name="review[body]"]'),this.$encodedInput=t.find('input[name="review[body_encoded]"]'
),this.$highlights=t.find(".mentions_highlights"),require(["views/autocomplete_view"
],_.bind(function(e){this.autocompleteView=new e({el:t,endpoint:"/mentions/autocomplete"
,mix_id:this.reviewable?this.reviewable.id:null,categories:["users"],symbol:"@",showViewAll
:!1,autoSelect:!0,placeholder:null,emptyMessage:"No users matched that name.",dataMapper
:this.dataMapper,minQueryLength:1,onEnter:_.bind(this.onSearchEnter,this),onSelect
:_.bind(this.onSearchSelect,this)})},this)),t.find("textarea:first").keypress(this
.onReviewBodyKeypress),this.mentions=[]},dataMapper:function(e){return e.users.length?
e.users=_.map(e.users,function(e){return e.name=e.login,e.data={image_url:e.avatar_urls
.sq72},e}):delete e.users,e},onSearchEnter:function(e){return this.onSubmit({currentTarget
:$(event.currentTarget).parents("form")[0]}),!1},encodedParts:function(){return this
.$encodedInput.val().match(/([^@]+|@\[[^\]]+\])/ig)},onReviewBodyKeydown:function(
e){e&&(e.which==8||e.which==46)&&_.defer(this.onReviewBodyKeypress);if(e&&e.which==9
)return!1},onReviewBodyKeypress:function(e,t){var n=this.$input.val(),r=e?String.
fromCharCode(e.which):null,i;if(t||r){i=this.autocompleteView&&this.autocompleteView
.caretPosition()||0;var s=n.slice(0,i);t?(s=s.split(/@[^@ ]*$/)[0],n=s+t+n.slice(
i),i=s.length+t.length):n=s+r+n.slice(i)}var o=n,u=n,a;for(a=0;a<this.mentions.length
;a++){var f=this.mentions[a];f&&n.match("@"+f.term)&&(o=o.replace("@"+f.term,"<span>@"+
f.term+"</span>"),u=u.replace("@"+f.term,"@["+f.id+":"+f.term+"]"))}t&&(this.$input
.val(n),this.autocompleteView&&this.autocompleteView.setCaretPosition(this.$input
[0],this.$input.val().length)),this.$highlights.html(o),this.$encodedInput.val(u)
},onSearchSelect:function(e){var t=$(e).data("name"),n,r,i,s=$(e).data("id");n=this
.$encodedInput.val(),s=$(e).data("id");var o={id:s,term:t};return this.mentions.push
(o),this.onReviewBodyKeypress(null,"@"+t+" "),this.$input.focus(),this.autocompleteView
.onBlur(),!1}});return h}),define("hgn!templates/blogs/_display",["hogan"],function(
e){function n(){return t.render.apply(t,arguments)}var t=new e.Template(function(
e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("blog",e,t,1),e,t,0,9,4350,"{{ }}")&&
(r.rs(e,t,function(e,t,r){r.b('<article id="blogpost" itemscope itemtype="http://schema.org/MusicRecording" class="full-width">'
),r.b("\n"+n),r.b("\n"+n),r.b('<div class="featured_image dark_bg clearfix">'),r.
b("\n"+n),r.b('  <div class="background-blur-container">'),r.b("\n"+n),r.b('    <div style="background-color: '
),r.b(r.t(r.d("color_palette.first",e,t,0))),r.b('; opacity: 0.6; width: 100%; height: 100%; position: absolute;"></div>'
),r.b("\n"+n),r.b('    <div class="master_image" style="background-image: url(\''
),r.b(r.v(r.d("image_urls.original",e,t,0))),r.b('\');" class="master_image">'),r
.b("\n"+n),r.b('      <canvas class="background-blur" width="100%" height="100%" style="width: 100%; height: 100%; opacity: 0.0;" data-palette="'
),r.s(r.f("color_palette",e,t,1),e,t,0,582,588,"{{ }}")&&(r.rs(e,t,function(e,t,n
){n.b(n.v(n.d(".",e,t,0))),n.b(",")}),e.pop()),r.b('"></canvas>  '),r.b("\n"+n),r
.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b('  <div class="container clearfix dark-bg">'
),r.b("\n"+n),r.b('    <div class="row" id="article_title">'),r.b("\n"+n),r.b('      <div class="hidden-xs hidden-sm col-md-1 col-lg-2 col-xl-3">&nbsp;</div>'
),r.b("\n"+n),r.b('      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6">'
),r.b("\n"+n),r.b('        <table class="title_container"><tbody><tr>'),r.b("\n"+
n),r.b('        <td valign="bottom">'),r.b("\n"+n),r.b("          <h1>"),r.b(r.v(
r.f("title",e,t,0))),r.b("\n"+n),r.s(r.f("admin",e,t,1),e,t,0,997,1061,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b('            <span class="status">('),n.b(n.v(n.f("status"
,e,t,0))),n.b(")</span>"),n.b("\n")}),e.pop()),r.b("          </h1>"),r.b("\n"+n)
,r.b('          <p class="tags_list tags">'),r.b(r.t(r.f("list_tags",e,t,0))),r.b
("</p>"),r.b("\n"+n),r.b("        </td>"),r.b("\n"+n),r.b("        </tr></tbody></table>"
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"
),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b('<div class="container">'
),r.b("\n"+n),r.b('  <div class="row clearfix">'),r.b("\n"+n),r.b('    <div class="hidden-xs hidden-sm col-md-1 col-lg-2 col-xl-3">&nbsp;</div>'
),r.b("\n"+n),r.b('    <div class="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 article_wrapper">'
),r.b("\n"+n),r.b("      <br />"),r.b("\n"+n),r.b('      <p class="meta" id="user_byline">'
),r.b("\n"+n),r.b("        <!--author -->"),r.b("\n"+n),r.s(r.f("user",e,t,1),e,t
,0,1534,1872,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('          <a href="'),r.b(r
.v(r.f("web_path",e,t,0))),r.b('" rel="user" title="'),r.b(r.v(r.f("login",e,t,0)
)),r.b("'s profile\">"),r.b("\n"+n),r.b("            "),r.s(r.f("avatar_img",e,t,1
),e,t,0,1635,1653,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("sq100, w=100&h=100")})
,e.pop()),r.b("\n"+n),r.b("          </a>"),r.b("\n"+n),r.b("\n"+n),r.b('          <span class="byline">'
),r.b("\n"+n),r.b('            &nbsp;by <a class="propername" href="'),r.b(r.v(r.
f("web_path",e,t,0))),r.b('" rel="author">'),r.b(r.v(r.f("login",e,t,0))),r.b("</a> "
),r.b("\n"+n),r.b("            "),r.s(r.f("badge",e,t,1),e,t,0,1830,1835,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("small")}),e.pop()),r.b("\n"+n),r.b("          </span>"
),r.b("\n")}),e.pop()),r.s(r.f("user",e,t,1),e,t,1,0,0,"")||(r.b('          <span class="avatar">'
),r.b("\n"+n),r.b('            <span class="i-logo"></span>'),r.b("\n"+n),r.b("          </span>"
),r.b("\n"+n),r.b('          <span class="byline">'),r.b("\n"+n),r.b("            by 8tracks staff"
),r.b("\n"+n),r.b("          </span>"),r.b("\n")),r.b("\n"+n),r.b("        <!--date -->"
),r.b("\n"+n),r.b('        <span class="date">'),r.b("\n"+n),r.b("          on"),
r.b("\n"+n),r.s(r.f("published_at",e,t,1),e,t,0,2178,2244,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b("            "),n.s(n.f("human_date",e,t,1),e,t,0,2206,2218,"{{ }}")&&
(n.rs(e,t,function(e,t,n){n.b("published_at")}),e.pop()),n.b("\n")}),e.pop()),r.s
(r.f("published_at",e,t,1),e,t,1,0,0,"")||(r.b("            "),r.s(r.f("human_date"
,e,t,1),e,t,0,2317,2327,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("updated_at")}),e
.pop()),r.b("\n")),r.b("        </span>"),r.b("\n"+n),r.b("      </p>"),r.b("\n"+
n),r.b("\n"+n),r.b('      <div id="post_actions">'),r.b("\n"+n),r.s(r.f("admin",e
,t,1),e,t,0,2447,2541,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('          <a href="/blogs/'
),n.b(n.v(n.f("id",e,t,0))),n.b('/edit" title="Edit"><span class="i-edit"></span></a>'
),n.b("\n")}),e.pop()),r.b('        <a href="#comments" title="Comments"><span class="i-comment"></span> </a>'
),r.b("\n"+n),r.b('        <a href="#share" class="share" title="Share"><span class="i-share"></span> </a>'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("      "),r.b("\n"+n),r.b("\n"+
n),r.b('      <div class="article_body">'),r.b("\n"+n),r.b("        "),r.b(r.t(r.
f("body_html",e,t,0))),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("\n"+n),r.
b('      <div class="meta clearfix" id="meta_footer">'),r.b("\n"+n),r.b('        <div class="sm-hidden col-md-3">&nbsp;</div>'
),r.b("\n"+n),r.b('        <div class="col-md-6">'),r.b("\n"+n),r.b('          <p class="tags_list tags">'
),r.b(r.t(r.f("list_tags",e,t,0))),r.b("</p>"),r.b("\n"+n),r.b("\n"+n),r.b("          <!--author -->"
),r.b("\n"+n),r.s(r.f("user",e,t,1),e,t,0,3050,4034,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('            <a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b('" rel="user" title="'
),r.b(r.v(r.f("login",e,t,0))),r.b("'s profile\">"),r.b("\n"+n),r.b("              "
),r.s(r.f("avatar_img",e,t,1),e,t,0,3155,3173,"{{ }}")&&(r.rs(e,t,function(e,t,n)
{n.b("sq100, w=100&h=100")}),e.pop()),r.b("\n"+n),r.b("            </a>"),r.b("\n"+
n),r.b("\n"+n),r.b('            <h3><a class="black" href="'),r.b(r.v(r.f("web_path"
,e,t,0))),r.b('" rel="author">'),r.b(r.v(r.f("login",e,t,0))),r.b("</a></h3>"),r.
b("\n"+n),r.b("\n"+n),r.b('            <p class="bio">'),r.b(r.t(r.f("bio",e,t,0)
)),r.b("</p>"),r.b("\n"+n),r.b("\n"+n),r.b('            <span class="options p p_not_owner on" data-owner_id="'
),r.b(r.v(r.f("id",e,t,0))),r.b('">'),r.b("\n"+n),r.s(r.f("followed_by_current_user"
,e,t,1),e,t,0,3451,3674,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('              <a href="'
),n.b(n.v(n.f("path",e,t,0))),n.b('/toggle_follow" title="Follow '),n.b(n.v(n.f("login"
,e,t,0))),n.b('" class="follow turquoise_button flatbutton p p_not_owner" data-owner_id="'
),n.b(n.v(n.f("id",e,t,0))),n.b('" data-user_id="'),n.b(n.v(n.f("id",e,t,0))),n.b
('" rel="signup_required">Following</a>'),n.b("\n")}),e.pop()),r.s(r.f("followed_by_current_user"
,e,t,1),e,t,1,0,0,"")||(r.b('                <a href="'),r.b(r.v(r.f("path",e,t,0
))),r.b('/toggle_follow" title="Follow '),r.b(r.v(r.f("login",e,t,0))),r.b('" class="follow turquoise_button flatbutton p p_not_owner" data-owner_id="'
),r.b(r.v(r.f("id",e,t,0))),r.b('" data-user_id="'),r.b(r.v(r.f("id",e,t,0))),r.b
('" rel="signup_required nofollow">Follow</a>'),r.b("\n")),r.b("          </span>"
),r.b("\n")}),e.pop()),r.b("        </div"),r.b("\n"+n),r.b("      </div>"),r.b("\n"+
n),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+
n),r.b('  <div id="modal_share" style="display: none;">'),r.b("\n"+n),r.b('    <div class="interface">'
),r.b("\n"+n),r.b('      <div class="black">SHARE THIS ARTICLE</div>'),r.b("\n"+n
),r.b('      <div class="share_view"></div>'),r.b("\n"+n),r.b('      <a href="#" class="shareClose"><span class="i-x"></span>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</article>"
),r.b("\n")}),e.pop()),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/shared/sharing"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b("<div>"),r.b("\n"+n
),r.b('  <div class="share-buttons-block">'),r.b("\n"+n),r.b('    <span class="share-group">'
),r.b("\n"+n),r.s(r.f("facebook",e,t,1),e,t,0,92,356,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('      <a class="fb popupShare flatbutton shareOpenGraph"'),r.b("\n"+n
),r.b('        href="#"'),r.b("\n"+n),r.b('        title="Share on Facebook"'),r.
b("\n"+n),r.b('        data-win-width="500"'),r.b("\n"+n),r.b('        data-win-height="800"'
),r.b("\n"+n),r.b('        data-network="facebook">'),r.b("\n"+n),r.b('        <span class="logo i-facebook"></span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("twitter"
,e,t,1),e,t,0,389,968,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('      <a class="tw popupShare flatbutton"'
),r.b("\n"+n),r.b('        href="https://twitter.com/share?original_referer='),r.
b(r.v(r.f("url_escaped",e,t,0))),r.b("&source=tweetbutton&text="),r.b(r.v(r.f("description"
,e,t,0))),r.b("&related="),r.b("\n"+n),r.b("        8tracks:%20The%20world's%20best%20internet%20radio,"
),r.b(r.v(r.f("related_twitter",e,t,0))),r.b("&url="),r.b(r.v(r.f("url_escaped",e
,t,0))),r.b(r.v(r.d("sources.twitter",e,t,0))),r.b('%3Futm_source=twitter.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=twitter_button"'
),r.b("\n"+n),r.b('        rel="popup"'),r.b("\n"+n),r.b('        title="Tweet"')
,r.b("\n"+n),r.b('        data-win-width="420"'),r.b("\n"+n),r.b('        data-win-height="550"'
),r.b("\n"+n),r.b('        data-network="Twitter">'),r.b("\n"+n),r.b('        <span class="logo i-twitter"></span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("tumblr"
,e,t,1),e,t,0,999,2047,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('      <a class="tb popupShare flatbutton"'
),r.b("\n"+n),r.s(r.f("embedCode",e,t,1),e,t,0,1064,1187,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b('          href="http://www.tumblr.com/share/video?embed='),n.b(n.v(n.
f("embedCode",e,t,0))),n.b("&name="),n.b(n.v(n.f("name",e,t,0))),n.b("&caption=")
,n.b(n.v(n.f("description_html",e,t,0))),n.b('"'),n.b("\n")}),e.pop()),r.s(r.f("embedCode"
,e,t,1),e,t,1,0,0,"")||(r.s(r.f("image",e,t,1),e,t,0,1236,1554,"{{ }}")&&(r.rs(e,
t,function(e,t,n){n.b('            href="http://www.tumblr.com/widgets/share/tool?posttype=photo&content='
),n.b(n.v(n.f("tumblr_image",e,t,0))),n.b("&caption="),n.b(n.v(n.f("description_html"
,e,t,0))),n.b("&tags="),n.b(n.v(n.f("hash_tags",e,t,0))),n.b("&canonicalUrl="),n.
b(n.v(n.f("url_escaped",e,t,0))),n.b("&clickthroughUrl="),n.b(n.v(n.f("url_escaped"
,e,t,0))),n.b('%3Futm_source=tumblr.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=tumblr_button"'
),n.b("\n")}),e.pop()),r.s(r.f("image",e,t,1),e,t,1,0,0,"")||(r.b('          href="http://www.tumblr.com/share/link?name='
),r.b(r.v(r.f("name",e,t,0))),r.b("&description="),r.b(r.v(r.f("description_html"
,e,t,0))),r.b("&url="),r.b(r.v(r.f("url_escaped",e,t,0))),r.b('%3Futm_source=tumblr.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=tumblr_button"'
),r.b("\n"))),r.b('        rel="popup"'),r.b("\n"+n),r.b('        title="Post to Tumblr"'
),r.b("\n"+n),r.b('        data-win-width="450"'),r.b("\n"+n),r.b('        data-win-height="430"'
),r.b("\n"+n),r.b('        data-network="Tumblr">'),r.b("\n"+n),r.b('        <span class="logo i-tumblr"></span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n")}),e.pop()),r.b("    </span>"),r.b("\n"+
n),r.b("\n"+n),r.b('    <span class="share-group">'),r.b("\n"+n),r.s(r.f("stumbleupon"
,e,t,1),e,t,0,2125,2455,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('      <a class="su popupShare flatbutton"'
),r.b("\n"+n),r.b('        href="http://www.stumbleupon.com/submit?url='),r.b(r.v
(r.f("url_escaped",e,t,0))),r.b('"'),r.b("\n"+n),r.b('        rel="popup"'),r.b("\n"+
n),r.b('        title="Share on Stumbleupon"'),r.b("\n"+n),r.b('        data-win-width="800"'
),r.b("\n"+n),r.b('        data-win-height="600"'),r.b("\n"+n),r.b('        data-network="Stumbleupon">'
),r.b("\n"+n),r.b('        <span class="logo i-stumbleupon"></span>'),r.b("\n"+n)
,r.b("      </a>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("      <!-- refactored using gplus share link for utm tracking -->"
),r.b("\n"+n),r.s(r.f("google",e,t,1),e,t,0,2556,3417,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('      <a class="g-interactivepost gl popupShare flatbutton"'),r.b("\n"+
n),r.b('        href="https://plus.google.com/share?url='),r.b(r.v(r.f("url_escaped"
,e,t,0))),r.b('%3Futm_source=google.com%26utm_medium=referral%26utm_content=mix-page%26utm_campaign=google_button"'
),r.b("\n"+n),r.b('        rel="popup"'),r.b("\n"+n),r.b('        title="Share on Google+"'
),r.b("\n"+n),r.b('        data-win-width="500"'),r.b("\n"+n),r.b('        data-win-height="600"'
),r.b("\n"+n),r.b('        data-network="Google">'),r.b("\n"+n),r.b('      <!--   data-contenturl="'
),r.b(r.v(r.f("decoded_url",e,t,0))),r.b("?"),r.b(r.v(r.d("sources.google",e,t,0)
)),r.b('"'),r.b("\n"+n),r.b('        data-contentdeeplinkid="'),r.b(r.v(r.f("path"
,e,t,0))),r.b('"'),r.b("\n"+n),r.b('        data-clientid="'),r.b(r.v(r.f("GOOGLE_CLIENT_ID"
,e,t,0))),r.b('"'),r.b("\n"+n),r.b('        data-cookiepolicy="single_host_origin"'
),r.b("\n"+n),r.b('        data-prefilltext="'),r.b(r.v(r.f("hash_tags",e,t,0))),
r.b('"'),r.b("\n"+n),r.b('        data-calltoactionlabel="LISTEN"'),r.b("\n"+n),r
.b('        data-calltoactionurl="'),r.b(r.v(r.f("decoded_url",e,t,0))),r.b("?"),
r.b(r.v(r.d("sources.google",e,t,0))),r.b('"'),r.b("\n"+n),r.b('        data-network="Google"'
),r.b("\n"+n),r.b('        data-calltoactiondeeplinkid="'),r.b(r.v(r.f("path",e,t
,0))),r.b('" -->'),r.b("\n"+n),r.b('        <span class="logo i-google-plus"></span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("pinterest"
,e,t,1),e,t,0,3450,3829,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b("      <a"),r.b("\n"+
n),r.b('       class="pn popupShare flatbutton"'),r.b("\n"+n),r.b('       href="http://pinterest.com/pin/create/button/?url='
),r.b(r.v(r.f("url_escaped",e,t,0))),r.b(r.v(r.d("sources.pinterest",e,t,0))),r.s
(r.f("image",e,t,1),e,t,0,3603,3627,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("&media="
),n.b(n.v(n.f("image_escaped",e,t,0)))}),e.pop()),r.b('"'),r.b("\n"+n),r.b('       rel="popup"'
),r.b("\n"+n),r.b('       title="Pin it"'),r.b("\n"+n),r.b('       data-win-width="720"'
),r.b("\n"+n),r.b('       data-height="560"'),r.b("\n"+n),r.b('       data-network="Pinterest">'
),r.b("\n"+n),r.b('       <span class="logo i-pinterest"></span>'),r.b("\n"+n),r.
b("      </a>"),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("email",e,t,1),e,t,0,3861
,4065,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b("      <a"),r.b("\n"+n),r.b('       class="em popupShare flatbutton"'
),r.b("\n"+n),r.b('       href="#"'),r.b("\n"+n),r.b('       rel="local"'),r.b("\n"+
n),r.b('       data-network="Email"'),r.b("\n"+n),r.b('       title="Share via email">'
),r.b("\n"+n),r.b('       <span class="logo i-email"></span>'),r.b("\n"+n),r.b("      </a>"
),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("embed",e,t,1),e,t,0,4093,4287,"{{ }}"
)&&(r.rs(e,t,function(e,t,r){r.b('      <a class="eb popupShare flatbutton"'),r.b
("\n"+n),r.b('       href="#"'),r.b("\n"+n),r.b('       rel="local"'),r.b("\n"+n)
,r.b('       title="Embed player"'),r.b("\n"+n),r.b('       data-network="Embed">'
),r.b("\n"+n),r.b('       <span class="logo i-embed"></span>'),r.b("\n"+n),r.b("      </a>"
),r.b("\n")}),e.pop()),r.b("    </span>"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n)
,r.b("\n"+n),r.b('  <a class="shareClose flatbutton" href="#" title="Close menu" rel="local">Close</a>'
),r.b("\n"+n),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},"",e,{});return n.template=
t,n}),define("lib/trax_facebook",["lib/traxhead"],function(e){var t={};return t.loadFacebookJs=
_.once(function(){if(ParsedLocation.urlParams&&ParsedLocation.urlParams["extJs"]=="nope"
)return!1;window.fbAsyncInit=e.onFbInit,function(e,t,n){var r,i=e.getElementsByTagName
(t)[0];if(e.getElementById(n))return;r=e.createElement(t),r.id=n,r.src="//connect.facebook.net/en_US/all.js#xfbml=1&appId=166738216681933"
,i.parentNode.insertBefore(r,i)}(document,"script","facebook-jssdk")}),t.loadFacebookMusicJs=
_.once(function(){window.fbAsyncInit=e.onFbMusicInit,function(e,t,n){var r,i=e.getElementsByTagName
(t)[0];if(e.getElementById(n))return;r=e.createElement(t),r.id=n,r.src="//connect.facebook.net/en_US/all/vb.js#xfbml=1&appId=166738216681933"
,i.parentNode.insertBefore(r,i)}(document,"script","facebook-jssdk")}),t.parseXFBML=
function(n,r){e.FbLoaded?FB.XFBML.parse(n,r):(t.loadFacebookJs(),_.delay(t.parseXFBML
,100,n,r))},t.openFbDialog=function(e,n,r){if(typeof FB=="undefined"){t.loadFacebookJs
(),_.delay(this.openFbDialog,500,e,n,r);return}var i=_.extend(n,{method:e,display
:"dialog",app_id:0x97a5c42d01cd});FB.ui(i,_.bind(function(){_.isFunction(r)&&r(),
App.Events.shareMix({network:"facebook",action:e+" Dialog",mix:this.mix}),this.hideSharing
()},this))},t}),define("views/sharing_view",["global_trax","views/trax_view","hgn!templates/shared/sharing"
,"lib/trax_facebook"],function(e,t,n,r){var i=t.extend({className:"share_view",events
:{"click .em":"onEmailClick","click .eb":"onEmbedClick","click .popupShare":"onPopupShareClick"
,"click .shareOpenGraph":"onShareOpenGraphClick"},initialize:function(e){this.atts=
{},this.childViews=[],this.mix=e.mix,this.atts.decoded_url=e.url,this.atts.url=encodeURIComponent
(e.url),this.atts.url_escaped=this.atts.url,this.atts.name=encodeURIComponent(e.name
),this.atts.embedCode=typeof e.embedCode=="string"?encodeURIComponent(e.embedCode
):!1,this.atts.image=e.image,this.atts.description=encodeURIComponent(e.description
),this.atts.description_html=e.description_html?encodeURIComponent(e.description_html
):this.atts.description,this.atts.twitter_related=encodeURIComponent(e.twitter_related
),this.mix&&(this.atts.path=this.mix.get("path")),r.loadFacebookJs(),r.parseXFBML
(),this.atts.hash_tags=this.hashTags(),_.each(e.buttons,_.bind(function(e){this.atts
[e]=!0},this)),this.template=n},hashTags:function(){if(this.mix){var e=["8tracks"
,"playlist"],t=this.mix.get("tag_list_cache").split(","),n=this.mix.get("artist_tags"
);return e=e.concat(t,n),e=_.map(e,function(e){return e?e.replace("#",""):""}),e}
},render:function(){return this.atts.sources={pinterest:escape("?utm_source=pinterest"
)},this.atts.image&&(this.atts.tumblr_image=encodeURIComponent(this.atts.image.split
("?")[0]+"?fm=jpg&fit=max&w=1024"),this.atts.image_escaped=encodeURIComponent(this
.atts.image)),this.atts.GOOGLE_CLIENT_ID=window.GOOGLE_CLIENT_ID,this.$el.html(this
.template(this.atts)),this.el},fileFormat:function(){return this.atts.image.includes
("gif")?"gif":"jpg"},afterRender:function(){this.renderGooglePlus()},renderGooglePlus
:function(){gapi.interactivepost.go()},onEmailClick:function(){return this.mixRecommendView?
$.facebox(this.mixRecommendView.el):require(["views/mix_recommend_view"],_.bind(function(
t){this.mixRecommendView=new t({mix:this.mix,user:e.currentUser,parentView:this})
,this.childViews.push(this.mixRecommendView),$.facebox(this.mixRecommendView.render
().el)},this)),this.trigger("shareClick"),!1},onEmbedClick:function(e){this.trigger
("shareClick");if(this.mix){$.facebox('<div class="large-spinner" id="embed-spinner"></div>'
);var t=this.mix;return require(["views/embed_mix_lightbox_view"],function(e){var n=new 
e({mix:t,$sidebarAd:$("#sidebar_ad")});n.show()}),!1}return!0},onPopupShareClick:
function(e){this.trigger("shareClick");if(this.mix){var t=$(e.currentTarget).data
("network"),n=this.mix.get("user");TraxEvents.track("share attempt",{event_type:"click"
,content_type:"mix",page_type:"mix",share_target:t,mix_id:this.mix.get("id"),profile_id
:n&&n.id}),App.Events.clickMixShareOption({network:t,action:"share",url:"https://8tracks.com"+
this.mix.get("web_path")}),typeof IDENTITY=="function"&&IDENTITY("track","Shared to Social"
,{label:t})}},onShareOpenGraphClick:function(){this.trigger("shareClick");var e=unescape
(this.atts.url).replace(/^https{0,1}:/,"https:");FB.ui({method:"share",href:e.concat
("?utm_source=facebook.com&utm_medium=referral&utm_content=mix-page&utm_campaign=facebook_button"
)},function(e){})}});return i}),define("hgn!templates/collections/add_to_collection"
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
s}),define("hgn!templates/dashboard/_segment",["hogan"],function(e){function n(){
return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this
;return r.b(n=n||""),r.b('<!--div class="segment mix_set segment-'),r.b(r.v(r.f("reason_class"
,e,t,0))),r.b('"-->'),r.b("\n"+n),r.b('  <div class="segment_header">'),r.b("\n"+
n),r.b('    <div class="page_indicators">'),r.b("\n"+n),r.b('      <div class="page_indicators_2 visible-sm hidden-xs hidden-md hidden-lg hidden-xl">'
),r.b("\n"+n),r.b("        "),r.s(r.f("page_indicators_2",e,t,1),e,t,0,244,295,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,261,275,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b('      <div class="page_indicators_3 visible-md hidden-xs hidden-sm hidden-lg hidden-xl">'
),r.b("\n"+n),r.b("        "),r.s(r.f("page_indicators_3",e,t,1),e,t,0,450,501,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,467,481,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b('      <div class="page_indicators_4 visible-lg hidden-xs hidden-sm hidden-md visible-xl">'
),r.b("\n"+n),r.b("        "),r.s(r.f("page_indicators_4",e,t,1),e,t,0,657,708,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,674,688,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b('      <div class="page_indicators_5 visible-xl hidden-xs hidden-sm hidden-md hidden-lg">'
),r.b("\n"+n),r.b("        "),r.s(r.f("page_indicators_5",e,t,1),e,t,0,863,914,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,880,894,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("      </div>    </div>"),r.b("\n"+n),r.b('    <div class="page_buttons">'
),r.b("\n"+n),r.b('      <a href="#" class="page_prev" title="Previous page"><span class="i-chevron-left"></span></a> '
),r.b("\n"+n),r.b('      <a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b('" class="view_all_grid" title="View all playlists"><span class="i-feed"></span></a> '
),r.b("\n"+n),r.b('      <a href="#" class="page_next" title="Next page"><span class="i-chevron-right"></span></a>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b('    <h4 class="segment_title"><a href="'
),r.b(r.v(r.f("web_path",e,t,0))),r.b('">'),r.b(r.t(r.f("html_name",e,t,0))),r.b(' <span class="link_indicator">&rarr;</a></h4>'
),r.b("\n"+n),r.b("    <hr />"),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b('  <div class="mixes smart-type-'
),r.b(r.v(r.f("smart_type",e,t,0))),r.b(" "),r.b("\n"+n),r.b("    "),r.s(r.f("show_users"
,e,t,1),e,t,0,1510,1526,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("mixes_with_users"
)}),e.pop()),r.b(' clearfix">'),r.b("\n"+n),r.b('    <div class="page_container">'
),r.b("\n"+n),r.s(r.f("mixes",e,t,1),e,t,0,1602,1639,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b(n.rp("mixes/mix_square",e,t,"        "))}),e.pop()),r.b("    </div>"),
r.b("\n"+n),r.b("  </div>    "),r.b("\n"+n),r.b("<!--/div-->"),r.fl()},"",e,{});return n
.template=t,n}),define("views/segment_view",["views/trax_view","lib/_template_helpers"
,"lib/link_helper","hgn!templates/dashboard/_segment"],function(e,t,n,r){MOBILE_MIX_CARD_WIDTH=265
;var s=e.extend({className:"segment",events:{"click .page_next, .page_prev":"onPageClick"
,"click .quick_add":"onQuickAddClick","click .mix":"onMixClick"},initialize:function(
e){_.bindAll(this,"onMousewheel","handleTouchStart","handleTouchMove","handleTouchEnd"
),this.segment=e.segment,this.showAds=e.showAds&&this.tabletScreen(),this.postEvents=
e.postEvents,this.currentPage=0,this.renderedMixes=0,this.layout=e.layout||"home"
,this.bendAmount=0,this.segment&&this.segment.mixes?this.num_mixes=this.segment.mixes
.length+(this.showAds?1:0):(this.num_mixes=this.$(".mixes .page_container").children
().length+(this.showAds?1:0),this.segment={mixes:new Array(this.num_mixes)},this.
afterRender()),this.showViewAllCard=this.segment.mixes.length>this.mixesPerPage()
,this.showViewAllCard&&(this.num_mixes+=1),this.setNumPages()},render:function(){
var e=new t(this.segment);return this.$el.html(r(e)),this.$container=this.$(".page_container"
),this.$mixes=this.$(".mixes"),this.renderVisibleMixes(),this.insertAd(),App.views
.adsView&&App.views.adsView.fillEmptyAds(),this.afterRender(),this.el},afterRender
:function(){this.renderPagination(),this.$container=this.$(".page_container"),this
.mediumScreen()?(this.swipeTimeout=750,this.$container[0].addEventListener?(this.
$container[0].addEventListener("mousewheel",this.onMousewheel,!1),this.$container
[0].addEventListener("DOMMouseScroll",this.onMousewheel,!1)):this.$container[0].attachEvent
("onmousewheel",this.onMousewheel)):(this.swipeTimeout=250,this.$container[0].addEventListener
("touchstart",this.handleTouchStart,!1),this.$container[0].addEventListener("touchmove"
,this.handleTouchMove,!1),this.$container[0].addEventListener("touchend",this.handleTouchEnd
,!1),this.followTouch=!0)},onPageClick:function(e){$clicked=$(e.currentTarget);var t=
$clicked.hasClass("page_next")?1:-1;return this.paginate(t),this.postEvents&&(TraxEvents
.track("home_segmented:paginate",{smart_type:this.segment.smart_type}),$.ajax({url
:"/log_entries.jsonh",type:"POST",data:{"log_entry[title]":"home_segmented:paginate"
,"log_entry[url]":window.location.path,"log_entry[description]":"smart_type: "+this
.segment.smart_type+"  layout: "+this.layout,"log_entry[user_agent]":navigator.userAgent
}})),!1},paginate:function(e){this.resetBend();var t=this.num_pages[this.mixesPerPage
()];return this.currentPage+=e,this.currentPage>=t?this.currentPage=0:this.currentPage<0&&
(this.currentPage=t-1),this.renderVisibleMixes(),this.mediumScreen()?this.$container
.css("left",this.currentPage*-100+"%"):this.$container.css("left",this.currentPage*-
MOBILE_MIX_CARD_WIDTH+"px"),this.$(".page_indicators span:nth-of-type("+(this.currentPage+1
)+")").addClass("active").siblings().removeClass("active"),!1},mixesPerPage:function(
){return console.log("Error in SegmentView.mixesPerPage(): this is a parent class for types of Segments. Use the view class appropriate to the context (e.g. SegmentSquareView)."
),1},renderMix:function(e){return console.log("Error in SegmentView.renderMix(): this is a parent class for types of Segments. Use the view class appropriate to the context (e.g. SegmentSquareView)."
),!1},renderPagination:function(){return console.log("Error in SegmentView.renderPagination(): this is a parent class for types of Segments. Use the view class appropriate to the context (e.g. SegmentSquareView)."
),!1},setNumPages:function(){this.num_pages=[0,this.num_mixes,Math.ceil(this.num_mixes/2
),Math.ceil(this.num_mixes/3),Math.ceil(this.num_mixes/4),Math.ceil(this.num_mixes/5
)],this.segment.page_indicators_2=new Array(this.num_pages[2]),this.segment.page_indicators_3=new 
Array(this.num_pages[3]),this.segment.page_indicators_4=new Array(this.num_pages[4
]),this.segment.page_indicators_5=new Array(this.num_pages[5]),this.segment.page_indicators_2
[0]={active:1},this.segment.page_indicators_3[0]={active:1},this.segment.page_indicators_4
[0]={active:1},this.segment.page_indicators_5[0]={active:1}},renderVisibleMixes:function(
){if(!this.segment||!this.segment.mixes)return!1;var e=this.mixesPerPage(),t=(this
.currentPage+2)*e;for(i=0;i<t;i++)this.segment.mixes[i]&&this.renderedMixes<=i&&(
this.renderMix(this.segment.mixes[i]),this.renderedMixes=i+1);this.showViewAllCard&&
this.renderedMixes==this.segment.mixes.length&&this.renderViewAllCard()},wideScreen
:function(){return window.innerWidth>=1590},desktopScreen:function(){return window
.innerWidth>=1300},tabletScreen:function(){return window.innerWidth>=1e3},mediumScreen
:function(){return window.innerWidth>=660},insertAd:function(){if(this.showAds)if(
App.views.adsView){var e=1,t="ad_"+Math.floor(Math.random()*1e5,0);this.$(".card:nth-child("+
e+"), .mix_square:nth-child("+e+")").after(App.views.adsView.adBox())}else if(App
.Trax.showAds()){console.log("retrying to load adsview"),_.delay(_.bind(this.insertAd
,this),250,!0);return}},onMousewheel:function(e,t){var n=o(e)*5,r=u(e);if(Math.abs
(n)>0&&Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY))return this.paging||this.bend
(n*r),e.preventDefault(),!1},handleTouchStart:function(e){a=e.touches[0].clientX}
,handleTouchMove:function(e){if(!a)return;if(this.paging)return!0;var t=e.touches
[0].clientX,n=a-t;Math.abs(n)>0&&this.bend(n),a=null,f=null},handleTouchEnd:function(
e){this.resetBend()},bend:function(e){this.bendAmount+=e,Math.abs(this.bendAmount
)>=10?(this.paginate(this.bendAmount>0?1:-1),this.paging=!0,_.delay(_.bind(function(
){this.paging=!1},this),this.swipeTimeout)):this.followTouch&&this.$container.css
({"margin-left":-1*this.bendAmount+"px"})},resetBend:function(){this.bendAmount=0
,this.bend(0)},renderViewAllCard:function(){if(this.viewAllRendered)return!1;this
.$(".page_container").append('<div class="card mix_square view_all_card"><a href="'+
this.segment.web_path+'">View all playlists &rarr;</a></div>'),this.viewAllRendered=!0
},onQuickAddClick:function(e){return n.quick_add_click(e),!1},onMixClick:function(
e){this.postEvents&&(TraxEvents.track("home_segmented:click_mix",{smart_type:this
.segment.smart_type}),$.ajax({url:"/log_entries.jsonh",type:"POST",data:{"log_entry[title]"
:"home_segmented:click_mix","log_entry[url]":window.location.path,"log_entry[description]"
:"smart_type: "+this.segment.smart_type+"  layout: "+this.layout,"log_entry[user_agent]"
:navigator.userAgent}}))},onClose:function(){return}}),o=function(e,t){e||(e=event
);var n=Math.abs(e.wheelDeltaX)||e.wheelDelta,r=e.detail;return r?n?n/r/40*r>0?1:-1
:-r/3:n/120},u=function(e){return e||(e=event),e.detail<0?1:e.wheelDeltaX>0?-1:1}
,a=null,f=null;return s}),define("hgn!templates/mixes/_mix_square",["hogan"],function(
e){function n(){return t.render.apply(t,arguments)}var t=new e.Template(function(
e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="mix_square dark-bg" data-id="'
),r.b(r.v(r.f("id",e,t,0))),r.b('" data-nsfw="'),r.s(r.f("nsfw",e,t,1),e,t,0,69,73
,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("true")}),e.pop()),r.b('">'),r.b("\n"+n)
,r.b('  <div class="cover '),r.s(r.d("cover_urls.animated",e,t,1),e,t,0,129,137,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("animated")}),e.pop()),r.b('" '),r.b("\n"+n),r.b
('      style="background-color: '),r.b(r.t(r.d("color_palette.first",e,t,0))),r.
b("; "),r.s(r.d("cover_urls.animated",e,t,1),e,t,0,246,334,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b("background-image: url('"),n.b(n.v(n.d("cover_urls.static_cropped_imgix_url"
,e,t,0))),n.b("'); background-size: 100%;")}),e.pop()),r.b('>">'),r.b("\n"+n),r.b
('    <a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b("#smart_id="),r.b(r.v(r.f("smart_id"
,e,t,0))),r.b('" class="mix_url"'),r.s(r.f("track_click",e,t,1),e,t,0,442,577,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b(' data-track="true" data-event_name="'),n.b(n.v(
n.f("event_name",e,t,0))),n.b('" '),n.s(n.f("event_properties",e,t,1),e,t,0,515,556
,"{{ }}")&&(n.rs(e,t,function(e,t,n){n.b("data-event_properties_"),n.b(n.v(n.f("name"
,e,t,0))),n.b('="'),n.b(n.v(n.f("val",e,t,0))),n.b('" ')}),e.pop())}),e.pop()),r.
b(">"),r.b("\n"+n),r.s(r.f("large",e,t,1),e,t,0,611,681,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b("        "),n.s(n.f("mix_cover_img",e,t,1),e,t,0,638,656,"{{ }}")&&(n.
rs(e,t,function(e,t,n){n.b("sq500, w=640&h=640")}),e.pop()),n.b("\n")}),e.pop()),
r.s(r.f("large",e,t,1),e,t,1,0,0,"")||(r.b("        "),r.s(r.f("mix_cover_img",e,
t,1),e,t,0,735,753,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("sq250, w=245&h=245")}
),e.pop()),r.b("\n")),r.b("      "),r.s(r.f("certification",e,t,1),e,t,0,813,950,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b('<span class="certification '),n.b(n.v(n.f("certification"
,e,t,0))),n.b('" title="'),n.b(n.v(n.f("certification",e,t,0))),n.b('"><span class="certification_icon"></span> '
),n.b(n.v(n.f("certification",e,t,0))),n.b("</span>")}),e.pop()),r.b("\n"+n),r.b("      "
),r.s(r.f("is_promoted",e,t,1),e,t,0,991,1062,"{{ }}")&&(r.rs(e,t,function(e,t,n)
{n.b('<span class="sponsored" title="Sponsored mix" title="Sponsored"></span>')})
,e.pop()),r.b("\n"+n),r.b("    </a>"),r.b("\n"+n),r.b("    "),r.s(r.d("cover_urls.animated"
,e,t,1),e,t,0,1116,1144,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('<span class="gif">GIF</span>'
)}),e.pop()),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="frontside">'
),r.b("\n"+n),r.b('    <h3 class="title black">'),r.b("\n"+n),r.b('      <a href="'
),r.b(r.v(r.f("web_path",e,t,0))),r.b("#smart_id="),r.b(r.v(r.f("smart_id",e,t,0)
)),r.b('"'),r.s(r.f("track_click",e,t,1),e,t,0,1300,1402,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b(' data-track="true" '),n.s(n.f("event_properties",e,t,1),e,t,0,1340,1381
,"{{ }}")&&(n.rs(e,t,function(e,t,n){n.b("data-event_properties_"),n.b(n.v(n.f("name"
,e,t,0))),n.b('="'),n.b(n.v(n.f("val",e,t,0))),n.b('" ')}),e.pop())}),e.pop()),r.
b(">"),r.b("\n"+n),r.b("        "),r.b(r.v(r.f("name",e,t,0))),r.b("\n"+n),r.b("      </a>"
),r.b("\n"+n),r.b("    </h3>"),r.b("\n"+n),r.b('    <p class="byline">by <a href="'
),r.b(r.v(r.d("user.web_path",e,t,0))),r.b('">'),r.b(r.v(r.d("user.login",e,t,0))
),r.b("</a></p>"),r.b("\n"+n),r.b("    "),r.s(r.f("nsfw",e,t,1),e,t,0,1547,1600,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b('<span class="nsfw_mix_flag p p_admin off">NSFW</span>'
)}),e.pop()),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("\n"+n),r.b('  <div class="backside">'
),r.b("\n"+n),r.b("\n"+n),r.b('    <h3 class="title black">'),r.b(r.v(r.f("name",
e,t,0))),r.b("</h3>"),r.b("\n"+n),r.b('    <a href="'),r.b(r.v(r.f("web_path",e,t
,0))),r.b("#smart_id="),r.b(r.v(r.f("smart_id",e,t,0))),r.b('"'),r.s(r.f("track_click"
,e,t,1),e,t,0,1752,1854,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(' data-track="true" '
),n.s(n.f("event_properties",e,t,1),e,t,0,1792,1833,"{{ }}")&&(n.rs(e,t,function(
e,t,n){n.b("data-event_properties_"),n.b(n.v(n.f("name",e,t,0))),n.b('="'),n.b(n.
v(n.f("val",e,t,0))),n.b('" ')}),e.pop())}),e.pop()),r.b(' title="'),r.b(r.v(r.f("name"
,e,t,0))),r.b('" class="mix_url"></a>'),r.b("\n"+n),r.b('    <p class="byline">by <a href="'
),r.b(r.v(r.d("user.web_path",e,t,0))),r.b('">'),r.b(r.v(r.d("user.login",e,t,0))
),r.b("</a></p>"),r.b("\n"+n),r.b('    <p class="mix_stats">'),r.b("\n"+n),r.b('      <span class="i-play"> '
),r.b(r.v(r.f("plays_count",e,t,0))),r.b("</span> &nbsp;&nbsp;"),r.b("\n"+n),r.b('      <span class="i-heart"> '
),r.b(r.v(r.f("likes_count",e,t,0))),r.b("</span> &nbsp;&nbsp;"),r.b("\n"+n),r.b('      <span class="i-recent"> '
),r.b(r.v(r.f("tracks_count",e,t,0))),r.b(" tracks</span>"),r.b("\n"+n),r.b("    </p>"
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("read_only",e,t,1),e,t,0,2229,2273,"{{ }}")&&(r
.rs(e,t,function(e,t,n){n.b('      <span class="unplayable"></span>'),n.b("\n")})
,e.pop()),r.b("      "),r.b("\n"+n),r.b('    <div class="quick_actions">'),r.b("\n"+
n),r.b('      <a class="quick_play" href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b("#smart_id="
),r.b(r.v(r.f("smart_id",e,t,0))),r.b('&play=1" title="play"'),r.s(r.f("track_click"
,e,t,1),e,t,0,2432,2567,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(' data-track="true" data-event_name="'
),n.b(n.v(n.f("event_name",e,t,0))),n.b('" '),n.s(n.f("event_properties",e,t,1),e
,t,0,2505,2546,"{{ }}")&&(n.rs(e,t,function(e,t,n){n.b("data-event_properties_"),
n.b(n.v(n.f("name",e,t,0))),n.b('="'),n.b(n.v(n.f("val",e,t,0))),n.b('" ')}),e.pop
())}),e.pop()),r.b('><span class="i-play"></span></a>'),r.b("\n"+n),r.b('      <span class="pipe"></span>'
),r.b("\n"+n),r.b('      <a class="quick_add" data-mix_id="'),r.b(r.v(r.f("id",e,
t,0))),r.b('" data-mix_name="'),r.b(r.v(r.f("name",e,t,0))),r.b('" title="Add to collection" href="#" ><span class="i-collection"></span></a>'
),r.b("\n"+n),r.b("\n"+n),r.s(r.f("show_remove",e,t,1),e,t,0,2821,3040,"{{ }}")&&
(r.rs(e,t,function(e,t,r){r.b('        <span class="pipe"></span>'),r.b("\n"+n),r
.b('        <a class="quick_remove" data-smart-id="'),r.b(r.v(r.f("smart_id",e,t,0
))),r.b('" data-mix-id="'),r.b(r.v(r.f("id",e,t,0))),r.b('" data-mix-name="'),r.b
(r.v(r.f("name",e,t,0))),r.b('" title="Hide from your history" href="#"><span class="i-x"></span></a>'
),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),
r.b("\n"+n),r.b("\n"+n),r.b('  <div class="tags">'),r.b("\n"+n),r.b("    "),r.b(r
.t(r.f("list_artists",e,t,0))),r.b("\n"+n),r.b("    "),r.b(r.t(r.f("grid_tags",e,
t,0))),r.b("\n"+n),r.b("  </div>"),r.b("\n"+n),r.b("</div>"),r.b("\n"),r.fl()},""
,e,{});return n.template=t,n}),define("hgn!templates/dashboard/_page_indicators_blog"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="page_indicators_2 hidden-xs visible-sm">'
),r.b("\n"+n),r.b("  "),r.s(r.f("page_indicators_2",e,t,1),e,t,0,77,128,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,94,108,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("</div>"),r.fl()},"",e,{});return n.template=t,n}),define
("views/segment_blog_view",["views/segment_view","hgn!templates/mixes/_mix_square"
,"hgn!templates/dashboard/_page_indicators_blog","lib/_template_helpers"],function(
e,t,n,r){var i=e.extend({mixesPerPage:function(){return this.tabletScreen()?2:1},
renderMix:function(e){var t=$('<div class="card half_card mix_card mix" data-id="'+
e.id+'" data-nsfw="'+(e.nsfw?"true":"false")+'"></div>'),n=new r(e);return t.html
(mixCardPartial(n)),this.$container.append(t),t},renderPagination:function(){this
.$(".page_indicators").html(n(this.segment))}});return i}),define("hgn!templates/dashboard/_page_indicators_square"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="page_indicators_2 hidden-xs visible-sm hidden-md hidden-lg hidden-xl">'
),r.b("\n"+n),r.b("  "),r.s(r.f("page_indicators_2",e,t,1),e,t,0,107,158,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,124,138,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b('<div class="page_indicators_3 hidden-xs hidden-sm visible-md hidden-lg hidden-xl">'
),r.b("\n"+n),r.b("  "),r.s(r.f("page_indicators_3",e,t,1),e,t,0,295,346,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,312,326,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b('<div class="page_indicators_4 hidden-xs hidden-sm hidden-md visible-lg hidden-xl">'
),r.b("\n"+n),r.b("  "),r.s(r.f("page_indicators_4",e,t,1),e,t,0,483,534,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,500,514,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b('<div class="page_indicators_4 hidden-xs hidden-sm hidden-md hidden-lg visible-xl">'
),r.b("\n"+n),r.b("  "),r.s(r.f("page_indicators_5",e,t,1),e,t,0,671,722,"{{ }}")&&
(r.rs(e,t,function(e,t,n){n.b("<span "),n.s(n.f("active",e,t,1),e,t,0,688,702,"{{ }}"
)&&(n.rs(e,t,function(e,t,n){n.b('class="active"')}),e.pop()),n.b(">–</span>")}),
e.pop()),r.b("\n"+n),r.b("</div>"),r.fl()},"",e,{});return n.template=t,n}),define
("views/segment_square_view",["views/segment_view","hgn!templates/mixes/_mix_square"
,"hgn!templates/dashboard/_page_indicators_square","lib/_template_helpers"],function(
e,t,n,r){var i=e.extend({className:"segment segment_square",mixesPerPage:function(
){return this.wideScreen()?5:this.desktopScreen()?4:this.mediumScreen()?3:this.tabletScreen
()?2:1},renderMix:function(e){var n=new r(e),i=$(t(n));return this.$container.append
(i),i},renderPagination:function(){this.$(".page_indicators").html(n(this.segment
))}});return i}),define("views/blog_view",["views/trax_view","views/comments_view"
,"hgn!templates/blogs/_display","views/sharing_view","views/segment_blog_view","views/segment_square_view"
,"lib/_template_helpers","lib/link_helper"],function(e,t,n,r,i,s,o,u){var a=e.extend
({el:"#belly",events:{"click .share":"onShareClick","click .shareClose":"onShareClose"
,"click .quick_add":"onQuickAddClick","click .follow":"onFollowClick","click #blogpost figure a"
:"onImageClick","click .featured_image":"onFeaturedImageClick"},initialize:function(
e){_.bindAll(this,"onShareClick"),this.blog=new Backbone.Model(e.blog),this.relatedMixSets=
e.relatedMixSets,this.childViews=[],$("#thin_header").addClass("scrollable"),$(window
).on("scroll",this.onScroll)},render:function(){var e=new o({blog:this.blog.toJSON
(),admin:App.Sessions.isAdmin()});this.$el.html(n(e)),$("#thin_header .scrolling .title"
).html(this.blog.get("title")),this.afterRender()},afterRender:function(){App.Trax
.setGradient($("canvas.background-blur")[0]),this.initComments(),this.initSegments
(),this.initSharing(),this.initRelatedMixSets()},onShareClick:function(){return this
.sharingView||(this.sharingView=new r({el:this.$(".share_view")[0],url:"https://8tracks.com"+
this.blog.get("web_path"),name:this.blog.get("title"),image:this.blog.get("image_urls"
).original,description:"Check out this article on @8tracks: "+this.blog.get("title"
),description_html:'Check out this article on @8tracks: <a href="http://8tracks.com'+
this.blog.get("web_path")+'">'+this.blog.get("title")+"</a>",buttons:["facebook","twitter"
,"tumblr","google"]}),this.childViews.push(this.sharingView),this.sharingView.render
(),this.sharingView.afterRender()),$("#modal_share").show().addClass("visible"),!1
},onShareClose:function(){return $("#modal_share").removeClass("visible"),!1},onScroll
:_.throttle(function(e){$("#thin_header").toggleClass("stuck",window.scrollY>0)},50
),initComments:function(){if(!PAGE.serverRendered){var e=$('<div class="container"><div class="row"><div class="col-md-12"><div id="comments" class="card displaymode"><img src="/assets/spinner/spinner-large.gif" id="reviews-spinner" /></div></div></div></div>'
);this.$el.append(e),this.commentsView=new t({reviewable:this.blog,reviewable_type
:"Blog",per_page:8,load:!0})}else this.commentsView=new t({reviewable:this.blog,reviewable_type
:"Blog",per_page:8,reviews:this.reviews});this.childViews.push(this.commentsView)
},initSegments:function(){var e=this.$("#blogpost .segment");for(var t=0;t<e.length
;t++){var n=new i({el:e[t]});this.childViews.push(n)}},initRelatedMixSets:function(
){PAGE.serverRendered?_.each($("#related_mix_sets .segment"),_.bind(function(e){var t=new 
s({el:e});this.childViews.push(t)},this)):(this.$el.append('<div class="row"><div class="col-md-12" id="related_mix_sets"></div></div>'
),_.each(this.relatedMixSets,_.bind(function(e){var t=new s({mix_set:e});this.childViews
.push(t),$("#related_mix_sets").append(t.render)},this)))},initSharing:function()
{$("#header_middle").prepend('<div id="blog_post_actions" class="visible_when_scrolled">'+
$("#post_actions").html()+"</div>"),$("#blog_post_actions .share").click(this.onShareClick
)},onFeaturedImageClick:function(e){debugger;return $.facebox('<img class="fullsize_img_popup" src="'+
this.blog.get("image_urls").original+'" />'),!1},onImageClick:function(e){return $
.facebox('<img class="fullsize_img_popup" src="'+e.currentTarget.href+'" />'),!1}
,onQuickAddClick:function(e){return u.quick_add_click(e),!1},onFollowClick:function(
e){return u.follow_link_click(e),!1},onClose:function(){$(window).unbind("scroll"
,this.onScroll),$("#thin_header").removeClass("scrollable stuck"),$("#blog_post_actions"
).remove()}});return a});