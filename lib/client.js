const PhoneNumber = require('awesome-phonenumber')
const colors = require('colors');
const NodeCache = require('node-cache');
const FileType = require('file-type')
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const util = require('util');
const mongoose = require('mongoose');
const {default: VoidConnect, useMultiFileAuthState, makeInMemoryStore, jidDecode, downloadContentFromMessage, makeCacheableSignalKeyStore, getBinaryNodeChild, delay,generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const { smsg, sendStartupMessage, updateMessageCounter, removeFolder, sck, sck1, code } = require('.');

async function connectionWhatsApp({ phoneNumber, newSessionName, sessionName }) {
  try {
    await mongoose.connect(mongodb);
    console.log('🌍 Подключение к WhaBOTDB установлен.');

    let { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, `./sessions/${newSessionName || sessionName}`));
    const MAIN_LOGGER = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
    const logger = MAIN_LOGGER.child({});
    logger.level = 'trace';
    const store = makeInMemoryStore({logger: pino().child({ level: "silent", stream: "store" })});
    const msgRetryCounterCache = new NodeCache();

    const Void = VoidConnect({
      logger: pino({ level: 'silent' }).child({ level: 'silent' }),
      printQRInTerminal: !global.usePairingCode,
      lastSeen: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'silent' })),
      },
      browser: ['Chrome (Linux)', '', ''],
      getMessage: async (key) => {
        let jid = jidDecode(key.remoteJid).user;
        let msg = await store.loadMessage(jid, key.id);
        return msg?.message || '';
      },
      msgRetryCounterCache,
    });
    store?.bind(Void.ev);
    setInterval(() => {
      store.writeToFile(__dirname+`/sessions/${newSessionName || sessionName}/store.json`);
    }, 30 * 1000);
    Void.ev.on('creds.update', saveCreds);

    if (global.usePairingCode && phoneNumber) {
      await delay(1700);
      const pCode = await Void.requestPairingCode(phoneNumber);
      await delay(500);
      await code.updateOne({ userId: newSessionName }, { pCode }, { upsert: true });
      console.log(pCode);
    }

    const loadCommands = () => {
      const commands = [];
      const commandsPath = path.resolve(__dirname, '..', 'commands');

      const files = fs.readdirSync(commandsPath);
      files.forEach((file) => {
        const commandPath = path.join(commandsPath, file);
        const commandModule = require(commandPath);
        if (Array.isArray(commandModule)) {
          commands.push(...commandModule);
        }
      });

      return commands;
    };

    const executeCommand = async (Void, citel, text, cmd) => {
      try {
        if (cmd.react) {
          citel.react(cmd.react);
        }
        await cmd.run(Void, citel, text);
      } catch (error) {
        console.error('Ошибка при выполнении команды:', error);
      }
    };

    const commands = loadCommands();
//=====================================================================================================================
    Void.restartBot = () => {
      console.log('🔄 Перезапуск бота...');
      process.exit(0);
    };

    Void.decodeJid = (jid) => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
      } else return jid;
    };

    Void.getName = (jid, withoutContact = false) => {
      id = Void.decodeJid(jid)
      withoutContact = Void.withoutContact || withoutContact
      let v

      if (id.endsWith("@g.us")) return new Promise(async(resolve) => {
          v = store.contacts[id] || {}
          if (!(v.name.notify || v.subject)) v = Void.groupMetadata(id) || {}
          resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
      })
         else v = id === '0@s.whatsapp.net' ? {
              id,
              name: 'WhatsApp'
          } : id === Void.decodeJid(Void.user.id) ? Void.user : (store.contacts[id] || {})
      return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
  }

    Void.ev.on('contacts.update', async update => {
      for (let contact of update) {
          let id = Void.decodeJid(contact.id)
          sck1.findOne({ id: id }).then((usr) => {
              if (!usr) {
                  new sck1({ id: id, name: contact.notify }).save()
              } else {
                  sck1.updateOne({ id: id }, { name: contact.notify })
              }
          })
          if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
      }
  })

   Void.downloadMediaMessage = async(message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    return buffer
}

