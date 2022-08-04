module.exports = {
    copyComment: async (pages , spinners) => {
          let count = 1;
          let totalComments = [];
          await pages.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });
          await pages.waitForSelector("yt-formatted-string[id='content-text']", { visible: true });
          let comments = await pages.$$("yt-formatted-string[id='content-text']");

          for (let j of comments) {
            let comment = await pages.evaluate(function (ele) {
              return ele.textContent;
            }, j)
            totalComments.push(comment);
            count++;
          }
          spinners.update('comment', { text: 'i found so many comment , total :' + totalComments.length, color: 'blue' });
          await pages.evaluate(() => {
            window.scrollBy(0, -window.innerHeight * 2);
          });
        
          await pages.waitForTimeout(1000);
          var komenan = totalComments[Math.floor(Math.random() * totalComments.length)]
          spinners.update('comment', { text: "but we will use this one \n" + komenan, color: 'blue' });
          await pages.keyboard.type(komenan, { delay: 20 });
          await pages.waitForTimeout(100);
          await pages.keyboard.press("Enter");
          await pages.evaluate(() => {
            document.querySelector("#submit-button").click();
          });
        }
    }