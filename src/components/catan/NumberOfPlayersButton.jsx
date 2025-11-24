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
          style={{
            background: '#464647',
            color: 'white',
            border: '2px solid steelblue',
            borderRadius: '15px',
            padding: '10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: '0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'steelblue')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#464647')}
        >
          number of players
        </button>
      )}
      {isModalOpen && (
        <div className="number-of-players-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
            <div className="number-of-players-dialog"
              style={{
              background: '#464647',
              color: 'white',
              padding: '20px',
              borderRadius: '20px',
              textAlign: 'center',
              minWidth: '300px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Select Number of Players</h2>
            <select
              value={selectedPlayers}
              onChange={handleSelectChange}
              style={{
                background: '#464648',
                color: 'white',
                border: '2px solid steelblue',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '1.2rem',
                marginBottom: '20px',
                width: '100%',
              }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
            <button
              onClick={handleLetsPlay}
              style={{
                background: 'steelblue',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: '0.2s',
              }}
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
