import {StatusCodes} from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.get('/', async (req: any, res) => {
  const playerId = req.user.uid;
  const snapshot = await userCollection.doc(playerId).collection('friend').get();

  const retVal: any[] = [];

  snapshot.forEach(doc => {
    const friend = doc.data();
    retVal.push(friend);
  })

  res.status(StatusCodes.OK).send(retVal);
  return;
});

router.post('/', async (req, res) => {
  res.status(StatusCodes.OK).send([]);
  return;
});

module.exports = router;