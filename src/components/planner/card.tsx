import "../../styles/planner.css";
import { Button } from "@/components/ui/button";

interface cardProps {
    title: string;
    description: string;
    answer: string;
    updateAnswer: (newAnswer: string) => void;
    imageurl?: string;
    url?: string;
    checked: boolean;
    toggleChecked: (checked: boolean) => void;
    saved: boolean;
    saveFunc: () => void;
}

export default function Card({title, description, answer, updateAnswer, imageurl, url, checked, toggleChecked, saved, saveFunc}: cardProps) {

    return (
        <div className="planning-card">
            <div className="planning-card-top">
                <div>
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-gray-400 mb-2">{description}</p>
                </div>
                {!saved && <Button variant="letu" className="px-4 py-2 text-sm" onClick={() => saveFunc()}>Save</Button>}
            </div>
            <textarea
                value={answer}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-1 mb-2 border rounded"
            />
            {imageurl && imageurl !== "" && <img src={imageurl} alt={title} />}
            <div className = "planning-card-top">
                <div>
                    {url && url !== "" && <a href={url} target="_blank" rel="noopener noreferrer">Link</a>}
                </div>
                <input type="checkbox" checked={checked} onChange={(e) => toggleChecked?.(e.target.checked)} />
            </div>
        </div>
    );
}