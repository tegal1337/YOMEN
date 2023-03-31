'use strict';
/**
 * Manual Comment
 * @author fdciabdul
 * @module manualComment
 * @description Manual Comment
 * @date 2023-02-08
 * @param {any} pages
 * @param {any} spinners
 * @param {any} config
 * @returns {any}
 */
module.exports = {
    manualComment: async (pages , spinners , config) => {
        await pages.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });
        var komenan = config.comments[Math.floor(Math.random() * config.comments.length)]
        spinners.update('comment', { text: "we will use this one \n" + komenan, color: 'blue' });
        await pages.waitForSelector("#contenteditable-root");
        await pages.type("#contenteditable-root",komenan, { delay: 20 });
        await pages.waitForTimeout(100);
        await pages.keyboard.press("Enter");
        await pages.evaluate(() => {
          document.querySelector("#submit-button").click();
        });
    }
}