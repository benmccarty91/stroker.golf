import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('in get users controller!');
})

module.exports = router;