// const fs = require("fs");
require("dotenv").config();
const path = require("path");
const Image = require("@11ty/eleventy-img");
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const fs = require("fs");
const CleanCSS = require("clean-css");

const source = "course-source";
const publish = "course-publish";

function coreStyles() {
  let code = fs.readFileSync(
    `./${publish}/_shared/_styleguide/ians-styleguide.css`,
    "utf8"
  );
  code += fs.readFileSync(`./${publish}/_shared/_shared.css`, "utf8");
  const minified = new CleanCSS({}).minify(code).styles;
  return minified;
}

async function imageShortcode(src, alt, cls, sizes, widths, formats) {
  const imagePath = path.dirname(src);
  const urlPath = imagePath + "/";
  const outputDir = "./" + publish + this.page.url + imagePath + "/";
  const imageSource = "./" + source + this.page.url + src;
  const sizesString = sizes || `(max-width: 2400px) 100vw, 2400px`;

  let metadata = await Image(imageSource, {
    widths: widths || [320, 640, 960, 1200, 1800, 2400],
    formats: formats || ["avif", "webp", "jpeg"],
    urlPath: urlPath,
    outputDir: outputDir,
  });

  let imageAttributes = {
    class: cls || "",
    alt,
    sizes: sizesString,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${source}/index.css`);
  // Shortcodes take care of copying images.
  // What about images for animations???? Shortcode for animations which deal with this?
  // Solution: keep copying images and it is up to developers to optimise for the largest size image.

  eleventyConfig.addPassthroughCopy(`${source}/**/*.jpg`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.jpeg`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.png`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.svg`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.webp`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.avif`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.mp3`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.pdf`);
  // eleventyConfig.addPassthroughCopy(`${source}/**/*.css`);
  eleventyConfig.addPassthroughCopy(`${source}/**/*.js`);

  // eleventyConfig.addWatchTarget(`./${source}/index.css`);
  eleventyConfig.addWatchTarget(`${source}/**/*.css`);
  eleventyConfig.addWatchTarget(`${source}/**/*.js`);

  // Add plugins
  // Not finding local dependencies
  // https://github.com/vitejs/vite/issues/819
  // https://theroadtoenterprise.com/blog/how-to-set-up-path-resolving-in-vite
  // https://github.com/vitejs/vite/issues/88#issuecomment-804980262

  // https://github.com/vitejs/vite/issues/279#issuecomment-635646269


  // https://github.com/matthiasott/eleventy-plus-vite 
  if (process.env.NODE_ENV === "development") {
    eleventyConfig.addPlugin(EleventyVitePlugin, {
      resolve: {
        alias: [
          { find: "_components", replacement: `/${source}/_shared/_components` }
        ]
      },
    });
  }

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
  eleventyConfig.addNunjucksShortcode("video", function (id) {
    return `<div class="ians-video-16-9">
		<iframe
			src="https://www.youtube.com/embed/${id}?rel=0&showinfo=0"
			loading="lazy"
			frameborder="0"
			allowfullscreen
			title="Youtube video"
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
      input: source,
      output: publish,
      data: "../_utilities/_data",
      includes: "../_utilities/_includes",
    },
  };
};
