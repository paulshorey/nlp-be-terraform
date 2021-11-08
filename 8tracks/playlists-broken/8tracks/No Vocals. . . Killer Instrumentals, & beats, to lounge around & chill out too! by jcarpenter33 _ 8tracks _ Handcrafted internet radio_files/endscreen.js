(function(g){var window=this;'use strict';var IRa=function(a,b){a.Ma("onAutonavCoundownStarted",b)},K5=function(a,b,c){g.N(a.element,"ytp-suggestion-set",!!b.videoId);
var d=b.playlistId;c=b.Ke(c?c:"mqdefault.jpg");var e=null,f=null;b instanceof g.FF&&(b.lengthText?(e=b.lengthText||null,f=b.hq||null):b.lengthSeconds&&(e=g.GL(b.lengthSeconds),f=g.GL(b.lengthSeconds,!0)));var h=!!d;d=h&&"RD"===g.BF(d).type;var l=b instanceof g.FF?b.isLivePlayback:null,m=b instanceof g.FF?b.isUpcoming:null;c={title:b.title,author:b.author,author_and_views:b.shortViewCount?b.author+" \u2022 "+b.shortViewCount:b.author,aria_label:b.Cl||g.lI("Watch $TITLE",{TITLE:b.title}),duration:e,
timestamp:f,url:b.Fk(),is_live:l,is_upcoming:m,is_list:h,is_mix:d,background:c?"background-image: url("+c+")":"",views_and_publish_time:b.shortViewCount?b.shortViewCount+" \u2022 "+b.publishedTimeText:b.publishedTimeText,autoplayAlternativeHeader:b.Rm};b instanceof g.EF&&(c.playlist_length=b.playlistLength);a.update(c)},L5=function(a){var b=a.V(),c=b.i;
g.W.call(this,{G:"a",L:"ytp-autonav-suggestion-card",W:{href:"{{url}}",target:c?b.D:"","aria-label":"{{aria_label}}","data-is-live":"{{is_live}}","data-is-list":"{{is_list}}","data-is-mix":"{{is_mix}}","data-is-upcoming":"{{is_upcoming}}"},U:[{G:"div",Ga:["ytp-autonav-endscreen-upnext-thumbnail","ytp-autonav-thumbnail-small"],W:{style:"{{background}}"},U:[{G:"div",W:{"aria-label":"{{timestamp}}"},Ga:["ytp-autonav-timestamp"],ya:"{{duration}}"},{G:"div",Ga:["ytp-autonav-live-stamp"],ya:"Live"},{G:"div",
Ga:["ytp-autonav-upcoming-stamp"],ya:"Upcoming"},{G:"div",L:"ytp-autonav-list-overlay",U:[{G:"div",L:"ytp-autonav-mix-text",ya:"Mix"},{G:"div",L:"ytp-autonav-mix-icon"}]}]},{G:"div",Ga:["ytp-autonav-endscreen-upnext-title","ytp-autonav-title-card"],ya:"{{title}}"},{G:"div",Ga:["ytp-autonav-endscreen-upnext-author","ytp-autonav-author-card"],ya:"{{author}}"},{G:"div",Ga:["ytp-autonav-endscreen-upnext-author","ytp-autonav-view-and-date-card"],ya:"{{views_and_publish_time}}"}]});this.J=a;this.suggestion=
null;this.i=c;this.Ra("click",this.onClick);this.Ra("keypress",this.onKeyPress)},N5=function(a,b){b=void 0===b?!1:b;
g.W.call(this,{G:"div",L:"ytp-autonav-endscreen-countdown-container"});var c=this;this.I=b;this.D=void 0;this.u=0;b=a.V();var d=b.i;this.J=a;this.suggestion=null;this.onVideoDataChange("newdata",this.J.getVideoData());this.T(a,"videodatachange",this.onVideoDataChange);this.i=new g.W({G:"div",L:"ytp-autonav-endscreen-upnext-container",W:{"aria-label":"{{aria_label}}","data-is-live":"{{is_live}}","data-is-list":"{{is_list}}","data-is-mix":"{{is_mix}}","data-is-upcoming":"{{is_upcoming}}"},U:[{G:"div",
L:"ytp-autonav-endscreen-upnext-header"},{G:"div",L:"ytp-autonav-endscreen-upnext-alternative-header",ya:"{{autoplayAlternativeHeader}}"},{G:"a",L:"ytp-autonav-endscreen-link-container",W:{href:"{{url}}",target:d?b.D:""},U:[{G:"div",L:"ytp-autonav-endscreen-upnext-thumbnail",W:{style:"{{background}}"},U:[{G:"div",W:{"aria-label":"{{timestamp}}"},Ga:["ytp-autonav-timestamp"],ya:"{{duration}}"},{G:"div",Ga:["ytp-autonav-live-stamp"],ya:"Live"},{G:"div",Ga:["ytp-autonav-upcoming-stamp"],ya:"Upcoming"}]},
{G:"div",L:"ytp-autonav-endscreen-video-info",U:[{G:"div",L:"ytp-autonav-endscreen-premium-badge"},{G:"div",L:"ytp-autonav-endscreen-upnext-title",ya:"{{title}}"},{G:"div",L:"ytp-autonav-endscreen-upnext-author",ya:"{{author}}"},{G:"div",L:"ytp-autonav-view-and-date",ya:"{{views_and_publish_time}}"},{G:"div",L:"ytp-autonav-author-and-view",ya:"{{author_and_views}}"}]}]}]});g.I(this,this.i);this.i.Da(this.element);d||this.T(this.i.Fa("ytp-autonav-endscreen-link-container"),"click",this.aI);this.J.Mb(this.element,
this,115127);this.J.Mb(this.i.Fa("ytp-autonav-endscreen-link-container"),this,115128);this.overlay=new g.W({G:"div",L:"ytp-autonav-overlay"});g.I(this,this.overlay);this.overlay.Da(this.element);this.B=new g.W({G:"div",L:"ytp-autonav-endscreen-button-container"});g.I(this,this.B);this.B.Da(this.element);this.cancelButton=new g.W({G:"button",Ga:["ytp-autonav-endscreen-upnext-button","ytp-autonav-endscreen-upnext-cancel-button"],W:{"aria-label":"Cancel autoplay"},ya:"Cancel"});g.I(this,this.cancelButton);
this.cancelButton.Da(this.B.element);this.cancelButton.Ra("click",this.iQ,this);this.J.Mb(this.cancelButton.element,this,115129);this.playButton=new g.W({G:"a",Ga:["ytp-autonav-endscreen-upnext-button","ytp-autonav-endscreen-upnext-play-button"],W:{href:"{{url}}",role:"button","aria-label":"Play next video"},ya:"Play Now"});g.I(this,this.playButton);this.playButton.Da(this.B.element);this.playButton.Ra("click",this.aI,this);this.J.Mb(this.playButton.element,this,115130);this.C=new g.L(function(){M5(c)},
500);
g.I(this,this.C);this.ZH();this.T(a,"autonavvisibility",this.ZH)},Q5=function(a){var b=a.J.jj(!0,a.J.isFullscreen());
g.N(a.element,"ytp-autonav-endscreen-small-mode",a.tf(b));g.N(a.element,"ytp-autonav-endscreen-is-premium",!!a.suggestion&&!!a.suggestion.eB);g.N(a.J.getRootNode(),"ytp-autonav-endscreen-cancelled-state",!a.J.Yd());g.N(a.J.getRootNode(),"countdown-running",a.Jh());g.N(a.element,"ytp-player-content",a.J.Yd());g.Rl(a.overlay.element,{width:b.width+"px"});if(!a.Jh()){a.J.Yd()?O5(a,Math.round(P5(a)/1E3)):O5(a);b=!!a.suggestion&&!!a.suggestion.Rm;var c=a.J.Yd()||!b;g.N(a.element,"ytp-autonav-endscreen-upnext-alternative-header-only",
!c&&b);g.N(a.element,"ytp-autonav-endscreen-upnext-no-alternative-header",c&&!b);g.JK(a.B,a.J.Yd())}},M5=function(a){var b=P5(a),c=Math,d=c.min;
var e=a.u?Date.now()-a.u:0;c=d.call(c,e,b);O5(a,Math.ceil((b-c)/1E3));500>=b-c&&a.Jh()?a.select(!0):a.Jh()&&a.C.start()},P5=function(a){var b=a.J.Fp();
return 0<=b?b:g.S(a.J.V().experiments,"autoplay_time")||1E4},O5=function(a,b){b=void 0===b?-1:b;
a=a.i.Fa("ytp-autonav-endscreen-upnext-header");g.Pg(a);if(0<=b){b=String(b);var c="Up next in $SECONDS".match(RegExp("\\$SECONDS","gi"))[0],d="Up next in $SECONDS".indexOf(c);if(0<=d){a.appendChild(g.Og("Up next in $SECONDS".slice(0,d)));var e=g.Ng("span");g.Rq(e,"ytp-autonav-endscreen-upnext-header-countdown-number");g.Ug(e,b);a.appendChild(e);a.appendChild(g.Og("Up next in $SECONDS".slice(d+c.length)));return}}g.Ug(a,"Up next")},R5=function(a,b){g.W.call(this,{G:"div",
Ga:["html5-endscreen","ytp-player-content",b||"base-endscreen"]});this.created=!1;this.player=a},S5=function(a){g.W.call(this,{G:"div",
Ga:["ytp-upnext","ytp-player-content"],W:{"aria-label":"{{aria_label}}"},U:[{G:"div",L:"ytp-cued-thumbnail-overlay-image",W:{style:"{{background}}"}},{G:"span",L:"ytp-upnext-top",U:[{G:"span",L:"ytp-upnext-header",ya:"Up Next"},{G:"span",L:"ytp-upnext-title",ya:"{{title}}"},{G:"span",L:"ytp-upnext-author",ya:"{{author}}"}]},{G:"a",L:"ytp-upnext-autoplay-icon",W:{role:"button",href:"{{url}}","aria-label":"Play next video"},U:[{G:"svg",W:{height:"100%",version:"1.1",viewBox:"0 0 72 72",width:"100%"},
U:[{G:"circle",L:"ytp-svg-autoplay-circle",W:{cx:"36",cy:"36",fill:"#fff","fill-opacity":"0.3",r:"31.5"}},{G:"circle",L:"ytp-svg-autoplay-ring",W:{cx:"-36",cy:"36","fill-opacity":"0",r:"33.5",stroke:"#FFFFFF","stroke-dasharray":"211","stroke-dashoffset":"-211","stroke-width":"4",transform:"rotate(-90)"}},{G:"path",L:"ytp-svg-fill",W:{d:"M 24,48 41,36 24,24 V 48 z M 44,24 v 24 h 4 V 24 h -4 z"}}]}]},{G:"span",L:"ytp-upnext-bottom",U:[{G:"span",L:"ytp-upnext-cancel"},{G:"span",L:"ytp-upnext-paused",
ya:"Autoplay is paused"}]}]});this.api=a;this.cancelButton=null;this.D=this.Fa("ytp-svg-autoplay-ring");this.B=this.notification=this.i=this.suggestion=null;this.C=new g.L(this.By,5E3,this);this.u=0;var b=this.Fa("ytp-upnext-cancel");this.cancelButton=new g.W({G:"button",Ga:["ytp-upnext-cancel-button","ytp-button"],W:{tabindex:"0","aria-label":"Cancel autoplay"},ya:"Cancel"});g.I(this,this.cancelButton);this.cancelButton.Ra("click",this.jQ,this);this.cancelButton.Da(b);this.cancelButton&&this.api.Mb(this.cancelButton.element,
this,115129);g.I(this,this.C);this.api.Mb(this.element,this,18788);b=this.Fa("ytp-upnext-autoplay-icon");this.T(b,"click",this.kQ);this.api.Mb(b,this,115130);this.bI();this.T(a,"autonavvisibility",this.bI);this.T(a,"mdxnowautoplaying",this.LU);this.T(a,"mdxautoplaycanceled",this.MU);g.N(this.element,"ytp-upnext-mobile",this.api.V().isMobile)},JRa=function(a,b){return b?b:0<=a.api.Fp()?a.api.Fp():g.S(a.api.V().experiments,"autoplay_time")||1E4},T5=function(a,b){b=JRa(a,b);
var c=Math,d=c.min;var e=(0,g.Q)()-a.u;c=d.call(c,e,b);b=0===b?1:Math.min(c/b,1);a.D.setAttribute("stroke-dashoffset",""+-211*(b+1));1<=b&&a.Jh()&&3!==a.api.getPresentingPlayerType()?a.select(!0):a.Jh()&&a.i.start()},U5=function(a){R5.call(this,a,"autonav-endscreen");
this.overlay=this.videoData=null;this.table=new g.W({G:"div",L:"ytp-suggestion-panel",U:[{G:"div",Ga:["ytp-autonav-endscreen-upnext-header","ytp-autonav-endscreen-more-videos"],ya:"More videos"}]});this.K=new g.W({G:"div",L:"ytp-suggestions-container"});this.videos=[];this.B=null;this.D=this.I=!1;this.u=new N5(this.player);g.I(this,this.u);this.u.Da(this.element);a.getVideoData().Bc?this.i=this.u:(this.i=new S5(a),g.JM(this.player,this.i.element,4),g.I(this,this.i));this.overlay=new g.W({G:"div",
L:"ytp-autonav-overlay-cancelled-state"});g.I(this,this.overlay);this.overlay.Da(this.element);this.C=new g.iD(this);g.I(this,this.C);g.I(this,this.table);this.table.Da(this.element);this.table.show();g.I(this,this.K);this.K.Da(this.table.element);this.hide()},V5=function(a){var b=a.Yd();
b!==a.D&&(a.D=b,a.player.ea("autonavvisibility"),a.D?(a.u!==a.i&&a.u.hide(),a.table.hide()):(a.u!==a.i&&a.u.show(),a.table.show()))},W5=function(a){R5.call(this,a,"subscribecard-endscreen");
this.i=new g.W({G:"div",L:"ytp-subscribe-card",U:[{G:"img",L:"ytp-author-image",W:{src:"{{profilePicture}}"}},{G:"div",L:"ytp-subscribe-card-right",U:[{G:"div",L:"ytp-author-name",ya:"{{author}}"},{G:"div",L:"html5-subscribe-button-container"}]}]});g.I(this,this.i);this.i.Da(this.element);var b=a.getVideoData();this.subscribeButton=new g.ZN("Subscribe",null,"Unsubscribe",null,!0,!1,b.Ti,b.subscribed,"trailer-endscreen",null,null,a);g.I(this,this.subscribeButton);this.subscribeButton.Da(this.i.Fa("html5-subscribe-button-container"));
this.T(a,"videodatachange",this.Qa);this.Qa();this.hide()},X5=function(a){var b=a.V(),c=g.Zi||g.JE?{style:"will-change: opacity"}:void 0,d=b.i,e=["ytp-videowall-still"];
b.isMobile&&e.push("ytp-videowall-show-text");g.W.call(this,{G:"a",Ga:e,W:{href:"{{url}}",target:d?b.D:"","aria-label":"{{aria_label}}","data-is-live":"{{is_live}}","data-is-list":"{{is_list}}","data-is-mix":"{{is_mix}}"},U:[{G:"div",L:"ytp-videowall-still-image",W:{style:"{{background}}"}},{G:"span",L:"ytp-videowall-still-info",U:[{G:"span",L:"ytp-videowall-still-info-bg",U:[{G:"span",L:"ytp-videowall-still-info-content",W:c,U:[{G:"span",L:"ytp-videowall-still-info-title",ya:"{{title}}"},{G:"span",
L:"ytp-videowall-still-info-author",ya:"{{author_and_views}}"},{G:"span",L:"ytp-videowall-still-info-live",ya:"Live"},{G:"span",L:"ytp-videowall-still-info-duration",ya:"{{duration}}"}]}]}]},{G:"span",Ga:["ytp-videowall-still-listlabel-regular","ytp-videowall-still-listlabel"],U:[{G:"span",L:"ytp-videowall-still-listlabel-icon"},"Playlist",{G:"span",L:"ytp-videowall-still-listlabel-length",U:[" (",{G:"span",ya:"{{playlist_length}}"},")"]}]},{G:"span",Ga:["ytp-videowall-still-listlabel-mix","ytp-videowall-still-listlabel"],
U:[{G:"span",L:"ytp-videowall-still-listlabel-mix-icon"},"Mix",{G:"span",L:"ytp-videowall-still-listlabel-length",ya:" (50+)"}]}]});this.suggestion=null;this.u=d;this.api=a;this.i=new g.iD(this);g.I(this,this.i);this.Ra("click",this.onClick);this.Ra("keypress",this.onKeyPress);this.i.T(a,"videodatachange",this.onVideoDataChange);a.Sg(this.element,this);this.onVideoDataChange()},Y5=function(a){R5.call(this,a,"videowall-endscreen");
var b=this;this.J=a;this.B=0;this.stills=[];this.C=this.videoData=null;this.D=this.K=!1;this.S=null;this.u=new g.iD(this);g.I(this,this.u);this.I=new g.L(function(){g.M(b.element,"ytp-show-tiles")},0);
g.I(this,this.I);var c=new g.W({G:"button",Ga:["ytp-button","ytp-endscreen-previous"],W:{"aria-label":"Previous"},U:[g.OK()]});g.I(this,c);c.Da(this.element);c.Ra("click",this.oQ,this);this.table=new g.GK({G:"div",L:"ytp-endscreen-content"});g.I(this,this.table);this.table.Da(this.element);c=new g.W({G:"button",Ga:["ytp-button","ytp-endscreen-next"],W:{"aria-label":"Next"},U:[g.PK()]});g.I(this,c);c.Da(this.element);c.Ra("click",this.nQ,this);a.getVideoData().Bc?this.i=new N5(a,!0):this.i=new S5(a);
g.I(this,this.i);g.JM(this.player,this.i.element,4);this.hide()},Z5=function(a){return g.KM(a.player)&&a.Nu()&&!a.C},$5=function(a){var b=a.Yd();
b!==a.K&&(a.K=b,a.player.ea("autonavvisibility"))},a6=function(a){g.WM.call(this,a);
var b=this;this.endScreen=null;this.i=this.u=this.B=!1;this.listeners=new g.iD(this);g.I(this,this.listeners);this.env=a.V();KRa(a)?(this.B=!0,LRa(this),this.i?this.endScreen=new U5(a):this.endScreen=new Y5(this.player)):this.env.cd?this.endScreen=new W5(this.player):this.endScreen=new R5(this.player);g.I(this,this.endScreen);g.JM(this.player,this.endScreen.element,4);MRa(this);this.listeners.T(a,"videodatachange",this.onVideoDataChange,this);this.listeners.T(a,g.$z("endscreen"),function(c){b.onCueRangeEnter(c)});
this.listeners.T(a,g.aA("endscreen"),function(c){b.onCueRangeExit(c)})},LRa=function(a){var b=a.player.getVideoData();
if(!b||a.i===b.Sh&&a.u===b.Bc)return!1;a.i=b.Sh;a.u=b.Bc;return!0},KRa=function(a){a=a.V();
return a.xb&&!a.cd},MRa=function(a){a.player.Xe("endscreen");
var b=a.player.getVideoData();b=new g.Yz(Math.max(1E3*(b.lengthSeconds-10),0),0x8000000000000,{id:"preload",namespace:"endscreen"});var c=new g.Yz(0x8000000000000,0x8000000000000,{id:"load",priority:8,namespace:"endscreen"});a.player.Ad([b,c])};
g.CM.prototype.Fp=g.ca(2,function(){return this.app.Fp()});
g.XX.prototype.Fp=g.ca(1,function(){return this.getVideoData().YM});g.w(L5,g.W);L5.prototype.select=function(){(this.J.Pj(this.suggestion.videoId,this.suggestion.sessionData,this.suggestion.playlistId,void 0,void 0,this.suggestion.vv||void 0)||this.J.N("web_player_endscreen_double_log_fix_killswitch"))&&this.J.Cb(this.element)};
L5.prototype.onClick=function(a){g.sN(a,this.J,this.i,this.suggestion.sessionData||void 0)&&this.select()};
L5.prototype.onKeyPress=function(a){switch(a.keyCode){case 13:case 32:g.Mu(a)||(this.select(),g.Lu(a))}};g.w(N5,g.W);g.k=N5.prototype;g.k.Vx=function(a){this.suggestion!==a&&(this.suggestion=a,K5(this.i,a),this.playButton.Sa("url",this.suggestion.Fk()),Q5(this))};
g.k.Jh=function(){return 0<this.u};
g.k.Bt=function(){this.Jh()||(this.u=Date.now(),M5(this),IRa(this.J,P5(this)),g.N(this.J.getRootNode(),"countdown-running",this.Jh()))};
g.k.tq=function(){this.Dm();M5(this);var a=this.i.Fa("ytp-autonav-endscreen-upnext-header");a&&g.Ug(a,"Up next")};
g.k.Dm=function(){this.Jh()&&(this.C.stop(),this.u=0)};
g.k.select=function(a){this.J.nextVideo(!1,void 0===a?!1:a);this.Dm()};
g.k.aI=function(a){g.sN(a,this.J)&&(a.currentTarget===this.playButton.element?this.J.Cb(this.playButton.element):a.currentTarget===this.i.Fa("ytp-autonav-endscreen-link-container")&&(a=this.i.Fa("ytp-autonav-endscreen-link-container"),this.J.ib(a,!0),this.J.Cb(a)),this.select())};
g.k.iQ=function(){this.J.Cb(this.cancelButton.element);g.EM(this.J,!0);this.D&&this.J.Ma("innertubeCommand",this.D)};
g.k.onVideoDataChange=function(a,b){a=b.ZX;this.D=null===a||void 0===a?void 0:a.command};
g.k.ZH=function(){var a=this.J.Yd();this.I&&this.yb!==a&&g.JK(this,a);Q5(this);this.J.ib(this.element,a);this.J.ib(this.cancelButton.element,a);this.J.ib(this.i.Fa("ytp-autonav-endscreen-link-container"),a);this.J.ib(this.playButton.element,a)};
g.k.tf=function(a){return 400>a.width||459>a.height};g.w(R5,g.W);g.k=R5.prototype;g.k.create=function(){this.created=!0};
g.k.destroy=function(){this.created=!1};
g.k.Nu=function(){return!1};
g.k.Yd=function(){return!1};
g.k.mL=function(){return!1};g.w(S5,g.W);g.k=S5.prototype;g.k.By=function(){this.notification&&(this.C.stop(),this.hc(this.B),this.B=null,this.notification.close(),this.notification=null)};
g.k.Vx=function(a){this.suggestion=a;K5(this,a,"hqdefault.jpg")};
g.k.bI=function(){g.JK(this,this.api.Yd());this.api.ib(this.element,this.api.Yd());this.api.ib(this.Fa("ytp-upnext-autoplay-icon"),this.api.Yd());this.cancelButton&&this.api.ib(this.cancelButton.element,this.api.Yd())};
g.k.UU=function(){window.focus();this.By()};
g.k.Bt=function(a){var b=this;this.Jh()||(g.nv("a11y-announce","Up Next "+this.suggestion.title),this.u=(0,g.Q)(),this.i=new g.L(function(){T5(b,a)},25),T5(this,a),IRa(this.api,JRa(this,a)));
g.Uq(this.element,"ytp-upnext-autoplay-paused")};
g.k.hide=function(){g.W.prototype.hide.call(this)};
g.k.Jh=function(){return!!this.i};
g.k.tq=function(){this.Dm();this.u=(0,g.Q)();T5(this);g.M(this.element,"ytp-upnext-autoplay-paused")};
g.k.Dm=function(){this.Jh()&&(this.i.dispose(),this.i=null)};
g.k.select=function(a){a=void 0===a?!1:a;if(this.api.V().N("autonav_notifications")&&a&&window.Notification&&"function"===typeof document.hasFocus){var b=Notification.permission;"default"===b?Notification.requestPermission():"granted"!==b||document.hasFocus()||(this.By(),this.notification=new Notification("Up Next",{body:this.suggestion.title,icon:this.suggestion.Ke()}),this.B=this.T(this.notification,"click",this.UU),this.C.start())}this.Dm();this.api.nextVideo(!1,a)};
g.k.kQ=function(a){!g.Tg(this.cancelButton.element,g.Hu(a))&&g.sN(a,this.api)&&(this.api.Yd()&&this.api.Cb(this.Fa("ytp-upnext-autoplay-icon")),this.select())};
g.k.jQ=function(){this.api.Yd()&&this.cancelButton&&this.api.Cb(this.cancelButton.element);g.EM(this.api,!0)};
g.k.LU=function(a){this.api.getPresentingPlayerType();this.show();this.Bt(a)};
g.k.MU=function(){this.api.getPresentingPlayerType();this.Dm();this.hide()};
g.k.xa=function(){this.Dm();this.By();g.W.prototype.xa.call(this)};g.w(U5,R5);g.k=U5.prototype;g.k.create=function(){R5.prototype.create.call(this);this.C.T(this.player,"appresize",this.xu);this.C.T(this.player,"onVideoAreaChange",this.xu);this.C.T(this.player,"videodatachange",this.onVideoDataChange);this.C.T(this.player,"autonavchange",this.cI);this.C.T(this.player,"autonavcancel",this.lQ);this.onVideoDataChange()};
g.k.show=function(){R5.prototype.show.call(this);(this.I||this.B&&this.B!==this.videoData.clientPlaybackNonce)&&g.EM(this.player,!1);g.KM(this.player)&&this.Nu()&&!this.B?(V5(this),2===this.videoData.autonavState?this.player.V().N("fast_autonav_in_background")&&3===this.player.getVisibilityState()?this.i.select(!0):this.i.Bt():3===this.videoData.autonavState&&this.i.tq()):(g.EM(this.player,!0),V5(this));this.xu()};
g.k.hide=function(){R5.prototype.hide.call(this);this.i.tq();V5(this)};
g.k.xu=function(){var a=this.player.jj(!0,this.player.isFullscreen());V5(this);Q5(this.u);g.N(this.element,"ytp-autonav-cancelled-small-mode",this.tf(a));g.N(this.element,"ytp-autonav-cancelled-tiny-mode",this.Hz(a));g.N(this.element,"ytp-autonav-cancelled-mini-mode",400>=a.width||360>=a.height);this.overlay&&g.Rl(this.overlay.element,{width:a.width+"px"});if(!this.D){a=g.r(this.videos.entries());for(var b=a.next();!b.done;b=a.next()){var c=g.r(b.value);b=c.next().value;c=c.next().value;g.N(c.element,
"ytp-suggestion-card-with-margin",1===b%2)}}};
g.k.onVideoDataChange=function(){var a=this.player.getVideoData();if(this.videoData!==a&&a){this.videoData=a;if((a=this.videoData.suggestions)&&a.length){this.i.Vx(a[0]);this.i!==this.u&&this.u.Vx(a[0]);for(var b=0;b<NRa.length;++b){var c=NRa[b];if(a&&a[c]){this.videos[b]=new L5(this.player);var d=this.videos[b];c=a[c];d.suggestion!==c&&(d.suggestion=c,K5(d,c));g.I(this,this.videos[b]);this.videos[b].Da(this.K.element)}}}this.xu()}};
g.k.cI=function(a){1===a?(this.I=!1,this.B=this.videoData.clientPlaybackNonce,this.i.Dm(),this.yb&&this.xu()):(this.I=!0,this.Yd()&&(2===a?this.i.Bt():3===a&&this.i.tq()))};
g.k.lQ=function(a){a?this.cI(1):(this.B=null,this.I=!1)};
g.k.Nu=function(){return 1!==this.videoData.autonavState};
g.k.tf=function(a){return(910>a.width||459>a.height)&&!this.Hz(a)&&!(400>=a.width||360>=a.height)};
g.k.Hz=function(a){return 800>a.width&&!(400>=a.width||360>=a.height)};
g.k.Yd=function(){return this.yb&&g.KM(this.player)&&this.Nu()&&!this.B};
var NRa=[1,3,2,4];g.w(W5,R5);W5.prototype.Qa=function(){var a=this.player.getVideoData();this.i.update({profilePicture:a.Rh,author:a.author});this.subscribeButton.channelId=a.Ti;var b=this.subscribeButton;a.subscribed?b.u():b.B()};g.w(X5,g.W);X5.prototype.select=function(){(this.api.Pj(this.suggestion.videoId,this.suggestion.sessionData,this.suggestion.playlistId,void 0,void 0,this.suggestion.vv||void 0)||this.api.N("web_player_endscreen_double_log_fix_killswitch"))&&this.api.Cb(this.element)};
X5.prototype.onClick=function(a){g.sN(a,this.api,this.u,this.suggestion.sessionData||void 0)&&this.select()};
X5.prototype.onKeyPress=function(a){switch(a.keyCode){case 13:case 32:g.Mu(a)||(this.select(),g.Lu(a))}};
X5.prototype.onVideoDataChange=function(){var a=this.api.getVideoData(),b=this.api.V();this.u=a.D?!1:b.i};g.w(Y5,R5);g.k=Y5.prototype;g.k.create=function(){R5.prototype.create.call(this);var a=this.player.getVideoData();a&&(this.videoData=a);this.ol();this.u.T(this.player,"appresize",this.ol);this.u.T(this.player,"onVideoAreaChange",this.ol);this.u.T(this.player,"videodatachange",this.onVideoDataChange);this.u.T(this.player,"autonavchange",this.iC);this.u.T(this.player,"autonavcancel",this.mQ);a=this.videoData.autonavState;a!==this.S&&this.iC(a);this.u.T(this.element,"transitionend",this.kW)};
g.k.destroy=function(){g.Yx(this.u);(0,g.ie)(this.stills);this.stills=[];R5.prototype.destroy.call(this);g.Uq(this.element,"ytp-show-tiles");this.I.stop();this.S=this.videoData.autonavState};
g.k.Nu=function(){return 1!==this.videoData.autonavState};
g.k.show=function(){R5.prototype.show.call(this);g.Uq(this.element,"ytp-show-tiles");this.player.V().isMobile?g.Mq(this.I):this.I.start();(this.D||this.C&&this.C!==this.videoData.clientPlaybackNonce)&&g.EM(this.player,!1);Z5(this)?($5(this),2===this.videoData.autonavState?this.player.V().N("fast_autonav_in_background")&&3===this.player.getVisibilityState()?this.i.select(!0):this.i.Bt():3===this.videoData.autonavState&&this.i.tq()):(g.EM(this.player,!0),$5(this))};
g.k.hide=function(){R5.prototype.hide.call(this);this.i.tq();$5(this)};
g.k.kW=function(a){g.Hu(a)===this.element&&this.ol()};
g.k.ol=function(){if(this.videoData&&this.videoData.suggestions&&this.videoData.suggestions.length){g.M(this.element,"ytp-endscreen-paginate");var a=this.J.jj(!0,this.J.isFullscreen()),b=g.zM(this.J);b&&(b=b.Te()?48:32,a.width-=2*b);var c=a.width/a.height,d=96/54,e=b=2,f=Math.max(a.width/96,2),h=Math.max(a.height/54,2),l=this.videoData.suggestions.length,m=Math.pow(2,2);var n=l*m+(Math.pow(2,2)-m);n+=Math.pow(2,2)-m;for(n-=m;0<n&&(b<f||e<h);){var p=b/2,q=e/2,t=b<=f-2&&n>=q*m,u=e<=h-2&&n>=p*m;if((p+
1)/q*d/c>c/(p/(q+1)*d)&&u)n-=p*m,e+=2;else if(t)n-=q*m,b+=2;else if(u)n-=p*m,e+=2;else break}d=!1;n>=3*m&&6>=l*m-n&&(4<=e||4<=b)&&(d=!0);m=96*b;n=54*e;c=m/n<c?a.height/n:a.width/m;c=Math.min(c,2);m=Math.floor(Math.min(a.width,m*c));n=Math.floor(Math.min(a.height,n*c));a=this.table.element;g.em(a,m,n);g.Rl(a,{marginLeft:m/-2+"px",marginTop:n/-2+"px"});this.i.Vx(this.videoData.suggestions[0]);this.i instanceof N5&&Q5(this.i);g.N(this.element,"ytp-endscreen-takeover",Z5(this));$5(this);m+=4;n+=4;for(f=
c=0;f<b;f++)for(h=0;h<e;h++)if(p=c,q=0,d&&f>=b-2&&h>=e-2?q=1:0===h%2&&0===f%2&&(2>h&&2>f?0===h&&0===f&&(q=2):q=2),p=g.eg(p+this.B,l),0!==q){t=this.stills[c];t||(t=new X5(this.player),this.stills[c]=t,a.appendChild(t.element));u=Math.floor(n*h/e);var x=Math.floor(m*f/b),y=Math.floor(n*(h+q)/e)-u-4,z=Math.floor(m*(f+q)/b)-x-4;g.Yl(t.element,x,u);g.em(t.element,z,y);g.Rl(t.element,"transitionDelay",(h+f)/20+"s");g.N(t.element,"ytp-videowall-still-mini",1===q);g.N(t.element,"ytp-videowall-still-large",
2<q);q=t;p=this.videoData.suggestions[p];q.suggestion!==p&&(q.suggestion=p,t=q.api.V(),u=g.Sq(q.element,"ytp-videowall-still-large")?"hqdefault.jpg":"mqdefault.jpg",K5(q,p,u),g.LE(t)&&(t=p.Fk(),t=g.wi(t,g.rM("emb_rel_end")),q.Sa("url",t)),(p=(p=p.sessionData)&&p.itct)&&q.api.Bm(q.element,p));c++}g.N(this.element,"ytp-endscreen-paginate",c<l);for(b=this.stills.length-1;b>=c;b--)e=this.stills[b],g.Rg(e.element),(0,g.he)(e);this.stills.length=c}};
g.k.onVideoDataChange=function(){var a=this.player.getVideoData();this.videoData!==a&&(this.B=0,this.videoData=a,this.ol())};
g.k.nQ=function(){this.B+=this.stills.length;this.ol()};
g.k.oQ=function(){this.B-=this.stills.length;this.ol()};
g.k.mL=function(){return this.i.Jh()};
g.k.iC=function(a){1===a?(this.D=!1,this.C=this.videoData.clientPlaybackNonce,this.i.Dm(),this.yb&&this.ol()):(this.D=!0,this.yb&&Z5(this)&&(2===a?this.i.Bt():3===a&&this.i.tq()))};
g.k.mQ=function(a){if(a){for(a=0;a<this.stills.length;a++)this.J.ib(this.stills[a].element,!0);this.iC(1)}else this.C=null,this.D=!1;this.ol()};
g.k.Yd=function(){return this.yb&&Z5(this)};g.w(a6,g.WM);g.k=a6.prototype;g.k.Hq=function(){var a=this.player.getVideoData(),b=!!(a&&a.suggestions&&a.suggestions.length);b=!KRa(this.player)||b;var c=a.Ye||g.WE(a.C),d=this.player.Av();a=a.mutedAutoplay;return b&&!c&&!d&&!a};
g.k.Yd=function(){return this.endScreen.Yd()};
g.k.MS=function(){return this.Yd()?this.endScreen.mL():!1};
g.k.xa=function(){this.player.Xe("endscreen");g.WM.prototype.xa.call(this)};
g.k.load=function(){var a=this.player.getVideoData();var b=a.OK;if(b&&b.videoId){var c=this.player.vb().Ed.get("heartbeat");a&&a.suggestions&&a.suggestions.length&&b.videoId===a.suggestions[0].videoId&&!a.uI?a=!1:(this.player.Pj(b.videoId,void 0,void 0,!0,!0,b),c&&c.Rz("HEARTBEAT_ACTION_TRIGGER_AT_STREAM_END","HEARTBEAT_ACTION_TRANSITION_REASON_HAS_NEW_STREAM_TRANSITION_ENDPOINT"),a=!0)}else a=!1;a||(g.WM.prototype.load.call(this),this.endScreen.show())};
g.k.unload=function(){g.WM.prototype.unload.call(this);this.endScreen.hide();this.endScreen.destroy()};
g.k.onCueRangeEnter=function(a){this.Hq()&&(this.endScreen.created||this.endScreen.create(),"load"===a.getId()&&this.load())};
g.k.onCueRangeExit=function(a){"load"===a.getId()&&this.loaded&&this.unload()};
g.k.onVideoDataChange=function(){MRa(this);this.B&&LRa(this)&&(this.endScreen&&(this.endScreen.hide(),this.endScreen.created&&this.endScreen.destroy(),this.endScreen.dispose()),this.i?this.endScreen=new U5(this.player):this.endScreen=new Y5(this.player),g.I(this,this.endScreen),g.JM(this.player,this.endScreen.element,4))};g.VM("endscreen",a6);})(_yt_player);
