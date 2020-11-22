import { StatusCodes } from 'http-status-codes';
import { ScoreSubmission } from '../Models/ScoreSubmission';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import moment = require('moment');

const db = admin.firestore();
const scoreCollection = db.collection('score');

const router = express.Router();

router.get('/:playerId/:year', async (req, res) => {
  const playerId = req.params.playerId;
  const year = Number(req.params.year);
  const startDate = moment({ year: year }).unix();
  const endDate = moment({ year: year, month: 11, day: 31 });

  const retVal: any[] = [];
  functions.logger.info(`Inside GET Score.  PlayerId: ${playerId}.  Year: ${year}.  StartDate: ${startDate}.  EndDate: ${endDate}.`);

  const scoresPromise = scoreCollection
    .where('PlayerId', '==', playerId)
    .where('Date', '>=', startDate)
    .where('Date', '<=', endDate.unix())
    .get();

  scoresPromise.then(scores => {
    scores.forEach(doc => {
      const score = doc.data() as ScoreSubmission;
      retVal.push(score);
    })
    res.status(StatusCodes.OK).send(retVal);
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  });
});

router.post('/', async (req, res) => {
  const newScore = req.body as ScoreSubmission;
  scoreCollection.add(newScore).then(x => {
    res.status(StatusCodes.CREATED).send({ id: x.id });
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  })
});

module.exports = router;