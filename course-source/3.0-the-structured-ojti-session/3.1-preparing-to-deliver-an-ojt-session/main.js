//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

    function clearHighlights() {
      let highlights = document.querySelectorAll(".oj-highlight-show");
      highlights.forEach((highlight) => {
        highlight.classList.remove("oj-highlight-show");
      });
    }

    function addHighlights(element) {
      let highlights = document.querySelectorAll(`.oj-highlight-${element}`);
      highlights.forEach((highlight) => {
        highlight.classList.add("oj-highlight-show");
      });
    }

    let buttons = document.querySelector(".oj-obj-components").querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", function (event) {
        clearHighlights();
        addHighlights(this.dataset["element"]);
      })
    });
  };
  return module;
})();

pageModule.init();
