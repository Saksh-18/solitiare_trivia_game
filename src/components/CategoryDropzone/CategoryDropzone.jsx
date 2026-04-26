import React, { forwardRef } from 'react';
import './CategoryDropzone.css';

const CategoryDropzone = forwardRef(({ category, color, isActive, isCorrect, isIncorrect }, ref) => {
  let stateClass = '';
  if (isActive) stateClass = 'active';
  if (isCorrect) stateClass = 'correct';
  if (isIncorrect) stateClass = 'incorrect';

  return (
    <div 
      ref={ref}
      className={`category-dropzone ${stateClass}`}
      style={{ '--category-color': color }}
    >
      <div className="category-label">{category}</div>
    </div>
  );
});

export default CategoryDropzone;
