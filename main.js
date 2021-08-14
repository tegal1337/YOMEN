const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const config = require("./config");
puppeteer.use(StealthPlugin());
var keyword = config.keywords;
const browserconfig = {
    //defaultViewport: null,
    // devtools: true,
  headless: false,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--mute-audio"],
};
async function startApp() {
  const browser = await puppeteer.launch(browserconfig);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto("https://accounts.google.com/");
  await page.waitForSelector("#identifierId");
  await page.type("#identifierId", config.usernamegoogle, { delay: 100 });
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
  await page.type("input", config.passwordgoogle, { delay: 100 });
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

  console.log("=========== Start Commenting ==============")
  await page.waitForTimeout(7000);
  await page.goto("https://www.youtube.com/results?search_query=" + keyword);
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
        console.log("Gabisa Comment");
        await pages.close();
      } catch {
        await pages.waitForSelector("#simplebox-placeholder", {
          timeout: 30000,
        });

        await pages.evaluate(() => {
          function makeid(length) {
            var result = [];
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
              result.push(
                characters.charAt(Math.floor(Math.random() * charactersLength))
              );
            }
            return result.join("");
          }
          document.querySelector("#simplebox-placeholder").click();
          document.querySelector("div[id='contenteditable-root']").innerHTML =
           "Hello Subscribe my channel";
          console.log(
            document.querySelector("div[id='contenteditable-root']").innerHTML
          );
        });
        pages.keyboard.press("Enter");
        await pages.evaluate(() => {
          document.querySelector("#submit-button").click();
        });
        await page.waitForTimeout(4000);
        await pages.close();
        console.log("Sukses Comment");
      }
    } catch {
      await pages.close();
      console.log("Gabisa Dibuka link ytnya");
    }
  }

  console.log("Sudah Comment ke semua Video !");

  await page.close();
  process.exit();
}


startApp();
