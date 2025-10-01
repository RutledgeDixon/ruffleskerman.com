//word.tsx
//pseudocode:
/*
    - word
        - props: word, letters
        - word is made up of 5 letters
        - word is used in check.tsx
*/
import { useState, useEffect } from 'react';
import Letter from '@/components/wordle/letter';
import '@/styles/wordle.css';

export default function word({ word }: { word: string; }) {

    const [letters, setLetters] = useState(() =>
        Array.from({ length: 5 }, (_, i) => {
            return {
                letter: word[i] ? word[i].toUpperCase() : '♫',
                status: 'absent' as 'correct' | 'present' | 'absent',
                onClick: () => {}
            };
        })
    );

    //useEffect to sync letters when word prop changes
    useEffect(() => {
        setLetters(prevLetters =>
            prevLetters.map((letter, i) => ({
                ...letter,
                letter: word[i] ? word[i].toUpperCase() : '♫',
                status: 'absent'
            }))
        );
    }, [word]);

    // updates letter status of letter i to the next status
    const handleLetterClick = (index: number) => {
        const statusOrder = ['absent', 'present', 'correct'] as const;
        setLetters(prevLetters =>
            prevLetters.map((letter, i) =>
                i === index
                    ? { ...letter, status: statusOrder[(statusOrder.indexOf(letter.status) + 1) % statusOrder.length] }
                    : letter
            )
        );

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