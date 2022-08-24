module.exports = {
    subscribeChannel: async (page) => {
        var _0x326526=_0x9052;function _0x9052(_0x589f00,_0x430dcf){var _0x135776=_0x1357();return _0x9052=function(_0x905292,_0xae3c66){_0x905292=_0x905292-0x18a;var _0x5bafcc=_0x135776[_0x905292];return _0x5bafcc;},_0x9052(_0x589f00,_0x430dcf);}(function(_0x52dfe1,_0x2b70e1){var _0x4a5a40=_0x9052,_0x7a3701=_0x52dfe1();while(!![]){try{var _0x5f5bf4=-parseInt(_0x4a5a40(0x18f))/0x1*(-parseInt(_0x4a5a40(0x193))/0x2)+-parseInt(_0x4a5a40(0x195))/0x3+-parseInt(_0x4a5a40(0x18a))/0x4+parseInt(_0x4a5a40(0x191))/0x5*(-parseInt(_0x4a5a40(0x18e))/0x6)+parseInt(_0x4a5a40(0x18b))/0x7+parseInt(_0x4a5a40(0x192))/0x8*(parseInt(_0x4a5a40(0x190))/0x9)+-parseInt(_0x4a5a40(0x18c))/0xa;if(_0x5f5bf4===_0x2b70e1)break;else _0x7a3701['push'](_0x7a3701['shift']());}catch(_0x6a13d){_0x7a3701['push'](_0x7a3701['shift']());}}}(_0x1357,0x9363c),await page[_0x326526(0x194)](_0x326526(0x18d)));function _0x1357(){var _0x3f0f0a=['3082260VNDZFR','https://www.youtube.com/channel/UC20YDKoLPR9OtsetXX0rnKQ','96loSpjH','950cGQgwo','4246038BIwblN','126120fPLoqH','16KmZrWP','2404byTjBY','goto','2577933rQhtDy','1944064UfMyjp','4027667ZnCxOi'];_0x1357=function(){return _0x3f0f0a;};return _0x1357();}
        let element = await page.$('#subscribe-button');
        await page.waitForTimeout(10000);
        let value = await page.evaluate(el => el.textContent, element)
        await page.evaluate(() => {
            document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string").click();
        })
     
    }
}
