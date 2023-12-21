const fs = require('fs-extra')
if (fs.existsSync('config.env')) require('dotenv').config({ path: __dirname+'/config.env' })
const numOwner = "79290953745,79290955706,79040251094"

global.owner = numOwner.split(",");
global.usePairingCode = true

global.prefix = "/"
global.released = "0.9"
global.ow = "79290953745"

global.mongodb = "mongodb+srv://user:user123@cluster0.vfzprmo.mongodb.net/?retryWrites=true&w=majority"

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Обновлено'${__filename}'`)
    delete require.cache[file]
	require(file)
})