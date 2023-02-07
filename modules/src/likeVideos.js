'use strict';
/**
 * Like videos
 * @module likeVideos
 * @author fdciabdul
 * @description Like videos
 * @date 2023-02-08
 * @param {any} page
 * @returns {any}
 */
module.exports = {
    likeVideos: async (page) => {
      try {
        await page
          .evaluate(() => {
            document
              .querySelector(
                ".ytd-menu-renderer:nth-child(1) > .ytd-toggle-button-renderer > #button > #button > .style-scope"
              )
              .click();
          })
          .catch((err) => {
            //console.log(err);
          });
      } catch (error) {}
    },
  };
  