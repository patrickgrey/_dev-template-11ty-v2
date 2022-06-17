import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    ScrollToTop();
    console.log("hi ho hum aass");
  };
  return module;
})();

pageModule.init();