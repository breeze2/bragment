import path from 'path';
import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;
const isWindows = process.platform === 'win32';

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      // NOTE: only dev mode
      webSecurity: app.isPackaged,
      webviewTag: true,
    },

    frame: !isWindows,
    minHeight: 600,
    minWidth: 960,

    // icon: path.join(__dirname, './icons/png/256x256.png'),
    show: false,
    titleBarStyle: 'hiddenInset',
    // vibrancy: 'header',
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '/../build/index.html'));
  } else {
    // const {
    //   default: installExtension,
    //   REACT_DEVELOPER_TOOLS,
    //   REDUX_DEVTOOLS,
    // } = require('electron-devtools-installer');
    // installExtension(REACT_DEVELOPER_TOOLS)
    //   .then((name: string) => console.info(`Added Extension:  ${name}`))
    //   .catch((err: any) => console.error('An error occurred: ', err));
    // installExtension(REDUX_DEVTOOLS)
    //   .then((name: string) => console.info(`Added Extension:  ${name}`))
    //   .catch((err: any) => console.error('An error occurred: ', err));

    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.maximize();
      mainWindow.show();
    }
  });
}

app.on('ready', createWindow);
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
