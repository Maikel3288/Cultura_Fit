import { db } from '../config/database.js';

export async function quickstartAddData() {
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


