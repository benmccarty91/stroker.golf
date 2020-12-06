import { StatusCodes } from 'http-status-codes';
import { Score } from '../Models/ScoreSubmission';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import moment = require('moment');

const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.get('/:playerId/:year', async (req: any, res) => {
  const playerId = req.params.playerId;
  if (req.user.uid !== playerId) {
    res.status(StatusCodes.FORBIDDEN).send();
    functions.logger.info(`Forbidden request inside GET score/:playerId/:year`);
    return;
  }

  const year = Number(req.params.year);
  const startDate = moment({ year: year });
  const endDate = moment({ year: year, month: 11, day: 31 });

  const retVal: any[] = [];
  functions.logger.info(`Inside GET Score.  PlayerId: ${playerId}.  Year: ${year}.`);

  const scoresPromise = userCollection.doc(playerId).collection('score')
    .where('Date', '>=', startDate.unix())
    .where('Date', '<=', endDate.unix())
    .get();

  scoresPromise.then(scores => {
    scores.forEach(doc => {
      const score = doc.data() as Score;
      retVal.push(score);
    })
    res.status(StatusCodes.OK).send(retVal);
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  });
});

router.post('/', async (req: any, res) => {
  const newScore = req.body as Score;
  if (newScore.PlayerId !== req.user.uid) {
    res.status(StatusCodes.FORBIDDEN).send();
    functions.logger.info(`Forbidden request inside POST score/`);
    return;
  }
  userCollection.doc(newScore.PlayerId).collection('score').add(newScore).then(x => {
    res.status(StatusCodes.CREATED).send({ id: x.id });
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  })
});

module.exports = router;