//check.jsx
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

// TODO
// limit past guesses to five

import { useState, useEffect } from 'react';
import Word from '@/components/wordle/word.jsx';
import '@/styles/wordle.css';

export default function Check({ wordList: initialWordList }) {
    const [guess, setGuess] = useState('');
    
    const [possibleWords, setPossibleWords] = useState([]);
    const [wordList, setWordList] = useState(initialWordList || []);
    const [letters, setLetters] = useState(() =>
        Array.from({ length: 5 }, (_, i) => ({
            letter: '',
            status: 'absent'
        }))
    );
    const [pastGuesses, setPastGuesses] = useState([]);

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

        const filterWithGreen = (wordList) => {
            return wordList.filter(word => {
                return letters.every((letter, index) => {
                    if (letter.status === 'correct') {
                        return word[index] === letter.letter;
                    }
                    return true;
                });
            });
        };

        const filterWithYellow = (wordList) => {
            return wordList.filter(word => {
                return letters.every((letter, index) => {
                    if(letter.status === 'present'){
                        return word.includes(letter.letter) && word[index] !== letter.letter;
                    }
                    return true;
                });
            });
        }

        const getAllowedLetterCounts = () => {
            const counts = {};
            letters.forEach((l) => {
                if (l.status === 'correct' || l.status === 'present') {
                    counts[l.letter] = (counts[l.letter] || 0) + 1;
                }
            });
            return counts;
        };
        const filterWithGray = (wordList) => {
            const allowedCounts = getAllowedLetterCounts();
            return wordList.filter(word => {
                let valid = true;
                letters.forEach((letter, index) => {
                    if (letter.status === 'absent' && letter.letter) {
                        const allowed = allowedCounts[letter.letter] || 0;
                        const actual = word.split('').filter(l => l === letter.letter).length;
                        if (actual > allowed) {
                            valid = false;
                        }
                    }
                });
                letters.forEach((letter, index) => {
                    if (letter.status === 'absent' && word[index] === letter.letter) {
                        valid = false;
                    }
                });
                return valid;
            });
        }

        const handleCheck = () => {
            let filtered = filterWithGreen(wordList);
            filtered = filterWithYellow(filtered);
            filtered = filterWithGray(filtered);
            setPossibleWords(filtered);
            setPastGuesses([...pastGuesses, { letters }]);
            setGuess('');
            setLetters(prevLetters =>
                prevLetters.map(letter => ({
                    ...letter,
                    letter: '',
                    status: 'absent'
                }))
            );
            setWordList(filtered);
        }

        const handleClear = () => {
            setGuess('');
            setPossibleWords([]);
            setLetters(prevLetters =>
                prevLetters.map(letter => ({
                    ...letter,
                    letter: '',
                    status: 'absent'
                }))
            );
            setPastGuesses([]);
            setWordList(initialWordList || []);
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
                {pastGuesses.length > 0 && (
                    pastGuesses.map((pastGuess, index) => (
                        <Word key={index} letters={pastGuess.letters} setLetters={setLetters} past={true} />
                    ))
                )}
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
