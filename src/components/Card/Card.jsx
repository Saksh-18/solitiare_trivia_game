import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

export default function Card({ card, onDrag, onDragEnd, isStacked, index }) {
  if (!card) return null;

  const stackOffset = isStacked ? index * 30 : 0;

  return (
    <motion.div
      className={`card ${isStacked ? 'stacked' : 'active-card'}`}
      drag={!isStacked}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={isStacked ? 0 : 1}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      whileDrag={!isStacked ? { scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', zIndex: 100 } : {}}
      layoutId={`card-${card.id}`}
      initial={isStacked ? { opacity: 0, y: stackOffset - 20 } : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: stackOffset }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ zIndex: isStacked ? index : 50 }}
    >
      <div className="card-content">
        <div className="card-text">{card.text}</div>
      </div>
    </motion.div>
  );
}
