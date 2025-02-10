/**
 * Introduces a random delay between the specified minimum and maximum milliseconds.
 * @param min - Minimum delay in milliseconds.
 * @param max - Maximum delay in milliseconds.
 * @returns A promise that resolves after the random delay.
 */
export async function randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 * @param min - Minimum value.
 * @param max - Maximum value.
 * @returns A random integer between min and max.
 */
export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
