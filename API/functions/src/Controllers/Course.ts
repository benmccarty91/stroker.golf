import {StatusCodes} from 'http-status-codes';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import GolfCourse from '../Models/GolfCourse';

const db = admin.firestore();
const courseCollection = db.collection('course');

const router = express.Router();

router.get('/', async (req, res) => {
  const retVal: any[] = [];
  const snapshot = await courseCollection.get();
  snapshot.forEach(doc => {
    const course = doc.data() as GolfCourse;
    retVal.push({
      Id: doc.id,
      Name: course.Name,
      StreetAddress: course.StreetAddress,
      City: course.City,
      State: course.State
    });
  });
  if (retVal.length > 0) {
    res.status(200).send(retVal);
  } else {
    res.status(404).send();
  }
});

router.get('/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const course = (await courseCollection.doc(courseId).get()).data() as GolfCourse;
  if (course) {
    if (!course.Id) {
      course.Id = courseId;
    }
    res.status(StatusCodes.OK).send(course);
  } else {
    res.status(StatusCodes.NOT_FOUND).send();
  }  
});

router.post('/', async (req, res) => {
  const newCourse = req.body as GolfCourse;
  const existingCourse = await courseCollection
    .where('Name', '==', newCourse.Name)
    .where('StreetAddress', '==', newCourse.StreetAddress)
    .get();
  if (existingCourse.size != 0) {
    functions.logger.info(`New golf course already exists: ${newCourse.Name}|${newCourse.StreetAddress}`);
    res.status(StatusCodes.CONFLICT).send();
  } else {
  await courseCollection.doc(newCourse.Id).set(newCourse);
  functions.logger.info(`Added new course ${newCourse.Id}`);
  res.status(StatusCodes.CREATED).send({ newCourseId: newCourse.Id });
  }
});

module.exports = router;