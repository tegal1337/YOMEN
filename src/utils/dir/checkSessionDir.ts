import fs from 'fs';

export default class checkSessionDir {
    session: string;
    constructor(sessionDIr: string) {
        this.session = "session" ;
    }
    static async checkSessionDir(sessionDir: string) {
        if (!fs.existsSync(sessionDir)) {
            fs.readdirSync(sessionDir);
        }
    }
}