/**
 *
 * @param {*} jid
 * @param {*} message
 * @param {*} forceForward
 * @param {*} options
 * @returns
 */

  Void.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
}

   Void.getFile = async(PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
    }
    let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
        res,
        filename,
        size: await getSizeMedia(data),
        ...type,
        data
    }

}

Void.sendAcceptInviteV4 = async (jid, users, addinfo, caption = "Какой-то еплан пытается добавить тебя используя бота...")  => {
  const groupMetadata = await Void.groupMetadata(jid);
  const groupName = groupMetadata ? groupMetadata.subject : "";
  const jpegThumbnail = Void.profilePictureUrl(jid)
  const id = Void.decodeJid(jid);

  if (!id.endsWith("g.us")) {
      throw new TypeError("Invalid jid");
  }

  const result = getBinaryNodeChild(addinfo, "add_request");
  const inviteCode = result.attrs.code;
  const inviteExpiration = result.attrs.expiration;
  const content = proto.Message.fromObject({
      groupInviteMessage: proto.Message.GroupInviteMessage.fromObject({
          groupJid: jid,
          inviteCode,
          inviteExpiration,
          groupName,
          jpegThumbnail,
          caption
      })
  });

  const waMessage = generateWAMessageFromContent(users, content, {
      userJid: Void.decodeJid(Void.user.id),
      ephemeralExpiration: 200
  });

  process.nextTick(() => Void.upsertMessage(waMessage, "append"));
  await Void.relayMessage(users, waMessage.message, {
      messageId: waMessage.key.id,
      cachedGroupMetadata: (jid) => Void.groupMetadata(jid)
  });

  return waMessage;
}           
//==================================================================================================================
        Void.ev.on('messages.upsert', async (chatUpdate) => {
            let isCreator = global.owner.map((number) => `${number}@s.whatsapp.net`);
            let command
            const botNumber = await Void.decodeJid(Void.user.id);
            const mek = chatUpdate.messages[0];
            if (!mek.message || mek.message.viewOnceMessageV2) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            try {
                let citel = await smsg(Void, JSON.parse(JSON.stringify(mek)), store)
                citel.isCreator = isCreator.includes(botNumber);
                citel.isUserBot = botNumber
                const budy = typeof citel.text === 'string' ? citel.text : false;
               
                let text;
                try {
                    text = citel.body ? citel.body.trim().split(/ +/).slice(1).join(" ") : null;
                } catch {
                    text = false;
                }

                const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(() => {}) : '';
                const participants = citel.isGroup && groupMetadata.participants != undefined ? await groupMetadata.participants : '';
                const groupAdminss = (participants) => {
                    const a = [];
                    for (let i of participants) {
                        if (i.admin == null) continue;
                        a.push(i.id);
                    }
                    return a;
                };
                const groupAdmins = citel.isGroup ? await groupAdminss(participants) : '';
                const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
                const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
                const commandText = budy.slice(1);
                const cmdName = commandText.split(' ')[0].toLowerCase();
                command = commands.find((cmd) =>
                (cmd.pattern && cmd.pattern.toLowerCase() === cmdName) ||
                (cmd.alias && Array.isArray(cmd.alias) && cmd.alias.map((a) => a.toLowerCase()).includes(cmdName))
            );
                if (citel.sender === undefined) citel.sender = botNumber;
                if (!citel.message || citel.isBaileys || citel.chat.endsWith('broadcast')) return;
                if (citel.sender === botNumber) updateMessageCounter(citel.sender, citel.chat);

                if (budy && budy.startsWith(global.prefix) && citel.sender === botNumber || command && command.pattern === 'подключить') {
                  if (command) {
                    const args = commandText.slice(cmdName.length).trim();
                    executeCommand(Void, citel, args, command);
                  }}              
                                                     
                if (citel.isGroup && command) {
                    console.log(colors.yellow(`Команда в группе\nВ=> ${groupMetadata.subject} (${citel.sender})\nКоманда: ${citel.body}\n----------------------------`));
                } else if (!citel.isGroup && command) {
                    console.log(colors.yellow(`Команда в личке\nОт=> ${citel.pushName} (${citel.sender})\nКоманда: ${citel.body}\n----------------------------`));
                } else if (!citel.isGroup) {
                    console.log(`Сообщение в личке\nОт=> ${citel.pushName} (${citel.sender})\nСообщение: ${citel.body}\n----------------------------`);
                } else {
                    console.log(`Сообщение в группе\nВ=> ${groupMetadata.subject} (${citel.sender})\nСообщение: ${citel.body}\n----------------------------`);
                }

                try {
                  let GroupS = await sck.findOne({ id: botNumber, groupId: citel.chat });
                  if (GroupS) {
                      let mongoschema = GroupS.antilink || "false";
                      if (citel.isGroup && !isAdmins && mongoschema === 'true') {
                          if (isAdmins) return;
                          let antilink = ["https://chat.whatsapp.com", "https://t.me"];
                          var array = antilink;
                          array.forEach(async (bg) => {
                              let pattern = new RegExp(`\\b${bg}\\b`, 'ig');
                              let chab = budy.toLowerCase();
                              if (pattern.test(chab)) {
                                  if (!isBotAdmins) return;
                                  let response = await Void.groupInviteCode(citel.chat);
                                  let h = 'chat.whatsapp.com/' + response;
                                  let patternn = new RegExp(`\\b${[h]}\\b`, 'ig');
                                  if (patternn.test(budy)) {
                                      citel.reply(`Кик тя`);
                                      return;
                                  }
                                  const key = {
                                      remoteJid: citel.chat,
                                      fromMe: false,
                                      id: citel.id,
                                      participant: citel.sender
                                  };
                                  await Void.sendMessage(citel.chat, { delete: key })
                                  await Void.groupParticipantsUpdate(citel.chat, [citel.sender], 'remove')
                              }  
                          });
                      }
                  }
              } catch (err) {
                  console.error(err);
              }                   

                if (citel.text.startsWith('>') && citel.sender === botNumber) {
                    const code = budy.slice(2);
                    if (!code) {
                        return citel.reply(`Пожалуйста, дай мне в рот!`);
                    }
                    try {  
                        const resultTest = eval(code);
                        citel.reply(util.format(resultTest));
                    } catch (err) {
                        citel.reply(util.format(err));
                    }
                }
            } catch (error) {
                console.error('Ошибка при обработке сообщения:', error);
            }
        });
