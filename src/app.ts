import * as path from 'path';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { app, BrowserWindow, Event, ipcMain, Menu, MenuItem, screen, shell } from 'electron';

import * as config from './config';
import apiClient from './api/client';
import { getNextSong } from './ipc/main';
import { buildDoubanSelectedMenu } from './menu/option_menu';
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

let likedSongs: LikedSongs | null = null;
let recChannels: RecChannels | null = null;

const createMainWindow = async () => {
  if (authInfo) {
    apiClient.setAccessToken(authInfo.access_token);

    likedSongs = await apiClient.getLikedSongs();
    if (!likedSongs) {
      authInfo = null;
    }
  }

  await apiClient.getAndSetCookie();

  const primaryResoultion = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 300 + 16,
    height: 60 + 16,

    x: primaryResoultion.width / 2 - (300 + 16) / 2,
    y: primaryResoultion.height / 10,

    title: config.general.appName,
    icon: appIconPath,

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

    minimizable: false,
    maximizable: false,
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

      if (mainWindow) {
        // tell other pages user logged in
        mainWindow.webContents.send('main:login');
      }
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '登出',
    enabled: authInfo !== null,
    click: async () => {
      // logout
      resetAuth();
      authInfo = null;

      if (mainWindow) {
        // reset playerState to doubanSelectedSongs
        const playerState = await getNextSong(null, likedSongs);
        mainWindow.webContents.send('main:receiveNextSong', playerState);

        // tell other pages user logged out
        mainWindow.webContents.send('main:logout');
      }

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
        submenu: [
          {
            label: '顺序',
            type: 'checkbox',
            checked: false,
            click: async () => {
              if (mainWindow) {
                if (!likedSongs) {
                  likedSongs = await apiClient.getLikedSongs();
                }

                const playerState = await getNextSong(
                  {
                    channel: 'liked',
                  },
                  likedSongs,
                );

                mainWindow.webContents.send('main:receiveNextSong', playerState);

                // 我的 -> 红心 -> 顺序
                optionMenu.items[3].submenu.items[1].submenu.items[0].checked = true;
                // 我的 -> 红心 -> 随机
                optionMenu.items[3].submenu.items[1].submenu.items[1].checked = false;
                // 我的 -> 兆赫 -> 豆瓣精选
                optionMenu.items[4].submenu.items[0].checked = false;
                // 我的 -> 兆赫 -> 豆瓣推荐
                optionMenu.items[4].submenu.items[1].submenu.items.forEach(aggCh => {
                  aggCh.submenu.items.forEach(ch => (ch.checked = false));
                });
              }
            },
          },
          {
            label: '随机',
            type: 'checkbox',
            checked: false,
            click: async () => {
              if (mainWindow) {
                if (!likedSongs) {
                  likedSongs = await apiClient.getLikedSongs();
                }

                if (likedSongs) {
                  likedSongs.songs = _.shuffle(likedSongs.songs);
                }

                const playerState = await getNextSong(
                  {
                    channel: 'liked',
                  },
                  likedSongs,
                );

                mainWindow.webContents.send('main:receiveNextSong', playerState);

                // 我的 -> 红心 -> 顺序
                optionMenu.items[3].submenu.items[1].submenu.items[0].checked = false;
                // 我的 -> 红心 -> 随机
                optionMenu.items[3].submenu.items[1].submenu.items[1].checked = true;
                // 我的 -> 兆赫 -> 豆瓣精选
                optionMenu.items[4].submenu.items[0].checked = false;
                // 我的 -> 兆赫 -> 豆瓣推荐
                optionMenu.items[4].submenu.items[1].submenu.items.forEach(aggCh => {
                  aggCh.submenu.items.forEach(ch => (ch.checked = false));
                });
              }
            },
          },
        ],
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
        click: async () => {
          if (mainWindow) {
            mainWindow.webContents.send('main:receiveNextSong', {
              channel: -10,
              song: await apiClient.getDoubanSelectedSong(true),
            });

            // 我的 -> 红心
            optionMenu.items[3].submenu.items[1].submenu.items.forEach(m => (m.checked = false));
            // 我的 -> 兆赫 -> 豆瓣精选
            optionMenu.items[4].submenu.items[0].checked = true;
            // 我的 -> 兆赫 -> 豆瓣推荐
            optionMenu.items[4].submenu.items[1].submenu.items.forEach(aggCh => {
              aggCh.submenu.items.forEach(ch => (ch.checked = false));
            });
          }
        },
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
    click: async () => {
      if (mainWindow) {
        const playerState = await getNextSong(null, likedSongs);
        mainWindow.webContents.send('main:receiveNextSong', playerState);

        // 我的 -> 红心
        optionMenu.items[3].submenu.items[1].submenu.items.forEach(m => (m.checked = false));
        // 我的 -> 兆赫 -> 豆瓣精选
        optionMenu.items[4].submenu.items[0].checked = true;
      }
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '置顶',
    type: 'checkbox',
    checked: isMainWindowSetTop,
    accelerator: process.platform === 'win32' ? 'Alt+F2' : 'CommandOrControl+E',
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
    label: '重启',
    accelerator: process.platform === 'win32' ? 'Alt+F3' : 'CommandOrControl+L',
    click: () => {
      app.relaunch();
      app.quit();
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

    // refetch rec channels and populate menu
    if (mainWindow) {
      const doubanSelectedMenu = await buildDoubanSelectedMenu(mainWindow, optionMenu);

      if (optionMenu.items[4].submenu.items.length === 1) {
        optionMenu.items[4].submenu.append(
          new MenuItem({
            label: '豆瓣推荐',
            submenu: doubanSelectedMenu,
          }),
        );
      } else if (optionMenu.items[4].submenu.items.length === 2) {
        optionMenu.items[4].submenu.items[1] = new MenuItem({
          label: '豆瓣推荐',
          submenu: doubanSelectedMenu,
        });
      }
    }
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

ipcMain.on('main:openOptionMenu', (event: Event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  optionMenu.popup({
    window: win,
  });
});

ipcMain.on('main:refresh', async (event: Event) => {
  await optionMenu.items[9].click();
});

ipcMain.on('main:setWindowOnTop', (event: Event) => {
  optionMenu.items[10].click();
});

ipcMain.on('main:relaunch', (event: Event) => {
  optionMenu.items[12].click();
});

ipcMain.on('main:getNextSong', async (event: Event, val: PlayerState | null) => {
  if (val && val.channel === 'liked') {
    likedSongs = await apiClient.getLikedSongs();
  }

  const playerState = await getNextSong(val, likedSongs);

  event.sender.send('main:receiveNextSong', playerState);
});

ipcMain.on('main:likeSong', async (event: Event, val: PlayerState | null) => {
  if (authInfo && val && val.song && val.song.sid) {
    await apiClient.likeSong(val.song.sid);
  }
});

ipcMain.on('main:unlikeSong', async (event: Event, val: PlayerState | null) => {
  if (authInfo && val && val.song && val.song.sid) {
    await apiClient.unlikeSong(val.song.sid);
  }
});

/**
 * app
 */
app.on('ready', async () => {
  await createMainWindow();

  // macOS specific
  if (process.platform === 'darwin') {
    app.dock.setIcon(appIconPath);
  }

  if (mainWindow) {
    // play douban selected songs
    let song: Song | null = null;
    while (!song) {
      song = await apiClient.getDoubanSelectedSong(true);
    }

    mainWindow.webContents.send('main:receiveNextSong', {
      channel: -10,
      song,
    });

    // tell other pages user logged in
    if (authInfo) {
      mainWindow.webContents.send('main:login');
    }

    // fetch rec channels and populate menu
    const doubanSelectedMenu = await buildDoubanSelectedMenu(mainWindow, optionMenu);
    optionMenu.items[4].submenu.append(
      new MenuItem({
        label: '豆瓣推荐',
        submenu: doubanSelectedMenu,
      }),
    );
  }
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
