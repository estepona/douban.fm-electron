import { app, BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: Electron.BrowserWindow | undefined;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, "../asset/index.html"));

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!mainWindow) {
    createWindow();
  }
});
