import "../../styles/planner.css";

interface cardProps {
    title: string;
    description: string;
    answer: string;
    updateAnswer: (newAnswer: string) => void;
    imageurl: string;
    checked: boolean;
    toggleChecked: (checked: boolean) => void;
}

export default function Card({title, description, answer, updateAnswer, imageurl, checked, toggleChecked}: cardProps) {

    return (
        <div className="planning-card">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-400 mb-2">{description}</p>
            <textarea
                value={answer}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-1 mb-2 border rounded"
            />
            <img src={imageurl} alt={title} />
            <input type="checkbox" checked={checked} onChange={(e) => toggleChecked?.(e.target.checked)} />
        </div>
    );
}