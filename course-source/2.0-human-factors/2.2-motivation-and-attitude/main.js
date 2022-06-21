//import { ScrollToTop } from "_components/ScrollToTop";
import Plyr from "plyr";

("use strict");

var pageModule = (function () {
  var module = {};

  module.init = function () {
    //ScrollToTop();

    const players = Array.from(
      document.querySelectorAll(".oj-audio")
    ).map((p) => new Plyr(p, { iconUrl: "images/plyr.svg" }));
  };
  return module;
})();

pageModule.init();
