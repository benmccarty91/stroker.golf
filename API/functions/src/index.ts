import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

import { validateToken } from './validateToken';

admin.initializeApp();
const app = express();

app.use(cors({ origin: true }));
app.use(validateToken)

app.use('/user', require('./Controllers/User'));
app.use('/test', require('./Controllers/Test'));
app.use('/course', require('./Controllers/Course'));
app.use('/score', require('./Controllers/Score'));

export const api = functions.https.onRequest(app);
