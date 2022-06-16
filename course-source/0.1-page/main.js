import { ScrollToTop } from "ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    ScrollToTop();
    console.log("hi");
  };
  return module;
})();

pageModule.init();
