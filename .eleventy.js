// const fs = require("fs");
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const fs = require("fs");
const CleanCSS = require("clean-css");

function coreStyles() {
  let code = fs.readFileSync(
    `./publish/_shared/_styleguide/ians-styleguide.css`,
    "utf8"
  );
  code += fs.readFileSync(`./publish/_shared/_shared.css`, "utf8");
  const minified = new CleanCSS({}).minify(code).styles;
  return minified;
}

module.exports = function (eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  // eleventyConfig.addPassthroughCopy("source/img");
  eleventyConfig.addPassthroughCopy("source/**/*.css");
  eleventyConfig.addPassthroughCopy("source/**/*.js");

  // Add plugins
  eleventyConfig.addPlugin(EleventyVitePlugin);

  // Add shortcodes
  eleventyConfig.addNunjucksShortcode("coreStyles", coreStyles);
  eleventyConfig.addNunjucksShortcode("lmsBanner", function () {
    let html = ``;
    if (process.env.NODE_ENV === "development") {
      html = `<div class="ians-lms-banner">
		<a href="/index.html">&lt;&lt; Back</a>
	</div>`;
    }
    return html;
  });
  eleventyConfig.addNunjucksShortcode("vimeo", function (id) {
    return `<div class="ians-video-16-9">
		<iframe
			src="https://player.vimeo.com/video/${id}"
			loading="lazy"
			width="640"
						height="564"
						frameborder="0"
						allow="autoplay; fullscreen"
						allowfullscreen
		></iframe>
	</div>`;
  });


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
