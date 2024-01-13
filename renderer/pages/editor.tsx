'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '../components/Link';
import {styled} from '@mui/material';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { get } from 'http';
import Store from 'electron-store';
import { clientid, redirectURI, scope, port, clientSecret, apiKey} from '../../main/helpers/config';
const store = new Store();

// Load wink-nlp package.
const winkNLP = require( 'wink-nlp' );
// Load english language model.
const model = require( 'wink-eng-lite-web-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;


const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
}));

const ButtonContainer = styled('div')({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px',
    borderTop: '1px solid #ccc',
});

// function getGoogleDoc(docID){

//         gapi.client.init({
//             'apiKey': apiKey,
//             'clientId': clientid,
//             'scope': scope,
//         })
//         .then(() => {
//             gapi.client.drive.files.export({
//                 'fileId': docID,
//                 'mimeType': 'text/plain',
//                 'supportsAllDrives': true,
//             });
//         })
//         .then(function(response) {
//             // File content is in response.body
//             const fileContent = response.body;
//             return fileContent;
//         })
//         .catch(function(error) {
//             console.error('Error retrieving document:', error);
//         });
// }

function DocViewer({document}) {    
    return <p>test</p>;
}

// function displayContent(content) {
//     // Create a <pre> element
//     const pre = document.createElement('pre');
    
//     // Set the content of the <pre> element to be the plain text content of the file
//     pre.textContent = content;
    
//     // Append the <pre> element to the body of the page (or another container element)
//     document.body.appendChild(pre);
// }





function Editor() {
    const router = useRouter();
    const [docID, setDocID] = useState(null);
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [docLines, setDocLines] = useState([]);


    useEffect(() => {
        if (router.query.doc) {
            let docContent;
        if (Array.isArray(router.query.doc)) {
        docContent = router.query.doc.join(', ');  // or any other way you want to display array of strings
         } else {
            docContent = router.query.doc;
        }
        setDocID(docContent);
        }
    }, [router.query.doc]);

    useEffect(() => {
        if(gapiLoaded && docID){
            getGoogleDoc(docID);
        }
    }, [gapiLoaded, docID]);

    const loadDriveClient = () => {
            gapi.load('client', () => {
                gapi.client.load('drive', 'v3', () => setGapiLoaded(true));
            });
    };

    function splitDoc(doc) {
        const lines = doc.split('\n');
        setDocLines(lines);
    }

    const handleNextLine = () => {
        if (currentLineIndex < docLines.length - 1) {
            setCurrentLineIndex(currentLineIndex + 1);
        }
    }

    const handlePreviousLine = () => {
        if (currentLineIndex > 0) {
            setCurrentLineIndex(currentLineIndex - 1);
        }
    }

    function getGoogleDoc(docID){
        gapi.client.init({
            'apiKey': apiKey,
            // Your API key will be automatically added to the Discovery Document URLs.
            // clientId and scope are optional if auth is not required.
            'clientId': clientid,
            'scope': scope,
        })
    
        gapi.client.drive.files.export({
            'fileId': docID,
            'mimeType': 'text/plain',
            'supportsAllDrives': true,
        })
        .then(function(response) {
            // File content is in response.body
            const fileContent = response.body;
            const cleanText = fileContent.replace(/\s+/g, ' ').trim();
            // Split content into lines and set it in the state
            const nlpDoc = nlp.readDoc(cleanText);

            setDocLines(nlpDoc.sentences().out());
        })
        .catch(function(error) {
            console.error('Error retrieving document:', error);
        });
    }


    


    return (
        <React.Fragment>
            <>
            <Script src="https://apis.google.com/js/api.js"
            onLoad={loadDriveClient}/>
            </>
            <Head>
                <title>Editor</title>
            </Head>
            <Root>
                        <div>
                        <Typography variant="body1">
                            {docLines[currentLineIndex]}
                        </Typography>
                        </div>
                        <ButtonContainer> 
                            <Button onClick={handlePreviousLine} disabled={currentLineIndex <= 0}>Previous Line</Button> 
                            <Button onClick={handleNextLine} disabled={currentLineIndex >= docLines.length - 1}>Next Line</Button> 
                        </ButtonContainer>

            </Root>
        </React.Fragment>
    );
};

export default Editor;
