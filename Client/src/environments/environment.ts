// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBPNlKPsHyPsTicxoUWbyC4hfH-_gJ28r4',
    authDomain: 'stroker-af4d5.firebaseapp.com',
    databaseURL: 'https://stroker-af4d5.firebaseio.com',
    projectId: 'stroker-af4d5',
    storageBucket: 'stroker-af4d5.appspot.com',
    messagingSenderId: '1061788771221',
    appId: '1:1061788771221:web:ec541e4e8f4c113ecb8c9c',
    measurementId: 'G-FQJ9W378JC'
  },
  api: {
    baseURL: 'https://us-central1-stroker-af4d5.cloudfunctions.net/api'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
