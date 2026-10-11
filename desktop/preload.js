// The only things the game page can ask the desktop app to do.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{
  quit:()=>ipcRenderer.send('quit'),
  load:()=>ipcRenderer.sendSync('save:load'),          // the save file's text, or null
  save:text=>ipcRenderer.send('save:write',text),     // written atomically to the user's app-data folder
  savePath:()=>ipcRenderer.sendSync('save:path'),
});
