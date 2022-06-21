//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();
    const oj4ReasonsButton = document.querySelector("#oj4ReasonsButton");
    const container = document.querySelector(".ians-grid-4");

    oj4ReasonsButton.addEventListener("click", function (event) {
      this.style.visibility = "hidden";
      container.classList.add("oj-4-reasons-show-answer");
    })
  };
  return module;
})();

pageModule.init();
