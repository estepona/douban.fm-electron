import * as path from 'path';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { app, ipcMain, screen, shell, BrowserWindow, Event, Menu, MenuItem } from 'electron';

import * as config from './config';
import { doubanApiClient, githubApiClient } from './api';
import { getNextSong } from './ipc/main';
import { buildDoubanSelectedMenu, OptionMenuItems } from './menu/option_menu';
import { readAuth, resetAuth, writeAuth } from './util/auth';

dotenv.config();

export let authInfo = readAuth();

/**
 * window
 */
export let mainWindow: BrowserWindow | null = null;
export let loginWindow: BrowserWindow | null = null;
export let checkUpdateWindow: BrowserWindow | null = null;

const appIconPath = path.join(__dirname, '..', 'build', 'icon.png');
const mainHtmlPath = path.join(__dirname, '..', 'src', 'window', 'main', 'main.html');
const loginHtmlPath = path.join(__dirname, '..', 'src', 'window', 'login', 'login.html');
const checkUpdateHtmlPath = path.join(__dirname, '..', 'src', 'window', 'check_update', 'check_update.html');

export let likedSongs: LikedSongs | null = null;
export const recChannels: RecChannels | null = null;

const createMainWindow = async () => {
  if (authInfo) {
    doubanApiClient.setAccessToken(authInfo.access_token);

    likedSongs = await doubanApiClient.getLikedSongs();
    if (!likedSongs) {
      authInfo = null;
    }
  }

  await doubanApiClient.getAndSetCookie();

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

export const createLoginWindow = () => {
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

export const createCheckUpdateWindow = () => {
  checkUpdateWindow = new BrowserWindow({
    width: 300 + 16,
    height: 120 + 16,

    title: 'douban.fm检查更新',
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

  checkUpdateWindow.loadFile(checkUpdateHtmlPath);

  checkUpdateWindow.on('closed', () => {
    checkUpdateWindow = null;
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

      optionMenu.items[OptionMenuItems.Login].enabled = true;
      optionMenu.items[OptionMenuItems.Logout].enabled = false;
      optionMenu.items[OptionMenuItems.Me].enabled = false;
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
                  likedSongs = await doubanApiClient.getLikedSongs();
                }

                const playerState = await getNextSong(
                  {
                    channel: 'liked',
                  },
                  likedSongs,
                );

                mainWindow.webContents.send('main:receiveNextSong', playerState);

                // 我的 -> 红心 -> 顺序
                // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items[0].checked = true;
                // 我的 -> 红心 -> 随机
                // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items[1].checked = false;
                // 我的 -> 兆赫 -> 豆瓣精选
                // optionMenu.items[OptionMenuItems.FMs].submenu.items[0].checked = false;
                // 我的 -> 兆赫 -> 豆瓣推荐
                // optionMenu.items[OptionMenuItems.FMs].submenu.items[1].submenu.items.forEach(aggCh => {
                // aggCh.submenu.items.forEach(ch => (ch.checked = false));
                // });
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
                  likedSongs = await doubanApiClient.getLikedSongs();
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
                // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items[0].checked = false;
                // 我的 -> 红心 -> 随机
                // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items[1].checked = true;
                // 我的 -> 兆赫 -> 豆瓣精选
                // optionMenu.items[OptionMenuItems.FMs].submenu.items[0].checked = false;
                // 我的 -> 兆赫 -> 豆瓣推荐
                // optionMenu.items[OptionMenuItems.FMs].submenu.items[1].submenu.items.forEach(aggCh => {
                //   aggCh.submenu.items.forEach(ch => (ch.checked = false));
                // });
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
              song: await doubanApiClient.getDoubanSelectedSong(true),
            });

            // 我的 -> 红心
            // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items.forEach(m => (m.checked = false));
            // 我的 -> 兆赫 -> 豆瓣精选
            // optionMenu.items[OptionMenuItems.FMs].submenu.items[0].checked = true;
            // 我的 -> 兆赫 -> 豆瓣推荐
            // optionMenu.items[OptionMenuItems.FMs].submenu.items[1].submenu.items.forEach(aggCh => {
            //   aggCh.submenu.items.forEach(ch => (ch.checked = false));
            // });
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
    type: 'separator',
  }),
);
optionMenu.append(
  new MenuItem({
    label: '刷新',
    accelerator: 'CommandOrControl+R',
    click: async () => {
      if (mainWindow) {
        const playerState = await getNextSong(null, likedSongs);
        mainWindow.webContents.send('main:receiveNextSong', playerState);

        // 我的 -> 红心
        // optionMenu.items[OptionMenuItems.Me].submenu.items[1].submenu.items.forEach(m => (m.checked = false));
        // 我的 -> 兆赫 -> 豆瓣精选
        // optionMenu.items[OptionMenuItems.FMs].submenu.items[0].checked = true;

        // refresh DoubanSelected
        await buildDoubanSelectedMenu(mainWindow, optionMenu);
      }
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '置顶',
    type: 'checkbox',
    checked: isMainWindowSetTop,
    accelerator: 'CommandOrControl+E',
    click: () => {
      mainWindow && mainWindow.setAlwaysOnTop(!isMainWindowSetTop);
      isMainWindowSetTop = !isMainWindowSetTop;
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '检查更新',
    click: async () => {
      !checkUpdateWindow && createCheckUpdateWindow();
      checkUpdateWindow && checkUpdateWindow.show();

      const res = await githubApiClient.getReleases();
      const msg = ['检查更新失败'];

      if (res.length) {
        if (res[0].tag_name !== config.general.appVersion) {
          msg[0] = '新版本可供下载';
          msg.push(res[0].tag_name);
          msg.push(res[0].html_url);
        } else {
          msg[0] = '已是最新版本';
        }
      }

      setTimeout(() => {
        checkUpdateWindow && checkUpdateWindow.webContents.send('checkUpdate:result', msg);
      }, 200);
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '重启',
    accelerator: 'CommandOrControl+L',
    click: () => {
      app.relaunch();
      app.quit();
    },
  }),
);
optionMenu.append(
  new MenuItem({
    label: '退出',
    accelerator: 'CommandOrControl+Q',
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
    authInfo = await doubanApiClient.login(vals[0], vals[1]);
    writeAuth(authInfo);

    optionMenu.items[OptionMenuItems.Login].enabled = false;
    optionMenu.items[OptionMenuItems.Logout].enabled = true;
    optionMenu.items[OptionMenuItems.Me].enabled = true;

    mainWindow && mainWindow.webContents.send('login:success');

    if (mainWindow) {
      await buildDoubanSelectedMenu(mainWindow, optionMenu);
    }
  } catch (error) {
    mainWindow && mainWindow.webContents.send('login:fail', error.message);
  }
});

ipcMain.on('login:close', () => {
  if (loginWindow) {
    loginWindow.close();
    loginWindow = null;
  }
});

// ipcMain.on('main:openOptionMenu', (event: Event) => {
//   const win = BrowserWindow.fromWebContents(event.sender);
//   optionMenu.popup({
//     window: win,
//   });
// });

ipcMain.on('main:refresh', async (event: Event) => {
  await optionMenu.items[OptionMenuItems.Refresh].click();
});

ipcMain.on('main:setWindowOnTop', (event: Event) => {
  optionMenu.items[OptionMenuItems.SetTop].click();
});

ipcMain.on('main:relaunch', (event: Event) => {
  optionMenu.items[OptionMenuItems.Relaunch].click();
});

ipcMain.on('main:quit', (event: Event) => {
  optionMenu.items[OptionMenuItems.Quit].click();
});

ipcMain.on('main:getNextSong', async (event: Event, val: PlayerState | null) => {
  if (val && val.channel === 'liked') {
    likedSongs = await doubanApiClient.getLikedSongs();
  }

  const playerState = await getNextSong(val, likedSongs);

  // event.sender.send('main:receiveNextSong', playerState);
  mainWindow && mainWindow.webContents.send('main:receiveNextSong', playerState);
});

ipcMain.on('main:likeSong', async (event: Event, val: PlayerState | null) => {
  if (authInfo && val && val.song && val.song.sid) {
    await doubanApiClient.likeSong(val.song.sid);
  }
});

ipcMain.on('main:unlikeSong', async (event: Event, val: PlayerState | null) => {
  if (authInfo && val && val.song && val.song.sid) {
    await doubanApiClient.unlikeSong(val.song.sid);
  }
});

ipcMain.on('checkUpdate:close', () => {
  if (checkUpdateWindow) {
    checkUpdateWindow.close();
    checkUpdateWindow = null;
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
      song = await doubanApiClient.getDoubanSelectedSong(true);
    }

    mainWindow.webContents.send('main:receiveNextSong', {
      channel: -10,
      song,
    });

    // tell other pages user logged in
    if (authInfo) {
      mainWindow.webContents.send('main:login');
    }

    // build douban selected menu
    await buildDoubanSelectedMenu(mainWindow, optionMenu);
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
