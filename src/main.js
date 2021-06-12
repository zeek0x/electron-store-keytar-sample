const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron')
const {initialize, saveAccount, getAccount} = require('./store');

app.whenReady().then(async () => {
  const store = await initialize();

  ipcMain.handle('account', (event, username, password) => {
    saveAccount({username, password}, store);
  });

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  await win.loadFile('templates/index.html')
  win.webContents.send('account', getAccount(store));
});
