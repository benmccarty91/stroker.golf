import { StatusCodes } from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { v4 as uuid } from 'uuid';

import {LiveRound, LiveRoundPlayer, LiveRoundSingleHoleScore, LiveRoundTypeChange} from '../Models/LiveRound';
import { RoundType, Score } from '../Models/ScoreSubmission';
import GolfCourse from '../Models/GolfCourse';

const db = admin.firestore();
const liveRoundCollection = db.collection('live_rounds');
const userCollection = db.collection('user');
const courseCollection = db.collection('course');

const router = express.Router();

router.post('/', async (req: any, res, next) => {
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
    res.status(StatusCodes.CREATED).send();
  } 
  catch(err) {
    functions.logger.error(`failed to create a live round.`, err);
    next(err);
  }
});

router.delete('/', async (req: any, res, next) => {
  const playerId = req.user.uid;
  functions.logger.info(`attempting to delete live round.  Host Player: ${playerId}`);

  try {
    const docRef = liveRoundCollection.doc(playerId);
    const data = (await docRef.get()).data() as LiveRound;

    const batch = db.batch();
    batch.delete(docRef);
    data.Players.forEach(player => {
      batch.delete(docRef.collection(player.PlayerId).doc('scores'));
    })

    await batch.commit();
    res.status(StatusCodes.OK).send();
    return;
  }
  catch(err) {
    functions.logger.error(`failed to delete live round.`, err);
    next(err);
  }
});

router.post('/finalSubmit', async (req: any, res, next) => {
  const playerId = req.user.uid;
  const liveRound = req.body.round as LiveRound;
  const scoreData = req.body.scoreData as {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}};

  functions.logger.info(`submitting final scores`, liveRound);

  // verify we have the authorization to take this action
  if (playerId !== liveRound.HostPlayerId) {
    functions.logger.warn('a non-host attempted to submit a live round');
    res.status(StatusCodes.FORBIDDEN).send();
    return;
  }

  try {
    const flatScores = flattenScores(scoreData); // sum up all the individual hole scores

    const batch = db.batch(); //create our db batch

    // get our "self" data from the list and remove the player record
    const selfIndex = liveRound.Players.findIndex(player => player.PlayerId === playerId);
    const self: LiveRoundPlayer = liveRound.Players[selfIndex];
    liveRound.Players.splice(selfIndex, 1);

    // map our "self" score and add it to the batch
    // also delete our "self" score record from the live-round collection
    const selfScore: Score = mapScore(liveRound, self, flatScores);
    batch.create(userCollection.doc(selfScore.PlayerId).collection('score').doc(selfScore.ScoreId), selfScore);
    batch.delete(liveRoundCollection.doc(liveRound.HostPlayerId).collection(selfScore.PlayerId).doc('scores'));

    // if there are players left in the array, we must have played with friends.
    // loop through and add their scores to the batch as `pendingScores`.
    // also add the delete to the batch to remove the live-scores records
    if (liveRound.Players.length > 0) {
      liveRound.Players.map(player => {
        return mapScore(liveRound, player, flatScores);
      }).forEach(friendScore => {
        batch.create(userCollection.doc(friendScore.PlayerId).collection('pendingScores').doc(friendScore.ScoreId), friendScore);
        batch.delete(liveRoundCollection.doc(liveRound.HostPlayerId).collection(friendScore.PlayerId).doc('scores'));
      });
    }

    // batch the live round doc for deletion
    batch.delete(liveRoundCollection.doc(liveRound.HostPlayerId));
    
    // commit the batch
    await batch.commit();    

    res.status(StatusCodes.CREATED).send();
    return;
  } catch (err) {
    functions.logger.error('something bad happened when trying to submit final scores', err);
    next(err);
  }
});

