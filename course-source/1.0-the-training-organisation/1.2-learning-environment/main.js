//import { ScrollToTop } from "_components/ScrollToTop";
import printJS from 'print-js';

("use strict");

var pageModule = (function () {
  var module = {};

  var checkboxDictionary = {};

  /**
 * Sanitize and encode all HTML in a user-submitted string
 * https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
  var sanitizeHTML = function (str) {
    return str.replace(/[^\w.,!: ]/gi, function (c) {
      return '&#' + c.charCodeAt(0) + ';';
    });
  };

  function clearAllMemory() {
    const allRadios = document.querySelectorAll(".radio");
    for (let index = 0; index < allRadios.length; index++) {
      const radio = allRadios[index];
      localStorage.removeItem(radio.name);
    }

    const allCheckboxes = document.querySelectorAll(".checkbox");
    for (let index = 0; index < allCheckboxes.length; index++) {
      const checkbox = allCheckboxes[index];
      localStorage.removeItem(checkbox.name);
    }

    const allNotes = document.querySelectorAll(".oj-questions textarea");
    for (let index = 0; index < allNotes.length; index++) {
      const note = allNotes[index];
      localStorage.removeItem(note.id);
    }

    location.reload();
  }

  function initRadioMemory() {
    const allRadios = document.querySelectorAll(".radio");
    for (let index = 0; index < allRadios.length; index++) {
      const radio = allRadios[index];
      radio.addEventListener("click", function (event) {
        localStorage.setItem(radio.name, radio.id);
      });
    }
  }

  function addCheckboxValue(name, id) {
    var currentString = checkboxDictionary[name] || "";
    var currentArray = currentString.length > 0 ? currentString.split(",") : [];
    currentArray.push(id);
    currentArray = [...new Set(currentArray)];
    var arrayString = currentArray.join();
    checkboxDictionary[name] = arrayString;
    return arrayString;
  }

  function removeCheckboxValue(name, id) {
    var currentString = checkboxDictionary[name] || "";
    var currentArray = currentString.length > 0 ? currentString.split(",") : [];
    var filtered = currentArray.filter(function (value, index, arr) {
      return value != id;
    });
    var joinString = filtered.join();
    checkboxDictionary[name] = joinString;
    return joinString;
  }

  function initCheckboxMemory() {
    const allCheckboxes = document.querySelectorAll(".checkbox");
    for (let index = 0; index < allCheckboxes.length; index++) {
      const checkbox = allCheckboxes[index];
      checkbox.addEventListener("click", function (event) {
        // localStorage.setItem(checkbox.name, checkbox.id);
        var checkedList;
        if (checkbox.checked) {
          var checkedList = addCheckboxValue(checkbox.name, checkbox.id);
          localStorage.setItem(checkbox.name, checkedList);
        }
        else {
          var checkedList = removeCheckboxValue(checkbox.name, checkbox.id);
          if (checkedList === "") {
            localStorage.removeItem(checkbox.name);
          }
          else {
            localStorage.setItem(checkbox.name, checkedList);
          }

        }
      });
    }
  }

  function checkRadioMemory() {
    const allRadios = document.querySelectorAll(".radio");
    for (let index = 0; index < allRadios.length; index++) {
      const radio = allRadios[index];
      const id = localStorage.getItem(radio.name);
      if (id === radio.id) {
        radio.checked = true;
      }
    }
  }

  function checkCheckboxMemory() {
    const allCheckboxes = document.querySelectorAll(".checkbox");
    for (let index = 0; index < allCheckboxes.length; index++) {
      const checkbox = allCheckboxes[index];
      var currentString = localStorage.getItem(checkbox.name) || "";
      if (currentString != "") {

        checkboxDictionary[checkbox.name] = currentString;
        var idArray = currentString.split(",");
        // const idArray = localStorage.getItem(checkbox.name).split(",");
        for (let index = 0; index < idArray.length; index++) {
          const id = idArray[index];
          if (id === checkbox.id) {
            checkbox.checked = true;
          }
        }

      }
    }
  }

  function initNotesMemory() {
    const allNotes = document.querySelectorAll(".oj-questions textarea");
    for (let index = 0; index < allNotes.length; index++) {
      const note = allNotes[index];
      note.addEventListener("keyup", function (event) {
        localStorage.setItem(note.id, sanitizeHTML(note.value));
      })
    }
  }

  function checkNotesMemory() {
    const allNotes = document.querySelectorAll(".oj-questions textarea");
    for (let index = 0; index < allNotes.length; index++) {
      const note = allNotes[index];
      note.value = localStorage.getItem(sanitizeHTML(note.id));
    }
  }

  function initSummaries() {
    const summaries = document.querySelectorAll(".oj-questions summary");
    for (let index = 0; index < summaries.length; index++) {
      const summary = summaries[index];
      summary.addEventListener("click", function (event) {
        event.preventDefault();
        const detail = this.parentElement;
        if (detail.open) {
          detail.open = false;
        } else {
          detail.open = true;
          this.nextElementSibling.focus();
        }
      });
    }
  }

  function openNotesWithData() {
    const allNotes = document.querySelectorAll(".oj-questions textarea");
    for (let index = 0; index < allNotes.length; index++) {
      const note = allNotes[index];
      if (note.value != "") {
        const detail = note.parentElement;
        detail.open = true;
      }
    }
  }

  function printAll() {
    openNotesWithData();

    printJS({ printable: "ojQuestions", type: "html", scanStyles: false, css: "print.css" });
  }

  module.init = function () {
    checkRadioMemory();
    checkCheckboxMemory();
    checkNotesMemory()
    initRadioMemory();
    initCheckboxMemory();
    initNotesMemory();
    initSummaries();
    openNotesWithData();
    const clearAllMemoryButton = document.querySelector("#clearAllMemory");
    clearAllMemoryButton.addEventListener("click", function (event) {
      clearAllMemory();
    });
    const printAnswers = document.querySelector("#printAnswers");
    printAnswers.addEventListener("click", function (event) {
      printAll();
    })
    //ScrollToTop();
  };
  return module;
})();

pageModule.init();
