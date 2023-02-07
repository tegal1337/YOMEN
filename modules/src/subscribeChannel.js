'use strict';
/**
 * @description Subscribes to a channel
 * @module subscribeChannel
 * @author fdciabdul
 * @date 2023-02-08
 * @param {any} page
 * @returns {any}
 */
module.exports = {
  subscribeChannel: async (page) => {
    await page.goto("https://www.youtube.com/channel/UC4SIsh0gmru7Yqd-DnMu8lQ");
    await page.waitForTimeout(10000);
    await page.evaluate(() => {
      document
        .querySelector(
          "#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string"
        )
        .click();
    });
  },
};
