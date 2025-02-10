import Logger from "./Logger";

export const delay = (ms: number) => {
    const ms2sec = (ms / 1000).toFixed(2);
    Logger.info(`Delaying for ${ms2sec} second ...`);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const randomDelay = async (min: number, max: number) => {
    const randDelay = Math.floor(Math.random() * (max - min + 1) + min);
    const ms2sec = (randDelay / 1000).toFixed(2);
    await delay(randDelay)
}