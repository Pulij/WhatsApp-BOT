const axios = require('axios')
const fs = require('fs-extra')	
const path = require('path')	

let json = JSON.parse(fs.readFileSync('./replics/replay-wha-bot.json'));	

async function Insta(match) {
    const result = []
                    const form = {
                        url: match,
                        submit: '',
                    }
                    const { data } = await axios(`https://downloadgram.org/`, {
                        method: 'POST',
                        data: form
                    })
                    const $ = cheerio.load(data)
                    $('#downloadhere > a').each(function (a,b) {
                    const url = $(b).attr('href')
                    if (url) result.push(url)
                })
                return result
    }

    function getString(file) {	
        return json['STRINGS'][file];	
    }	

    function tlang() {	
        let LangG = getString("global");	
            return LangG	
          }	

module.exports = {
    Insta,
    tlang,
    getString
}