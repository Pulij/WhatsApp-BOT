const { cmd, getAdmin, getBuffer, fetchJson } = require('../lib');
let gis = require("async-g-i-s");
const axios = require('axios')
const ytdl = require('ytdl-core')
const fs = require('fs-extra')
  //---------------------------------------------------------------------------
  const image = cmd({
    pattern: "image",
    alias: ['изо','изображение','картинка'],
    category: "search",
    desc: "Searches Image on Google",
    use: '<text>',
    filename: __filename,
},
async(Void, citel, text, a) => {
    if (!text) return citel.reply("Что мне искать?")
    let name1 = text.split("|")[0]
    let name2 = text.split("|")[1] || `1`
    let nn = name2
    for (let i = 0; i < nn; i++) {

        let n = await gis(name1)
        images = n[Math.floor(Math.random() * n.length)].url;
            let buttonMessage = {
                image: {
                    url: images,
                },
                caption: `_WaBot Поиск Изображений_\nВы попросили -> "*${name1}*"`,
                headerType: 4,
            };
        await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
    }

}
)

   //---------------------------------------------------------------------------

   const couplepp = cmd({
    pattern: "couplepp",
    alias: ['парные', 'авы', 'парные авы'],
    category: "search",
    desc: "Sends two couples pics.",
    filename: __filename,
},
async(Void, citel, text, a) => {

    let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
    let random = anu[Math.floor(Math.random() * anu.length)]
    Void.sendMessage(citel.chat, { image: { url: random.male }, caption: `Ава для самца` }, { quoted: citel })
    Void.sendMessage(citel.chat, { image: { url: random.female }, caption: `Ава для самки` }, { quoted: citel })
}
)
//---------------------------------------------------------------------------
const ytmp3 = cmd({
    pattern: "ytmp3",
    alias: ["мп3", "аудио"],
    desc: "Загружает аудио по ссылке на видео YouTube.",
    category: "downloader",
    use: '<название песни>',
},
async (Void, citel, text, a) => {

    const getRandom = (ext) => {
        return `${Math.floor(Math.random() * 10000)}${ext}`;
    };

    if (text.length === 0) {
        citel.reply(`❌ Не указано название песни. Используйте ytmp3 <название песни>`);
        return;
    }

    try {
        let yts = require("secktor-pack");
        let search = await yts(text);
        let anu = search.videos[0];
        let urlYt = anu.url;

        if (!urlYt || !urlYt.startsWith("http")) {
            citel.reply(`❌ Неверная или отсутствующая YouTube ссылка.`);
            return;
        }

        let infoYt = await ytdl.getInfo(urlYt);

        const videotime = 30 * 60; // 30 минут в секундах
        if (infoYt.videoDetails.lengthSeconds >= videotime) {
            citel.reply(`❌ Продолжительность видео превышает лимит!`);
            return;
        }

        let titleYt = infoYt.videoDetails.title;
        let randomName = getRandom(".mp3");

        const stream = ytdl(urlYt, {
            filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
        }).pipe(fs.createWriteStream(`./${randomName}`));

        await new Promise((resolve, reject) => {
            stream.on("error", reject);
            stream.on("finish", resolve);
        });

        let stats = fs.statSync(`./${randomName}`);
        let fileSizeInBytes = stats.size;
        let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        const dlsize = 100; // Максимальный размер файла в мегабайтах

        if (fileSizeInMegabytes <= dlsize) {
            let buttonMessage = {
                audio: fs.readFileSync(`./${randomName}`),
                mimetype: 'audio/mpeg',
                fileName: titleYt + ".mp3",
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: titleYt,
                        body: citel.pushName,
                        renderLargerThumbnail: true,
                        thumbnailUrl: search.all[0].thumbnail,
                        mediaUrl: urlYt,
                        mediaType: 1,
                        thumbnail: await getBuffer(search.all[0].thumbnail),
                        sourceUrl: urlYt,
                    },
                },
            };

            await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });
            fs.unlinkSync(`./${randomName}`); // Удаление загруженного файла
        } else {
            citel.reply(`❌ Размер файла не должен превышать 100 МБ.`);
        }
    } catch (e) {
        console.log(e);
    }
});
//---------------------------------------------------------------------------

const ytmp4 = cmd({
    pattern: "ytmp4",
    alias: ["видео", "мп4"],
    desc: "Downloads video from YouTube.",
    category: "downloader",
    filename: __filename,
    use: '<название песни>',
},
async (Void, citel, text, a) => {
    
    let yts = require("secktor-pack");
    let search = await yts(text);
    let anu = search.videos[0];

    if (!anu) {
        citel.reply(`❌ Не удалось найти видео по вашему запросу.`);
        return;
    }

        let infoYt = await ytdl.getInfo(anu.url);
        let titleYt = infoYt.videoDetails.title;
         
           let buttonMessaged = {
               text: '1080p',
               contextInfo: {
                   externalAdReply: {
                       title: 'WaBot Video',
                       body: titleYt,
                       thumbnailUrl: `https://w.forfun.com/fetch/7a/7a990de723f9b21bfe1d4095a4471498.jpeg`,
                       mediaType: 2,
                       mediaUrl: anu.url,
},},};
Void.sendMessage(citel.chat, buttonMessaged, { quoted: citel });
});
//---------------------------------------------------------------------------
module.exports = [image, couplepp, ytmp3, ytmp4];