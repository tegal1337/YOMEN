/** 
 * Created By : Abdul Muttaqin
 * Email : abdulmuttaqin456@gmail.com 
 */
// ######################################### PESAN


const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const config = require("./config");
const { _autoScroll } = require("./modules/autoscroll");
const cliSpinners = require("cli-spinners");

const sleep = require("sleep");
const Spinners = require('spinnies');

const spinners = new Spinners(cliSpinners.star.frames, {
  text: 'Loading',
  stream: process.stdout,
  onTick: function (frame, index) {
    process.stdout.write(frame);
  }
});
puppeteer.use(StealthPlugin());


const konfigbrowser = {
  //defaultViewport: null,
  // devtools: true,
  headless: false,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: [
    "--log-level=3", // fatal only
 
    "--no-default-browser-check",
    "--disable-infobars",
    "--disable-web-security",
    "--disable-site-isolation-trials",
    "--no-experiments",
    "--ignore-gpu-blacklist",
    "--ignore-certificate-errors",
    "--ignore-certificate-errors-spki-list",
    "--mute-audio",
    "--disable-extensions",
    "--no-sandbox",
  
    "--no-first-run",
    "--no-zygote"
  ],
  // unccoment ini jika ingin menggunakan save data

 // userDataDir: "iya",

};

