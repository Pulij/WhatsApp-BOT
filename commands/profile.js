const path = require('path');
const fs = require('fs');
const { cmd, counter, code, sleep } = require('../lib');
const { connectionWhatsApp } = require('../lib/client');
const { createPayment } = require('../lib/server/payments/юкасса');

const connect = cmd({
  pattern: "подключить",
}, async (Void, citel) => {
  const sessionCheck = path.resolve(__dirname, `../lib/sessions`);
  fs.readdir(sessionCheck, { withFileTypes: true }, async (err, entries) => {
    if (err) {
      console.error('Ошибка при чтении папки сессий:', err);
      return;
 }
 const sessions = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
 if (sessions.includes(citel.sender)) return citel.reply('у тебя уже есть бот на аккаунте,зачем тебе еще один?');
 if (citel.isGroup) return Void.sendMessage(citel.sender, {text: "Команда /подключить доступна только в ЛС, подключив бота ты подаришь 7wbc тому у кого использовал команду"});
    const phoneNumber = citel.sender.replace(/@s\.whatsapp\.net$/, '');
    const newSessionName = citel.sender;

    await citel.reply('Генерирую наилучший код для подключения бота к твоему номеру, пожалуйста, подожди...');
    await connectionWhatsApp({phoneNumber, newSessionName});
    await sleep(2100)
    const use = await code.findOne({ userId: citel.sender });
    citel.reply(use.pCode);
  });
});

const profile = cmd({
  pattern: "profile",
  alias: ["профиль"],
  desc: "Sends rank card of user.",
  category: "group",
  filename: __filename,
}, async (Void, citel, text) => {
try {
const user = await counter.findOne({ groupId: citel.chat, userId: citel.sender });

if (user) {
const buttonMessage = {
text: `*📊 Профиль:*
*👤 Ник:* ${citel.pushName}
*📬 Всего сообщений в чате:* ${user.msg}
*📥 Сообщений за день в чате:* ${user.dailyMsg}
         
Баланс WhaBotCoins: ${user.wbc}
_P.s для пополнения WBC используй /пополнить сумма,после оплаты валюта начислиться на ваш аккаунт автоматически._`,
        contextInfo: {
          externalAdReply: {
            title: 'Profile-WhaBot',
            body: 'Тут номер Разработчика',
            thumbnailUrl: 'https://klike.net/uploads/posts/2023-01/1675061232_3-62.jpg',
            sourceUrl: `https://wa.me/+${global.ow}`
          },
        },
      };

      await Void.sendMessage(citel.chat, buttonMessage, {
        quoted: citel
      })
    } else {
      console.log('Пользователь не найден');
    }
  } catch (error) {
    console.error(error);
  }
});

const payment = cmd({
  pattern: "пополнить",
  desc: "Пополнить счет валюты WBC.",
  category: "group",
  filename: __filename,
},
async (Void, citel, text) => {
  if (!text) return citel.reply('Для пополнения счета используй /пополнить сумма');
  if (text <= "0") return citel.reply('Динаху:((')
  const userNumber = citel.sender;
  const paymentResponse = await createPayment(userNumber, text);
  const buttonMessage = {
      text: `✨ *Оплата создана*✨\n\n` +
      `💸 *Сумма:* ${text} RUB\n` +
      `💸 *Будет начислено:* ${text * 7} WBC\n` +
      `📎 *Ссылка для оплаты:* _${paymentResponse.data.confirmation.confirmation_url}_\n\n` +
      `P.s После оплаты валюта WBC будет начислена на ваш аккаунт.`,
      contextInfo: {
        externalAdReply: {
          title: 'Payment-WhaBot',
          body: 'Тут номер Разработчика',
          thumbnailUrl: 'https://vsegda-pomnim.com/uploads/posts/2023-03/1678960382_vsegda-pomnim-com-p-risunki-almazov-foto-58.jpg',
          sourceUrl: `https://wa.me/+${global.ow}`
        },
      },
    };

    await Void.sendMessage(citel.chat, buttonMessage, {
      quoted: citel
    })
});


module.exports = [profile, payment, connect];