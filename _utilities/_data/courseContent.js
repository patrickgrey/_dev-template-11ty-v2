const { data } = require("autoprefixer");
const dirTree = require("directory-tree");
// const metaData = require("./metaData.json");

const source = "source";
// Get the file tree structure from the source folder.
const filteredTree = dirTree(source, {
  extensions: /\.njk/,
  attributes: ["size", "type", "extension"]
});

console.log("filteredTree", filteredTree);

// Recursive traverse object utility function.
const traverse = function (o, fn, scope = []) {
  for (let i in o) {
    fn.apply(this, [i, o[i], scope]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], fn, scope.concat(i));
    }
  }
};

let pathArray = [];
let previousPath = "";

// Recursively loop through the filetree object
// looking only for paths that contain html files.
// Normalizes the path delimeters
// (Mac returns '/', windows returns '\\').

// BUG Extension not included in directory-tree output!!

traverse(filteredTree, (key, value, scope) => {
  // console.log("key", key);
  // console.log("value", value);
  // console.log("scope", scope);
  if (key === "path") {
    const normalizedPath = value.replace(/\\/g, "/");
    // Record the path as the html page is found in a later loop.
    previousPath = normalizedPath;
  }
  if (key === "extension" && value === ".njk") {
    // Only keep paths that include html files.
    pathArray.push(previousPath);
  }
});

console.log("pathArray", pathArray);

// Remove the contents and template files.
let filteredPaths = pathArray.filter(function (path) {
  if (
    path === `${source}/_course-intro-template/index.html` ||
    path === `${source}/_web-page-template/index.html` ||
    path === `${source}/_direct-access/index.html` ||
    path === `${source}/_direct-access/syllabus.html` ||
    path === `${source}/_direct-access/placeholder.html` ||
    path === `${source}/_shared/_styleguide/index.html` ||
    path === `${source}/index.html`
  ) {
    return false;
  } else {
    return true;
  }
});

// Get the filepath for each html page and the nested structure.
const dataArray = filteredPaths.map((item) => {
  const splitPath = item.split("/");
  // Remove index.html page
  splitPath.pop();
  // Remove course source folder reference
  splitPath.shift();
  // page title will be the last folder name in the filepath
  // url includes the full filepath.
  // topics lists the nesting of folders.
  let data = {};
  data.url = splitPath.join("/");
  data.page = splitPath.pop();
  data.topics = [...splitPath];
  return data;
});

// console.log("dataArray: ", dataArray);

// Topic subdirectory names can class e.g.
// subject1/topic1 and subject2/topic1
// This function creates a hash of the nested path string
// For later comparison.
function getTopicHashID(topics, depth) {
  let topicHash = "";
  for (let index = 0; index < depth + 1; index++) {
    topicHash += topics[index];
  }
  return topicHash;
}

// Record topics that have already been added to contents.
let addedTopics = [];

// Build the content string from the data object.
function parseData(data) {
  let contentsString = ``;
  // Loop through each path
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const topicsLength = item.topics.length;
    // If no topic nesting, print a link directly
    if (topicsLength === 0) {
      contentsString += `<p class="ians-content-level-root"><a href="${item.url}">${item.page}</a></p>`;
    }
    // If there are topics,
    //
    else {
      for (let index2 = 0; index2 < topicsLength; index2++) {
        const topicHeader = item.topics[index2];
        // Check if the topic header has already been added to the contents
        // Every html page reference will inlcude all topics
        // relating to it so has to be checked.
        // Set header level depending on nesting depth.
        if (!addedTopics.includes(getTopicHashID(item.topics, index2))) {
          contentsString += `<h${index2 + 2}>${topicHeader}</h${index2 + 2}>`;
          addedTopics.push(getTopicHashID(item.topics, index2));
        }
      }
      // Add a class to indent the text.
      contentsString += `<p class="ians-contents-level-${topicsLength + 2
        }"><a href="${item.url}">${item.page}</a></p>`;
    }
  }

  contentsString += `<hr/>`;

  // Eh??

  contentsString += `<p class="ians-contents-level-root"><a href="_shared/_styleguide/index.html">styleguide</a></p>`;

  // contentsString += `<p class="ians-contents-level-root"><a href="_direct-access/${metaData.courseCode}_DA.html">Direct Access</a></p>`;

  return contentsString;
}

const htmlString = parseData(dataArray);

// console.log("\x1b[0m", "");
// console.log("\x1b[33m", "**** CONTENTS DATA     ****");
// console.log("\x1b[33m", htmlString);
// console.log("\x1b[33m", "**** CONTENTS DATA END ****");
// console.log("\x1b[0m", "");

// Return contents page HTML.
module.exports = {
  tree: htmlString,
};