async function startApp(config, browserconfig) {
  var keyword = config.keywords;

  const browser = await puppeteer.launch(browserconfig);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto("https://accounts.google.com/signin/v2/identifier?service=youtube");
  spinners.add('user', { text: 'Login..', color: 'green' });
  await page.waitForTimeout(2000);
  try {

    let checklogin = await page.$('#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1');

    await page.evaluate(el => el.textContent, checklogin)

    spinners.succeed('user', { text: 'You already logged in..', color: 'blue' });
  } catch {

    await page.waitForSelector("#identifierId");
    await page.type("#identifierId", config.usernamegoogle, { delay: 400 });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    await page.type("input", config.passwordgoogle, { delay: 400 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(10000);

  }
  console.log("=========== Start Commenting ==============")
  spinners.add('first-spinner', { text: 'Searching for videos..', color: 'blue' });
  for (let i = 0; i < keyword.length; i++) {
    //https://www.youtube.com/feed/trending
    //await page.goto("https://www.youtube.com/results?search_query=" + keyword+"&sp=CAI%253D");
    if (config.trending == true) {
      await page.goto("https://www.youtube.com/feed/trending");
      await _autoScroll(page);
    } else {

    await page.goto("https://www.youtube.com/results?search_query=" + keyword[i] + "&sp=EgQQARgD");
    await _autoScroll(page);
     }
   
    await page.waitForTimeout(3000);
    spinners.succeed('first-spinner', { text: 'done..', color: 'blue' });
    await page.waitForTimeout(7000);
    spinners.add('hasil', { text: 'Collecting videos..', color: 'yellow' });
    const linked = await page.$$("#video-title");


    var link = linked.filter(function (el) {
      return el != null;
    });
    spinners.succeed('hasil', { text: 'FOUND ' + link.length + 'LINKS', color: 'yellow' });


    for (i in link) {
      spinners.add('comment', { text: 'Now commenting in the video..', color: 'blue' });
      const tweet = await (await link[i].getProperty("href")).jsonValue();

      const pages = await browser.newPage();
      try {
        await pages.goto(tweet);
        await pages.bringToFront();
        await page.waitForTimeout(4000);
        await pages.evaluate(() => {
          window.scrollBy(0, 650);
        });

        try {
          await pages.waitForSelector("#message > span", { timeout: 4000 });
          console.log("Can't Comment");
          await pages.close();
        } catch {
          await pages.waitForSelector("#simplebox-placeholder", {
            timeout: 4000,
          });

          await pages.evaluate(() => {
            document.querySelector("#simplebox-placeholder").click();

          });

          spinners.update('comment', { text: 'So.. we need collecting those comment , so we can copy that ', color: 'blue' });
          let totalComments = [];
          await pages.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });
          await pages.waitForSelector("yt-formatted-string[id='content-text']", { visible: true });
          let comments = await pages.$$("yt-formatted-string[id='content-text']");

          if(config.copycomment == true){
          let count = 1;

          for (let j of comments) {
            let comment = await pages.evaluate(function (ele) {
              return ele.textContent;
            }, j)
            totalComments.push(comment.split("\n").join(" "));
            count++;
          }
          spinners.update('comment', { text: 'i found so many comment , total :' + totalComments.length, color: 'blue' });
          await pages.evaluate(() => {
            window.scrollBy(0, -window.innerHeight * 2);
          });
        
          await pages.waitForTimeout(1000);
          var komenan = totalComments[Math.floor(Math.random() * totalComments.length)]
          spinners.update('comment', { text: "but we will use this one \n" + komenan, color: 'blue' });
          await pages.keyboard.type(komenan, { delay: 20 });
          await pages.waitForTimeout(100);
          await pages.keyboard.press("Enter");
          await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
          });
        }else{
          var komenan = config.comments[Math.floor(Math.random() * config.comments.length)]
          spinners.update('comment', { text: "we will use this one \n" + komenan, color: 'blue' });
          await pages.keyboard.type(komenan, { delay: 20 });
          await pages.waitForTimeout(100);
          await pages.keyboard.press("Enter");
          await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
          });
        }
          await page.waitForTimeout(4000);
          await pages.close();
          spinners.succeed('comment', { text: 'Success commenting', color: 'blue' });
        
        }
      } catch (e) {
        await pages.close();
        console.log("Something Wrong maybe this is Short videos , live stream , or broken error : " + e);
      }
   
    
      sleep.sleep(config.delaycomment);
    }
  
    spinners.add('delay', { text: 'Bentarrr .. kita delay selama '+ config.delay +' menit', color: 'blue' });
  }
  console.log("DONE! HAVE A NICE DAY");


}
async function multiakunBot(config, browserconfig) {
  const akun = require('./multiakun.js');
  var keyword = config.keywords;

  const browser = await puppeteer.launch(browserconfig);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  for (let i = 0; i < akun.data.length; i++) {
  await page.goto("https://accounts.google.com/signin/v2/identifier?service=youtube");
  spinners.add('user', { text: 'Login..', color: 'green' });
  await page.waitForTimeout(2000);
  try {

    let checklogin = await page.$('#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1');

    await page.evaluate(el => el.textContent, checklogin)

    spinners.succeed('user', { text: 'You already logged in..', color: 'blue' });
  } catch {

    await page.waitForSelector("#identifierId");
    await page.type("#identifierId", akun.data[i].username, { delay: 400 });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    await page.type("input",akun.data[i].password, { delay: 400 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(10000);
    await page.waitForSelector("#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1");

    // if getting challenge 
    var url = page.url();
    if(url.includes("challenge")){
      console.log("You Need to Verify Your Account");
      await page.waitForTimeout(2000);
    }else{
      console.log("You Already Verified Your Account");
      await page.waitForTimeout(5000);
    }
  }
  console.log("=========== Start Commenting ==============")
  spinners.add('first-spinner', { text: 'Searching for videos..', color: 'blue' });
  for (let i = 0; i < keyword.length; i++) {
    //https://www.youtube.com/feed/trending
    //await page.goto("https://www.youtube.com/results?search_query=" + keyword+"&sp=CAI%253D");
    if (config.trending == true) {
      await page.goto("https://www.youtube.com/feed/trending");
      await _autoScroll(page);
    } else {

    await page.goto("https://www.youtube.com/results?search_query=" + keyword[i] + "&sp=EgQQARgD");
    await _autoScroll(page);
     }
   
    await page.waitForTimeout(3000);
    spinners.succeed('first-spinner', { text: 'done..', color: 'blue' });
    await page.waitForTimeout(7000);
    spinners.add('hasil', { text: 'Collecting videos..', color: 'yellow' });
    const linked = await page.$$("#video-title");


    var link = linked.filter(function (el) {
      return el != null;
    });
    spinners.succeed('hasil', { text: 'FOUND ' + link.length + 'LINKS', color: 'yellow' });


    for (i in link) {
      spinners.add('comment', { text: 'Now commenting in the video..', color: 'blue' });
      const tweet = await (await link[i].getProperty("href")).jsonValue();

      const pages = await browser.newPage();
      try {
        await pages.goto(tweet);
        await pages.bringToFront();
        await page.waitForTimeout(4000);
        await pages.evaluate(() => {
          window.scrollBy(0, 650);
        });

        try {
          await pages.waitForSelector("#message > span", { timeout: 4000 });
          console.log("Can't Comment");
          await pages.close();
        } catch {
          await pages.waitForSelector("#simplebox-placeholder", {
            timeout: 4000,
          });

          await pages.evaluate(() => {
            document.querySelector("#simplebox-placeholder").click();

          });

          spinners.update('comment', { text: 'So.. we need collecting those comment , so we can copy that ', color: 'blue' });
          let totalComments = [];
          await pages.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });
          await pages.waitForSelector("yt-formatted-string[id='content-text']", { visible: true });
          let comments = await pages.$$("yt-formatted-string[id='content-text']");

          if(config.copycomment == true){
          let count = 1;

          for (let j of comments) {
            let comment = await pages.evaluate(function (ele) {
              return ele.textContent;
            }, j)
            totalComments.push(comment.split("\n").join(" "));
            count++;
          }
          spinners.update('comment', { text: 'i found so many comment , total :' + totalComments.length, color: 'blue' });
          await pages.evaluate(() => {
            window.scrollBy(0, -window.innerHeight * 2);
          });
        
          await pages.waitForTimeout(1000);
          var komenan = totalComments[Math.floor(Math.random() * totalComments.length)]
          spinners.update('comment', { text: "but we will use this one \n" + komenan, color: 'blue' });
          await pages.keyboard.type(komenan, { delay: 20 });
          await pages.waitForTimeout(100);
          await pages.keyboard.press("Enter");
          await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
          });
        }else{
          var komenan = config.comments[Math.floor(Math.random() * config.comments.length)]
          spinners.update('comment', { text: "we will use this one \n" + komenan, color: 'blue' });
          await pages.keyboard.type(komenan, { delay: 20 });
          await pages.waitForTimeout(100);
          await pages.keyboard.press("Enter");
          await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
          });
        }
          await page.waitForTimeout(4000);
          await pages.close();
          spinners.succeed('comment', { text: 'Success commenting', color: 'blue' });
        
        }
      } catch (e) {
        await pages.close();
        console.log("Something Wrong maybe this is Short videos , live stream , or broken error : " + e);
        process.exit(1);
      }
   
    
      sleep.sleep(config.delaycomment);
    }
  
    spinners.add('delay', { text: 'Bentarrr .. kita delay selama '+ config.delay +' menit', color: 'blue' });
  }
  console.log("DONE! HAVE A NICE DAY");
 await browser.close();
  }
}

if(config.multiakun == true){
  multiakunBot(config, konfigbrowser);
}else{
startApp(config, konfigbrowser);
}
