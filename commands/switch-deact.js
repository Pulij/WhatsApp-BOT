const { sck, cmd, tlang } = require('../lib');

const deact = cmd({
    pattern: "deact",
    alias: ["выкл"],
    desc: "Switches for various works.",
    category: "group",
    filename: __filename
},
async (Void, citel, text) => {
    if (!text) return citel.reply(`❌ Выбери что тебе нужно из списка\n1-events\n2-antilink\n3-nsfw`);

    const filter = { id: citel.sender, groupId: citel.chat };

    switch (text.split(" ")[0]) {
        case 'antilink':
            {
                if (!citel.isGroup) return citel.reply("Эта команда доступна только в группе.");
                let checkgroup = await sck.findOne(filter);
                if (!checkgroup) {
                    await new sck({ ...filter, antilink: "false" }).save();
                    return citel.reply(' Antilink успешно отключен');
                } else {
                    if (checkgroup.antilink == "false") return citel.reply("Antilink уже был отключен");
                    await sck.updateOne(filter, { antilink: "false" });
                    citel.reply('Antilink успешно отключен.');
                    return;
                }
            }
            break;

        case 'events':
            {
                if (!citel.isGroup) return citel.reply("Эта команда доступна только в группе.");
                let checkgroup = await sck.findOne(filter);
                if (!checkgroup) {
                    await new sck({ ...filter, events: "false" }).save();
                    return citel.reply("Успешно деактивированы *Events*");
                } else {
                    if (checkgroup.events == "false") return citel.reply("*Events* уже были деактивированы");
                    await sck.updateOne(filter, { events: "false" });
                    return citel.reply("Успешно деактивировано *Events*");
                }
            }
            break;

        case 'nsfw':
            {
                let checkgroup = await sck.findOne(filter);
                if (!checkgroup) {
                    await new sck({ ...filter, nsfw: "false" }).save();
                    return citel.reply(`Успешно отключено *NSFW*`);
                } else {
                    if (checkgroup.nsfw == "false") return citel.reply("*NSFW* уже было деактивировано");
                    await sck.updateOne(filter, { nsfw: "false" });
                    citel.reply(`Успешно деактивировано *NSFW*`);
                    return;
                }
            }
            break;

        default:
            {
                citel.reply("Выбери что тебе нужно из списка.\n1-events(Приветствие/Прощание)\n2-antilink\n3-nsfw");
            }
    }
});

module.exports = [deact];