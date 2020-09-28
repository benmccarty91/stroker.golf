# App Template
* Before you try and do much of anything, you need to setup a firebase project at firebase.google.com.  
* Once that's setup, install the firebase cli using `npm install -g firebase-tools`.
* Next, log into the cli with `firebase login`
* Find your Project ID (the project you just created) and save it for later with `firebase projects:list`
----
* You're also going to need your firebase CI token.  To get this, run `firebase login:ci` and copy the outputted token
* Head over to github and open your project repo.  Go to settings > secrets > new secret.
* secret key is FIREBASE_TOKEN and the value is your token.
----


## Client
This is a basic angular client with firebase deploy setup through github actions.  If you don't want your client to use angular, you don't have to!  You can use any framework you like, just be sure you edit Client.yml to point to your "build" files, as that's what gets deployed to the interwebs.

To run locally, navigate to this directory

    npm install

    npm run start

To deploy to firebase, edit `.firebaserc` and set the default project to your project id.

Build your project with `npm run build:prod`

Deploy with `firebase deploy --only hosting`

The client automatically deploys when you push code up to github.

## API
This is a firebase cloud functions project setup with express.js

To run locally, navigate to API/functions
    
    npm install

    npm run serve

If that doesn't work, you probably need to install the firebase emulator

    firebase init

* select emulator
* select functions
* yes to install
* try `npm run serve` again

To deploy to firebase, edit `.firebaserc` to set the default project to your project id.

`npm run build`

`npm deploy`

The API also automatically deploys when you push code up to github.

## Data
Not much of a template here, just some basic security rules for firebase firestore.  Again, navigate to Data and edit `.firebaserc` and set the default project to your project id.  

Deploy with `firebase deploy --only firestore`

These files deploy automatically with pushes to github.