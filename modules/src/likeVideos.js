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
                "#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill"
              )
              .click();
          })
          .catch((err) => {
            //console.log(err);
          });
      } catch (error) {}
    },
  };
  