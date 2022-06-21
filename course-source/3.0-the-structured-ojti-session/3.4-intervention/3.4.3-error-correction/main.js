//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

    const widget = '[data-atabs]';
    const els = document.querySelectorAll(widget);

    // Generate all tab instances
    for (let i = 0; i < els.length; i++) {
      const nTabs = new ARIAtabs(els[i]);
    }
  };
  return module;
})();

pageModule.init();
