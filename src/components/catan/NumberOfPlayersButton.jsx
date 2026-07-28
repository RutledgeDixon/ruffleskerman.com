// ...existing code...
import React, { useState } from 'react';

const NumberOfPlayersButton = ({ onChange, floating = false, count }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState(count ?? 4);

  // keep internal selectedPlayers in sync if parent provides a controlled count
  React.useEffect(() => {
    if (typeof count === 'number' && count !== selectedPlayers) {
      setSelectedPlayers(count);
    }
  }, [count]);

  const handleSelectChange = (e) => {
    setSelectedPlayers(parseInt(e.target.value));
  };

  const handleLetsPlay = () => {
    window.dispatchEvent(new CustomEvent('updatePlayers', { detail: selectedPlayers }));
    setIsModalOpen(false);
    onChange(selectedPlayers);
  };

  return (
    <>
      {floating ? (
        <button
          className="floating-players-btn"
          onClick={() => setIsModalOpen(true)}
          aria-label="Number of players"
        >
          {'ꆜ'}
        </button>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="number-of-players-trigger-btn"
        >
          number of players
        </button>
      )}
      {isModalOpen && (
        <div className="number-of-players-modal"
          onClick={() => setIsModalOpen(false)}
        >
            <div className="number-of-players-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Select Number of Players</h2>
            <select
              className="number-of-players-select"
              value={selectedPlayers}
              onChange={handleSelectChange}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
            <button
              className="number-of-players-confirm-btn"
              onClick={handleLetsPlay}
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NumberOfPlayersButton;
