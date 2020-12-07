import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Friend, FriendStatus } from '../Models/Friend';
import { StrokerUser } from '../Models/StrokerUser';


const db = admin.firestore();
const userCollection = db.collection('user');

const router = express.Router();

router.get('/', async (req: any, res) => {
  const playerId = req.user.uid;
  const snapshot = await userCollection.doc(playerId).collection('friend').get();

  const retVal: Friend[] = [];

  snapshot.forEach(doc => {
    const friend = doc.data() as Friend;
    retVal.push(friend);
  })

  res.status(StatusCodes.OK).send(retVal);
  return;
});

router.get('/:id', async (req: any, res) => {
  const playerId = req.user.uid;
  const friendId = req.params.id;

  const query = await userCollection.doc(playerId).collection('friend')
    .doc(friendId).get();

  const retVal = query.data() as Friend;

  if (retVal) {
    res.status(StatusCodes.OK).send(retVal);
    return;
  }

  res.status(StatusCodes.NOT_FOUND).send();
  return;

});

router.delete('/:id', async (req: any, res) => {
  const playerId = req.user.uid;
  const friendId = req.params.id;

  const friendRef = userCollection.doc(playerId)
    .collection('friend')
    .doc(friendId)
    .delete();

  const recRef = userCollection.doc(friendId)
    .collection('friend')
    .doc(playerId)
    .delete();

  res.status(StatusCodes.OK).send();
  return;
})

router.post('/', async (req: any, res) => {

  // capture email from post body
  const inputEmail = req.body.email as string;

  // validate email
  if (!inputEmail || !validateEmail(inputEmail)) {
    res.status(StatusCodes.BAD_REQUEST).send();
    return;
  }

  // can't send a friend request to yourself
  if (req.user.email === inputEmail) {
    res.status(StatusCodes.BAD_REQUEST).send();
    return;
  }

  // get a reference to this user's friend list
  let friendCollection = userCollection.doc(req.user.uid).collection('friend');

  // check friend list for existing friend
  const oldFriend = await friendCollection.where(
    'Email', '==', inputEmail
  ).limit(1).get();
  if (oldFriend.size !== 0) {
    functions.logger.info('friend already exists');
    res.status(StatusCodes.CONFLICT).send();
    return;
  }

  // check user collection for user
  let user: StrokerUser;
  const userQuery = await userCollection.where(
    "email", "==", inputEmail
  ).limit(1).get();
  if (userQuery.size > 0) {
    user = userQuery.docs[0].data() as StrokerUser;
  } else {
    res.status(StatusCodes.NOT_FOUND).send();
    return;
  }

  // construction of new friend object
  const newFriend: Friend = {
    Email: user.email,
    FriendStatus: FriendStatus.PENDING,
    Name: user.displayName,
    PhotoUrl: user.photoUrl,
    UserId: req.user.uid,
    FriendId: user.id,
    ApprovalAuthority: user.id
  }

  // add new friend document to user's collection
  friendCollection.doc(newFriend.FriendId).set(newFriend);

  // add 'self' to your new friend's friend list also (pending state);
  friendCollection = userCollection.doc(newFriend.FriendId).collection('friend');
  const reciprocalFriend: Friend = {
    Email: req.user.email,
    FriendStatus: newFriend.FriendStatus,
    Name: req.user.name,
    PhotoUrl: req.user.picture,
    UserId: newFriend.FriendId,
    FriendId: newFriend.UserId,
    ApprovalAuthority: newFriend.ApprovalAuthority
  };
  friendCollection.doc(reciprocalFriend.FriendId).set(reciprocalFriend);

  res.status(StatusCodes.CREATED).send({ message: `/user/${newFriend.UserId}/friend/${newFriend.FriendId}/` });
  return;
});

router.put('/:id/approve', async (req: any, res) => {
  const playerId = req.user.uid;
  const friendId = req.params.id;

  const friendRef = userCollection.doc(playerId)
    .collection('friend')
    .doc(friendId);

  const friend = (await friendRef.get()).data() as Friend;
  if (friend.ApprovalAuthority !== playerId) {
    res.status(StatusCodes.FORBIDDEN).send();
    return;
  }

  await friendRef.update({
    "FriendStatus": FriendStatus.ACCEPTED
  });

  await userCollection.doc(friendId)
    .collection('friend')
    .doc(playerId)
    .update({
      "FriendStatus": FriendStatus.ACCEPTED
    });

  res.status(StatusCodes.OK).send();
});

const validateEmail = (email: string): boolean => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return true;
  }
  functions.logger.info('email failed validation');
  return false
}

module.exports = router;