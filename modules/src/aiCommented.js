"use strict";
/**
 * Create comments on social video platforms through AI simulation
 * @module createComments
 * @param {string} title - The title of the video on which you want to create the comment.
 * @param {any} pages
 * @param {any} spinners
 * @param {object} config - Object containing apiKey parameter
 * @returns {any}
 */
const { Configuration, OpenAIApi } = require("openai");

const createComments = async (pages, spinners, info, config) => {
  try {
    const configuration = new Configuration({
      apiKey: config.apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `simulate reply to this youtube video from channel ${info.channelName} with title "${info.title}" with natural emotion , 
     not like a bot , 
     dont act like you are suprised , 
     dont use wow

     please remind that he was have subscriber ${info.subscriberCount}  ,
     \n: `;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const comment = response.data.choices[0].message.content;
    await pages.keyboard.type(comment, { delay: 10 });
    await pages.waitForTimeout(100);
    await pages.keyboard.press("Enter");
    await pages.evaluate(() =>
      document.querySelector("#submit-button").click()
    );
    spinners.update("comment", { text: `Success ${comment}`, color: "blue" });
    await pages.waitForTimeout(5000);
  } catch (error) {
    console.error(`Cannot create comment!\n${error}`);
  }
};

module.exports = { createComments };
