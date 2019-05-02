import * as firebase from 'firebase/app';

import 'firebase/database';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDVYMNT5tGpcL0VlAOjl1tk6w5-6ervxb8',
  authDomain: 'condo-utilities.firebaseapp.com',
  databaseURL: 'https://condo-utilities.firebaseio.com',
  projectId: 'condo-utilities',
  storageBucket: 'condo-utilities.appspot.com',
  messagingSenderId: '717689992733',
};

firebase.initializeApp(config);
