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

async function getSearchPreferences() {
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

// Update your main function
async function main() {
    Logger.divider();
    Logger.banner(banner);
    Logger.divider();
 
    const preferences = await getSearchPreferences();
    const browser = new LaunchBrowser(getEnv('USERNAME'));
    await browser.init();

    const pages = await browser.page;
    const login = new LoginYoutube(pages);
    if(!login) await login.login();
   
    const yomen = new YOMEN(pages);

    let urls: string[];
    if (preferences.searchType === 'trending') {
        urls = await yomen.getTrendingVideos(); // You'll need to implement this method
    } else {
        Logger.info(`Searching for keyword: ${preferences.keyword}`);
        urls = await yomen.searchKeyword(preferences.keyword, preferences.sortBy);
    }

    for (const url of urls) {
        Logger.info(`Navigating to video: ${url}`);
        console.log(preferences)
        if (preferences.commentType === 'ai') {
            await yomen.goToVideo(url, 'ai');
        
        } else if (preferences.commentType === 'copy') {
            await yomen.goToVideo(url, 'copy');
        } 
        else if (preferences.commentType === 'manual' && preferences.manualCommentType === 'csv') {
            await yomen.goToVideo(url, 'csv');
        
        } else if(preferences.commentType === 'manual' && preferences.manualCommentType === 'direct') {
            await yomen.goToVideo(url, 'direct', preferences.comment);
        }
        
        await randomDelay(5000, 10000);
    }

    Logger.info('Process completed');
}
 
async function init() {
    initialize();
    const zipFilePath = './bin.zip';
    const driverFolderPath = './driver';

    // Check if the driver folder exists and is not empty
    if (fs.existsSync(driverFolderPath) && fs.readdirSync(driverFolderPath).length > 0) {
        Logger.info('Driver files already exist. Skipping download.');
        await main();  // Proceed to the main process
    } else {
        // Check if the zip file exists
        if (fs.existsSync(zipFilePath)) {
            Logger.info('Zip file already exists. Skipping download.');
            const downloader = new Downloader(zipFilePath);
            await downloader.unzipFile();  // Only unzip if the zip exists
        } else {
            Logger.info('Downloading driver files...');
            const downloader = new Downloader(zipFilePath);
            await downloader.downloadFromUrl();  // Download and unzip
        }
        await main();  // Proceed to the main process after ensuring drivers are ready
    }
}
init();
function generateAIComment(url: string) {
    throw new Error('Function not implemented.');
}

