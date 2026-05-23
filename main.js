const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: "AI Integration Architecture Toolkit",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  // Custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: "File / 文件",
      submenu: [
        { label: "New Model / 新建模型", accelerator: "CmdOrCtrl+N", click: () => mainWindow.webContents.send("menu-new") },
        { label: "Open .archimate / 打开模型", accelerator: "CmdOrCtrl+O", click: () => handleOpen() },
        { type: "separator" },
        { label: "Save / 保存", accelerator: "CmdOrCtrl+S", click: () => mainWindow.webContents.send("menu-save") },
        { label: "Export .archimate / 导出模型", accelerator: "CmdOrCtrl+E", click: () => mainWindow.webContents.send("menu-export") },
        { type: "separator" },
        { role: "quit", label: "Quit / 退出" },
      ],
    },
    {
      label: "Tools / 工具",
      submenu: [
        { label: "Run Compliance Check / 运行合规检查", accelerator: "CmdOrCtrl+K", click: () => mainWindow.webContents.send("menu-compliance") },
        { type: "separator" },
        { label: "Developer Tools", accelerator: "F12", click: () => mainWindow.webContents.openDevTools() },
      ],
    },
    {
      label: "Help / 帮助",
      submenu: [
        { label: "About / 关于", click: () => mainWindow.webContents.send("menu-about") },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

// ── IPC Handlers ──────────────────────────────────────────────────────────

// Open .archimate file
async function handleOpen() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Open ArchiMate Model / 打开ArchiMate模型",
    filters: [{ name: "ArchiMate Model", extensions: ["archimate"] }],
    properties: ["openFile"],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    const content = fs.readFileSync(result.filePaths[0], "utf8");
    mainWindow.webContents.send("file-opened", { path: result.filePaths[0], content });
  }
}
ipcMain.handle("open-file", handleOpen);

// Save .archimate file
ipcMain.handle("save-file", async (event, { content, defaultName }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Save ArchiMate Model / 保存模型",
    defaultPath: defaultName || "my-ai-model.archimate",
    filters: [{ name: "ArchiMate Model", extensions: ["archimate"] }],
  });
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, content, "utf8");
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

// Show error dialog
ipcMain.handle("show-error", async (event, { title, message }) => {
  await dialog.showMessageBox(mainWindow, {
    type: "error", title, message, buttons: ["OK"],
  });
});

// Show info dialog
ipcMain.handle("show-info", async (event, { title, message }) => {
  await dialog.showMessageBox(mainWindow, {
    type: "info", title, message, buttons: ["OK"],
  });
});

// Show confirm dialog
ipcMain.handle("show-confirm", async (event, { title, message }) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: "question", title, message, buttons: ["Cancel / 取消", "OK / 确定"], defaultId: 1,
  });
  return result.response === 1;
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
