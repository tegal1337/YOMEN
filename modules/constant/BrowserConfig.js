module.exports = {
  Config: function (paths, config , executablePath ){
    let data = {
      defaultViewport: null,
      // devtools: true,
      headless: false,
      args: [
        "--log-level=3", // fatal only
        "--no-default-browser-check",
        "--disable-infobars",
        "--disable-web-security",
        "--disable-site-isolation-trials",
        "--no-experiments",
        "--ignore-gpu-blacklist",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--mute-audio",
        "--disable-extensions",
        "--no-sandbox",

        "--no-first-run",
        "--no-zygote",
        `--disable-extensions-except=${paths}`,
        `--load-extension=${paths}`,
      ],

      userDataDir: config.userdatadir,
    };
    if (executablePath) {
      data.executablePath = executablePath;
    }
    return data;
  },
};
