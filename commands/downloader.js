const googleTTS = require("google-tts-api");
const { cmd } = require('../lib');

const tts = cmd({
    pattern: "tts",
    alias: ["ттс"],
    desc: "text to speech.",
    category: "downloader",
    filename: __filename,
    use: '<Hii,this is Secktor>',
},
async(Void, citel, text ) => {
    if (!text) return citel.reply('Используй .tts [мама я гей]')
    let texttts = text
    const ttsurl = googleTTS.getAudioUrl(texttts, {
        lang: "ru",
        slow: false,
        host: "https://translate.google.com",
    });
    return Void.sendMessage(citel.chat, {
        audio: {
            url: ttsurl,
        },
        mimetype: "audio/mpeg",
        fileName: `ttsCitelVoid.m4a`,
    }, {
        quoted: citel,
    });
});


const insta = cmd({
    pattern: "insta",
    alias: ["инста"],
    desc: "download instagram post.",
    category: "downloader",
    filename: __filename
},
async(Void, citel,text) => {
const { Insta } = require('../lib')

if(!text) return citel.reply('Дайте рабочую ссылку.')
let response = await Insta(text)
for (let i=0;i<response.length;i++) {
await Void.sendFileUrl(citel.chat, response[i], `*Загрузка,пожалуйста подождите...*`, citel)
}
});


module.exports = [ tts, insta ]