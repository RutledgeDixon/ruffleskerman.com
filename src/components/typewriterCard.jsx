import { useState, useEffect } from "react";

export default function typewriterCard({ id, title, text, start = true, onRemove }) {
    const [dTitle, setDTitle] = useState("");
    const [titleFinished, setTitleFinished] = useState(false);
    const [dText, setDText] = useState("");

    // useEffect to start typing the title
    useEffect(() => {
        if (!start || !title) return;
        if (dTitle.length < title.length) {
            const timer = setTimeout(() => {
                setDTitle(title.slice(0, dTitle.length + 1));
            }, 100);
            return () => clearTimeout(timer);
        } else if (dTitle.length === title.length) {
            setTitleFinished(true);
        }
    }, [dTitle, title, start]);

    // useEffect to start typing the text after the title is finished
    useEffect(() => {
        if (!titleFinished || !text) return;
        if (dText.length < text.length) {
            const timer = setTimeout(() => {
                setDText(text.slice(0, dText.length + 1));
            }, 70);
            return () => clearTimeout(timer);
        }
    }, [dText, text, titleFinished]);

    return (
        <div className="typewriter-card" aria-live="polite">
            <button
                type="button"
                className="close-btn"
                aria-label="Close"
                onClick={() => onRemove && onRemove(id)}
            >
                ×
            </button>
            <h3>{dTitle}</h3>
            <p>{dText}</p>
        </div>
    );
}