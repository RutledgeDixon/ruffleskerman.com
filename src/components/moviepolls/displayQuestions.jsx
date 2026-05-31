import { useState, useEffect } from "react";
import Card from "./question.jsx";

export default function DisplayQuestions({ questions, saveQuestions }) {
    if (!questions) {
        return <div>Pick a movie to view the poll.</div>;
    }
    if (questions.length === 0) {
        return <div>No poll questions for this movie.</div>;
    }

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

    const [savedCard, setSavedCard] = useState(questions.map(() => true));
    const [answers, setAnswers] = useState(
        questions.map((question) => sanitizeAnswerForInput(question.answer))
    );

    useEffect(() => {
        setSavedCard(questions.map(() => true));
        setAnswers(questions.map((question) => sanitizeAnswerForInput(question.answer)));
    }, [questions]);

    const updateAnswer = (cardIndex, newAnswer) => {
        if (newAnswer === "") {
            const newAnswers = [...answers];
            newAnswers[cardIndex] = "";
            setAnswers(newAnswers);
            setSavedCard(prevSaved => {
                const newSaved = [...prevSaved];
                newSaved[cardIndex] = false;
                return newSaved;
            });
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
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    const saveCard = async (cardIndex) => {
        const hasNumericAnswer =
            answers[cardIndex] !== "" &&
            answers[cardIndex] != null &&
            typeof answers[cardIndex] !== 'boolean' &&
            !Number.isNaN(Number(answers[cardIndex]));

        const newQuestions = questions.map((question, idx) =>
            idx === cardIndex
                ? {
                    ...question,
                    answer: answers[idx],
                    checked: hasNumericAnswer
                }
                : question
        );
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = true;
            return newSaved;
        });
        await saveQuestions(newQuestions);
    }

    return (
        <div className="cards-display">
            {questions.map((question, cardIndex) => (
                <Card
                    key={cardIndex}
                    title={question.title}
                    description={question.description}
                    answer={answers[cardIndex]}
                    updateAnswer={(newAnswer) => updateAnswer(cardIndex, newAnswer)}
                    saveFunc={() => saveCard(cardIndex)}
                    saved={savedCard[cardIndex]}
                />
            ))}
        </div>
    )
}
