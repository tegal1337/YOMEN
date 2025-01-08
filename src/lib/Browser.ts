import UndetectableBrowser from "undetected-browser";
import puppeteer from "puppeteer";


export class LaunchBrowser {

    public browser: any;
    public page: any;

    constructor() {
        this.browser = null;
    }

    async init() {
        const UndetectableBMS = await new UndetectableBrowser(await puppeteer.launch({ 
            headless: false,
             executablePath: "bin/chrome.exe",
             userDataDir: "tmp",
             args : [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=SiteIsolation',
                '--disable-site-isolation-trials',
                '--no-default-browser-check',
                '--no-first-run',
                '--no-zygote',
                '--no-zygote-forced',
                '--no-zygote-forced-for-chrome',
                '--disable-web-security',
             ]
            }));
        this.browser = await UndetectableBMS.getBrowser();
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1375, height: 3812 });
    }

    async close() {
        await this.browser.close();
    }
}