async function extractChannelInfo(page) {
    const channelXPath = '//ytd-channel-name//a[@class="yt-simple-endpoint style-scope yt-formatted-string"]';
    const titleElement = await page.$x('//h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string');
    const subscriberXPath = '//yt-formatted-string[@id="owner-sub-count"]';
    let channelElement = await page.$x(channelXPath);
    let channelName = await page.evaluate(element => element.textContent, channelElement[0]);

    const title = await (await titleElement[0].getProperty('textContent')).jsonValue();
    let subscriberElement = await page.$x(subscriberXPath);
    let subscriberCount = await page.evaluate(element => element.textContent, subscriberElement[0]);
    return {
        title,
        channelName,
        subscriberCount
    };
}

module.exports = {
    extractChannelInfo
};