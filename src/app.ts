import * as dotenv from "dotenv";
import { app, BrowserWindow, Event, ipcMain, ipcRenderer, Menu, WebContents } from "electron";
import * as path from "path";

import apiClient from "./apiClient";
import { readAuth, writeAuth } from "./auth";

dotenv.config();

let authInfo = readAuth();

let mainWindow: Electron.BrowserWindow | null;
let loginWindow: BrowserWindow | null;

const createWindow = async () => {
  if (authInfo) {
    apiClient.setAccessToken(authInfo.access_token);

    const redheartSongs = await apiClient.getRedheartSongs();
    if (!redheartSongs) {
      authInfo = null;
    }
  }

  // await apiClient.login("sorrow1234", "1234qwer");
  // const redheartSongs = await apiClient.getRedheartSongs();
  // console.log(redheartSongs);

  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../asset/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const menuTemplate: Array<Electron.MenuItemConstructorOptions | Electron.MenuItem | {}> = [
  {
    label: "菜单",
    submenu: [
      {
        label: "登录",
        click: () => {
          loginWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: "Log In",
            webPreferences: {
              nodeIntegration: true,
            },
          });

          loginWindow.loadFile(path.join(__dirname, "../asset/login.html"));

          loginWindow.on("closed", () => {
            loginWindow = null;
          });
        },
        // create log in window
      },
      {
        label: "登出",
      },
      {
        label: "退出",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Alt+F4",
        click: () => {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV === "dev") {
  menuTemplate.push({
    label: "dev",
    submenu: [
      {
        label: "togger dev tools",
        click: (item, focusedWindow) => {
          focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  });
}

ipcMain.on("login", async (event: Event, vals: string[]) => {
  const authInfo = await apiClient.login(vals[0], vals[1]);
  writeAuth(authInfo);

  const redheartSongs = await apiClient.getRedheartSongs();
  console.log(redheartSongs);

  if (loginWindow) {
    loginWindow.close();
  }
});

ipcMain.on("player:getNextSong", async (event: Event, val: ISong | null) => {
  const song = await apiClient.getDoubanSelectedSong(!val, !val ? undefined : val.sid);

  console.log(111, !val ? "no sid" : val.sid, song.sid);

  event.sender.send("player:receiveNextSong", song);
});

app.on("ready", async () => {
  await createWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (!mainWindow) {
    await createWindow();
  }
});