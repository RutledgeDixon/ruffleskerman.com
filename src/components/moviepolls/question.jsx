import "@/styles/planner.css";

export default function Card({title, description, answer, updateAnswer}) {
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
        </div>
    );
}
