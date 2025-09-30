import React, { useState } from 'react';

interface NumberOfPlayersButtonProps {
  onChange: (count: number) => void;
}

const NumberOfPlayersButton = ({ onChange }: NumberOfPlayersButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState(4);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayers(parseInt(e.target.value));
  };

  const handleLetsPlay = () => {
    window.dispatchEvent(new CustomEvent('updatePlayers', { detail: selectedPlayers }));
    setIsModalOpen(false);
    onChange(selectedPlayers);
  };

  return (
    <>
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

      {isModalOpen && (
        <div
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
          <div
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
              onMouseOver={(e) => (e.currentTarget.style.background = '#005a87')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'steelblue')}
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