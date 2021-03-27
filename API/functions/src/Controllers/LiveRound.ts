import { StatusCodes } from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {LiveRound, LiveRoundSingleHoleScore} from '../Models/LiveRound';

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
  const batch = db.batch();

  
  
  try {
    batch.set(liveRoundCollection.doc(data.HostPlayerId), data);  
    data.Players.forEach((player) => {
      const defaultScoreMap = getDefaultScoreMap(data);
      batch.set(liveRoundCollection.doc(data.HostPlayerId).collection(player.PlayerId).doc(`scores`), defaultScoreMap);
    })
    await batch.commit();
    res.status(StatusCodes.OK).send();
  } 
  catch(err) {
    functions.logger.error(`failed to create a live round.`, err);
    next(err);
  }


});

const getDefaultScoreMap = (data: LiveRound): {[holeNumber: number]: LiveRoundSingleHoleScore} => {
  return data.Course.Holes.reduce<{[holeNumber: number]: LiveRoundSingleHoleScore}>((prev, curr) => {
    const toRet = prev;
    toRet[curr.Number] = {
      HoleNumber: curr.Number,
      Score: 0
    };
    return toRet;
  }, {});
}

module.exports = router;