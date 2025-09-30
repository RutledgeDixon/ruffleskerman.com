//word.tsx
//pseudocode:
/*
    - word
        - props: word, letters
        - word is made up of 5 letters
        - word is used in check.tsx
*/
import Letter from '@/components/wordle/letter';

export default function word({ word, letters }: { word: string; letters: { letter: string; status: 'correct' | 'present' | 'absent' | 'empty'; onClick: () => void; }[]; }) {
    
    
    return (
        <div>
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