const { cmd } = require('./startCmd.js');

//==============Функции=================
const functions = {
    getAdmin: async (Void, citel) => {
        var adminn = await Void.groupMetadata(citel.chat);
        a = [];
        for (let i of adminn.participants) {
            if (i.admin == null) continue;
            a.push(i.id);
        }
        return a;
    }
};

//======================Все функции SamPandey=============
const {
    unixTimestampSecond,
    generateMessageTag,
    processTime,
    getBuffer,
    fetchJson,
    runtime,
    clockString,
    sleep,
    isUrl,
    getTime,
    formatDate,
    formatp,
    jsonformat,
    logic,
    generateProfilePicture,
    bytesToSize,
    getSizeMedia,
    parseMention,
    GIFBufferToVideoBuffer,
    smsg,
} = require('./samfuncn.js')

const {
    Insta,
    getString,
    tlang
} = require('./scraper.js')

//===========================================Мои функции===========
const {  
    removeFolder,
    sendStartupMessage,
    updateMessageCounter
} = require('./myfuncn.js')
//=====================DataBase Const===========
const { sck } = require(__dirname + '/database/group')
const { sck1 } = require(__dirname + '/database/user')
const { misc } = require(__dirname + '/database/misc')
const { code } = require(__dirname + '/database/code')
const { counter } = require(__dirname + '/database/counter')
//======================Export
module.exports = { 
cmd, 
...functions,
sck,
sck1,
misc,
code,
counter,
generateMessageTag,
processTime,
getBuffer,
fetchJson,
runtime,
clockString,
sleep,
isUrl,
getTime,
formatDate,
formatp,
jsonformat,
logic,
generateProfilePicture,
bytesToSize,
getSizeMedia,
parseMention,
GIFBufferToVideoBuffer,
updateMessageCounter,
smsg,
sendStartupMessage,
removeFolder,
Insta,
getString,
tlang,
isInstaUrl: (url) => {
    /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(
        url
    );
},
}; 