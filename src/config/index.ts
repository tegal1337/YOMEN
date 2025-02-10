import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';
dotenv.config();
function getEnv(key: any) {
    return process.env[key];
}

function setEnv(key: string, value: string) {
    process.env[key] = value;
}

function getPort() {
    const port = getEnv('PORT_APP');
    return port ? parseInt(port) : 3000;
}

function getAppDataDir() {

    const homeDir = os.homedir();
    let appDataPath;
    if (process.platform === 'win32') {
        appDataPath = getEnv('APPDATA'); 
    } else if (process.platform === 'darwin') {
        appDataPath = path.join(homeDir, 'Library', 'Application Support');
    } else if (process.platform === 'linux') {
        appDataPath = path.join(homeDir, '.config');
    }
}
function uploadDir() {
    const uploadDir = path.join(__dirname, '..', '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return path.join(uploadDir);
}

export {
    getEnv,
    setEnv,
    getPort,
    uploadDir,
    getAppDataDir
}