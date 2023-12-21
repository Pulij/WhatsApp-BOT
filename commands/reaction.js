const axios = require('axios')
const { fetchJson,cmd, GIFBufferToVideoBuffer, sck} = require('../lib')
    //---------------------------------------------------------------------------
const bite = cmd({
            pattern: "bite",
            alias: ['кусать','кусаю'],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "😊",
        },
        async(Void, citel) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/bite`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} кусает @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} кусает себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const pat = cmd({
            pattern: "pat",
            alias: ["гладить"],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "😇",
        },
        async(Void, citel, a) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/pat`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} гладит @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} гладит себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const kiss = cmd({
            pattern: "kiss",
            alias: ["целовать"],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "😘",
        },
        async(Void, citel) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/kiss`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} целует @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} целует себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const kill = cmd({
            pattern: "kill",
            alias: ["убить"],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "😈",
        },
        async(Void, citel) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/kill`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} убил @${users.split("@")[0]}. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} убил(а) сам(а) себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const happy = cmd({
            pattern: "happy",
            alias: ["радоваться"],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "😎",
        },
        async(Void, citel) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/dance`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} радуется за @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} радуется за самого(у) себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const dance = cmd({
            pattern: "dance",
            alias: ['танцевать'],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "💀",
        },
        async(Void, citel) => {
            var bite = await fetchJson(`https://api.waifu.pics/sfw/dance`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} танцует с @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} танцует сам(а) с собой. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
    //---------------------------------------------------------------------------
const hug = cmd({
        pattern: "hug",
        alias: ["обнимать"],
        category: "reaction",
        use: '<quote|reply|tag>',
        react: "🤗",
    },
    async(Void, citel) => {
        var bite = await fetchJson(`https://api.waifu.pics/sfw/cuddle`);
        const response = await axios.get(bite.url, {
            responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "utf-8");
        let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        let gif = await GIFBufferToVideoBuffer(buffer);
        if (users) {
            let cap = `@${citel.sender.split("@")[0]} обнимает @${users.split("@")[0]} `;
            Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
        } else {
            let cap = `@${citel.sender.split("@")[0]} обнимает сам(у) себя. `;
            Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
        }
    }
)
//----------------------------------------------------------------------------------
const minet = cmd({
            pattern: "minet",
            alias: ["минет", "."],
            category: "reaction",
            use: '<quote|reply|tag>',
            react: "🥰",
        },
        async(Void, citel) => {
            const checkNSFW = await sck.findOne({ id: citel.sender, groupId: citel.chat });
            if (checkNSFW.nsfw === 'false') return;

            var bite = await fetchJson(`https://api.waifu.pics/nsfw/blowjob`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} сделал(а) минет @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} сделал(а) минет сам(а) себе. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )
//------------------------------------------------------------------------------
const viebat = cmd({
            pattern: "viebat",
            alias: ["выебать"],
            category: "nsfw",
            use: '<quote|reply|tag>',
            react: "🥵",
        },
        async(Void, citel) => {
            //-------Вкл/Выкл
            const checkNSFW = await sck.findOne({ id: citel.sender, groupId: citel.chat });
            if (checkNSFW.nsfw === 'false') return citel.reply(`18+ Команды отключены в данной группе`);
            //-------Выполнение
            var bite = await fetchJson(`https://api.waifu.pics/nsfw/trap`);
            const response = await axios.get(bite.url, {
                responseType: "arraybuffer",
            });
            const buffer = Buffer.from(response.data, "utf-8");
            let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
            let gif = await GIFBufferToVideoBuffer(buffer);
            if (users) {
                let cap = `@${citel.sender.split("@")[0]} выебал(а) @${users.split("@")[0]} `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [users, citel.sender], caption: cap }, { quoted: citel });
            } else {
                let cap = `@${citel.sender.split("@")[0]} выебал(а) сам(а) себя. `;
                Void.sendMessage(citel.chat, { video: gif, gifPlayback: true, mentions: [citel.sender], caption: cap }, { quoted: citel });
            }
        }
    )

module.exports = [bite,kiss,pat,happy,viebat,minet,kill,dance,hug]