import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import GolfCourse from '../Models/GolfCourse';

const db = admin.firestore();
const courseCollection = db.collection('course');

const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    message: "here's a course"
  };
  res.status(200).send(data);
});

router.post('/', async (req, res) => {
  const newCourse = req.body as GolfCourse;
  const existingCourse = await courseCollection
    .where('Name', '==', newCourse.Name)
    .where('StreetAddress', '==', newCourse.StreetAddress)
    .get();
  if (existingCourse.size != 0) {
    functions.logger.info(`New golf course already exists: ${newCourse.Name}|${newCourse.StreetAddress}`);
    res.status(409).send();
    return;
  }
  const addedCourse = await courseCollection.add(newCourse);
  const id = addedCourse.id;
  functions.logger.info(`Added new course ${id}`);
  res.status(201).send({ newCourseId: id });
});

module.exports = router;