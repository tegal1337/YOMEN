import 'module-alias/register';
import { LaunchBrowser } from '#lib/Browser';
import LoginYoutube from '#lib/LoginYoutube';
import Logger from '#utils/Logger';
import { banner } from '#utils/banner';
import { randomDelay } from '#utils/randomDelay';
import inquirer from 'inquirer';
import { getEnv } from './config';
import { initialize } from 'models';
import Downloader from '#utils/net';
import fs from 'fs';
import path from 'path';
import YOMEN from '#lib/Bot/YoutubeBot';
import { SearchPreferences } from '#types/index';

async function getSearchPreferences(): Promise<SearchPreferences> {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'searchType',
            message: '🔍 How would you like to discover videos?',
            choices: [
                { name: '🔎 Search by keyword', value: 'keyword' },
                { name: '🔥 Browse trending page', value: 'trending' }
            ]
        },
        {
            type: 'input',
            name: 'keyword',
            message: '✨ Enter your search keyword:',
            when: (answers) => answers.searchType === 'keyword',
            validate: (input: string) => input.trim() ? true : '❌ Keyword cannot be empty'
        },
        {
            type: 'list',
            name: 'sortBy',
            message: '📊 How should we sort the results?',
            when: (answers) => answers.searchType === 'keyword',
            choices: [
                { name: '🆕 Newest first', value: 'date' },
                { name: '🌟 Most popular', value: 'viewCount' },
                { name: '🎯 Most relevant', value: 'relevance' }
            ]
        },
        {
            type: 'list',
            name: 'commentType',
            message: '💭 How would you like to comment?',
            choices: [
                { name: '🤖 Generate AI comments', value: 'ai' },
                { name: '📝 Copy Comments From Comments', value: 'copy' },
                { name: '✍️  Manual comments', value: 'manual' }
            ]
        },
        {
            type: 'list',
            name: 'manualCommentType',
            message: '📝 Choose your comment source:',
            when: (answers) => answers.commentType === 'manual',
            choices: [
                { name: '📄 Load from CSV file', value: 'csv' },
                { name: '⌨️  Type directly', value: 'direct' }
            ]
        },
        {
            type: 'input',
            name: 'comment',
            message: '✨ Enter your comment:',
            when: (answers) => answers.commentType === 'manual' && answers.manualCommentType === 'direct',
            validate: (input: string) => input.trim() ? true : '❌ Comment cannot be empty'
        }
    ]);
}

async function processVideos(yomen: YOMEN, urls: string[], preferences: SearchPreferences): Promise<void> {
    for (const url of urls) {
        Logger.info(`Navigating to video: ${url}`);
        
        const commentType = preferences.commentType;
        if (commentType === 'manual' && preferences.manualCommentType === 'direct') {
            await yomen.goToVideo(url, 'direct', preferences.comment);
        } else {
            const mode = commentType === 'manual' ? preferences.manualCommentType : commentType;
            await yomen.goToVideo(url, mode);
        }
        
        await randomDelay(5000, 10000);
    }
}

async function getVideoUrls(yomen: YOMEN, preferences: SearchPreferences): Promise<string[]> {
    if (preferences.searchType === 'trending') {
        return await yomen.getTrendingVideos();
    } else if (preferences.keyword) {
        Logger.info(`Searching for keyword: ${preferences.keyword}`);
        return await yomen.searchKeyword({ keyword: preferences.keyword }, preferences.sortBy);
    }
    return [];
}

async function ensureDriverExists(): Promise<void> {
    const zipFilePath = './bin.zip';
    const driverFolderPath = './driver';
    
    if (fs.existsSync(driverFolderPath) && fs.readdirSync(driverFolderPath).length > 0) {
        Logger.info('Driver files already exist. Skipping download.');
        return;
    }
    
    const downloader = new Downloader(zipFilePath);
    
    if (fs.existsSync(zipFilePath)) {
        Logger.info('Zip file already exists. Skipping download.');
        await downloader.unzipFile();
    } else {
        Logger.info('Downloading driver files...');
        await downloader.downloadFromUrl();
    }
}

async function main(): Promise<void> {
    Logger.divider();
    Logger.banner(banner);
    Logger.divider();
 
    const preferences = await getSearchPreferences();
    const browser = new LaunchBrowser(getEnv('USERNAME'));
    await browser.init();

    const page = await browser.page;
    const login = new LoginYoutube(page);
    await login.login();
   
    const yomen = new YOMEN(page);
    const urls = await getVideoUrls(yomen, preferences);
    
    if (urls.length === 0) {
        Logger.warn('No videos found. Exiting...');
        return;
    }
    
    await processVideos(yomen, urls, preferences);
    Logger.info('Process completed');
}
 
async function init(): Promise<void> {
    try {
        initialize();
        await ensureDriverExists();
        await main();
    } catch (error) {
        Logger.error(`Application error: ${error.message}`);
        process.exit(1);
    }
}

init();