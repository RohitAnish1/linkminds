// src/components/SurveyPage.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { matchUsers } from '../matching'; // Assuming matching logic is in matching.js
import './SurveyPage.css';
// MatchResults Component
const MatchResults = ({ match }) => {
  return (
    <div>
      <h2>Match Result</h2>
      {match && (
        <div>
          <p>{match.name} is matched with {match.matchedUser.name}</p>
        </div>
      )}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'users'), {
      name,
      gender,
      ...questions,
    });
    alert('Survey submitted!');

    // Trigger matching and pass the result to the parent component
    const match = await matchUsers(name); // Pass the user's name to match them with others
    onMatch(match);
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
      <input
        type="text"
        value={questions.hobbies}
        onChange={(e) => setQuestions({ ...questions, hobbies: e.target.value })}
        placeholder="List some of your hobbies"
        required
      />
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
    <div>
      <h1>Survey Page</h1>
      <SurveyForm onMatch={handleMatch} />
      {match && <MatchResults match={match} />}
    </div>
  );
};
