const fs = require('fs');

function Logger() {
  this.log = function (path ,user , link ,status , error = null) {
    const date = new Date();
    const time = date.toLocaleTimeString();
    const err = error ? " | Error : " + error : "";
    const log = "[" + time + "] " + "| User : "+ user + " " + "| Link : "+ link + " | Status : "+ status + err; 

    fs.writeFileSync(path, log + "\n", { flag: 'a' });
    return;
  };
}

module.exports = new Logger();