import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    message: 'hello, paul'
  };
  res.send(data);
})

module.exports = router;