var lokasi = require("./modules/src/getLocation");

(async () => {
console.log(await lokasi.getLocation());
})();