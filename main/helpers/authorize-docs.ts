import { BrowserWindow, app, ipcMain, ipcRenderer } from 'electron';
import serve from 'electron-serve';
import { createWindow } from '.';
import { clientid, redirectURI, scope, port, clientSecret } from './config';
import Store from 'electron-store';

const store = new Store();


const express = require('express');
const axios = require('axios');

async function exchangeCodeForToken(authorizationCode) {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: authorizationCode,
        client_id: clientid,
        client_secret: clientSecret, // Obtain this from Google Developer Console
        redirect_uri: `http://localhost:${port}/oauth2callback`, // This should match the one you used earlier
        grant_type: 'authorization_code'
      });
  
      return response.data; // This will contain your access token, and possibly a refresh token
    } catch (error) {
      console.error('Failed to exchange authorization code for tokens', error);
    }
  };
  async function getDocumentList(accessToken) {
    try {
      const response = await axios.get(scope, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      return response.data; // List of documents
    } catch (error) {
      console.error('Failed to fetch Google Docs list', error);
    }
  };
  

  const startAuthListener = (callback: (error: Error | null, code?: string) => Promise<void>) => {
    
  const exp = express();
  const PORT = port;  

  exp.get('/oauth2callback', (req, res) => {
    const { code } = req.query;
    
    if (code) {
      callback(null, code);
    } else {
      callback(new Error('Failed to retrieve authorization code'));
    }

    res.send('You can now close this window.');
    server.close();
  });

  const server = exp.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
};

export const initDocsOAuth = (mainWindow) =>  {
  let authWindow;

ipcMain.handle('authenticate', async () => {
    return new Promise((resolve, reject) => {
        startAuthListener(async (error, code) => {
            if (error) {
              console.error('Failed to retrieve auth code', error);
            } else {
              // Use the authorization code to get access tokens
              console.log('Authorization code:', code);
                const tokens = await exchangeCodeForToken(code);
                console.log(tokens);
                store.set('access_token', tokens.access_token);
                if (tokens.refresh_token) {
                    store.set('refresh_token', tokens.refresh_token);
                }
                authWindow.close();
                if (process.env.NODE_ENV === 'production') {
                  await mainWindow.loadURL('app://./picker.html');
                } else {
                  const port = process.argv[2];
                  await mainWindow.loadURL(`http://localhost:${port}/picker`);
                }


            }
          });
          const uri = `http://localhost:${port}/oauth2callback`;
                

      // Setup OAuth URL
      const authUrl = `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams({
        response_type: 'code',
        client_id: clientid,
        redirect_uri: uri,
        scope: scope
      })}`;

      // Create the authentication window
      authWindow = createWindow('auth', {
        width: 1000,
        height: 600,
      });
      authWindow.loadURL(authUrl);
    });
  });


app.on('open-url', (event, url) => {
  // Handle the URL here, e.g., extract the authorization code
  console.log(url);
});


}