// ==UserScript==
// @id             iitc-plugin-show-portal-weakness@vita10gy
// @name           IITC plugin: 突出显示较弱的Portal
// @category       高亮
// @version        0.7.2.20190616.73555
// @description    [mobile-2019-06-16-073555] 填充颜色来表示portal是否较弱。深红色表示需要充电，缺少谐震器，或两者兼而有之。
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
plugin_info.pluginId = 'highlight-weakness';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalWeakness = function() {};

window.plugin.portalWeakness.highlightWeakness = function(data) {

  if(data.portal.options.data.resCount !== undefined && data.portal.options.data.health !== undefined && data.portal.options.team != TEAM_NONE) {
    var res_count = data.portal.options.data.resCount;
    var portal_health = data.portal.options.data.health;

    var strength = (res_count/8) * (portal_health/100);
   
    if(strength < 1) {
      var fill_opacity = (1-strength)*.85 + .15;
      var color = 'red';
      var params = {fillColor: color, fillOpacity: fill_opacity};

      // Hole per missing resonator
      if (res_count < 8) {
        var dash = new Array((8 - res_count) + 1).join("1,4,") + "100,0"
        params.dashArray = dash;
      }

      data.portal.setStyle(params);
    } 
  }

}

var setup =  function() {
  window.addPortalHighlighter('Portal Weakness', window.plugin.portalWeakness.highlightWeakness);
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


