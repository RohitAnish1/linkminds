// src/components/SurveyPage.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { matchUsers } from '../matching'; // Assuming matching logic is in matching.js

// MatchResults Component
const MatchResults = ({ match }) => {
  return (
    <div>
      <h2>Match Result</h2>
      {match && (
        <div>
          <p>{match.introvert.name} (Introvert) is matched with {match.extrovert.name} (Extrovert)</p>
        </div>
      )}
    </div>
  );
};

// SurveyForm Component
const SurveyForm = ({ onMatch }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [preference, setPreference] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'users'), {
      name,
      gender,
      preference,
    });
    alert('Survey submitted!');

    // Trigger matching and pass the result to the parent component
    const matches = await matchUsers();
    const latestMatch = matches[matches.length - 1]; // Get the most recent match
    onMatch(latestMatch);
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
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
        required
      >
        <option value="">Are you an Introvert or Extrovert?</option>
        <option value="Introvert">Introvert</option>
        <option value="Extrovert">Extrovert</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

// Main SurveyPage Component
export const SurveyPage = () => {
  const [match, setMatch] = useState(null); // Use state to store the latest match

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
