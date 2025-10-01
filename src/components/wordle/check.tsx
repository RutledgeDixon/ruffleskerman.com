//check.tsx
//pseudocode:
/*
 - check
    - props: guess, word list
    - input for a word
    - checks letter statuses and provides possible words from word list
    - displays possible words
    - button for checking for words
    - button for clearing input and possible words
    - FOR FUTURE: have six tries, each try building on the list of letter statuses
*/
import { useState, useEffect } from 'react';
import Word from '@/components/wordle/word';
import '@/styles/wordle.css';

export default function Check({ wordList }: { wordList: string[]; }) {
    const [guess, setGuess] = useState('');
    const [possibleWords, setPossibleWords] = useState<string[]>([]);

    const handleCheck = () => {
        //TODO: implement logic to filter wordList based on guess and letter statuses
        // For now, just log the guess
        console.log('Check button clicked with guess:', guess);
    }

    const handleClear = () => {
        setGuess('');
        setPossibleWords([]);
    }

    return (
        <div>
            <h2>Wordle Helper</h2>
            <input 
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                maxLength={5}
            />
            <Word word={guess.padEnd(5, ' ')}></Word>
            <div>
                <button onClick={handleCheck}>Check</button>
                <button onClick={handleClear}>Clear</button>
            </div>
            <div>
                <h3>Possible Words:</h3>
                <ul>
                    {possibleWords.map((word, index) => <li key={index}>{word}</li>)}
                </ul>
            </div>
        </div>
    );
}