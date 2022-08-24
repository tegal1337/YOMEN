var lokasi = require("./modules/src/quoteIndo");

(async () => {
console.log(await lokasi.getQuotes("acak"));
})();