router.put('/updateRoundType', async (req: any, res, next) => {
  const playerId = req.user.uid;
  functions.logger.info(`attempting to edit live game type`);
  
  try {
    const data = req.body as LiveRoundTypeChange;
    functions.logger.info(data);

    if (playerId !== data.HostPlayerId) {
      functions.logger.info(`cannot change the round type unless you're the owner`);
      res.status(StatusCodes.FORBIDDEN).send();
      return;
    }

    const batch = db.batch();

    const existingRecordRef = liveRoundCollection.doc(data.HostPlayerId);
    const existingRecord = (await existingRecordRef.get()).data() as LiveRound;
    const oldRoundType = existingRecord.RoundType;
    const newLiveRoundRecord: LiveRound = {...existingRecord};
    const courseRecord = (await courseCollection.doc(existingRecord.CourseId).get()).data() as GolfCourse;

    if (oldRoundType === data.NewRoundType) {
      return res.status(StatusCodes.OK).send();
    }


    //update the LiveRound.Course to include the new holes
    newLiveRoundRecord.Course = getUpdatedCourse(courseRecord, data.NewRoundType);
    newLiveRoundRecord.RoundType = data.NewRoundType
    batch.set(existingRecordRef, newLiveRoundRecord);


    //update each each LiveRound.{{playerId}}.scores document to fill in the new holes
    for (const player of newLiveRoundRecord.Players) {
      const playerScoreRef = existingRecordRef.collection(player.PlayerId).doc('scores');
      const playerScoreDoc = (await playerScoreRef.get()).data() as {[holeNumber: number]: LiveRoundSingleHoleScore};

      //creates a new player score doc by looping over the updated course holes and creating new records for each hole
      //if an old score record exists, we'll take that one.  Otherwise, create a default score.
      const newPlayerScoreDoc = newLiveRoundRecord.Course.Holes.reduce<{[holeNumber: number]: LiveRoundSingleHoleScore}>((prev, curr) => {
        const toRet = prev;
        toRet[curr.Number] = playerScoreDoc[curr.Number] || {
          HoleNumber: curr.Number,
          Score: 0
        };
        return toRet;
        }, {}
      );
      batch.set(playerScoreRef, newPlayerScoreDoc);
    }

    await batch.commit();
    
    return res.status(StatusCodes.OK).send();
  }
  catch(err) {
    functions.logger.error(`problem editing live round.`, err);
    next(err);
    return;
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

const flattenScores = (data: {[playerId: string]: {[holeNumber: number]: LiveRoundSingleHoleScore}}) => {
  const toRet: {[playerId:string]: {[key: string]: number}} = {};
  Object.keys(data).forEach(player => {
    toRet[player] = {
      score: 0,
      relativeScore: 0
    }
    Object.keys(data[player]).forEach(holeNum => {
      toRet[player]['score'] += data[player][Number.parseInt(holeNum)].Score;
      toRet[player]['relativeScore'] += data[player][Number.parseInt(holeNum)].RelativePar || 0;
    })
  })
  return toRet;
}

const mapScore = (liveRound: LiveRound, player: LiveRoundPlayer, flatScores: {[playerId: string]: {[key: string]: number}}): Score => {
  return {
    ScoreId: uuid(),
    CourseId: liveRound.CourseId,
    CourseName: liveRound.Course.Name,
    Date: liveRound.RoundDate,
    PrettyDate: liveRound.PrettyDate,
    PlayerId: player.PlayerId,
    PlayerName: player.PlayerName,
    TeeboxColor: player.Teebox.Color,
    RoundType: liveRound.RoundType,
    Score: flatScores[player.PlayerId]['score'],
    RelativeScore: flatScores[player.PlayerId]['relativeScore']
  }
}

const getUpdatedCourse = (originalCourseRecord: GolfCourse, newRoundType: RoundType): GolfCourse => {
  originalCourseRecord.Holes = originalCourseRecord.Holes.sort((a, b) => {
    return a.Number - b.Number;
  });
  switch (newRoundType) {
    case (RoundType.FULL_18):
      return originalCourseRecord;
    case (RoundType.FRONT_9):
      originalCourseRecord.Holes = originalCourseRecord.Holes.slice(0,9);
      return originalCourseRecord;
    case (RoundType.BACK_9):
      originalCourseRecord.Holes = originalCourseRecord.Holes.slice(9);
      return originalCourseRecord;
  }
}

module.exports = router;