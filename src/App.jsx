import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cardData, categories } from './data/cards';
import { shuffleArray, validateDrop } from './utils/gameLogic';
import Card from './components/Card/Card';
import CategoryColumn from './components/CategoryColumn/CategoryColumn';
import GameOver from './components/GameOver/GameOver';
import { Coins } from 'lucide-react';
import './App.css';

function App() {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [moves, setMoves] = useState(0); 
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'victory', 'loss'
  
  const [placedCards, setPlacedCards] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropFeedback, setDropFeedback] = useState(null); 
  
  const dropzoneRefs = useRef({});

  useEffect(() => {
    startGame();
  }, []);

  const startGame = (isNextLevel = false) => {
    // Generate a shuffled deck
    const newDeck = shuffleArray(cardData);
    setDeck(newDeck);
    setCurrentIndex(0);
    
    // Set dynamic move limit based on level/deck
    const moveLimit = Math.floor(newDeck.length * 1.85); // roughly ~29 for 16 cards
    setMoves(moveLimit);
    
    if (isNextLevel) {
      setLevel(l => l + 1);
    } else {
      setLevel(1);
      setCoins(0);
    }

    setPlacedCards({
      Animals: [],
      Programming: [],
      Cities: [],
      Food: []
    });
    setGameStatus('playing');
    setDropFeedback(null);
  };

  const currentCard = deck[currentIndex];

  const checkHover = (point) => {
    let hovered = null;
    Object.keys(dropzoneRefs.current).forEach(key => {
      const el = dropzoneRefs.current[key];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
        ) {
          hovered = key;
        }
      }
    });
    return hovered;
  };

  const handleDrag = (event, info) => {
    const hovered = checkHover(info.point);
    if (activeCategory !== hovered) {
      setActiveCategory(hovered);
    }
  };

  const handleDragEnd = (event, info) => {
    const droppedCategory = checkHover(info.point);
    setActiveCategory(null);

    // If player didn't drop on a valid zone, do nothing
    if (!droppedCategory) return;

    // Decrement move on every placed attempt
    setMoves(m => m - 1);
    const movesLeft = moves - 1;

    const isCorrect = validateDrop(currentCard, droppedCategory);
    
    setDropFeedback({
      category: droppedCategory,
      status: isCorrect ? 'correct' : 'incorrect'
    });

    if (isCorrect) {
      if (navigator.vibrate) navigator.vibrate([20, 20, 20]);
      
      setPlacedCards(prev => ({
        ...prev,
        [droppedCategory]: [...(prev[droppedCategory] || []), currentCard]
      }));
    } else {
      if (navigator.vibrate) navigator.vibrate(150);
    }

    setTimeout(() => {
      setDropFeedback(null);
      
      if (isCorrect && currentIndex === deck.length - 1) {
         // Finished the deck completely!
         setCoins(c => c + 30);
         setGameStatus('victory');
      } else if (movesLeft <= 0) {
         // Out of moves
         setGameStatus('loss');
      } else if (isCorrect) {
         // Correct, has moves left, go to next card
         setCurrentIndex(i => i + 1);
      }
      // If incorrect, stay on current card to try again
    }, 500);
  };

  return (
    <div className="game-container">
      <header className="solitaire-header">
         <div className="header-stat">
           <div className="stat-label">Moves</div>
           <div className={`stat-value ${moves <= 5 ? 'danger-text' : ''}`}>{moves}</div>
         </div>
         
         <div className="header-center">
            <h1 className="game-title">Trivia Sort</h1>
            <div className="level-badge">Level {level}</div>
         </div>

         <div className="header-stat score-stat">
           <Coins size={16} className="stat-icon" />
           <div className="stat-value">{coins}</div>
         </div>
      </header>

      <main className="game-main">
        {gameStatus !== 'playing' ? (
          <div className="centered-overlay">
            <GameOver 
              isVictory={gameStatus === 'victory'} 
              level={level}
              coinsEarned={30}
              totalCoins={coins} 
              onRestart={() => startGame(false)} 
              onNextLevel={() => startGame(true)}
            />
          </div>
        ) : (
          <div className="play-area">
            <div className="columns-grid">
              {categories.map(cat => (
                <CategoryColumn
                  key={cat.id}
                  ref={el => dropzoneRefs.current[cat.id] = el}
                  category={cat.label}
                  color={cat.color}
                  placedCards={placedCards[cat.id] || []}
                  isActive={activeCategory === cat.id}
                  isCorrect={dropFeedback?.category === cat.id && dropFeedback?.status === 'correct'}
                  isIncorrect={dropFeedback?.category === cat.id && dropFeedback?.status === 'incorrect'}
                />
              ))}
            </div>

            <div className="draw-pile-area">
              <div className="deck-info">
                 Cards Left: {deck.length - currentIndex}
              </div>
              <div className="draw-pile-slot-wrapper">
                  <div className="draw-pile-slot">
                    {currentIndex < deck.length - 1 && (
                      <div className="deck-shadow" />
                    )}
                    <AnimatePresence mode="wait">
                      {currentCard && !dropFeedback && (
                        <Card
                          key={currentCard.id}
                          card={currentCard}
                          isStacked={false}
                          onDrag={handleDrag}
                          onDragEnd={handleDragEnd}
                        />
                      )}
                    </AnimatePresence>
                  </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
