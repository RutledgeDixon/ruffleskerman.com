import React from 'react';
import Letter from '@/components/wordle/letter.jsx';
import '@/styles/wordle.css';

export default function Word({ letters, setLetters, past = false }) {
    const handleLetterClick = (index) => {
        if (past) return;
        if (!letters[index].letter) return;
        const statusOrder = ['absent', 'present', 'correct'];
        setLetters(letters.map((letter, i) =>
            i === index
                ? { ...letter, status: statusOrder[(statusOrder.indexOf(letter.status) + 1) % statusOrder.length] }
                : letter
        ));
    }

    return (
        <div
            className="word-display"
            style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '5px' 
            }}>
            {letters.map((letter, index) => (
                <Letter
                    key={index}
                    letter={letter.letter}
                    status={letter.status}
                    onClick={() => handleLetterClick(index)}
                />
            ))}
        </div>
    );
}
