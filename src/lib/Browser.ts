import fs from "fs";
import path from "path";
import UndetectableBrowser from "undetected-browser";
import puppeteer, { Browser, Page } from "puppeteer";
import { setEnv } from "#config/index";
import { mkdirp } from 'mkdirp';
export class LaunchBrowser {
    public browser: Browser | null;
    public page: Page | null;
    public username: string;

    constructor(username: string) {
        this.username = username;
        this.browser = null;
        this.page = null;
    }

    /**
     * Initialize the browser with undetectable settings and a specific user session.
     */
    async init(): Promise<void> {
        const driverPath = path.resolve("driver");
        const sessionDir = path.resolve(`session/${this.username}`);
        await mkdirp(sessionDir);
  
        if (!fs.existsSync(driverPath) || fs.readdirSync(driverPath).length === 0) {
            throw new Error("The 'driver' folder is empty or does not exist. Please ensure the necessary files are present.");
        }

        const UndetectableBMS = new UndetectableBrowser(
            await puppeteer.launch({ 
                headless: false,
                executablePath: path.join(driverPath, "chrome.exe"),
                userDataDir: `session/${this.username}`,
                args: [
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
                    '--mute-audio',
                    '--no-zygote-forced',
                    '--no-zygote-forced-for-chrome',
                    '--disable-web-security',
                ],
            })
        );

        this.browser = await UndetectableBMS.getBrowser();
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1375, height: 3812 });
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36")
        setEnv(`SESSION_DIR_${this.username}`, `session/${this.username}`);
    }

    /**
     * Close the browser instance.
     */
    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
