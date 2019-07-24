import { app, BrowserWindow } from "electron";
import * as path from "path";

import apiClient from "./ApiClient";

let mainWindow: Electron.BrowserWindow | null;

const createWindow = async () => {
  await apiClient.login("sorrow1234", "1234qwer");

  const redheartSongs = await apiClient.getRedheartSongs();

  console.log(redheartSongs);

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

app.on("ready", async () => {
  await createWindow();
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
