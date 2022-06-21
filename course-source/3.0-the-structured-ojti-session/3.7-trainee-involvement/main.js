//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

    const flipBoxAll = document.querySelectorAll(".flip-box");

    for (let index = 0; index < flipBoxAll.length; index++) {
      const flipBox = flipBoxAll[index];
      flipBox.addEventListener("click", function (event) {
        this.classList.toggle("flip-box-turn");
        // console.log(this);
      })
    }
  };
  return module;
})();

pageModule.init();
