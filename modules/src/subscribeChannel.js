module.exports = {
  subscribeChannel: async (page) => {
    await page.goto("https://www.youtube.com/channel/UC4SIsh0gmru7Yqd-DnMu8lQ");

    let element = await page.$("#subscribe-button");
    await page.waitForTimeout(10000);
    let value = await page.evaluate((el) => el.textContent, element);
    await page.evaluate(() => {
      document
        .querySelector(
          "#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string"
        )
        .click();
    });
  },
};
