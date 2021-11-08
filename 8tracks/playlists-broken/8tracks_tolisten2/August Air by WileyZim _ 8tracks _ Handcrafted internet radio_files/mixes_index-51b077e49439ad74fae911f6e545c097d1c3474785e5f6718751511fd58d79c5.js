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
("views/infinite_scroll_view",["views/trax_view","global_trax"],function(e,t){function n
(e){var t=$(window).scrollTop(),n=$(window).height(),r=$(e).offset().top;return $
(e).hasClass("start")&&(r+=$(e).height()),r>t+100&&r<t+.5*n}return e.extend({setupScroll
:function(){if(this.scrollSetup||this.$items.children().length<2)return;this.scrollSetup=!0
,this.$items.children(":first").addClass("waypoint start").attr("data-page",this.
currentPage),this.$items.children(":last").addClass("waypoint end").attr("data-page"
,this.currentPage),this.$previousSpinner=$('<div class="infinite_spinner"></div>'
).html(t.spinner({length:10,radius:8})),this.$nextSpinner=$('<div class="infinite_spinner"></div>'
).html(t.spinner({length:10,radius:8})),this.$items.after(this.$nextSpinner);var e=
this.$items;this.currentPage>1&&(this.$items.before(this.$previousSpinner),$(document
).ready(_.bind(function(){this.loadPrevious()},this))),this.$(".pagination, .new_pagination"
).css({visibility:"hidden"}),this.last_scroll=$(window).scrollTop(),_.bindAll(this
,"onScroll","insertAd"),$(window).scroll(this.onScroll)},onScroll:_.throttle(function(
){var e=$(window).scrollTop();e+window.innerHeight>=this.$(".waypoint:last").offset
().top&&!this.atLastPage?this.loadNext():e<=this.$(".waypoint:first").offset().top&&
this.previousPage()>0&&this.loadPrevious(),Math.abs(e-this.last_scroll)>$(window)
.height()*.1&&(this.last_scroll=e,this.$(".waypoint").each(_.bind(function(e,t){if(
n(t)&&this.pageUrl&&this.currentPage>1)return App.Trax.pushCurrentState(this.pageUrl
($(t).data("page"))),!1},this)))},200),loadNext:function(){this.loadItems(!1),this
.$nextSpinner.addClass("visible")},loadPrevious:function(){this.loadItems(!0),this
.$previousSpinner.addClass("visible")},loadItems:function(e){if(this.loading)return;
this.loading=!0;var t=e?this.previousPage():this.nextPage();this.loadMore(t,_.bind
(function(n){this.loading=!1,this.currentPage=t,e?this.prependItems(this.renderItems
(n)):this.appendItems(this.renderItems(n))},this))},previousPage:function(){return this
.$items.find(".waypoint:first").data("page")-1},nextPage:function(){return this.$items
.find(".waypoint:last").data("page")+1},appendItems:function(e){this.$nextSpinner&&
this.$nextSpinner.removeClass("visible");if(e.length==0)return this.onLastPage(),!1
;var t=this.insertAd(!1);t&&e.splice(t[1],0,t[0][0]),$(e[0]).addClass("waypoint start"
).attr("data-page",this.currentPage),$(e[e.length-1]).addClass("waypoint end").attr
("data-page",this.currentPage),this.$items.append(e),this.afterRenderItems(),this
.showAds&&App.views.adsView&&App.views.adsView.fillEmptyAds()},prependItems:function(
e,t){var n=this.$items.children(":first"),r=n.offset().top;$(e[0]).addClass("waypoint start"
).attr("data-page",this.currentPage),$(e[e.length-1]).addClass("waypoint end").attr
("data-page",this.currentPage),this.$items.prepend(e),this.$previousSpinner.removeClass
("visible"),this.currentPage==1&&this.$previousSpinner.hide(),this.afterRenderItems
(),window.scrollTo(0,n.offset().top-r+$(window).scrollTop())},insertAd:function(e
){if(this.showAds&&!App.views.adsView){_.delay(_.bind(this.insertAd,this),250,!0)
;return}var t,n,r;if(!this.showAds||!App.Trax.showAds())return[!1,0];t=$(App.views
.adsView.randomAd(this.adUnit));var r=1;window.innerWidth>=660&&(r=2),window.innerWidth>=1e3&&
(r=3),window.innerWidth>=1300&&(r=4),window.innerWidth>=1590&&(r=5),n=r-(this.$items
.find(".half_card, .mix_square").length+this.$items.find(".double_card").length)%
r,t.hasClass("half_card")&&(n-=1);if(!e)return[t,n];var i=this.$items.children(":nth-child("+
n+")");i.length==0&&(i=this.$items.children(":last")),i.after(t),App.views.adsView
.fillEmptyAds()},pageUrl:function(e){return window.location.pathname.replace(/\/[0-9]+\/?$|\/$/
,"")+"/"+e},loadMore:function(){alert("loadMore(previous) must be overwritten in infiniteScrollView instance!"
)},renderItems:function(){alert("renderItems() must be overwritten in infiniteScrollView instance!"
)},afterRenderItems:function(){},onLastPage:function(){this.atLastPage=!0;var e=$
('<div class="card end_card"><hr /></div>')[0];this.$items.append([e]),this.$nextSpinner
.hide()},onClose:function(){this.cleanupScroll()},cleanupScroll:function(){clearTimeout
(this.scrollTimeout),$(window).unbind("scroll",this.onScroll)}})}),define("lib/_template_helpers"
,["global_trax","lib/trax_utils"],function(e,t){var n=function(e){this.initTplParams
(e)};return n.prototype.initTplParams=function(e){_.extend(this,e)},n.prototype.escape=
function(){return function(e){return escape(this[e])}},n.prototype.mix_cover_url=
function(){return function(e){return n.prototype.imgix_url(e,this.cover_urls)}},n
.prototype.mixpage_mix_cover_url=function(e,t){return n.prototype.mix_cover_url(e
)},n.prototype.avatar_url=function(){return function(e){return n.prototype.imgix_url
(e,this.avatar_urls)}},n.prototype.mix_cover_img=function(){var e=this.cover_urls
;return function(t){return'<img src="'+n.prototype.imgix_url(t,e)+'" class="cover" alt="'+
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
,s;return{load:o,write:f}}),define("hgn!templates/collections/add_to_collection",
["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new e
.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="box_header">'
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
s}),define("views/_base_view",[],function(){return $.fn.resetHeight=function(){var e=
this;e.hide(),e.css("height","auto");var t=e.height();e.css("height",0),e.show(),
_.defer(function(){e.height(t+"px")})},$.fn.resetHeightByChildren=function(){var e=
this;e.show();var t=0;_.each(e.children(),function(e){t+=$(e).height()}),_.defer(
function(){e.height(t+"px")})},$.fn.mergeHtmlAndAttributes=function(e){var t=$(e)
;this.html(t.html());for(var n in t[0].attributes)t[0].attributes[n].nodeName=="class"?
this.addClass(t[0].attributes[n].value):this.attr(t[0].attributes[n].nodeName,t[0
].attributes[n].value)},$}),define("hgn!templates/mixes/_mix_set_square",["hogan"
],function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="mix_set" data-smart_id="'
),r.b(r.v(r.f("smart_id",e,t,0))),r.b('">'),r.b("\n"+n),r.s(r.f("show_title",e,t,1
),e,t,0,68,261,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b("    <br />"),r.b("\n"+n),
r.b('    <h4 class="collection_title clear '),r.b(r.v(r.f("sort",e,t,0))),r.b(' tooltip_container">'
),r.b("\n"+n),r.b('      <a href="'),r.b(r.v(r.f("web_path",e,t,0))),r.b('" title="'
),r.b(r.v(r.f("name",e,t,0))),r.b('" class="title_front">'),r.b("\n"+n),r.b("        "
),r.b(r.t(r.f("html_name",e,t,0))),r.b("\n"+n),r.b("      </a>"),r.b("\n"+n),r.b("    </h4>"
),r.b("\n")}),e.pop()),r.b("\n"+n),r.s(r.f("isLikedBlankstate",e,t,1),e,t,1,0,0,""
)||r.s(r.f("isMixBlankstate",e,t,1),e,t,1,0,0,"")||(r.b('  <div class="row clear">'
),r.b("\n"+n),r.b('    <div class="col-md-12">'),r.b("\n"+n),r.b('      <div class="mixes smart-type-'
),r.b(r.v(r.f("smart_type",e,t,0))),r.b(" "),r.b("\n"+n),r.b("      "),r.s(r.f("show_users"
,e,t,1),e,t,0,450,466,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("mixes_with_users")
}),e.pop()),r.b(' clearfix">'),r.b("\n"+n),r.s(r.f("mixes",e,t,1),e,t,0,509,548,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b(n.rp("mixes/mix_square",e,t,"          "))}),e.pop
()),r.b("      </div>"),r.b("\n"+n),r.b("    </div><!--col-md-12-->"),r.b("\n"+n)
,r.b("  </div><!--.row-->"),r.b("\n"+n),r.b("  "),r.b("\n"+n),r.s(r.f("mix_cluster"
,e,t,1),e,t,1,0,0,"")||(r.b('  <div class="row clear">'),r.b("\n"+n),r.b('    <div class="col-md-12">'
),r.b("\n"+n),r.b("      "),r.s(r.f("spinner",e,t,1),e,t,0,713,723,"{{ }}")&&(r.rs
(e,t,function(e,t,n){n.b("pagination")}),e.pop()),r.b("\n"+n),r.b("      "),r.b(r
.t(r.f("seo_pagination",e,t,0))),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"
),r.b("\n"))),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.s(r.f("isMixBlankstate",e,t
,1),e,t,0,874,1366,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b("  <div class='card wide_card profile_blankstate'>"
),r.b("\n"+n),r.b("    <div class='graphic-container'><img class='graphic' src='/images/extras/profile_blankmix.png'></div>"
),r.b("\n"+n),r.b("    <div class='text'>"),r.b("\n"+n),r.b("      <h2 class='black'>Your profile is nearly perfect!</h2>"
),r.b("\n"+n),r.b("      <div class='subtext'>Create your first playlist to let your brilliant musical taste shine.</div>"
),r.b("\n"+n),r.b("      <a href='/create_mix' class='cta turquoise_button flatbutton' title='create-first-playlist'>CREATE YOUR FIRST PLAYLIST</a>"
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),r.b("\n")}),e.pop()),
r.b("\n"+n),r.s(r.f("isLikedBlankstate",e,t,1),e,t,0,1410,2021,"{{ }}")&&(r.rs(e,
t,function(e,t,r){r.b("  <div class='card wide_card profile_blankstate'>"),r.b("\n"+
n),r.b("    <div class='graphic-container'><img class='graphic' src='/images/extras/profile_blankheart.png'></div>"
),r.b("\n"+n),r.b("    <div class='text'>"),r.b("\n"+n),r.b('      <h2 class="black">Playlists you <span class="i-like" style="font-size: 22px"></span> will appear here.</h2>'
),r.b("\n"+n),r.b('      <div class=\'subtext\'>Explore playlists to <span class="i-like" style="font-size: 12px"></span> for every activity, mood, and genre imaginable.</div>'
),r.b("\n"+n),r.b("      <div class='cta cta-explore'>"),r.b("\n"+n),r.b("        What do you want to listen to?"
),r.b("\n"+n),r.b("        <span class='i i-search search_icon'></span>"),r.b("\n"+
n),r.b("      </div>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div>"),
r.b("\n")}),e.pop()),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/mixes/_mix_square"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b('<div class="mix_square dark-bg" data-id="'
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
,e,{});return n.template=t,n}),define("hgn!templates/mixes/collection_square",["hogan"
],function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("mixes",e,t,1),e,t,0,10,37
,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b(n.rp("mixes/mix_square",e,t,"   "))}),e.
pop()),r.fl()},"",e,{});return n.template=t,n}),define("hgn!templates/shared/_seo_pagination"
,["hogan"],function(e){function n(){return t.render.apply(t,arguments)}var t=new 
e.Template(function(e,t,n){var r=this;return r.b(n=n||""),r.b("  "),r.b(r.t(r.f("!render_seo_pagination"
,e,t,0))),r.b("\n"+n),r.b("  "),r.b(r.t(r.f("seo_pagination",e,t,0))),r.b(" "),r.
b("\n"+n),r.fl()},"",e,{});return n.template=t,n}),function(e){e(jQuery)}(function(
e){function r(){var n=i(this),r=t.settings;return isNaN(n.datetime)||(r.cutoff==0||
o(n.datetime)<r.cutoff)&&e(this).text(s(n.datetime)),this}function i(n){n=e(n);if(!
n.data("timeago")){n.data("timeago",{datetime:t.datetime(n)});var r=e.trim(n.text
());t.settings.localeTitle?n.attr("title",n.data("timeago").datetime.toLocaleString
()):r.length>0&&(!t.isTime(n)||!n.attr("title"))&&n.attr("title",r)}return n.data
("timeago")}function s(e){return t.inWords(o(e))}function o(e){return(new Date).getTime
()-e.getTime()}e.timeago=function(t){return t instanceof Date?s(t):typeof t=="string"?
s(e.timeago.parse(t)):typeof t=="number"?s(new Date(t)):s(e.timeago.datetime(t))}
;var t=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowFuture:!0,localeTitle
:!1,cutoff:864e5,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow
:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes"
,hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month"
,months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers
:[]}},inWords:function(t){function l(r,i){var s=e.isFunction(r)?r(i,t):r,o=n.numbers&&
n.numbers[i]||i;return s.replace(/%d/i,o)}var n=this.settings.strings,r=n.prefixAgo
,i=n.suffixAgo;this.settings.allowFuture&&t<0&&(r=n.prefixFromNow,i=n.suffixFromNow
);var s=Math.abs(t)/1e3,o=s/60,u=o/60,a=u/24,f=a/365,c=s<45&&l(n.seconds,Math.round
(s))||s<90&&l(n.minute,1)||o<45&&l(n.minutes,Math.round(o))||o<90&&l(n.hour,1)||u<24&&
l(n.hours,Math.round(u))||u<42&&l(n.day,1)||a<30&&l(n.days,Math.round(a))||a<45&&
l(n.month,1)||a<365&&l(n.months,Math.round(a/30))||f<1.5&&l(n.year,1)||l(n.years,
Math.round(f)),h=n.wordSeparator||"";return n.wordSeparator===undefined&&(h=" "),
e.trim([r,c,i].join(h))},parse:function(t){var n=e.trim(t);return n=n.replace(/\.\d+/
,""),n=n.replace(/-/,"/").replace(/-/,"/"),n=n.replace(/T/," ").replace(/Z/," UTC"
),n=n.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(n)},datetime:function(n){
var r=t.isTime(n)?e(n).attr("datetime"):e(n).attr("title");if(r.length==10||r.length==13
){var i=parseInt(r,0);if(i==r)return r.length==10&&(i*=1e3),new Date(i)}return t.
parse(r)},isTime:function(t){return e(t).get(0).tagName.toLowerCase()==="time"}})
;var n={init:function(){var n=e.proxy(r,this);n();var i=t.settings;i.refreshMillis>0&&
setInterval(n,i.refreshMillis)},update:function(n){e(this).data("timeago",{datetime
:t.parse(n)}),r.apply(this)}};e.fn.timeago=function(e,t){var r=e?n[e]:n.init;if(!
r)throw new Error("Unknown function name '"+e+"' for timeago");return this.each(function(
){r.call(this,t)}),this},document.createElement("abbr"),document.createElement("time"
)}),define("jquery.timeago",function(){}),define("views/mix_set_view",["global_trax"
,"lib/sessions","views/infinite_scroll_view","lib/_template_helpers","lib/jsonh.jquery"
,"lib/link_helper","views/_base_view","hgn!templates/mixes/_mix_set_square","hgn!templates/mixes/_mix_square"
,"hgn!templates/mixes/collection_square","hgn!templates/shared/_seo_pagination","lib/client_storage"
,"jquery.timeago"],function(e,t,n,r,i,s,o,u,a,f,l,c){var h=n.extend({className:"mix_set"
,events:{"click .new_pagination a":"loadNext","click .quick_add":"onQuickAddClick"
,"click .quick_remove":"onQuickRemoveClick"},initialize:function(e){_.bindAll(this
,"renderItems","expeditorInclude","removable"),this.lastAdOdd=0,this.showAds=e.showAds
,this.adUnit=e.adUnit,this.useVideoAds=e.useVideoAds,this.path=e.path,this.skipScroll=
e.skipScroll,this.user=e.user,this.showTitle=e.showTitle,e.mix_set?(this.mix_set=
e.mix_set,this.smartId=this.mix_set.smart_id,this.smartType=this.smartId.split(":"
)[0],this.totalPages=this.mix_set.pagination.total_pages,this.currentPage=this.mix_set
.pagination.current_page):(this.currentPage=(window.location.pathname.match(/\/[0-9]+$/
)||[1])[0],this.smartId=this.$el.data("smart_id"),this.smartId&&(this.smartType=this
.smartId.split(":")[0]))},render:function(t){var n=new r(this.mix_set||t.mix_set)
;return this.$el.length==0&&(this.$el=$("#profile_data")),this.rendered||(this.$el
.html(f(new r)),this.rendered=!0),n.show_users=this.mix_set.smart_type=="feed",n.
link_structure=this.mix_set.web_path+"/::page::",n.recommended=this.mix_set.smart_type=="recommended"
,n.show_remove=this.removable(),n.show_title=this.options.showTitle,this.mix_set.
mixes.length>0?(n.firstMixPlayUrl=this.mix_set.mixes[0].web_path+"#play=1&smart_id="+
this.mix_set.smart_id,this.$el.mergeHtmlAndAttributes(u(n,{"mixes/mix_square":a.template
})),t.isMixBlankstate=!1,t.isLikedBlankstate=!1):this.user&&e.currentUser&&e.currentUser
.id==this.user.id?(this.mix_set.smart_type=="dj"?t.isMixBlankstate=!0:this.mix_set
.smart_type=="liked"&&(t.isLikedBlankstate=!0),this.$el.html(u(new r(t),{}))):this
.$el.html('<div class="card end_card">No mixes to display</div>'),this.afterRender
(),this.el},afterRender:function(){this.$items=$(".mixes"),this.$pagination=this.
$(".new_pagination"),this.$("#mix_set-spinner").html(e.spinner()),this.updateCollectionButton
(),this.updateHideButton(),this.skipScroll||this.setupScroll(),this.insertAd(!0),
this.timeago(),this.setColorBars()},removable:function(){return this.smartType=="listened"||
this.smartType=="recommended"||this.smartType=="youtube_recommended"||this.smartType=="listen_later"
},updateCollectionButton:function(){e.currentUser&&e.currentUser.get("uses_collections"
)?this.$el.addClass("show_collections"):this.$el.removeClass("show_collections")}
,updateHideButton:function(){this.removable()?this.$el.addClass("show_remove"):this
.$el.removeClass("show_remove")},expeditorInclude:function(){var e=["likes_count"
,"user","length"];return this.smartType=="recommended"&&e.push("recommended_story[reason_object]"
),"pagination,mixes["+e.join(",")+"],details"},loadMore:function(e,t){this.loading=!0
;var n=this.pageUrl(e);return this.$pagination.css({opacity:0}),i.now(n,{include:
this.expeditorInclude()},t),!1},renderItems:function(e){var t=[];for(var n=0;n<e.
mix_set.mixes.length;n++){var i=new r(e.mix_set.mixes[n]);i.recommended=e.mix_set
.smart_type=="recommended",i.show_remove=this.removable(),i.smart_id=e.mix_set.smart_id
;var s=a(i),o=$(s);t.push(o[0])}return t},afterRenderItems:function(){this.$el.height
("auto"),t.updatePermissionsDisplay(),this.timeago(),this.updateHideButton(),this
.updateCollectionButton(),this.setColorBars()},timeago:function(){this.$("abbr.timeago"
).timeago()},onQuickAddClick:function(e){return s.quick_add_click(e),!1},onQuickRemoveClick
:function(e){if(!this.removable())return;var t=this;return s.quick_remove_click(e
).done(function(t){var n=!!t.hidden,r=$(e.currentTarget);n&&r.parents(".mix_square"
).fadeOut()}),!1},play:function(){this.$(".quick_play:first").click()},pageUrl:function(
e){return(this.path?this.path:this.mix_set.web_path)+"/"+e},setColorBars:function(
t){return!1;var n}});return h}),define("hgn!templates/explore/_browse_header",["hogan"
],function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template
(function(e,t,n){var r=this;return r.b(n=n||""),r.b('  <div class="row">'),r.b("\n"+
n),r.b('    <div class="col-md-12">'),r.b("\n"+n),r.b("\n"+n),r.s(r.f("description"
,e,t,1),e,t,0,71,109,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("        <p>"),n.b(n
.v(n.f("description",e,t,0))),n.b("</p>"),n.b("\n")}),e.pop()),r.b("\n"+n),r.b('      <div class="big_menu explore_sort">'
),r.b("\n"+n),r.b('        <div class="hidden-md hidden-lg responsive-label">'),r
.b("\n"+n),r.b("          "),r.b(r.v(r.f("name",e,t,0))),r.b("\n"+n),r.b("        </div>"
),r.b("\n"+n),r.b("\n"+n),r.b("        <span>"),r.b("\n"+n),r.s(r.f("pagination",
e,t,1),e,t,0,303,550,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('            <span class="mixset_entries">'
),r.b("\n"+n),r.b("              "),r.s(r.f("human_number",e,t,1),e,t,0,377,390,"{{ }}"
)&&(r.rs(e,t,function(e,t,n){n.b("total_entries")}),e.pop()),r.b("\n"+n),r.b("            </span>"
),r.b("\n"+n),r.b('            <span class="hidden-xs hidden-sm">'),r.b("\n"+n),r
.b("              "),r.b(r.v(r.f("name",e,t,0))),r.b("\n"+n),r.b("            </span>"
),r.b("\n"+n),r.b("            PLAYLISTS"),r.b("\n")}),e.pop()),r.s(r.f("pagination"
,e,t,1),e,t,1,0,0,"")||(r.b("            All results"),r.b("\n")),r.b("        </span>"
),r.b("\n"+n),r.b("        </a>"),r.b("\n"+n),r.b("\n"+n),r.s(r.f("enable_preset"
,e,t,1),e,t,0,698,971,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('          <a id="remove_preset" class="item turquoise" '
),r.s(r.f("is_preset",e,t,1),e,t,1,0,0,"")||r.b('style="display:none"'),r.b(' href="#">- Remove from home</a>'
),r.b("\n"+n),r.b('          <a id="add_preset" class="item turquoise" '),r.s(r.f
("is_preset",e,t,1),e,t,0,901,921,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('style="display:none"'
)}),e.pop()),r.b(' href="#">+ Add to home</a>'),r.b("\n")}),e.pop()),r.b("\n"+n),
r.s(r.f("show_remove",e,t,1),e,t,0,1015,1136,"{{ }}")&&(r.rs(e,t,function(e,t,n){
n.b('        <a href="/mix_sets/'),n.b(n.v(n.f("smart_id",e,t,0))),n.b('" class="item clear_collection"><span class="i-x"> </span> clear all</a>'
),n.b("\n")}),e.pop()),r.b("\n"+n),r.b('        <span class="sort-container">'),r
.b("\n"+n),r.s(r.f("sort",e,t,1),e,t,0,1211,2031,"{{ }}")&&(r.rs(e,t,function(e,t
,r){r.b('            <!--span class="item hidden-xs">'),r.b("\n"+n),r.b("              SORT BY"
),r.b("\n"+n),r.b("            </span-->"),r.b("\n"+n),r.b('            <a href="#" class="item" id="selected_sort">'
),r.b(r.v(r.f("sort_name",e,t,0))),r.b(' <span class="i-triangle-down"></span></a>'
),r.b("\n"+n),r.b('            <div id="sort_select" style="display: none;">'),r.
b("\n"+n),r.b('              <a href="'),r.s(r.f("mix_set_sort_path",e,t,1),e,t,0
,1516,1520,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("/hot")}),e.pop()),r.b('" data-sort_name="Trending" data-sort_key="hot"><span class="collecticon i-hot"></span> Trending</a>'
),r.b("\n"+n),r.b('              <a href="'),r.s(r.f("mix_set_sort_path",e,t,1),e
,t,0,1688,1695,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("/recent")}),e.pop()),r.b('" data-sort_name="Newest" data-sort_key="recent"><span class="collecticon i-recent"></span> Newest</a>'
),r.b("\n"+n),r.b('              <a href="'),r.s(r.f("mix_set_sort_path",e,t,1),e
,t,0,1865,1873,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("/popular")}),e.pop()),r.b
('" data-sort_name="Popular" data-sort_key="popular"><span class="collecticon i-popular"></span> Popular</a>'
),r.b("\n"+n),r.b("            </div>"),r.b("\n")}),e.pop()),r.b("        </span>"
),r.b("\n"+n),r.b("      "),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("    </div><!--col-md-12-->"
),r.b("\n"+n),r.b("  </div><!--row -->"),r.fl()},"",e,{});return n.template=t,n})
,define("hgn!templates/explore/_station",["hogan"],function(e){function n(){return t
.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this;return r
.b(n=n||""),r.b('<div class="background-blur-container" style="">'),r.b("\n"+n),r
.b('  <canvas class="background-blur" width="100%" height="100%" style="width: 100%; height: 100%; opacity: 0.0;" data-palette="'
),r.b(r.v(r.f("master_palette",e,t,0))),r.b('"></canvas>'),r.b("\n"+n),r.b('  <img src="'
),r.b(r.v(r.f("master_image",e,t,0))),r.b('" width="100%" style="opacity: 0.3" class="master_image">'
),r.b("\n"+n),r.b("</div>"),r.b("\n"+n),r.b("\n"+n),r.b('<div class="container">  '
),r.b("\n"+n),r.b('  <div class="row"> '),r.b("\n"+n),r.b('    <div class="col-md-12" id="station_title">'
),r.b("\n"+n),r.s(r.d("selected_tags.length.nonzero",e,t,1),e,t,0,430,1513,"{{ }}"
)&&(r.rs(e,t,function(e,t,r){r.b('        <h1 id="title_tag" class="title_tag">')
,r.b("\n"+n),r.b('          <span class="i-close"></span>'),r.b("\n"+n),r.b('          <span class="title_tag_text">'
),r.b("\n"+n),r.b('            <span class="mixset_entries">'),r.b(r.v(r.d("pagination.total_entries.to_human_number"
,e,t,0))),r.b("</span>"),r.b("\n"+n),r.b('            <strong class="tagname">'),
r.b("\n"+n),r.s(r.f("h1",e,t,1),e,t,0,708,748,"{{ }}")&&(r.rs(e,t,function(e,t,n)
{n.b("                "),n.b(n.t(n.f("h1",e,t,0))),n.b("\n")}),e.pop()),r.s(r.f("h1"
,e,t,1),e,t,1,0,0,"")||(r.b("                "),r.b(r.v(r.d("mix_set.name",e,t,0)
)),r.b("\n")),r.b("            </strong>"),r.b("\n"+n),r.b("            <span>playlists</span>"
),r.b("\n"+n),r.b("          </span>"),r.b("\n"+n),r.b("        </h1>"),r.b("\n"+
n),r.s(r.f("false",e,t,1),e,t,0,940,1060,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('          <a href="/artists/'
),n.b(n.v(n.d("artist.id",e,t,0))),n.b('/toggle_follow" class="follow turquoise_button flatbutton">FOLLOW</a>'
),n.b("\n")}),e.pop()),r.b("\n"+n),r.b('        <span class="connector">&nbsp;<span class="i-plus"></span>&nbsp;</span>'
),r.b("\n"+n),r.b("\n"+n),r.b('        <div id="search_tags" style="display: none;">'
),r.b("\n"+n),r.s(r.f("selected_tags",e,t,1),e,t,0,1235,1464,"{{ }}")&&(r.rs(e,t,
function(e,t,r){r.b('            <span class="title_tag" data-tag="'),r.b(r.v(r.d
(".",e,t,0))),r.b('">'),r.b("\n"+n),r.b('              <span class="i-close"></span> '
),r.b("\n"+n),r.b('              <span class="text">'),r.b(r.v(r.d(".",e,t,0))),r
.b("</span>"),r.b("\n"+n),r.b("            </span>"),r.b("\n"+n),r.b('            &nbsp;<span class="i-plus"></span>&nbsp;'
),r.b("\n")}),e.pop()),r.b("        </div>"),r.b("\n"+n),r.b("        "),r.b("\n"
)}),e.pop()),r.s(r.d("selected_tags.length.nonzero",e,t,1),e,t,1,0,0,"")||(r.b('        <div id="search_tags" style="display: none;"></div>'
),r.b("\n")),r.b("      "),r.b("\n"+n),r.b('      <div class="searchbox" '),r.s(r
.d("selected_tags.length.nonzero?",e,t,1),e,t,0,1757,1779,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b('style="display: none;"')}),e.pop()),r.b(">"),r.b("\n"+n),r.b('        <form accept-charset="UTF-8" action="/search" class="search" method="get">'
),r.b("\n"+n),r.b('          <div class="search_wrapper">'),r.b("\n"+n),r.b('            <input autocomplete="off" class="text q" id="q" name="q" placeholder="Type any artist, activity, genre or mood" type="text">'
),r.b("\n"+n),r.b("          </div>"),r.b("\n"+n),r.b("\n"+n),r.b('          <span class="i i-x search_clear"></span>'
),r.b("\n"+n),r.b('          <span class="i i-search search_icon"></span>'),r.b("\n"+
n),r.b("\n"+n),r.b('          <input type="submit" value=" " style="visibility: hidden; position: absolute;"/>'
),r.b("\n"+n),r.b("        </form>"),r.b("\n"+n),r.b("\n"+n),r.b('        <div class="autocomplete"></div>'
),r.b("\n"+n),r.b("      </div>"),r.b("\n"+n),r.b("      "),r.b("\n"+n),r.b("\n"+
n),r.b('      <a href="#" class="search_button title_tag" '),r.s(r.d("selected_tags.length.nonzero?"
,e,t,1),e,t,1,0,0,"")||r.b('style="display: none;"'),r.b(">"),r.b("\n"+n),r.b('        <span class="i-search"></span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("\n"+
n),r.b('    <div class="col-md-12 clear clearfix">'),r.b("\n"+n),r.b('      <a id="play_all_pill" href="#" class="play_all quick_play" style="background: '
),r.b(r.v(r.f("master_color",e,t,0))),r.b("; "),r.s(r.f("logged_out",e,t,1),e,t,0
,2733,2747,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("display: none;")}),e.pop()),r
.b('">'),r.b("\n"+n),r.b('        <span class="inner-border"></span>'),r.b("\n"+n
),r.b('        <span class="i-play"></span>'),r.b("\n"+n),r.b('        <span class="text">&nbsp;PLAY ALL</span>'
),r.b("\n"+n),r.b("      </a>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div><!--.row-->"
),r.b("\n"+n),r.b("\n"+n),r.b("</div><!--.container-->"),r.b("\n"),r.fl()},"",e,{
});return n.template=t,n}),define("hgn!templates/explore/_description",["hogan"],
function(e){function n(){return t.render.apply(t,arguments)}var t=new e.Template(
function(e,t,n){var r=this;return r.b(n=n||""),r.s(r.f("logged_out",e,t,1),e,t,0,17
,1622,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('    <div class="container">'),r.b("\n"+
n),r.b('      <div class="row">'),r.b("\n"+n),r.b('        <div class="col-md-12" id="play_all_container">'
),r.b("\n"+n),r.b('          <a id="play_all_circle" href="#" class="play_all quick_play" style="background-color: '
),r.b(r.v(r.f("master_color",e,t,0))),r.b(';">'),r.b("\n"+n),r.s(r.d("artist.image_url"
,e,t,1),e,t,0,275,365,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('              <img src="'
),n.b(n.v(n.d("artist.image_url",e,t,0))),n.b('>" class="avatar" width="100%"/>')
,n.b("\n")}),e.pop()),r.b('            <span class="inner-border"></span>'),r.b("\n"+
n),r.b('            <span class="i-play"></span>'),r.b("\n"+n),r.b('            <span class="text">PLAY ALL</span>'
),r.b("\n"+n),r.b("          </a>"),r.b("\n"+n),r.b("        </div>"),r.b("\n"+n)
,r.b("      </div>"),r.b("\n"+n),r.b('      <div class="row">'),r.b("\n"+n),r.b('        <div class="hidden-lg hidden-xl hidden-md hidden-xs col-sm-2"></div>'
),r.b("\n"+n),r.b('        <div class="col-md-5 col-sm-8">'),r.b("\n"+n),r.s(r.d("selected_tags.length.nonzero"
,e,t,1),e,t,0,749,795,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b("            "),n.b
(n.t(n.f("welcome_seo_text",e,t,0))),n.b("\n")}),e.pop()),r.s(r.d("selected_tags.length.nonzero"
,e,t,1),e,t,1,0,0,"")||(r.b('            Welcome to <strong>8tracks radio</strong>. Free music streaming for any time, place, or mood. You can download one of our <a href="/apps"><strong>free apps</strong></a> to enjoy internet radio on your favorite device.'
),r.b("\n")),r.b("        </div>"),r.b("\n"+n),r.b("\n"+n),r.b('        <div class="col-md-2 col-sm-3"></div>'
),r.b("\n"+n),r.b("\n"+n),r.b('        <div id="station_signup" class="col-md-5 col-sm-12">'
),r.b("\n"+n),r.b("          <!--h6>Sign up</h6>"),r.b("\n"+n),r.b("          <p>Get personalized recommendations, save your favorite playlists, and follow DJs you like.</p-->"
),r.b("\n"+n),r.b('          <div class="js-connected-sites clearfix">'),r.b("\n"+
n),r.b("            "),r.b(r.t(r.f("facebook_authorize_button",e,t,0))),r.b("\n"+
n),r.b("            "),r.b(r.t(r.f("google_plus_authorize_button",e,t,0))),r.b("\n"+
n),r.b("          </div>"),r.b("\n"+n),r.b("        </div>"),r.b("\n"+n),r.b("      </div><!--.row -->"
),r.b("\n"+n),r.b("    </div>"),r.b("\n")}),e.pop()),r.fl()},"",e,{});return n.template=
t,n}),define("hgn!templates/explore/_filters",["hogan"],function(e){function n(){
return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=this
;return r.b(n=n||""),r.s(r.d("filters.length.nonzero",e,t,1),e,t,0,27,926,"{{ }}"
)&&(r.rs(e,t,function(e,t,r){r.b('  <div id="explore_filters">'),r.b("\n"+n),r.b('    <div class="col-xs-1" id="browse_page_left">'
),r.b("\n"+n),r.b('      <a class="page_previous page_horizontal disabled" href="#"><span class="i-chevron-left"></span></a>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b('    <div class="col-xs-10 col-md-10">'
),r.b("\n"+n),r.b('      <div id="filters_wrapper">'),r.b("\n"+n),r.b('        <div id="filters">'
),r.b("\n"+n),r.b('          <div class="tags_pages">'),r.b("\n"+n),r.b('            <div class="tag_page">'
),r.b("\n"+n),r.s(r.f("filters",e,t,1),e,t,0,417,463,"{{ }}")&&(r.rs(e,t,function(
e,t,n){n.b("                "),n.b(n.t(n.f("tag_link",e,t,0))),n.b("\n")}),e.pop(
)),r.b("                <!--<% @tag_searcher.tags_strings.each do |tag_name| %>")
,r.b("\n"+n),r.b("                  <%= tag_link(tag_name, :relative => @mix_set.is_a_tags_mix_set?) %>"
),r.b("\n"+n),r.b("                <% end %>-->"),r.b("\n"+n),r.b("            </div>"
),r.b("\n"+n),r.b("          </div>"),r.b("\n"+n),r.b("        </div>"),r.b("\n"+
n),r.b("      </div>"),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b('    <div class="col-xs-1" id="browse_page_right">'
),r.b("\n"+n),r.b('      <a class="page_next page_horizontal" href="#"><span class="i-chevron-right"></span></a>'
),r.b("\n"+n),r.b("    </div>"),r.b("\n"+n),r.b("  </div><!--#explore_filters -->"
),r.b("\n")}),e.pop()),r.b("\n"+n),r.b("\n"+n),r.s(r.f("false",e,t,1),e,t,0,966,1833
,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.s(r.d("tag_top_artists.length.nonzero",e,t
,1),e,t,0,1002,1797,"{{ }}")&&(r.rs(e,t,function(e,t,r){r.b('  <div class="container clear">'
),r.b("\n"+n),r.b('    <!--div class="row">'),r.b("\n"+n),r.b('      <div class="col-md-12"><h6>RELATED ARTISTS</h6><br /></div>'
),r.b("\n"+n),r.b("    </div-->"),r.b("\n"+n),r.b('    <div class="row">'),r.b("\n"+
n),r.b('      <div class="col-md-12">'),r.b("\n"+n),r.b("        <br />"),r.b("\n"+
n),r.s(r.f("tag_top_artists",e,t,1),e,t,0,1234,1726,"{{ }}")&&(r.rs(e,t,function(
e,t,r){r.b('          <div class="artist">'),r.b("\n"+n),r.b('            <a href="'
),r.b(r.v(r.f("web_path",e,t,0))),r.b('">'),r.b("\n"+n),r.s(r.f("image_url_for_search"
,e,t,1),e,t,0,1341,1425,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('                <img src="'
),n.b(n.v(n.f("image_url_for_search",e,t,0))),n.b('" class="avatar"/>'),n.b("\n")
}),e.pop()),r.s(r.f("image_url_for_search",e,t,1),e,t,1,0,0,"")||(r.b('                <span class="avatar">'
),r.b("\n"+n),r.b('                  <span class="i-profile-v2"></span>'),r.b("\n"+
n),r.b("                </span>"),r.b("\n")),r.b("            </a>"),r.b("\n"+n),
r.b("            <strong>"),r.b(r.v(r.f("name",e,t,0))),r.b("</strong>"),r.b("\n"+
n),r.b("          </div>"),r.b("\n")}),e.pop()),r.b("      </div>"),r.b("\n"+n),r
.b("    </div>"),r.b("\n"+n),r.b("  </div><!--.container-->"),r.b("\n")}),e.pop()
)}),e.pop()),r.fl()},"",e,{});return n.template=t,n}),define("views/google_plus_view"
,["views/trax_view","lib/jsonh.jquery","lib/sessions","global_trax"],function(e,t
,n,r){var i=e.extend({initialize:function(e){e&&(this.customCallback=e.customCallback
,this.customErrorFunction=e.customErrorFunction),_.bindAll(this,"enabled","renderCustomButton"
,"loadGapi","asyncGooglePlus","sendAuthCode","unauthorized","logIn","signInCallBack"
),_.isUndefined(window.googlePlusCallback)&&(window.googlePlusCallback=_.bind(this
.signInCallBack,this)),window.gapi&&gapi.load("auth2",this.loadGapi)},enabled:function(
){return!0},renderCustomButton:function(e,t){var n={scope:"email profile",client_id
:GOOGLE_CLIENT_ID,redirecturi:"postmessage",cookiepolicy:"single_host_origin",callback
:"googlePlusCallback"};_.isUndefined(t)||_.extend(n,t),gapi.signin2.render(e,n)},
loadGapi:function(){typeof auth2=="undefined"&&(auth2=gapi.auth2.init({client_id:
GOOGLE_CLIENT_ID,cookiepolicy:"single_host_origin",scope:"email profile"}));var e=
$(".google-plus-container:not(.attached)");for(var t=0;t<e.length;t++)auth2.attachClickHandler
(e[t],{scope:"email profile "+($(e[t]).data("scope")||"")},this.signInCallBack,this
.customErrorFunction||function(e){console.log("error signing in")}),$(e[t]).addClass
("attached")},asyncGooglePlus:function(e,t){var n=$("#"+e);if(n.data("gapiattached"
))return;this.renderCustomButton(e,t)},sendAuthCode:function(e){var r=this,i=e.getAuthResponse
();id_token=i.id_token,access_token=i.access_token,youtube_auth=i.scope&&i.scope.
match(/youtube/),t.now("/auth/google-plus/callback",{access_token:access_token,youtube_auth
:youtube_auth},function(e){r.logIn(e),i.scope&&i.scope.match(/youtube/)&&n.trigger
("youtube-connected")},{type:"POST"}).error(this.unauthorized)},unauthorized:function(
e,t,n){try{json=JSON.parse(e.responseText)}catch(i){json={}}json.user_error_message?
r.show_flash_error(json.user_error_message,!1):r.show_flash_error("Something is wrong with Google+. Please try again."
)},logIn:function(e){n.onBackendLogin(e)},signInCallBack:function(e){var t=e.getAuthResponse
(),r=!1;t.scope&&t.scope.match(/youtube/)&&n.trigger("youtube-started"),this.sendAuthCode
(e,r),typeof this.customCallback=="function"&&this.customCallback.call(this,e)}})
;return i}),define("hgn!templates/shared/autocomplete",["hogan"],function(e){function n
(){return t.render.apply(t,arguments)}var t=new e.Template(function(e,t,n){var r=
this;return r.b(n=n||""),r.s(r.f("results",e,t,1),e,t,0,12,354,"{{ }}")&&(r.rs(e,
t,function(e,t,r){r.b('  <li class="result '),r.b(r.v(r.f("type",e,t,0))),r.b('" data-href="/explore/'
),r.s(r.f("to_url_param",e,t,1),e,t,0,80,84,"{{ }}")&&(r.rs(e,t,function(e,t,n){n
.b("term")}),e.pop()),r.b('" data-tag="'),r.b(r.v(r.f("term",e,t,0))),r.b('">'),r
.b("\n"+n),r.b("    "),r.s(r.f("selected_tags",e,t,1),e,t,0,146,201,"{{ }}")&&(r.
rs(e,t,function(e,t,n){n.b('<span class="tag">'),n.b(n.v(n.d(".",e,t,0))),n.b("</span>&nbsp;&nbsp;+&nbsp;&nbsp;"
)}),e.pop()),r.b(" "),r.b("\n"+n),r.b('    <span class="tag">'),r.b(r.v(r.f("term"
,e,t,0))),r.b("</span>"),r.b("\n"+n),r.b("    "),r.s(r.f("count",e,t,1),e,t,0,273
,335,"{{ }}")&&(r.rs(e,t,function(e,t,n){n.b('<span class="count">'),n.b(n.v(n.d("count.to_human_number"
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
),r.b("\n"+n),r.b("</li>"),r.fl()},"",e,{});return n.template=t,n}),define("views/autocomplete_view"
,["views/trax_view","hgn!templates/shared/autocomplete","lib/jsonh.jquery","lib/trax_utils"
],function(e,t,n,r){var i=e.extend({initialize:function(e){_.bindAll(this,"render"
,"search","onBlur"),this.placeholder=e.placeholder,this.emptyMessage=e.emptyMessage
,this.queryOptions=e.queryOptions,this.interval=e.interval||250,this.endpoint=e.endpoint||"/algolia/search.jsonh"
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
("character",t),n.moveStart("character",t),n.select()}});return i}),define("views/explore_view"
,["global_trax","views/trax_view","views/mix_set_view","hgn!templates/explore/_browse_header"
,"hgn!templates/explore/_station","hgn!templates/explore/_description","hgn!templates/explore/_filters"
,"lib/events","lib/jsonh.jquery","lib/trax_utils","lib/link_helper","lib/_template_helpers"
,"views/google_plus_view","views/autocomplete_view"],function(e,t,n,r,i,s,o,u,a,f
,l,c,h,p){var d=t.extend({el:"#belly",events:{"click #explore_filters .tag":"onTagClick"
,"click #browse .tag":"onTagClick","click #related_tags .tag":"onTagClick","click #selected_sort"
:"onSortClick","click #sort_select a":"onSortSelect","click .play_all":"onPlayAllClick"
,"click #explore_filters .page_horizontal":"onTagPageClick","click .follow":"onFollowClick"
,"click .search_button":"onSearchClick","click .title_tag .i-close":"onTagRemove"
},initialize:function(e){_.bindAll(this,"remove_elements_slowly","unloadContent","renderTagPage"
,"onAutocompleteSelect","onAutocompleteEnter"),this.childViews=[],this.currentPath=""
,this.sort=null,this.useMasthead=!0,e=e||{},this.smart_type=null,this.currentPath=
window.location.pathname+window.location.search,this.tags=[],this.exploreFilterPage=1
,PAGE.serverRendered&&(this.tags=PAGE.tags,this.sort=PAGE.sort,this.preRender(),new 
h),$("#thin_header").addClass("scrollable exploring")},preRender:function(){this.
$("#collections-spinner").html(e.spinner({length:10,radius:8}))},afterRender:function(
){this.mixSetView||(this.mixSetView=new n({el:this.$(".mix_set"),showAds:!0,useVideoAds
:!0,mix_set:PAGE.mix_set}),this.childViews.push(this.mixSetView),this.mixSetView.
afterRender(),App.Trax.setGradient(this.$("canvas")[0]),App.Sessions.updatePermissionsDisplay
()),this.autocompleteView||(this.autocompleteView=new p({placeholder:this.placeholderText||"Type any artist, genre, or mood"
,el:this.$(".searchbox"),categories:["mtags","artists"],onSelect:this.onAutocompleteSelect
,onEnter:this.onAutocompleteEnter,autoSelect:!0,$input:this.$(".q")})),this.bindElements
(),this.$spinner&&this.$spinner.css({opacity:0}),(App.Sessions.logged_in()||!PAGE
.serverRendered)&&$("#explore_description").remove()},bindElements:function(){console
.log("ExploreView bindElements()"),this.$collections=this.$("#collections"),this.
$paging=this.$("#mixes_paging"),this.$spinner=this.$("#collections-spinner .spin"
),this.$tagsPages=this.$(".tags_pages"),this.$relatedTags=this.$("#related_artists"
)},render:function(e,t){if(e.status==404){this.smart_type="tags",this.$spinner.css
({opacity:0}),this.mixSetView.$el.fadeIn();return}this.smart_type=e.mix_set.smart_type
,this.tags=e.mix_set.tags_list||[],this.sort=e.mix_set.sort,this.exploreFilterPage=1
,this.bindElements();if(!t){this.renderStation(e);var n=new c(e);this.$("#related_artists"
).html(o(n))}else this.renderTags(e),this.$("#explore_description").hide();this.renderMixSet
(e.mix_set),$("#page_description").hide(),$("#play_all_pill").show()},renderStation
:function(e){var t=new c(e);t.logged_out=!App.Sessions.logged_in();try{var n=e.mix_set
.mixes[0];t.master_image=n.cover_urls.static_cropped_imgix_url,t.master_palette=n
.color_palette.join(",");var r=darkenRgb(hexToRgb(n.color_palette[0]));r.push(1),
t.master_color="rgba("+r.join(",")+")",t.tag_top_artists=e.tag_top_artists,t.artist=
e.artist,t.selected_tags=this.tags}catch(o){console.log(o)}this.$("#station").html
(i(t)),t.logged_out&&(this.$("#explore_description").html(s(t)),new h),this.station_rendered=!0
},renderTags:function(e){this.$tagsPages.length==0&&(this.$tagsPages=this.$(".tags_pages"
)),this.$tagsPages.empty().css({left:0}),this.tags.length<3&&(this.smart_type=="all"||
this.smart_type=="tags")?(this.tags.length==2?this.$(".page_horizontal").hide():this
.$(".page_horizontal").show(),this.renderTagPage(e),this.$relatedTags.fadeIn(100)
):this.$relatedTags.hide(),e.mix_set.mixes[0]&&App.Trax.setGradient(this.$("canvas"
)[0],e.mix_set.mixes[0].color_palette)},renderTagPage:function(t){var n=$('<div class="tag_page fade-out"></div>'
),r="";for(var i=0;i<t.filters.length;i++)r+=e.templateHelpers.tag(t.filters[i].name
,!1,!1,"tag",t.filters[i].color1,t.filters[i].color2,t.filters[i].artist_avatar)+" "
;n.append(r),this.$tagsPages.append(n),_.delay(function(){n.removeClass("fade-out"
)},50),this.loadingTags=!1},loadRemote:_.debounce(function(t){this.unloadContent(
),t=t||this.generateCurrentURL(),e.pushCurrentState(t),a.now(t,{include:"details+mixes[likes_count+user+length+nsfw+artist_tags]+pagination+explore_filters+current_user_prefs"
,context:this.explore_filter_context},_.bind(function(n){u.gaPageview(t),this.render
(n,!0),e.refreshSidebarAd()},this)),this.currentPath=t},250),renderMixSet:function(
e){this.mixSetView&&(this.mixSetView.close({keepDomElement:!0}),delete this.mixSetView
),App.views.adsView&&App.views.adsView.resetAds(),this.$(".browse_header").html(r
(new c(e)));var t=e.html_name;this.tags.length>0&&(t=_.map(this.tags,function(e){
return'<span class="tag">'+_.escape(e)+"</span>"}).join(" <strong>+</strong> ")),
$("#thin_header .scrolling .title").html(t);if(e.mixes.length>0){var i=$(".master_image:first"
),s=$('<img class="master_image" src="'+e.mixes[0].cover_urls.max1024+'" style="opacity: 0;" width="100%" />'
);s[0].onload=function(){this.style.opacity=.3},i.after(s).css({opacity:0}).delay
(2e3).remove();var o=darkenRgb(hexToRgb(e.mixes[0].color_palette[0]));o.push(1);var u="rgba("+
o.join(",")+")";this.$(".play_all:visible").css("background",u)}var a=this;this.$
(".mix_set").queue(function(){a.mixSetView=new n({el:this,mix_set:e,showAds:!0,useVideoAds
:!0}),a.mixSetView.render({mix_set:e}),$(this).css({opacity:1}),a.$spinner.css({opacity
:0}),a.$el.css({height:"auto"}),$(this).dequeue(),a.afterRender(),window.scrollTo
(0,0)});return},updateSearch:function(){if(this.tags.length>0){var e=_.map(this.tags
,function(e){return'<span class="title_tag" data-tag="'+e+'">'+'<span class="i-close"></span>'+'<span class="text">'+
e+"</span>"+"</span>"+"&nbsp;"+'<span class="i-plus"></span>'}).join("");this.$("#search_tags"
)[0].className="",this.$("#search_tags").html(e).show(),this.$(".searchbox, #title_tag, .connector"
).hide(),this.$(".search_button").show()}else this.$(".search_button, #search_tags, #title_tag, .connector"
).hide(),this.$(".searchbox").show();this.$(".q").val(""),this.tags.join(" + ")},
unloadContent:function(){this.$el.css({height:this.$el.height()}),this.$spinner&&
this.$spinner.css({opacity:1}),this.$paging&&this.$paging.hide(),this.$(".mix_set"
).css({opacity:0}).delay(300)},remove_elements_slowly:function(e,t){if(e.length===0
)return;var n=$(e.splice(e.length-1,1)[0]);n.fadeOut(100,function(){$(this).remove
()}),_.delay(this.remove_elements_slowly,t||5,e,t)},generateCurrentURL:function()
{var e="/explore",t="";return this.tags.length>0?e+="/"+_.collect(this.tags,f.toUrlParam
).join("+"):t="/all",this.sort?e+=t+"/"+this.sort:e+=t+"/popular",e},play:function(
){this.mixSetView&&this.mixSetView.play()},onTagClick:function(e){var t=$(e.currentTarget
).attr("title");return this.addTag(t),!1},addTag:function(e){return this.tags.push
(e),this.tags=_.uniq(this.tags),this.tags.length==1&&(this.explore_filter_context=
this.tags[0]),this.artist_name="",this.updateSearch(),this.loadRemote(),!1},onTagRemove
:function(e){var t=$(e.currentTarget).parent().data("tag");t?this.removeTag(t):(this
.tags=[],this.updateSearch(),this.loadRemote())},removeTag:function(e){this.tags=
_.reject(this.tags,function(t){return t.toLowerCase()==e.toLowerCase()}),this.updateSearch
(),this.loadRemote()},onSortClick:function(e){return this.$("#sort_select").toggle
(),$(document).click(_.bind(function(){this.$("#sort_select").hide(),$(document).
unbind("click")},this)),!1},onSortSelect:function(e){return this.$("#sort_select"
).hide(),this.$("#selected_sort").html($(e.currentTarget).data("sort_name")+' <span class="i-triangle-down"></span>'
),this.loadRemote(e.currentTarget.pathname),!1},onTagPageClick:function(e){if(this
.loadingTags)return!1;if($(e.currentTarget).hasClass("disabled"))return!1;var t=$
(e.currentTarget).hasClass("page_next")?1:-1,n=$(this.$tagsPages.children()[this.
exploreFilterPage-1]);n.addClass("fade-out slide-"+(t>0?"left":"right")),_.delay(
function(){n.addClass("tagpage-hidden")},300),this.exploreFilterPage+=t,this.exploreFilterPage==1?
this.$(".page_previous").addClass("disabled"):this.$(".page_previous").removeClass
("disabled");if(t==-1||this.$tagsPages.children().length>=this.exploreFilterPage)
{var r=$(this.$tagsPages.children()[this.exploreFilterPage-1]);return r.removeClass
("tagpage-hidden"),_.delay(function(){r.removeClass("slide-left slide-right fade-out"
)},50),!1}var i={page:this.exploreFilterPage,per_page:20,from:"web_explore",context
:this.tags};return a.now("/explore_filters",i,this.renderTagPage),this.loadingTags=!0
,!1},onPlayAllClick:function(e){return this.mixSetView.play(),TraxEvents.track("simplified explore: play all"
,{event_type:"click"}),!1},onSearchClick:function(e){return this.$(".searchbox, #search_tags"
).show(),this.$(".search_button, #title_tag, .connector").hide(),this.$("#search_tags"
)[0].className="has_"+this.tags.length+"_tags",this.$("input.q").focus(),!1},onFollowClick
:function(e){return l.follow_link_click(e),!1},onAutocompleteSelect:function(e){this
.$(".autocomplete .results").empty().hide();var t=e.data("tag").toString().trim()
;return this.addTag(t),!1},onAutocompleteEnter:function(e){return this.addTag(e),!1
},onClose:function(){$("#thin_header").removeClass("scrollable stuck exploring"),
$("#thin_header .scrolling .title").html(""),this.mixSetView.close()}});return d}
),require(["views/explore_view"],function(e){App.Views.ExploreView||(App.Views.ExploreView=
e),PAGE.serverRendered||App.views.appView.showBrowseView();if(PAGE.serverRendered
){App.views.exploreView=new e,App.currentView=App.views.exploreView,App.views.exploreView
.afterRender();var t=!!window.location.toString().match(/mix_set/)}}),define("pages/mixes_index"
,function(){});