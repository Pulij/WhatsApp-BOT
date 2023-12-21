//----------------------------- kick/rem ------------------------------------
const { cmd, getAdmin, tlang, counter } = require('../lib');

const kick = cmd({
    pattern: "rem",
    alias: ["кик", "kick", "рем"],
    desc: "Kicks replied/quoted user(s) from the group.",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
},
async (Void, citel, text) => { 
    if (!citel.isGroup) return citel.reply('❕ Эта команда доступна только в группах!');
    const groupAdmins = await getAdmin(Void, citel);
    const botNumber = await Void.decodeJid(Void.user.id);
    const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
    if (!isBotAdmins) return citel.reply('⚠️ Чтобы использовать эту команду, необходимо выдать *админку* боту');
    
    try {
        let users = citel.mentionedJid || [citel.msg.contextInfo.participant];
        if (!users || users.length === 0) return citel.reply('❕ Отметь того, кого хочешь исключить из группы\n\n📌Пример: .Кик @Пользователь');
        if (users.includes(botNumber)) return citel.reply(`Бота нельзя исключить этой командой.`);
        if (users.includes(citel.sender)) return citel.reply(`Этой командой нельзя себя исключить 😢`);
        
        await Void.groupParticipantsUpdate(citel.chat, users, "remove");
    } catch (error) {
        console.error(error);
    }

    const User = user.findOne({ id: citel.sender });
    console.log(User);
});
//-------------------------------------------------------------------Добавить
const add = cmd({
    pattern: "add",
    alias: ["добавить"],
    desc: "Add that person in group",
    fromMe: true,
    category: "group",
    filename: __filename,
    use: '<number>',
},
async (Void, citel, text) => {
    const userrr = await counter.findOne({ userId: citel.sender });
        if (!citel.isGroup) return citel.reply(tlang().group);
        if (userrr.wbc < 5) return citel.reply(`У вас не хватает WhaBotCoins, для использования данной команды нужно 5 WBC : у вас завалялось в кармане ${userrr.wbc} WBC `);

        const groupAdmins = await getAdmin(Void, citel)
        const botNumber = await Void.decodeJid(Void.user.id)
        const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
        const jid = citel.chat

        if (!isBotAdmins) return citel.reply(tlang().botAdmin);

        let users = citel.mentionedJid && citel.mentionedJid[0] || citel.quoted && citel.quoted.sender || citel.msg && citel.msg.contextInfo && citel.msg.contextInfo.participant || text && text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" || false;
        if (!users) return citel.reply('Номер дай..');

        try {   
        const add = (await Void.groupParticipantsUpdate(citel.chat, [users], "add"))[0];
        const addinfo = add.content;
        await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -7 } });
        if (add.status === '409') {
            return citel.reply('Этот номер уже находится в группе..');
        } else if (add.status === '408') {
            citel.reply('Этот еплан недавно вышел из группы и его нельзя добавить насильно, я отправил ему ссылку...')
            let response = await Void.groupInviteCode(citel.chat)
            let link = 'https://chat.whatsapp.com/' + response
            await Void.sendMessage(users, { text: `Какой-то еплан пытаеться добавить тебя  в группу используя бота - _${link}_` })
        } else {
            citel.reply('К сожалению мне не удалось добавить этого еблана насильно, поэтому я отправил ему приглашение...')
            await Void.sendAcceptInviteV4(jid, users, addinfo)
        }
    } catch (error) {
        console.error("Error in add command:", error);
        citel.reply("Номер не найден в базе данных WhatsApp");
    }
});     
//----------------------------- WARN ------------------------------------
const warn = cmd({
    pattern: "warn",
    alias: ["пред"],
    desc: "Warns user in Group.",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
},
async (Void, citel, text) => {
    const userrr = await counter.findOne({ groupId: citel.chat, userId: citel.sender });
    if (!citel.isGroup) return citel.reply('Только для групп.');
    const groupAdmins = await getAdmin(Void, citel);
    const botNumber = await Void.decodeJid(Void.user.id);
    const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
    if (!citel.isCreator) return citel.reply('Эта команда временно доступна только создателю.');
    if (!isBotAdmins) return citel.reply(tlang().botAdmin);

    let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
    if (!users) return citel.reply('Не так юзаешь.');
    if (!text) return await citel.reply(`Причины нет`);
    if (users === botNumber) return citel.reply(`Иди ка ты в писю, пон?`);
    if (users === citel.sender) return citel.reply(`Ты не можешь выгнать самого себя, пон?`);

    let str = users;
    let newStr = str.replace("@s.whatsapp.net", "warn");
    let checkqinfo = await warndb.find({ id: newStr, group: citel.chat });
    let pushnamer = Void.getName(users);
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    let textt = `ПРЕДУПРЕЖДЕНИЕ\nПользователь - @${users.split("@")[0]}\nКем предупрежден - @${citel.sender.split("@")[0]}\nПричина - ${text}`;
    Void.sendMessage(citel.chat, { text: textt,  mentions: [citel.sender, users]}, { quoted: citel });
    await new warndb({ id: newStr, reason: text, date: currentTime, group: citel.chat, warnedby: citel.pushName }).save();
    if (checkqinfo.length > 1) {
        const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat)
               .catch((e) => {}) : "";
        const groupName = groupMetadata.subject;
        let textt = `Привет, @${users.split("@")[0]}! У тебя уже три нарушения в ${groupName}.\nИзвини, придется удалить тебя!`;
        await Void.sendMessage(citel.chat, { text: textt,  mentions: [users]}, { quoted: citel });
        await Void.groupParticipantsUpdate(citel.chat, [users], "remove");
        await warndb.deleteMany({ id: newStr, group: citel.chat });
    }
});
//----------------------Выдача прав,удаление участников
const prom = cmd({
    pattern: "prom",
    alias: ["пром"],
    desc: "Provides admin role to replied/quoted user",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
},
async(Void, citel, text) => {
    const userrr = await counter.findOne({ groupId: citel.chat, userId: citel.sender });
    if (!citel.isGroup) return citel.reply('Эту команду можно использовать только в группах');
    const groupAdmins = await getAdmin(Void, citel)
    const botNumber = await Void.decodeJid(Void.user.id)
    const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
    if (!isBotAdmins) return citel.reply('Выдай админку боту чтобы использовать эту команду');
    try {
       let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
        if (!users) return;
        await Void.groupParticipantsUpdate(citel.chat, [users], "promote");
    } catch {
        //		citel.reply(tlang().botAdmin);

    }
}
)
//-------------------------------------------
const dem = cmd({
pattern: "dem",
alias: ["дем"],
desc: "Demotes replied/quoted user from group",
category: "group",
filename: __filename,
use: '<quote|reply|number>',
},
async(Void, citel, text) => {
if (!citel.isGroup) return citel.reply('Эту команду можно использовать только в группах');
const groupAdmins = await getAdmin(Void, citel)
const botNumber = await Void.decodeJid(Void.user.id)
const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
if (!isBotAdmins) return citel.reply('Выдай админку боту чтобы использовать эту команду');
try {
   let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
   if (!users) return;
   await Void.groupParticipantsUpdate(citel.chat, [users], "demote");
} catch {
   //		citel.reply(tlang().botAdmin);

}
}
)
//------------------------------------------------------------------------
const hidetag = cmd({
    pattern: "hidetag",
    alias: ["htag"],
    desc: "Tags everyperson of group without mentioning their numbers",
    category: "group",
    filename: __filename,
    use: '<text>',
},
async(Void, citel, text) => {
    const userrr = await counter.findOne({ groupId: citel.chat, userId: citel.sender });
    if (userrr.wbc < 7) return citel.reply(`У вас не хватает WhaBotCoins, для использования данной команды нужно 7 WBC : у вас завалялось в кармане ${userrr.wbc} WBC `);
    const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
    const participants = citel.isGroup ? await groupMetadata.participants : "";
    Void.sendMessage(citel.chat, {
        text: text ? text : "",
        mentions: participants.map((a) => a.id),
    }, {
        quoted: citel,
    });
    await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -7 } });
})
//------------------------------tagadmin------------------------------------------
const tagadmins = cmd({
    pattern: "tagadmin",
    alias: ["tagadmin"],
    desc: "Tags everyperson of group without mentioning their numbers",
    category: "group",
    filename: __filename,
    use: '<text>',
},

async(Void, citel, text) => {
    const userrr = await counter.findOne({ groupId: citel.chat, userId: citel.sender });
    if (!text) return citel.reply(`Укажите текст, для которого требуется запросить присутствие администраторов`)
    if (userrr.wbc < 7) return citel.reply(`У вас не хватает WhaBotCoins, для использования данной команды нужно 7 WBC : у вас завалялось в кармане ${userrr.wbc} WBC `);
    const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
    const participants = citel.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
  const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || citel.chat.split`-`[0] + '@s.whatsapp.net'
  let pesan = args.join` `
  let oi = `Запрос: _${pesan}_`
  
  let textoA = 
  `*⊱ ──── 《.⋅ ❕ ⋅.》 ──── ⊰*
  ෆ Требуется присутствие администраторов!
  ෆ ${oi}
  *⊱ ──── 《.⋅ ❕ ⋅.》 ──── ⊰*`
  
  let textoB = 
  `${listAdmin}
  
  ⛔ Важно: Обращайтесь к администраторам только по делу! ⛔`.trim()
  await Void.sendMessage(citel.chat, textoA + textoB, m, false, { mentions: [...groupAdmins.map(v => v.id), owner] })
  await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -7 } });
  })
//---------------------------------------------------------------------------

const kicknoactiv = cmd({
    pattern: "kicknoactiv"
  }, async (Void,citel,text) => {
    const userrr = await counter.findOne({ groupId: citel.chat, userId: citel.sender });
    if (userrr.wbc < 7) return citel.reply(`У вас не хватает WhaBotCoins, для использования данной команды нужно 7 WBC : у вас завалялось в кармане ${userrr.wbc} WBC `);

    const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(() => {}) : '';
    const participants = citel.isGroup && groupMetadata.participants != undefined ? await groupMetadata.participants : '';
    const usersDk = await counter.find({groupId: citel.chat})
    const userIds = usersDk.map(user => user.userId);
    const filteredParticipants = participants.filter(participant => !userIds.includes(participant.id));
    for (const participant of filteredParticipants) {
        console.log(participant.id)
        await Void.groupParticipantsUpdate(citel.chat, [participant.id], "remove");
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -7 } });
  })

module.exports = [kick, warn, dem, prom, hidetag, tagadmins, add, kicknoactiv];