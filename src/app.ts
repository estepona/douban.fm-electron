import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

import apiClient from "./ApiClient";

let mainWindow: Electron.BrowserWindow | null;

const createWindow = async () => {
  // await apiClient.login("sorrow1234", "1234qwer");
  // const redheartSongs = await apiClient.getRedheartSongs();
  // console.log(redheartSongs);

  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    // frame: false,
  });

  mainWindow.loadFile(path.join(__dirname, "../asset/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

const menuTemplate = [
  {
    label: "App",
    submenu: [
      {
        label: "Log In",
        click() {
          let loginWindow: BrowserWindow | null = new BrowserWindow({
            width: 300,
            height: 200,
            title: "Log In",
          });

          loginWindow.loadFile(path.join(__dirname, "../asset/login.html"));

          loginWindow.on("closed", () => {
            loginWindow = null;
          });
        },
        // create log in window
      },
      {
        label: "Log Out",
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Alt+F4",
        click() {
          app.quit();
        },
      },
    ],
  },
];

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
