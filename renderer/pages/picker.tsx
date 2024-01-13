import React from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '../components/Link';
import Script from 'next/script';
import {styled} from '@mui/material';
import { onApiLoad, onClientLoad, createPicker } from '../helpers/create-picker';
import Store from 'electron-store';

const store = new Store();


const Root = styled('div')(({theme}) => {
    return {
        textAlign: 'center',
        paddingTop: theme.spacing(4),
    };
});


const handleOpenPicker = () => {
    gapi.load('picker', 
    () => {
        gapi.load('client', function () {
            gapi.client.load('drive', 'v3', () => {
                const accessToken = store.get('access_token');
                createPicker(accessToken);
            });
        });
    });
    
}



function Picker() {

    return (
        <React.Fragment>
            <>
            <Script src="https://apis.google.com/js/api.js"
            strategy="beforeInteractive"/>
            </>
            <Head>
                <title>Select a Document</title>
            </Head>
            <Root>
                <Typography variant="h4" gutterBottom>
                Select a Document
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    to begin editing.
                </Typography>
                <div id="content"></div>
                <Typography gutterBottom>
                    <Link href="/home">Go to the home page</Link>
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpenPicker}>
                    Open Document
                </Button>
            </Root>
        </React.Fragment>
    );
};

export default Picker;
