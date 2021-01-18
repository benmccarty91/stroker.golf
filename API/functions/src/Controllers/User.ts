import {StatusCodes} from 'http-status-codes';

import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { StrokerUser } from '../Models/StrokerUser'

const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.post('/register', async (req: any, res) => {
  const newUser: StrokerUser = req.body as StrokerUser;
  if (newUser.id !== req.user.uid) {
    res.status(StatusCodes.FORBIDDEN).send();
    functions.logger.info(`Forbidden request inside POST user/register`);
    return;
  }
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

router.get('/profile', async(req: any, res) => { // get full profile data
  return res.status(StatusCodes.OK).send();
});

router.put('/profile', async(req: any, res) => { // update profile data
  return res.status(StatusCodes.OK).send();
});

module.exports = router;