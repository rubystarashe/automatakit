process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname
const nuxt = new Nuxt(config)
const server = http.createServer(nuxt.render)

if (config.dev) {
	new Builder(nuxt).build()
}

const { port } = require('./config.js')
server.listen(port.main)
const _NUXT_URL_ = `http://localhost:${port.main}`
console.log(`Nuxt on ${_NUXT_URL_}`)

const setupEvents = require('./squirrel')
if (setupEvents.handleSquirrelEvent()) {
   return
}

const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
	let win = new electron.BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    skipTaskbar: false,
    toolbar: false,
		icon: path.join(__dirname, 'static/icon.png')
  })
  win.on('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
  })
  win.on('closed', () => win = null)
	if (config.dev) {
	  !function pollServer() {
			http.get(_NUXT_URL_, res => {
				if (res.statusCode === 200) {
          win.loadURL(_NUXT_URL_)
        } else {
          setTimeout(pollServer, 300)
        }
      })
      .on('error', pollServer)
		}()
	} else {
    return win.loadURL(_NUXT_URL_)
  }
}

app.on('ready', () => {
  if (config.dev) require('vue-devtools').install()
  newWin()
})
app.on('window-all-closed', () => app.quit())
