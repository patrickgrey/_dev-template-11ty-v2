//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

    //   const els = document.querySelectorAll(widget);

    // // Generate all tab instances
    // for (let i = 0; i < els.length; i++) {
    //   const nTabs = new ARIAtabs(els[i]);
    // }

    document.querySelectorAll('[data-atabs]').forEach(element => {
      const nTabs = new ARIAtabs(element);
    });

    const flipBoxAll = document.querySelectorAll(".flip-box");

    for (let index = 0; index < flipBoxAll.length; index++) {
      const flipBox = flipBoxAll[index];
      flipBox.addEventListener("click", function (event) {
        this.classList.toggle("flip-box-turn");
        // console.log(this);
      })
    }

    // Torn paper
    const root = document.documentElement;
    const segments = 200;
    let clipPath = `0% 0%, `;

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    for (let index = 0; index < segments; index++) {
      const xValue = 100 / segments * index;
      const yValue = getRandomInt(0, 100);
      const percentString = `${xValue}% ${yValue}%, `;
      clipPath += percentString;
    }

    clipPath += " 100% 0%";
    root.style.setProperty("--clip-path", clipPath);
  };
  return module;
})();

pageModule.init();
