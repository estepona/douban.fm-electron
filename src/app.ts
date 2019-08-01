import * as dotenv from 'dotenv';
import { app, BrowserWindow, Event, ipcMain, Menu, screen as Screen, WebContents, MenuItem } from 'electron';
import * as path from 'path';

import apiClient from './api/apiClient';
import { readAuth, writeAuth, resetAuth } from './util/auth';

dotenv.config();

let authInfo = readAuth();

/**
 * window
 */
let mainWindow: BrowserWindow | null;
let loginWindow: BrowserWindow | null;

const createMainWindow = async () => {
  if (authInfo) {
    apiClient.setAccessToken(authInfo.access_token);

    const redheartSongs = await apiClient.getRedheartSongs();
    if (!redheartSongs) {
      authInfo = null;
    }
  }

  const primaryResoultion = Screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 300 + 16,
    height: 60 + 16,

    x: primaryResoultion.width / 2 - (300 + 16) / 2,
    y: primaryResoultion.height / 10,

    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'window', 'main', 'main.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 300 + 16,
    height: 100 + 16,

    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  loginWindow.loadFile(path.join(__dirname, '..', 'src', 'window', 'login', 'login.html'));
};

/**
 * menu
 */
const optionMenu = new Menu();

let isMainWindowSetTop = false;

optionMenu.append(
  new MenuItem({
    label: '登录',
    enabled: !authInfo,
    click: () => {
      !loginWindow && createLoginWindow();
      loginWindow && loginWindow.show();
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '登出',
    enabled: authInfo !== null,
    click: () => {
      resetAuth();
      authInfo = null;

      // enable login
      optionMenu.items[0].enabled = true;
      // disable logout
      optionMenu.items[1].enabled = false;
      // digable personal
      optionMenu.items[3].enabled = false;
    },
  }),
);
optionMenu.append(
  new MenuItem({
    type: 'separator',
  }),
);
optionMenu.append(
  new MenuItem({
    label: '我的',
    enabled: authInfo !== null,
    submenu: [
      {
        label: '私人',
      },
      {
        label: '红心',
      },
    ],
  }),
);
optionMenu.append(
  new MenuItem({
    label: '兆赫',
    submenu: [
      {
        label: '豆瓣精选',
        type: 'checkbox',
        checked: true,
      },
    ],
  }),
);
optionMenu.append(
  new MenuItem({
    type: 'separator',
  }),
);
optionMenu.append(
  new MenuItem({
    label: 'GitHub',
  }),
);
optionMenu.append(
  new MenuItem({
    label: 'Sponsor',
  }),
);
optionMenu.append(
  new MenuItem({
    type: 'separator',
  }),
);
optionMenu.append(
  new MenuItem({
    label: '刷新',
  }),
);
optionMenu.append(
  new MenuItem({
    label: '置顶',
    type: 'checkbox',
    checked: isMainWindowSetTop,
    click: () => {
      mainWindow && mainWindow.setAlwaysOnTop(!isMainWindowSetTop);
      isMainWindowSetTop = !isMainWindowSetTop;
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '退出',
    accelerator: process.platform === 'win32' ? 'Alt+F4' : 'CommandOrControl+Q',
    click: () => {
      app.quit();
    },
  }),
);

/**
 * ipc communication
 */
ipcMain.on('user:login', async (event: Event, vals: string[]) => {
  authInfo = await apiClient.login(vals[0], vals[1]);
  writeAuth(authInfo);

  // const redheartSongs = await apiClient.getRedheartSongs();
  // console.log(redheartSongs);

  if (loginWindow) {
    loginWindow.close();
  }

  // disable login
  optionMenu.items[0].enabled = false;
  // enable logout
  optionMenu.items[1].enabled = true;
  // enable personal
  optionMenu.items[3].enabled = true;
});

ipcMain.on('player:getNextSong', async (event: Event, val: Song | null) => {
  let song: Song | null = null;

  if (val && val.sid) {
    song = await apiClient.getDoubanSelectedSong(false, val.sid);
  }

  while (!song) {
    song = await apiClient.getDoubanSelectedSong(true);
  }

  console.log(`prev: ${val && val.title}, next: song && song.title`);

  event.sender.send('player:receiveNextSong', song);
});

ipcMain.on('app:openOptionMenu', (event: Event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  optionMenu.popup({
    window: win,
  });
});

/**
 * app
 */
app.on('ready', async () => {
  await createMainWindow();

  let song: Song | null = null;
  while (!song) {
    song = await apiClient.getDoubanSelectedSong(true);
  }

  console.log(`new song: ${song.title}`);
  mainWindow && mainWindow.webContents.send('player:receiveNextSong', song);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    await createMainWindow();
  }
});
