import * as express from 'express';
import * as admin from 'firebase-admin';

admin.initializeApp(); //authenticates into your project's firestore
const db = admin.firestore(); //gets a db object
const testCollection = db.collection('Test'); //defines which collection we're working with

const router = express.Router(); //used by express to route calls to this controller

router.get('/', async (req, res) => { //this is the GET controller for /api/Test/
  try { //all functions must end, so if there is an error, we have to return 500
    const query = await testCollection.doc('TestDocument').get(); //get a document by name
    const data = query.data(); //pull the data out of the document
    res.status(200).send(data); //return 200 with data in the body
  } catch (error) { //if error
    res.status(500).send(error); //return 500.  probably want to pass a custom error message in production
  }
})

module.exports = router; //export our router so index.js can get it