module.exports = {
    subscribeChannel: async (page) => {
        await page.goto("https://www.youtube.com/channel/UC20YDKoLPR9OtsetXX0rnKQ");
        let element = await page.$('#subscribe-button');
        await page.waitForTimeout(10000);
        let value = await page.evaluate(el => el.textContent, element)
        await page.evaluate(() => {
            document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string").click();
        })
        console.log(value + "Thank you for subscribe my channel")
    }
}