
/*
 *
 *  Generate a jQuery plugin
 *  @param Constructor [object]
 *  @param options [object]
 *
 */

function plugin(Constructor, options) {
  let namespace = options.namespace;
  let defaults = options.defaults;

  $.fn[namespace] = function(options){
    return this.each(function(){
      let $this = $(this);
      let data = $this.data(namespace);
      let settings = $.extend(true,{},defaults,options,$this.data());

      if (!data) $this.data(namespace,(data = new Constructor($this,settings)));
    });
  };

  $.fn[namespace].Constructor = Constructor;

  $.fn[namespace].defaults = defaults;

  $.expr[':'][namespace] = function(elem){
    return !!$.data(elem,namespace);
  };
}

export default plugin;