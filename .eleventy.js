const mathjaxPlugin = require("eleventy-plugin-mathjax");

module.exports = function(eleventyConfig) {
	
  const markdownIt = require("markdown-it");
  const markdownItImageFigures = require("markdown-it-image-figures");
  
  const mdOptions = {
    html: true,
    linkify: true,
    typographer: true
  };
  
  const md = markdownIt(mdOptions).use(markdownItImageFigures, {
    figcaption: "alt"  // Ключ! Использует "title" из Markdown как подпись (но у тебя title нет, так что используем alt)
  });
  
  eleventyConfig.setLibrary("md", md);
  
  // Подключаем MathJax плагин
  eleventyConfig.addPlugin(mathjaxPlugin);

  // Коллекция docs
  eleventyConfig.addCollection("docs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("docs/*.md").sort(function(a, b) {
      // Сортировка по nav_order, если есть, иначе по имени файла
      return (a.data.nav_order || 0) - (b.data.nav_order || 0) || a.fileSlug.localeCompare(b.fileSlug);
    });
  });
  // Копируем статические файлы (если будут изображения и т.д.)
  eleventyConfig.addPassthroughCopy("docs/images"); // если у тебя есть папка с картинками
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("media");
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",       // Важно: Eleventy ищет layout в _includes
      layouts: "_includes"         // Здесь указываем, где лежат layouts
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk", // Markdown-файлы обрабатываются через Nunjucks
    htmlTemplateEngine: "njk"
  };
};