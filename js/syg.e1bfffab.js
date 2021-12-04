(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["syg"],{"13b0":function(t,e,r){"use strict";r("1829")},1829:function(t,e,r){},"564a":function(t,e,r){"use strict";r("c5a6")},"60ea":function(t,e,r){"use strict";r("a538")},"61ae":function(t,e,r){"use strict";r("6c3e")},"6c3e":function(t,e,r){},a538:function(t,e,r){},bbe0:function(t,e,r){},c5a6:function(t,e,r){},c9a2:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("h1",[t._v("SynoSpecies")]),r("div",{staticClass:"card form"},[t._m(0),r("div",{staticClass:"flex"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.input,expression:"input"}],attrs:{id:"combinedfield",type:"text",placeholder:"Sadayoshia acamar"},domProps:{value:t.input},on:{input:function(e){e.target.composing||(t.input=e.target.value)}}}),r("button",{staticClass:"go",on:{click:t.updateSG}},[t._v(" Go ")]),r("div",{staticClass:"dropdown",attrs:{"data-open":t.settingsOpen}},[r("button",{staticClass:"icon",attrs:{"aria-label":"Search Settings"},on:{click:function(e){t.settingsOpen=!t.settingsOpen}}},[r("svg",{attrs:{role:"presentation",viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:t.$icons.mdiCogOutline}})])]),r("div",[r("label",[r("input",{directives:[{name:"model",rawName:"v-model",value:t.ignoreRank,expression:"ignoreRank"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.ignoreRank)?t._i(t.ignoreRank,null)>-1:t.ignoreRank},on:{change:function(e){var r=t.ignoreRank,n=e.target,a=!!n.checked;if(Array.isArray(r)){var s=null,i=t._i(r,s);n.checked?i<0&&(t.ignoreRank=r.concat([s])):i>-1&&(t.ignoreRank=r.slice(0,i).concat(r.slice(i+1)))}else t.ignoreRank=a}}}),t._v("Include Subtaxa")])])])]),r("hr"),r("div",{staticClass:"flex"},[r("div",{staticStyle:{"line-height":"2.5rem","padding-left":".5rem"}},[t.loading?r("div",[t._v(" Loading "),r("spinner"),t._v(" ("+t._s(t.jsArray.length)+" result(s) so far) ")],1):t.time?r("div",[t._v(" "+t._s(t.jsArray.length)+" result(s), took "+t._s(t.time)+"s ")]):t._e()]),r("div",{staticClass:"dropdown",attrs:{"data-open":t.tunerOpen}},[r("button",{staticClass:"icon",attrs:{"aria-label":"Search Settings",disabled:!t.time&&!t.loading},on:{click:function(e){t.tunerOpen=!t.tunerOpen}}},[r("svg",{attrs:{role:"presentation",viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:t.$icons.mdiTune}})])]),r("div",[r("label",[r("input",{directives:[{name:"model",rawName:"v-model",value:t.openJ,expression:"openJ"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.openJ)?t._i(t.openJ,null)>-1:t.openJ},on:{change:function(e){var r=t.openJ,n=e.target,a=!!n.checked;if(Array.isArray(r)){var s=null,i=t._i(r,s);n.checked?i<0&&(t.openJ=r.concat([s])):i>-1&&(t.openJ=r.slice(0,i).concat(r.slice(i+1)))}else t.openJ=a}}}),t._v("Expand all Justifications")]),r("label",[r("input",{directives:[{name:"model",rawName:"v-model",value:t.openT,expression:"openT"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.openT)?t._i(t.openT,null)>-1:t.openT},on:{change:function(e){var r=t.openT,n=e.target,a=!!n.checked;if(Array.isArray(r)){var s=null,i=t._i(r,s);n.checked?i<0&&(t.openT=r.concat([s])):i>-1&&(t.openT=r.slice(0,i).concat(r.slice(i+1)))}else t.openT=a}}}),t._v("Expand all Treatments")])])])])]),t.jsArray.length>0?r("timeline",{attrs:{result:t.jsArray}}):t._e(),t._l(t.result,(function(e){return r("div",{key:e[0]},[r("div",{staticClass:"flex"},[r("div",[r("span",{staticClass:"muted"},[t._v(t._s(t.kingdom(e[0])))]),t._v(" "+t._s(t.shorten(e[0]))+" ")]),r("wikidata-buttons",{attrs:{taxonName:t.shorten(e[0])}})],1),t._l(e[1],(function(e){return r("div",{key:e.taxonConceptUri,class:e.treatments.dpr.length?"card deprecated":"card"},[r("div",{staticClass:"tree"},[r("table",[t._m(1,!0),r("tr",[t.trees.has(e.taxonConceptUri)?t._e():r("td",{staticClass:"loading",attrs:{colspan:"4"}},[t._v("Loading")]),t._l(t.trees.get(e.taxonConceptUri),(function(e){return r("td",{key:e},[t._v(t._s(e))])}))],2)])]),r("h2",[r("a",{attrs:{href:e.taxonConceptUri}},[t._v(t._s(t.shorten(e.taxonConceptUri)))])]),r("details",{attrs:{open:t.openJ}},[r("summary",[t._v(" "+t._s(1===e.justifications.length?"Justification":"Justifications ("+e.justifications.length+")")+" ")]),r("justification-view",{attrs:{js:e}})],1),r("treatments-view",{attrs:{js:e,open:t.openT}})],1)}))],2)})),r("hr"),r("image-splash",{attrs:{taxamanager:t.taxamanager,taxa:t.jsArray.map((function(t){return{url:t.taxonConceptUri}}))}})],2)},a=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"flex"},[r("label",[t._v("Enter Taxon Name")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("tr",[r("th",[t._v("Phylum")]),r("th",[t._v("Class")]),r("th",[t._v("Order")]),r("th",[t._v("Family")])])}];r("b64b"),r("a4d3"),r("4de4"),r("e439"),r("159b"),r("dbb4");function s(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?i(Object(r),!0).forEach((function(e){s(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var c=r("1da1"),l=r("d4ec"),u=r("bee2"),p=r("262e"),d=r("2caf");r("e01a"),r("d3b7"),r("b636"),r("d28b"),r("3ca3"),r("ddb0");function f(t){var e;if("undefined"!==typeof Symbol&&(Symbol.asyncIterator&&(e=t[Symbol.asyncIterator]),null==e&&Symbol.iterator&&(e=t[Symbol.iterator])),null==e&&(e=t["@@asyncIterator"]),null==e&&(e=t["@@iterator"]),null==e)throw new TypeError("Object is not async iterable");return e.call(t)}r("96cf"),r("4ec9"),r("d81d"),r("ac1f"),r("466d"),r("5319"),r("820e"),r("fb6a"),r("b680");var h=r("9ab4"),v=r("1b40"),g=r("2ca9"),m=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("ul",t._l(t.justifications,(function(e){return r("li",{key:e.toString()},t._l(e,(function(e){return r("span",{key:e.toString(),staticClass:"just",domProps:{innerHTML:t._s(e)}})})),0)})),0)])},b=[],k=(r("99af"),r("25f0"),function(t){Object(p["a"])(r,t);var e=Object(d["a"])(r);function r(){var t;return Object(l["a"])(this,r),t=e.apply(this,arguments),t.justifications=[],t}return Object(u["a"])(r,[{key:"predecessor",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.t0=this,t.next=3,e.justifications.first();case 3:return t.t1=t.sent,t.abrupt("return",t.t0.prosaify.call(t.t0,t.t1));case 5:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()},{key:"prosaify",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.t0=[this.linkify(e.toString())],!e.precedingSynonym){t.next=7;break}return t.next=4,this.predecessor(e.precedingSynonym);case 4:t.t1=t.sent,t.next=8;break;case 7:t.t1=[];case 8:return t.t2=t.t1,t.abrupt("return",t.t0.concat.call(t.t0,t.t2));case 10:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()},{key:"prosaifyInitial",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.t0=[this.linkify(e.toString())],!e.precedingSynonym){t.next=7;break}return t.next=4,this.predecessor(e.precedingSynonym);case 4:t.t1=t.sent,t.next=8;break;case 7:t.t1=[];case 8:return t.t2=t.t1,t.abrupt("return",t.t0.concat.call(t.t0,t.t2));case 10:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()},{key:"linkify",value:function(t){var e=function(t){return t.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/([^/]*\/)?/g,"").replace(/\/|_/g," ")};return t.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g,(function(t,r){return'<a href="'.concat(r,'">').concat(e(r),"</a>")}))}},{key:"updateJustifications",value:function(){var t=this;Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(t.js.justifications.map((function(e){return t.prosaifyInitial(e)})));case 2:return e.abrupt("return",t.justifications=e.sent);case 3:case"end":return e.stop()}}),e)})))()}}]),r}(v["d"]));Object(h["a"])([Object(v["b"])()],k.prototype,"js",void 0),Object(h["a"])([Object(v["e"])("js.justifications")],k.prototype,"updateJustifications",null),k=Object(h["a"])([v["a"]],k);var w=k,x=w,y=(r("13b0"),r("ef0b"),r("2877")),_=Object(y["a"])(x,m,b,!1,null,"48e15a86",null),j=_.exports,O=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("details",[r("summary",[t._v(" Treatments ("),t.js.loading?r("spinner"):t._e(),t._l(t.js.treatments.def.length,(function(t){return r("svg",{key:t+"def",staticClass:"green",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}})])})),t._l(t.js.treatments.aug.length,(function(t){return r("svg",{key:t+"aug",staticClass:"blue",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}})])})),t._l(t.js.treatments.dpr.length,(function(t){return r("svg",{key:t+"dpr",staticClass:"red",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"}})])})),t._v(") ")],2),!t.js.treatments.def.length&&!t.js.loading||t.js.treatments.def.length||t.js.treatments.aug.length?r("div",[t._v(" Augmenting Treatments: "),r("ul",{staticClass:"nobullet"},[t._l(t.js.treatments.def,(function(e){return r("li",{key:e.url},[r("svg",{staticClass:"green",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}})]),r("a",{attrs:{href:e.url}},[t._v(" "+t._s(e.creators)+" ("+t._s(e.date)+") "),r("code",[t._v(t._s(e.url.substring(e.url.indexOf("/id/")+4)))])])])})),t.js.treatments.def.length||t.js.loading?t._e():r("li",[r("svg",{staticClass:"green",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"}})]),t._v(" Defining treatment not yet on Plazi ")]),t._l(t.js.treatments.aug,(function(e){return r("li",{key:e.url},[r("svg",{staticClass:"blue",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}})]),r("a",{attrs:{href:e.url}},[t._v(" "+t._s(e.creators)+" ("+t._s(e.date)+") "),r("code",[t._v(t._s(e.url.substring(e.url.indexOf("/id/")+4)))])])])}))],2)]):t._e(),t.js.treatments.dpr.length?r("div",[t._v(" Deprecating Treatments: "),r("ul",{staticClass:"nobullet"},t._l(t.js.treatments.dpr,(function(e){return r("li",{key:e.url},[r("svg",{staticClass:"red",attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentcolor",d:"M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"}})]),r("a",{attrs:{href:e.url}},[t._v(" "+t._s(e.creators)+" ("+t._s(e.date)+") "),r("code",[t._v(t._s(e.url.substring(e.url.indexOf("/id/")+4)))])])])})),0)]):t._e()])},C=[],A=r("2375"),S=function(t){Object(p["a"])(r,t);var e=Object(d["a"])(r);function r(){return Object(l["a"])(this,r),e.apply(this,arguments)}return r}(v["d"]);Object(h["a"])([Object(v["b"])()],S.prototype,"js",void 0),S=Object(h["a"])([Object(v["a"])({components:{Spinner:A["a"]}})],S);var R=S,L=R,V=(r("61ae"),Object(y["a"])(L,O,C,!1,null,"4cc06590",null)),E=V.exports,T=r("da9e"),H=r("d9df"),B=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"flex"},[t.links.wikidata||t.links.gbif||t.links.enwikipedia||t.links.wikipedia.length||t.links.wikispecies?r("a",{staticClass:"button",attrs:{href:t.links.wikidata,"aria-label":"associated wikidata page",disabled:!t.links.wikidata,target:"_blank",title:"Wikidata"}},[r("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",version:"1.2",viewBox:"0 0 1050 590"}},[r("path",{staticStyle:{fill:"#990000"},attrs:{d:"m 120,545 h 30 V 45 H 120 V 545 z m 60,0 h 90 V 45 H 180 V 545 z M 300,45 V 545 h 90 V 45 h -90 z",id:"path2"}}),r("path",{staticStyle:{fill:"#339966"},attrs:{d:"m 840,545 h 30 V 45 H 840 V 545 z M 900,45 V 545 h 30 V 45 H 900 z M 420,545 h 30 V 45 H 420 V 545 z M 480,45 V 545 h 30 V 45 h -30 z",id:"path4"}}),r("path",{staticStyle:{fill:"#006699"},attrs:{d:"m 540,545 h 90 V 45 h -90 V 545 z m 120,0 h 30 V 45 H 660 V 545 z M 720,45 V 545 h 90 V 45 H 720 z",id:"path6"}})])]):t._e(),t.links.gbif?r("a",{attrs:{href:"https://www.gbif.org/species/"+t.links.gbif,target:"_blank"}},[t._v("GBIF ID: "+t._s(t.links.gbif))]):t._e(),r("div",{staticClass:"button_group"},[t.links.wikipedia.length||t.links.enwikipedia?r("a",{staticClass:"button",attrs:{href:t.links.enwikipedia,"aria-label":"associated english wikipedia page",disabled:!t.links.enwikipedia,target:"_blank",title:t.links.enwikipedia?"English Wikipedia":"No English Wikipedia page"}},[r("svg",{attrs:{version:"1.0",viewBox:"0 0 128 128",xmlns:"http://www.w3.org/2000/svg"}},[r("path",{attrs:{d:"m95.869 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-32.685 66.712h-2.1747l-32.813-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97961-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-3.3601-1.1079-5.7895-1.3007v-2.139h31.928v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.6e-5 1.9271 0.90121 4.9331 2.7037 9.0183l24.232 45.959 23.693-45.38c1.8416-4.4705 3.3695-7.573 3.3695-9.3073-6.3e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-2.4222-1.7438-5.1259-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h23.934z"}}),r("path",{attrs:{d:"m123.98 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-28.685 66.712h-2.1747l-30.313-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97962-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-2.7259-1.1079-5.1553-1.3007v-2.139h31.294v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.5e-5 1.9271 0.90121 4.9331 2.7037 9.0183l21.732 45.959 19.693-45.38c1.8416-4.4705 3.3695-7.573 3.3696-9.3073-6e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-3.0564-1.7438-5.7601-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h24.568z"}})])]):t._e(),t.links.wikipedia.length?r("div",{staticClass:"dropdown button",attrs:{"data-open":t.dropdown}},[r("button",{attrs:{"aria-label":"Other language Wikipedia pages",title:"Other languages"},on:{click:function(e){t.dropdown=!t.dropdown}}},[r("svg",{attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"currentColor",d:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}})])]),r("div",{staticClass:"dropdown_menu"},[r("ul",[t.links.enwikipedia?r("li",[r("a",{attrs:{href:t.links.enwikipedia}},[t._v(t._s(t.links.enwikipedia))])]):t._e(),t._l(t.links.wikipedia,(function(e){return r("li",{key:e},[r("a",{attrs:{href:e}},[t._v(t._s(t.readableLinks(e)))])])}))],2)])]):t._e()]),t.links.wikispecies?r("a",{staticClass:"button",attrs:{href:t.links.wikispecies,"aria-label":"associated wikispecies page",target:"_blank",title:"Wikispecies"}},[r("svg",{attrs:{viewBox:"0 0 941 1103",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",height:"24px"}},[r("defs",[r("radialGradient",{attrs:{id:"d",cx:"510",cy:"110",r:"210",gradientUnits:"userSpaceOnUse"}},[r("stop",{attrs:{"stop-color":"#D8ABA5",offset:".04"}}),r("stop",{attrs:{"stop-color":"#AD604E",offset:".4"}}),r("stop",{attrs:{"stop-color":"#9C4029",offset:".6"}}),r("stop",{attrs:{"stop-color":"#92331F",offset:".7"}}),r("stop",{attrs:{"stop-color":"#43180F",offset:"1"}})],1),r("radialGradient",{attrs:{id:"i",cx:"470.5",cy:"650",r:"430",gradientUnits:"userSpaceOnUse"}},[r("stop",{attrs:{"stop-color":"#4F8FB3",offset:".8"}}),r("stop",{attrs:{"stop-color":"#0C5178",offset:".95"}}),r("stop",{attrs:{"stop-color":"#002D4A",offset:"1"}})],1),r("clipPath",{attrs:{id:"h"}},[r("path",{attrs:{d:"m0 199 470.5 428 470.5-428v904h-941z"}})]),r("linearGradient",{attrs:{id:"b"}},[r("stop",{attrs:{"stop-color":"#00090E",offset:"0"}}),r("stop",{attrs:{"stop-color":"#082E45",offset:".1"}}),r("stop",{attrs:{"stop-color":"#0A6997",offset:".5"}}),r("stop",{attrs:{"stop-color":"#082E45",offset:".9"}}),r("stop",{attrs:{"stop-color":"#00090E",offset:"1"}})],1),r("linearGradient",{attrs:{id:"j"}},[r("stop",{attrs:{"stop-color":"#375D72",offset:"0"}}),r("stop",{attrs:{"stop-color":"#407B9B",offset:".1"}}),r("stop",{attrs:{"stop-color":"#A0C0CF",offset:".5"}}),r("stop",{attrs:{"stop-color":"#407B9B",offset:".9"}}),r("stop",{attrs:{"stop-color":"#375D72",offset:"1"}})],1),r("linearGradient",{attrs:{id:"g"}},[r("stop",{attrs:{"stop-color":"#0F3119",offset:"0"}}),r("stop",{attrs:{"stop-color":"#01703B",offset:".1"}}),r("stop",{attrs:{"stop-color":"#89C4AE",offset:".5"}}),r("stop",{attrs:{"stop-color":"#01703B",offset:".9"}}),r("stop",{attrs:{"stop-color":"#0F3119",offset:"1"}})],1),r("linearGradient",{attrs:{id:"a"}},[r("stop",{attrs:{"stop-color":"#476C5A",offset:"0"}}),r("stop",{attrs:{"stop-color":"#52A27D",offset:".1"}}),r("stop",{attrs:{"stop-color":"#A7D2BE",offset:".5"}}),r("stop",{attrs:{"stop-color":"#52A27D",offset:".9"}}),r("stop",{attrs:{"stop-color":"#476C5A",offset:"1"}})],1)],1),r("g",{attrs:{"stroke-width":"0"}},[r("g",{attrs:{fill:"url(#b)"}},[r("path",{attrs:{id:"c",d:"m213 218c39 137 436 101 436 202v90c0-111-404.5-64.7-436-200"}})]),r("g",{attrs:{fill:"url(#b)"}},[r("path",{attrs:{id:"e",d:"m649 800c0-94.5-411-72.4-411-192v90c0 112.5 411 89.5 411 192"}})]),r("use",{attrs:{transform:"translate(941) scale(-1 1)",fill:"url(#g)","xlink:href":"#f"}}),r("use",{attrs:{transform:"translate(941) scale(-1 1)",fill:"url(#a)","xlink:href":"#e"}}),r("use",{attrs:{transform:"translate(941) scale(-1 1)",fill:"url(#a)","xlink:href":"#c"}}),r("g",{attrs:{fill:"url(#j)"}},[r("path",{attrs:{id:"f",d:"m649 420c0 99.7-411 81-411 188v90c0-103.7 411-91.8 411-188"}})])]),r("circle",{attrs:{cx:"470.5",cy:"628",r:"388.5","clip-path":"url(#h)",fill:"none",stroke:"url(#i)","stroke-width":"100px"}}),r("circle",{attrs:{cx:"470.5",cy:"161",r:"125",fill:"url(#d)",stroke:"#555"}})])]):t._e(),t.links.commons?r("a",{staticClass:"button",attrs:{href:t.links.commons,"aria-label":"associated wikimedia commons page",target:"_blank",title:"Wikimedia Commons"}},[r("svg",{attrs:{height:"24",version:"1.1",viewBox:"-305 -516 610 820",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[r("defs",[r("clipPath",{attrs:{id:"wc_b"}},[r("circle",{attrs:{r:"298"}})])]),r("circle",{attrs:{r:"100",fill:"#900"}}),r("g",{attrs:{fill:"#069"}},[r("g",{attrs:{id:"wc_a","clip-path":"url(#wc_b)"}},[r("path",{attrs:{d:"m-11 180v118h22v-118"}}),r("path",{attrs:{d:"m-43 185 43-75 43 75"}})]),r("g",{attrs:{id:"wc_c"}},[r("use",{attrs:{transform:"rotate(45)","xlink:href":"#wc_a"}}),r("use",{attrs:{transform:"rotate(90)","xlink:href":"#wc_a"}}),r("use",{attrs:{transform:"rotate(135)","xlink:href":"#wc_a"}})]),r("use",{attrs:{transform:"scale(-1 1)","xlink:href":"#wc_c"}}),r("path",{attrs:{transform:"rotate(-45)",d:"m0-256a256 256 0 1 0 256 256c0-100-101-150-6-275",fill:"none",stroke:"#069","stroke-width":"84"}}),r("path",{attrs:{d:"m-23-515s-36 135-80 185 116-62 170-5-90-180-90-180z"}})])])]):t._e()])},P=[],M=(r("1276"),r("7db0"),r("4e82"),function(t){Object(p["a"])(r,t);var e=Object(d["a"])(r);function r(){var t;return Object(l["a"])(this,r),t=e.apply(this,arguments),t.links={wikidata:void 0,gbif:void 0,enwikipedia:void 0,wikipedia:[],wikispecies:void 0,commons:void 0},t.dropdown=!1,t}return Object(u["a"])(r,[{key:"getData",value:function(){var t=this;if(this.taxonName){var e="https://query.wikidata.org/sparql",r='\nSELECT DISTINCT ?item ?gbif (group_concat(?page;separator="|") as ?pages)\nWHERE {\n  ?item wdt:P225 "'.concat(this.taxonName,'" .\n  OPTIONAL { ?item wdt:P846 ?gbif . }\n  OPTIONAL { ?page schema:about ?item . }\n}\nGROUP BY ?item ?gbif\n');fetch(e+"?query="+encodeURIComponent(r),{headers:{accept:"application/sparql-results+json"}}).then((function(t){return t.json()})).then((function(e){var r=e.results.bindings[0];if(r){var n,a,s;t.links.wikidata=null===(n=r.item)||void 0===n?void 0:n.value,t.links.gbif=null===(a=r.gbif)||void 0===a?void 0:a.value;var i=((null===(s=r.pages)||void 0===s?void 0:s.value)||"").split("|");i.length&&(console.log(i),t.links.enwikipedia=i.find((function(t){return t.match(/^https?:\/\/en\.wikipedia\.org\//)})),t.links.wikispecies=i.find((function(t){return t.match(/^https?:\/\/species\.wikimedia\.org\//)})),t.links.commons=i.find((function(t){return t.match(/^https?:\/\/commons\.wikimedia\.org\//)})),t.links.wikipedia=i.filter((function(e){return e!==t.links.enwikipedia&&e!==t.links.wikispecies&&e!==t.links.commons&&""!==e})).sort())}}))}}},{key:"readableLinks",value:function(t){return decodeURI(t.replace(/^https?:\/\//,""))}},{key:"mounted",value:function(){this.getData()}}]),r}(v["d"]));Object(h["a"])([Object(v["b"])()],M.prototype,"taxonName",void 0),Object(h["a"])([Object(v["e"])("taxonName")],M.prototype,"getData",null),M=Object(h["a"])([Object(v["a"])({})],M);var z=M,D=z,I=(r("564a"),Object(y["a"])(D,B,P,!1,null,"71d2717a",null)),J=I.exports,N=r("96b7"),U=r("55ab"),G=function(t){Object(p["a"])(r,t);var e=Object(d["a"])(r);function r(){var t;return Object(l["a"])(this,r),t=e.apply(this,arguments),t.endpoint=new window.SparqlEndpoint(Object(g["b"])()),t.input="",t.ignoreRank=!1,t.jsArray=[],t.result=new Map,t.loading=!1,t.settingsOpen=!1,t.tunerOpen=!1,t.openJ=!1,t.openT=!1,t.time="",t.syg=new window.SynonymGroup(t.endpoint,t.input,t.ignoreRank),t.trees=new Map,t.taxamanager=new U["a"](t.endpoint),t}return Object(u["a"])(r,[{key:"getTree",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(e){var r,n=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!this.trees.has(e)){t.next=4;break}return t.abrupt("return",this.trees.get(e));case 4:return r="PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\nSELECT DISTINCT * WHERE {\n  <".concat(e,"> dwc:phylum ?phylum; dwc:class ?class; dwc:family ?family; dwc:order ?order.\n}"),t.abrupt("return",this.endpoint.getSparqlResultSet(r).then((function(t){return t.results.bindings[0]})).then((function(t){var r=["phylum","class","order","family"].map((function(e){return t[e]?t[e].value:""}));return n.trees.set(e,r),r})));case 6:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()},{key:"kingdom",value:function(t){return(t.match(/http:\/\/taxon-name\.plazi\.org\/id\/([^/]*)\//)||[])[1]}},{key:"shorten",value:function(t,e){var r=e?t.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g,(function(t,e){return"[".concat(e,"]")})):t,n=~r.indexOf("]")?r.indexOf("]")+2:0;return r=r.substring(n),r.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^/]*\//g,"").replace(/\/|_/g," ")}},{key:"updateSG",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(){var e,r,n,a,s,i,l,u,p=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:this.input||(this.input="Sadayoshia acamar"),this.jsArray=[],this.result=new Map,this.loading=!0,this.syg&&this.syg.abort(),this.syg=new window.SynonymGroup(this.endpoint,this.input,this.ignoreRank),e=performance.now(),r=[],n=!1,a=!1,t.prev=10,i=function(){var t=u.value,e=t.taxonConceptUri,n=t.taxonNameUri,a=t.justifications,s=t.treatments,i=[],l={def:[],aug:[],dpr:[]},d=o(o({},t),{},{justifications:i,treatments:l});p.jsArray.push(d);var h=p.result.get(n);h?h.push(d):p.result.set(n,[d]),p.getTree(d.taxonConceptUri);var v=[];v.push(Object(c["a"])(regeneratorRuntime.mark((function t(){var e,r,n,s,o,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e=!1,r=!1,t.prev=2,s=f(a);case 4:return t.next=6,s.next();case 6:if(!(e=!(o=t.sent).done)){t.next=12;break}c=o.value,i.push(c);case 9:e=!1,t.next=4;break;case 12:t.next=18;break;case 14:t.prev=14,t.t0=t["catch"](2),r=!0,n=t.t0;case 18:if(t.prev=18,t.prev=19,!e||null==s.return){t.next=23;break}return t.next=23,s.return();case 23:if(t.prev=23,!r){t.next=26;break}throw n;case 26:return t.finish(23);case 27:return t.finish(18);case 28:case"end":return t.stop()}}),t,null,[[2,14,18,28],[19,,23,27]])})))()),v.push(Object(c["a"])(regeneratorRuntime.mark((function t(){var e,r,n,a,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e=!1,r=!1,t.prev=2,a=f(s.def);case 4:return t.next=6,a.next();case 6:if(!(e=!(i=t.sent).done)){t.next=12;break}o=i.value,l.def.push(o);case 9:e=!1,t.next=4;break;case 12:t.next=18;break;case 14:t.prev=14,t.t0=t["catch"](2),r=!0,n=t.t0;case 18:if(t.prev=18,t.prev=19,!e||null==a.return){t.next=23;break}return t.next=23,a.return();case 23:if(t.prev=23,!r){t.next=26;break}throw n;case 26:return t.finish(23);case 27:return t.finish(18);case 28:case"end":return t.stop()}}),t,null,[[2,14,18,28],[19,,23,27]])})))()),v.push(Object(c["a"])(regeneratorRuntime.mark((function t(){var e,r,n,a,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e=!1,r=!1,t.prev=2,a=f(s.aug);case 4:return t.next=6,a.next();case 6:if(!(e=!(i=t.sent).done)){t.next=12;break}o=i.value,l.aug.push(o);case 9:e=!1,t.next=4;break;case 12:t.next=18;break;case 14:t.prev=14,t.t0=t["catch"](2),r=!0,n=t.t0;case 18:if(t.prev=18,t.prev=19,!e||null==a.return){t.next=23;break}return t.next=23,a.return();case 23:if(t.prev=23,!r){t.next=26;break}throw n;case 26:return t.finish(23);case 27:return t.finish(18);case 28:case"end":return t.stop()}}),t,null,[[2,14,18,28],[19,,23,27]])})))()),v.push(Object(c["a"])(regeneratorRuntime.mark((function t(){var e,r,n,a,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e=!1,r=!1,t.prev=2,a=f(s.dpr);case 4:return t.next=6,a.next();case 6:if(!(e=!(i=t.sent).done)){t.next=12;break}o=i.value,l.dpr.push(o);case 9:e=!1,t.next=4;break;case 12:t.next=18;break;case 14:t.prev=14,t.t0=t["catch"](2),r=!0,n=t.t0;case 18:if(t.prev=18,t.prev=19,!e||null==a.return){t.next=23;break}return t.next=23,a.return();case 23:if(t.prev=23,!r){t.next=26;break}throw n;case 26:return t.finish(23);case 27:return t.finish(18);case 28:case"end":return t.stop()}}),t,null,[[2,14,18,28],[19,,23,27]])})))()),r.push(Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Promise.allSettled(v);case 2:return console.log("%c".concat(e.slice(e.lastIndexOf("/"))," done"),"color: gold;"),d.loading=!1,t.abrupt("return",e);case 5:case"end":return t.stop()}}),t)})))())},l=f(this.syg);case 13:return t.next=15,l.next();case 15:if(!(n=!(u=t.sent).done)){t.next=20;break}i();case 17:n=!1,t.next=13;break;case 20:t.next=26;break;case 22:t.prev=22,t.t0=t["catch"](10),a=!0,s=t.t0;case 26:if(t.prev=26,t.prev=27,!n||null==l.return){t.next=31;break}return t.next=31,l.return();case 31:if(t.prev=31,!a){t.next=34;break}throw s;case 34:return t.finish(31);case 35:return t.finish(26);case 36:return console.log("awaiting now"),t.next=39,Promise.allSettled(r);case 39:console.log("%call settled","color: green; font-weight: bold;"),this.loading=!1,this.time=((performance.now()-e)/1e3).toFixed(2);case 42:case"end":return t.stop()}}),t,this,[[10,22,26,36],[27,,31,35]])})));function e(){return t.apply(this,arguments)}return e}()},{key:"mounted",value:function(){var t,e=this,r=document.getElementById("combinedfield");(this.taxomplete=new N["a"](r,this.endpoint),this.taxomplete.action=function(t){e.input=t,e.updateSG()},this.s)&&(this.input=null!==(t=this.s)&&void 0!==t?t:"",this.updateSG())}}]),r}(v["d"]);Object(h["a"])([Object(v["b"])()],G.prototype,"s",void 0),Object(h["a"])([Object(v["e"])("s")],G.prototype,"mounted",null),G=Object(h["a"])([Object(v["a"])({components:{JustificationView:j,TreatmentsView:E,Timeline:T["a"],ImageSplash:H["a"],Spinner:A["a"],WikidataButtons:J}})],G);var F=G,W=F,Z=(r("d599"),r("60ea"),Object(y["a"])(W,n,a,!1,null,"13f7edf0",null));e["default"]=Z.exports},cb81:function(t,e,r){},d599:function(t,e,r){"use strict";r("bbe0")},ef0b:function(t,e,r){"use strict";r("cb81")}}]);
//# sourceMappingURL=syg.e1bfffab.js.map