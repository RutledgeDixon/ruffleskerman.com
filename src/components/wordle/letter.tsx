//letter.tsx
//pseudocode:
/*
 - letter
    - props: letter, status (correct, present, absent)
    - color of letter based on status
    - clicking letter changes from gray to yellow to green to gray etc.
    - animation? when letter changes color - optional
    - 5 letters are used for word
*/

export default function Letter({ letter, status, onClick }: { letter: string; status: 'correct' | 'present' | 'absent'; onClick: () => void; }) {
    let backgroundColor;
    
    switch (status) {
        case 'correct':
            backgroundColor = 'green';
            break;
        case 'present':
            backgroundColor = 'goldenrod';
            break;
        case 'absent':
            backgroundColor = 'lightgray';
            break;
        default:
            backgroundColor = 'red'; //red for debugging, change to lightgray once finished
            break;
    }

    return (
        <div>
            <button 
                style={{ backgroundColor }} 
                onClick={onClick}
            >
                {letter}
            </button>
        </div>
    );
}