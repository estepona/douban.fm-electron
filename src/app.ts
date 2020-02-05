import * as dotenv from 'dotenv';
import { app, ipcMain, screen, BrowserWindow, Event } from 'electron';

import * as config from './config';
import { doubanApiClient } from './api';
import { readAuth } from './util/auth';

dotenv.config();

// TODO: put all channels as enum

/**
 * fn
 */

const loginToDouban = async (win: BrowserWindow) => {
  let authInfo = readAuth();

  if (authInfo) {
    doubanApiClient.setAccessToken(authInfo.access_token);

    const likedSongs = await doubanApiClient.getLikedSongs();
    if (!likedSongs) {
      win.webContents.send(config.ipcChannels.app.notLoggedIn);
    } else {
      win.webContents.send(config.ipcChannels.app.loggedIn);
    }
  }

  await doubanApiClient.getAndSetCookie();
};

/**
 * window
 */

const createMainWindow = (): BrowserWindow => {
  const primaryResolution = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: process.env.NODE_ENV === 'dev' ? 1500 : 300 + 16,
    height: process.env.NODE_ENV === 'dev' ? 600 : 60 + 16,

    x: primaryResolution.width / 2 - (300 + 16) / 2,
    y: primaryResolution.height / 10,

    title: config.general.appName,

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

  return win;
};

/**
 * ipc
 */

ipcMain.on('main:openOptionMenu', (event: Event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  // optionMenu.popup({
  //   window: win,
  // });
});

/**
 * app
 */

const initApp = async () => {
  const win = createMainWindow();

  try {
    await loginToDouban(win);
  } catch {
    console.log('failed to login');
  }
};

app.on('ready', initApp);
