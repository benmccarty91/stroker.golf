import { StatusCodes } from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {LiveRound} from '../Models/LiveRound';

const db = admin.firestore();
const liveRoundCollection = db.collection('live_rounds');

const router = express.Router();

router.post('/create', async (req: any, res, next) => {
  const playerId = req.user.uid;
  const data = req.body as LiveRound;

  if (data.HostPlayerId !== playerId) {
    res.status(StatusCodes.FORBIDDEN).send();
    return;
  }

  functions.logger.info(`attempting to create a new live round.  Host Player: ${data.HostPlayerId}.  Course: ${data.Course.Name} `);

  try {
    await liveRoundCollection.doc(data.HostPlayerId).set(data);
    res.status(StatusCodes.CREATED).send();
  } 
  catch(err) {
    functions.logger.error(`failed to create a live round.`, err);
    next(err);
  }


});

module.exports = router;