import * as dotenv from 'dotenv';
import { app, BrowserWindow, Event, ipcMain, Menu, MenuItem, screen, shell } from 'electron';
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

const appIconPath = path.join(__dirname, '..', 'src', 'asset', 'icon', 'doubanfm-icon-grey.png');
const mainHtmlPath = path.join(__dirname, '..', 'src', 'window', 'main', 'main.html');
const loginHtmlPath = path.join(__dirname, '..', 'src', 'window', 'login', 'login.html');

const createMainWindow = async () => {
  if (authInfo) {
    apiClient.setAccessToken(authInfo.access_token);

    const redheartSongs = await apiClient.getLikedSongs();
    if (!redheartSongs) {
      authInfo = null;
    }
  }

  const primaryResoultion = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 300 + 16,
    height: 60 + 16,

    x: primaryResoultion.width / 2 - (300 + 16) / 2,
    y: primaryResoultion.height / 10,

    title: 'douban.fm客户端',
    icon: appIconPath,

    transparent: true,
    frame: false,
    resizable: false,
    fullscreenable: false,

    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(mainHtmlPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createLoginWindow = () => {
  loginWindow = new BrowserWindow({
    width: 300 + 16,
    height: 120 + 16,

    title: 'douban.fm登录',
    icon: appIconPath,

    transparent: true,
    frame: false,
    resizable: false,
    fullscreenable: false,

    webPreferences: {
      nodeIntegration: true,
    },
  });

  loginWindow.loadFile(loginHtmlPath);

  loginWindow.on('closed', () => {
    loginWindow = null;
  });
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
    click: () => {
      shell.openExternal('https://github.com/estepona/douban.fm-electron');
    },
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
    accelerator: process.platform === 'win32' ? 'F5' : 'CommandOrControl+R',
  }),
);
optionMenu.append(
  new MenuItem({
    label: '置顶',
    type: 'checkbox',
    checked: isMainWindowSetTop,
    accelerator: process.platform === 'win32' ? 'Alt+F3' : 'CommandOrControl+E',
    click: () => {
      mainWindow && mainWindow.setAlwaysOnTop(!isMainWindowSetTop);
      isMainWindowSetTop = !isMainWindowSetTop;
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '检查更新',
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
 * ipc
 */
ipcMain.on('login:login', async (event: Event, vals: string[]) => {
  try {
    authInfo = await apiClient.login(vals[0], vals[1]);
    writeAuth(authInfo);

    // disable login
    optionMenu.items[0].enabled = false;
    // enable logout
    optionMenu.items[1].enabled = true;
    // enable personal
    optionMenu.items[3].enabled = true;

    event.sender.send('login:success');
  } catch (error) {
    event.sender.send('login:fail', error.message);
  }
});

ipcMain.on('login:close', () => {
  if (loginWindow) {
    loginWindow.close();
    loginWindow = null;
  }
});

ipcMain.on('main:getNextSong', async (event: Event, val: Song | null) => {
  let song: Song | null = null;

  if (val && val.sid) {
    song = await apiClient.getDoubanSelectedSong(false, val.sid);
  }

  while (!song) {
    song = await apiClient.getDoubanSelectedSong(true);
  }

  console.log(`prev: ${val && val.title}, next: ${song && song.title}`);

  event.sender.send('main:receiveNextSong', song);
});

ipcMain.on('main:openOptionMenu', (event: Event) => {
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
  mainWindow && mainWindow.webContents.send('main:receiveNextSong', song);
});

app.on('activate', async () => {
  if (!mainWindow) {
    await createMainWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
