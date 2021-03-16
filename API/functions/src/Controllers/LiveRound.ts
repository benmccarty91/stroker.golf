import { StatusCodes } from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


const db = admin.firestore();
const courseCollection = db.collection('course');

const router = express.Router();

router.post('/', async (req, res) => {

});

module.exports = router;