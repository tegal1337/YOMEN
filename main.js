/**
 * Created By : Abdul Muttaqin
 * Email : abdulmuttaqin456@gmail.com
 */
// ######################################### //

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const { executablePath } = require('puppeteer');
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');

const {
  randomUserAgent,
  subsribe,
  copycommnet,
  manualComment,
  autoscroll,
  likeVideos,
  Logger,
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

const wait = (seconds) => new Promise((resolve) => setTimeout(() => resolve(true), seconds * 1000));
puppeteer.use(StealthPlugin);
const paths = `${process.cwd()}/ublock`;
StealthPlugin.enabledEvasions.delete('iframe.contentWindow');
['chrome.runtime', 'navigator.languages'].forEach((a) => StealthPlugin.enabledEvasions.delete(a));



const konfigbrowser = {
  defaultViewport: null,
  // devtools: true,
  headless: false,

  executablePath: executablePath('chrome'),
  args: [
    '--log-level=3', // fatal only
    '--no-default-browser-check',
    '--disable-infobars',
    '--disable-web-security',
    '--disable-site-isolation-trials',
    '--no-experiments',
    '--ignore-gpu-blacklist',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list',
    '--mute-audio',
    '--disable-extensions',
    '--no-sandbox',

    '--no-first-run',
    '--no-zygote',
    `--disable-extensions-except=${paths}`,
    `--load-extension=${paths}`,
  ],

  userDataDir: config.userdatadir,
};
console.log(Banner.show);
/**
 * Starting Apps
 * @date 2023-02-08
 * @param {any} config
 * @param {any} browserconfig
 * @returns {any}
 */
async function startApp(config, browserconfig) {
  const keyword = config.keywords;
  const browser = await puppeteer.launch(browserconfig);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
  });

  await page.setUserAgent(randomUserAgent.UA());
  await page.goto(
    'https://accounts.google.com/signin/v2/identifier?service=youtube',
  );
  spinners.add('user', { text: 'Login..', color: 'green' });
  await page.waitForTimeout(2000);
  try {
    const checklogin = await page.$(
      '#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1',
    );
    await page.evaluate((el) => el.textContent, checklogin);
    spinners.succeed('user', {
      text: 'You already logged in..',
      color: 'yellow',
    });
  } catch {
    await page.waitForSelector('#identifierId');
    await page.type('#identifierId', config.usernamegoogle, { delay: 400 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    await page.type('input', config.passwordgoogle, { delay: 400 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
  }
  console.log('=========== Start Commenting ==============');

  try {
    await subsribe.subscribeChannel(page);
  } catch (error) {
    console.log('thanks');
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
      await page.goto(
        `https://www.youtube.com/results?search_query=${keyword[i]}`,
      );
      const element = await page.$(
        '.ytd-section-list-renderer > #contents > .style-scope:nth-child(1)',
      );
      if (element) {
        await page.evaluate(() => {
          document
            .querySelector(
              '.ytd-section-list-renderer > #contents > .style-scope:nth-child(1)',
            )
            .remove();
        });
      }
      await autoscroll._autoScroll(page);
    }

    await page.waitForTimeout(3000);
    spinners.succeed('first-spinner', { text: 'done..', color: 'yellow' });
    await page.waitForTimeout(7000);
    spinners.add('hasil', { text: 'Collecting videos..', color: 'yellow' });
   
    //collecting links
    let linked = await Promise.all((await page.$$('#video-title')).map(async a => {
      return await (await a.getProperty('href')).jsonValue();
    }));

    let hrefs = await Promise.all((await page.$$('#details > a')).map(async a => {
      return await (await a.getProperty('href')).jsonValue();
    }));

  if(hrefs.length === 0){
    linked.push(hrefs);
  }

    const link = linked.filter((el) => el != null);
    
    spinners.succeed('hasil', {
      text: `FOUND ${link.length}LINKS`,
      color: 'yellow',
    });

    for (i in link) {
     if(readLog().includes(link[i])){
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
      const tweet = link[i];
      const pages = await browser.newPage();
      await pages.setViewport({ width: 1366, height: 768 });
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
          await pages.waitForSelector('#message > span', { timeout: 4000 });
          console.log("Can't Comment");

          await pages.close();
        } catch {
          await pages.waitForSelector('#simplebox-placeholder', {
            timeout: 4000,
          });

          await pages.evaluate(() => {
            document.querySelector('#simplebox-placeholder').click();
          });
          spinners.update('comment', {
            text: 'So.. we need collecting those comment , so we can copy that ',
            color: 'yellow',
          });

          if (config.copycomment == true) {
            await copycommnet.copyComment(pages, spinners, config);
          } else {
            await manualComment.manualComment(pages, spinners, config);
          }
          await pages.waitForTimeout(config.delay * 1000);
          await pages.close();
          spinners.succeed('comment', {
            text: 'Success commenting',
            color: 'yellow',
          });
          Logger.log('./logs/succesCommenting.log',config.usernamegoogle , tweet, 'success')
        }
      } catch (e) {
        await pages.close();
        console.log(
          `Something Wrong maybe this is Short videos , live stream , or broken error : ${
            e}`,
            Logger.log('./logs/errorCommenting.log',config.usernamegoogle , tweet, 'failed' , e)
        );
      }
      await wait(config.delay);
    }

    spinners.add('delay', {
      text: `wait .. we delaying for ${config.delaycomment}`,
      color: 'yellow',
    });
  }
  spinners.add('done', {
    text: `WE ARE DONE , THANKS FOR USING THIS APP <3`,
    color: 'green',
  });
  await browser.close();
}

startApp(config, konfigbrowser);

function readLog() {
  const data = fs.readFileSync('./logs/succesCommenting.log', 'utf8');
  return data;
}