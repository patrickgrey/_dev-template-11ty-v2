//import { ScrollToTop } from "_components/ScrollToTop";
import Plyr from "plyr";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();
    // const player = new Plyr("#ojPerson1");
    const players = Array.from(
      document.querySelectorAll(".oj-person-audio")
    ).map((p) => new Plyr(p, { iconUrl: "images/plyr.svg" }));
    // console.log(Plyr);
  };
  return module;
})();

pageModule.init();
