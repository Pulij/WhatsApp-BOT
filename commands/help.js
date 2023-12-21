//-------------------Команды--------------------------------------------------------
const { cmd } = require('../lib');
const axios = require('axios')

const MenuCommand = cmd({
    pattern: "help",
    alias: ["menu", "помощь", "команды", "хелп"],
    desc: "Проверка статуса бота",
    category: "general",
    filename: __filename,
},
async(Void, citel, a) => {

    const catApiResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
    const catImageUrl = catApiResponse.data[0]?.url || 'https://placekitten.com/600/400'; 
   
    let ter = `
**🌟 Привет, ${citel.pushName}! 🌟**

*📚 Информация:*
-> */пинг* (Проверка скорости ответа бота)
-> */support* (Группа создателя бота)
-> */пополнить* (Купить WhaBotCoins)

*👥 Группа:*
-> */кик* (Исключение участников из группы)
-> */адд* (Добавить участника в группу) - 7 WBC
-> */пром* (Повышение участника до админа)
-> */дем* (Снятие прав админа до участника)
-> */hidetag* (Отмечает всех участников группы скрытно без "@") - 7 WBC
-> */act || /deact events* (Включить/выключить приветствие прощание в группе) - 1420 WBC
-> */act || /deact antilink* (Включить/выключить защиту от рекламы в группе) - 1750 WBC
-> */act || /deact nsfw* (Включить/выключить 18+ команды) 

*🌐 Разное:*
-> */Шип* (Выбирает случайного участника и пишет, насколько они "совместимы" в процентах.)

*🎨 Конвертеры:*
-> */фото* (Из стикера в фото jpg)
-> */стикер* (Из фото в стикер)
-> */украсть* (Воровать стикеры)
-> */vv* (Смотреть однократные сообщения) - 2 WBC

*🗣️ Переводчики:*
-> */tts* (Озвучивает текст голосом)
-> */trt* (Переводит английский текст на русский)

*🌐 Интернет:*
-> */couplepp* (Скидывает парные аватарки)
-> */видео* (Ищет видео на ютубе и отправляет mp4)
-> */аудио* (Ищет аудио и отправляет mp3)
-> */картинка* (Ищет картинки в интернете)

*💕 Аниме реакции(RP):*
- 🤗 -> *обнять*
- 😘 -> *целовать*
- 👯‍♂️ -> *танцевать*
- 🫳 -> *гладить*
- 😬 -> *кусать*
- 🔪 -> *убить*
- 🔞 -> *минет*
- 🔞 -> *выебать*

P.s все команды кроме реакций(RP) работают только с "/"
`;

    let buttonMessaged = {
        image: {
            url: catImageUrl
        },
        caption: ter,
        footer: 'Ваш футер',
        headerType: 4,
        contextInfo: {
            externalAdReply: {
                title: `WhaBot-Help`,
                body: `ворwyld`,
                mediaType: 2,
                thumbnailUrl: `https://gas-kvas.com/grafic/uploads/posts/2023-10/1696434407_gas-kvas-com-p-kartinki-meditsinskii-krest-48.jpg`,
                sourceUrl: `https://wa.me/+${global.ow}`
            },
        },
    };

    return await Void.sendMessage(citel.chat, buttonMessaged, {
        quoted: citel,
    });
});


//-------------------------------------------------------------------------
const support = cmd({
    pattern: "support",
    alias: ["поддержка"],
    desc: "Sends official support group link.",
    category: "group",
    filename: __filename,
},
async(Void, citel, text) => {
    citel.reply(`*Чекни лс пупсик*`);
    let response = await Void.groupMetadata('120363144082211816@g.us');
    const groupID = response.desc;
    const whatsappLinkRegex = /(https:\/\/chat\.whatsapp\.com\/[\w\d]+)/;
    const match = groupID.match(whatsappLinkRegex);
    const inviteLink = match ? match[0] : null;

    await Void.sendMessage(citel.sender, {
        text: `Вступай пупсик - ${inviteLink}`,
    });
})

module.exports = [MenuCommand, support];