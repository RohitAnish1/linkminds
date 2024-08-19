import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const matchUsers = async (currentUserName) => {
  const users = [];
  const usersSnapshot = await getDocs(collection(db, 'users'));
  usersSnapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));

  // Find the current user based on the name
  const currentUser = users.find((user) => user.name === currentUserName);
  if (!currentUser) return null;

  // Fetch matched users from the collection
  const matchedUsersSnapshot = await getDocs(collection(db, 'matchedUsers'));
  const matchedUsers = matchedUsersSnapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    if (!acc[data.name]) {
      acc[data.name] = [];
    }
    acc[data.name].push(data.matchedUser);
    return acc;
  }, {});

  // Filter out users who are already matched
  const potentialMatches = users
    .filter((user) => user.name !== currentUserName)
    .map((user) => {
      let score = 0;
      if (user.socialPreference === currentUser.socialPreference) score += 1;
      if (user.activityPreference === currentUser.activityPreference) score += 1;

      const userHobbies = Array.isArray(user.hobbies) ? user.hobbies : [];
      const currentUserHobbies = Array.isArray(currentUser.hobbies) ? currentUser.hobbies : [];

      if (userHobbies.some((hobby) => currentUserHobbies.includes(hobby))) score += 1;

      return { ...user, score };
    });

  // Sort potential matches by score and then by number of matches
  potentialMatches.sort((a, b) => {
    if (b.score === a.score) {
      // Compare the number of matches
      const aMatches = (matchedUsers[a.name] || []).length;
      const bMatches = (matchedUsers[b.name] || []).length;
      return aMatches - bMatches;
    }
    return b.score - a.score;
  });

  const matchedUser = potentialMatches[0];

  if (matchedUser) {
    // Save the matched users to the 'matchedUsers' collection
    await addDoc(collection(db, 'matchedUsers'), {
      name: currentUser.name,
      matchedUser: matchedUser.name,
    });
    await addDoc(collection(db, 'matchedUsers'), {
      name: matchedUser.name,
      matchedUser: currentUser.name,
    });
  }

  return matchedUser ? { name: currentUser.name, matchedUser } : null;
};
