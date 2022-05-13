import { ScrollToTop } from "/_shared/_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    ScrollToTop();
  };
  return module;
})();

pageModule.init();
