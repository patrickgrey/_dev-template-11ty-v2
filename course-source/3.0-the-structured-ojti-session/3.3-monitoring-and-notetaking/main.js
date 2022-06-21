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

    const showAnswerButton = document.querySelector("#showAnswerButton");
    const ojAnswerReveal = document.querySelector(".oj-answer-reveal");

    showAnswerButton.addEventListener("click", function (event) {
      ojAnswerReveal.classList.add("oj-answer-reveal-show");
      this.style.display = "none";
    })


  };
  return module;
})();

pageModule.init();
