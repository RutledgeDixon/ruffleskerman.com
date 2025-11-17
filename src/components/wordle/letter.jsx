//letter.jsx
//pseudocode:
/*
 - letter
    - props: letter, status (correct, present, absent)
    - color of letter based on status
    - clicking letter changes from gray to yellow to green to gray etc.
    - animation? when letter changes color - optional
    - 5 letters are used for word
*/

export default function Letter({ letter, status, onClick }) {
    return (
        <div>
            <button 
                className={`letter ${status}`}
                onClick={onClick}
            >
                {letter}
            </button>
        </div>
    );
}
