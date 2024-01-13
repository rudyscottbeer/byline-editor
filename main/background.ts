import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import './helpers/config';
import { initDocsOAuth } from './helpers/authorize-docs';


const isProd: boolean = process.env.NODE_ENV === 'production';

let mainWindow;




if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}






ipcMain.handle('load-document', async (event, docID) => {
  console.log(docID);
  if (isProd) {
    mainWindow.loadURL('app://./editor.html?doc=${docID}');
  } else {
    const port = process.argv[2];
    mainWindow.loadURL(`http://localhost:${port}/editor?doc=${docID}`);
  }
});


(async () => {
  await app.whenReady();
  
  

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });
  //mainWindow.openDevTools();

  

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }
  initDocsOAuth(mainWindow);
})();

app.on('window-all-closed', () => {
  app.quit();
});
