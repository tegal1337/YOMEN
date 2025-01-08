export default async function scrollToComment(page) {
    // Scroll down incrementally until the comment box is in view
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let attempts = 0;
            const maxAttempts = 10; // Max scrolling attempts
            const interval = 500; // Time between scrolls in ms

            const timer = setInterval(() => {
                window.scrollBy(0, window.innerHeight); // Scroll down by one screen height
                attempts++;

                const commentBox = document.querySelector('#simple-box');
                if (commentBox && commentBox.getBoundingClientRect().top < window.innerHeight) {
                    // If the comment box is visible in the viewport, stop scrolling
                    clearInterval(timer);
                    resolve();
                }

                if (attempts >= maxAttempts) {
                    // Stop after max attempts
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    });

  
}
