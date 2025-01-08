import Logger from "./Logger";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const randomDelay = async (min: number, max: number) => {
    Logger.info(`Delaying for ${Math.floor(Math.random() * (max - min + 1) + min)}ms...`);
    await delay(Math.floor(Math.random() * (max - min + 1) + min))
}