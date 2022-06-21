//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

    const close = document.querySelector(".oj-close");
    const definitions = document.querySelector(".oj-definitions");
    const phases = document.querySelector(".oj-phases-pyramid");
    const allLinks = document.querySelectorAll(".oj-phase a:not(.oj-phase-4-title)");
    const allButtons = document.querySelectorAll(".oj-phase-sections button");



    function updateContent(id) {
      const currentDefinition = document.querySelector("#" + id);
      definitions.innerHTML = currentDefinition.innerHTML;
    }

    function showBG() {
      phases.classList.add("oj-phases-pyramid-bg-show");
      setTimeout(function () {
        close.classList.add("oj-show");
      }, 600);
    }

    function showDefs() {
      setTimeout(function () {
        definitions.classList.add("oj-show");
      }, 300);
    }

    close.addEventListener("click", function (event) {
      phases.classList.remove("oj-phases-pyramid-bg-show");
      definitions.classList.remove("oj-show");
      close.classList.remove("oj-show");
    })

    for (let index = 0; index < allButtons.length; index++) {
      const button = allButtons[index];
      button.addEventListener("click", function (event) {
        showBG();
        showDefs();
        updateContent(this.getAttribute("data-content"));
      })
    }

    for (let index = 0; index < allLinks.length; index++) {
      const link = allLinks[index];
      link.addEventListener("click", function (event) {
        showBG();
        showDefs();
        updateContent(this.getAttribute("data-content"));
      })
    }

  };
  return module;
})();

pageModule.init();
