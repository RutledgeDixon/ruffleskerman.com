import "../../styles/planner.css";

interface cardProps {
    title: string;
    description: string;
    answer: string;
    imageurl: string;
    checked: boolean;
    toggleChecked: (checked: boolean) => void;
}

export default function Card({title, description, answer, imageurl, checked, toggleChecked}: cardProps) {

    return (
        <div className="planning-card">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-400">{description}</p>
            <p>{answer}</p>
            <img src={imageurl} alt={title} />
            <input type="checkbox" checked={checked} onChange={(e) => toggleChecked?.(e.target.checked)} />
        </div>
    );
}