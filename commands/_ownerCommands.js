const { cmd, counter } = require('../lib');

const restart = cmd({
    pattern: "restart",
    alias: ["рестарт"],
    desc: "To restart bot",
    category: "tools",
    filename: __filename
},
async(Void,citel,text) => {
if (!citel.isCreator) return citel.reply('Эта команда доступна только создлателдю')
await citel.reply('Перезапуск...')
Void.restartBot()
});

const lspam = cmd({
    pattern: "linkspam",
    alias: ["lspam"],
    desc: "Tags everyperson spam",
    category: "group",
    filename: __filename,
    use: '/lspam <количество> <текст>',
},
async (Void, citel, text) => {
    if (!citel.isCreator) return citel.reply(tlang().owner);
    const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
    const participants = citel.isGroup ? await groupMetadata.participants : "";
    const args = text.split(' ');
    const count = parseInt(args[0]);
    
    if (isNaN(count) || count <= 0) {
        return citel.reply(tlang().invalidCount);
    }

    const actualText = args.slice(1).join(' ');

    for (let i = 0; i < count; i++) {
        Void.sendMessage(citel.chat, {
            text: actualText ? actualText : "",
            mentions: participants.map((a) => a.id),
        }, {
            quoted: citel,
        });
    }
});

const givewbc = cmd({
    pattern: "setwbc",
    desc: "To restart bot",
    category: "tools",
    filename: __filename
},
async(Void,citel,text) => {
if (!citel.isCreator) return citel.reply('Эта команда доступна только создлателю бота')
if (!text) return citel.reply('Используй /givewbc 100')
let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
await counter.updateOne({userId: users}, {wbc: text})
citel.reply(`_*Установлено значение WBC ${text} для ${users}*_`)
});

module.exports = [ restart, lspam, givewbc ]