const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    copyToClipboard: (data) => ipcRenderer.invoke('copy-to-clipboard', data),
    pasteFromClipboard: () => ipcRenderer.invoke('paste-from-clipboard'),

    quickCopySelect: (data) => ipcRenderer.invoke('quick-copy-select', data),
    ipcQuickCopySelect : (data) => ipcRenderer.invoke('ipc-quick-copy-select', data),
    variableCopySelect: (data) => ipcRenderer.invoke('variable-copy-select', data),

    callbackCopyHandler: (data) => ipcRenderer.invoke('callback-copy-handler', data),
})