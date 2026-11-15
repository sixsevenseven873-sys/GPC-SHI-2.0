const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dsc', {
  user: (id, token) => ipcRenderer.invoke('dsc:user', id, token),
  invite: (code) => ipcRenderer.invoke('dsc:invite', code)
});
