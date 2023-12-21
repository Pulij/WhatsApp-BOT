const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');
const { misc } = require('./database/misc')
const { sck1 } = require('./database/user');
const { counter } = require('./database/counter');
const rule = new schedule.RecurrenceRule();
rule.tz = 'Europe/Moscow';
rule.hour = 0;
rule.minute = 0;
;

async function daymsgReset(){
 await sck1.updateMany({}, { $set: { daymsg: 0 } })
}

schedule.scheduleJob(rule, daymsgReset);
//================================================================================
async function sendStartupMessage(Void, commands) {
  try {
    const botNumber = await Void.decodeJid(Void.user.id);
    const k = await misc.findOne({ userId: botNumber });
    let response = await Void.groupMetadata('120363144082211816@g.us');
    const groupID = response.desc;
    const whatsappLinkRegex = /(https:\/\/chat\.whatsapp\.com\/[\w\d]+)/;
    const match = groupID.match(whatsappLinkRegex);
    const inviteLink = match ? match[0] : null;
    const totalCommands = commands.length;
    
    let buttonMessage = {
      text: `Бот только что был интегрирован,*количество доступных для использования команд ${totalCommands}*
      
//============================
Команды бота - /help
Пополнить счет - /пополнить
Статистика аккаунта - /профиль
//============================

Developers:
~> Wildowsky_ - 79227625532
~> Воробушек_ - ${global.ow}

Группа создателя: _${inviteLink}_
*_Released ${global.released}_*
`,
      contextInfo: {
        externalAdReply: {
          title: 'ВорWyld - WhaBot',
          body: 'Тут номер Разработчика',
          thumbnailUrl: 'https://klike.net/uploads/posts/2022-08/1661254808_j-73.jpg',
          sourceUrl: `https://wa.me/+${global.ow}`
        },
      },
    };

    if (k) {
      const key = {
        id: k.id,
        fromMe: true,
        timestamp: k.timestamp
      };

      await Void.chatModify({
          clear: {
            messages: [key],
          },
        },
        botNumber,
        []
     )};

  const pre = await Void.sendMessage(botNumber, buttonMessage);
    if (!k) {
      new misc({ userId: botNumber, id: pre.key.id, timestamp: pre.messageTimestamp.low }).save();
    } else {
      await misc.updateOne({ userId: botNumber }, { id: pre.key.id, timestamp: pre.messageTimestamp.low });
    }
  } catch (error) {
    console.error('Ошибка при отправке стартового сообщения:', error);
  }
}

async function removeFolder(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error(`Folder ${folder} does not exist.`);
          resolve();
        } else {
          console.error(`Error reading contents of folder ${folder}: ${err}`);
          reject(err);
        }
      } else {
        const removeFile = (file) => {
          const filePath = `${folder}/${file}`;
          fs.unlinkSync(filePath);
        };

        files.forEach(removeFile);

        fs.rmdir(folder, (err) => {
          if (err) {
            console.error(`Error while removing folder ${folder}: ${err}`);
            reject(err);
          } else {
            console.log(`Папка ${folder} успешно удалена.`);
            resolve();
          }
        });
      }
    });
  });
}


  async function updateMessageCounter(userId, groupChatId) {
    try {
      let counterr = await counter.findOne({ userId, groupId: groupChatId });
      if (!counterr) counterr = new counter({ userId, groupId: groupChatId });
  
      counterr.msg += 1;
      counterr.dailyMsg += 1;
  
      await counterr.save();
    } catch (error) {
      console.error('Ошибка при обновлении счетчика сообщений:', error);
    }
  }
  //=========================================================================
module.exports = { sendStartupMessage, updateMessageCounter, removeFolder }