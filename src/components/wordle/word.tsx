//word.tsx
//pseudocode:
/*
    - word
        - props: word, letters
        - word is made up of 5 letters
        - word is used in check.tsx
*/
import React from 'react';
import Letter from '@/components/wordle/letter';
import '@/styles/wordle.css';

export default function Word({ letters, setLetters }: { letters: { letter: string; status: 'correct' | 'present' | 'absent' }[]; setLetters: (letters: { letter: string; status: 'correct' | 'present' | 'absent' }[]) => void; }) {

    // updates letter status of letter i to the next status
    const handleLetterClick = (index: number) => {
        if (!letters[index].letter) return; // Don't change status if no letter
        const statusOrder = ['absent', 'present', 'correct'] as const;
        setLetters(letters.map((letter, i) =>
            i === index
                ? { ...letter, status: statusOrder[(statusOrder.indexOf(letter.status) + 1) % statusOrder.length] }
                : letter
        ));

        console.log(`Letter ${index} status changed`);
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