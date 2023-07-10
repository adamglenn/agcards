const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("stylesheets/styles.css");
  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy("javascripts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  let options = {
    extname: ".liquid",
    dynamicPartials: false,
    jsTruthy: true,
    strictFilters: false, // renamed from `strict_filters` in Eleventy 1.0
    root: ["_includes"]
  };

  eleventyConfig.setLibrary("liquid", new Liquid(options));

  eleventyConfig.addShortcode("thumbnailImage", async function(src, alt) {
		if(alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on myImage from: ${src}`);
		}

		let metadata = await Image(src, {
			widths: [960],
			formats: ["webp"]
		});

		let data = metadata.webp[metadata.webp.length - 1];
		return `<img src="${data.url}" alt="${alt}" loading="lazy" decoding="async">`;
	});

  eleventyConfig.addShortcode("bgImage", async function(src, alt) {
		if(alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on myImage from: ${src}`);
		}

		let metadata = await Image(src, {
			widths: [960, 1920],
			formats: ["webp", "jpeg"]
		});

		let data = metadata.webp[metadata.webp.length - 1];
		return `style="background-image:url('${data.url}');`;
	});

  eleventyConfig.addCollection('orderedCards', function(collectionApi) {
    return collectionApi
      .getFilteredByGlob('_cards/**/*.md')
      .sort((a, b) => a.data.year - b.data.year)
      .sort((a, b) => a.data.brand - b.data.brand)
      .sort((a, b) => a.data.lastName - b.data.lastName)
  })

  // function sortByYear(values) {
  //   return values.slice().sort((a, b) => a.data.year.localeCompare(b.data.year))
  // }

  // function sortByBrand(values) {
  //   return values.slice().sort((a, b) => a.data.brand.localeCompare(b.data.brand))
  // }

  // function sortByName(values) {
  //   return values.slice().sort((a, b) => a.data.brand.localeCompare(b.data.lastName))
  // }

  // eleventyConfig.addFilter('sortByYear', sortByYear)
  // eleventyConfig.addFilter('sortByBrand', sortByBrand)
  // eleventyConfig.addFilter('sortByBrand', sortByName)

  return {
    htmlTemplateEngine: "liquid"
  }
};