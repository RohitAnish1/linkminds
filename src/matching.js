// src/matching.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const matchUsers = async () => {
  const introverts = [];
  const extroverts = [];

  const qIntroverts = query(collection(db, 'users'), where('preference', '==', 'Introvert'));
  const qExtroverts = query(collection(db, 'users'), where('preference', '==', 'Extrovert'));

  const querySnapshotIntroverts = await getDocs(qIntroverts);
  const querySnapshotExtroverts = await getDocs(qExtroverts);

  querySnapshotIntroverts.forEach((doc) => introverts.push({ id: doc.id, ...doc.data() }));
  querySnapshotExtroverts.forEach((doc) => extroverts.push({ id: doc.id, ...doc.data() }));

  const matches = introverts.map((introvert, index) => ({
    introvert,
    extrovert: extroverts[index % extroverts.length],
  }));

  return matches;
};
