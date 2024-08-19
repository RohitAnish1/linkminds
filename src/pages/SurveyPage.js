// src/components/SurveyPage.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { matchUsers } from '../matching'; // Assuming matching logic is in matching.js
import './SurveyPage.css';

// MatchResults Component
const MatchResults = ({ match }) => {
  if (!match) return null;

  return (
    <div className="match-results">
      <h2>Congratulations!</h2>
      <div className="match-details">
        <p className="match-intro">
          Hey {match.name}, you are matched with {match.matchedUser.name}!
        </p>
        <div className="matched-user-details">
          <p><strong>Name:</strong> {match.matchedUser.name}</p>
          <p><strong>Gender:</strong> {match.matchedUser.gender}</p>
          <p><strong>Social Preference:</strong> {match.matchedUser.socialPreference}</p>
          <p><strong>Activity Preference:</strong> {match.matchedUser.activityPreference}</p>
          <p><strong>Hobbies:</strong> {match.matchedUser.hobbies}</p>
        </div>
        <p className="invitation-message">
          We invite you to attend the program together and hope you both could get to know each other more!
        </p>
      </div>
    </div>
  );
};

// SurveyForm Component
const SurveyForm = ({ onMatch }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [questions, setQuestions] = useState({
    socialPreference: '',
    activityPreference: '',
    hobbies: '',
  });

  const hobbiesOptions = [
    'Reading',
    'Traveling',
    'Sports',
    'Music',
    'Art',
    'Gaming',
    'Cooking',
    'Dancing',
    'Photography',
    'Fitness',
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is already matched
    const matchedUsersQuery = query(collection(db, 'matchedUsers'), where('name', '==', name));
    const matchedUsersSnapshot = await getDocs(matchedUsersQuery);

    if (!matchedUsersSnapshot.empty) {
      alert('You have already been matched!');
      return;
    }

    // Save the survey data
    await addDoc(collection(db, 'users'), {
      name,
      gender,
      ...questions,
    });
    alert('Survey submitted!');

    // Trigger matching and pass the result to the parent component
    const match = await matchUsers(name); // Pass the user's name to match them with others

    if (match) {
      // Add the matched pair to the matchedUsers collection
      await addDoc(collection(db, 'matchedUsers'), {
        name: match.name,
        matchedWith: match.matchedUser.name,
      });

      await addDoc(collection(db, 'matchedUsers'), {
        name: match.matchedUser.name,
        matchedWith: match.name,
      });

      // Call the onMatch function to update the UI
      onMatch(match);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <select
        value={questions.socialPreference}
        onChange={(e) => setQuestions({ ...questions, socialPreference: e.target.value })}
        required
      >
        <option value="">How do you prefer to spend your social time?</option>
        <option value="Small Group">Small Group</option>
        <option value="Large Group">Large Group</option>
        <option value="Alone">Alone</option>
      </select>
      <select
        value={questions.activityPreference}
        onChange={(e) => setQuestions({ ...questions, activityPreference: e.target.value })}
        required
      >
        <option value="">What type of activities do you enjoy?</option>
        <option value="Indoor">Indoor</option>
        <option value="Outdoor">Outdoor</option>
      </select>
      <select
          value={questions.hobbies}
          onChange={(e) => setQuestions({ ...questions, hobbies: e.target.value })}
          required
        >
          <option value="">Select Your Hobby</option>
          {hobbiesOptions.map((hobby) => (
            <option key={hobby} value={hobby}>
              {hobby}
            </option>
          ))}
        </select>
      <button type="submit">Submit</button>
    </form>
  );
};

// Main SurveyPage Component
export const SurveyPage = () => {
  const [match, setMatch] = useState(null);

  const handleMatch = (newMatch) => {
    setMatch(newMatch);
  };

  return (
    <div className="survey-page"> {/* Added this wrapper */}
      <h1>Survey Page</h1>
      <SurveyForm onMatch={handleMatch} />
      {match && <MatchResults match={match} />}
    </div>
  );
};
