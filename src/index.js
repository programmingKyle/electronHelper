const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: false,
    icon: path.join(__dirname, './required/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false,

  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('callback-copy-handler', (req, data) => {
  if (!data || !data.request) return;
  let content;

  const ipcNameSplit = data.name.split(/(?=[A-Z])/);
  const ipcNameHandle = ipcNameSplit.join('-').toLowerCase();

  switch (data.request){
    case 'send':
      content = `mainWindow.webContents.send('${ipcNameHandle}', 'Message');`
      break;

    case 'preload':
      content = 
      `${data.name}: (callback) => {
        ipcRenderer.on('${ipcNameHandle}', (_, status) => {
            callback(status);
        });
    },`;
      break;

    case 'view':
      content = 
      `api.${data.name}((status) => {
        console.log(status);
    });`
      break;
  }

  clipboard.writeText(content);
});

ipcMain.handle('copy-to-clipboard', async (req, data) => {
  clipboard.writeText(data);
});

ipcMain.handle('paste-from-clipboard', async (event) => {
  const text = clipboard.readText();
  return text;
});

ipcMain.handle('quick-copy-select', async (req, data) => {
  if (!data) return;
  let content = '';
  switch (data){
    case "DOMContentLoaded":
      content = `document.addEventListener('DOMContentLoaded', () => {\n\n});`;
      break;
    case "Preload":
      content = `const { contextBridge, ipcRenderer } = require('electron');\n\ncontextBridge.exposeInMainWorld('api', {\n\n});`;
      break;
    case "AddEventListener":
      content = `button.addEventListener('click', () => {\n\n})`;
      break;
    case "SetTimeout":
      content = `setTimeout(() => {
        console.log('Execute code here');\n}, 1000);`;
      break;
    case "TryCatch":
      content = `try {
        console.log('Execute code here'); \n} catch (error) {
        console.error(error);\n}`
      break;
    case 'Promise':
      content = `return new Promise((resolve, reject) => {

      });`;
      break;
    case 'OpenFileFolder':
      content = `
      const { dialog } = require('electron');

      dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] })
        .then((result) => {
          if (!result.canceled) {
            const filePath = result.filePaths[0];
            // Handle the selected file
          }
        })
        .catch((err) => {
          console.error(err);
      });
      `
      break;
    case 'Clipboard':
      content = `
      const { clipboard } = require('electron');\n
      clipboard.writeText('Text to copy');\n
      const clipboardText = clipboard.readText();
      `
      break;
  }
  clipboard.writeText(content);
});

ipcMain.handle('ipc-quick-copy-select', async (req, data) => {
  if ( !data || !data.request || !data.ipcName ) return;
  const ipcNameSplit = data.ipcName.split(/(?=[A-Z])/);
  const ipcNameHandle = ipcNameSplit.join('-').toLowerCase();

  switch (data.request){
    case "preload":
      const preloadLine = `${data.ipcName}: (${data.needData ? 'data' : ''}) => ipcRenderer.invoke('${ipcNameHandle}'${data.needData ? ', data': ''}),`;
      clipboard.writeText(preloadLine);
      break;
    case "ipcMain":
      const ipcMainFunction = `ipcMain.handle('${ipcNameHandle}', ${data.async ? 'async' : ''}(${data.needData ? 'req, data' : ''}) => {\n\n});`;
      clipboard.writeText(ipcMainFunction);
      break;
  }
});

ipcMain.handle('variable-copy-select', async (req, data) => {
  if (!data || !data.request || !data.variableName) return;
  switch (data.request) {
    case "AddEventListener":
      const eventListener = `${data.variableName}.addEventListener('click', () => {\n\n});`
      clipboard.writeText(eventListener);
      break;
  }
});
