import { getEnv } from "#config/index";
import { delay } from "#utils/delay";
import Logger from "#utils/Logger";
import { randomDelay, randomNumber } from "#utils/randomDelay";
import scrollToBottom from "#utils/scrollToBottom";
import { CommentDB } from "models";
import type { Page } from "puppeteer";
import type { searchParam } from "#types/index";
import { collectLinks } from "#utils/videos/collectLinks";

Logger.banner("🚀 Starting YOMEN Application...");

export default class YOMEN {
 
  private page: Page;

  constructor(pages: Page) {
    this.page = pages;
  }

  async searchKeyword(param: searchParam, sortBy: string = "relevance"): Promise<string[] | any> {
    const keyword = param;
    console.log(keyword);
    if (typeof keyword !== "string") {
      Logger.error("Invalid keyword type. Expected a string.");
      return;
    }
    let sortOption;
    switch (sortBy) {
      case "relevance":
        sortOption = "&sp=CAASAhAB";
        break;
      case "date":
        sortOption = "&sp=CAI%253D";
        break;
      case "viewCount":
        sortOption = "&sp=CAMSAhAB";
        break;
      case "rating":
        sortOption = "&sp=CAESAhAB";
        break;
      default:
        sortOption = "&sp=CAASAhAB";
        break;
    }

    try {
      Logger.info(`Navigating to YouTube search results for: "${keyword}"`);
      await this.page.goto(
        "https://www.youtube.com/results?search_query=" + encodeURIComponent(keyword) + sortOption,
      );

      Logger.info("Scrolling to the bottom of the search results page...");
      await scrollToBottom(this.page);

      Logger.info("Waiting for video results to load...");
      await this.page.waitForSelector("ytd-video-renderer");

      Logger.info("Collecting video links...");
      const videoLinks: string[] = await collectLinks(this.page);

      Logger.success(`Collected ${videoLinks.length} video links.`);

      const convertedUrls = videoLinks.map((url) =>
        url.replace(
          /^https:\/\/www\.youtube\.com\/shorts\/([\w-]+)/,
          "https://www.youtube.com/watch?v=$1",
        ),
      );
      return convertedUrls;
    } catch (error) {
      Logger.error(`Failed to search keyword: ${(error as Error).message}`);
    }
  }

  async getTrendingVideos(): Promise<string[] | any> {
   await this.page.goto("https://www.youtube.com/feed/trending");
   Logger.info("Scrolling to the bottom of the search results page...");
      await scrollToBottom(this.page);

      Logger.info("Waiting for video results to load...");
      await this.page.waitForSelector("ytd-video-renderer");

      Logger.info("Collecting video links...");
      const videoLinks: string[] = await collectLinks(this.page);

      Logger.success(`Collected ${videoLinks.length} video links.`);

      const convertedUrls = videoLinks.map((url) =>
        url.replace(
          /^https:\/\/www\.youtube\.com\/shorts\/([\w-]+)/,
          "https://www.youtube.com/watch?v=$1",
        ),
      );
      return convertedUrls;
}

  
  async collectAllComments(): Promise<string[]> {
    Logger.info("Starting to collect comments from the video...");
    return await this.page.evaluate(() => {
      const comments = new Set<string>();

      return new Promise<string[]>((resolve) => {
        let lastScrollHeight = document.body.scrollHeight;
        let attempts = 0;
        const maxAttempts = 10;
        const interval = 2400;

        const timer = setInterval(() => {
          window.scrollBy(0, window.innerHeight);

          document
            .querySelectorAll(
              "span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap",
            )
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

 
  async goToVideo(videoLink: string, commentType = "random", manual = "false"): Promise<void> {
    try {
      console.log(videoLink, commentType, manual);
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
        case "random":
          await this.randomComment(videoLink);
          break;
        case "ai":
          await this.aiComment(videoLink);
          break;
          case "copy":
            await this.randomComment(videoLink);
            break;
        case "direct":
          await this.directComment(videoLink, manual);
          break;
        default:
          await this.randomComment(videoLink);
          break;
      }
   
      await delay(5000);
    } catch (e) {
      await CommentDB.create({
        username: getEnv("USERNAME"),
        video_url: videoLink,
        comment_status: "failed",
        comment: (e as Error).message,
      })
      Logger.error(`Failed to interact with the video: ${(e as Error).message}`);
    }
  }


  async directComment(videoLink: string, comments) {
    console.log(comments);
    await this.page.waitForSelector("#simple-box", {
      visible: true,
      timeout: randomNumber(5000, 10000),
    });
    await this.page.evaluate(() => {
      const commentBox = document.querySelector("#simple-box");
      if (commentBox) {
        commentBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
 
    await this.page.waitForSelector("#contenteditable-root", {
      visible: true,
      timeout: randomNumber(5000, 10000),
    });
    await this.page.click("#contenteditable-root");
    await this.page.type("#contenteditable-root",comments );

    Logger.info("Submitting the comment...");
    await this.page.keyboard.press("Enter");

    Logger.success("Comment posted successfully!");
    await this.page.click(
      "#submit-button > yt-button-shape > button > yt-touch-feedback-shape > div",
    );
    await CommentDB.create({
      username: getEnv("USERNAME"),
      video_url: videoLink,
      comment_status: "failed",
      comment: comments,
    })
  }

  async randomComment(videoLink){
    Logger.info("Collecting all comments from the video...");
    const comments = await this.collectAllComments();

    if (comments.length === 0) {
      Logger.warn("No comments found on this video.");
      return;
    }

    Logger.success(`Collected ${comments.length} comments.`);

    const randomComment =
      comments[Math.floor(Math.random() * comments.length)];
    Logger.info(`Random comment selected: "${randomComment}"`);

    Logger.info("Scrolling to the comment input box...");
    await this.page.waitForSelector("#simple-box", {
      visible: true,
      timeout: await randomNumber(5000, 10000),
    });
    await this.page.evaluate(() => {
      const commentBox = document.querySelector("#simple-box");
      if (commentBox) {
        commentBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    Logger.info("Clicking on the comment box...");
    await this.page.waitForSelector("#placeholder-area", {
      visible: true,
      timeout: await randomNumber(5000, 10000),
    });
    await this.page.click("#placeholder-area");

    Logger.info("Waiting for the text input box to be ready...");
    await this.page.waitForSelector("#contenteditable-root", {
      visible: true,
      timeout: await randomNumber(5000, 10000),
    });

    Logger.info("Typing the selected random comment...");
    await this.page.type("#contenteditable-root", randomComment);

    Logger.info("Submitting the comment...");
    await this.page.keyboard.press("Enter");

    Logger.success("Comment posted successfully!");
    await this.page.click(
      "#submit-button > yt-button-shape > button > yt-touch-feedback-shape > div",
    );

    await CommentDB.create({
      username: getEnv("USERNAME"),
      video_url: videoLink,
      comment_status: "success",
      comment: randomComment,
    });
  }

  async aiComment(videoLink){
    Logger.info("Collecting all comments from the video...");
    const comments = await this.collectAllComments();

    if (comments.length === 0) {
      Logger.warn("No comments found on this video.");
      return;
    }
  }
}
