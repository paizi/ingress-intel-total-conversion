// ==UserScript==
// @id             iitc-plugin-cache-details-on-map@jonatkins
// @name           IITC plugin: 在地图上缓存已查看的Portals
// @category       缓存
// @version        0.1.0.20190616.73555
// @description    [mobile-2019-06-16-073555] 缓存最近查看的Portal的详细信息，并尽可能使用缓存填充地图
// @updateURL      none
// @downloadURL    none
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @include        https://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'mobile';
plugin_info.dateTimeVersion = '20190616.73555';
plugin_info.pluginId = 'cache-portals-on-map';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////


// use own namespace for plugin
window.plugin.cachePortalDetailsOnMap = function() {};

window.plugin.cachePortalDetailsOnMap.MAX_AGE = 12*60*60;  //12 hours max age for cached data

window.plugin.cachePortalDetailsOnMap.portalDetailLoaded = function(data) {
  window.plugin.cachePortalDetailsOnMap.cache[data.guid] = { loadtime: Date.now(), ent: data.ent };
};

window.plugin.cachePortalDetailsOnMap.entityInject = function(data) {
  var maxAge = Date.now() - window.plugin.cachePortalDetailsOnMap.MAX_AGE*1000;

  var ents = [];
  for (var guid in window.plugin.cachePortalDetailsOnMap.cache) {
    if (window.plugin.cachePortalDetailsOnMap.cache[guid].loadtime < maxAge) {
      delete window.plugin.cachePortalDetailsOnMap.cache[guid];
    } else {
      ents.push(window.plugin.cachePortalDetailsOnMap.cache[guid].ent);
    }
  }
  data.callback(ents);
};


window.plugin.cachePortalDetailsOnMap.setup  = function() {

  window.plugin.cachePortalDetailsOnMap.cache = {};

  addHook('portalDetailLoaded', window.plugin.cachePortalDetailsOnMap.portalDetailLoaded);
  addHook('mapDataEntityInject', window.plugin.cachePortalDetailsOnMap.entityInject);
};

var setup =  window.plugin.cachePortalDetailsOnMap.setup;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


