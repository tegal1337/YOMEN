import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
    uploadDir
}