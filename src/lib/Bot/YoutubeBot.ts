import { delay } from "#utils/delay";
import Logger from "#utils/Logger";
import scrollToBottom from "#utils/scrollToBottom";
import scrollToComment from "#utils/scrollToComments";

Logger.banner('🚀 Starting YOMEN Application...');

export default class YOMEN {
    page: any;

    constructor(pages) {
        this.page = pages;
    }

    /**
     * Search for a keyword on YouTube and return video links.
     * @param keyword - The keyword to search for.
     */
    async searchKeyword(keyword: string) {
        try {
            Logger.info(`Navigating to YouTube search results for: "${keyword}"`);
            await this.page.goto('https://www.youtube.com/results?search_query=' + keyword);

            Logger.info('Scrolling to the bottom of the search results page...');
            await scrollToBottom(this.page);

            Logger.info('Waiting for video results to load...');
            await this.page.waitForSelector('ytd-video-renderer');

            Logger.info('Collecting video links...');
            const videoLinks = await this.page.$$eval('ytd-video-renderer a#thumbnail', (anchors) => {
                return anchors.map(anchor => anchor.href).filter(href => href);
            });

            Logger.success(`Collected ${videoLinks.length} video links.`);

            const convertedUrls = videoLinks.map(url => url.replace(/^https:\/\/www\.youtube\.com\/shorts\/([\w-]+)/, 'https://www.youtube.com/watch?v=$1'));
            return convertedUrls;
        } catch (error) {
            Logger.error(`Failed to search keyword: ${error.message}`);
        }
    }

    /**
     * Collect all comments from a video page.
     */
    async collectAllComments() {
        Logger.info('Starting to collect comments from the video...');
        return await this.page.evaluate(async () => {
            const comments = new Set<string>();

            await new Promise<void>((resolve) => {
                let lastScrollHeight = document.body.scrollHeight;
                let attempts = 0;
                const maxAttempts = 20;
                const interval = 400;

                const timer = setInterval(() => {
                    window.scrollBy(0, window.innerHeight);

                    document.querySelectorAll(
                        'span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap'
                    ).forEach((comment) => {
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
                        resolve();
                    }
                }, interval);
            });

            return Array.from(comments);
        });
    }

    /**
     * Navigate to a video, collect comments, and post a random one.
     * @param videoLink - The URL of the video.
     */
    async goToVideo(videoLink: string) {
        try {
            Logger.info(`Navigating to video page: ${videoLink}`);
            await this.page.goto(videoLink);

            Logger.info('Collecting all comments from the video...');
            const comments = await this.collectAllComments();

            if (comments.length === 0) {
                Logger.warn('No comments found on this video.');
                return;
            }

            Logger.success(`Collected ${comments.length} comments.`);

            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            Logger.info(`Random comment selected: "${randomComment}"`);

            Logger.info('Scrolling to the comment input box...');
            await this.page.waitForSelector('#simple-box', { visible: true });
            await this.page.evaluate(() => {
                const commentBox = document.querySelector('#simple-box');
                if (commentBox) {
                    commentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            Logger.info('Clicking on the comment box...');
            await this.page.waitForSelector('#placeholder-area', { visible: true });
            await this.page.click('#placeholder-area');

            Logger.info('Waiting for the text input box to be ready...');
            await this.page.waitForSelector('#contenteditable-root', { visible: true });

            Logger.info('Typing the selected random comment...');
            await this.page.type('#contenteditable-root', randomComment);

            Logger.info('Submitting the comment...');
            await this.page.keyboard.press('Enter');

            Logger.success('Comment posted successfully!');
            await this.page.click("#submit-button > yt-button-shape > button > yt-touch-feedback-shape > div");
            await delay(5000);
        } catch (e) {
            Logger.error(`Failed to interact with the video: ${e.message}`);
        }
    }
}
