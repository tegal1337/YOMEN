"use strict";

/**
 * Generate Random User Agent
 * Example: Mozilla/5.0 (X11; Linux x86_64; rv:110.0) Gecko/20100101 Firefox/110.0
 * @author fdciabdul
 * @date 2023-02-08
 * @returns {any}
 */
module.exports = {
  UA: function () {
    let agent = [
      "Mozilla/5.0 (X11; Linux x86_64; en-US; rv:110.0) Gecko/20161401 Firefox/110.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; rv:112.0) Gecko/20100101 Firefox/112.0/j5hg1lrPIFtn2H",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5385.99 Safari/537.36",
      "Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5410.179 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5369.190 Safari/537.36 OPR/92.0.4395.174",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5398.168 Safari/537.36 OPR/93.0.4065.40",
    ];
    return agent[Math.floor(Math.random() * agent.length)];
  },
};
