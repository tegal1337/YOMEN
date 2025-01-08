import { getEnv } from "#config/index";
import { randomDelay,randomNumber } from "#utils/randomDelay";


export default class LoginYoutube {
    page: any;
    constructor(pages) {
        this.page = pages;
    }

    async login() {
        try {
            
            await this.page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            })
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
            await this.page.goto("https://myaccount.google.com/personal-info?pli=1",{
                waitUntil: 'networkidle0'
            })
            try {
                await this.page.waitForFunction(() => {
                    const textToFind = ['Basic info', 'Info dasar'];
                    return Array.from(document.querySelectorAll('*'))
                      .some(element => textToFind.some(text => element?.textContent?.includes(text)) as any);
                }, { timeout: 5000 });
                
               
                console.log('Login Success');
            } catch (error) {
             
            await this.page.goto("https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F%253FthemeRefresh%253D1&ec=65620&hl=en&ifkv=AeZLP9_9zvAmir7Pg7TsXbdot1JS1Aihdz4-s09f1W0AHcGAlUl7JArUSY0p8rHx3W1azNTqcUtbfg&passive=true&service=youtube&uilel=3&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-99093102%3A1736179702641005&ddm=1");

            const xp = '#identifierId';
            const el = await this.page.waitForSelector(xp, {
                visible: true,
                timeout: 10000
            });
            await randomDelay(1000, 2000);
            await el.type(getEnv('USERNAME_GOOGLE'), { delay: randomNumber(1000, 2000) });
            await this.page.keyboard.press('Enter');
            await randomDelay(1000, 2000);
            const xp2 = '#password';
            const el2 = await this.page.waitForSelector(xp2, {
                visible: true,
                timeout: 10000
            })

            await el2.click();
            await randomDelay(1000, 2000);
            await el2.type(getEnv('PASSWORD_GOOGLE'), { delay: randomNumber(1000, 2000) });

            await this.page.keyboard.press('Enter');
            await this.page.waitForNavigation();
            await this.page.goto("https://myaccount.google.com/personal-info?pli=1",{
                waitUntil: 'networkidle0'
            })
            try {
                await this.page.waitForFunction(() => {
                    const textToFind = ['Basic info', 'Info dasar'];
                    return Array.from(document.querySelectorAll('*'))
                      .some(element => textToFind.some(text => element?.textContent?.includes(text)) as any);
                }, { timeout: 5000 });
                
               
                console.log('Login Success');
            } catch (error) {
                console.log('Login Failed');
            }
        }
        } catch (error) {

        }
    }
}