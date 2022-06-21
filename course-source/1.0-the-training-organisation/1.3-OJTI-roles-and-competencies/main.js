//import { ScrollToTop } from "_components/ScrollToTop";
// import * as Masonry from "masonry-layout";
// const Masonry = require("masonry-layout");
// import Masonry from "masonry-layout";

var pageModule = (function () {
  var module = {};

  const widget = '[data-atabs]';
  const els = document.querySelectorAll(widget);

  // Generate all tab instances
  for (let i = 0; i < els.length; i++) {
    const nTabs = new ARIAtabs(els[i]);
  }

  const allBlocks = document.querySelectorAll(".oj-comp-container > div");
  const ojCompContainer = document.querySelector(".oj-comp-container");
  const closeButton = document.querySelector("#ojCompsCloseButton");

  function resetAllBlocks() {
    for (let index = 0; index < allBlocks.length; index++) {
      const block = allBlocks[index];
      block.classList.remove("oj-open");
    }
    ojCompContainer.classList.remove("oj-open");
  }

  function clickBlockHandler(event) {
    this.classList.add("oj-open");
    ojCompContainer.classList.add("oj-open");
  }

  const tableHeadTemplate = `<table>
	<thead>
		<tr>
			<th><strong>Competency</strong> &amp; Description</th>
		</tr>
	</thead>`;

  // <th>Description</th>
  // <th>Observable behaviours (OB)</th>

  // In order to avoid writing the same text three times, this function copies the text from the source text below the interaction, creates a table from the (mobile view) list and copies it all into the interaction.

  // Additional note - originally we switched between table and list in mobile view as there were three table columns which would squash too much in mobile view. Then the table design changed to one column meaning there is no longer a need for lists. So, using the list now seems like madness but it was only slighly stupid.

  function cloneText() {
    const sections = [
      "SitAware",
      "Safe",
      "Mentor",
      "Teach",
      "Comm",
      "Assess",
      "Collab",
      "Self",
      "Ethics",
    ];
    for (let index = 0; index < sections.length; index++) {
      const sectionID = sections[index];
      const sectionSource = document.querySelector(`#source${sectionID}`);
      const sectionClone = document.querySelector(`#clone${sectionID}`);

      const h3Source = sectionSource.querySelector(`h3`);
      const h3Clone = sectionClone.querySelector(`h3`);
      const competencySource = sectionSource.querySelector(
        `.oj-objectives-competency`
      );

      h3Clone.innerHTML = competencySource.innerHTML = h3Source.innerHTML;

      const descriptionSource = sectionSource.querySelector(`.oj-description`);
      const descriptionClone = sectionClone.querySelector(`.oj-description`);
      descriptionClone.innerHTML = descriptionSource.innerHTML;

      const objectivesSource = sectionSource.querySelector(`.oj-objectives`);
      const objectivesClone = sectionClone.querySelector(`.oj-objectives`);
      objectivesClone.innerHTML = objectivesSource.innerHTML;

      const definition = sectionSource.querySelector(
        `.oj-objective-definition`
      );

      const obs = sectionSource.querySelectorAll(`ul li`);

      let firstRowString = "";
      let remainingRowsString = "";
      const obsCount = obs.length;

      for (let indexObs = 0; indexObs < obs.length; indexObs++) {
        const ob = obs[indexObs];
        remainingRowsString += `<tr><td>${ob.innerHTML}</td></tr>`;
      }

      const tableSource = sectionSource.querySelector(".oj-objectives-table");
      const tableClone = sectionClone.querySelector(".oj-objectives-table");
      const tableFirstRow = `<tr>
				<td><strong>${h3Source.innerText}</strong>: ${definition.innerText}</td>
			</tr>
			<tr class="ojti-table-second-head">
				<td><strong>Observable behaviours</strong></td>
			</tr>
			`;
      tableSource.innerHTML = tableClone.innerHTML =
        tableHeadTemplate + tableFirstRow + remainingRowsString + "</table>";
    }
  }

  // If grid is 4 horizontal columns, make first section
  // Of each section the same height. Looks better.
  function handleMediaChange(e) {
    const allWhatCanIExpectContainers =
      document.querySelectorAll(".oj-code-what-i");
    let currentTallest = 0;

    for (let index = 0; index < allWhatCanIExpectContainers.length; index++) {
      const element = allWhatCanIExpectContainers[index];
      if (element.clientHeight > currentTallest)
        currentTallest = element.clientHeight;
    }

    for (let index = 0; index < allWhatCanIExpectContainers.length; index++) {
      const element = allWhatCanIExpectContainers[index];
      element.style.height = e.matches ? currentTallest + 10 + "px" : "auto";
    }
  }

  module.init = function () {
    //ScrollToTop();

    cloneText();

    for (let index = 0; index < allBlocks.length; index++) {
      const block = allBlocks[index];
      block.addEventListener("click", clickBlockHandler);
    }

    closeButton.addEventListener("click", function (event) {
      // this.style.visibility = "hidden";
      resetAllBlocks();
    });

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    mediaQuery.addListener(handleMediaChange);
    handleMediaChange(mediaQuery);

    const detail = document.querySelector(".oj-comp-text-container");
    detail.removeAttribute("open");

  };
  return module;
})();

pageModule.init();
