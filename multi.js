/**
 * Created By : Abdul Muttaqin
 * Email : abdulmuttaqin456@gmail.com
 */
const puppeteer = require('puppeteer');
const { executablePath } = require('puppeteer');
const { newInjectedPage } = require("fingerprint-injector");
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');
const selector = require('./modules/constant/selector');
const { Config } = require('./modules/constant/BrowserConfig');
const {
  subsribe,
  copycommnet,
  manualComment,
  autoscroll,
  likeVideos,
  Logger,
  getInfo,
  aiCommented,
  Banner,
} = require('./modules');
const { uBlockOriginDownloader } = require('./modules/src/AdblockerUpdate');
const config = require('./config');

const paths = `${process.cwd()}/ublock`;

const spinners = new Spinners(cliSpinners.star.frames, {
  text: 'Loading',
  stream: process.stdout,
  onTick(frame) {
    process.stdout.write(frame);
  },
});

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

console.log(Banner.show);

async function startApp(config, browserConfig) {
  const keywords = config.keywords;
  const browser = await puppeteer.launch(browserConfig);
  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      devices: ['desktop'],
      operatingSystems: ['windows'],
    },
  });

  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube', { waitUntil: 'domcontentloaded' });

  spinners.add('user', { text: 'Login..', color: 'green' });

  try {
    const checkLogin = await page.$(selector.checkLogin);
    await page.evaluate(el => el.textContent, checkLogin);
    spinners.succeed('user', { text: 'You already logged in..', color: 'yellow' });
  } catch {
    await page.waitForXPath(selector.username);
    const usernameElement = await page.$x(selector.username);
    await usernameElement[0].type(config.usernamegoogle, { delay: 200 });
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    await page.waitForXPath(selector.password);
    const showPasswordElement = await page.$x("//div[contains(text(), 'Show password')]");
    for (const element of showPasswordElement) {
      await element.click();
    }
    const passwordElement = await page.$x(selector.password);
    await passwordElement[0].type(config.passwordgoogle, { delay: 200 });
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const twoStepVerificationElement = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1.oO8pQe');
      return Array.from(headings).some(heading => heading.textContent === "2-Step Verification");
    });

    if (twoStepVerificationElement) {
      console.log("I need to 2-step verification");
    }
  }

  console.log('=========== Start Commenting ==============');

  try {
    await subsribe.subscribeChannel(page);
  } catch {
    spinners.add('sub', { text: 'Thank you <3', color: 'green' });
  }

  spinners.add('first-spinner', { text: 'Searching for videos..', color: 'yellow' });

  for (const keyword of keywords) {
    if (config.trending) {
      await page.goto('https://www.youtube.com/feed/trending');
      await autoscroll._autoScroll(page);
    } else {
      const searchQuery = config.newVideos ? `${keyword}&sp=CAI%253D` : keyword;
      await page.goto(`https://www.youtube.com/results?search_query=${searchQuery}`);
      const element = await page.$(selector.shortvideos);
      if (element) {
        await page.evaluate(() => {
          document.querySelector('ytd-section-list-renderer > #contents > .style-scope:nth-child(1)').remove();
        });
      }
      await autoscroll._autoScroll(page);
    }

    await delay(3000);
    spinners.succeed('first-spinner', { text: 'done..', color: 'yellow' });

    await delay(7000);
    spinners.add('hasil', { text: 'Collecting videos..', color: 'yellow' });

    const linked = await Promise.all((await page.$$(selector.videoTitleinSearch)).map(async a => ({
      url: await (await a.getProperty('href')).jsonValue(),
      title: await (await a.getProperty('title')).jsonValue(),
    })));
    const hrefs = await Promise.all((await page.$$(selector.shortsTitleinSearch)).map(async a => await (await a.getProperty('href')).jsonValue()));
    if (hrefs.length > 0) {
      linked.push(...hrefs.map(url => ({ url })));
    }
    const linkz = linked.filter(el => el.url != null);
    spinners.succeed('hasil', { text: `FOUND ${linkz.length} LINKS`, color: 'yellow' });

    const shuffledLinks = linkz.sort(() => Math.random() - Math.random());

    for (const { url: tweet, title } of shuffledLinks) {
      if (readLog().includes(tweet)) {
        spinners.add('already', { text: 'The video has been commented..', color: 'blue' });
        continue;
      }

      spinners.add('comment', { text: 'Now commenting on the video..', color: 'yellow' });

      const pages = await browser.newPage();
      await pages.setViewport({ width: 1366, height: 768 });

      try {
        await pages.goto(tweet.includes('shorts') ? tweet.replace(/shorts/, 'watch') : tweet);

        try {
          await likeVideos.likeVideos(pages);
        } catch (error) {
          console.log(error);
        }

        await pages.bringToFront();
        await delay(4000);
        await pages.evaluate(() => { window.scrollBy(0, 550); });

        try {
          await pages.waitForSelector(selector.catchErrorInComment, { timeout: 4000 });
          console.log("Can't Comment");
          await pages.close();
        } catch {
          await pages.waitForSelector(selector.inputComment, { timeout: 4000 });
          await pages.evaluate(() => { document.querySelector('div#placeholder-area').click(); });

          spinners.update('comment', { text: 'Collecting comments for copying...', color: 'yellow' });

          if (config.copycomment && !config.ai) {
            await copycommnet.copyComment(pages, spinners, config);
          } else if (config.ai) {
            const info = await getInfo.extractChannelInfo(pages);
            await aiCommented.createComments(pages, spinners, info, config);
          } else if (!config.copycomment && !config.ai) {
            await manualComment.manualComment(pages, spinners, config);
          } else {
            console.log('Check Your Configuration');
          }

          const delayTime = (Math.floor(Math.random() * 60) + 60) * 1000;
          spinners.add('delay', { text: `Waiting for ${delayTime / 1000} seconds`, color: 'yellow' });

          spinners.add('act', { text: 'Scrolling comments to simulate human activity', color: 'yellow' });
          await autoscroll._autoScroll(pages);
          await delay(delayTime);
          await pages.close();

          spinners.succeed('comment', { text: 'Success commenting', color: 'yellow' });
          Logger.log('./logs/succesCommenting.log', config.usernamegoogle, tweet, 'success');
        }
      } catch (e) {
        console.log(e);
        Logger.log('./logs/errorCommenting.log', config.usernamegoogle, tweet, 'failed', e);
      }
    }
  }

  spinners.add('done', { text: 'WE ARE DONE, THANKS FOR USING THIS APP <3', color: 'green' });
  await browser.close();
}

async function startMulti() {
  const promiseChain = config.accounts.reduce(async (promiseChain, account) => {
    await promiseChain;
    return new Promise((resolve) => {
      setTimeout(() => {
        startApp(account, Config(paths, account, executablePath("chrome"), account.userdatadir))
          .then(resolve);
      }, 2000);
    });
  }, Promise.resolve());

  await promiseChain;
}



startMulti();
function readLog() {
    const data = fs.readFileSync('./logs/succesCommenting.log', 'utf8');
    return data;
}