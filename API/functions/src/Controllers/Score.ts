import { StatusCodes } from 'http-status-codes';
import { ScoreSubmission } from '../Models/ScoreSubmission';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();
const scoreCollection = db.collection('score');

const router = express.Router();

router.get('/:playerId', async (req, res) => {
  const playerId = req.params.playerId;
  functions.logger.info(`Inside GET Score.  PlayerId: ${playerId}`);
  res.status(StatusCodes.OK).send();
});

router.post('/', async (req, res) => {
  const newScore = req.body as ScoreSubmission;
  functions.logger.info(`Inside POST Score.  New submission: ${JSON.stringify(newScore)}`);
  scoreCollection.add(newScore).then(x => {
    res.status(StatusCodes.CREATED).send({ id: x.id });
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  })
});

module.exports = router;