//import { ScrollToTop } from "_components/ScrollToTop";

var pageModule = (function () {
  var module = {};
  module.init = function () {
    //ScrollToTop();

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
