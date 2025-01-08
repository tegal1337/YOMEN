export async function randomDelay(min: number, max: number) {
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)))
}

export async function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}