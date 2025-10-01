//word.tsx
//pseudocode:
/*
    - word
        - props: word, letters
        - word is made up of 5 letters
        - word is used in check.tsx
*/
import Letter from '@/components/wordle/letter';
import '@/styles/wordle.css';

export default function word({ word }: { word: string; }) {
    
    let letters = Array.from({ length: 5 }, (_, i) => {
        return {
            letter: word[i] ? word[i].toUpperCase() : '',
            status: 'empty' as 'correct' | 'present' | 'absent' | 'empty',
            onClick: () => { 
                // TODO: Handle letter click!!!!
                console.log(`Letter ${i} clicked`); 
            }
        };
    });
    
    return (
        <div
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
                    onClick={letter.onClick}
                />
            ))}
        </div>
    );
}