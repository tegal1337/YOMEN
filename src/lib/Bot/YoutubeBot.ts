// src/lib/Bot/YoutubeBot.ts
import { getEnv } from "#config/index";
import { delay } from "#utils/delay";
import Logger from "#utils/Logger";
import scrollToBottom from "#utils/scrollToBottom";
import { CommentDB } from "models";
import type { Page } from "puppeteer";
import { URLS, SORT_OPTIONS } from "#constants/youtubeSelectors";
import { 
    collectVideoLinks, 
    scrollToCommentBox, 
    collectComments, 
    submitComment 
} from "#utils/youtubeUtils";

export default class YOMEN {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchKeyword(keyword: string, sortBy: string = "relevance"): Promise<string[]> {
        if (typeof keyword !== "string") {
            Logger.error("Invalid keyword type. Expected a string.");
            return [];
        }

        const sortOption = SORT_OPTIONS[sortBy.toUpperCase()] || SORT_OPTIONS.RELEVANCE;

        try {
            Logger.info(`Navigating to YouTube search results for: "${keyword}"`);
            await this.page.goto(URLS.SEARCH_BASE + encodeURIComponent(keyword) + sortOption);

            Logger.info("Scrolling to the bottom of the search results page...");
            await scrollToBottom(this.page);

            return await collectVideoLinks(this.page);
        } catch (error) {
            Logger.error(`Failed to search keyword: ${(error as Error).message}`);
            return [];
        }
    }

    async getTrendingVideos(): Promise<string[]> {
        try {
            await this.page.goto(URLS.TRENDING);
            Logger.info("Scrolling to the bottom of the trending page...");
            await scrollToBottom(this.page);

            return await collectVideoLinks(this.page);
        } catch (error) {
            Logger.error(`Failed to get trending videos: ${(error as Error).message}`);
            return [];
        }
    }

    async goToVideo(videoLink: string, commentType = "random", manualComment = ""): Promise<void> {
        try {
            const exist = await CommentDB.findOne({
                where: {
                    username: getEnv("USERNAME"),
                    video_url: videoLink,
                },
            });

            if (exist) {
                Logger.info(`Comment already exists for video: ${videoLink}`);
                return;
            }

            Logger.info(`Navigating to video page: ${videoLink}`);
            await this.page.goto(videoLink);
            
            switch (commentType) {
                case "ai":
                    await this.aiComment(videoLink);
                    break;
                case "copy":
                    await this.randomComment(videoLink);
                    break;
                case "direct":
                    await this.directComment(videoLink, manualComment);
                    break;
                case "csv":
                    await this.csvComment(videoLink);
                    break;
                default:
                    await this.randomComment(videoLink);
                    break;
            }
       
            await delay(5000);
        } catch (error) {
            await this.saveCommentStatus(videoLink, "failed", (error as Error).message);
            Logger.error(`Failed to interact with the video: ${(error as Error).message}`);
        }
    }

    private async saveCommentStatus(videoLink: string, status: string, commentText: string): Promise<void> {
        await CommentDB.create({
            username: getEnv("USERNAME"),
            video_url: videoLink,
            comment_status: status,
            comment: commentText,
        });
    }

    async directComment(videoLink: string, commentText: string): Promise<void> {
        if (!commentText) {
            Logger.error("Comment text is empty");
            return;
        }

        await scrollToCommentBox(this.page);
        await submitComment(this.page, commentText);
        await this.saveCommentStatus(videoLink, "success", commentText);
    }

    async randomComment(videoLink: string): Promise<void> {
        const comments = await collectComments(this.page);

        if (comments.length === 0) {
            Logger.warn("No comments found on this video.");
            return;
        }

        Logger.success(`Collected ${comments.length} comments.`);

        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        Logger.info(`Random comment selected: "${randomComment}"`);

        await scrollToCommentBox(this.page);
        await submitComment(this.page, randomComment);
        await this.saveCommentStatus(videoLink, "success", randomComment);
    }

    async aiComment(videoLink: string): Promise<void> {
        // Placeholder for AI comment implementation
        Logger.info("AI comment feature coming soon...");
        
        // For now, fall back to random comment
        await this.randomComment(videoLink);
    }
    
    async csvComment(videoLink: string): Promise<void> {
        // Placeholder for CSV comment implementation
        Logger.info("CSV comment feature coming soon...");
        
        // For now, fall back to random comment
        await this.randomComment(videoLink);
    }
}