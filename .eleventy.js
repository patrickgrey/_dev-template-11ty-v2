// const fs = require("fs");
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");


module.exports = function (eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  // eleventyConfig.addPassthroughCopy("source/img");
  eleventyConfig.addPassthroughCopy("source/**/*.css");
  eleventyConfig.addPassthroughCopy("source/**/*.js");

  // Add plugins
  eleventyConfig.addPlugin(EleventyVitePlugin);


  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    // pathPrefix: "source",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: "source",
      output: "publish",
      data: "../_utilities/_data",
      includes: "../_utilities/_includes",
    },
  };
};
