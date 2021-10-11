import React, { useEffect, useState } from "react";


import './WordRace.css';

import { useHttpClient } from '../hooks/http-hook';

import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';

const WordRace = props => {

  const [loadedScore, setLoadedScore] = useState();
  const [loadedGamesPlayed, setLoadedGamesPlayed] = useState();
  const [loadedAvScore, setLoadedAvScore] = useState();
  const [loadedMaxLevel, setLoadedMaxLevel] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/score"
        );
        setLoadedScore(responseData.scores.slice(0, 10));
        setLoadedGamesPlayed(responseData.gamesPlayed);
        setLoadedAvScore(responseData.averageScore);
        setLoadedMaxLevel(responseData.maxLevel);
      } catch (err) { }
    };
    fetchScore();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="top-bar">
        <h3>Welcome To Word Race</h3>
      </div>

      {/* Top score */}
      <table id="top-score">
        <thead>
          <tr>
            <th>Top Ten Score</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && loadedScore && loadedScore.map(score => (
            <tr key={score._id}>
              <td>{score.player.username}: {score.finalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* statistics */}
      <table id="stastics">
        <thead>
          <tr>
            <th>Brief Statistics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Games Played: {!isLoading && loadedGamesPlayed ? (loadedGamesPlayed) : ''}</td>
          </tr>

          <tr>
            <td>Average Score: {!isLoading && loadedAvScore ? (loadedAvScore) : ''}</td>
          </tr>

          <tr>
            <td>Max Level Reached: {!isLoading && loadedMaxLevel ? (loadedMaxLevel) : ''}</td>
          </tr>
        </tbody>
      </table>

      {props.children}



      <div className="bottom-bar">
        <h4>Improve your QWERTY typing.</h4>
      </div>
    </React.Fragment>
  );
};

export default WordRace;
