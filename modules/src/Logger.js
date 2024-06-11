const fs = require('fs');

class Logger {
  constructor() {}

  log(path, user, link, status, error = null) {
    const exist = fs.existsSync(path);

    if (!exist) {
      fs.writeFileSync(path, "");
    }
    const date = new Date().toLocaleTimeString();
    const err = error ? " | Error: " + error : "";
    const log = `[${date}] | User: ${user} | Link: ${link} | Status: ${status}${err}`;

    fs.writeFileSync(path, log + "\n", { flag: 'a' });
    return;
  }
}

module.exports = new Logger();
