import 'module-alias/register';
import YOMEN from '#lib/Bot/YoutubeBot';
import { LaunchBrowser } from '#lib/Browser';
import LoginYoutube from '#lib/LoginYoutube';
import Logger from '#utils/Logger';
import { banner } from '#utils/banner';
import { randomDelay } from '#utils/randomDelay';

async function main() {
    const browser = new LaunchBrowser();
    await browser.init();
    Logger.divider();
    Logger.banner(banner);
    Logger.divider();
    const pages = await browser.page;
    const login = new LoginYoutube(pages);
    await login.login();
    const yomen = new YOMEN(pages);
    const urls = await yomen.searchKeyword('mr beast');

    for (let i = 0; i < urls.length; i++) {
        await yomen.goToVideo(urls[i]);
        await randomDelay(5000, 10000);
    }
}

main();