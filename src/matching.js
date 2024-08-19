// src/matching.js
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export const matchUsers = async (currentUserName) => {
  const users = [];
  const q = query(collection(db, 'users'));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));

  // Find the current user based on the name
  const currentUser = users.find(user => user.name === currentUserName);
  if (!currentUser) return null;

  // Simple matching logic based on similar social preference and hobbies
  const potentialMatches = users.filter(user => user.name !== currentUserName)
    .map(user => {
      let score = 0;
      if (user.socialPreference === currentUser.socialPreference) score += 1;
      if (user.activityPreference === currentUser.activityPreference) score += 1;

      // Ensure hobbies are treated as an array of strings
      const userHobbies = (user.hobbies || '').split(',').map(hobby => hobby.trim());
      const currentUserHobbies = (currentUser.hobbies || '').split(',').map(hobby => hobby.trim());

      if (userHobbies.some(hobby => currentUserHobbies.includes(hobby))) score += 1;
      return { ...user, score };
    });

  // Sort potential matches by score and return the best match
  potentialMatches.sort((a, b) => b.score - a.score);
  return { name: currentUser.name, matchedUser: potentialMatches[0] };
};
