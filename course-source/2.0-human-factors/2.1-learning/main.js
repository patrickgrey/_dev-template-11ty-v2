//import { ScrollToTop } from "_components/ScrollToTop";
// import { printJS } from "print-js";

// TODO:
// - Next button on mobile still shows
// - Next button should be inline block.

const pageModule = (function () {
  const module = {};

  const numberButtonCount = 40;
  const columns = 12;
  const rows = 9;
  const rowHeight = 100 / rows;
  let currentProgressNumber = 0;
  let currentTurn = 1;
  const totalTurns = 7;
  let isTimerEnd = false;
  const svgNS = "http://www.w3.org/2000/svg";

  const html = document.querySelector("html");
  const ojExerciseCurve = document.querySelector("#ojExerciseCurve");
  const svg = document.querySelector("#ojExerciseCurve svg");
  const graph = document.querySelector("#ojExerciseCurveSlideGraph svg");
  const ojCountdown = document.querySelector("#ojCountdown");
  const ojExerciseCurveButtonStart = document.querySelector(
    "#ojExerciseCurveButtonStart"
  );

  const ojExerciseCurveButtonNext = document.querySelector(
    "#ojExerciseCurveButtonNext"
  );
  const ojExerciseCurveButtonNext2 = document.querySelector(
    "#ojExerciseCurveButtonNext2"
  );

  const ojExerciseCurveButtonPrint = document.querySelector(
    "#ojExerciseCurveButtonPrint"
  );

  const ojExerciseCurveButtonPrint2 = document.querySelector(
    "#ojExerciseCurveButtonPrint2"
  );

  const ojExerciseCurveButtonRetry = document.querySelector(
    "#ojExerciseCurveButtonRetry"
  );

  const ojExerciseCurveButtonRetry2 = document.querySelector(
    "#ojExerciseCurveButtonRetry2"
  );
  const startSlide = document.querySelector("#ojExerciseCurveSlideStart");
  const graphSlide = document.querySelector("#ojExerciseCurveSlideGraph");

  let containerScores;
  let containerLines;
  let grid = [];
  // A dictionary object recording all buttons, styles and positions
  let allButtons = {};

  let countdownTimeout;

  function resizeHandler() {
    const gridContainer = svg.getElementById("gridContainer");
    const svgRect = gridContainer.getBoundingClientRect();

    console.log(svg.getBoundingClientRect());

    ojCountdown.style.left = svg.getBoundingClientRect().x + "px";
    console.log(ojCountdown.style.left);

    for (let index = 0; index < numberButtonCount; index++) {
      const button = allButtons[index + 1].button;
      const position = allButtons[index + 1].position;
      const gridCellX = position[0];
      const gridCellWidth = svgRect.width / columns;
      const gridCellHeight = svgRect.height / rows;
      const posX = gridCellX * gridCellWidth;
      button.style.left = svgRect.x + posX + "px";
      button.style.width = gridCellWidth + "px";
      button.style.height = gridCellHeight + "px";
      const baseFontPercent = button.getAttribute("data-font-percent");
      const fontSize = (gridCellWidth / 100) * baseFontPercent;
      button.style.fontSize = fontSize + "px";
    }
  }

  function numberClickHandler(event) {
    const button = event.target;
    const buttonNumber = button.dataset.number;

    if (buttonNumber != currentProgressNumber + 1) return;
    button.style.color = "hotpink";
    if (currentProgressNumber > 0) {
      const lastButton = allButtons[currentProgressNumber].button;
      lastButton.style.color = "inherit";
      const lastButtonRect = lastButton.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      // https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/

      const point1 = svg.createSVGPoint();
      const point2 = svg.createSVGPoint();

      point1.x = lastButtonRect.x + lastButtonRect.width / 2;
      point1.y = lastButtonRect.y + lastButtonRect.height / 2;

      point2.x = buttonRect.x + buttonRect.width / 2;
      point2.y = buttonRect.y + buttonRect.height / 2;

      const svgPoint1 = point1.matrixTransform(svg.getScreenCTM().inverse());
      const svgPoint2 = point2.matrixTransform(svg.getScreenCTM().inverse());

      const x1 = svgPoint1.x;
      const y1 = svgPoint1.y;
      const x2 = svgPoint2.x;
      const y2 = svgPoint2.y;

      var newLine = document.createElementNS(svgNS, "line");
      newLine.setAttribute("id", "line" + currentProgressNumber);
      newLine.setAttribute("x1", x1);
      newLine.setAttribute("y1", y1);
      newLine.setAttribute("x2", x2);
      newLine.setAttribute("y2", y2);
      newLine.setAttribute("stroke", "hotpink");
      newLine.setAttribute("class", "path");
      newLine.setAttribute("stroke-width", "2");
      svg.append(newLine);
    }

    currentProgressNumber++;
  }

  function getRadomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function getRandomIntegerRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function placeNumberButton(numberButton) {
    const randomIndex = Math.floor(Math.random() * grid.length);
    const coordinates = grid.splice(randomIndex, 1);
    const column = coordinates[0][0];
    const row = coordinates[0][1];
    numberButton.setAttribute("data-col", column);
    numberButton.setAttribute("data-row", row);

    numberButton.style.fontWeight =
      getRadomInteger(4) === 4 ? "bold" : "normal";
    if (getRadomInteger(2) === 2) {
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      const degree = getRadomInteger(15) * plusOrMinus;
      numberButton.style.transform = `rotate(${degree}deg)`;
    }
    numberButton.setAttribute(
      "data-font-percent",
      getRandomIntegerRange(40, 80)
    );
    numberButton.style.left = 0;
    numberButton.style.top = row * rowHeight + "%";
    return [column, row];
  }

  function createNumberButtons() {
    for (let index = 0; index < numberButtonCount; index++) {
      const numberButton = document.createElement("button");
      numberButton.textContent = index + 1;
      ojExerciseCurve.appendChild(numberButton);
      numberButton.addEventListener("click", numberClickHandler);
      numberButton.setAttribute("data-number", numberButton.textContent);
      const position = placeNumberButton(numberButton);
      allButtons[numberButton.innerText] = {
        button: numberButton,
        position,
      };
    }
  }

  function removeButtons() {
    const buttons = ojExerciseCurve.querySelectorAll("button");
    for (var variableKey in allButtons) {
      if (allButtons.hasOwnProperty(variableKey)) {
        delete allButtons[variableKey];
      }
    }
    console.log(allButtons);
    for (let index = 0; index < buttons.length; index++) {
      const button = buttons[index];
      ojExerciseCurve.removeChild(button);
    }
  }

  function createGrid() {
    for (let indexColumn = 0; indexColumn < columns; indexColumn++) {
      for (let index = 0; index < rows; index++) {
        grid.push([indexColumn, index]);
      }
    }
  }

  function getGraphCoordPoints() {
    return {
      bl: [
        graph.querySelector("#coordPoint1").cx.baseVal.value,
        graph.querySelector("#coordPoint1").cy.baseVal.value,
      ],
      tl: [
        graph.querySelector("#coordPoint2").cx.baseVal.value,
        graph.querySelector("#coordPoint2").cy.baseVal.value,
      ],
      tr: [
        graph.querySelector("#coordPoint3").cx.baseVal.value,
        graph.querySelector("#coordPoint3").cy.baseVal.value,
      ],
      br: [
        graph.querySelector("#coordPoint4").cx.baseVal.value,
        graph.querySelector("#coordPoint4").cy.baseVal.value,
      ],
    };
  }

  // If turn 2 or later, give circle ID, get coords from previous ID and draw from there.
  function svgDrawTurnScore(turn, progress) {
    // const fakeProgress = getRandomIntegerRange(5, 38);
    const coords = getGraphCoordPoints();
    const turnWidth = (coords.br[0] - coords.bl[0]) / 7;
    const scoreHeight = (coords.bl[1] - coords.tl[1]) / 40;
    // const scoreTotal = scoreHeight * fakeProgress;
    const scoreTotal = scoreHeight * progress;
    const startX = coords.bl[0];
    const startY = coords.bl[1];
    // ////////////////////////
    // Need to create circle and line containers so that lines don't overwrite circles.
    // /////////////////////
    if (turn > 1) {
      const lastScore = graph.querySelector("#score" + (turn - 1));
      // console.log(lastScore.getAttributeNS(null, "cx"));

      var newLine = document.createElementNS(svgNS, "line");
      newLine.setAttribute("x1", lastScore.getAttributeNS(null, "cx"));
      newLine.setAttribute("y1", lastScore.getAttributeNS(null, "cy"));
      newLine.setAttribute("x2", startX + turnWidth * turn);
      newLine.setAttribute("y2", startY - scoreTotal);
      newLine.setAttribute("stroke", "yellow");
      newLine.setAttribute("class", "path");
      newLine.setAttribute("stroke-width", "2");
      containerLines.append(newLine);
    }

    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttributeNS(null, "cx", startX + turnWidth * turn);
    circle.setAttributeNS(null, "cy", startY - scoreTotal);
    circle.setAttributeNS(null, "r", 20);
    circle.setAttributeNS(null, "id", "score" + turn);
    circle.setAttributeNS(
      null,
      "style",
      "fill: yellow; stroke: none; stroke-width: 2px;"
    );
    containerScores.appendChild(circle);

    var text = document.createElementNS(svgNS, "text");
    text.setAttributeNS(null, "x", startX + turnWidth * turn);
    text.setAttributeNS(null, "y", 2 + startY - scoreTotal);
    text.setAttributeNS(null, "font-size", "26");
    text.setAttributeNS(null, "font-weight", "bold");
    text.setAttributeNS(null, "dominant-baseline", "middle");
    text.setAttributeNS(null, "text-anchor", "middle");
    text.setAttributeNS(null, "style", "color: '#114c5f';");
    // var textNode = document.createTextNode(fakeProgress);
    var textNode = document.createTextNode(progress);
    text.appendChild(textNode);
    containerScores.appendChild(text);
  }

  function endTurn() {
    // Removing class to reset timer also triggers call to endTurn so this
    // function only works on every second call.
    isTimerEnd = !isTimerEnd;
    if (!isTimerEnd) {
      return;
    }
    // Switch slides

    resetTimer();

    if (currentTurn === 1) {
      startSlide.style.display = "none";
      graphSlide.classList.remove("hidden");
      ojExerciseCurveButtonNext.classList.remove("hidden");
      ojExerciseCurveButtonNext2.classList.remove("hidden");
    }

    svgDrawTurnScore(currentTurn, currentProgressNumber);

    currentTurn++;
    showGraph();
  }

  function showGraph() {
    const container = document.querySelector(
      ".oj-exercise-curve-instructions-container"
    );
    container.classList.remove("oj-exercise-curve-instructions-container-hide");

    setTimeout(function () {
      if (currentTurn < totalTurns + 1) {
        ojExerciseCurveButtonNext.style.visibility = "visible";
        ojExerciseCurveButtonNext2.style.display = "inline-block";
        ojExerciseCurveButtonNext2.style.visibility = "visible";
      } else {
        ojExerciseCurveButtonNext2.style.display = "none";
        ojExerciseCurveButtonRetry.style.visibility = "visible";
        ojExerciseCurveButtonRetry2.style.visibility = "visible";
        ojExerciseCurveButtonPrint.style.visibility = "visible";
        ojExerciseCurveButtonPrint2.style.visibility = "visible";
        ojExerciseCurveButtonRetry.classList.remove("hidden");
        ojExerciseCurveButtonRetry2.classList.remove("hidden");
        ojExerciseCurveButtonPrint.classList.remove("hidden");
        ojExerciseCurveButtonPrint2.classList.remove("hidden");
      }
    }, 1000);
  }

  function hideGraph() {
    const container = document.querySelector(
      ".oj-exercise-curve-instructions-container"
    );
    container.classList.add("oj-exercise-curve-instructions-container-hide");
  }

  function startTimer() {
    ojCountdown.classList.add("oj-countdown-start");
  }

  function resetTimer() {
    ojCountdown.classList.remove("oj-countdown-start");
  }

  function clearPuzzle() {
    if (currentProgressNumber > 0) {
      const lastButton = allButtons[currentProgressNumber].button;
      lastButton.style.color = null;
      for (let index = 1; index < currentProgressNumber; index++) {
        const line = svg.querySelector("#line" + index);
        svg.removeChild(line);
      }
    }
  }

  function nextClickHandler(event) {
    this.style.visibility = "hidden";
    clearPuzzle();
    currentProgressNumber = 0;
    // Get lines by id and use removeChild()
    // Need to remove lines
    // Rest pink style on all numbers
    // console.log(currentProgressNumber);
    hideGraph();
    startTimer();
  }

  function printHandler(event) {
    printJS({
      printable: "ojExerciseCurveSlideGraph",
      type: "html",
      style: "svg {filter: invert(100%);}",
      documentTitle: "My learning curve",
    });
  }

  function retryHandler() {
    clearPuzzle();
    removeButtons();
    createNumberButtons();
    resizeHandler();
    // Clear the score graph
    containerScores.innerHTML = "";
    containerLines.innerHTML = "";
    currentProgressNumber = 0;
    currentTurn = 1;
    isTimerEnd = false;
    ojExerciseCurveButtonRetry.style.visibility = "hidden";
    ojExerciseCurveButtonRetry2.style.visibility = "hidden";
    ojExerciseCurveButtonPrint.style.visibility = "hidden";
    ojExerciseCurveButtonPrint2.style.visibility = "hidden";
    ojExerciseCurveButtonRetry.classList.add("hidden");
    ojExerciseCurveButtonRetry2.classList.add("hidden");
    ojExerciseCurveButtonPrint.classList.add("hidden");
    ojExerciseCurveButtonPrint2.classList.add("hidden");
    setTimeout(function () {
      ojExerciseCurveButtonStart.style.display = "block";
    }, 1000);
    startSlide.style.display = "block";
    graphSlide.classList.add("hidden");
    // Reset or position buttons.
  }

  function initButtons() {
    ojExerciseCurveButtonPrint.addEventListener("click", printHandler);
    ojExerciseCurveButtonPrint2.addEventListener("click", printHandler);

    ojExerciseCurveButtonRetry.addEventListener("click", retryHandler);
    ojExerciseCurveButtonRetry2.addEventListener("click", retryHandler);

    const ojCountdown = document.querySelector("#ojCountdown");
    ojCountdown.addEventListener("transitionend", endTurn);

    ojExerciseCurveButtonStart.addEventListener("click", function () {
      this.style.display = "none";
      hideGraph();
      startTimer();
    });

    ojExerciseCurveButtonNext.addEventListener("click", nextClickHandler);

    ojExerciseCurveButtonNext2.addEventListener("click", nextClickHandler);

    ojExerciseCurveButtonNext.style.visibility = "hidden";
    ojExerciseCurveButtonNext2.style.visibility = "hidden";
  }

  function initGraph() {
    containerScores = document.createElementNS(svgNS, "g");
    containerLines = document.createElementNS(svgNS, "g");
    graph.appendChild(containerLines);
    graph.appendChild(containerScores);
  }

  function hideLCGraphText() {
    const textPink = document.querySelector("#oj-graph-lc-text-pink");
    const textGreen = document.querySelector("#oj-graph-lc-text-green");
    const textBlue = document.querySelector("#oj-graph-lc-text-blue");
    textPink.classList.remove("oj-graph-lc-text-pink-show");
    textGreen.classList.remove("oj-graph-lc-text-green-show");
    textBlue.classList.remove("oj-graph-lc-text-blue-show");
  }

  function initCurves() {
    const textContainer = document.querySelector(".oj-graph-lc-text");
    const closeButton = document.querySelector(".oj-graph-lc-close");
    const keyPink = document.querySelector(".oj-graph-lc svg #keyPink");
    const keyGreen = document.querySelector(".oj-graph-lc svg #keyGreen");
    const keyBlue = document.querySelector(".oj-graph-lc svg #keyBlue");
    const textPink = document.querySelector("#oj-graph-lc-text-pink");
    const textGreen = document.querySelector("#oj-graph-lc-text-green");
    const textBlue = document.querySelector("#oj-graph-lc-text-blue");

    const lcGraphAnchor = document.querySelector("#lcGraphAnchor");

    keyPink.addEventListener("click", function (event) {
      textContainer.classList.add("oj-graph-lc-text-show");
      hideLCGraphText();
      textPink.classList.add("oj-graph-lc-text-pink-show");
      lcGraphAnchor.classList.add("oj-graph-lc-show");
    });

    keyGreen.addEventListener("click", function (event) {
      textContainer.classList.add("oj-graph-lc-text-show");
      hideLCGraphText();
      textGreen.classList.add("oj-graph-lc-text-green-show");
      lcGraphAnchor.classList.add("oj-graph-lc-show");
    });

    keyBlue.addEventListener("click", function (event) {
      textContainer.classList.add("oj-graph-lc-text-show");
      hideLCGraphText();
      textBlue.classList.add("oj-graph-lc-text-blue-show");
      lcGraphAnchor.classList.add("oj-graph-lc-show");
    });

    closeButton.addEventListener("click", function (event) {
      hideLCGraphText();
      textContainer.classList.remove("oj-graph-lc-text-show");
      lcGraphAnchor.classList.remove("oj-graph-lc-show");
    })
  }

  function initBarrierTest() {
    const ojBarrierList = document.querySelector("#ojBarrierList");
    const ojBarrierButtonTest = document.querySelector("#ojBarrierButtonTest");
    const ojBarrierButtonReset = document.querySelector("#ojBarrierButtonReset");

    ojBarrierButtonTest.addEventListener("click", function (event) {
      ojBarrierList.classList.add("oj-barrier-list-test");
      initBarrierTestList();
    });


  }

  function initBarrierTestList() {
    const ojBarrierListItems = document.querySelectorAll("#ojBarrierList li");

    for (let index = 0; index < ojBarrierListItems.length; index++) {
      const item = ojBarrierListItems[index];
      item.addEventListener("click", function (event) {
        const p = this.querySelector("p");
        p.classList.toggle("oj-barrier-list-p-show");
      })
    }
  }

  module.init = function () {
    //ScrollToTop();
    createGrid();
    createNumberButtons();
    initButtons();
    initGraph();

    const resizeObserver = new ResizeObserver((entries) => {
      resizeHandler();
    });
    resizeObserver.observe(html);

    initCurves();
    initBarrierTest();

    // endTurn();
  };
  return module;
})();

pageModule.init();
