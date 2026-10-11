// Bulk Season desktop app (Electron). Loads the same index.html as the web version.
const {app,BrowserWindow,ipcMain}=require('electron');
const path=require('path');
const fs=require('fs');

// One copy of the game at a time (two copies would overwrite each other's progress)
if(!app.requestSingleInstanceLock())app.quit();

// Saves live in a real file: %APPDATA%/Bulk Season/save.json (+ save.backup.json from the previous launch).
// This is also the file Steam Cloud would sync.
const saveFile=()=>path.join(app.getPath('userData'),'save.json');
const backupFile=()=>path.join(app.getPath('userData'),'save.backup.json');
ipcMain.on('save:load',e=>{try{const t=fs.readFileSync(saveFile(),'utf8');try{fs.writeFileSync(backupFile(),t);}catch(_){}e.returnValue=t;}catch(_){e.returnValue=null;}});
ipcMain.on('save:write',(e,text)=>{try{const tmp=saveFile()+'.tmp';fs.writeFileSync(tmp,text);fs.renameSync(tmp,saveFile());}catch(err){console.error('save failed',err);}});
ipcMain.on('save:path',e=>{e.returnValue=saveFile();});

const FPS_TEST=process.argv.includes('--fps-test')||process.argv.includes('--fps-vsync');const UNCAPPED=process.argv.includes('--fps-test');   // `npm run fps`: uncapped benchmark of a busy run, prints results and quits
if(FPS_TEST){app.setPath('userData',path.join(app.getPath('temp'),'bulk-season-fps-test'));if(UNCAPPED){app.commandLine.appendSwitch('disable-frame-rate-limit');app.commandLine.appendSwitch('disable-gpu-vsync');}}

function createWindow(){
  const win=new BrowserWindow({
    width:1600,height:900,minWidth:960,minHeight:540,
    fullscreen:!FPS_TEST,backgroundColor:'#120d0a',title:'Bulk Season',autoHideMenuBar:true,
    icon:path.join(__dirname,'icon.png'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),backgroundThrottling:false,contextIsolation:true}
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname,'..','index.html'),FPS_TEST?{hash:'debug'}:undefined);
  if(FPS_TEST)win.webContents.on('did-finish-load',async()=>{
    const r=await win.webContents.executeJavaScript(`new Promise(res=>{
      const S=BS.S;S.zones=BS.ZONES.map(z=>z.id);for(const z of BS.ZONES)S.sec[z.id]=5;S.zone="buffet";S.si=3;
      Object.assign(S.lv,{crowd:5,crowd2:5,drop:5,buddy:5,chain:5,bslam:5});BS.startRun();const R=BS.R;R.el=R.T;R.t=999;
      const times=[];let last=performance.now(),t0=last+2000;
      (function tick(now){if(now>t0)times.push(now-last);last=now;if(now-t0<6000)requestAnimationFrame(tick);else{times.sort((a,b)=>a-b);
        const P=(window.__perf||[]).slice(-times.length),avg=i=>(P.reduce((a,p)=>a+p[i],0)/P.length).toFixed(2),mx=i=>Math.max(...P.map(p=>p[i])).toFixed(1);res({upd:avg(0),updMax:mx(0),draw:avg(1),drawMax:mx(1),fps:Math.round(times.length/((now-t0)/1000)),slow:times.filter(x=>x>7).length,dropped:times.filter(x=>x>times[times.length>>1]*1.6).length,frames:times.length,p50:times[times.length>>1].toFixed(2),p99:times[Math.floor(times.length*.99)].toFixed(2),foods:R.foods.length,shots:R.shots.length});}})(last);
    })`);
    console.log('FPS TEST',JSON.stringify(r));console.log('GPU',JSON.stringify(app.getGPUFeatureStatus()));app.quit();
  });
}
ipcMain.on('quit',()=>app.quit());
app.on('second-instance',()=>{const w=BrowserWindow.getAllWindows()[0];if(w){if(w.isMinimized())w.restore();w.focus();}});
app.whenReady().then(createWindow);
app.on('window-all-closed',()=>app.quit());
