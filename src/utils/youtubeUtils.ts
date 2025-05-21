import { Page } from "puppeteer";
import { SELECTORS } from "../constants/youtubeSelectors";
import Logger from "#utils/Logger";
import scrollToBottom from "#utils/scrollToBottom";
import { randomNumber } from "#utils/randomDelay";

export async function collectVideoLinks(page: Page): Promise<string[]> {
    Logger.info("Waiting for video results to load...");
    await page.waitForSelector(SELECTORS.VIDEO_RENDERER);

    Logger.info("Collecting video links...");
    const videoLinks = await collectLinks(page);

    Logger.success(`Collected ${videoLinks.length} video links.`);

    return convertShortLinks(videoLinks);
}

export async function collectLinks(page: Page): Promise<string[]> {
    return page.evaluate(() => {
        const links: string[] = [];
        const videoElements = document.querySelectorAll('a#video-title, a#thumbnail');
        
        videoElements.forEach(element => {
            const href = element.getAttribute('href');
            if (href && 
                (href.includes('/watch?v=') || href.includes('/shorts/')) && 
                !links.includes('https://www.youtube.com' + href)) {
                links.push('https://www.youtube.com' + href);
            }
        });
        
        return links;
    });
}

export function convertShortLinks(videoLinks: string[]): string[] {
    return videoLinks.map(url =>
        url.replace(
            /^https:\/\/www\.youtube\.com\/shorts\/([\w-]+)/,
            "https://www.youtube.com/watch?v=$1"
        )
    );
}

export async function scrollToCommentBox(page: Page): Promise<void> {
    Logger.info("Scrolling to the comment input box...");
    await page.waitForSelector(SELECTORS.COMMENT_BOX, {
        visible: true,
        timeout: randomNumber(5000, 10000)
    });
    
    await page.evaluate(() => {
        const commentBox = document.querySelector("#simple-box");
        if (commentBox) {
            commentBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}

export async function collectComments(page: Page): Promise<string[]> {
    Logger.info("Starting to collect comments from the video...");
    return page.evaluate(() => {
        const comments = new Set<string>();

        return new Promise<string[]>((resolve) => {
            let lastScrollHeight = document.body.scrollHeight;
            let attempts = 0;
            const maxAttempts = 10;
            const interval = 2400;

            const timer = setInterval(() => {
                window.scrollBy(0, window.innerHeight);

                document.querySelectorAll(SELECTORS.COMMENTS)
                    .forEach((comment) => {
                        if (comment && comment.textContent) {
                            comments.add(comment.textContent.trim());
                        }
                    });

                if (document.body.scrollHeight > lastScrollHeight) {
                    lastScrollHeight = document.body.scrollHeight;
                    attempts = 0;
                } else {
                    attempts++;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(timer);
                    resolve(Array.from(comments));
                }
            }, interval);
        });
    });
}

export async function submitComment(page: Page, commentText: string): Promise<void> {
    Logger.info("Clicking on the comment box...");
    await page.waitForSelector(SELECTORS.PLACEHOLDER_AREA, {
        visible: true,
        timeout: randomNumber(5000, 10000)
    });
    await page.click(SELECTORS.PLACEHOLDER_AREA);

    Logger.info("Waiting for the text input box to be ready...");
    await page.waitForSelector(SELECTORS.COMMENT_INPUT, {
        visible: true,
        timeout: randomNumber(5000, 10000)
    });

    Logger.info("Typing the comment...");
    await page.type(SELECTORS.COMMENT_INPUT, commentText);

    Logger.info("Submitting the comment...");
    await page.keyboard.press("Enter");

    Logger.success("Comment posted successfully!");
    await page.click(SELECTORS.SUBMIT_BUTTON);
}