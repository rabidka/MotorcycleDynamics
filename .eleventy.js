const mathjaxPlugin = require("eleventy-plugin-mathjax");
const markdownIt = require("markdown-it");
const markdownItImageFigures = require("markdown-it-image-figures");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
  
  const mdOptions = {
    html: true,
    linkify: true,
    typographer: true
  };

  const md = markdownIt(mdOptions).use(markdownItImageFigures, {
    figcaption: "alt",
    attributes: true  // для {width=...} в картинках
  });
  
  const urlFilter = eleventyConfig.getFilter("url");
  
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    let src = token.attrGet("src");
  
    if (src && src.startsWith("/")) {
      src = urlFilter(src);
      token.attrSet("src", src);
    }
  
    return self.renderToken(tokens, idx, options);
  };

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(mathjaxPlugin);

  eleventyConfig.addCollection("docs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("docs/*.md").sort(function(a, b) {
      return (a.data.nav_order || 0) - (b.data.nav_order || 0) || a.fileSlug.localeCompare(b.fileSlug);
    });
  });
  
  eleventyConfig.addPassthroughCopy("docs/images");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("media");

  const baseConfig = {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_includes"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
	pathPrefix: process.env.PREVIEW ? "/" : "/MotorcycleDynamics/",
    htmlTemplateEngine: "njk"
  };

  return baseConfig;
};