import "@/styles/planner.css";
import { Button } from "@/components/ui/button";

export default function Card({title, description, answer, updateAnswer, saved, saveFunc}) {
    return (
        <div className="planning-card">
            <div className="planning-card-top">
                <div>
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-gray-400 mb-2">{description}</p>
                </div>
            </div>
            <input
                type="number"
                min="0"
                max="10"
                step="1"
                value={answer}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="0-10"
                className="w-full p-2 mb-2 border rounded"
            />
            <div className="planning-card-footer">
                {!saved ? (
                    <Button
                        type="button"
                        variant="letu"
                        className="px-4 py-2 text-sm"
                        onClick={(e) => { e.preventDefault(); saveFunc(); }}
                    >
                        Save
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
