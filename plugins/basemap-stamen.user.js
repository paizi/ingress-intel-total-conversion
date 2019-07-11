// ==UserScript==
// @id             iitc-plugin-basemap-stamen@jonatkins
// @name           IITC plugin: Stamen地图
// @category       地图图层
// @version        0.2.1.20190616.73555
// @description    [mobile-2019-06-16-073555] 添加来自Stamen的'Toner'和'Watercolor'地图图层.
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
plugin_info.pluginId = 'basemap-stamen';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////


// see API here http://maps.stamen.com/
// https://stamen-maps.a.ssl.fastly.net/js/tile.stamen.js (overcomplicated)

function setup () {
  var baseUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/{layer}/{z}/{x}/{y}.{type}';
  var L_StamenTileLayer = L.TileLayer.extend({
    options: {
      subdomains: 'abcd',
      type: 'png',
      minZoom: 0,
      maxZoom: 21,
      attribution: [
        'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
        'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ',
        'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
      ].join('')
    },
    initialize: function (name, options) {
      options.layer = name.replace(' ','-').toLowerCase();
      L.TileLayer.prototype.initialize.call(this, baseUrl, options);
    }
  });

  function addLayer (name,options) {
    layerChooser.addBaseLayer(new L_StamenTileLayer(name,options),'Stamen ' + name);
  }

  var options = { minZoom: 0, maxNativeZoom: 20 };
  addLayer('Toner',options);
  addLayer('Toner Background',options);
  addLayer('Toner Lite',options);
  // transparent layers. could be useful over satellite imagery or similar
  // addLayer('Toner Hybrid',options);
  // addLayer('Toner Labels',options);
  // addLayer('Toner Lines',options);

  options = { minZoom: 1, maxNativeZoom: 13 }; // Should support up to 18, but too many 404 on zoom > 13
  // addLayer('Terrain',options);
  // addLayer('Terrain Labels',options);
  // addLayer('Terrain Lines',options);
  // addLayer('Terrain Background',options);

  options = {
    minZoom: 1,
    maxZoom: 21,
    maxNativeZoom: 18,
    type: 'jpg',
    attribution: [
      'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
      'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
      'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
      'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    ].join('')
  };
  addLayer('Watercolor',options);
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