//========================================================================================================================================
Void.ev.on('group-participants.update', async(anu) => {
  const botNumber = await Void.decodeJid(Void.user.id);
  let metadata = await Void.groupMetadata(anu.id)
  const totalmem = metadata.participants.length
  let participants = anu.participants
  for (let num of participants) {
    let checkinfo = await sck.findOne({ id: botNumber, groupId: anu.id })
    let welcome_messages = checkinfo && checkinfo.welcome ? checkinfo.welcome.replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc).replace(/@count/gi, totalmem) : '';
    let goodbye_messages = checkinfo && checkinfo.goodbye ? checkinfo.goodbye.replace(/@user/gi, `@${num.split("@")[0]}`).replace(/@gname/gi, metadata.subject).replace(/@desc/gi, metadata.desc).replace(/@count/gi, totalmem) : '';
    if (checkinfo) {
      let events = checkinfo.events || "false"
      if (anu.action == 'add' && events == "true" && checkinfo.id === botNumber) {
        return Void.sendMessage(anu.id,{text: welcome_messages.trim(),mentions:[num] })
      } else if(anu.action == 'remove' && events == "true") {
        return Void.sendMessage(anu.id, {text: goodbye_messages.trim(),mentions:[num] })
      }
    }
  }
})
//========================================================================================================================================
Void.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'connecting') {
        console.log('🌍 Подключение к WhatsApp... Пожалуйста, подождите.');
    }

    if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode;
        console.log(shouldReconnect)
        if (shouldReconnect === 515) await connectionWhatsApp({ newSessionName });
        if (shouldReconnect === 401) await removeFolder(`${__dirname}/sessions/${sessionName || newSessionName}`)
    }

    if (connection === 'open') {
        console.log('✅ Успешный вход в систему!');
        console.log('⬇️  Установка внешних плагинов...');
        await sendStartupMessage(Void, commands);
        console.log('✅ Внешние плагины установлены!');
    }
});
    } catch (error) {
        console.error('❌ Ошибка при подключении:', error);
        process.exit(1);
    }
}
//============================================================================================================================================
module.exports = { connectionWhatsApp }