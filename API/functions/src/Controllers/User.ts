import {StatusCodes} from 'http-status-codes';

import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { StrokerUser } from '../Models/StrokerUser'

const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    message: 'hello, paul'
  };
  res.send(data);
});

router.post('/register', async (req, res) => {
  const newUser: StrokerUser = req.body as StrokerUser;
  const userQuery = await userCollection.doc(newUser.id).get();
  const oldUser = userQuery.data() as StrokerUser;
  if (oldUser) {
    functions.logger.info(`User already exists`);
    res.status(StatusCodes.OK).send();
  } else {
    await userCollection.doc(newUser.id).set(newUser);
    functions.logger.info(`Registering new user`);
    res.status(StatusCodes.CREATED).send();
  }
});

module.exports = router;