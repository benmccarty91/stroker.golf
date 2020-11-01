import * as express from 'express';
import * as functions from 'firebase-functions';

import { StrokerUser } from '../Models/StrokerUser'

const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    message: 'hello, paul'
  };
  res.send(data);
});

router.post('/register', (req, res) => {
  const newUser: StrokerUser = req.body;
  functions.logger.info(`Registering new user ${JSON.stringify(newUser)}`);
  res.status(201);
  res.send();
});

module.exports = router;