const cheerio = require('cheerio');
const request = require('axios');
const { default: axios } = require('axios');

module.exports = {
    getQuotes: async (input) => {
        const body = await axios.get('https://jagokata.com/kata-bijak/kata-' + input.replace(/\s/g, '_') + '.html?page=1');
        const $ = cheerio.load(body.data)
        data = []
        $('div[id="main"]').find('ul[id="citatenrijen"] > li').each(function (index, element) {
            x = $(this).find('div[class="citatenlijst-auteur"] > a').text().trim()
            y = $(this).find('span[class="auteur-beschrijving"]').text().trim()
            z = $(element).find('q[class="fbquote"]').text().trim()
            data.push({ author: x, bio: y, quote: z })
        })
      
        //remove empty quotes
        let arrayfilter = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].quote !== '') {
                arrayfilter.push(data[i]);
            }
         
        }
        return arrayfilter;
    }
}