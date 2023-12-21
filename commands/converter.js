//-----------------------------------------------------------------------------------
const { cmd } = require('../lib');
const googleTTS = require("google-tts-api");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const axios = require('axios')
const fs = require('fs')
const { exec } = require('child_process');

const trt = cmd({
    pattern: "trt",
    alias :['translate', 'перевод'],
    category: "misc",
    filename: __filename,
    desc: "Translate\'s given text in desird language.",
    use: '<text>',
},
async(Void, citel, text) => {

    if(!text && !citel.quoted) return await citel.reply(`*Please Give Me Text. Example: trt en Who are you_*`);
    const translatte = require("translatte");
    let lang = text ? text.split(" ")[0].toLowerCase() : 'ru';
    if (!citel.quoted)  { text = text.replace( lang , "");  }
    else { text = citel.quoted.text; }
    var whole = await translatte(text, { from:"auto",  to: lang , });
    if ("text" in whole) { return await citel.reply('*Переведенный текст на русский:*\n'+whole.text); }
})

//-----------------------------------------------------------------------------------
const tts = cmd({
    pattern: "tts",
    alias: ["ттс"],
    desc: "text to speech.",
    category: "downloader",
    filename: __filename,
    use: '<text>',
},
async(Void, citel, text, a ) => {

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
}

);
//---------------------------------------------------------------------------

const sticker = cmd({
    pattern: "sticker",
    alias: ["s", "стикер"],
    desc: "Makes sticker of replied image/video.",
    category: "group",
    use: '<reply to any image/video.>',
},
async(Void, citel, text, a) => {
    if (!citel.quoted) return citel.reply(`*Не работает это так,понял?*`);
    let mime = citel.quoted.mtype
    pack = 'пися'
    author = 'попа'
    if (citel.quoted) {
        let media = await citel.quoted.download();
        citel.reply("*Обработка вашего запроса...*");
        let sticker = new Sticker(media, {
            pack: pack, // The pack name
            author: author, // The author name
            id: "12345", // The sticker id
            quality: 75, // The quality of the output file
            background: "transparent", // The sticker background color (only for full stickers)
        });
        const buffer = await sticker.toBuffer();
        return Void.sendMessage(citel.chat, {sticker: buffer}, {quoted: citel });
    } else if (/video/.test(mime)) {
        if ((citel.quoted.msg || citel.quoted)
            .seconds > 20) return citel.reply("Длина видео не должна привышать *20 Секунд*");
        let media = await quoted.download();
        let sticker = new Sticker(media, {
            pack: pack, // The pack name
            author: author, // The author name
            type: StickerTypes.FULL, // The sticker type
            categories: ["🤩", "🎉"], // The sticker category
            id: "12345", // The sticker id
            quality: 70, // The quality of the output file
            background: "transparent", // The sticker background color (only for full stickers)
        });
        const stikk = await sticker.toBuffer();
        return Void.sendMessage(citel.chat, {  sticker: stikk   }, {    quoted: citel });
    } else {
        citel.reply("*Ошибка,попробуй ещё раз...*");
    }
}
)
 //--------------------Стикер в фото-------------------------------------------------------
 const photo = cmd({
    pattern: "sphoto",
    alias: ["сфото"],
    desc: "Makes a photo of the replied sticker.",
    category: "converter",
    use: '<reply to any sticker>',
    filename: __filename
},
async (Void, citel, text) => {
    const getRandom = (ext) => {
        return `${Math.floor(Math.random() * 10000)}${ext}`;
    }
    if (!citel.quoted) return citel.reply(`_Отметь стикер._`);
    let mime = citel.quoted.mtype;
    if (mime === "imageMessage" || mime === "stickerMessage") {
        try {
            let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
            let name = getRandom('.png');

            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${media} ${name}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            let buffer = fs.readFileSync(name);
            Void.sendMessage(citel.chat, { image: buffer }, { quoted: citel });

            fs.unlinkSync(name);
        } catch (error) {
            console.error('Error processing sticker:', error);
            citel.reply("_Произошла ошибка при обработке стикера._");
        }
    } else {
        citel.reply("```Я не могу делать фото из видео-стикеров=(```");
    }
});
 //----------------------------Украсть стикер-----------------------------------------------
 const steal = cmd({
    pattern: "steal",
    alias: ["украсть"],
    desc: "Makes sticker of replied image/video.",
    category: "sticker",
    filename: __filename,
},
async(Void, citel, text, a) => {

    if (!citel.quoted) return citel.reply(`*Не работает это так,понял?*`);
    let mime = citel.quoted.mtype
    var pack;
    var author;
    if (text) {
        anu = text.split("|");
        pack = anu[0] !== "" ? anu[0] : citel.pushName + '♥️';
        author = anu[1] !== "" ? anu[1] : Config.author;
    } else {
        pack = citel.pushName;
        author = "♥️";
    }
        let media = await citel.quoted.download();
        citel.reply("*Обработка вашего запроса...*");
       let sticker = new Sticker(media, {
           pack: pack, // The pack name
           author: author, // The author name
           id: "12345", // The sticker id
           quality: 75, // The quality of the output file
           background: "transparent", // The sticker background color (only for full stickers)
       });
       const buffer = await sticker.toBuffer();
       return Void.sendMessage(citel.chat, {sticker: buffer }, {quoted: citel }); 
}
)

module.exports = [trt, tts, sticker, photo, steal];