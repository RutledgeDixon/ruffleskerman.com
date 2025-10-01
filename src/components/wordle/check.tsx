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

// TODO
// limit past guesses to five

import { useState, useEffect } from 'react';
import Word from '@/components/wordle/word';
import '@/styles/wordle.css';
import { set } from 'astro:schema';

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
    const [pastGuesses, setPastGuesses] = useState<{ letters: { letter: string; status: 'correct' | 'present' | 'absent' }[]; }[]>([]);

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
                return true; // If the letter isn't green we don't care
            });
        });
    };

    //function that checks if all yellow letters are present but not in that position
    const filterWithYellow = (wordList: string[]) => {
        return wordList.filter(word => {
            return letters.every((letter, index) => {
                if(letter.status === 'present'){
                    return word.includes(letter.letter) && word[index] !== letter.letter;
                }
                return true; // If the letter isn't yellow we don't care
            });
        });
    }

    // function that filters out words containing gray letters
    // if the gray letter is also present in green or yellow, it's fine
    // (this is because if an 'a' is green, another 'a' can be gray which means
    //  the first 'a' is good but there are no more 'a's)
    // CURRENT PROBLEM: if there is a green 'o' and a gray 'o', it will still provide
    //                  words with more 'o's than allowed
    // POSSIBLE SOLUTION: count the number of each letter in green/yellow and make sure
    //                   the word doesn't have more than that number of that letter
    const getAllowedLetterCounts = () => {
        const counts: Record<string, number> = {};
        letters.forEach((l) => {
            if (l.status === 'correct' || l.status === 'present') {
                counts[l.letter] = (counts[l.letter] || 0) + 1;
            }
        });
        return counts;
    };
    // filter words that contain gray letters, with one caveat
    // if a letter appears multiple times and one of them is gray, the others are allowed
    const filterWithGray = (wordList: string[]) => {
        const allowedCounts = getAllowedLetterCounts();
        return wordList.filter(word => {
            // For each letter marked 'absent', check if word contains more than allowed
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
            // filter out words with a gray letter in the same position
            letters.forEach((letter, index) => {
                if (letter.status === 'absent' && word[index] === letter.letter) {
                    valid = false;
                }
            });
            return valid;
        });
    }
    // const filterWithGray = (wordList: string[]) => {
    //     return wordList.filter(word => {
            
    //         return letters.every((letter, index) => {
    //             if(letter.status === 'absent'){
    //                 const wordIndex = word.indexOf(letter.letter);
    //                 const letterIndex = letters.find(l => l.letter === word[wordIndex]);
    //                 // if wordIndex is -1 return true
    //                 // if wordIndex is >-1 but that letter in letters is green or yellow return true
    //                 return (wordIndex === -1) ||
    //                         (wordIndex !== -1 && (letterIndex?.status === 'present' || letterIndex?.status === 'correct'));
    //             }
    //             return true; // If the letter isn't gray we don't care
    //         });
    //     });
    // }

    // Takes the letters and the wordlist,
    // updates possibleWords by filtering using Wordle rules
    const handleCheck = () => {
        console.log('letters:', letters);
        console.log('wordList length:', wordList.length);
        
        // Filter the wordList based on green letters
        let filtered = filterWithGreen(wordList);
        filtered = filterWithYellow(filtered);
        filtered = filterWithGray(filtered);
        console.log('filtered length:', filtered.length);

        //set the possible words to the filtered list
        setPossibleWords(filtered);

        // add current guess to past guess
        setPastGuesses([...pastGuesses, { letters }]);
        // clear current guess and letters
        setGuess('');
        setLetters(prevLetters =>
            prevLetters.map(letter => ({
                ...letter,
                letter: '',
                status: 'absent' as 'correct' | 'present' | 'absent'
            }))
        );
        // set wordList to filtered list
        setWordList(filtered);
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
                    // setLetters isn't used for these, so to pacify the code just pass in normal setLetters
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