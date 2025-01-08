// logger.js
import chalk from 'chalk';

export default class Logger {
  static logTime() {
    return chalk.dim(`[${new Date().toLocaleTimeString()}]`);
  }

  static info(message) {
    console.log(
      `${this.logTime()} ${chalk.bold.blue('❯ ')} ${chalk.blueBright(message)}`
    );
  }

  static warn(message) {
    console.log(
      `${this.logTime()} ${chalk.bold.yellow('⚠ ')} ${chalk.yellowBright(message)}`
    );
  }

  static error(message) {
    console.log(
      `${this.logTime()} ${chalk.bold.red('✖ ')} ${chalk.redBright(message)}`
    );
  }

  static success(message) {
    console.log(
      `${this.logTime()} ${chalk.bold.green('✔ ')} ${chalk.greenBright(message)}`
    );
  }

  static custom(label, color, icon, message) {
    console.log(
      `${this.logTime()} ${chalk.hex(color).bold(`${icon} ${label}`)} ${chalk.hex(color)(message)}`
    );
  }

  static divider() {
    console.log(
      chalk.dim('────────────────────────────────────────────────────')
    );
  }

  static banner(text) {
    console.log(
      chalk.whiteBright.bold(` ${text} `)
    );
  }
}
