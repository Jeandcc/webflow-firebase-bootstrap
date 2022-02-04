import firebase from 'firebase/app';

// "Duplicate" imports are required by Firebase v8
/* eslint-disable import/no-duplicates */
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';

const prodConfig = {

};

const devConfig = {

};

firebase.initializeApp(
  process.env.APP_ENV === 'development' ? devConfig : prodConfig,
);

export const FireAuth = firebase.auth();
export const FireFunctions = firebase.functions();
export const FireDb = firebase.firestore();

export { firebase };
