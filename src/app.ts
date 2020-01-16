import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  let win = new BrowserWindow({
    width: 1500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile('./main.html');

  win.webContents.openDevTools();
};

app.on('ready', createWindow);
