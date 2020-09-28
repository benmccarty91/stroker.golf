import * as functions from 'firebase-functions';
import * as express from 'express';


const app = express();

app.use('/user', require('./Controllers/User'));

export const api = functions.https.onRequest(app);
