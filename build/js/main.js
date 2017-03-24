(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pluginJs = require('./plugin.js');

var _pluginJs2 = _interopRequireDefault(_pluginJs);

},{"./plugin.js":2}],2:[function(require,module,exports){

/*
 *
 *  Generate a jQuery plugin
 *  @param Constructor [object]
 *  @param options [object]
 *
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function plugin(Constructor, options) {
  var namespace = options.namespace;
  var defaults = options.defaults;

  $.fn[namespace] = function (options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(namespace);
      var settings = $.extend(true, {}, defaults, options, $this.data());

      if (!data) $this.data(namespace, data = new Constructor($this, settings));
    });
  };

  $.fn[namespace].Constructor = Constructor;

  $.fn[namespace].defaults = defaults;

  $.expr[':'][namespace] = function (elem) {
    return !!$.data(elem, namespace);
  };
}

exports['default'] = plugin;
module.exports = exports['default'];

},{}]},{},[1]);
