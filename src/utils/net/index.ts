import axios from 'axios';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import cliProgress from 'cli-progress';
import unzipper from 'unzipper';  // Import unzipper for extracting zip files
import path from 'path';
import mkdirp from 'mkdirp';

const streamPipeline = promisify(pipeline);

export default class Downloader {
    path;
    url;

    constructor(path) {
        this.path = path; 
        this.url = "https://github.com/imtaqin/YOMEN/releases/download/v1/bin.zip";
    }

    async downloadFromUrl() {
        try {
            console.log(`Downloading from: ${this.url} ⎛⎝ ≽ > ⩊ < ≼ ⎠⎞`);
            const { headers } = await axios.head(this.url);
            const totalSize = parseInt(headers['content-length'], 10) || 0;

            const progressBar = new cliProgress.SingleBar({
                format: 'Progress | {bar} | {percentage}% | {value}/{total} bytes',
                barCompleteChar: '=',
                barIncompleteChar: ' ',
                hideCursor: true
            });

            progressBar.start(totalSize, 0);

            const response = await axios({
                method: 'get',
                url: this.url,
                responseType: 'stream'
            });

            let downloadedSize = 0;
            response.data.on('data', (chunk) => {
                downloadedSize += chunk.length;
                progressBar.update(downloadedSize);
            });

            await streamPipeline(response.data, fs.createWriteStream(this.path));

            progressBar.stop();
            console.log(`Download complete: ${this.path}`);

            await this.unzipFile();

        } catch (error) {
            console.error(`Download failed: ${error.message}`);
        }
    }

    async unzipFile() {
        const outputDir = path.join(path.dirname(this.path), 'driver');

        try {
            console.log(`Unzipping to: ${outputDir}`);

            await mkdirp(outputDir);
            await fs.createReadStream(this.path)
                .pipe(unzipper.Extract({ path: outputDir }))
                .promise();

            console.log('Unzipping complete!');
        } catch (error) {
            console.error(`Unzipping failed: ${error.message}`);
        }
    }
}


