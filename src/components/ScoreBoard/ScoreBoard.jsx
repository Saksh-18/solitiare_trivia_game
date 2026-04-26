import React from 'react';
import './ScoreBoard.css';

export default function ScoreBoard({ score, currentCardIndex, totalCards }) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="label">Score</span>
        <span className="value">{score}</span>
      </div>
      <div className="score-item">
        <span className="label">Card</span>
        <span className="value">{currentCardIndex + 1} / {totalCards}</span>
      </div>
    </div>
  );
}
