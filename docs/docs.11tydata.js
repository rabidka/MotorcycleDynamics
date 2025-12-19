module.exports = {
  eleventyComputed: {
    eleventyNavigation: {
      key: (data) => {
        const match = data.title?.trim().match(/^(\d+(\.\d+)*)/);
        return match ? match[1] : data.title || "Unknown";
      },
      parent: (data) => {
        const match = data.title?.trim().match(/^(\d+(\.\d+)*)/);
        if (!match) return undefined;

        const parts = match[1].split('.');
        if (parts.length <= 1) return undefined;

        return parts.slice(0, -1).join('.');
      },
      title: (data) => data.title,  // <<< ЭТО КЛЮЧЕВАЯ СТРОКА! Полный заголовок для отображения
      order: (data) => {
        const match = data.title?.trim().match(/^(\d+(\.\d+)*)/);
        if (!match) return 99999;
        return match[1]
          .split('.')
          .map(n => n.padStart(4, '0'))
          .join('.');
      }
    }
  }
};