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

export default function Check({ wordList: initialWordList }: { wordList: string[]; }) {
    const [guess, setGuess] = useState('');
    const [possibleWords, setPossibleWords] = useState<string[]>([]);
    const [wordList, setWordList] = useState<string[]>(initialWordList || []);
    const [letters, setLetters] = useState(() =>
        Array.from({ length: 5 }, (_, i) => ({
            letter: '',
            status: 'absent' as 'correct' | 'present' | 'absent'
        }))
    );

    // Load wordList if not provided
    useEffect(() => {
        if (wordList.length === 0) {
            fetch('/materials/wordleList.txt')
                .then(response => response.text())
                .then(text => {
                    const list = text.trim().split('\n').map(word => word.trim().toUpperCase());
                    setWordList(list);
                })
                .catch(err => console.error('Failed to load wordList:', err));
        }
    }, [wordList.length]);

    // Sync letters with guess
    useEffect(() => {
        setLetters(prevLetters =>
            prevLetters.map((letter, i) => ({
                ...letter,
                letter: guess[i] || ''
            }))
        );
    }, [guess]);

    //function that checks if all green letters are in the correct position
    //inputs: guess (with statuses), wordList
    //outputs: filtered wordList
    const filterWithGreen = (wordList: string[]) => {
        return wordList.filter(word => {
            // Check that all 'correct' letters match their positions
            return letters.every((letter, index) => {
                if (letter.status === 'correct') {
                    return word[index] === letter.letter;
                }
                return true; // If not correct, no restriction
            });
        });
    };

    //function that checks if all yellow letters are present but not in that position
    //inputs: guess (with statuses), wordList
    //outputs: filtered wordList
    const filterWithYellow = (wordList: string[]) => {
        return wordList.filter(word => {
            return letters.every((letter, index) => {
                if(letter.status === 'present'){
                    return word.includes(letter.letter) && word[index] !== letter.letter;
                }
                return true;
            });
        });
    }

    const handleCheck = () => {
        console.log('letters:', letters);
        console.log('wordList length:', wordList.length);
        
        // Filter the wordList based on green letters
        let filtered = filterWithGreen(wordList);
        filtered = filterWithYellow(filtered);

        console.log('filtered length:', filtered.length);
        setPossibleWords(filtered);
    }

    const handleClear = () => {
        setGuess('');
        setPossibleWords([]);
        setLetters(prevLetters =>
            prevLetters.map(letter => ({
                ...letter,
                letter: '',
                status: 'absent' as 'correct' | 'present' | 'absent'
            }))
        );
    }

    return (
        <div>
            <h2>Wordle Bot</h2>
            <input 
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                maxLength={5}
            />
            <Word letters={letters} setLetters={setLetters}></Word>
            <div>
                <button className="check-button" onClick={handleCheck}>Check</button>
                <button className="clear-button" onClick={handleClear}>Clear</button>
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