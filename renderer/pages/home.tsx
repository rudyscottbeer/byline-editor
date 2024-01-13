import React from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Link from '../components/Link';
import Image from 'next/image';
import {styled} from '@mui/material';
import logo from '../public/images/byline-logo.png';

const { ipcRenderer } = require('electron');



const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Makes sure it takes up the whole height
    textAlign: 'center',
    paddingTop: theme.spacing(4),
}));
const Logo = styled(Image)(({ theme }) => ({
    maxWidth: '200px',  // Adjust as needed
    height: 'auto',
}));

function requestAuthentication() {
    if (!ipcRenderer) return;
    ipcRenderer.invoke('authenticate').then((code) => {
        console.log("Authentication success:", code); 
    }).catch(error => {
        console.error("Authentication failed:", error);
    });
}



function Home() {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleClick = () => setOpen(true);


    return (
        <React.Fragment>
            <Head>
                <title>Byline</title>
            </Head>
            <Root>
                <Typography variant="h4" gutterBottom>
                    Byline Editor
                </Typography>
                <Logo src={logo} width={400} height={400} alt="Byline Logo" />
                <Button variant="contained" color="primary" onClick={requestAuthentication}>
                    Request Authentication
                </Button>
            </Root>
        </React.Fragment>
    );
};

export default Home;
