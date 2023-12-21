const { cmd, runtime } = require('../lib');

const ping = cmd({
    pattern: "ping",
    alias: ["пинг"],
    desc: "To check ping",
    category: "general",
    filename: __filename,
},
async(Void, citel) => {
    var inital = new Date().getTime();
    const { key } = await Void.sendMessage(citel.chat, {text: '```Пинг!!!```'});
    var final = new Date().getTime();
   return await Void.sendMessage(citel.chat, {text: `*Понг*\n *` + (final - inital) + ' мс* ', edit: key});
});

const uptime = cmd({
    pattern: "uptime",
    alias: ["runtime", "рабвремя"],
    desc: "Tells runtime/uptime of bot.",
    category: "misc",
    filename: __filename,
},
async(Void, citel, text) => {
    const upt = runtime(process.uptime())
    return citel.reply(`Время работы WhaBot ${upt}`)
}
)

module.exports = [ping, uptime]
