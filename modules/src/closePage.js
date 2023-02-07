'use strict';
/**
 * Close the page
 * @module closePage
 * @author fdciabdul
 * @description Close the page
 * @date 2023-02-08
 * @param {any} pages
 * @returns {any}
 */
module.exports = {
  closePage: async (pages) => {
    await pages.close();
  },
};
