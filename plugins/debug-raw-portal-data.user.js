// ==UserScript==
// @id             iitc-plugin-raw-portal-data
// @name           IITC plugin: Debug: 原始Portal Json数据
// @category       Portal信息
// @version        0.2.4.20190616.73555
// @description    [mobile-2019-06-16-073555] 开发人员调试辅助工具：添加指向Portal详细信息的链接以显示Portal的原始数据。
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
plugin_info.pluginId = 'debug-raw-portal-data';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.rawdata = function() {};

window.plugin.rawdata.setupCallback = function() {
    addHook('portalDetailsUpdated', window.plugin.rawdata.addLink);
}

window.plugin.rawdata.addLink = function(d) {
  $('.linkdetails').append('<aside><a onclick="window.plugin.rawdata.showPortalData(\''+window.selectedPortal+'\')" title="Display raw data of the portal">Raw Data</a></aside>');
}

window.plugin.rawdata.showPortalData = function(guid) {
  if (!window.portals[guid]) {
    console.warn ('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }


  var data = window.portals[guid].options.data;
  var ts = window.portals[guid].options.timestamp;

  var title = 'Raw portal data: ' + (data.title || '<no title>') + ' ('+guid+')';

  var body =
    '<b>Portal GUID</b>: <code>'+guid+'</code><br />' +
    '<b>Entity timestamp</b>: <code>'+ts+'</code> - '+window.unixTimeToDateTimeString(ts,true)+'<br />' + 
    '<b>Portal map data:</b><pre>'+JSON.stringify(data,null,2)+'</pre>';

  var details = portalDetail.get(guid);
  if (details) {
    body += '<b>Portal details:</b><pre>'+JSON.stringify(details,null,2)+'</pre>';
  }


  body += '<p><b>Links referencing this portal</b></p>';
  var haslinks = false;
  var linkGuids = getPortalLinks(guid);
  $.each(linkGuids.in.concat(linkGuids.out), function(i,lguid) {
    var l = window.links[lguid];
    var ld = l.options.data;
    body += '<b>Link GUID</b>: <code>'+l.options.guid+'</code><br /><pre>'+JSON.stringify(ld,null,2)+'</pre>';
    haslinks = true;
  });

  if (!haslinks) body += '<p>No links to/from this portal</p>';

  body += '<p><b>Fields referencing this portal</b></p>';
  var hasfields = false;
  var fieldGuids = getPortalFields(guid);
  $.each(fieldGuids, function(i,fguid) {
    var f = window.fields[fguid];
    var fd = f.options.data;
    body += '<b>Field guid</b>: <code>'+f.options.guid+'</code><br /><pre>'+JSON.stringify(fd,null,2)+'</pre>';
    hasfields = true;
  });
  if (!hasfields) body += '<p>No fields linked to this portal</p>';

  dialog({
    title: title,
    html: body,
    id: 'dialog-rawdata',
    dialogClass: 'ui-dialog-rawdata',
  });
}

var setup = function () {
  window.plugin.rawdata.setupCallback();
  $('head').append('<style>' +
      '.ui-dialog-rawdata {' +
        'width: auto !important;' +
        'min-width: 400px !important;' +
        //'max-width: 600px !important;' +
    '}' +
      '#dialog-rawdata {' +
        'overflow-x: auto;' +
        'overflow-y: auto;' +
    '}' +
    '</style>');
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


