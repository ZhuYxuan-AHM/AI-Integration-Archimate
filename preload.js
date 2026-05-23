const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile:    ()              => ipcRenderer.invoke("open-file"),
  saveFile:    (opts)          => ipcRenderer.invoke("save-file", opts),
  showError:   (title, msg)    => ipcRenderer.invoke("show-error",   { title, message: msg }),
  showInfo:    (title, msg)    => ipcRenderer.invoke("show-info",    { title, message: msg }),
  showConfirm: (title, msg)    => ipcRenderer.invoke("show-confirm", { title, message: msg }),

  // Menu events → renderer
  onMenuNew:        (cb) => ipcRenderer.on("menu-new",        cb),
  onMenuSave:       (cb) => ipcRenderer.on("menu-save",       cb),
  onMenuExport:     (cb) => ipcRenderer.on("menu-export",     cb),
  onMenuCompliance: (cb) => ipcRenderer.on("menu-compliance", cb),
  onMenuAbout:      (cb) => ipcRenderer.on("menu-about",      cb),
  onFileOpened:     (cb) => ipcRenderer.on("file-opened",     cb),
});
