import React, { useState, useRef, useEffect } from 'react';

const diceNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];

export default function DiceRollButton({ onRoll }) {
  const [open, setOpen] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleChoose = (num) => {
    setLastRoll(num);
    setOpen(false);
    if (onRoll) onRoll(num);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <div ref={containerRef} className="floating-dice-container" aria-hidden={false}>
      <button className={`floating-dice-btn ${open ? 'open' : ''}`} onClick={handleToggle} aria-label="Dice rolls">
        <div className="dice-display">
          {lastRoll ? lastRoll : '🎲'}
        </div>
      </button>

      {open && (
        <div className="floating-dice-popup">
          {diceNumbers.map((n) => (
            <button
              key={n}
              className="floating-dice-option"
              onClick={() => handleChoose(n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
