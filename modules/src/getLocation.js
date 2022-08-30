const axios = require('axios');
const geoip = require('geoip-lite');
const format = require('date-format');
async function getLocation() {
    const lokasi = await axios.get('https://ipinfo.io/ip')
    var geo = geoip.lookup(lokasi.data);
    var date = format('yyyy/MM/dd hh:mm:ss', new Date());
    return geo.city + ', ' + geo.country;

}

module.exports = {
    getLocation
}