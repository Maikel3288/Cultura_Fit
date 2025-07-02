import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin'
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = getFirestore();


export async function quickstartAddData(db) {
  // [START firestore_setup_dataset_pt1]
  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
  // [END firestore_setup_dataset_pt1]

  // [START firestore_setup_dataset_pt2]
  const aTuringRef = db.collection('users').doc('aturing');

  await aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
  });
  // [END firestore_setup_dataset_pt2]
}


