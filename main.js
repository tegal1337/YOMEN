/**
 * Created By : Abdul Muttaqin
 * Email : abdulmuttaqin456@gmail.com
 */
// ######################################### //
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const {
    executablePath
} = require('puppeteer');
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');
const selector = require("./modules/constant/selector");
const {
    Config
} = require("./modules/constant/BrowserConfig")
const {
    randomUserAgent,
    subsribe,
    copycommnet,
    manualComment,
    autoscroll,
    likeVideos,
    Logger,
    getInfo,
    aiCommented,
    Banner
} = require('./modules');
const config = require('./config');
const spinners = new Spinners(cliSpinners.star.frames, {
    text: 'Loading',
    stream: process.stdout,
    onTick(frame, index) {
        process.stdout.write(frame);
    },
});
puppeteer.use(StealthPlugin);
const paths = `${process.cwd()}/ublock`;
let delay = (Math.floor(Math.random() * 60) + 60) * 1000;
StealthPlugin.enabledEvasions.delete('iframe.contentWindow');
['chrome.runtime', 'navigator.languages'].forEach((a) => StealthPlugin.enabledEvasions.delete(a));
console.log(Banner.show);
async function startApp(config, browserconfig) {
    const keyword = config.keywords;
    const browser = await puppeteer.launch(browserconfig);
    const page = await browser.newPage();
    await page.setViewport({
        width: 1366,
        height: 768
    });
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
    });
    await page.setUserAgent(randomUserAgent.UA());
    await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube', {
        waituntil: "domcontentloaded"
    });
    spinners.add('user', {
        text: 'Login..',
        color: 'green'
    });
    try {
        const checklogin = await page.$(selector.checkLogin);
        await page.evaluate((el) => el.textContent, checklogin);
        spinners.succeed('user', {
            text: 'You already logged in..',
            color: 'yellow',
        });
    } catch {
        await page.waitForSelector(selector.username);
        await page.type(selector.username, config.usernamegoogle, {
            delay: 200
        });
        await page.keyboard.press('Enter');
        await page.waitForNavigation({
            waituntil: "domcontentloaded"
        });
        await page.waitForSelector(selector.showpass);
        // await page.click(selector.showpass , {delay :1000});
        await page.waitForTimeout(2000);
        await page.type(selector.password, config.passwordgoogle, {
            delay: 400
        });
        await page.keyboard.press('Enter');
        await page.waitForNavigation({
            waituntil: "domcontentloaded"
        });
    }
    console.log('=========== Start Commenting ==============');
    try {
        await subsribe.subscribeChannel(page);
    } catch (error) {
        spinners.add('sub', {
            text: 'Thank you <3',
            color: 'green',
        });
    }
    spinners.add('first-spinner', {
        text: 'Searching for videos..',
        color: 'yellow',
    });
    for (let i = 0; i < keyword.length; i++) {
        if (config.trending == true) {
            await page.goto('https://www.youtube.com/feed/trending');
            await autoscroll._autoScroll(page);
        } else {
            if (config.newVideos == true) {
                await page.goto(`https://www.youtube.com/results?search_query=${keyword[i]}&sp=CAI%253D`, );
            } else {
                await page.goto(`https://www.youtube.com/results?search_query=${keyword[i]}`, );
            }
            const element = await page.$(selector.shortvideos, );
            if (element) {
                await page.evaluate(() => {
                    document.querySelector("ytd-section-list-renderer > #contents > .style-scope:nth-child(1)").remove();
                });
            }
            await autoscroll._autoScroll(page);
        }
        await page.waitForTimeout(3000);
        spinners.succeed('first-spinner', {
            text: 'done..',
            color: 'yellow'
        });
        await page.waitForTimeout(7000);
        spinners.add('hasil', {
            text: 'Collecting videos..',
            color: 'yellow'
        });
        //collecting links
        let linked = await Promise.all((await page.$$(selector.videoTitleinSearch)).map(async a => {
            return {
                url: await (await a.getProperty('href')).jsonValue(),
                title: await (await a.getProperty('title')).jsonValue()
            };
        }));
        let hrefs = await Promise.all((await page.$$(selector.shortsTitleinSearch)).map(async a => {
            return await (await a.getProperty('href')).jsonValue();
        }));
        if (hrefs.length === 0) {
            linked.push(hrefs);
        }
        const linkz = linked.filter((el) => el.url != null);
        spinners.succeed('hasil', {
            text: `FOUND ${linkz.length}LINKS`,
            color: 'yellow',
        });
        // randomize links
        const link = linkz.sort(() => Math.random() - Math.random()).slice(0, linkz.length);
        for (let j = 0; j < link.length; j++) {
            if (readLog().includes(link[j])) {
                spinners.add('already', {
                    text: 'The video has been commented..',
                    color: 'blue',
                });
                continue;
            }
            spinners.add('comment', {
                text: 'Now commenting in the video..',
                color: 'yellow',
            });
            const tweet = link[j].url;
            const title = link[j].title;
            const pages = await browser.newPage();
            await pages.setViewport({
                width: 1366,
                height: 768
            });
            await pages.setUserAgent(randomUserAgent.UA());
            try {
                if (tweet.includes("shorts")) {
                    await pages.goto(tweet.replace(/shorts/, "watch"));
                } else {
                    // console.log(tweet);
                    await pages.goto(tweet);
                }
                try {
                    await likeVideos.likeVideos(pages);
                } catch (error) {
                    console.log(error);
                }
                await pages.bringToFront();
                await pages.waitForTimeout(4000);
                await pages.evaluate(() => {
                    window.scrollBy(0, 550);
                });
                try {
                    await pages.waitForSelector(selector.catchErrorInComment, {
                        timeout: 4000
                    });
                    console.log("Can't Comment");
                    await pages.close();
                } catch {
                    await pages.waitForSelector(selector.inputComment, {
                        timeout: 4000,
                    });
                    await pages.evaluate(() => {
                        document.querySelector('div#placeholder-area').click();
                    });
                    spinners.update('comment', {
                        text: 'So.. we need collecting those comment , so we can copy that ',
                        color: 'yellow',
                    });
                    if (config.copycomment && config.ai == false) {
                        await copycommnet.copyComment(pages, spinners, config);
                    } else if (config.ai) {
                     const info = await getInfo.extractChannelInfo(pages);
                  //   console.log(info);
                        await aiCommented.createComments(pages, spinners, info, config)
                    } else if (!config.copycomment && !config.ai) {
                        await manualComment.manualComment(pages, spinners, config);
                    } else {
                        console.log(" Check Your Configuration")
                    }
                    spinners.add('delay', {
                        text: `We will wait for ${delay} seconds`,
                        color: 'yellow',
                    });
            
                        spinners.add('act', {
                            text: `While delaying .. we actin like human to scroll comment`,
                            color: 'yellow',
                        });
                        await autoscroll._autoScroll(pages);
                 
                    await page.waitForTimeout(delay);
                    await pages.close();
                    spinners.succeed('comment', {
                        text: 'Success commenting',
                        color: 'yellow',
                    });
                    Logger.log('./logs/succesCommenting.log', config.usernamegoogle, tweet, 'success')
                }
            } catch (e) {
                console.log(e);
                //   await pages.close();
                Logger.log('./logs/errorCommenting.log', config.usernamegoogle, tweet, 'failed', e)
            }
        }
    }
    spinners.add('done', {
        text: `WE ARE DONE , THANKS FOR USING THIS APP <3`,
        color: 'green',
    });
    await browser.close();
}
startApp(config, Config(paths, config, executablePath("chrome") , config.userdatadir));

function readLog() {
    const data = fs.readFileSync('./logs/succesCommenting.log', 'utf8');
    return data;
}