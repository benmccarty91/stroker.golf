import { StatusCodes } from 'http-status-codes';
import { Score } from '../Models/ScoreSubmission';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import moment = require('moment');

const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.get('/pending', async (req: any, res) => {
  const playerId = req.user.uid;
  // TODO: paginate this data
  const pendingScoresRef = await userCollection.doc(playerId).collection('pendingScores').limit(10).get();
  const retVal: Score[] = [];

  pendingScoresRef.forEach(data => {
    const score = data.data() as Score;
    if (!score.ScoreId) {
      score.ScoreId = data.id;
    }
    retVal.push(score);
  })

  return res.status(StatusCodes.OK).send(retVal);
});

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
    .limit(100) // TODO: paginate this data
    .get();

  scoresPromise.then(scores => {
    scores.forEach(doc => {
      const score = doc.data() as Score;
      if (!score.ScoreId) {
        score.ScoreId = doc.id;
      }
      retVal.push(score);
    })
    res.status(StatusCodes.OK).send(retVal);
  }).catch(err => {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  });
});

router.post('/', async (req: any, res) => {
  const playerId = req.user.uid;
  const allScores = req.body as Score[];

  functions.logger.info(`Inside GET Score controller with user ${playerId}`);

  const selfScoreId = allScores.findIndex(score => score.PlayerId === playerId);
  if (selfScoreId < 0) { // not submitting a score for "self".  This is not permitted.
    res.status(StatusCodes.FORBIDDEN).send();
  }

  const selfScore = allScores[selfScoreId];
  allScores.splice(selfScoreId, 1); // remove "self" from array

  const addOps = new Array<Promise<any>>(); // array of promises to allow for concurrent add operations

  try {
    addOps.push(userCollection.doc(selfScore.PlayerId).collection('score').doc(selfScore.ScoreId).set(selfScore));

    if (allScores && allScores.length > 0) { // if there are friend scores to proccess
      functions.logger.info(`trying to post ${allScores.length} friend\'s scores`);
      for (const friendScore of allScores) {
        const friendRecord = await userCollection.doc(friendScore.PlayerId).collection('friend').doc(playerId).get();
        if (friendRecord.exists) { // check to make sure the "friend" record exists before adding scores
          addOps.push(userCollection.doc(friendScore.PlayerId).collection('pendingScores').doc(friendScore.ScoreId).set(friendScore));
          functions.logger.info(`posted friend ${friendScore.PlayerId} score`);
        }
      }
    }

    await Promise.all(addOps); // perform the add operations
    res.status(StatusCodes.OK).send();
  } catch (err) {
    functions.logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
});

router.post('/pending', async (req: any, res, next) => {
  const playerId = req.user.uid;
  const score = req.body as Score;

  await userCollection.doc(playerId).collection('pendingScores').doc(score.ScoreId).delete();
  await userCollection.doc(playerId).collection('score').doc(score.ScoreId).set(score);

  return res.status(StatusCodes.OK).send();
});

router.delete('/pending/:id', async (req: any, res, next) => {
  const playerId = req.user.uid;
  const scoreId = req.params.id;

  await userCollection.doc(playerId).collection('pendingScores').doc(scoreId).delete();

  return res.status(StatusCodes.OK).send();
});

module.exports = router;