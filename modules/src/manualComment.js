module.exports = {
    subscribeChannel: async (pages , spinners , config) => {
        var komenan = config.comments[Math.floor(Math.random() * config.comments.length)]
        spinners.update('comment', { text: "we will use this one \n" + komenan, color: 'blue' });
        await pages.keyboard.type(komenan, { delay: 20 });
        await pages.waitForTimeout(100);
        await pages.keyboard.press("Enter");
        await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
        });
    }
}