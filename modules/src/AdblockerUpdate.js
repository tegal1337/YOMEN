const axios = require('axios');
const fs = require('fs');
const zl = require("zip-lib");
const fsExtra = require('fs-extra');
const path = require('path');

async function uBlockOriginDownloader() {
    const releasesUrl = 'https://api.github.com/repos/gorhill/uBlock/releases/latest';
    try {
        const response = await axios.get(releasesUrl);
        const assets = response.data.assets;
        if (assets && assets.length > 0) {
            const downloadUrl = assets[0].browser_download_url;
            const fileName = assets[0].name;
            logInfo(`Downloading ${fileName} ...`);
            const downloadResponse = await axios.get(downloadUrl, {
              responseType: 'stream'
            });
  
            const writer = fs.createWriteStream(fileName);
            
            const downloadPromise = new Promise((resolve, reject) => {
                downloadResponse.data.pipe(writer);
                writer.on('finish', async () => {
                    logSuccess(`Downloaded ${fileName} successfully!`);
                    const unzip = await unzipFile(fileName);
                    resolve(unzip);
                });
                writer.on('error', (error) => {
                    logError(`Error writing file: ${error}`);
                    reject(false);
                });
            });
            
            return await downloadPromise;
        } else {
            logError('No assets found for the latest release.');
            return false;
        }
    } catch (error) {
        logError(`Failed to fetch the latest release: ${error.message}`);
        return false;
    }
  }
  
  async function unzipFile(filePath) {
    const tempDir = './temp_unzipped_content';
  
    const unzip = new zl.Unzip({
        onEntry: function (event) {
            logInfo(`Extracting ${event.entryCount}: ${event.entryName}`);
        }
    });
  
    try {
        await unzip.extract(filePath, tempDir);
        logSuccess('File unzipped to temporary location!');
        const subdirs = fs.readdirSync(tempDir).filter(subdir => fs.statSync(path.join(tempDir, subdir)).isDirectory());
        if (subdirs.length > 0) {
            const mainSubdir = path.join(tempDir, subdirs[0]);
            const finalDir = './ublock';
  
            // Remove the final directory if it exists
            if (fs.existsSync(finalDir)) {
                fsExtra.removeSync(finalDir);
            }
  
            // Move the content from the main subdirectory to the final directory
            await fsExtra.move(mainSubdir, finalDir);
            fsExtra.removeSync(tempDir);
            logSuccess('Content moved to final location!');
            return true;
        } else {
            logError('No subdirectories found. Content remains in the temporary location.');
            return false;
        }
    } catch (err) {
        logError(`Error during unzip or move operation: ${err.message}`);
        return false;
    }
  }
  

function logInfo(message) {
  console.log('\x1b[34m%s\x1b[0m', message);  // Blue for info messages
}

function logSuccess(message) {
  console.log('\x1b[32m%s\x1b[0m', message);  // Green for success messages
}

function logError(message) {
  console.error('\x1b[31m%s\x1b[0m', message);  // Red for error messages
}


module.exports = {
    uBlockOriginDownloader
}