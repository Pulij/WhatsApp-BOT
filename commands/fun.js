const { cmd, counter } = require('../lib');
const ship = cmd({ pattern: "ship" , alias: ["шип"], category: "fun" }, async(Void, citel, text) => {
      const { tlang } = require('../lib')
     if (!citel.isGroup) return citel.reply(tlang().group);
     const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch((e) => {}) : "";
       const participants = citel.isGroup ? await groupMetadata.participants : "";
     let members = participants.map(u => u.id)
     const percentage = Math.floor(Math.random() * 100)
      async function couple(percent) {
           var text;
          if (percent < 25) {
              text = `\t\t\t\t\t*ShipПроцент : ${percentage}%* \n\t\tДумаю тебе стоит пересмотреть свой выбор`
          } else if (percent < 50) {
              text = `\t\t\t\t\t*ShipПроцент : ${percentage}%* \n\t\t У вас ничего не получиться,расходитесь 💫`
          } else if (percent < 75) {
              text = `\t\t\t\t\t*ShipПроцент : ${percentage}%* \n\t\t\tОставайтесь вместе и у вас всё получиться ⭐️`
          } else if (percent < 90) {
              text = `\t\t\t\t\t*ShipПроцент : ${percentage}%* \n\tОтлично,вы вдвоём будете очень хорошей парой 💖 `
          } else {
              text = `\t\t\t\t\t*ShipПроцент : ${percentage}%* \n\tВам суждено быть вместе💙`
          }
          return text
          }
         var user = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
         var shiper;
         if (user) {
         shiper = user
         } else {
         shiper = members[Math.floor(Math.random() * members.length)]
         }
         let caption = `\t❣️ *Смотрим...* ❣️ \n`
          caption += `\t\t✯────────────────────✯\n`
          caption += `@${citel.sender.split('@')[0]}  x  @${shiper.split('@')[0]}\n`
          caption += `\t\t✯────────────────────✯\n`
          caption += await couple(percentage)
          if(citel.sender.split('@')[0]===shiper.split('@')[0]) return citel.reply('```'+'Подожди... Что?!!,Ты хочешь ебаться сам с собой?'+'```')
          await Void.sendMessage(citel.chat,{text: caption,mentions: [citel.sender,shiper]},{quoted:citel})
     }
  )


  const vv = cmd({
    pattern: "vv",
    alias : ['viewonce','retrive','чит'],
    desc: "Flips given text.",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async(Void, citel, text) => {
const user = await counter.findOne({ userId: citel.sender });
if (user.wbc < 2) return citel.reply(`У вас не хватает WhaBotCoins, для использования данной команды нужно 5 WBC : у вас завалялось в кармане ${user.wbc} WBC `);
await counter.updateOne({ userId: citel.sender }, { $inc: { wbc: -5 } });
try {
const quot = citel.msg.contextInfo.quotedMessage.viewOnceMessageV2;
if(quot)
{
if(quot.message.imageMessage) 
{ console.log("Quot Entered") 
let cap =quot.message.imageMessage.caption;
let anu = await Void.downloadAndSaveMediaMessage(quot.message.imageMessage)
return Void.sendMessage(citel.chat,{image:{url : anu},caption : cap })
}
if(quot.message.videoMessage) 
{
let cap =quot.message.videoMessage.caption;
let anu = await Void.downloadAndSaveMediaMessage(quot.message.videoMessage)
return Void.sendMessage(citel.chat,{video:{url : anu},caption : cap })
}

}      
}  

catch(e) {  console.log("error" , e ) }     

  
if(!citel.quoted) return citel.reply("```Отметь сообщение в однократном просмотре и я его скачаю```")           
if(citel.quoted.mtype === "viewOnceMessage")
{ console.log("ViewOnce Entered") 
if(citel.quoted.message.imageMessage )
{ 
let cap =citel.quoted.message.imageMessage.caption;
let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.imageMessage)
Void.sendMessage(citel.chat,{image:{url : anu},caption : cap })
}
else if(citel.quoted.message.videoMessage )
{
let cap =citel.quoted.message.videoMessage.caption;
let anu = await Void.downloadAndSaveMediaMessage(citel.quoted.message.videoMessage)
Void.sendMessage(citel.chat,{video:{url : anu},caption : cap })
}

}
else return citel.reply("```Отметь сообщение в однократном просмотре и я его скачаю```")
})   

module.exports = [ship,vv]