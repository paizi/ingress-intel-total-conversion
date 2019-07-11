// ==UserScript==
// @id             iitc-plugin-highlight-forgotten@jonatkins
// @name           IITC plugin: 突出显示非活动Portal
// @category       高亮
// @version        0.1.0.20190616.73555
// @description    [mobile-2019-06-16-073555] 将portal填充颜色表示portal是否无人占领且近期没有活动。 红色阴影表示一周到一个月，紫色表示更长时间。
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
plugin_info.pluginId = 'highlight-forgotten';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalHighlighterInactive = function() {};

window.plugin.portalHighlighterInactive.highlight = function(data) {

  if (data.portal.options.timestamp > 0) {

    var daysUnmodified = (new Date().getTime() - data.portal.options.timestamp) / (24*60*60*1000);

    if (daysUnmodified >= 7) {

      var fill_opacity = Math.min(1,((daysUnmodified-7)/24)*.85 + .15);

      var blue = Math.max(0,Math.min(255,Math.round((daysUnmodified-31)/62*255)));

      var colour = 'rgb(255,0,'+blue+')';

      var params = {fillColor: colour, fillOpacity: fill_opacity};

      data.portal.setStyle(params);
    }
  }

}

var setup =  function() {
  window.addPortalHighlighter('Inactive Portals', window.plugin.portalHighlighterInactive.highlight);
}

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


