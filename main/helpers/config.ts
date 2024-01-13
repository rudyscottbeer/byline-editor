import dotenv from 'dotenv';


require('dotenv').config();

//TODO: Seperate this ts file into a real ENV. This does not follow 12-Factor at the moment, and is done for 
//rapid prototyping.

export const clientid = "API CLIENTID HERE";
export const redirectURI = "com.byline.app:/oauth2redirect";
export const scope = "https://www.googleapis.com/auth/drive";
export const port = 12345;
export const clientSecret = "API SECRET HERE";
export const apiKey = "API KEY HERE";
