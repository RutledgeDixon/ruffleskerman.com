import { useState, useEffect } from "react";
import Card from "./question.jsx";
import { Button } from "@/components/ui/button";

const sanitizeAnswerForInput = (value) => {
    if (value === "" || value == null || typeof value === 'boolean') {
        return "";
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 10) {
        return "";
    }

    return Math.round(numericValue);
};

export default function DisplayQuestions({ questions, saveQuestions, isSaving }) {
    // Hooks must run on every render, so seed them from a safe fallback
    // instead of early-returning before they're called (Rules of Hooks).
    const safeQuestions = questions ?? [];
    const [answers, setAnswers] = useState(safeQuestions.map((question) => sanitizeAnswerForInput(question.answer)));
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setAnswers(safeQuestions.map((question) => sanitizeAnswerForInput(question.answer)));
        setIsDirty(false);
    }, [questions]);

    if (!questions) {
        return <div>Pick a movie to view the poll.</div>;
    }
    if (questions.length === 0) {
        return <div>No poll questions for this movie.</div>;
    }

    const updateAnswer = (cardIndex, newAnswer) => {
        if (newAnswer === "") {
            const newAnswers = [...answers];
            newAnswers[cardIndex] = "";
            setAnswers(newAnswers);
            setIsDirty(true);
            return;
        }

        const parsed = Number(newAnswer);
        if (Number.isNaN(parsed)) {
            return;
        }

        const boundedValue = Math.max(0, Math.min(10, Math.round(parsed)));
        const newAnswers = [...answers];
        newAnswers[cardIndex] = boundedValue;
        setAnswers(newAnswers);
        setIsDirty(true);
    }

    const handleSaveAll = async () => {
        const newQuestions = questions.map((question, idx) => {
            const hasNumericAnswer =
                answers[idx] !== "" &&
                answers[idx] != null &&
                typeof answers[idx] !== 'boolean' &&
                !Number.isNaN(Number(answers[idx]));

            return { ...question, answer: answers[idx], checked: hasNumericAnswer };
        });

        const ok = await saveQuestions(newQuestions);
        if (ok) {
            setIsDirty(false);
        }
    }

    return (
        <>
            <div className="cards-display">
                {questions.map((question, cardIndex) => (
                    <Card
                        key={cardIndex}
                        title={question.title}
                        description={question.description}
                        answer={answers[cardIndex]}
                        updateAnswer={(newAnswer) => updateAnswer(cardIndex, newAnswer)}
                    />
                ))}
            </div>
            {isDirty && (
                <Button
                    type="button"
                    variant="letu"
                    className="movie-save-button"
                    disabled={isSaving}
                    onClick={handleSaveAll}
                >
                    Save
                </Button>
            )}
        </>
    )
}
