import * as dotenv from 'dotenv';
import { app, BrowserWindow, screen } from 'electron';

dotenv.config();

/**
 * window
 */

const createMainWindow = () => {
  const primaryResolution = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: process.env.NODE_ENV === 'dev' ? 1500 : 300 + 16,
    height: process.env.NODE_ENV === 'dev' ? 600 : 60 + 16,

    x: primaryResolution.width / 2 - (300 + 16) / 2,
    y: primaryResolution.height / 10,

    transparent: true,
    frame: false,

    minimizable: false,
    maximizable: false,
    resizable: false,
    fullscreenable: false,

    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('./main.html');

  process.env.NODE_ENV === 'dev' && win.webContents.openDevTools();

  win.on('closed', () => {
    app.quit();
  });
};

app.on('ready', createMainWindow);
