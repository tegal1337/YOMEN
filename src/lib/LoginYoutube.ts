import { getEnv } from "#config/index";
import { delay } from "#utils/delay";
import Logger from "#utils/Logger";
import { randomDelay, randomNumber } from "#utils/randomDelay";
import { SessionDB } from "models";
import { Page } from "puppeteer";

export default class LoginYoutube {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async login(): Promise<boolean | void> {
        try {
            Logger.info('Setting up browser headers and user agent...');
            await this.setupBrowserConfig();
            
            if (await this.isAlreadyLoggedIn()) {
                return true;
            }
            
            await this.navigateToLoginPage();
            await this.enterCredentials();
            
            if (await this.checkForLoginErrors()) {
                await delay(5000);
                await this.page.browser().close();
                return;
            }
            
            return await this.verifyLogin();
        } catch (error) {
            Logger.error(`Unexpected error during login: ${error.message}`);
            await delay(5000);
            await this.page.browser().close();
        }
    }
    
    private async setupBrowserConfig(): Promise<void> {
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        });
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    }
    
    private async isAlreadyLoggedIn(): Promise<boolean> {
        Logger.info('Checking if already logged in...');
        try {
            await this.page.goto('https://myaccount.google.com/personal-info?pli=1', {
                waitUntil: 'networkidle0',
            });
            
            await this.page.waitForFunction(() => {
                const textToFind = ['Basic info', 'Info dasar'];
                return Array.from(document.querySelectorAll('*'))
                    .some(element => textToFind.some(text => element?.textContent?.includes(text)));
            }, { timeout: 5000 });
            
            Logger.success('Already logged in.');
            await this.updateSessionStatus('success');
            return true;
        } catch (error) {
            Logger.warn('User not logged in. Proceeding to login...');
            return false;
        }
    }
    
    private async navigateToLoginPage(): Promise<void> {
        Logger.info('Navigating to Google Login Page...');
        const loginUrl = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F%253FthemeRefresh%253D1&ec=65620&hl=en&ifkv=AeZLP9_9zvAmir7Pg7TsXbdot1JS1Aihdz4-s09f1W0AHcGAlUl7JArUSY0p8rHx3W1azNTqcUtbfg&passive=true&service=youtube&uilel=3&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-99093102%3A1736179702641005&ddm=1";
        await this.page.goto(loginUrl);
    }
    
    private async enterCredentials(): Promise<void> {
        Logger.info('Typing username...');
        const usernameSelector = '#identifierId';
        await this.page.waitForSelector(usernameSelector, { visible: true, timeout: 10000 });
        await this.page.type(usernameSelector, getEnv('USERNAME_GOOGLE'), { delay: randomNumber(100, 300) });
        await this.page.keyboard.press('Enter');
        await randomDelay(1000, 2000);
        
        Logger.info('Typing password...');
        const passwordSelector = 'input[type="password"]';
        await this.page.waitForSelector(passwordSelector, { visible: true, timeout: 10000 });
        await this.page.type(passwordSelector, getEnv('PASSWORD_GOOGLE'), { delay: randomNumber(100, 300) });
        await this.page.keyboard.press('Enter');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
    
    private async checkForLoginErrors(): Promise<boolean> {
        const errorSelector = 'span[jsname="B34EJ"]';
        const errorElement = await this.page.waitForSelector(errorSelector, { visible: true, timeout: 5000 }).catch(() => null);
        
        if (errorElement) {
            const errorMessage = await this.page.$eval(errorSelector, (el) => el.textContent?.trim() || 'Unknown error');
            Logger.error(`Login failed: ${errorMessage}`);
            return true;
        }
        
        return false;
    }
    
    private async verifyLogin(): Promise<boolean> {
        Logger.info('Verifying successful login...');
        await this.page.goto('https://myaccount.google.com/personal-info?pli=1', { waitUntil: 'networkidle0' });
        
        await this.page.waitForFunction(() => {
            const textToFind = ['Basic info', 'Info dasar'];
            return Array.from(document.querySelectorAll('*'))
                .some(element => textToFind.some(text => element?.textContent?.includes(text)));
        }, { timeout: 5000 });
        
        Logger.success('Login successful! Redirecting to dashboard...');
        await this.updateSessionStatus('success');
        return true;
    }
    
    private async updateSessionStatus(status: string): Promise<void> {
        const username = getEnv('USERNAME');
        const sessionDir = getEnv('SESSION_DIR_' + username);
        await SessionDB.upsert({ username, sessionDir, login_status: status });
    }
}