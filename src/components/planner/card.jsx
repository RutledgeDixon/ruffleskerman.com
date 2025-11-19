import "@/styles/planner.css";
import { Button } from "@/components/ui/button";

export default function Card({title, description, answer, updateAnswer, imageurl, url, updateUrl, checked, toggleChecked, saved, saveFunc}) {
    //Everything is only editable if the checkbox is not checked
    return (
        <div className="planning-card">
            <div className="planning-card-top">
                <div>
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-gray-400 mb-2">{description}</p>
                </div>
                {!saved && !checked && <Button type="button" variant="letu" className="px-4 py-2 text-sm self-start" onClick={(e) => { e.preventDefault(); saveFunc(); }}>Save</Button>}
            </div>
            <textarea
                value={answer}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-1 mb-2 border rounded"
                //max characters is 255
                maxLength={255}
                disabled={checked}
            />
            {imageurl && imageurl !== "" && <img src={imageurl} alt={title} />}
            <div className="planning-card-top">
                <div>
                    <input
                        className="url-input"
                        type="url"
                        value={url}
                        onChange={(e) => updateUrl(e.target.value)}
                        placeholder="Enter URL here"
                        disabled={checked}
                    />
                    {url && url !== "" && <a href={url} target="_blank" rel="noopener noreferrer">Visit site</a>}
                </div>
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => toggleChecked?.(e.target.checked)}
                className="planning-card-checkbox"
            />
        </div>
    );
}
