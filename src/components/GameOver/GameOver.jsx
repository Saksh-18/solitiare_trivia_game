import React from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import './GameOver.css';

export default function GameOver({ isVictory, level, coinsEarned, totalCoins, onRestart, onNextLevel }) {
  return (
    <div className={`game-over ${isVictory ? 'victory' : 'loss'}`}>
      <h2>{isVictory ? 'Level Complete!' : 'Out of Moves!'}</h2>
      
      {isVictory ? (
        <div className="final-score">
          You passed <strong>Level {level}</strong>
          <div className="reward-box">
             <span>+{coinsEarned} Coins</span>
          </div>
        </div>
      ) : (
        <div className="final-score">
          Level {level} Failed. 
        </div>
      )}

      <div className="total-coins">
        Total Coins: <span>{totalCoins}</span>
      </div>
      
      {isVictory ? (
        <button className="restart-btn victory-btn" onClick={onNextLevel}>
          Next Level
          <ArrowRight size={20} />
        </button>
      ) : (
        <button className="restart-btn" onClick={onRestart}>
          <RefreshCw size={20} />
          Try Again
        </button>
      )}
    </div>
  );
}
