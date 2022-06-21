// import { ScrollToTop } from "ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    // //ScrollToTop();
    console.log(document.querySelector("body").clientHeight);
  };
  return module;
})();

pageModule.init();