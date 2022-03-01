const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const config = require("./config");
puppeteer.use(StealthPlugin());
var keyword = config.keywords;
var comments = config.comments;
const browserconfig = {
    //defaultViewport: null,
    // devtools: true,
  headless: false,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--mute-audio"],
// save into user data dir
  userDataDir: "fdciabdul",
};
async function startApp(page) {
  const browser = await puppeteer.launch(browserconfig);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );
  
  await page.goto("https://accounts.google.com/");
  try {

  let checklogin = await page.$('#yDmH0d > c-wiz > div > div:nth-child(2) > div > c-wiz > c-wiz > div > div.s7iwrf.gMPiLc.Kdcijb > div > div > header > h1');

  let txtchecklogin = await page.evaluate(el => el.textContent, checklogin)

  console.log("you are logged in");
} catch {

  await page.waitForSelector("#identifierId");
  await page.type("#identifierId", config.usernamegoogle, { delay: 1000 });
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
  await page.type("input", config.passwordgoogle, { delay: 1000 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(10000);
  console.log("=========== Waiting ==============")
  await page.goto("https://www.youtube.com/channel/UC20YDKoLPR9OtsetXX0rnKQ");
 
  let element = await page.$('#subscribe-button');
  await page.waitForTimeout(10000);
  let value = await page.evaluate(el => el.textContent, element)
  console.log(value)
 try {
  await page.evaluate(() => {
    document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string").click();
  })
 } catch (error) {
   console.error(error)
 }
}
  console.log("=========== Start Commenting ==============")
for(let i=0;i<keyword.length;i++){
  //await page.goto("https://www.youtube.com/results?search_query=" + keyword+"&sp=CAI%253D"); <-- if you want to get get videos by newest update , you can use this one
  await page.goto("https://www.youtube.com/results?search_query=" + keyword[i]+"&sp=EgQQARgD");
  await page.evaluate(() => {
    document.querySelector("#button").click();

  });
  await page.bringToFront();

  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });
  await page.waitForTimeout(7000);

  const linked = await page.$$("#video-title");

  console.log(Object.keys(linked));
  var link = linked.filter(function (el) {
    return el != null;
  });

  console.log("Jumlah Link : ", link.length);

  for (i in link) {
    const tweet = await await (await link[i].getProperty("href")).jsonValue();
    console.log(tweet);
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
       
     
        await pages.waitForTimeout(1000);
        await pages.keyboard.type(comments[Math.floor(Math.random() * comments.length)],{delay:20});
        await pages.waitForTimeout(100);
        await pages.keyboard.press("Enter");
        await pages.evaluate(() => {
          document.querySelector("#submit-button").click();
        });
        await page.waitForTimeout(4000);
        await pages.close();
        console.log("Success Comment");
      }
    } catch(e) {
      await pages.close();
      console.log("Something Wrong maybe this is Short videos , live stream , or broken error : " + e);
    }
  }
}
  console.log("DONE! HAVE A NICE DAY");


}


startApp();
