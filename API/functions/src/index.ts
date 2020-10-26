import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

import { validateToken } from './validateToken';


const app = express();

app.use(cors({ origin: true }));
app.use(validateToken)

app.use('/user', require('./Controllers/User'));
app.use('/test', require('./Controllers/Test'));

export const api = functions.https.onRequest(app);
