import React, { forwardRef } from 'react';
import Card from '../Card/Card';
import './CategoryColumn.css';

const CategoryColumn = forwardRef(({ category, color, isActive, isCorrect, isIncorrect, placedCards = [] }, ref) => {
  let stateClass = '';
  if (isActive) stateClass = 'active';
  if (isCorrect) stateClass = 'correct';
  if (isIncorrect) stateClass = 'incorrect';

  return (
    <div className={`category-column ${stateClass}`} ref={ref}>
      <div 
        className="column-header" 
        style={{ '--header-color': color }}
      >
        <span>{category}</span>
        <div className="card-count">{placedCards.length}/4</div>
      </div>
      
      <div className="column-stack">
        <div className="empty-slot" style={{ borderColor: color }}></div>
        {placedCards.map((card, index) => (
          <Card 
            key={card.id} 
            card={card} 
            isStacked={true} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
});

export default CategoryColumn;
