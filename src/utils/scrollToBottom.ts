export default async function scrollToBottom(pages,attempts = 10, maxAttempts = 30, interval = 500) {

    await pages.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let lastScrollHeight = document.body.scrollHeight;
            let attempts = 10;
            const maxAttempts = 30;
            const interval = 500; 

            const timer = setInterval(() => {
                window.scrollBy(0, window.innerHeight); 
                if (document.body.scrollHeight > lastScrollHeight) {
                    lastScrollHeight = document.body.scrollHeight; 
                    attempts = 0; 
                } else {
                    attempts++;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    });
}