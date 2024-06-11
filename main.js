

function readLog() {
  return fs.readFileSync('./logs/succesCommenting.log', 'utf8');
}

if (!fs.existsSync('./ublock')) {
  uBlockOriginDownloader().then(success => {
    if (success) {
      startApp(config, Config(paths, config, executablePath('chrome'), config.userdatadir));
    } else {
      console.log("Error downloading and extracting uBlock Origin.");
    }
  });
} else {
  startApp(config, Config(paths, config, executablePath('chrome'), config.userdatadir));
}
