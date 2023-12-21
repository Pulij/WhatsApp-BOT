const { cmd, sck, counter, getAdmin, tlang } = require('../lib');

const act = cmd({
    pattern: "act",
    alias: ["вкл"],
    desc: "Switches for various works.",
    category: "group",
    filename: __filename,
},
async (Void, citel, text) => {
    const groupAdmins = await getAdmin(Void, citel);
    const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
    if (!citel.isGroup) return citel.reply(tlang().group);
    if (!text) return citel.reply(`❌ Выбери из списка что тебе нужно\n1-events\n2-antilink\n3-nsfw`);

    const filter = { id: citel.sender, groupId: citel.chat };

    switch (text.split(" ")[0]) {

        case 'antilink': {
            if (!isAdmins) return citel.reply("Админку дайте пж:((");
            const user = await counter.findOne({ userId: citel.sender });
            const checkgroup = await sck.findOne(filter);    
            if (user.wbc < 1750 && (!checkgroup || checkgroup.antilink !== "true")) return citel.reply('У вас не хватает WhaBotCoins, для активации "Защиты от рекламы" пополните счет на сумму 1750 WBC ');
        
            if (!checkgroup) {
                await new sck({ ...filter, antilink: "true" }).save();
                await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -1750 } });
                return citel.reply(`Antilink успешно активирован, с вашего баланса списано 1750 WBC : остаток ${user.wbc} WBC`);
            } else {
                if (checkgroup.antilink == "true") {
                    return citel.reply("Antilink уже был активирован.");
                } else {
                    if (checkgroup.id === filter.id) {
                        await sck.updateOne(filter, { antilink: "true" });
                        await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -1750 } });
                        return citel.reply(`Antilink успешно активирован, с вашего баланса списано 1750 WBC : остаток: ${user.wbc - 1750} WBC`);
                    } else {
                        return citel.reply("Ошибка: Дублирование ключа.");
                    }
                }
            }
        }
        break;

        case 'events':
            {
                if (!isAdmins) return citel.reply("Админку дайте пж:((");
                const user = await counter.findOne({ userId: citel.sender });
                const checkgroup = await sck.findOne(filter);
                if (user.wbc < 1420 && checkgroup.events !== "true") return citel.reply(`У вас не хватает WhaBotCoins, для активации "Приветствия/Прощания" пополните счет на сумму 1420 WBC `);
                if (!checkgroup) {
                    await new sck({ ...filter, events: "true" }).save();
                    await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -1420 } });
                    return citel.reply(`Успешно активировано *Events*, с вашего баланса списано 1420 WBC : остаток: ${user.wbc - 1420} WBC`);
                } else {
                    if (checkgroup.events == "true") return citel.reply("*Events* уже было активировано");
                    await sck.updateOne(filter, { events: "true" });
                    await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -1420 } });
                    return citel.reply(`Успешно активировано *Events*, с вашего баланса списано 1420 WBC : остаток: ${user.wbc - 1420} WBC`);
                }
            }
            break;

        case 'nsfw':
            {
                let checkgroup = await sck.findOne(filter);
                if (!checkgroup) {
                    await new sck({ ...filter, nsfw: "true" }).save();
                    return citel.reply("Успешно активировано *NSFW*");
                } else {
                    if (checkgroup.nsfw == "true") return citel.reply("*NSFW* уже было активировано");
                    await sck.updateOne(filter, { nsfw: "true" });
                    citel.reply("Успешно активировано *NSFW*");
                    return;
                }
            }
            break;

        default:
            {
                citel.reply("Выбери из списка что тебе нужно.\n1-events(приветствие/прощание участников)\n2-antilink\n3-nsfw");
            }
    }
});

module.exports = [act];